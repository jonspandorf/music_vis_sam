#!/bin/sh

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin ${LAMBDA_ECR_REPO}

sam build -u && 
# sam package \
#  --region ${AWS_REGION} \
#  --output-template-file packaged-template.yaml \
#  --image-repository ${LAMBDA_ECR_REPO} && 
sam deploy \
 --stack-name ${STACK_NAME} \
 --capabilities CAPABILITY_IAM \
 --region ${AWS_REGION} \
 --resolve-s3 \
 --resolve-image-repos \
 --template-file /app/packaged-template.yaml \
 --no-fail-on-empty-changeset \
 --parameter-overrides ParameterKey=BucketPrefix,ParameterValue=${BUCKET_NAME}