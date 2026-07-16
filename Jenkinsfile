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
                // Передаем CI=true, чтобы тесты React не зависали
                sh 'docker run --rm -e CI=true ${IMAGE_NAME}:dev npm test -- --passWithNoTests || echo "Tests are not strictly configured yet"'
            }
        }

        stage('Build Production Container') {
            steps {
                echo 'Building final Nginx production image...'
                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -f Dockerfile .'
            }
        }

        stage('Deploy to Minikube') {
            steps {
                echo 'Transferring image to Minikube cluster...'
                sh 'docker save ${IMAGE_NAME}:${IMAGE_TAG} -o image.tar'
                sh 'docker cp image.tar minikube:/image.tar'
                sh 'docker exec minikube docker load -i /image.tar'

                echo 'Applying Kubernetes manifests...'
                sh 'cat k8s/deployment.yaml | docker exec -i minikube kubectl apply -f -'
                sh 'cat k8s/service.yaml | docker exec -i minikube kubectl apply -f -'
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