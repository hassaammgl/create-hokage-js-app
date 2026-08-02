# Deployment Rules

Rules for shipping software safely. Adapt to the project’s platform (Kubernetes, PaaS, serverless, VMs) without inventing new infra that the repo does not use.

---

## Deployment Principles

- Deployments must be automated from CI/CD — not manual “build on laptop and SCP.”
- Artifacts are immutable: build once, promote the same artifact across environments.
- Every deploy is identifiable by version/git SHA.
- Prefer rolling / blue-green / canary over “stop the world” when the service is user-facing.
- Never invent deployment env vars, cluster names, or service names — use repo/IaC sources of truth.

---

## Environments

| Env | Purpose | Data |
|-----|---------|------|
| Local | Developer machines | Fake/seed data |
| Dev/Ephemeral | PR previews when available | Non-prod |
| Staging | Pre-prod validation | Anonymized or synthetic |
| Production | Real users | Real data — highest controls |

Rules:

- Prod credentials never in local defaults.
- Schema migrations tested on staging before prod.
- Access to prod deploy is restricted and audited.

---

## Migrations in Deploys

- Expand/contract: deploy code compatible with both old and new schema during rollout.
- Order:
  1. Backward-compatible migration
  2. Deploy code
  3. Later remove old schema after all instances upgraded
- Avoid migrations that lock large tables during peak traffic.
- Have a rollback plan: code rollback must work with the migrated schema, or forward-fix only with documented steps.

---

## Health Checks

- `/health` or platform probe: process up (liveness).
- `/ready`: can accept traffic (DB pool, critical deps) — readiness fails remove instance from LB without killing unnecessarily.
- Health endpoints must not require auth and must be cheap.
- Do not deep-check every dependency on every probe if it causes thundering herd — check critically and cache briefly if needed.

---

## Configuration & Secrets

- Config via env / platform config / secret manager.
- Change prod config through reviewed channels (IaC, change tickets), not ad-hoc SSH edits.
- Feature flags for risky rollouts; default safe.
- Separate image from config — same image, different config per env.

---

## Zero-Downtime Practices

- Drain connections on shutdown (graceful SIGTERM handling).
- Set termination grace period > longest in-flight request budget.
- Sticky sessions only when required; prefer stateless app tiers.
- Warm caches/JIT carefully on canaries before full rollout.

---

## Rollbacks

- One-command rollback to previous artifact when schema allows.
- Monitor error rate, latency, saturation during deploy windows.
- Automatic rollback triggers when the platform supports them (failed health, spike in 5xx).
- Communicate customer-facing incidents per on-call process.

---

## Jobs & Workers

- Deploy workers compatible with queue message versions (tolerant readers).
- Pause or scale consumers carefully during breaking message format changes.
- Idempotent consumers so redeploys/retries are safe.

---

## Infrastructure as Code

- Infra changes go through PR review like application code.
- No snowflake servers as the long-term state.
- Document manual break-glass steps if they exist; convert to IaC afterward.

---

## Observability on Deploy

- Emit deploy events/markers in APM/logs.
- Dashboards: golden signals (latency, traffic, errors, saturation).
- Alerts on SLO burn — not only on raw CPU.

---

## Agent Constraints

- Do not run destructive prod commands (`terraform destroy`, drop DB, force-push release tags) without explicit human instruction.
- Do not modify CI deploy secrets in code.
- When adding a service dependency, update deploy manifests/helm/terraform already used by the project — do not invent a parallel deploy path.

---

## Deployment Checklist (Inline)

- [ ] Artifact versioned and promoted identically
- [ ] Migration backward compatible with rolling deploy
- [ ] Health/readiness correct
- [ ] Secrets via secret manager; no secrets in images
- [ ] Graceful shutdown handled
- [ ] Rollback path known
- [ ] Dashboards/alerts considered for new critical paths
