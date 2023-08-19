pipeline {
    agent any

    parameters {
        string(name: 'AWS_REGION', defaultValue: 'us-east-1', description: 'AWS region to deploy')
        string(name: 'STACK_NAME', defaultValue: 'MusicVizApp', description: 'The Cloudformation Stack name to deploy')
        string(name: 'ARTIFACTS_BUCKET', defaultValue: 'aws-sam-cli-managed-default-samclisourcebucket-z917b5ff2qwb', description: 'S3 Bucket for SAM artifacts')
        string(name: 'BUCKET_NAME', defaultValue: 'static-website', description: 'Name of the static website hosted on S3 Bucket')
    }

    environment {
        LAMBDA_ECR_REPO = sh(script: "aws ecr create-repository --repository-name ${STACK_NAME}LambdaContainer --query 'repository.repositoryUri' --output text", returnStdout: true).trim()
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Build applications') {
            steps {
                sh 'docker compose -f ./docker-compose-build.yaml up'
            }
        }
        stage('Copy Artifacts to S3') {
            steps {
                sh "aws s3 cp ./frontend/build s3://${STACK_NAME}-${BUCKET_NAME} --recursive"
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
