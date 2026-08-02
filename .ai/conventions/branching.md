# Branching Conventions

Branch naming, lifecycle, and integration rules. Aligns with `.ai/rules/git.md`.

---

## Default Workflow

**Trunk-based / short-lived branches** unless the repo documents Git Flow.

1. Create branch from up-to-date `main` (or `master`)
2. Implement with small commits
3. Open PR early if useful; keep CI green
4. Squash-merge (default) or merge per repo setting
5. Delete branch after merge

Long-lived feature branches (>7–10 days) require explicit strategy (flags, frequent rebase/merge from main).

---

## Branch Name Format

```text
<type>/<ticket?-description>
```

### Types

| Type | Purpose |
|------|---------|
| `feature/` | New capability |
| `fix/` | Bug fix |
| `hotfix/` | Production emergency fix |
| `chore/` | Tooling, deps, cleanup |
| `docs/` | Documentation |
| `refactor/` | Structural change |
| `perf/` | Performance |
| `test/` | Test-only work |
| `release/` | Release preparation when used |

### Examples

```text
feature/proj-1234-order-idempotency
fix/refund-double-capture
hotfix/null-session-store
chore/upgrade-postgres-driver
docs/ai-knowledge-base
```

### Rules

- Kebab-case description
- No spaces or underscores preferred in the descriptive segment
- Include ticket id when the team requires it
- Avoid `feature/new`, `fix/bug`, `temp`

---

## Protected Branches

- `main` / `master`: PR required, CI required, no force-push
- `release/*`: restricted when used; hotfixes merge carefully with backports
- Agents never force-push protected branches

---

## Hotfix Flow

```text
main (or release tag)
  └─ hotfix/short-description
        ├─ PR → main (or release branch)
        ├─ tag / deploy
        └─ backport to main if needed
```

Keep hotfix diffs minimal; always add a regression test.

---

## Release Branches (If Used)

```text
release/1.14
```

- Only bugfixes and version bumps
- Merge back to main after release
- Prefer tagging SHAs on main for simpler trunk-based teams

---

## Syncing With Main

- Prefer merge or rebase per team standard; do not rewrite shared branch history
- Resolve conflicts thoughtfully — understand both sides
- Re-run tests after resolving conflicts

---

## Naming Anti-Patterns

```text
# BAD
john/wip
fix
branch1
update-code
Feature/Order_Idempotency
```

---

## Agent Rules

- Create branches with clear names when starting multi-commit work the user requested
- Do not create branches for tiny single-file edits unless the user wants a PR
- Never delete remote branches unrelated to the task
- Never force-push `main`/`master`

---

## Checklist

- [ ] Branched from correct base
- [ ] Name matches `<type>/description`
- [ ] Short-lived; synced with main before PR
- [ ] PR targets correct base branch
- [ ] Branch deleted after merge
