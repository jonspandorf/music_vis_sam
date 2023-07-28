import json
from music21 import *
import pandas as pd
from fractions import Fraction
import base64
import os
import csv

# import requests


def lambda_handler(event, context):


    def frac_to_decimal(fraction_str):
        if not Fraction(fraction_str):
            return fraction_str
        
        fraction = Fraction(fraction_str)
        decimal = float(fraction)
        return decimal


    def produce_df_data(score_path):
    # Load the score and extract the notes
        print('about to produce data')
        parser = converter.Converter()
        # score = parser.parseData(score_path)
        score = converter.parse(score_path)
        print('created a score object\n')
        notes = []
        for part in score.parts.measures(1,30):
            instrument = part.getInstrument().instrumentName
            print(f'extracting data for {instrument}')
            for note in part.flat.notes:
                p = pitch.Pitch(note.nameWithOctave).frequency if hasattr(note, 'nameWithOctave') else None
                acc_offset = frac_to_decimal(note.offset)
                notes.append({
                    'pitch': p,
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

        print(df.head())
        loc = print(df.iloc[0].values)
        print(f'succesfully finished df. {loc}')
        
        # return { 'message': 'data produced successfully!', 'data': output }
        os.remove('/tmp/myfile.mxl')
        return df
        
    with open('/tmp/myfile.mxl', 'wb') as f:
        f.write(base64.b64decode(event['body']))
        f.close()

    def generate_output(df):

        file_name = 'SessionFile_{}.{}'.format("myfile", "csv")
        tmp_file = f'/tmp/{file_name}'

        df.to_csv(path_or_buf=tmp_file, index=False)
        fieldnames = str(list(df.columns))
        csvfile = open(tmp_file, 'r')
        reader = csv.DictReader(csvfile)
        outJson = json.dumps( [ row for row in reader ] )

        csvfile.close()
        os.remove(f'/tmp/{file_name}')

        return outJson
    # file_data = base64.b64decode(event['body']) # Assuming the binary file data is present in 'body'
    message = ""
    statusCode = 200


    try:

        df = produce_df_data('/tmp/myfile.mxl')
        df_jsoned = generate_output(df)
        if df_jsoned:
            message = "data produced successfully"
        else:
            message = "problem producing data"
            statusCode = 400
    except Exception as e: 
        print(f"!!! ERROR !!! {str(e)}")
        statusCode = 500 
        message = str(e)
    return {
        "statusCode": statusCode,
        "headers": {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },  
        "body": json.dumps({
            "message": message,
            "data": df_jsoned
            # "location": ip.text.replace("\n", "")
        }),
    }

