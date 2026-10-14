# Git Branching Strategy & Collaboration Policy

**Project:** Ansible-Provisioned Tender Submission Portal  
**Student:** Sarah Cheulkar (Roll No: 23102C0060)

---

## 1. Branch Hierarchy
* `main`: Production-ready, tagged releases only (`v1.0.0`). Protected branch.
* `develop`: Integration branch where feature branches merge after CI test passes.
* `feature/*`: Short-lived branches created for specific Kanban tasks.
  - `feature/tender-submission-engine`
  - `feature/reviewer-approval-console`
  - `feature/selenium-e2e-suite`
* `hotfix/*`: Urgent operational fixes branched directly off `main`.

## 2. Commit Message Convention (Conventional Commits)
* `feat(submission): implement positive bid amount validator`
* `fix(reviewer): require rejection comment before state transition`
* `test(selenium): add failure screenshot capture on assertion fail`
* `ci(jenkins): integrate parameterized deployment stage`
* `ansible(provision): add idempotent container launch task`

## 3. Merge Conflict Demonstration (Task 6)
To satisfy Task 6 requirements during viva:
1. Branch A changes default status styling in `styles.css`.
2. Branch B simultaneously updates status pill animations in `styles.css`.
3. Merging Branch B into `develop` triggers a Git conflict:
   ```bash
   git checkout develop
   git merge feature/branch-b
   # CONFLICT (content): Merge conflict in src/main/resources/static/css/styles.css
   # Resolve markers <<<<<<< HEAD ... >>>>>>>
   git add src/main/resources/static/css/styles.css
   git commit -m "merge: resolve CSS status pill animation conflict"
   ```
4. Tag final stable MVP:
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0: Fully Tested Tender Submission Portal"
   git push origin v1.0.0
   ```
