import json
import boto3
import os
import time
import io
import base64
import uuid

s3 = boto3.client('s3')
sqs = boto3.client('sqs')
BUCKET_NAME = os.environ['BUCKET_NAME']
QUEUE_URL = os.environ['QUEUE_URL']

def put_object_to_s3(filename, raw_mxl):
    s3.upload_fileobj(io.BytesIO(raw_mxl), BUCKET_NAME, f"{filename}.mxl")

def send_message_to_sqs(filename,start_measure,end_measure):

    sqs_msg = {
        'event': 'file_created',
        'filename': f"{filename}.mxl",
        'object_key': filename,
        'start_measure': start_measure,
        'end_measure': end_measure
    }

    sqs.send_message(QueueUrl=QUEUE_URL, MessageBody=json.dumps(sqs_msg))

def lambda_handler(event, _context):
    filename = event["queryStringParameters"]["filename"]
    start_measure =  event["queryStringParameters"]["startMeasure"]
    end_measure = event["queryStringParameters"]["endMeasure"]
    raw_mxl = base64.b64decode(event['body'])
    # Handle WebSocket generate event
    unique_id = str(uuid.uuid4())
    new_filename = filename+'_'+unique_id
    put_object_to_s3(new_filename,raw_mxl)
    send_message_to_sqs(new_filename,start_measure,end_measure)

    return {
    "statusCode": 202,
    "headers": {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    },  
    "body": json.dumps({
        "message": new_filename,
    }),
}