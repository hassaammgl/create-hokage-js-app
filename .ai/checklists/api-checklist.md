# API Checklist

Use before merging HTTP API changes.

---

## Contract

- [ ] Resource paths follow project REST conventions
- [ ] Correct HTTP method semantics (`GET` is read-only)
- [ ] OpenAPI/Swagger updated in the same PR
- [ ] Examples updated for non-obvious payloads
- [ ] Generated clients regenerated if the project requires it

---

## Requests

- [ ] Input schema validation on all write endpoints
- [ ] Unknown fields rejected or documented ignore policy
- [ ] Auth requirements documented and enforced
- [ ] Idempotency-Key supported for critical POSTs
- [ ] Size limits enforced for bodies/uploads

---

## Responses

- [ ] Success status codes correct (`201`+`Location` on create when applicable)
- [ ] Error envelope consistent with existing API
- [ ] Stable error `code` values for client branching
- [ ] `requestId` included on errors
- [ ] No stack traces, SQL, or internal hosts in bodies
- [ ] Dates ISO-8601; IDs typed consistently

---

## Lists

- [ ] Pagination default + max enforced
- [ ] Cursor/offset semantics documented
- [ ] Sort fields allowlisted
- [ ] Filter fields allowlisted; no raw SQL from clients
- [ ] Deterministic default sort

---

## Compatibility

- [ ] Additive vs breaking change classified
- [ ] Versioning strategy followed for breaking changes
- [ ] Deprecation notes added when retiring fields/endpoints
- [ ] Consumers considered (mobile, other services)

---

## Security

- [ ] Object-level authorization on ID-based routes
- [ ] `404` vs `403` policy consistent with privacy needs
- [ ] Rate limiting considered for expensive routes
- [ ] CORS allowlist unchanged unless intentionally updated

---

## Observability

- [ ] Route templates used for metrics (low cardinality)
- [ ] Important failures logged with ids

---

## Tests

- [ ] Contract/integration tests for new/changed endpoints
- [ ] Validation and auth failure cases covered

---

## Final

- [ ] Self-review completed
- [ ] Changelog/release notes updated if user-facing
