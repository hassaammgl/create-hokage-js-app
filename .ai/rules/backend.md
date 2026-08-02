# Backend Rules

Rules for server-side application code: HTTP adapters, services, persistence, jobs, and resilience. Pair with `architecture.md`, `api.md`, `database.md`, and `security.md`.

---

## Controllers / Route Handlers

- Controllers may: parse/validate input (via schema), call one application service/use case, map result to HTTP status/body, set headers.
- Controllers must not: contain business rules, open DB transactions directly, call multiple repositories, perform complex branching on domain state.
- Keep handlers thin — typically under 30 lines excluding schema definitions.
- One route handler → one primary use case. Fan-out orchestration belongs in the application service.
- Never return ORM entities directly; map to response DTOs.

**Why:** Fat controllers become untestable and duplicate rules across endpoints.

---

## Services / Use Cases

- Own business orchestration, authorization decisions for the operation, and transaction boundaries.
- Must not import HTTP framework request/response classes.
- Must not embed raw SQL (use repositories).
- Accept and return DTOs or domain types — not transport objects.
- Keep side effects explicit: persistence, events, emails, metrics.
- For multi-step workflows that can fail mid-way, define compensation or use transactional outbox + async continuation.

---

## Repositories

- May only access persistence (DB, search index adapter for that aggregate, etc.).
- No HTTP calls, no sending emails, no publishing events unless the project’s unit-of-work explicitly owns outbox writes in the same transaction.
- Methods return domain objects or query models — not `DataFrame`-style unstructured bags without a type.
- Never use `SELECT *` in hand-written SQL. List columns explicitly.
- All list queries that can grow must accept a limit (and usually offset/cursor).
- Encapsulate query details; callers should not assemble SQL fragments.

---

## Domain Models

- Enforce invariants in constructors/factories (`Order.create(...)` throws/rejects on invalid lines).
- Prefer value objects for Money, Email, PhoneNumber with validation once at creation.
- Identity: use explicit IDs; do not rely on ORM dirty-checking alone for domain events.
- Keep domain free of framework annotations when practicing Clean/Hexagonal architecture; if the project uses active-record style, document that exception and still keep HTTP out of models.

---

## Validation

- Validate all external input at the boundary (HTTP, queue message, gRPC) with a schema (Zod, Joi, class-validator, Pydantic, Bean Validation, etc.).
- Re-validate or enforce invariants again in domain when crossing into privileged operations.
- Reject unknown fields on write APIs when using strict schemas (prevents mass-assignment).
- Return 400 with field-level errors for validation failures — see `api.md`.
- Never trust client-supplied `userId` for authorization; take identity from the authenticated principal.

---

## DTOs

- Request DTOs: only fields the client may set.
- Response DTOs: only fields the client may see; strip internal flags, password hashes, internal notes.
- Separate create/update/response types when shapes differ.
- Mapping functions are pure and unit-tested for critical fields.

---

## Authentication

- Authenticate before authorization.
- Prefer standard mechanisms already in the repo (session cookie, JWT bearer, mTLS).
- Passwords: hash with Argon2id or bcrypt (cost calibrated); never store plaintext or reversible encryption for passwords.
- Tokens: store refresh tokens hashed at rest; rotate on use when the project requires.
- Session fixation: rotate session ID on login.
- Clock skew: allow small leeway for JWT `exp`/`nbf` only as configured.

---

## Authorization

- Check authorization in the application service (or a dedicated policy module called from it), not only in UI.
- Prefer deny-by-default RBAC/ABAC policies.
- Object-level auth: verify the principal owns or may access the resource (`order.customerId === principal.id` or policy service).
- Never use “hidden URL” as access control.
- Log authorization denials at `warn` with principal id and resource type/id (no sensitive payload).

---

## Transactions

- Start transactions in the application service / unit of work, not in controllers.
- Keep transactions short: no external HTTP calls inside an open DB transaction.
- Set explicit isolation when required (e.g. `SERIALIZABLE` for contested inventory) and document why.
- On failure, roll back fully; do not catch-and-continue leaving partial writes.
- Use outbox table for events that must commit atomically with state changes.

---

## Background Jobs & Queues

- Enqueue jobs with a stable `jobId` / idempotency key for operations that must not double-run.
- Handlers must be idempotent: safe under at-least-once delivery.
- Set visibility timeout / ack deadline > worst-case processing time.
- Dead-letter failed messages after max retries; alert on DLQ depth.
- Do not process unbounded payloads in-memory; stream or chunk large files.
- Pass identifiers in messages, not giant snapshots, unless snapshot is required for consistency.

---

## Redis & Caching

- Every cache key includes a version or namespace prefix: `{service}:{entity}:{id}:v{n}`.
- Set TTL on all keys unless using explicit persistent Redis data structures with documented lifecycle.
- Cache only data that is safe to serve stale for TTL duration, or use explicit invalidation on write.
- Never cache unauthorized personalized data under a key that omits user/tenant id.
- Protect against cache stampede: singleflight / locking / probabilistic early expiration for hot keys.
- Treat Redis as best-effort for cache; source of truth remains the primary database unless Redis is the designated store for that data structure (e.g. rate limit counters).

---

## Pagination, Filtering, Search

- Default page size: 20 (or project default). Max page size: 100 unless a justified export endpoint uses streaming/async jobs.
- Prefer cursor pagination for large/stable feeds; offset is acceptable for small admin UIs.
- Filtering: whitelist allowed fields and operators; never accept raw SQL/`order by` strings from clients.
- Search: use parameterized full-text or search engine APIs; escape user input per engine rules.
- Return pagination metadata: `nextCursor` / `total` only if cheap; avoid exact `COUNT(*)` on huge tables when approximate is enough.

---

## File Uploads

- Validate content type by magic bytes, not only `Content-Type` header.
- Enforce max size at reverse proxy and application.
- Store files outside the web root (object storage). Serve via signed URLs.
- Generate server-side object keys; never use raw user filenames as storage paths without sanitization.
- Scan for malware when policy requires.
- Do not process ZIP bombs / unbounded decompression in request threads.

---

## Rate Limiting

- Apply rate limits per principal and per IP at the edge or gateway.
- Return `429` with `Retry-After` when limited.
- Separate limits for authenticated vs anonymous traffic.
- Expensive endpoints (search, export, AI, password reset) get stricter limits.

---

## Idempotency

- Mutating endpoints that may be retried by clients (`POST` payments, provisioning) accept `Idempotency-Key` header.
- Persist key + request hash + response for a documented retention window.
- Replays with same key + same body return the original result; same key + different body return `409`.
- Idempotency keys are scoped per principal.

**Why:** Mobile and gateway retries duplicate charges without idempotency.

---

## Retry Policies

- Retry only idempotent side effects, or retries guarded by idempotency keys.
- Exponential backoff with jitter; cap attempts (e.g. 3–5 for sync HTTP).
- Do not retry `400`/`401`/`403`/`422`; do retry `408`/`429`/`502`/`503`/`504` with backoff.
- Propagate correlation IDs on retries.

---

## Circuit Breakers

- Wrap calls to unreliable dependencies (payments, email, partner APIs) with circuit breakers.
- Open circuit → fail fast or degraded mode; do not pile up threads.
- Emit metrics on open/half-open/close transitions.
- Timeouts must be shorter than upstream SLOs chain budgets.

---

## Configuration

- Read config from environment / secret manager at startup; fail fast on missing required vars.
- Never invent environment variable names — use those documented in the repo.
- Feature flags default to safe-off for risky paths.

---

## Backend Checklist (Inline)

- [ ] Controller thin; business logic in service
- [ ] Input validated; authn/authz enforced
- [ ] Repository has no business rules; no `SELECT *`
- [ ] Transactions short; no remote calls inside
- [ ] External calls: timeout + retry policy + circuit breaker where needed
- [ ] Mutating retried operations are idempotent
- [ ] Cache keys include tenant/user when needed; TTLs set
- [ ] Uploads validated and stored safely
- [ ] No secrets in code; config from env/secret manager
