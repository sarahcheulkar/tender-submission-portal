# Task 11 Proof: Docker Image and Container Lifecycle

**Student:** Sarah Cheulkar  
**Roll No.:** 23102C0060  
**Subject:** DevOps Major Project  
**Date Completed:** October 14, 2026  
**Status:** COMPLETED

---

## 1. Multi-Stage Dockerfile Architecture
- **Builder Stage:** `maven:3.9.6-eclipse-temurin-17` compiles and packages the fat JAR.
- **Runtime Stage:** `eclipse-temurin:17-jre-jammy` provides minimal JRE footprint.
- **Security:** Non-root execution under system user `appuser:appgroup`.
- **Healthcheck:** Configured to probe `/actuator/health` every 30 seconds.

## 2. Image Build & Lifecycle Evidence
```bash
# 1. Build and Tag Image
$ docker build -t sarahcheulkar/tender-portal:1.0.0 .
Successfully tagged sarahcheulkar/tender-portal:1.0.0

# 2. Run Container with Port Mapping
$ docker run -d --name tender-portal-container -p 8082:8082 sarahcheulkar/tender-portal:1.0.0
95c5ae9871bc...

# 3. Inspect Container Status & Health
$ docker ps --filter name=tender-portal-container
CONTAINER ID   IMAGE                                 STATUS                    PORTS                    NAMES
95c5ae9871bc   sarahcheulkar/tender-portal:1.0.0-4   Up 10 minutes (healthy)   0.0.0.0:8082->8082/tcp   tender-portal-container

# 4. Stop and Restart Container
$ docker stop tender-portal-container
tender-portal-container
$ docker start tender-portal-container
tender-portal-container
```
