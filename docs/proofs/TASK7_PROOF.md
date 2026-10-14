# Task 7 Proof: Jenkins Installation and Continuous Integration

**Student:** Sarah Cheulkar  
**Roll No.:** 23102C0060  
**Subject:** DevOps Major Project  
**Date Completed:** October 14, 2026  
**Status:** COMPLETED

---

## 1. Jenkins Architecture & SCM Integration
- **Server URL:** `http://localhost:8081` (Dedicated Jenkins LTS controller)
- **SCM Repository:** `https://github.com/sarahcheulkar/tender-submission-portal.git`
- **Branch Specifier:** `*/main`
- **Build Tool:** Apache Maven 3.9 Wrapper (`./mvnw`) with OpenJDK 17/21
- **Job Name:** `Tender-Submission-Portal-Pipeline`

## 2. Continuous Integration Stages
1. **SCM Checkout:** Clones git repository and checks out commit `3e6fd75`.
2. **Compile & Static Analysis:** Compiles Java classes with `./mvnw clean compile`.
3. **Automated Unit Testing:** Executes unit tests via `./mvnw test -Dtest=TenderPortalApplicationTests,TenderServiceTest`.
4. **Artifact Packaging:** Produces executable Spring Boot JAR `target/tender-submission-portal-1.0.0.jar`.
5. **Artifact Archiving:** Fingerprints and archives `target/*.jar` for deployment.

## 3. Build Evidence
```
Started by user anonymous
Running in Durability level: MAX_SURVIVABILITY
[Pipeline] Start of Pipeline
[Pipeline] stage (Checkout SCM)
==> Fetching source code from Git repository for Sarah Cheulkar (23102C0060)...
 > git clone https://github.com/sarahcheulkar/tender-submission-portal.git
[Pipeline] stage (Compile & Static Analysis)
+ ./mvnw clean compile
[INFO] BUILD SUCCESS
[Pipeline] stage (Unit Testing)
+ ./mvnw test -Dtest=TenderPortalApplicationTests,TenderServiceTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[Pipeline] junit
Recording test results
[Pipeline] stage (Package Artifact)
+ ./mvnw package -DskipTests
[Pipeline] stage (Archive Artifacts)
Archiving artifacts
Recorded 1 distinct fingerprints
```
