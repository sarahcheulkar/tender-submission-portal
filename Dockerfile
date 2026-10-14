# ==============================================================================
# Dockerfile: Ansible-Provisioned Tender Submission Portal
# Student: Sarah Cheulkar (Roll No: 23102C0060)
# Multi-stage production container with health checks and non-root execution
# ==============================================================================

# Build Stage
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline -B || true

COPY src ./src
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

LABEL maintainer="Sarah Cheulkar <23102C0060@student.edu>"
LABEL project="Ansible-Provisioned Tender Submission Portal"
LABEL roll_number="23102C0060"
LABEL subject="DevOps Major Project"
LABEL version="1.0.0"

# Install curl for Docker & Ansible healthchecks
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/* && \
    groupadd -r appgroup && useradd -r -g appgroup -s /bin/false appuser

COPY --from=builder /build/target/tender-submission-portal-1.0.0.jar app.jar
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8082

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl -f http://localhost:8082/actuator/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
