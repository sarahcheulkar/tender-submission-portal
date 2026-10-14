# Task 2: Agile Planning, User Stories, and 15-Task Kanban Plan

**Student:** Sarah Cheulkar (Roll No: 23102C0060)

---

## 1. User Stories & Acceptance Criteria

### User Story 1 (Applicant Bid Submission)
* **As a** verified tender applicant,
* **I want to** submit a competitive financial bid with technical documentation for an open tender,
* **So that** my organization can participate in public procurement contracts.
* **Acceptance Criteria:**
  - Bid amount must be positive and non-zero.
  - Selected tender must have `OPEN` status.
  - Duplicate bids for the same tender by the same applicant are rejected with HTTP 409.
  - Unique tracking code (e.g., `SUB-2026-003`) is generated.

### User Story 2 (Reviewer Evaluation & Approval)
* **As an** appointed tender evaluator,
* **I want to** review submitted technical proposals and either approve or reject them,
* **So that** only compliant, financially viable vendors are awarded contracts.
* **Acceptance Criteria:**
  - Evaluator can mark proposals as `UNDER_REVIEW`, `APPROVED`, or `REJECTED`.
  - Rejections require mandatory justification text stored in the audit ledger.
  - Real-time statistics and approval rates update immediately.

---

## 2. Official 15-Task Kanban / Scrum Sprint Plan

| # | Task Identifier | Sprint Phase | Story Points | Assignee | Status |
|---|---|---|---|---|---|
| 1 | **TASK-01:** Stakeholder & Pain Point Definition | Sprint 1 (Inception) | 2 | Sarah Cheulkar | DONE |
| 2 | **TASK-02:** User Stories & 15-Task Backlog | Sprint 1 (Inception) | 3 | Sarah Cheulkar | DONE |
| 3 | **TASK-03:** Domain Entity & REST API Architecture | Sprint 1 (Inception) | 5 | Sarah Cheulkar | DONE |
| 4 | **TASK-04:** Git Init, Branching Rules & Skeleton | Sprint 1 (Inception) | 2 | Sarah Cheulkar | DONE |
| 5 | **TASK-05:** Core Applicant Submission Workflow | Sprint 2 (Core Dev) | 8 | Sarah Cheulkar | DONE |
| 6 | **TASK-06:** Reviewer Console & Rejection Reason Engine | Sprint 2 (Core Dev) | 5 | Sarah Cheulkar | DONE |
| 7 | **TASK-07:** Merge Conflict Simulation & Release Tag v1.0.0 | Sprint 2 (Core Dev) | 3 | Sarah Cheulkar | DONE |
| 8 | **TASK-08:** Jenkins Installation & Maven CI Setup | Sprint 3 (CI/CD) | 5 | Sarah Cheulkar | DONE |
| 9 | **TASK-09:** Declarative Pipeline as Code (`Jenkinsfile`) | Sprint 3 (CI/CD) | 5 | Sarah Cheulkar | DONE |
| 10 | **TASK-10:** Selenium WebDriver Headless E2E Suite | Sprint 3 (CI/CD) | 8 | Sarah Cheulkar | DONE |
| 11 | **TASK-11:** Jenkins Quality Gate & Defect Recovery | Sprint 3 (CI/CD) | 5 | Sarah Cheulkar | DONE |
| 12 | **TASK-12:** Multi-Stage Dockerfile & Container Lifecycle | Sprint 4 (DevOps) | 5 | Sarah Cheulkar | DONE |
| 13 | **TASK-13:** Automated Pipeline Container Deployment | Sprint 4 (DevOps) | 5 | Sarah Cheulkar | DONE |
| 14 | **TASK-14:** Ansible Playbook & Server Provisioning | Sprint 4 (DevOps) | 8 | Sarah Cheulkar | DONE |
| 15 | **TASK-15:** Idempotency Verification & Disaster Rollback | Sprint 4 (DevOps) | 5 | Sarah Cheulkar | DONE |

---

## 3. DevOps Lifecycle Architecture

```
[PLAN]      User Stories, 15-Task Kanban Board, Acceptance Criteria (Docs)
   ↓
[CODE]      Java 17, Spring Boot 3, Glassmorphic Dual-Theme UI, JPA/H2
   ↓
[BUILD]     Maven Wrapper, Executable Fat-JAR Packaging
   ↓
[TEST]      JUnit 5 Unit Tests + Headless Selenium E2E Quality Gate
   ↓
[RELEASE]   Versioned Tagging (v1.0.0) + Docker Hub Image Publishing
   ↓
[DEPLOY]    Jenkins Pipeline & Ansible Playbook Automated Container Run
   ↓
[OPERATE]   Docker Healthcheck, Spring Boot Actuator Telemetry
   ↓
[MONITOR]   Live Command Center Telemetry, /api/stats, /actuator/health
```
