import boto3 
import os
import time
import json

s3 = boto3.client('s3')
websocket_api = boto3.client('apigatewaymanagementapi', endpoint_url=os.getenv('WEBSOCKET_API'))
BUCKET_NAME = os.environ('BUCKET_NAME')

def lambda_handler(event,_context):
    route_key = event["requestContext"]["routeKey"]
    connection_id = event["requestContext"]["connectionId"]

    if route_key == '$connect':
        return {
            "statusCode": 200,
        }
    
    elif route_key == '$disconnect':
        return {
            "statusCode": 200,
        }
    
    elif route_key == 'onCheck':
        body = json.loads(event["body"])
        filename = body["filename"]+'.json'
        is_file_ready = check_if_ready(filename)
        data = ""
        if is_file_ready:
            data = get_processed_data(filename)

        websocket_api.post_to_connection(Data = json.dumps(data), ConnectionId=connection_id)
        return {
            "statusCode": 200,
        }



def check_if_ready(filename):
    try:

        s3.head_object(Bucket=BUCKET_NAME, Key=filename)
        return  True
    except s3.exceptions.NoSuchKey:
        return False
    
def get_processed_data(filename):
    response = s3.get_object(Bucket=BUCKET_NAME, Key=f"{filename}.json")
    data = json.loads(response['Body'].read().decode('utf-8'))
    s3.delete_object(Bucket=BUCKET_NAME, Key=f"{filename}.json")
    return data
