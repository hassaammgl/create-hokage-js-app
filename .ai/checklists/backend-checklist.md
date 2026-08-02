# Backend Checklist

Use before merging backend changes. Check every item that applies; mark N/A only with a one-line reason.

---

## Architecture & Structure

- [ ] Change lives in the correct layer (controller / service / domain / repository / infrastructure)
- [ ] Controllers contain no business rules
- [ ] Services do not import HTTP request/response types
- [ ] Repositories access persistence only
- [ ] No new cross-module deep imports
- [ ] No duplicate utilities introduced (searched first)

---

## Correctness

- [ ] Happy path works per acceptance criteria
- [ ] Validation covers required fields, types, ranges, unknown-field policy
- [ ] Authorization enforced in application layer (object-level where IDs are passed)
- [ ] Transaction boundaries correct; rollback on failure
- [ ] No remote I/O inside open DB transactions
- [ ] Idempotency keys supported for critical retried POSTs
- [ ] Background jobs are idempotent
- [ ] Feature flags default to safe-off when used

---

## Data & SQL

- [ ] No `SELECT *` in application SQL
- [ ] List queries bounded (limit/cursor)
- [ ] Migrations present for schema changes; expand/contract safe
- [ ] FK columns indexed; constraints match invariants
- [ ] Money not stored as floating point
- [ ] Multi-tenant filters applied when applicable

---

## Resilience

- [ ] External HTTP/gRPC/Redis calls have explicit timeouts
- [ ] Retries only on idempotent operations (or guarded by idempotency)
- [ ] Circuit breaker / degraded mode for critical unstable deps when already a project pattern
- [ ] Rate limiting considered for expensive endpoints

---

## Caching

- [ ] Cache keys include namespace + tenant/user when needed
- [ ] TTL set; invalidation strategy defined
- [ ] Not caching unauthorized personalized data under shared keys

---

## Observability

- [ ] Structured logs on failure paths with entity ids
- [ ] Correlation/request id propagated
- [ ] Secrets/PII not logged
- [ ] Metrics/traces considered for new hot paths

---

## Tests

- [ ] Unit tests for business rules
- [ ] Integration tests for persistence/transactions when touched
- [ ] Regression test for bug fixes
- [ ] Tests pass locally/CI for touched packages

---

## Security

- [ ] Parameterized queries only
- [ ] No secrets in code or config committed
- [ ] Uploads validated (type/size/path) if applicable
- [ ] Error responses do not leak internals

---

## Docs & Contracts

- [ ] OpenAPI updated for API changes
- [ ] `.env.example` updated only with real new var names
- [ ] Runbook/ADR updated if behavior/architecture shifted significantly

---

## Final

- [ ] Self-review per `.ai/workflows/code-review.md` completed
- [ ] Diff is minimal and free of unrelated churn
