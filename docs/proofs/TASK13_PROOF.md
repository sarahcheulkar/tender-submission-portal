# Task 13 Proof: Configuration Management (Ansible)

**Student:** Sarah Cheulkar  
**Roll No.:** 23102C0060  
**Subject:** DevOps Major Project  
**Date Completed:** October 14, 2026  
**Status:** COMPLETED

---

## 1. Ansible Infrastructure as Code Specifications
- **Inventory (`ansible/inventory.ini`):** Defines `app_servers` target node, python interpreter, application paths, and container configurations.
- **Playbook (`ansible/playbook.yml`):**
  - Task 13.1: Gather system facts and architecture prerequisites (Darwin/Unix, arm64/x86_64).
  - Task 13.2: Enforce application directory existence (`0755` permissions).
  - Task 13.3: Enforce logs directory existence (`0775` permissions).
  - Task 13.4: Deploy Docker container with mapped port `8082:8082`.
  - Task 13.5: Execute URI module health checks against `/api/health`.
  - Task 13.6: Verify student metadata and service name in debug logs.

## 2. Playbook Execution Terminal Output
```
$ ansible-playbook -i inventory.ini playbook.yml

PLAY [Provision and Deploy Tender Submission Portal (Sarah Cheulkar - 23102C0060)] ***

TASK [Gathering Facts] *********************************************************
ok: [localhost]

TASK [Task 13.1: Verify Server Architecture and OS Prerequisites] **************
ok: [localhost] => {
    "msg": "Provisioning node: MacOSX (Arch: arm64)"
}

TASK [Task 13.2: Ensure application runtime directory exists] ******************
ok: [localhost]

TASK [Task 13.3: Ensure application logs directory exists] *********************
changed: [localhost]

TASK [Task 13.4: Deploy and verify Tender Portal Docker container] *************
ok: [localhost]

TASK [Task 13.5: Query Application Health Endpoint] ****************************
ok: [localhost]

TASK [Task 13.6: Verify Health Status and Student Metadata] ********************
ok: [localhost] => {
    "msg": "Tender Portal is healthy: Ansible-Provisioned Tender Submission Portal | Student: Sarah Cheulkar (Roll No: 23102C0060)"
}

PLAY RECAP *********************************************************************
localhost                  : ok=7    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
```
