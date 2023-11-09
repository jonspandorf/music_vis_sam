pipeline {
    agent any

    parameters {
        string(name: 'AWS_REGION', defaultValue: 'us-east-1', description: 'AWS region to deploy')
        string(name: 'STACK_NAME', defaultValue: 'musicviz-prod-app', description: 'Name of Cloudformation serverless stack')
        string(name: 'DOMAIN_NAME',defaultValue: 'musicviz.earbuddy.link', description: 'The name of app DNS')
        string(name: 'CF_DIST_IT',defaultValue: 'E20GSLGHX9MRXR', description: 'name of the distribution id')
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Remove Old Contianers') {
            steps {
                sh 'docker rm $(docker ps -a -q) || true'
                sh 'sudo rm -r ./frontend/build || true'
            }
        }
        stage('Build Serverless container') {
            steps {
                sh 'docker build -t serverless .'
            }
        }
        stage('Build and deploy applications') {
            steps {
                sh 'docker compose -p music_viz_${BUILD_NUMBER} -f ./docker-compose-build.yaml up --remove-orphans'
            }
        }
        stage('Deploy Frontend app') {
            steps {
                sh "aws s3 sync ./frontend/build s3://${STACK_NAME}-frontend-app"
            }
        }
        stage('Invalidate cloudfront cache') {
            steps {
                sh 'aws cloudfront create-invalidation --distribution-id $CF_DIST_IT --path "/*"'
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
