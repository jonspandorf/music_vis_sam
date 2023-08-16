pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        STACK_NAME = 'Music-Viz-App'
        ARTIFACTS_BUCKET = 'aws-sam-cli-managed-default-samclisourcebucket-z917b5ff2qwb'
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Build the application') {
            steps {
                sh 'docker compose -f docker-compose-build.yaml up'
            }
        }

        stage('Copy Artifacts to S3') {
            steps {
                sh "aws s3 cp ./frontend/build s3://${STACK_NAME}-web-app-s3-bucket --recursive"
            }
        }
    }
}
