import json 
import csv
import boto3
import os 
from botocore.exceptions import ClientError

s3 = boto3.client('s3')

def get_processed_data(filename):
    bucket_name = os.environ['BUCKET_NAME']
    try:
        print(f"getting {filename} form {bucket_name}")
        response = s3.get_object(Bucket=bucket_name, Key=filename)
        print(response['Body'])
        csv_content = response['Body'].read().decode('utf-8').splitlines()
        print("reading the csv file")
        reader = csv.DictReader(csv_content)
        score_data = json.dumps([ row for row in reader ])
        print(f"removing {filename} from s3")
        s3.delete_object(Bucket=bucket_name, Key=filename)
        return score_data
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchKey':
            return None
        
def lambda_handler(event, _context):
    filename = event["queryStringParameters"]["filename"] + '_processed.csv'
    print("Getting file from s3")
    score_data = get_processed_data(filename)
    return {
        "statusCode": 200,
        "headers": {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },  
        "body": json.dumps({
            "data": score_data
        })
    }