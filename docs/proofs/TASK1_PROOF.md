# Task 1 Proof: Problem Definition and Project Scope

**Student:** Sarah Cheulkar  
**Roll No.:** 23102C0060  
**Subject:** DevOps Major Project  
**Project:** Ansible-Provisioned Tender Submission Portal  
**Date Completed:** October 14, 2026  
**Status:** COMPLETED

---

## 1. Task Objective Verification
The objective of Task 1 is to define the project scope, identify stakeholders, analyze existing pain points, specify objectives/constraints, and freeze the Minimum Viable Product (MVP) scope.

## 2. Key Pain Points Identified
1. **Manual Paperwork & Friction:** Inefficient physical submission and opaque email threads.
2. **Lack of Transparent Status Tracking:** Vendors unable to monitor real-time evaluation status.
3. **Deployment Fragility:** High-concurrency application failures during bid deadline surges due to non-standardized provisioning.

## 3. Stakeholder Roles
- **Tender Applicant:** Registers, views published tenders, submits competitive financial bids, uploads technical briefs, tracks real-time status.
- **Reviewer / Evaluator:** Inspects proposals, approves compliant tenders, rejects non-compliant bids with mandatory audit justifications.
- **DevOps Engineer:** Maintains automated Jenkins CI/CD, Selenium quality gates, Docker containerization, and Ansible idempotent provisioning.

## 4. Frozen MVP Scope
- Dual-role command center (Applicant & Reviewer).
- 4 pre-seeded government tenders.
- Real-time bid submission engine with duplicate prevention.
- Reviewer decision engine with mandatory audit reasoning.
- RESTful APIs (`/api/tenders`, `/api/submissions`, `/api/health`, `/api/stats`).
- Health telemetry and H2 in-memory relational database.

## 5. Artifact Reference
The complete project scope document is stored at:  
docs/TASK1_PROBLEM_SCOPE.md
