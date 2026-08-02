# Architecture Rules

Hard rules for system structure, module boundaries, and dependency direction. Agents must apply these before introducing new packages, services, or cross-cutting changes.

Also read:

- `oop.md` — OOP / SOLID / rich domain (enforceable)
- `../architecture/patterns.md` — when to apply design patterns instead of ad hoc procedural logic

---

## Dependency Direction (Non-Negotiable)

Dependencies point inward toward domain logic. Outer layers may depend on inner layers. Inner layers must never depend on outer layers.

```
UI / Controllers / Gateways
        ↓
   Application Services / Use Cases
        ↓
   Domain Models / Domain Services
        ↓
   (no outbound deps to infrastructure)
```

Infrastructure (DB, HTTP clients, queues, filesystem) is injected into application/domain via interfaces defined in the inner layers.

**Why:** Reversing this creates untestable code and locks business rules to frameworks.

**Checklist:**
- [ ] Domain modules do not import HTTP, ORM entity annotations used as domain, or framework routers
- [ ] Application services do not import controller/request types
- [ ] Repositories implement interfaces declared in domain or application, not the reverse

---

## Clean Architecture

### Layers

| Layer | Allowed contents | Forbidden |
|-------|------------------|-----------|
| Domain | Entities, value objects, domain services, domain events, repository *interfaces* | Framework imports, SQL, HTTP |
| Application | Use cases / interactors, DTOs for use-case I/O, orchestration, transaction boundaries | UI widgets, raw SQL in use cases |
| Interface adapters | Controllers, presenters, gateway adapters, mappers | Business rules |
| Infrastructure | ORM, HTTP clients, message brokers, file storage, clock, UUID generators | Business decision logic |

### Rules

- Controllers translate HTTP ↔ application DTOs. They must not contain business rules (no pricing, eligibility, permission policy beyond calling an auth service).
- Use cases own one business operation (e.g. `PlaceOrder`, `CancelSubscription`). Prefer one public method per use-case class when the operation is non-trivial.
- Domain entities encapsulate invariants. Invalid states must be unrepresentable (constructors/factories reject bad data).
- Map persistence models ↔ domain models at the repository boundary. Do not leak ORM entities into controllers or UI.

**Why:** Keeps business rules portable and unit-testable without a database or web server.

---

## Hexagonal Architecture (Ports & Adapters)

- **Ports** are interfaces defining what the app needs (outbound) or offers (inbound).
- **Adapters** implement ports for specific technologies (Postgres repository, Stripe payment gateway, REST controller).
- Name ports by capability, not technology: `PaymentGateway`, not `StripeClient` (Stripe is an adapter name).
- Application core depends only on ports. Wire adapters in composition root / DI container.

**Example:**

```text
Port:     OrderRepository.save(order)
Adapter:  PostgresOrderRepository.save(order)  // SQL lives here only
```

**Checklist:**
- [ ] New external system = new adapter behind an existing or new port
- [ ] No direct SDK calls from use cases or domain

---

## Layered Architecture

When the project uses classic layers (`controller → service → repository`):

- Controllers: routing, status codes, request validation wiring, response mapping
- Services: business orchestration and rules
- Repositories: persistence only (queries, inserts, updates, deletes)
- Services must not import HTTP request/response types
- Repositories must not call other services or emit HTTP
- No skipping layers (controller must not call repository directly unless the project already documents an exception for trivial CRUD read models)

**Why:** Skipping layers duplicates persistence rules and breaks transaction ownership.

---

## Feature-First Architecture

Organize by business capability when the codebase is product-facing and features evolve independently:

```text
features/
  billing/
    api/
    application/
    domain/
    infrastructure/
  identity/
  catalog/
```

Rules:

- Cross-feature imports go through a public API module of the feature (`features/billing/index` or `public/`), not deep internal paths.
- Shared kernel holds truly shared primitives (Result, Money, clock). Do not dump feature code into `shared/` to avoid thinking about ownership.
- Prefer duplicating a 10-line helper inside a feature over a premature shared abstraction used by one feature.

**Why:** Feature boundaries reduce merge conflicts and make ownership clear.

---

## Modular Monolith

Default starting architecture for most products.

- Modules have explicit public APIs and private internals.
- Modules communicate via:
  1. Synchronous calls to public interfaces, or
  2. Domain/integration events (async)
- No shared database tables across modules without an owned integration table or ACL. Prefer each module owns its tables.
- Extract a microservice only when there is a proven need: independent scaling, separate deploy cadence, or strong team/ownership boundary — not because “microservices are modern.”

**Why:** Distributed systems tax is high; modular monolith keeps deploy simplicity with clear seams for later extraction.

---

## Microservice Boundaries

Split a service only when **all** of the following hold:

1. Independent deployability is required
2. Data ownership can be split without distributed transactions for the main flows
3. Team or SLO boundaries justify the operational cost

Rules after split:

- No shared mutable database between services
- Sync calls: timeouts, retries with idempotency, circuit breakers
- Prefer eventual consistency via events for cross-service workflows
- Define an anti-corruption layer when consuming another service’s model
- Version public APIs; never break consumers without a migration window

**Anti-pattern:** “Nanoservices” that need 2PC or chatty sync calls for every user action.

---

## Dependency Injection

- Construct the object graph in one composition root (main, app factory, DI module).
- Prefer constructor injection. Avoid service locators in application code.
- Inject interfaces/ports, not concrete infrastructure types, at application boundaries.
- Do not pass the entire DI container into business classes.
- Singletons must be thread-safe and free of request-scoped mutable state.

**Why:** Hidden global dependencies make tests and reasoning impossible.

---

## SOLID (Actionable Form)

### Single Responsibility

- A class has one reason to change. If a PR description lists two unrelated motivations for changing the same class, split it.
- Controllers handle transport. Services handle use cases. Repositories handle persistence.

### Open/Closed

- Extend behavior via new classes/strategies/handlers rather than editing large switch statements when adding a third+ variant.
- Prefer strategy/plugin registration for payment methods, notification channels, exporters.

### Liskov Substitution

- Subtypes must honor the parent contract. Do not override methods to throw `UnsupportedOperation` for core interface methods — split the interface instead.

### Interface Segregation

- Clients must not depend on methods they do not use. Split fat repository interfaces (`UserReader` / `UserWriter`) when read and write callers diverge.

### Dependency Inversion

- High-level modules depend on abstractions. Domain defines repository interfaces; infrastructure implements them.

---

## DRY / KISS / YAGNI

| Principle | Rule | Limit |
|-----------|------|-------|
| DRY | Extract duplication only after the same logic appears in **3** places **or** two places with identical change reasons | Do not create shared utils for speculative reuse |
| KISS | Prefer the simplest design that passes tests and meets SLOs | No framework for a single if/else |
| YAGNI | Do not build extension points, config flags, or abstractions for unrequested futures | Delete unused code paths in the same PR that proves they are dead |

**Never create duplicate utilities.** Before adding `utils/formatDate`, search the repo for existing date helpers.

---

## CQRS (When Appropriate)

Use CQRS when read models and write models diverge enough that one model causes pain (complex reporting, high read QPS, different consistency needs).

Rules:

- Commands mutate state and return acknowledgment / IDs, not large read graphs
- Queries never mutate state
- Do not introduce separate databases/buses for CQRS until metrics justify it; start with separate query methods/handlers in-process
- Keep command-side invariants in the write model; denormalize read models intentionally

**When not to use:** Simple CRUD apps. CQRS without need doubles surface area.

---

## Event-Driven Design

- Name events as past-tense domain facts: `OrderPlaced`, `PaymentCaptured`
- Events carry enough data for consumers to act without synchronous callbacks when practical
- Publishers must not assume which consumers exist
- Consumers must be idempotent (at-least-once delivery is the default)
- Include `eventId`, `occurredAt`, and aggregate `version` or causal metadata
- Outbox pattern for reliable publish after DB commit — do not publish then commit (dual-write hazard)

**Why:** Dual-write causes lost events or phantom events under failure.

---

## Repository Pattern

- Repositories speak in domain aggregates/entities, not rows
- Methods named after domain intent: `findActiveByCustomerId`, not `queryUsersJoinOrdersWhere`
- No business rules inside repositories (no “if overdue then …”)
- Pagination and filtering parameters are explicit; never return unbounded collections from production APIs
- One repository per aggregate root unless the project already uses a coarser convention

---

## Service Pattern

- Application/domain services orchestrate; they do not become “god” classes
- Split services when a file exceeds ~400 lines or when unrelated use cases share a class only for convenience
- Domain services hold logic that does not naturally belong to a single entity
- Application services own transactions and authorization checks for the use case

---

## DTO Pattern

- Use DTOs at trust boundaries: HTTP in/out, message payloads, external APIs
- Do not expose domain entities directly as API responses when they contain internal fields or lazy-load proxies
- Mapping lives in adapters/mappers, not in domain entities
- Validation annotations/schemas apply to input DTOs; domain still enforces invariants

---

## Architecture Decision Records (ADRs)

For decisions that affect boundaries, data ownership, or major tech choices:

1. Create an ADR with context, decision, consequences
2. Prefer short ADRs over Slack archaeology
3. Link the ADR from README or `docs/adr/`

Agents: if introducing a new architectural pattern (CQRS, new service, event bus), draft or update an ADR in the same change set when the repo uses ADRs.

---

## Architecture Review Checklist

- [ ] Dependency direction is inward-only
- [ ] New code lives in the correct layer/feature module
- [ ] No framework types in domain
- [ ] External I/O behind ports with timeouts
- [ ] No cross-module deep imports
- [ ] No speculative microservice or shared util extraction
- [ ] Transactions and consistency model are explicit
- [ ] Backwards compatibility considered for API/events/schema
