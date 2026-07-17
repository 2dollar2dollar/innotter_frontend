pipeline {
    agent any

    environment {
        IMAGE_NAME = 'innotter-frontend'
        IMAGE_TAG  = 'latest'
    }

    stages {
        stage('Build Dev Image for Tests') {
            steps {
                echo 'Building development stage to run tests and linters...'
                sh 'docker build --target development -t ${IMAGE_NAME}:dev -f Dockerfile .'
            }
        }

        stage('Linters & Formatters') {
            steps {
                echo 'Running ESLint/Prettier...'
                sh 'docker run --rm ${IMAGE_NAME}:dev npm run lint || echo "Linter is not strictly configured yet"'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running unit tests...'
                sh 'docker run --rm -e CI=true ${IMAGE_NAME}:dev npm test -- --passWithNoTests || echo "Tests are not strictly configured yet"'
            }
        }

        stage('Build Production Container') {
            steps {
                echo 'Building final Nginx production image...'
                sh '''
                docker build \
                  --build-arg AUTH_API_URL="/api/v1/auth" \
                  --build-arg POSTS_API_URL="/api/v1" \
                  -t ${IMAGE_NAME}:${IMAGE_TAG} -f Dockerfile .
                '''
            }
        }

        stage('Deploy to Minikube') {
            steps {
                echo 'Transferring image to Minikube cluster...'
                sh 'docker save ${IMAGE_NAME}:${IMAGE_TAG} -o image.tar'
                sh 'docker cp image.tar minikube:/image.tar'
                sh 'docker exec minikube docker load -i /image.tar'

                echo 'Ensuring kubectl is installed in minikube container...'
                sh 'docker exec minikube bash -c "if ! command -v kubectl &> /dev/null; then curl -sLO https://dl.k8s.io/release/v1.35.1/bin/linux/arm64/kubectl && chmod +x kubectl && mv kubectl /usr/local/bin/; fi"'

                echo 'Applying Kubernetes manifests...'
                sh 'cat k8s/01-deployment.yaml | docker exec -i minikube kubectl --kubeconfig /etc/kubernetes/admin.conf apply -f -'
                sh 'cat k8s/02-service.yaml | docker exec -i minikube kubectl --kubeconfig /etc/kubernetes/admin.conf apply -f -'

                echo 'Forcing pods to restart with the newly loaded image...'
                sh 'docker exec -i minikube kubectl --kubeconfig /etc/kubernetes/admin.conf rollout restart deployment/frontend-deployment'
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up workspace...'
            sh 'rm -f image.tar || true'
        }
    }
}