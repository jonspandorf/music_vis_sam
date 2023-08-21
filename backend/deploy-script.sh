#!/bin/sh

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin ${LAMBDA_ECR_REPO}

sam build -u && sam package --region ${AWS_REGION} --output-template-file packaged-template.yaml --image-repository ${LAMBDA_ECR_REPO}