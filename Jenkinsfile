pipeline {
    agent any
    tools {
        nodejs 'Node16' // Node.js version configured in Jenkins
    }
    environment {
        MONGO_URI = 'mongodb://127.0.0.1:27017/todoapp' // Match .env
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', credentialsId: 'github-credentials', url: 'https://github.com/Sanskruti2209/todo-app.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
        }
        stage('Build Docker Image') {
            steps {
                bat 'docker-compose build'
            }
        }
        stage('Deploy') {
            steps {
                bat 'docker-compose up -d'
            }
        }
    }
    post {
        always {
            junit 'test-results.xml'
            archiveArtifacts artifacts: 'coverage/**/*', allowEmptyArchive: true
            bat 'docker-compose down || exit 0' // Clean up containers
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}