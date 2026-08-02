# Git Rules

Branching, commits, pull requests, merges, and releases. Also see `conventions/commit-messages.md` and `conventions/branching.md`.

---

## Branch Naming

Format:

```text
<type>/<short-kebab-description>
```

Types: `feature`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`, `hotfix`.

Examples:

- `feature/order-idempotency-keys`
- `fix/refund-double-capture`
- `hotfix/session-store-null`

Rules:

- No personal names as the only segment (`john/wip`).
- Include ticket id when the project requires: `feature/PROJ-1234-order-idempotency`.
- Keep branches short-lived (< ~7 days preferred).

---

## Commit Conventions

Follow Conventional Commits unless the repo uses a documented alternative:

```text
<type>(optional-scope): <imperative summary ≤72 chars>

<optional body: why, not what>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`, `revert`.

Rules:

- Subject in imperative mood: `add`, `fix`, `remove` — not `added`/`fixes`.
- One logical change per commit when practical.
- Do not commit secrets, credentials, or large generated binaries.
- Do not use `--no-verify` unless explicitly requested by a human after understanding the hook failure.
- Agents: only commit when the user asks.

**Why:** History becomes searchable; bisect and changelog generation work.

---

## Pull Request Requirements

Every PR must include:

1. **Summary** — what changed and why (1–3 bullets)
2. **Test plan** — commands run / checklist of manual checks
3. **Risk / rollback** — for risky changes
4. Link to ticket when applicable

Rules:

- Keep PRs reviewable: prefer < ~400 changed lines of meaningful code when possible; split otherwise.
- Do not mix unrelated refactors with features.
- CI must be green before merge (unless emergency hotfix process with human approval).
- Request review from code owners when CODEOWNERS exists.
- Screenshots/video for UI changes.
- OpenAPI/migration notes when contracts or schema change.

---

## Review Expectations

Authors:

- Self-review the diff before requesting review
- Respond to comments; do not resolve threads without addressing them unless agreed

Reviewers:

- Check correctness, security, architecture fit, tests — see `workflows/code-review.md`
- Prefer questions and alternatives over vague “nit”
- Approve only when you would ship it

---

## Merge Strategy

Default (unless repo docs say otherwise):

- **Squash merge** for feature branches → clean main history
- **Merge commit** for long-lived release branches when required
- **Rebase** only when the team standard says so and history is private

Rules:

- Protect `main`/`master`: no direct pushes; require PR + reviews + CI
- Do not force-push protected branches
- Force-push to personal feature branches only when needed for rebase; never to shared branches without coordination
- Delete feature branches after merge

---

## Hotfixes

1. Branch from the release tag or `main` per process: `hotfix/...`
2. Minimal fix + regression test
3. Expedited review + CI
4. Tag release; backport to main if hotfix branched from release branch

---

## Release Strategy

- Prefer tagged releases (`vMAJOR.MINOR.PATCH`) with changelog
- Semantic versioning: BREAKING → major; feature → minor; fix → patch
- Release commits/tags should be reproducible from CI artifacts
- Do not release from dirty local trees with unpushed experiments
- Feature flags for incomplete features merged to main

---

## What Agents Must Not Do

- `git config` changes
- `git push --force` to `main`/`master`
- Interactive rebases (`-i`)
- Commit without explicit user request
- Amend commits already pushed unless user explicitly requests and conditions in user rules allow
- Skip hooks unless user explicitly requests

---

## Git Checklist (Inline)

- [ ] Branch named correctly
- [ ] Commits conventional and focused
- [ ] No secrets in history of this PR
- [ ] PR description complete; CI green
- [ ] Merge strategy respected
- [ ] Hotfix/release process followed when applicable
