pipeline {
    agent any

    parameters {
        string(name: 'AWS_REGION', defaultValue: 'us-east-1', description: 'AWS region to deploy')
        string(name: 'STACK_NAME', defaultValue: 'MusicVizApp', description: 'The Cloudformation Stack name to deploy')
        string(name: 'ARTIFACTS_BUCKET', defaultValue: 'aws-sam-cli-managed-default-samclisourcebucket-z917b5ff2qwb', description: 'S3 Bucket for SAM artifacts')
        string(name: 'BUCKET_NAME', defaultValue: 'static-website', description: 'Name of the static website hosted on S3 Bucket')
        string(name: 'LAMBDA_ECR_REPO', defaultValue: '110828812774.dkr.ecr.us-east-1.amazonaws.com/musicvizapp71ff58a6/musicvizlambdafunction368eb431repo', description: 'Lambda container')
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
