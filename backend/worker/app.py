import boto3
import json
from music21 import *
import pandas as pd
from fractions import Fraction
import base64
import os
import csv
import math 
from botocore.exceptions import ClientError

# import requests

BUCKET_NAME = os.getenv("BUCKET_NAME")
QUEUE_URL = os.getenv("QUEUE_URL")
s3 = boto3.client('s3')
sqs = boto3.client('sqs')



def frac_to_decimal(fraction_str):
    if not Fraction(fraction_str):
        return fraction_str
    
    fraction = Fraction(fraction_str)
    decimal = float(fraction)
    return decimal


def get_user_score(filename):
    try:
        filepath = f'/tmp/{filename}'
        s3.download_file(BUCKET_NAME,filename,filepath)
    except ClientError as e:
        print(f"Error!!! {e}")
        raise Exception(f"Error occured! {e}")

def post_data_to_bucket(filepath,filename):
    s3 = boto3.client('s3')
    s3.upload_file(Filename=filepath, Bucket=BUCKET_NAME, Key=f"{filename}")


def produce_df_data(score_path,start_measure=1,end_measure=30):
# Load the score and extract the notes
    print('about to produce data')
    score = converter.parse(score_path)
    score = score.toSoundingPitch()
    print('created a score object\n')
    notes = []
    for part in score.parts.measures(start_measure,end_measure):
        instrument = part.getInstrument().instrumentName
        print(f'extracting data for {instrument}')
        for note in part.flat.notes:
            pitch_frequency = pitch.Pitch(note.nameWithOctave).frequency if hasattr(note, 'nameWithOctave') else math.nan
            acc_offset = frac_to_decimal(note.offset)
            notes.append({
                'pitch': pitch_frequency,
                'note': note.nameWithOctave if hasattr(note, 'nameWithOctave') else None,
                'duration': note.duration.quarterLength,
                'measure_number': str(note.measureNumber),
                'offset': acc_offset if pitch_frequency else math.nan,
                'time_signature': note.getContextByClass('TimeSignature').numerator,
                'dynamic': note.dynamic.level if hasattr(note, 'dynamic') else None,
                'articulation': note.articulations[0].name if note.articulations else None,
                'instrument': note.getInstrument().instrumentName
            })
    
    print('produced all notes!!!\n\n\nAbout to produce dataframe')
    df = pd.DataFrame(notes)
    
    return df
    

def generate_output_to_file(df,filename):

    try:
        tmp_file = f'/tmp/{filename}.csv'
        df.to_csv(path_or_buf=tmp_file, index=False)
        return tmp_file
    except:
        raise Exception("Cannot produce data properly")


def lambda_handler(event, context):
            
    handled_messages = list()

    try:
        api_message = ""
        statusCode = 0

        for message in event['Records']:
            handled_messages.append(message['receiptHandle'])
            receipt = message['receiptHandle']

            user_data = json.loads(message['body'])
            print(f"Handeling message {receipt}")

            filename = user_data['filename']
            print(f"filename is {filename}")
            df_jsoned={}


            start_measure=int(user_data['start_measure'])
            end_measure=int(user_data['end_measure'])

            print(f"from measure {start_measure} to measure {end_measure}")

            print("getting score from s3")
            get_user_score(filename)
            print("\nProcessing...\n")
            df = produce_df_data(f'/tmp/{filename}',start_measure,end_measure)
            print("writing output to local file")
            s3.delete_object(Bucket=BUCKET_NAME, Key=f"{filename}")
            filename = filename.split('.')[0]
            filepath = generate_output_to_file(df,filename)
            print(f"uploading {filepath} to s3")
            post_data_to_bucket(filepath,f"{filename}_processed.csv")
            if df_jsoned:
                api_message = "data produced successfully"
                statusCode=200
    except Exception as e: 
        api_message = f"!!! ERROR !!! {str(e)}"
    finally:
        for receipt in handled_messages:
            sqs.delete_message(QueueUrl=QUEUE_URL, ReceiptHandle=receipt)

    return {
        "statusCode": statusCode if statusCode else 500,
        "headers": {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },  
        "body": json.dumps({
            "message": api_message,
        }),
    }

