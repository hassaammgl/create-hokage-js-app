# Object-Oriented Programming Standards

Hard rules. Prefer OOP over procedural code whenever it improves readability, maintainability, extensibility, or testability. Favor objects that model business concepts over bags of utility functions.

**Enforcement:** Each rule is **PASS** or **FAIL**. Use with `coding.md` and `architecture/patterns.md`.

Procedural scripts are allowed only for: one-off migrations, thin `main`/composition roots, and pure mathematical helpers with no domain state — document as `EXCEPTION: procedural` in the PR otherwise.

---

## AI OOP Gate (Ask Before Implementing)

Before writing procedural code, the agent must answer:

| # | Question | If yes → |
|---|----------|----------|
| Q1 | Can this become its own class? | Extract type |
| Q2 | Should this be an interface/port? | Introduce abstraction |
| Q3 | Does this behavior belong on the domain object? | Move method onto entity/VO |
| Q4 | Can composition replace inheritance? | Prefer composition |
| Q5 | Does this violate SOLID? | Redesign |
| Q6 | Is this class doing more than one thing? | Split |
| Q7 | Can this dependency be injected? | Inject via constructor |
| Q8 | Would a pattern from `architecture/patterns.md` simplify this? | Apply that pattern |

**FAIL:** shipping a new multi-step business flow as a single procedural function/script when Q1–Q8 were not considered.

---

## SOLID

Every new type in the domain/application layer must satisfy SOLID unless a PR exception names which principle and why.

### Single Responsibility (SRP)

A class has **one** reason to change.

| PASS | FAIL |
|------|------|
| `AuthenticationService`, `EmailService`, `AvatarService` | `UserService` that logs in, registers, sends email, generates PDF, uploads avatar |

**FAIL** if a PR description lists two unrelated motivations for changing the same class.

### Open / Closed (OCP)

| PASS | FAIL |
|------|------|
| New behavior via new type implementing an interface / strategy | Extending a giant `if/else` or `switch` on type/enum for the **3rd+** variant when a strategy/polymorphic type fits |

See Strategy in `architecture/patterns.md`.

### Liskov Substitution (LSP)

| PASS | FAIL |
|------|------|
| Subtype honors parent contract | Override that throws `UnsupportedOperation` / no-ops a required method; strengthened preconditions; weakened postconditions |

**Required fix:** split the interface.

### Interface Segregation (ISP)

| PASS | FAIL |
|------|------|
| Focused interfaces (`Authenticatable`, `Authorizable`) | Fat `UserOperations` forcing unrelated clients to depend on unused methods |

### Dependency Inversion (DIP)

| PASS | FAIL |
|------|------|
| High-level modules depend on ports/interfaces; DI via constructor | `new ConcreteGateway()` inside domain/application logic |

```text
FAIL: PaymentService service = new StripePaymentService();
PASS: constructor(PaymentProcessor processor)  // Stripe injected at composition root
```

Concrete types allowed at composition root / `main` / Spring `@Configuration` only.

---

## Composition over Inheritance

| Rule | Pass | Fail |
|------|------|------|
| Default to composition (`has-a`) | `Car` has `Engine` | `SportsCar extends Engine` |
| Inheritance only for true `is-a` with shared contract | `Square` is a `Shape` (if LSP holds) | Inheritance for code reuse alone |

**FAIL:** inheritance deeper than **2** levels in new domain code without ADR.

---

## Encapsulation & Information Hiding

| # | Rule | Pass | Fail |
|---|------|------|------|
| E1 | Fields not publicly mutable | Private/protected fields | Public mutable fields for invariants |
| E2 | Expose behavior, not raw writable state | `user.deposit(100)` | `user.balance += 100` |
| E3 | Invariants enforced in constructors/factories/methods | Invalid state unrepresentable | Object exists in invalid state |

```text
FAIL: user.setBalance(user.getBalance() + 100)
PASS: user.deposit(100)
```

---

## Rich Domain Model (Anti-Anemic)

Business rules that operate on a single aggregate/entity belong **on that object**.

| PASS | FAIL |
|------|------|
| `invoice.calculateTotal()` | `InvoiceService.calculateTotal(invoice)` when logic only needs invoice state |
| `order.cancel(reason)` enforces cancellable states | Service reads flags and mutates fields externally |

Application **services** still coordinate multi-aggregate workflows, transactions, and ports — they must not become the only home of entity invariants.

**FAIL:** new entity that is only getters/setters while all rules live in a procedural service (anemic model) for non-trivial domain logic.

---

## Tell, Don't Ask

| PASS | FAIL |
|------|------|
| `account.withdraw(amount)` (object enforces rules) | `if (account.balance > amount) account.balance -= amount` |

---

## Law of Demeter

| Metric | Hard limit |
|--------|------------|
| Dot-chain through foreign objects | **≤ 2** foreign navigations in application code |

```text
FAIL: order.customer.address.city.country.code
PASS: order.getShippingCountryCode()
```

**FAIL:** `a.getB().getC().getD()` where B/C/D are different types exposing internals (train wreck).

---

## God Classes

Split when **any** of:

| Metric | Limit |
|--------|-------|
| Lines | **> 300** recommended split; **> 500** hard fail (`coding.md`) |
| Public methods | **> 15** |
| Unrelated responsibilities | **≥ 2** |

**FAIL:** `ApplicationManager`, `DataHelper`, `CommonUtils` as dumping grounds.

**PASS examples:** `UserRepository`, `AuthenticationService`, `OrderValidator`, `InvoiceGenerator`, `NotificationSender`.

---

## Constructors

Constructors / factories may only:

- Assign fields
- Validate invariants
- Create owned value objects

| Forbidden in constructors | Verdict |
|---------------------------|---------|
| DB queries | FAIL |
| HTTP/API calls | FAIL |
| Sending email/messages | FAIL |
| File I/O / heavy computation | FAIL |

Use factories/builders for complex creation — see `architecture/patterns.md`.

---

## Interfaces & DI

| # | Rule | Pass/Fail |
|---|------|-----------|
| I1 | Program to interfaces at module boundaries | FAIL: leaking concrete infra types into domain |
| I2 | Constructor injection | FAIL: service locator / static ambient context in domain |
| I3 | Composition root wires concretes | FAIL: domain constructs infrastructure |

---

## Layer Object Roles

| Type | May | Must not |
|------|-----|----------|
| Domain entity/VO | Enforce invariants, domain behavior | SQL, HTTP, UI |
| Domain/application service | Orchestrate use cases, transactions, ports | SQL strings, HTTP types, render UI |
| Repository | Persistence only | Business rules, sending email |
| DTO | Cross-boundary data | Business invariants |
| Controller | Map transport ↔ DTO/use case | Business rules |

```text
API ⇄ DTO ⇄ Domain ⇄ Repository
```

| Rule | Pass/Fail |
|------|-----------|
| Never expose persistence entities as API responses | FAIL if controller returns ORM entity |
| Use DTOs at trust boundaries | FAIL if skipping DTO when entity has internal fields |

---

## Getters / Setters

| PASS | FAIL |
|------|------|
| Read-only accessors when needed for mapping | Public setters that bypass invariants (`setBalance`, `setStatus` to illegal values) |
| Intention-revealing commands (`deposit`, `withdraw`, `cancel`) | Procedural get/set chains implementing rules outside the object |

Necessary setters for frameworks (ORM, serializers) must not be the API for business mutations — use domain methods and keep framework hooks package-private when possible.

---

## Static Methods

Allowed only for:

1. Pure functions with no domain mutation
2. Constants
3. Factories (`Order.create(...)`)

**FAIL:** static business workflows (`OrderService.processStatic(order)`), static mutable state, static DB access.

---

## Utility Classes

| Metric | Limit |
|--------|-------|
| Methods on a util class | **≤ 10** |
| Domains mixed in one util | **1** |

**FAIL:** `Utils` / `Helpers` / `Common` accumulating unrelated methods. Prefer domain types or named focused helpers (`MoneyParser`, `DateRanges`).

---

## Polymorphism over Conditionals

When selecting behavior by type/kind and variants ≥ **3**:

| PASS | FAIL |
|------|------|
| Strategy / polymorphic dispatch | Growing `switch` / `if-else` / `instanceof` chains |

Document `EXCEPTION: exhaustive-switch` for compiler-checked enums where strategies add no value.

---

## Patterns Mandate

When creation is complex, behavior varies by type, or cross-cutting wrappers are needed, **choose a pattern from** `architecture/patterns.md` instead of ad hoc procedural logic.

**FAIL:** new 50+ line procedural block that matches Factory, Strategy, Builder, Adapter, or Template Method criteria in that file but implements none of them.

---

## Self-Review Gate

- [ ] Business flow modeled with types, not a procedural script (or exception documented)
- [ ] SRP: one reason to change per new class
- [ ] Dependencies injected; no `new` infra in domain
- [ ] Entities own invariants; no anemic get/set mutation from services
- [ ] Composition preferred; inheritance justified
- [ ] No god class (>300 lines / >15 public methods / multi-responsibility)
- [ ] Constructors side-effect free
- [ ] Repositories have no business rules; services have no SQL/HTTP
- [ ] DTOs at API boundary
- [ ] No Demeter train wrecks
- [ ] Tell, don't ask for state-changing rules
- [ ] Pattern chosen when `architecture/patterns.md` criteria match
- [ ] SOLID questions Q1–Q8 considered
