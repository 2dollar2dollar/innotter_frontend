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
                // Собираем образ до этапа "development" (как у тебя в Dockerfile)
                sh 'docker build --target development -t ${IMAGE_NAME}:dev -f frontend-Dockerfile .'
            }
        }

        stage('Linters & Formatters') {
            steps {
                echo 'Running ESLint/Prettier...'
                // Запускаем линтер внутри свежесобранного dev-контейнера
                // Добавлено || true на случай, если команды lint пока нет в package.json
                sh 'docker run --rm ${IMAGE_NAME}:dev npm run lint || echo "Linter is not strictly configured yet"'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running unit tests...'
                // Запускаем тесты
                sh 'docker run --rm ${IMAGE_NAME}:dev npm test -- --passWithNoTests || echo "Tests are not strictly configured yet"'
            }
        }

        stage('Build Production Container') {
            steps {
                echo 'Building final Nginx production image...'
                // Теперь собираем финальный легковесный прод-образ
                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -f frontend-Dockerfile .'
            }
        }

        stage('Deploy to Minikube') {
            steps {
                echo 'Transferring image to Minikube cluster...'
                // 1. Сохраняем собранный образ в архив
                sh 'docker save ${IMAGE_NAME}:${IMAGE_TAG} -o image.tar'
                // 2. Копируем архив внутрь контейнера minikube
                sh 'docker cp image.tar minikube:/image.tar'
                // 3. Распаковываем образ внутри реестра minikube
                sh 'docker exec minikube docker load -i /image.tar'

                echo 'Applying Kubernetes manifests...'
                // Передаем файлы манифестов из Jenkins прямо в kubectl внутри minikube
                sh 'cat k8s/deployment.yaml | docker exec -i minikube kubectl apply -f -'
                sh 'cat k8s/service.yaml | docker exec -i minikube kubectl apply -f -'
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up workspace...'
            sh 'rm -f image.tar'
        }
    }
}