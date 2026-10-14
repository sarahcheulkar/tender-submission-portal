# Task 14 Proof: Automated Provisioning, Idempotency & Rollback Validation

**Student:** Sarah Cheulkar  
**Roll No.:** 23102C0060  
**Subject:** DevOps Major Project  
**Date Completed:** October 14, 2026  
**Status:** COMPLETED

---

## 1. Idempotency Demonstration
A hallmark of reliable Infrastructure as Code is **idempotency**: executing the playbook repeatedly against an already configured server results in zero state mutations (`changed=0`).

**Second Playbook Run Output:**
```
$ ansible-playbook -i inventory.ini playbook.yml

PLAY [Provision and Deploy Tender Submission Portal (Sarah Cheulkar - 23102C0060)] ***
...
PLAY RECAP *********************************************************************
localhost                  : ok=7    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
```
`changed=0` proves 100% configuration idempotency.

---

## 2. Disaster Recovery & Rollback Execution
To prove system resilience, the disaster recovery playbook `ansible/rollback.yml` was executed to automatically detect broken instances, tear down containers, and rollback to the previous stable release.

**Rollback Execution Output:**
```
$ ansible-playbook -i inventory.ini rollback.yml

PLAY [Automated Rollback and Recovery Playbook (Task 14)] **********************

TASK [Step 1: Check container health] ******************************************
changed: [localhost]

TASK [Step 2: Stop and remove broken container] ********************************
changed: [localhost]

TASK [Step 3: Remove container] ************************************************
changed: [localhost]

TASK [Step 4: Rollback to previous known-good stable release] ******************
changed: [localhost]

TASK [Step 5: Verify recovered service health] *********************************
ok: [localhost]

TASK [Step 6: Report rollback success] *****************************************
ok: [localhost] => {
    "msg": "Successfully restored Tender Portal container service to healthy state on port 8082."
}

PLAY RECAP *********************************************************************
localhost                  : ok=6    changed=4    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
```
