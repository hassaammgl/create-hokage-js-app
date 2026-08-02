# Commit Message Conventions

Standards for git commit messages. Aligns with `.ai/rules/git.md`. Prefer Conventional Commits unless the repository documents another scheme.

---

## Format

```text
<type>(optional-scope): <description>

[optional body]

[optional footer]
```

### Subject Line Rules

- Type required; scope optional
- Description: imperative mood (`add`, `fix`, `remove`)
- Lowercase description preferred (unless proper nouns)
- No period at the end of the subject
- ≤72 characters for the subject line
- Describe **why**-oriented outcome in body when non-obvious; subject can state the change

### Types

| Type | Use |
|------|-----|
| `feat` | New user-facing capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting; no behavior change |
| `refactor` | Structure change; no behavior change |
| `perf` | Performance improvement |
| `test` | Add/fix tests only |
| `chore` | Maintenance (deps, tooling) |
| `ci` | CI config |
| `build` | Build system / packaging |
| `revert` | Revert a prior commit |

### Scopes (Examples)

Use module/feature names already in the repo: `orders`, `auth`, `api`, `db`, `ui`.

---

## Examples

```text
feat(orders): add idempotency keys to create order

Prevent duplicate charges when mobile clients retry POST /orders.
Keys are scoped per user and retained for 24 hours.
```

```text
fix(auth): reject expired refresh tokens before rotation
```

```text
refactor(billing): extract tax calculation into domain service
```

```text
docs(ai): add engineering knowledge base under .ai/
```

```text
chore(deps): upgrade eslint to 9.x
```

---

## Breaking Changes

```text
feat(api)!: remove legacy /v0/orders endpoint

BREAKING CHANGE: clients must use /v1/orders. /v0 shut off after 2026-09-01.
```

Or footer only:

```text
BREAKING CHANGE: <description>
```

---

## What Not to Write

```text
# BAD
fixed stuff
WIP
asdf
updates
Addressed PR comments
```

```text
# BAD — subject is a novel
feat: this commit implements the new order creation flow including validation and also fixes the button color on mobile and updates readme
```

Split unrelated changes into separate commits when the user wants commits.

---

## Agent Rules

- Only create commits when the user explicitly requests
- Use a HEREDOC for multi-line messages
- Match recent repo commit style if it differs slightly from this doc
- Never include secrets in commit messages
- Do not skip hooks unless the user explicitly requests

---

## Checklist

- [ ] Valid type
- [ ] Imperative subject ≤72 chars
- [ ] Body explains why when needed
- [ ] Breaking change noted if applicable
- [ ] One logical change per commit when practical
