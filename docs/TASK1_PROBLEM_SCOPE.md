# Task 1: Problem Definition and Project Scope

**Student:** Sarah Cheulkar  
**Roll No.:** 23102C0060  
**Course:** DevOps Major Project  
**Project:** Ansible-Provisioned Tender Submission Portal (TenderFlow)

---

## 1. Executive Summary & Problem Definition
Traditional public and commercial tender management workflows suffer from significant systemic inefficiencies:
* **Manual Paperwork & Fragmented Communication:** Bid submissions are submitted via physical couriers or disparate email threads, leading to lost proposals, disputed timestamps, and lack of transparency.
* **Opaque Review & Evaluation Workflows:** Tender applicants rarely receive granular status tracking. Reviewers lack standardized compliance verification checklists.
* **Deployment Fragility & Infrastructure Inconsistency:** Public sector applications frequently crash during high-traffic closing deadlines due to non-standardized environment provisioning and absence of automated CI/CD quality gates.

## 2. Key Stakeholders & Target Users
* **Tender Applicant / Vendor:** Registers, browses published government projects, enters financial bids, submits technical descriptions, uploads compliance references, and tracks status in real time.
* **Evaluator / Technical Reviewer:** Accesses review queues, inspects architectural proposals, validates financial bids against ceilings, approves compliant tenders, or rejects non-compliant submissions with mandatory audit feedback.
* **DevOps / System Administrator:** Maintains continuous deployment pipelines, monitors container health via Actuator, and executes automated idempotent server provisioning via Ansible.

## 3. Project Objectives & Success Criteria
1. **Zero-Configuration Execution:** Embedded relational database (H2) and single executable JAR packaging.
2. **End-to-End Traceability:** Complete audit ledger from submission intake to final award.
3. **Automated Continuous Integration:** Multi-stage Jenkins pipeline with automated Selenium E2E quality gates and failure screenshot capturing.
4. **Reliable Infrastructure as Code:** Version-controlled Dockerfile and idempotent Ansible playbooks with rollback recovery.
