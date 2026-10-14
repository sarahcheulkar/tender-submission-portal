# Task 2 Proof: Agile Planning, User Stories, and 15-Task Kanban Plan

**Student:** Sarah Cheulkar  
**Roll No.:** 23102C0060  
**Subject:** DevOps Major Project  
**Date Completed:** October 14, 2026  
**Status:** COMPLETED

---

## 1. User Stories & Acceptance Criteria
- **User Story 1 (Applicant Bid Submission):** As a verified tender applicant, I want to submit a competitive financial bid with technical documentation for an open tender so that my organization can participate in public procurement contracts.
  - Acceptance Criteria: Positive non-zero bid amount, tender status OPEN, duplicate prevention (HTTP 409), unique tracking code generated.
- **User Story 2 (Reviewer Evaluation & Approval):** As an appointed tender evaluator, I want to review submitted proposals and approve/reject them so that only compliant vendors are awarded contracts.
  - Acceptance Criteria: Status update (UNDER_REVIEW, APPROVED, REJECTED), mandatory rejection reasoning recorded in audit ledger, real-time telemetry updates.

## 2. 15-Task Kanban / Scrum Sprint Plan Summary
The internal 15-task plan required by the syllabus is documented with assignees, story points, and sprint phases:
1. TASK-01: Stakeholder & Pain Point Definition (2 pts) - Sprint 1
2. TASK-02: User Stories & 15-Task Backlog (3 pts) - Sprint 1
3. TASK-03: Domain Entity & REST API Architecture (5 pts) - Sprint 1
4. TASK-04: Git Init, Branching Rules & Skeleton (2 pts) - Sprint 1
5. TASK-05: Core Applicant Submission Workflow (8 pts) - Sprint 2
6. TASK-06: Reviewer Console & Rejection Reason Engine (5 pts) - Sprint 2
7. TASK-07: Merge Conflict Simulation & Release Tag v1.0.0 (3 pts) - Sprint 2
8. TASK-08: Jenkins Installation & Maven CI Setup (5 pts) - Sprint 3
9. TASK-09: Declarative Pipeline as Code (Jenkinsfile) (5 pts) - Sprint 3
10. TASK-10: Selenium WebDriver Headless E2E Suite (8 pts) - Sprint 3
11. TASK-11: Jenkins Quality Gate & Defect Recovery (5 pts) - Sprint 3
12. TASK-12: Multi-Stage Dockerfile & Container Lifecycle (5 pts) - Sprint 4
13. TASK-13: Automated Pipeline Container Deployment (5 pts) - Sprint 4
14. TASK-14: Ansible Playbook & Server Provisioning (8 pts) - Sprint 4
15. TASK-15: Idempotency Verification & Disaster Rollback (5 pts) - Sprint 4

## 3. DevOps Lifecycle Model
PLAN -> CODE -> BUILD -> TEST -> RELEASE -> DEPLOY -> OPERATE -> MONITOR

## 4. Artifact Reference
The complete agile plan is stored at:  
docs/TASK2_AGILE_KANBAN.md
