# Workflow: Before Coding

Mandatory procedure for AI agents **before** writing or modifying application code.

---

## Purpose

Prevent hallucinated APIs, duplicate implementations, architecture violations, and wasted diffs. Planning is cheaper than reverting.

---

## Step 1 — Clarify the Goal

- Restate the user request as a concrete outcome: behavior, constraints, non-goals.
- Identify acceptance criteria (testable).
- If the request is ambiguous on security-sensitive or breaking-change dimensions, **stop and ask** before coding.

Do not assume product requirements that were not stated.

---

## Step 2 — Read Governing Rules

Read at least:

1. `.ai/README.md` (behavior constraints)
2. `.ai/rules/architecture.md`
3. `.ai/rules/coding.md` (pass/fail limits)
4. `.ai/rules/oop.md` (OOP over procedural; SOLID)
5. `.ai/architecture/patterns.md` when designing non-trivial creation, variation, or integration
6. Language/framework file(s): `java.md`, `typescript.md`, `cpp.md`, `react.md`, `sql.md` as applicable
7. Domain files matching the task (`backend.md`, `frontend.md`, `database.md`, `api.md`, `security.md`, `performance.md`, …)

Skim is not enough for the language, OOP, and domain files that own the change. Prefer objects and patterns over procedural scripts.

---

## Step 3 — Orient in the Repository

- Locate entrypoints, module boundaries, and existing patterns for the same feature area.
- Search for existing implementations before proposing new files:
  - similar endpoints, services, components, utils
  - existing helpers for dates, money, HTTP clients, auth
- Open and read the files you will touch — do not edit blind.
- Identify the composition root / DI wiring if adding dependencies.

**Hard rule:** Prefer extending existing modules over creating parallel ones.

---

## Step 4 — Verify External Contracts

- Confirm API routes, event names, table/column names, and env vars **exist** in the repo (OpenAPI, migrations, `.env.example`, IaC).
- Never invent tables, columns, env vars, or endpoints.
- If something required is missing, include creating it (migration/spec update) in the plan — or ask.

---

## Step 5 — Produce an Implementation Plan

Write a short plan before coding:

1. **Approach** — which layers/modules change
2. **Files to edit** — concrete paths (existing preferred)
3. **Files to add** — only if necessary, with justification
4. **Data/API changes** — migrations, OpenAPI, events
5. **Test plan** — what tests to add/update
6. **Risks** — backwards compatibility, security, performance, rollout
7. **Out of scope** — explicit non-goals

For non-trivial work, present this plan to the user and wait if assumptions are required.

---

## Step 6 — Identify Risks Explicitly

Check:

- [ ] Breaking API or schema changes?
- [ ] Authn/authz implications?
- [ ] New dependency needed?
- [ ] Performance (N+1, unbounded lists)?
- [ ] Idempotency / retries for money or provisioning?
- [ ] Feature flag needed for safe rollout?

Escalate unresolved risks as questions.

---

## Step 7 — Gate: Ready to Code?

Proceed only when:

- Goal and acceptance criteria are clear
- Relevant code and rules have been read
- Plan lists real files/contracts
- No invented resources
- Open questions are answered or explicitly deferred with user approval

If blocked, ask. Do not guess.

---

## Anti-Patterns

- Starting to code in the first tool call without search/read
- Creating new util packages without grepping for existing ones
- “While I’m here” refactors outside the plan
- Inventing config keys “that should exist”

---

## Output Template (Agent → User)

```markdown
## Plan
- Goal: ...
- Approach: ...
- Files: ...
- Contracts: ...
- Tests: ...
- Risks: ...
- Questions: ...
```
