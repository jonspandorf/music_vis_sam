import boto3
import json
from music21 import *
import pandas as pd
from fractions import Fraction
import base64
import os
import csv
import math 
# import requests

BUCKET_NAME = os.environ("BUCKET_NAME")
QUEUE_URL = os.environ("QUEUE_URL")

def frac_to_decimal(fraction_str):
    if not Fraction(fraction_str):
        return fraction_str
    
    fraction = Fraction(fraction_str)
    decimal = float(fraction)
    return decimal


def get_user_score(filename):
    s3 = boto3.client('s3')
    res = s3.get_objcet(Bucket=BUCKET_NAME,Key=filename)
    return res['Body'].read()

def post_data_to_bucket(data,filename):
    s3 = boto3.client('s3')
    s3.delete_object(Bucket=BUCKET_NAME, Key=filename)
    s3.upload_file(Filename=data, Bucket=BUCKET_NAME, Key=filename)


def write_to_tmp_file(filename,data):
    with open(f'/tmp/{filename}.mxl', 'wb') as f:
        f.write(base64.b64decode(data))
        f.close()



def produce_df_data(converter,score_path,start_measure=1,end_measure=30):
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
    
    os.remove('/tmp/myfile.mxl')
    return df
    

def generate_output(df,filename):

    try:
        filename = 'SessionFile_{}.{}'.format(filename, "csv")
        tmp_file = f'/tmp/{filename}'

        df.to_csv(path_or_buf=tmp_file, index=False)
        csvfile = open(tmp_file, 'r')
        reader = csv.DictReader(csvfile)
        jsoned = json.dumps( [ row for row in reader ] )

        csvfile.close()
        os.remove(f'/tmp/{filename}')

        return jsoned
    except:
        raise Exception("Cannot produce data properly")


def lambda_handler(event, context):
            
    handled_messages = list()

    try:
        api_message = ""
        statusCode=0

        for message in event['Records']:
            handled_messages.append(message['receiptHandle'])

            user_data = json.loads(message['body'])
            filename = user_data['filename']
            df_jsoned={}

            start_measure=int(user_data['start_measure'])
            end_measure=int(user_data['end_measure'])

            data = get_user_score(filename)
            write_to_tmp_file(filename,data)
            df = produce_df_data(f'/tmp/{filename}.mxl',start_measure,end_measure)
            df_jsoned = generate_output(df)
            post_data_to_bucket(df_jsoned,filename)
            if df_jsoned:
                api_message = "data produced successfully"
                statusCode=200
    except Exception as e: 
        api_message = f"!!! ERROR !!! {str(e)}"
    finally:
        sqs = boto3.client('sqs')
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

