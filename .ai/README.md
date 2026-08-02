# AI Engineering Knowledge Base

Permanent engineering handbook for AI coding agents (Claude Code, Cursor, Gemini CLI, Codex CLI, RooCode, Cline, Aider, and similar tools).

This directory is the source of truth for architecture, coding standards, workflows, checklists, prompts, and conventions. Agents must read the relevant files before planning or writing code.

---

## How Agents Must Use This Knowledge Base

1. **Before any coding task**, read:
   - `rules/architecture.md`
   - `rules/coding.md` (language-agnostic pass/fail rules)
   - `rules/oop.md` (OOP over procedural; SOLID; rich domain)
   - `architecture/patterns.md` when creation/behavior variation/integration needs a design pattern
   - The **language/framework** file that matches the stack (`java.md`, `typescript.md`, `cpp.md`, `react.md`, `sql.md`)
   - The domain rule file that matches the task (`backend.md`, `frontend.md`, `database.md`, `api.md`, `security.md`, `performance.md`, etc.)
   - `workflows/before-coding.md`
2. **During implementation**, follow `workflows/implementation.md` and the matching checklist under `checklists/`.
3. **After implementation**, run a self-review using `workflows/code-review.md` and the relevant checklist.
4. **When stuck**, use `workflows/debugging.md` and the prompt in `prompts/debugger.md`.
5. **Never invent** APIs, files, tables, env vars, or dependencies that do not exist in the repository.

---

## Directory Map

| Path | Purpose |
|------|---------|
| `rules/` | Hard engineering rules by domain and language |
| `architecture/` | Design pattern selection and architecture supplements |
| `workflows/` | Step-by-step operating procedures for agents |
| `checklists/` | Pre-merge / pre-release verification lists |
| `prompts/` | Ready-to-use role prompts for planning, review, security, etc. |
| `conventions/` | Naming, structure, commits, branching |

### Rules index

| File | Scope |
|------|--------|
| `coding.md` | Language-agnostic measurable standards |
| `oop.md` | OOP, SOLID, encapsulation, anti-anemic domain |
| `java.md` | Java / Spring Boot |
| `typescript.md` | TypeScript |
| `cpp.md` | C++ |
| `react.md` | React |
| `sql.md` | SQL / PostgreSQL queries & DDL |
| `architecture.md`, `backend.md`, `frontend.md`, … | Domain / cross-cutting rules |
| `performance.md`, `security.md` | Specialized pass/fail domain rules |
| `../architecture/patterns.md` | When to use Factory, Strategy, Builder, etc. |

---

## Mandatory AI Behavior

- Never hallucinate APIs, files, database tables, or environment variables.
- Never overwrite unrelated code.
- Never remove code without stating why.
- Prefer editing existing files over creating new ones.
- Read before writing. Search before creating.
- Explain the implementation plan before coding.
- If uncertain about requirements or existing behavior, stop and ask.
- Preserve backwards compatibility unless explicitly told not to.
- Follow project conventions already present in the repo; this handbook fills gaps, it does not invent a parallel style when the repo already has one.
- Perform a self-review after every implementation.

---

## Recommended Reading Order for New Agents

1. This README
2. `rules/architecture.md`
3. `rules/coding.md` + `rules/oop.md`
4. `architecture/patterns.md` (pattern selection)
5. Language/framework file(s) for the stack
6. `conventions/folder-structure.md` and `conventions/naming.md`
7. Domain rules for the current task
8. `workflows/before-coding.md` then `workflows/implementation.md`

---

## Rule Format Convention

Every rule in this knowledge base follows:

- **Measurable statement** — a reviewer can mark **PASS** or **FAIL**
- **Limits** — numbers where applicable (lines, params, depth, counts)
- **Example** — good vs bad when useful
- **Self-review gate** — checklist at the end of the file

Vague advice such as “write clean code” is forbidden. If a statement cannot be checked pass/fail, rewrite it until it can.
