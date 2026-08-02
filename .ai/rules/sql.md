# SQL Standards

Measurable rules for SQL (PostgreSQL-first; adapt dialect only when the repo requires). Apply **in addition to** `coding.md` and `database.md`. Every rule is **PASS** or **FAIL**.

---

## SELECT

| # | Rule | Pass/Fail |
|---|------|-----------|
| S1 | Never `SELECT *` in application SQL | **FAIL** always for app/query-builder raw SQL |
| S2 | List queries have `LIMIT` or keyset bound | **FAIL** unbounded `SELECT` in request paths |
| S3 | Select only needed columns | FAIL: selecting 30 columns for a 3-field list DTO |
| S4 | Deterministic `ORDER BY` when paginating | FAIL: unordered LIMIT pages |

```text
FAIL: SELECT * FROM orders;
PASS: SELECT id, customer_id, status, created_at FROM orders WHERE ... LIMIT 20;
```

---

## Writes

| # | Rule | Pass/Fail |
|---|------|-----------|
| S5 | Writes list columns explicitly | FAIL: `INSERT INTO t VALUES (...)` without column list |
| S6 | Multi-row mutations batched intentionally | FAIL: row-by-row inserts in a loop when bulk insert is available |
| S7 | Mass `UPDATE`/`DELETE` without `WHERE` | **FAIL** always (except documented truncate maintenance job) |

---

## Parameters & Injection

| # | Rule | Pass/Fail |
|---|------|-----------|
| S8 | Bind parameters only | FAIL: string concatenation of user input into SQL |
| S9 | Identifiers (table/column/order-by) from allowlists | FAIL: client string in `ORDER BY` |
| S10 | No dynamic SQL unless audited | FAIL: undocumented `EXECUTE` with user input |

---

## Joins & Filters

| # | Rule | Pass/Fail |
|---|------|-----------|
| S11 | Join conditions in `ON`; filters in `WHERE` | FAIL: filter predicates only in `ON` that change join semantics unintentionally without comment |
| S12 | Prefer `EXISTS` over `COUNT(*) > 0` for existence | FAIL: full count used only to check existence on large tables |
| S13 | Tenant / authz filters present | FAIL: missing `tenant_id` (or equivalent) on tenant data |

---

## Indexes & Plans

| # | Rule | Pass/Fail |
|---|------|-----------|
| S14 | New hot `WHERE`/`JOIN` columns indexed or justified | FAIL: new high-QPS filter with sequential scan accepted silently |
| S15 | `EXPLAIN (ANALYZE, BUFFERS)` attached for new heavy queries | FAIL: “should be fine” with no plan on large-table queries |
| S16 | No function-wrapped indexed columns in hot filters | FAIL: `WHERE DATE(created_at) = ...` on large tables |

---

## Transactions

| # | Rule | Pass/Fail |
|---|------|-----------|
| S17 | Transactions as short as possible | FAIL: HTTP call inside open transaction |
| S18 | Explicit isolation when required | FAIL: relying on accidental race for inventory/ledger |
| S19 | Idempotent retries safe | FAIL: non-idempotent write retried without guard |

---

## Schema / DDL

| # | Rule | Pass/Fail |
|---|------|-----------|
| S20 | DDL only via migrations | FAIL: undocumented prod DDL |
| S21 | Expand/contract for breaking changes | FAIL: drop column in same release old code still reads |
| S22 | FK columns indexed | FAIL: new FK without index on referencing column |
| S23 | `TIMESTAMPTZ` for absolute times | FAIL: `TIMESTAMP` without tz for event times |
| S24 | Money not `FLOAT`/`REAL`/`DOUBLE` | FAIL |

---

## Naming

| Kind | Pass | Fail |
|------|------|------|
| Tables | `snake_case` plural | `Orders`, `orderItems` |
| Columns | `snake_case` | `CamelCase` |
| Indexes | `idx_table_cols` | `index1` |

---

## Views & Functions

| # | Rule | Pass/Fail |
|---|------|-----------|
| S25 | Views do not hide expensive unbounded scans used in OLTP request paths | FAIL: view used as `SELECT * FROM huge_view` per request |
| S26 | Security definer functions reviewed | FAIL: new definer function without authz note in PR |

---

## Self-Review Gate

- [ ] No `SELECT *`
- [ ] Lists bounded; ORDER BY deterministic when paginated
- [ ] Parameters bound; no injected identifiers
- [ ] Tenant filters present
- [ ] Hot queries planned; indexes justified
- [ ] Migrations expand/contract safe
- [ ] No float money; timestamptz used
- [ ] Transactions short
