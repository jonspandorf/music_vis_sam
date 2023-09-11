import json
from music21 import *
import pandas as pd
from fractions import Fraction
import base64
import os
import csv
import math 
# import requests


def lambda_handler(event, context):

    def frac_to_decimal(fraction_str):
        if not Fraction(fraction_str):
            return fraction_str
        
        fraction = Fraction(fraction_str)
        decimal = float(fraction)
        return decimal


    def write_to_tmp_file(data):
        with open('/tmp/myfile.mxl', 'wb') as f:
            f.write(base64.b64decode(data))
            f.close()


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
                    'offset': acc_offset,
                    'time_signature': note.getContextByClass('TimeSignature').numerator,
                    'dynamic': note.dynamic.level if hasattr(note, 'dynamic') else None,
                    'articulation': note.articulations[0].name if note.articulations else None,
                    'instrument': note.getInstrument().instrumentName
                })
        
        print('produced all notes!!!\n\n\nAbout to produce dataframe')
        df = pd.DataFrame(notes)
        
        os.remove('/tmp/myfile.mxl')
        return df
        

    def generate_output(df):

        try:
            file_name = 'SessionFile_{}.{}'.format("score_output", "csv")
            tmp_file = f'/tmp/{file_name}'

            df.to_csv(path_or_buf=tmp_file, index=False)
            csvfile = open(tmp_file, 'r')
            reader = csv.DictReader(csvfile)
            outJson = json.dumps( [ row for row in reader ] )

            csvfile.close()
            os.remove(f'/tmp/{file_name}')

            return outJson
        except:
            raise Exception("Cannot produce data properly")
            
    try:
        df_jsoned={}
        message = ""
        statusCode=0
        start_measure=int(event['queryStringParameters']['startMeasure'])
        end_measure=int(event['queryStringParameters']['endMeasure'])
        if end_measure - start_measure > 30:
            statusCode = 400
            raise Exception("Service is currently limited for 30 measures")
        write_to_tmp_file(event['body'])
        df = produce_df_data('/tmp/myfile.mxl',start_measure,end_measure)
        df_jsoned = generate_output(df)
        if df_jsoned:
            message = "data produced successfully"
            statusCode=200
    except Exception as e: 
        print(f"!!! ERROR !!! {str(e)}")
        message = str(e)
    return {
        "statusCode": statusCode if statusCode else 500,
        "headers": {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },  
        "body": json.dumps({
            "message": message,
            "data": df_jsoned
        }),
    }

