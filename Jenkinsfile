pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        STACK_NAME = 'Music-Viz-App'
        ARTIFACTS_BUCKET = 'aws-sam-cli-managed-default-samclisourcebucket-z917b5ff2qwb'
        BUCKET_NAME = 'static-website'
    }

    triggers {
        githubPush()
    }

    stages {
        parallel{
            stage('Build Frontend') {
                steps {
                    sh 'docker-compose -f ./docker-compose-build -p frontend run build_frontend -d'
                }
            }
            stage('Build Backend') {
                steps {
                    sh 'docker-compose -f ./docker-compose-build -p backend run build_backend -d'
                }
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
