pipeline {
    agent any

    parameters {
        string(name: 'AWS_REGION', defaultValue: 'us-east-1', description: 'AWS region to deploy')
        string(name: 'STACK_NAME', defaultValue: 'MusicVizApp', description: 'The Cloudformation Stack name to deploy')
        string(name: 'BUCKET_NAME', defaultValue: 'static-website', description: 'Name of the static website hosted on S3 Bucket')
        string(name: 'LAMBDA_REPO_NAME', defaultValue: '110828812774.dkr.ecr.us-east-1.amazonaws.com/music-viz-container', description: 'Lambda container')
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Create ECR Repo') {
            steps {
                sh "aws ecr create-repository --repository-name ${LAMBDA_REPO_NAME} --image-tag-mutability IMMUTABLE --image-scanning-configuration scanOnPush=true --query 'repository.repositoryUri' > repoUri.txt || true"
                sh "aws ecr get-login --region ${AWS_REGION} | docker login --username AWS --password-stdin $(cat repoUri.txt)"
            }
        }
        stage('Build and deploy applications') {
            steps {
                script {
                    def ecr_uri = sh(returnStdout: true, script: "cat repoUri.txt").trim()
                    withEnv(["LAMBDA_ECR_REPO=${ecr_uri}"]) {
                        sh 'docker compose -f ./docker-compose-build.yaml up'
                    }
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
