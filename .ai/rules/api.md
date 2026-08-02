# API Rules

Conventions for HTTP APIs (REST-first). If the project uses GraphQL/gRPC, map these principles to that style and follow existing schema conventions.

---

## REST Resource Conventions

- Resources are nouns: `/orders`, `/orders/{orderId}`, `/customers/{customerId}/orders`.
- Use plural collection names consistently.
- Nest only when the child is meaningfully scoped by parent; avoid deep nests beyond 2–3 segments — prefer `GET /orders?customerId=`.
- Actions that are not CRUD map to:
  - Sub-resources: `POST /orders/{id}/cancellation`
  - Or intentional RPC-style endpoints documented as such: `POST /orders/{id}:cancel` (Google AIP style) — pick one style per API and stick to it.
- Do not put verbs in query strings for mutations (`/orders?action=cancel`).

---

## HTTP Methods

| Method | Semantics | Idempotent | Safe |
|--------|-----------|------------|------|
| `GET` | Read | Yes | Yes |
| `HEAD` | Headers only | Yes | Yes |
| `POST` | Create or non-idempotent action | No* | No |
| `PUT` | Full replace | Yes | No |
| `PATCH` | Partial update | Usually | No |
| `DELETE` | Remove | Yes | No |

\*Make critical `POST`s idempotent via `Idempotency-Key` when clients retry.

- `GET` must not mutate state.
- Prefer `PATCH` with explicit patch semantics (JSON Merge Patch or JSON Patch) over overloaded `PUT` when clients send partial updates.

---

## Status Codes

| Code | When |
|------|------|
| `200` | Success with body |
| `201` | Created; include `Location` header when applicable |
| `202` | Accepted for async processing |
| `204` | Success with no body |
| `400` | Validation / malformed request |
| `401` | Unauthenticated |
| `403` | Authenticated but not allowed |
| `404` | Resource not found (or not visible — do not leak existence when security requires) |
| `409` | Conflict (version, duplicate idempotency body mismatch, state conflict) |
| `422` | Semantically invalid (optional; use if project distinguishes from `400`) |
| `429` | Rate limited |
| `500` | Unexpected server error |
| `503` | Dependency / overload unavailable |

Do not return `200` with an error payload for failures. Do not use `500` for client mistakes.

---

## Response Format

Standard success envelope (adapt to project existing shape — do not invent a second envelope):

```json
{
  "data": { },
  "meta": { }
}
```

List responses:

```json
{
  "data": [ ],
  "meta": {
    "nextCursor": "eyJvZmZzZXQiOjIwfQ",
    "limit": 20
  }
}
```

Rules:

- Match the envelope already used in the repository.
- Dates in ISO-8601 UTC (`2026-08-02T12:00:00Z`).
- IDs as strings if they are UUIDs/ULIDs to avoid JS precision issues.

---

## Error Format

Consistent machine-readable errors:

```json
{
  "error": {
    "code": "ORDER_NOT_MODIFIABLE",
    "message": "Shipped orders cannot be cancelled.",
    "details": [
      { "field": "status", "code": "INVALID_STATE", "message": "Current status is SHIPPED." }
    ],
    "requestId": "req_01HXYZ..."
  }
}
```

Rules:

- `code` is stable for clients; `message` may be localized later.
- Include `requestId` / correlation id matching logs.
- Validation errors list per-field `details`.
- Never include stack traces, SQL, or internal hostnames in error bodies.

---

## Pagination

- Default `limit=20`, max `limit=100` (document exceptions for admin exports).
- Prefer opaque cursors over raw offsets for public APIs.
- Always return enough for the client to fetch the next page or know it is done.
- Reject negative limits/offsets with `400`.

---

## Sorting

- Explicit allowlist: `sort=createdAt` / `sort=-createdAt`.
- Never pass client strings directly into `ORDER BY`.
- Default sort must be deterministic (tie-break on `id`).

---

## Filtering

- Whitelist filter fields and operators (`eq`, `gt`, `gte`, `lt`, `lte`, `in`).
- Document filters in OpenAPI.
- Reject unknown filters in strict APIs; ignore only if the project already documents ignore semantics.
- Multi-tenant filters: always applied server-side from the principal, never solely from client input.

---

## Versioning

Pick one and document it:

1. URL path: `/v1/orders` (common, explicit)
2. Header: `Accept: application/vnd.company.v1+json`

Rules:

- Breaking changes require a new version or coordinated migration.
- Additive fields are usually non-breaking; removing/renaming fields is breaking.
- Support old versions through a published deprecation window; emit deprecation headers when possible.
- Do not maintain forever-growing incompatible behaviors under the same version.

---

## Idempotency

- Document which `POST` endpoints support `Idempotency-Key`.
- Keys: 1–255 chars, scoped per principal, retained for a defined period (e.g. 24h).
- Same key + same request body → same result; same key + different body → `409`.

---

## Authentication & Headers

- `Authorization: Bearer <token>` or session cookie per project standard.
- Accept `X-Request-Id` / generate one if missing; echo it in responses.
- `Content-Type: application/json` for JSON bodies.
- Use `ETag` / `If-Match` for concurrent update safety on contested resources when needed.

---

## OpenAPI / Swagger

- OpenAPI spec is the contract. Update it in the same PR as API changes.
- Generate clients/types from the spec when the project does so — do not hand-diverge.
- Every endpoint documents: auth requirements, request/response schemas, status codes, error codes.
- Examples in the spec for non-obvious payloads.
- CI should fail on spec drift when such a check exists.

**Why:** Undocumented fields become shadow contracts that break silently.

---

## Breaking Change Policy

Breaking:

- Removing a field
- Renaming a field
- Changing field type/semantics
- Making optional request field required
- Changing auth requirements to stricter without version bump

Non-breaking:

- Adding optional response fields
- Adding new endpoints
- Adding optional request fields with defaults
- Softening constraints

---

## API Checklist (Inline)

- [ ] Correct method and status codes
- [ ] Consistent error envelope with stable `code` and `requestId`
- [ ] Pagination bounded; sort/filter allowlisted
- [ ] Auth documented and enforced
- [ ] OpenAPI updated
- [ ] No stack traces in responses
- [ ] Idempotency for critical POST retries
- [ ] Versioning / compatibility considered
