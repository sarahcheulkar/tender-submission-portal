# Ansible-Provisioned Tender Submission Portal (TenderFlow)

**Student:** Sarah Cheulkar  
**Roll No.:** 23102C0060  
**Subject:** DevOps Major Project  
**Repository:** [Ansible-Provisioned Tender Submission Portal](https://github.com/sarahcheulkar/tender-submission-portal)

---

## 🌟 Executive Overview
The **Tender Submission Portal (TenderFlow)** is an enterprise-grade procurement and tender evaluation platform built as a complete academic DevOps major project. 

It implements the full **DevOps Lifecycle (Plan → Code → Build → Test → Release → Deploy → Operate → Monitor)** covering Git branching, automated Jenkins CI/CD pipelines, headless Selenium E2E quality gates, multi-stage Docker containerization, and idempotent Ansible configuration management with disaster rollback.

---

## 🎨 User Interface & Command Center Design
The portal features an ultra-modern Command Center inspired by cloud telemetry dashboards:
* **Dual Theme Engine:** Seamless real-time switching between **Futuristic Deep Nebula (Dark)** and **Crisp Executive Slate (Light)** with persistent state.
* **Interactive Lifecycle Flowchart:** Real-time visual SVG pipeline tracking bids across `Intake` ➔ `Validation` ➔ `Review` ➔ `Evaluation` ➔ `Awarded`.
* **Live Telemetry & Health Modal:** Directly queries Spring Boot Actuator (`/actuator/health`) and `/api/stats`.
* **Stable Automation IDs:** Purpose-built element IDs (`#bid-amount`, `#submit-button`, `#approve-button`, `#reject-button`, `#status`) to support robust, flake-free Selenium test automation.

---

## 📋 14 Official DevOps Tasks Checklist

| Phase | Task | Title & Deliverable | Status |
|:---:|:---:|:---|:---:|
| **Phase 1: Planning & Dev** | **Task 1** | Problem Definition, Scope & Stakeholder Analysis ([docs/TASK1_PROBLEM_SCOPE.md](docs/TASK1_PROBLEM_SCOPE.md)) | ✅ Complete |
| | **Task 2** | Agile Planning: User Stories & 15-Task Kanban/Scrum Board ([docs/TASK2_AGILE_KANBAN.md](docs/TASK2_AGILE_KANBAN.md)) | ✅ Complete |
| | **Task 3** | Architecture, Technology Setup, JPA Entities & REST APIs | ✅ Complete |
| | **Task 4** | Git & GitHub Repo Init, Skeleton, Issue Templates & `.gitignore` | ✅ Complete |
| | **Task 5** | Feature Development with Branching (`feature/tender-submission`) | ✅ Complete |
| | **Task 6** | MVP Completion, Merge Conflict Demo & Release Tag `v1.0.0` | ✅ Complete |
| **Phase 2: Jenkins & Testing** | **Task 7** | Jenkins CI Installation, Maven Build & Artifact Archiving | ✅ Complete |
| | **Task 8** | Pipeline as Code: Parameterized `Jenkinsfile` (QA/Staging/Production) | ✅ Complete |
| | **Task 9** | Selenium WebDriver E2E Suite & Failure Screenshot Engine | ✅ Complete |
| | **Task 10** | Continuous Testing in Jenkins: Quality Gate & Defect Recovery | ✅ Complete |
| **Phase 3: Docker & CD** | **Task 11** | Multi-Stage `Dockerfile` & Container Lifecycle Demonstration | ✅ Complete |
| | **Task 12** | Jenkins-Docker Automated CD: Image Tagging, Publish & Run | ✅ Complete |
| **Phase 4: Ansible & Reliability** | **Task 13** | Configuration Management: `inventory.ini` & `playbook.yml` | ✅ Complete |
| | **Task 14** | Idempotent Server Provisioning, Health Check & `rollback.yml` | ✅ Complete |

---

## 🚀 Quickstart: How to Run Locally

### 1. Run the Spring Boot Application
```bash
cd ~/Documents/projects/tender-submission-portal
./mvnw clean spring-boot:run
```
* **Application Command Center:** `http://localhost:8082`
* **H2 Database Web Console:** `http://localhost:8082/h2-console` (JDBC URL: `jdbc:h2:mem:tender_portal`, User: `sa`, Password: `password`)
* **Actuator Health Endpoint:** `http://localhost:8082/actuator/health`

### 2. Run Fast Unit Tests
```bash
./mvnw clean test
```

### 3. Run Headless Selenium E2E Test Suite with Screenshot Capture
```bash
./mvnw test -Dtest=TenderPortalSeleniumTest
```
*(Screenshots of completed and verified user journeys are saved to `target/screenshots/`)*

### 4. Package Executable Fat JAR
```bash
./mvnw clean package -DskipTests
```

---

## 🐳 Docker Container Operations (Tasks 11 & 12)

### Build the Docker Image:
```bash
docker build -t sarahcheulkar/tender-portal:1.0.0 .
```

### Run the Container:
```bash
docker run -d --name tender-portal-container -p 8082:8082 sarahcheulkar/tender-portal:1.0.0
```

### Verify Container Health:
```bash
curl -f http://localhost:8082/actuator/health
```

### Container Lifecycle Commands (for viva demonstration):
```bash
docker stop tender-portal-container
docker restart tender-portal-container
docker rm -f tender-portal-container
```

---

## ⚙️ Ansible Provisioning & Rollback (Tasks 13 & 14)

### Run Automated Provisioning:
```bash
cd ansible
ansible-playbook -i inventory.ini playbook.yml
```
*Demonstrates idempotency: running the playbook a second time results in 0 changed tasks!*

### Test Disaster Rollback:
```bash
ansible-playbook -i inventory.ini rollback.yml
```

---

## 🔑 Demo Evaluation Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin Evaluator** | `admin@example.com` | `password` | Review Queue, 1-Click Approve/Reject, Audit Oversight |
| **Apex InfraTech** | `applicant@example.com` | `password` | Bid Submission, Status Tracking, Technical Proposals |
| **Quantum Global** | `quantum@example.com` | `password` | Fiber Infrastructure Bidding |
| **CyberShield Defense** | `cybershield@example.com` | `password` | SIEM & Zero-Trust Bidding |
