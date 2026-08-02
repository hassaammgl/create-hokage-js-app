# Security Rules

Security is a release blocker. Agents must treat these as hard constraints. Pair with `logging.md` and checklists in `checklists/security-checklist.md`.

---

## Trust Boundaries

- All input from clients, browsers, mobile apps, webhooks, and third parties is untrusted.
- Validate type, length, range, and format at the boundary.
- Encode/escape at the sink (HTML, SQL, shell, URL) appropriate to context.
- Authenticate first, authorize second, then execute business logic.

---

## SQL Injection

- Use parameterized queries / prepared statements / bind parameters exclusively.
- Never concatenate user input into SQL strings.
- Never pass client strings into `ORDER BY`, table names, or column names — use allowlists.
- ORM query builders are safe only when used with bound parameters, not raw string interpolation.

```text
// BAD
db.query("SELECT * FROM users WHERE email = '" + email + "'")

// GOOD
db.query("SELECT id, email FROM users WHERE email = $1", [email])
```

**Why:** SQL injection yields full database compromise.

---

## XSS (Cross-Site Scripting)

- Use framework auto-escaping for HTML.
- Ban unsanitized `innerHTML` / `dangerouslySetInnerHTML` / `v-html` for user content.
- Sanitize HTML with an allowlist library when rich text is required.
- Set `Content-Type` correctly; avoid serving user uploads as HTML from privileged origins.
- Use CSP (`Content-Security-Policy`) in production — prefer nonce/hash-based scripts over `unsafe-inline`.

---

## CSRF (Cross-Site Request Forgery)

- For cookie-based session auth on state-changing requests: require CSRF tokens or SameSite=strict/lax cookies plus additional defenses per stack.
- Prefer `SameSite=Lax` or `Strict` on session cookies.
- Do not rely on CORS alone as CSRF protection for cookie credentials.

---

## CORS

- Allowlist specific origins — never reflect arbitrary `Origin` with credentials.
- `Access-Control-Allow-Origin: *` is forbidden when `Access-Control-Allow-Credentials: true`.
- Expose only required headers; allow only required methods.
- Preflight caches (`max-age`) set intentionally.

---

## JWT

- Use strong algorithms (`RS256`/`ES256` preferred for distributed verification; `HS256` only with strong secrets and careful key management).
- Validate `exp`, `iss`, `aud`, signature always.
- Keep access tokens short-lived (minutes). Use refresh tokens with rotation and revocation where applicable.
- Do not store sensitive PII inside JWT payloads; treat payload as readable by clients.
- Reject `alg=none`. Pin accepted algorithms in the verifier.
- On logout/revocation: deny lists or versioned session stamps for access tokens when required by threat model.

---

## OAuth / OIDC

- Use authorization code flow with PKCE for public clients.
- Validate `state` and `nonce` (OIDC).
- Store client secrets only on confidential clients / servers.
- Scope minimally; do not request unused scopes.
- Validate redirect URIs against exact allowlist (no wildcard open redirects).

---

## Password Hashing

- Hash passwords with Argon2id (preferred) or bcrypt with appropriate cost.
- Never use MD5, SHA1, or unsalted SHA256 for passwords.
- Timing-safe comparison for password/token checks.
- Password reset tokens: single-use, short TTL, high entropy, stored hashed.

---

## Secrets Management

- Never commit secrets (API keys, private keys, passwords, `.env` with production secrets).
- Load secrets from environment or a secret manager (Vault, cloud secret stores).
- Never invent environment variable names — use documented names only.
- Rotate secrets when leaked; treat git history as compromised if secrets were committed.
- Agents: if a secret appears in a diff, stop and warn — do not commit.

---

## Environment Variables

- Document required env vars in `.env.example` with placeholder values only.
- Fail fast at startup if required secrets are missing.
- Separate configs per environment (dev/stage/prod); never point dev tools at prod credentials by default.

---

## Input Validation

- Prefer schema validation (length, enum, format, numeric ranges).
- File uploads: size limits, type checks (magic bytes), safe storage paths.
- URL inputs: scheme allowlist (`https`), block dangerous schemes (`javascript:`).
- Deserialization: never deserialize untrusted data into executable objects (Java serialization, `pickle`, YAML `load` with arbitrary types).

---

## Output Encoding

- HTML context: escape `<`, `>`, `&`, quotes.
- JavaScript context: do not embed untrusted data inside `<script>` without strict encoding.
- CSV export: neutralize formula injection (`=`, `+`, `-`, `@` prefixes).
- Logs: mask secrets and sensitive PII — see `logging.md`.

---

## Authentication & Session

- Rate-limit login, password reset, and OTP endpoints.
- Lockout or exponential backoff after repeated failures (balance with DoS of legitimate users — prefer soft rate limits + CAPTCHA/risk checks).
- Session cookies: `HttpOnly`, `Secure`, `SameSite` set appropriately.
- Fixate: regenerate session on privilege elevation (login).

---

## Authorization

- Deny by default.
- Check object-level permissions on every request by ID — not only on list endpoints.
- Prevent IDOR: access `GET /orders/123` only if principal may view order 123.
- Admin actions require elevated roles and audit logs.

---

## Security Headers

Set (via reverse proxy or app):

| Header | Purpose |
|--------|---------|
| `Content-Security-Policy` | Mitigate XSS/asset injection |
| `Strict-Transport-Security` | Enforce HTTPS |
| `X-Content-Type-Options: nosniff` | Reduce MIME sniffing attacks |
| `Referrer-Policy` | Limit referrer leakage |
| `Permissions-Policy` | Disable unused browser features |
| `X-Frame-Options` / CSP `frame-ancestors` | Clickjacking defense |

---

## Dependency Auditing

- Run `npm audit` / `pip audit` / `govulncheck` / equivalent in CI.
- Do not introduce packages with known critical CVEs.
- Pin versions; review new dependencies for maintenance and permission surface — see `dependencies.md`.
- Remove unused dependencies.

---

## Logging & Privacy

- Do not log passwords, tokens, session IDs, full PANs, government IDs, or health data.
- Mask or hash where correlation is needed.
- Audit log security-sensitive events: login failures, permission changes, secret access (where applicable).

---

## SSRF, RCE, Path Traversal

- SSRF: do not fetch client-supplied URLs without allowlist/block private IP ranges.
- RCE: never pass user input to shell without strict escaping; prefer argv arrays over shell strings.
- Path traversal: resolve paths under an allowed root; reject `..` segments.

---

## Security Checklist (Inline)

- [ ] Parameterized SQL only
- [ ] Output escaped / HTML sanitized
- [ ] CSRF defended for cookie sessions
- [ ] CORS origins allowlisted
- [ ] Authn + object-level authz enforced
- [ ] Secrets not in repo; env names real
- [ ] Password hashing modern
- [ ] Security headers present in prod
- [ ] Dependencies audited
- [ ] Sensitive data not logged
