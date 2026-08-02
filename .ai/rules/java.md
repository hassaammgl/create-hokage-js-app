# Java / Spring Boot Standards

Measurable rules for Java and Spring Boot. Apply **in addition to** `coding.md`. Every rule is **PASS** or **FAIL**.

---

## Package Structure

| Rule | Pass | Fail |
|------|------|------|
| Layer packages match project convention | `controller` / `service` / `repository` / `domain` (or feature packages) used consistently | Business logic in `controller` package |
| No circular package deps | Compile/module boundary clean | Package cycles introduced |

Feature-first is PASS when the repo already uses it; do not invent a second layout.

---

## Spring Controllers

| # | Rule | Limit / Check |
|---|------|---------------|
| J1 | Controller methods contain no business rules | **FAIL** if method calls multiple repositories, opens transactions, or encodes domain branching beyond mapping/status codes |
| J2 | Controller method body length | **≤ 20 lines** (excluding annotations) |
| J3 | Return DTOs / ResponseEntity of DTOs | **FAIL** if returning JPA entities |
| J4 | Validation | `@Valid` / `@Validated` on request bodies; **FAIL** if missing on public write endpoints |
| J5 | Mapping | One endpoint → one service method |

```text
FAIL: repository.save(...) inside @RestController method with pricing logic
PASS: orderService.placeOrder(request) then map to ResponseEntity
```

---

## Services

| # | Rule | Pass/Fail |
|---|------|-----------|
| J6 | `@Transactional` on service methods that multi-write | PASS when present; FAIL if multi-repo writes lack a transaction boundary |
| J7 | No web types in services | FAIL if importing `HttpServletRequest`, `ResponseEntity`, etc. |
| J8 | Constructor injection only | FAIL: field `@Autowired`; PASS: constructor (Lombok `@RequiredArgsConstructor` OK if project uses it) |
| J9 | Public method count | ≤ 15 per service class (`coding.md`) |

---

## Persistence (JPA / JDBC)

| # | Rule | Pass/Fail |
|---|------|-----------|
| J10 | No `findAll()` on unbounded tables in request paths | FAIL without pagination |
| J11 | Explicit fetch for needed associations | FAIL: lazy load in loops (N+1) |
| J12 | `@Entity` not used as API response | FAIL when controller returns entity |
| J13 | Queries parameterized | FAIL: string-concatenated JPQL/SQL |
| J14 | Migrations via Flyway/Liquibase | FAIL: manual-only schema drift for new columns/tables |

---

## Nullability & Optionals

| # | Rule | Pass/Fail |
|---|------|-----------|
| J15 | Do not return `null` collections | PASS: empty list; FAIL: `return null` for `List`/`Map` |
| J16 | `Optional` only as return type | FAIL: `Optional` parameters or fields |
| J17 | No `.get()` on Optional without guard | FAIL: bare `optional.get()` |

---

## Exceptions

| # | Rule | Pass/Fail |
|---|------|-----------|
| J18 | Domain/API errors are typed | PASS: `NotFoundException`, etc.; FAIL: throwing raw `RuntimeException("fail")` for expected cases |
| J19 | `@ControllerAdvice` maps exceptions to error envelope | FAIL: ad-hoc try/catch in every controller duplicating status mapping |
| J20 | Never swallow | Per `coding.md` exceptions section |

---

## Configuration

| # | Rule | Pass/Fail |
|---|------|-----------|
| J21 | Secrets from env/secret store | FAIL: secrets in `application.yml` committed |
| J22 | Feature toggles default safe | FAIL: risky paths on by default in prod profile |

---

## Testing (Java)

| # | Rule | Pass/Fail |
|---|------|-----------|
| J23 | Pure domain logic: plain unit tests (no Spring) | FAIL: `@SpringBootTest` for pure functions |
| J24 | Web layer: `@WebMvcTest` or equivalent slice | — |
| J25 | Persistence: `@DataJpaTest` or Testcontainers | FAIL: mocked `EntityManager` as sole proof of query correctness for complex queries |
| J26 | Method names describe behavior | FAIL: `test1`, `testMethod` |

---

## Naming (Java)

| Kind | Pattern | Fail examples |
|------|---------|---------------|
| Class | `PascalCase` | `orderService` |
| Method/field | `camelCase` | `Calculate_Total` |
| Constant | `SCREAMING_SNAKE` | `maxLimit` used as constant |
| Package | lowercase | `com.Company.Order` |

---

## Self-Review Gate

- [ ] Controllers thin; no entities in responses
- [ ] Constructor injection
- [ ] Transactions on multi-write use cases
- [ ] No N+1; lists paginated
- [ ] Validation on write endpoints
- [ ] Typed exceptions + advice mapping
- [ ] No secrets in YAML
- [ ] Tests at the right slice
