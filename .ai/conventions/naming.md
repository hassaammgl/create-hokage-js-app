# Naming Conventions

Canonical naming rules for code symbols, files, APIs, and data. If the repository already has an established dialect, follow the repository — use this file to fill gaps and keep new code consistent.

---

## General Principles

- Names describe meaning, not implementation type (`UserList` not `ArrayList2`).
- Prefer full words over abbreviations except universal standards (`id`, `http`, `url`, `api`, `db`, `sql`, `cpu`).
- Be consistent within a module: do not mix `getUser` / `fetchUser` / `loadUser` for the same kind of operation.
- Do not include redundant context: inside class `Order`, prefer `calculateTotal()` over `calculateOrderTotal()`.

---

## Casing by Language Family

| Kind | TypeScript/JavaScript | Python | Go | Java/Kotlin | SQL |
|------|----------------------|--------|-----|-------------|-----|
| Files | `kebab-case` or match project (`UserService.ts`) | `snake_case.py` | `snake_case.go` | `PascalCase.java` | `snake_case` |
| Classes / Types | `PascalCase` | `PascalCase` | `PascalCase` | `PascalCase` | — |
| Functions / vars | `camelCase` | `snake_case` | `camelCase` / exported `PascalCase` | `camelCase` | — |
| Constants | `SCREAMING_SNAKE` | `SCREAMING_SNAKE` | `SCREAMING_SNAKE` or camel | `SCREAMING_SNAKE` | — |
| Packages/dirs | `kebab-case` or `camelCase` per project | `snake_case` | short lowercase | lowercase | — |

Follow the language’s community standard when this table conflicts with repo tooling.

---

## Booleans

Prefixes:

- `is` — state: `isActive`, `isEmpty`
- `has` — possession: `hasChildren`
- `can` — capability: `canRefund`
- `should` — policy advice: `shouldRetry`

Avoid negated names when possible (`isInvalid` → prefer `isValid` with inverted check carefully). Do not use `flag`, `check`, `status` as boolean names.

---

## Functions & Methods

- Verb phrases: `createOrder`, `authorizePayment`, `findActiveUsers`
- Query methods that may return empty: `find*` / `get*` — pick one convention per project and stick to it (`get` throws if missing; `find` returns optional — document the rule)
- Side-effect free transforms: `toDto`, `mapToResponse`
- Async: do not suffix `Async` unless the project already does (redundant in JS/TS)

---

## Classes & Types

- Domain entities: `Order`, `Customer`
- Services: `OrderService`, `PricingService`
- Repositories: `OrderRepository`
- Controllers: `OrderController` / `OrdersHandler`
- DTOs: `CreateOrderRequest`, `OrderResponse` — not `OrderDTODto`
- Ports/interfaces: `PaymentGateway`, `Clock` — not `IPaymentGateway` unless the codebase already uses `I` prefix
- Errors: `OrderNotFoundError`, `PaymentDeclinedError`

---

## Database Naming

- Tables: plural `snake_case` — `order_items`
- Columns: `snake_case` — `customer_id`, `created_at`
- Primary key: `id` or `<table_singular>_id` per project standard (pick one)
- Foreign keys: `<referenced_singular>_id` — `customer_id`
- Indexes: `idx_<table>_<columns>` — `idx_orders_customer_id_created_at`
- Unique: `uq_<table>_<columns>`
- Check: `ck_<table>_<intent>`

---

## API Naming

- Path segments: plural nouns `kebab-case` or `snake` per API style — be consistent: `/order-items` or `/order_items`
- Query params: `camelCase` or `snake_case` matching existing API
- Headers: `Pascal-Kebab-Case` standard headers; custom `X-Request-Id` only if project already uses `X-`
- Error codes: `SCREAMING_SNAKE` — `ORDER_NOT_MODIFIABLE`

---

## Events & Jobs

- Domain events: past tense `OrderPlaced`, `PaymentCaptured`
- Queue topics: `dot.or.kebab` per infra — `orders.placed`
- Job names: verb + noun — `send-invoice-email`

---

## Tests

- Files: `*.test.ts` / `*_test.go` / `test_*.py` matching project
- Names: `should_refund_when_order_cancelled` or `refunds when order cancelled`

---

## Forbidden Names

- `data`, `info`, `temp`, `tmp`, `stuff`, `manager2`, `helper` (without specific meaning)
- `Utils` dumping ground classes — name by domain (`DateFormat`, `MoneyParser`)
- Single-letter names except loop indices or well-known math

---

## Checklist

- [ ] Casing matches language + repo
- [ ] Booleans prefixed correctly
- [ ] DB/API names consistent with existing schema/OpenAPI
- [ ] No meaningless or duplicate aliases
