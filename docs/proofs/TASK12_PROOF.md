# Task 12 Proof: Jenkins–Docker Continuous Deployment

**Student:** Sarah Cheulkar  
**Roll No.:** 23102C0060  
**Subject:** DevOps Major Project  
**Date Completed:** October 14, 2026  
**Status:** COMPLETED

---

## 1. Automated Docker CD Workflow
- Triggered automatically upon successful compilation, unit testing, and Selenium quality gate execution.
- Dynamically tags the Docker image with unique build numbers: `${params.DOCKER_IMAGE_NAME}:${APP_VERSION}-${BUILD_NUMBER}`.
- Deploys container zero-downtime replacing previous revisions and validates health via Spring Boot Actuator.

## 2. CD Verification Output
Image Registry List:
```
sarahcheulkar/tender-portal:1.0.0-4
sarahcheulkar/tender-portal:latest
```
Live Container Health Check:
`curl -s http://localhost:8082/api/health`
```json
{
  "status": "UP",
  "service": "Ansible-Provisioned Tender Submission Portal",
  "student": "Sarah Cheulkar (Roll No: 23102C0060)",
  "subject": "DevOps Major Project",
  "version": "1.0.0",
  "database": "H2 Embedded Relational DB (Healthy)"
}
```
