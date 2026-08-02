# Documentation Rules

Rules for docs that humans and AI agents rely on. Prefer accuracy and discoverability over volume.

---

## What Must Be Documented

| Artifact | When required |
|----------|---------------|
| README | Always for the repo and for major packages |
| `.env.example` | When env configuration exists |
| OpenAPI / schema | When HTTP APIs exist |
| ADRs | Architecture or tech decisions with long-term impact |
| Runbooks | On-call / incident procedures for production services |
| Migration notes | Breaking API or data changes |

Do not invent documentation files the project does not use; update existing canonical locations.

---

## README Standards

Root README includes:

- What the project does (2–3 sentences)
- Prerequisites
- Setup steps that actually work
- How to run tests
- How to run the app locally
- Link to deeper docs (including `.ai/` for agent rules)

Keep setup commands copy-pasteable. If a command is wrong, fix it in the same PR that discovers it.

---

## Code Documentation

- Public module APIs: document parameters, return values, error behavior.
- Do not document obvious getters.
- Prefer good names and types over long comments.
- Update comments in the same change when behavior changes — stale comments are worse than none.

---

## ADRs (Architecture Decision Records)

Template:

1. **Title** — short
2. **Status** — proposed/accepted/superseded
3. **Context** — forces at play
4. **Decision** — what we chose
5. **Consequences** — positive and negative

Store where the repo already stores ADRs (`docs/adr/`, etc.). Agents proposing new architectural patterns should add/update ADRs when the repo uses them.

---

## API Docs

- OpenAPI is updated in the same PR as API changes.
- Include examples for complex payloads.
- Document auth, rate limits, and idempotency.

---

## Changelogs

- User-facing services: keep a changelog or generate from Conventional Commits.
- Write entries for operators/users: impact and migration steps, not file lists.

---

## Agent-Oriented Docs (This `.ai/` Tree)

- Rules must be actionable and checkable.
- When project reality diverges from `.ai/` rules, update `.ai/` or note an explicit exception in the PR — do not silently ignore.
- Do not duplicate entire rules into every prompt; link to files.

---

## Documentation Anti-Patterns

- Placeholder docs (“TODO: write this”)
- Duplicating the same guide in three places that will drift
- Screenshots of text that should be copy-pasteable commands
- Undocumented required env vars

---

## Documentation Checklist (Inline)

- [ ] README setup still works
- [ ] Env example updated for new vars (real names only)
- [ ] API spec updated if endpoints changed
- [ ] ADR added for significant architecture decisions
- [ ] Comments match new behavior
- [ ] No placeholders left in committed docs
