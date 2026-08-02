# Release Checklist

Use before production release or tagged deploy.

---

## Code Readiness

- [ ] All intended PRs merged; release branch/tag identified by git SHA
- [ ] CI green on the release commit
- [ ] No `TODO`/`FIXME` on critical path without tickets
- [ ] Feature flags configured for incomplete features (safe defaults)

---

## Compatibility

- [ ] API changes backward compatible or versioned with consumer plan
- [ ] Database migrations applied/tested with expand/contract strategy
- [ ] Code compatible with currently deployed schema during rollout
- [ ] Message/event consumers tolerate dual formats during transition

---

## Quality Gates

- [ ] Automated tests passed (unit/integration/E2E as required by pipeline)
- [ ] Security checklist completed for release-scoped changes
- [ ] Dependency critical CVEs addressed or risk-accepted explicitly
- [ ] Performance budgets checked for hot-path changes

---

## Observability & Ops

- [ ] Dashboards include new critical metrics/endpoints
- [ ] Alerts/SLOs updated when new failure modes appear
- [ ] Runbooks updated for new operational procedures
- [ ] Log/audit events verified for sensitive flows

---

## Deployment Plan

- [ ] Artifact immutable and promoted (same build to prod)
- [ ] Migration order documented (migrate → deploy → contract later)
- [ ] Rollout strategy chosen (rolling/canary/blue-green)
- [ ] Health/readiness probes verified
- [ ] Graceful shutdown behavior verified for in-flight requests/jobs
- [ ] Rollback owner + command/path documented
- [ ] Communicate change window to stakeholders when required

---

## Data Safety

- [ ] Backups verified recent and restorable for risky migrations
- [ ] No destructive migration without approved plan
- [ ] Seed/admin tasks are idempotent and logged

---

## Post-Deploy Verification

- [ ] Smoke test critical user journeys in production
- [ ] Error rate, latency, saturation within normal bounds
- [ ] No DLQ explosion / worker crash loops
- [ ] Synthetic checks green
- [ ] Announce completion / monitor through soak period

---

## Hotfix Extra

- [ ] Minimal diff; regression test included
- [ ] Backport to main planned if branched from release tag
- [ ] Incident ticket linked

---

## Final Sign-Off

- [ ] Owner acknowledges checklist complete
- [ ] Version/tag published
- [ ] Changelog updated for user-facing changes
