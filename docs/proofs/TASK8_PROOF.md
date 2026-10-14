# Task 8 Proof: Pipeline as Code and Server Deployment

**Student:** Sarah Cheulkar  
**Roll No.:** 23102C0060  
**Subject:** DevOps Major Project  
**Date Completed:** October 14, 2026  
**Status:** COMPLETED

---

## 1. Pipeline as Code Configuration (`Jenkinsfile`)
- Declarative Jenkins pipeline version-controlled in the root of the Git repository.
- Parameterized environment choices:
  - `ENVIRONMENT`: Choice (`QA`, `STAGING`, `PRODUCTION`)
  - `DOCKER_IMAGE_NAME`: String (`sarahcheulkar/tender-portal`)
- Timeout configured for 30 minutes, discarding builds older than 10 runs.

## 2. Execution Log & Stage View
Pipeline executed with parameters:
- `ENVIRONMENT = QA`
- `DOCKER_IMAGE_NAME = sarahcheulkar/tender-portal`

```
[Pipeline] stage (Continuous Deployment (Container Run))
==> Deploying fresh container to QA environment...
+ docker stop tender-portal-container
tender-portal-container
+ docker rm tender-portal-container
tender-portal-container
+ docker run -d --name tender-portal-container -p 8082:8082 sarahcheulkar/tender-portal:1.0.0-4
95c5ae9871bcd4af1bf3d1a7305a52067aca8b885fdaec3220935ba53087fdee
==> Performing Health Check on deployed container...
+ sleep 5
+ curl -f http://host.docker.internal:8082/actuator/health
{"status":"UP","components":{"db":{"status":"UP"},"diskSpace":{"status":"UP"}}}
SUCCESS: Pipeline completed! Tender Submission Portal deployed to QA for Sarah Cheulkar (23102C0060).
Finished: SUCCESS
```

Screenshot captured at: `docs/screenshots/jenkins_pipeline.png`
