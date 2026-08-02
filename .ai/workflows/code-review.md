# Workflow: Code Review

Procedure for reviewing a diff (human PR or agent self-review). Use after every implementation.

---

## Review Order

1. Purpose & acceptance criteria
2. Security
3. Correctness / bugs
4. Architecture & boundaries
5. Performance
6. Tests
7. Readability & duplication
8. Docs & ops (API, migrations, flags)

Do not bikeshed formatting if a formatter owns it.

---

## Security Checklist

- [ ] No secrets committed
- [ ] Input validated at boundary
- [ ] Parameterized SQL / no injection sinks
- [ ] XSS sinks safe
- [ ] Authn present; authz object-level checks correct
- [ ] No IDOR (resource ownership checked)
- [ ] Sensitive data not logged
- [ ] CSRF/CORS correct for the auth model
- [ ] File upload constraints if applicable
- [ ] Dependency additions justified and audited

---

## Correctness Checklist

- [ ] Edge cases handled (empty, null, max length, retries)
- [ ] Error paths return correct status codes
- [ ] Transactions correct; no partial writes on failure
- [ ] Idempotency for retried mutations
- [ ] Backwards compatible or migration plan present
- [ ] Feature flags default safe if used

---

## Architecture Checklist

- [ ] Dependency direction preserved
- [ ] Controllers thin; no business logic in adapters
- [ ] No new cross-module deep imports
- [ ] No duplicate utilities / parallel abstractions
- [ ] Right layer for the change
- [ ] OOP preferred over procedural for business logic (`oop.md`)
- [ ] SOLID not violated without documented exception
- [ ] Domain invariants on entities; not anemic get/set mutation
- [ ] Pattern used when `architecture/patterns.md` criteria match (or N/A)

---

## Performance Checklist

- [ ] No N+1 queries
- [ ] Lists paginated / bounded
- [ ] Timeouts on external calls
- [ ] No unbounded memory buffering
- [ ] Hot-path work not doing unnecessary sync I/O

---

## Tests Checklist

- [ ] Tests match changed behavior
- [ ] Regression test for fixes
- [ ] No flaky patterns (sleep-based waits without need)
- [ ] No `.only` / skipped tests left behind

---

## Readability & Dead Code

- [ ] Names clear; functions within size limits
- [ ] No commented-out code
- [ ] No unused imports/exports introduced
- [ ] Diff free of unrelated churn

---

## API / Data

- [ ] OpenAPI updated
- [ ] Migration safe for rolling deploys
- [ ] Error envelope consistent
- [ ] No invented tables/fields

---

## Review Output Format

```markdown
## Verdict
Approve | Request changes | Block (security)

## Findings
### Blockers
- ...
### Major
- ...
### Minor
- ...
### Notes
- ...
```

Severity:

- **Blocker** — security issue, data loss, broken auth, broken prod deploy
- **Major** — incorrect behavior, missing tests for critical logic, architecture violation
- **Minor** — naming, small cleanups, non-blocking gaps

---

## Agent Self-Review Rule

Agents must run this workflow on their own diff and fix blockers/majors before presenting work as done. Surface residual risks explicitly.
