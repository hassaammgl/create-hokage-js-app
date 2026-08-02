# Performance Rules

Rules for keeping latency, throughput, and resource usage within SLOs. Pair with `database.md` and `backend.md`.

---

## Measure Before Optimizing

- Establish a baseline (p50/p95/p99 latency, error rate, throughput) before major optimization work.
- Profile with real-ish data volumes — not 10-row tables.
- Optimize the hottest path first; do not micro-optimize cold code.
- Set budgets: e.g. API p95 < 300ms excluding webhooks; page LCP budgets for frontend.

**Why:** Untargeted optimization wastes time and adds complexity.

---

## Big O Thinking

- Know the complexity of hot loops: O(n²) over request-sized inputs is a red flag.
- Avoid loading entire tables into memory to filter in app code — filter in the database/search engine.
- For nested loops over DB results, estimate worst-case n in production (10? 10k? 10M?).
- Prefer streaming / cursors for large exports.

---

## N+1 Queries

- Forbidden in request paths: querying inside a per-item loop when a batch query would do.
- Detect via query logs / APM in development for new list endpoints.
- Fix with: join fetch, `IN` batch, dataloader patterns, or a single query returning nested rows.

```text
// BAD
for (order in orders) {
  order.customer = repo.findCustomer(order.customerId)
}

// GOOD
customers = repo.findCustomers(orders.map(o => o.customerId))
// map in memory
```

---

## Lazy Loading

- ORM lazy loads in web requests are N+1 hazards — prefer explicit fetch plans.
- Do not serialize lazy proxies in API responses (causes accidental queries or errors).
- Load associations required by the use case up front.

---

## Batch Operations

- Batch inserts/updates (`UNNEST`, multi-VALUES, bulk APIs) for large writes.
- Batch external API calls when vendors support bulk endpoints.
- Cap batch sizes to stay under lock/timeout limits (e.g. 500–1000 rows per chunk).

---

## Connection Pools

- Size pools from evidence: watch pool wait time metrics.
- Do not allocate a huge pool per instance — you will exhaust DB `max_connections`.
- Fail fast when pool exhausted rather than hanging forever.
- See `database.md` for formula guidance.

---

## Caching (Redis / CDN / HTTP)

- Cache read-heavy, infrequently changing data with explicit TTL and invalidation strategy.
- Include tenant/user in keys for personalized data.
- Use CDN/HTTP cache headers (`Cache-Control`, `ETag`) for public assets and safe public GETs.
- Do not cache errors aggressively without care.
- Measure hit rate; unused caches add complexity only.

---

## Compression & Payloads

- Enable HTTP compression (gzip/br) at the edge for JSON/text.
- Keep JSON payloads lean — no unused fields on hot endpoints.
- Paginate; never return unbounded arrays.
- Prefer sparse fieldsets only if already a project convention.

---

## Streaming & Async

- Stream large file downloads/uploads; do not buffer entire bodies in memory.
- Move slow work (email, PDF, ML, partner sync) to background jobs; return `202` + status resource when appropriate.
- Use async I/O for high-concurrency wait-bound workloads when the stack supports it well.

---

## Memory Optimization

- Avoid retaining large collections on singletons/global caches without eviction.
- Beware of building giant strings/arrays in tight loops.
- Process records in chunks for batch jobs.
- Watch for memory leaks: unbounded maps, event listener accumulation, growing buffers.

---

## Frontend Performance

- Code-split large routes.
- Optimize images (size, format, lazy-load).
- Minimize main-thread long tasks; break up heavy computation or move to workers.
- Track Core Web Vitals when the product is user-facing web.

---

## Timeouts & Backpressure

- Every dependency call has a timeout.
- Apply bulkheads so one slow dependency cannot exhaust all workers.
- Shed load when overloaded (`503` + retry guidance) rather than melting down.

---

## Performance Anti-Patterns

- Synchronous remote calls inside DB transactions
- Unbounded `findAll()` without pagination
- Building reports via ORM entity graphs in HTTP requests
- Logging huge payloads at `info` on hot paths
- Regex catastrophic backtracking on user input

---

## Performance Checklist (Inline)

- [ ] No N+1 on list/detail endpoints
- [ ] Queries bounded; EXPLAIN for new heavy queries
- [ ] External calls timed out and isolated
- [ ] Cache TTLs/keys correct if caching
- [ ] Large work async or streamed
- [ ] Pool sizing sane
- [ ] Payload sizes reasonable
