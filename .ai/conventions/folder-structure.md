# Folder Structure Conventions

Guidance for organizing repositories. Prefer the structure already present in the project. Use this when creating new modules or when the repo is greenfield.

---

## Principles

1. **Organize by feature/business capability** for product apps when scale warrants it; **organize by layer** only when the codebase is small or the team already standardized on layers.
2. Public API of a module is narrow; internals stay private.
3. Do not create empty placeholder folders “for later.”
4. Colocate tests with code **or** mirror tree under `tests/` — match the repo.
5. Config, scripts, and infra live in predictable top-level dirs.

---

## Recommended Top-Level (Application Repo)

```text
.
├── .ai/                 # AI engineering knowledge base (this handbook)
├── .github/             # CI, templates (if GitHub)
├── apps/                # Deployable applications (monorepo)
├── packages/            # Shared libraries (monorepo)
├── src/                 # Single-app source (non-monorepo)
├── tests/               # If not colocated
├── migrations/          # or db/migrations — schema history
├── docs/                # Human docs, ADRs
├── scripts/             # Dev/ops scripts
├── deploy/ or infra/    # IaC, helm, terraform
├── .env.example
└── README.md
```

Omit unused directories. Do not invent a monorepo layout if the project is a single package.

---

## Backend Feature Module (Preferred)

```text
features/
  orders/
    api/              # HTTP controllers, request/response DTOs
    application/      # use cases
    domain/           # entities, value objects, domain services, ports
    infrastructure/   # Postgres repo, external adapters
    index.ts          # public exports only
```

Cross-feature imports use the feature’s public `index` (or `public` package), not deep internals.

---

## Backend Layer Module (Alternative)

```text
src/
  controllers/
  services/
  repositories/
  models/
  dto/
  middleware/
  config/
```

Allowed when the existing project already uses it. Do not mix feature-first and layer-first randomly in the same area.

---

## Frontend Structure

```text
src/
  app/ or pages/       # routing entry (framework-specific)
  features/
    checkout/
      components/
      hooks/
      api/
  shared/              # genuinely shared UI primitives
  styles/
```

Rules:

- Do not put feature-specific components in `shared/`
- Prefer colocation (component + test + styles)
- Keep `shared/` small

---

## Hexagonal / Clean Mapping

| Folder | Layer |
|--------|-------|
| `domain/` | Entities, ports |
| `application/` | Use cases |
| `adapters/in/` | Controllers, CLI |
| `adapters/out/` | DB, HTTP clients |
| `main/` or `app/` | Composition root |

---

## Where Things Must Not Go

| Item | Forbidden location | Correct |
|------|--------------------|---------|
| Business rules | Controllers, React components | Domain/application |
| SQL | Controllers | Repositories/adapters |
| Raw secrets | Source tree | Secret manager / env |
| One-off scripts | Random feature folders | `scripts/` |
| ADR | Slack only | `docs/adr/` |

---

## Creating New Folders (Agent Rule)

Before adding a directory:

1. Search for an existing home for that responsibility
2. Match neighboring module layout exactly
3. Export via the module’s public entry if feature-based
4. Update README only if top-level discoverability changes

---

## Checklist

- [ ] Matches existing repo style (feature vs layer)
- [ ] No new parallel hierarchy for the same concern
- [ ] Public exports limited
- [ ] Tests colocated or mirrored correctly
- [ ] No empty speculative directories
