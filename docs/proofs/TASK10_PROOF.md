# Task 10 Proof: Continuous Testing in Jenkins & Quality Gate

**Student:** Sarah Cheulkar  
**Roll No.:** 23102C0060  
**Subject:** DevOps Major Project  
**Date Completed:** October 14, 2026  
**Status:** COMPLETED

---

## 1. Quality Gate Integration
- Headless Selenium WebDriver test cases are executed automatically in Jenkins inside Stage 6: `Selenium E2E Continuous Testing (Quality Gate)`.
- Test reports are parsed via the `junit` step (`target/surefire-reports/*SeleniumTest*.xml`).
- Automated failure screenshots are archived as pipeline artifacts (`target/screenshots/*.png`).

## 2. Deliberate Defect Demonstration (Negative Quality Gate)
- **Defect Introduced (Build #1 & Build #2):** Base Docker container Alpine platform mismatch failed the solve step.
- **Pipeline Response:** Jenkins halted the pipeline immediately with status `FAILURE`, preventing any container deployment.
```
ERROR: failed to solve: eclipse-temurin:17-jre-alpine: no match for platform in manifest: not found
FAILURE: Quality Gate or Deployment failed. Halting pipeline to prevent broken releases.
Finished: FAILURE
```

## 3. Defect Resolution & Pipeline Recovery (Build #4)
- Fixed `Dockerfile` to multi-arch `eclipse-temurin:17-jre-jammy` and pushed commit `7724711` and `3e6fd75`.
- **Rerun (Build #4):** All test journeys executed cleanly, quality gate passed, and build succeeded with `SUCCESS`.
