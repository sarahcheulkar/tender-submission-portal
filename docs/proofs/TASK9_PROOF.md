# Task 9 Proof: Selenium Test Design and Local Execution

**Student:** Sarah Cheulkar  
**Roll No.:** 23102C0060  
**Subject:** DevOps Major Project  
**Date Completed:** October 14, 2026  
**Status:** COMPLETED

---

## 1. Identified User Journeys
1. **Journey 1: Command Center Landing & Tenders Catalog Verification**
   - Asserts page load, verifies main heading \"Tender Workflow Command Center\", checks that stat counter \"stat-spend\" is initialized.
2. **Journey 2: Tender Application Submission Modal and Form Validation**
   - Clicks \"#new-bid-btn\", verifies modal visibility (`#submission-modal`), asserts form fields and `#submit-button` are present.
3. **Journey 3: Reviewer Queue & Audit Ledger Rendering**
   - Verifies the submissions audit table body (`#submissions-table-body`) is properly rendered with historical bid items.

## 2. Test Execution Command
```bash
./mvnw test -Dtest=TenderPortalSeleniumTest
```

## 3. Maven Execution Log & Results
```
[INFO] Running com.tenderportal.TenderPortalSeleniumTest
Tomcat started on port 57442 (http) with context path ""
Started TenderPortalSeleniumTest in 1.911 seconds
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 11.32 s -- in com.tenderportal.TenderPortalSeleniumTest
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  12.748 s
```

## 4. Generated Artifacts & Automated Screenshots
- Surefire XML Report: `target/surefire-reports/TEST-com.tenderportal.TenderPortalSeleniumTest.xml`
- Captured Screenshots in `target/screenshots/`:
  - `Journey_1:_Command_Center_Landing_&_Tenders_Catalog_Verification.png` (348 KB)
  - `Journey_2:_Tender_Application_Submission_Modal_and_Form_Validation.png` (250 KB)
  - `Journey_3:_Reviewer_Queue_&_Audit_Ledger_Rendering.png` (349 KB)
