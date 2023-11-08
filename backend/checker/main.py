import boto3 
import os
import time
import json


dynamodb = boto3.client('dynamodb')
s3 = boto3.client('s3')
websocket_api = boto3.client('apigatewaymanagementapi', endpoint_url=os.getenv('WEBSOCKET_API'))



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
        filename = body["filename"]+'_processed.csv'
        is_file_ready = check_if_ready(filename)
        statusCode = 200
        msg = json.dumps({"msg": "Your file is ready!"})
        if not is_file_ready:
            statusCode = 404
            msg = json.dumps({"msg": "Did not finish processing"})

        websocket_api.post_to_connection(
            Data = msg,
            ConnectionId = connection_id)
        return {
            "statusCode": statusCode,
        }



def insert_connection_to_dynamodb(connection_id):
    print(f"inserting connection {connection_id}")
    table_name = os.environ['DYNAMODB_TABLE_NAME']
    ttl = int(time.time()) + 120 
    dynamodb.put_item(
        TableName = table_name,
        Item = {
            'ConnectionId': {'S': connection_id},
            'TTL': {'N': str(ttl)}
        })



def delete_connection_from_dynamodb(connection_id):
    print(f"removing connection {connection_id}")
    table_name = os.environ['DYNAMODB_TABLE_NAME']
    dynamodb.delete_item(
        TableName = table_name,
        Key = {'ConnectionId': {'S': connection_id}})



def check_if_ready(filename):
    bucket_name = os.environ['BUCKET_NAME']
    try:
        s3.head_object(Bucket=bucket_name, Key=filename)
        return  True
    except s3.exceptions.NoSuchKey:
        return False
    


