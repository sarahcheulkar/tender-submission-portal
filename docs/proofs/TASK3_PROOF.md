# Task 3 Proof: Requirements, Architecture and Technology Setup

**Student:** Sarah Cheulkar  
**Roll No.:** 23102C0060  
**Subject:** DevOps Major Project  
**Date Completed:** October 14, 2026  
**Status:** COMPLETED

---

## 1. Architecture & Technology Stack
- **Backend Framework:** Java 17, Spring Boot 3.2.0 (Spring Data JPA, Spring Web, Spring Boot Actuator)
- **Database:** Embedded relational H2 Database (zero-config, high performance, in-memory)
- **Frontend:** Glassmorphic Command Center (HTML5, Vanilla CSS3 with dual-theme design, ES6 JavaScript)
- **Build Tool:** Apache Maven 3.9 Wrapper (`./mvnw`)
- **Port:** 8082 (dedicated port avoiding peer container conflicts on 8080/8081)

## 2. Domain Entities
- `User`: Applicant and Reviewer roles with credentials and company information.
- `Tender`: Reference code, title, description, department, category, estimated value, status (`OPEN`, `CLOSED`).
- `Submission`: Unique tracking code (`SUB-2026-xxx`), bid amount, technical proposal, submission date, status (`PENDING`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`).
- `Review`: Reviewer ID, decision, justification/remarks, review timestamp.

## 3. REST API Endpoints
- `GET /api/health`: Health status & student metadata
- `GET /actuator/health`: Spring Boot actuator health endpoint
- `GET /api/stats`: High-level metrics (total tenders, bids, acceptance rate, total pipeline value)
- `GET /api/tenders`: Catalog of all published tenders with filtering
- `POST /api/submissions`: Intake endpoint for applicant bids with duplicate validation
- `POST /api/submissions/{id}/review`: Decision endpoint for reviewer approval/rejection

## 4. Live Verification Output
`curl -s http://localhost:8082/api/health`
```json
{
  "status": "UP",
  "service": "Ansible-Provisioned Tender Submission Portal",
  "student": "Sarah Cheulkar (Roll No: 23102C0060)",
  "subject": "DevOps Major Project",
  "version": "1.0.0",
  "database": "H2 Embedded Relational DB (Healthy)",
  "timestamp": "2026-10-14T22:13:33.855072"
}
```
