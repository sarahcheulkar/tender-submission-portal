# ==============================================================================
# Dockerfile: Ansible-Provisioned Tender Submission Portal
# Student: Sarah Cheulkar (Roll No: 23102C0060)
# Multi-stage production container with health checks and non-root execution
# ==============================================================================

# Build Stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

LABEL maintainer="Sarah Cheulkar <23102C0060@student.edu>"
LABEL project="Ansible-Provisioned Tender Submission Portal"
LABEL roll_number="23102C0060"
LABEL subject="DevOps Major Project"
LABEL version="1.0.0"

# Install curl for Docker & Ansible healthchecks
RUN apk add --no-cache curl tzdata && \
    addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /build/target/tender-submission-portal-1.0.0.jar app.jar
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8082

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl -f http://localhost:8082/actuator/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
