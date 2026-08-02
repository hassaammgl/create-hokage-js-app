# Design Patterns — When to Use

Instructs AI agents to pick an appropriate pattern instead of ad hoc procedural logic. Use with `rules/oop.md` and `rules/architecture.md`.

**Rule:** If a situation matches a “Use when” row below, implement that pattern (or an existing project equivalent). Do **not** invent parallel pattern names. Do **not** apply patterns that do not match — YAGNI still applies.

Every pattern entry is enforceable: **PASS** = used when criteria match; **FAIL** = criteria match but procedural/ad hoc code was written instead; **N/A** = criteria do not match.

---

## Decision Checklist (Before Coding)

1. Is object creation non-trivial? → **Factory** / **Builder** / **Abstract Factory**
2. Does behavior vary by type/algorithm? → **Strategy** / **State**
3. Do you adapt an external API to your port? → **Adapter**
4. Do you need a simple front for a subsystem? → **Facade**
5. Do you add behavior without modifying the core type? → **Decorator**
6. Is there a fixed algorithm skeleton with customizable steps? → **Template Method**
7. Are you queuing/recording operations? → **Command**
8. Do many listeners react to an event? → **Observer** / domain events
9. Do handlers form a pipeline? → **Chain of Responsibility**
10. Do you need one shared instance of a stateless/shared resource at the edge? → reconsider; prefer DI lifetime — **Singleton** only if project already uses it for that resource

If none match, write simple OOP (rich domain + services). Do not force a pattern.

---

## Creational

### Factory Method / Simple Factory

| | |
|--|--|
| **Use when** | Creating an object requires choosing a class by type, config, or multi-step setup that callers should not know |
| **Do not use when** | Construction is a single obvious `new` / constructor call |
| **PASS** | `PaymentProcessorFactory.create(type)` returns a `PaymentProcessor` |
| **FAIL** | Call sites duplicate `if type == STRIPE new Stripe... else new PayPal...` in 3+ places |

### Abstract Factory

| | |
|--|--|
| **Use when** | Families of related objects must be created together (e.g. cloud-provider-specific clients) |
| **Do not use when** | Only one product type exists |
| **FAIL** | Scattered `new` for related family members with no factory |

### Builder

| | |
|--|--|
| **Use when** | Object has **> 4** optional fields, many valid combinations, or telescoping constructors |
| **Do not use when** | 1–3 required fields and clear constructor |
| **PASS** | `OrderBuilder` / fluent builder / project record-builder |
| **FAIL** | Constructor with ≥ 5 parameters of mixed optional meaning (also fails `coding.md` param limit) |

### Singleton

| | |
|--|--|
| **Use when** | Process-wide single instance is required **and** DI lifetime cannot express it (rare) |
| **Do not use when** | “Convenience” global access for services — use DI |
| **FAIL** | New static singleton service locator for business logic |

---

## Structural

### Adapter

| | |
|--|--|
| **Use when** | Integrating an external library/API that does not match your port/interface |
| **Do not use when** | You control both sides and can change the interface |
| **PASS** | `StripePaymentAdapter implements PaymentProcessor` |
| **FAIL** | Domain calls Stripe SDK types directly |

### Facade

| | |
|--|--|
| **Use when** | Callers need a simple API over a multi-step subsystem (complex setup, several collaborators) |
| **Do not use when** | Facade becomes a god class (>15 public methods) — split |
| **PASS** | `CheckoutFacade.placeOrder(...)` coordinating cart, payment, inventory ports |
| **FAIL** | Controllers wiring 6 repositories with duplicated orchestration in each endpoint |

### Decorator

| | |
|--|--|
| **Use when** | Adding cross-cutting behavior (retry, metrics, caching, authz) around an interface without modifying implementations |
| **Do not use when** | Behavior is core domain logic — put it in the domain type |
| **PASS** | `CachingUserRepository implements UserRepository` wrapping inner repo |
| **FAIL** | Copy-pasting cache logic into every repository method |

### Proxy

| | |
|--|--|
| **Use when** | Lazy load, access control, or remote stub in front of a real object |
| **Do not use when** | Decorator already covers the need and project uses decorators |
| **FAIL** | Manual lazy init flags scattered across callers |

### Composite

| | |
|--|--|
| **Use when** | Tree structures where clients treat leaf and node uniformly (menus, org charts, expression trees) |
| **Do not use when** | Flat list with no hierarchy |
| **FAIL** | Recursive type handled with special-case procedural code at every level |

---

## Behavioral

### Strategy

| | |
|--|--|
| **Use when** | **≥ 3** interchangeable algorithms/behaviors selected by type/config; or 2nd extension is about to grow a switch |
| **Do not use when** | Single algorithm forever |
| **PASS** | `PaymentStrategy` + `StripeStrategy` / `PayPalStrategy` / `JazzCashStrategy` |
| **FAIL** | `switch (paymentType) { ... }` with ≥ 3 cases in application code (unless `EXCEPTION: exhaustive-switch`) |

### State

| | |
|--|--|
| **Use when** | Object behavior changes materially with lifecycle state (order: draft → paid → shipped) and transitions have rules |
| **Do not use when** | State is a simple flag with no behavior differences |
| **PASS** | State objects or domain methods enforcing allowed transitions |
| **FAIL** | External service sets `status` freely without transition rules |

### Template Method

| | |
|--|--|
| **Use when** | Algorithm skeleton is fixed; subclasses/hooks customize steps |
| **Do not use when** | Strategies are independent with no shared skeleton — use Strategy |
| **PASS** | Base `ImportJob.run()` calling abstract `parse` / `validate` / `persist` |
| **FAIL** | Copy-pasted job runners differing only in middle steps |

### Command

| | |
|--|--|
| **Use when** | Operations must be queued, logged, retried, undone, or executed asynchronously as first-class objects |
| **Do not use when** | Direct method call is enough |
| **PASS** | `CancelOrderCommand` handled by handler/bus already in the project |
| **FAIL** | Ad hoc boolean flags and callbacks simulating an undo stack |

### Observer / Domain Events

| | |
|--|--|
| **Use when** | Multiple independent reactions to a fact (`OrderPlaced` → email, analytics, inventory) without coupling publisher to subscribers |
| **Do not use when** | Single synchronous follow-up better as an explicit service call in one use case |
| **PASS** | Domain event + handlers; outbox if persistence involved |
| **FAIL** | Publisher imports and calls every concrete subscriber |

### Chain of Responsibility

| | |
|--|--|
| **Use when** | A request passes through a pipeline of handlers (auth, validation, enrichment) where each may handle or forward |
| **Do not use when** | Fixed two-step call is clearer |
| **PASS** | Middleware / handler chain already idiomatic in the framework |
| **FAIL** | Nested procedural `if (ok) { if (ok2) { ... } }` pipeline that grows per concern |

### Mediator

| | |
|--|--|
| **Use when** | Many-to-many communication between objects creates spaghetti; central coordination is clearer (often with Command bus) |
| **Do not use when** | Few collaborators — direct calls are fine |
| **FAIL** | Every service references every other service for the same workflow |

### Iterator / Specification

| | |
|--|--|
| **Use when** | Complex query criteria are reused and composed (`OrderSpec.active().forCustomer(id)`) |
| **Do not use when** | One-off simple query |
| **FAIL** | Duplicated filter boolean logic across services |

---

## Pattern Selection Matrix (Quick)

| Smell in draft code | Prefer |
|---------------------|--------|
| Repeated `new` + setup | Factory |
| Telescoping / many optional fields | Builder |
| `switch` on type ≥ 3 | Strategy |
| Lifecycle with transition rules | State |
| Third-party SDK in domain | Adapter |
| Duplicated orchestration in controllers | Facade / Application service |
| Copy-pasted retry/cache around calls | Decorator |
| Shared algorithm, custom steps | Template Method |
| Need async/retry/audit of an action | Command |
| Multiple reactions to one fact | Observer / events |
| Pipeline of processors | Chain of Responsibility |

---

## Anti-Patterns (Always Fail)

| Anti-pattern | Why |
|--------------|-----|
| Pattern tourism | Applying Strategy+Factory+Builder for a 5-line feature |
| Anemic + Transaction Script for rich domain | Violates `oop.md` |
| God Facade | Facade with unrelated methods |
| Base class utility inheritance | Use composition |
| Singleton service locator | Hidden deps; untestable |

---

## Agent Rules

1. Read this file when designing non-trivial behavior or creation logic.
2. Name the chosen pattern in the implementation plan.
3. Prefer patterns **already present** in the repository over introducing a new style.
4. If adding a pattern new to the module, note it in the PR and keep it consistent with `oop.md`.
5. Never invent APIs for pattern frameworks not in the project (e.g. do not add MediatR/CQRS bus unless it exists or is requested).

---

## Self-Review Gate

- [ ] “Use when” criteria checked for creation, variation, integration, and events
- [ ] Chosen pattern named in plan/PR
- [ ] No pattern tourism
- [ ] No SDK types leaking past Adapter
- [ ] Switches with ≥ 3 behavior variants replaced or exception documented
- [ ] Matches existing project pattern style
