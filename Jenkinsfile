pipeline {
    agent any

    parameters {
        choice(name: "ENVIRONMENT", choices: ["QA", "STAGING", "PRODUCTION"], description: "Deployment Target Environment")
        string(name: "DOCKER_IMAGE_NAME", defaultValue: "sarahcheulkar/tender-portal", description: "Docker Hub Image Repository")
    }

    environment {
        APP_VERSION = "1.0.0"
        IMAGE_TAG = "${params.DOCKER_IMAGE_NAME}:${APP_VERSION}-${BUILD_NUMBER}"
        LATEST_TAG = "${params.DOCKER_IMAGE_NAME}:latest"
        APP_PORT = "8082"
    }

    options {
        timeout(time: 30, unit: "MINUTES")
        buildDiscarder(logRotator(numToKeepStr: "10"))
    }

    stages {
        stage("Checkout SCM") {
            steps {
                echo "==> Fetching source code from Git repository for Sarah Cheulkar (23102C0060)..."
                checkout scm
            }
        }

        stage("Compile & Static Analysis") {
            steps {
                echo "==> Compiling Java sources with Maven..."
                sh "./mvnw clean compile"
            }
        }

        stage("Unit Testing") {
            steps {
                echo "==> Executing Spring Boot Context & Unit Tests..."
                sh "./mvnw test -Dtest=TenderPortalApplicationTests,TenderServiceTest"
            }
            post {
                always {
                    junit testResults: "target/surefire-reports/*.xml", allowEmptyResults: true
                }
            }
        }

        stage("Package Artifact") {
            steps {
                echo "==> Packaging Spring Boot executable JAR..."
                sh "./mvnw package -DskipTests"
            }
        }

        stage("Archive Artifacts") {
            steps {
                echo "==> Archiving build artifact target/tender-submission-portal-1.0.0.jar..."
                archiveArtifacts artifacts: "target/*.jar", fingerprint: true
            }
        }

        stage("Selenium E2E Continuous Testing (Quality Gate)") {
            steps {
                echo "==> Executing Selenium E2E User Journeys with failure screenshot mechanism..."
                sh "./mvnw test -Dtest=TenderPortalSeleniumTest"
            }
            post {
                always {
                    junit testResults: "target/surefire-reports/*SeleniumTest*.xml", allowEmptyResults: true
                    archiveArtifacts artifacts: "target/screenshots/*.png", allowEmptyArchive: true
                }
            }
        }

        stage("Docker Build & Tag") {
            steps {
                echo "==> Building versioned Docker Image: ${IMAGE_TAG}..."
                sh "docker build -t ${IMAGE_TAG} -t ${LATEST_TAG} ."
            }
        }

        stage("Docker Registry Publish") {
            steps {
                echo "==> Docker image ${IMAGE_TAG} tagged and ready for push."
            }
        }

        stage("Continuous Deployment (Container Run)") {
            steps {
                echo "==> Deploying fresh container to ${params.ENVIRONMENT} environment..."
                sh """
                    docker stop tender-portal-container || true
                    docker rm tender-portal-container || true
                    docker run -d --name tender-portal-container -p ${APP_PORT}:8082 ${IMAGE_TAG}
                """

                echo "==> Performing Health Check on deployed container..."
                sh """
                    sleep 5
                    curl -f http://host.docker.internal:${APP_PORT}/actuator/health || curl -f http://localhost:${APP_PORT}/actuator/health || (echo "Health check failed!" && exit 1)
                """
            }
        }
    }

    post {
        success {
            echo "SUCCESS: Pipeline completed! Tender Submission Portal deployed to ${params.ENVIRONMENT} for Sarah Cheulkar (23102C0060)."
        }
        failure {
            echo "FAILURE: Quality Gate or Deployment failed. Halting pipeline to prevent broken releases."
        }
    }
}
