# 10 Concept Questions (Core Programming)

## 1. Complexity

**What do Big-O, Big-Theta, and Big-Omega describe, and how would you compare `O(n log n)` vs `O(n^2)` in practice?**

I think of Big-O as the worst-case ceiling, Theta as the realistic average band, and Omega as the best-case floor. In practice, I mostly care about Big-O because I'm building backend services where worst-case spikes matter.

For example, `O(n log n)` vs `O(n^2)`:

- With small data, you won't feel it.
- But once your data grows (like user lists, payments, logs), `O(n^2)` becomes very slow.

From experience, even switching from nested loops to something like hashing or sorting-based logic has made a huge difference.

## 2. Data Structures

**When would you choose an array/list, linked list, hash map, or tree? Give one trade-off for each.**

I usually choose based on access patterns:

- Array/List -> fast indexing, used a lot in APIs  
  Trade-off: slow inserts/deletes in the middle
- Linked List -> good for frequent inserts/deletes  
  Trade-off: no random access (I rarely use it in backend apps)
- Hash Map (`dict`) -> my go-to (IDs, lookups, caching)  
  Trade-off: no ordering + memory overhead
- Tree -> useful for hierarchical data (rare but useful in structured data)  
  Trade-off: more complex to implement/manage

In my projects, I've mostly relied on hash maps + arrays, especially when handling user data, payments, etc.

## 3. Immutability & State

**What's the difference between mutable and immutable data? Why can immutability simplify reasoning and concurrency?**

- Mutable = can change
- Immutable = cannot change

I've seen how immutability helps especially when working with APIs and async code:

- fewer side effects
- easier debugging
- safer in concurrent environments

For example, in backend logic, I prefer returning new objects instead of mutating shared ones - avoids weird bugs.

## 4. Memory Model

**What's the difference between the stack and the heap? How do scope and lifetime relate to each?**

- Stack -> function calls, local variables, fast, auto-managed
- Heap -> objects, dynamic memory, slower, manually/GC managed

From practice:

- Stack = short-lived, scoped
- Heap = long-lived data (like objects from DB)

Scope/lifetime:

- Stack variables disappear after function ends
- Heap objects live as long as they're referenced

This becomes important when thinking about memory leaks or large datasets.

## 5. OOP Basics

**Explain encapsulation, inheritance, and polymorphism. When is composition preferable to inheritance?**

- Encapsulation -> hide internal logic (I use this a lot in services/controllers)
- Inheritance -> reuse behavior (less used in modern backend design)
- Polymorphism -> same interface, different behavior

I've learned that composition > inheritance:

Instead of extending classes, I prefer injecting services/modules (like in NestJS or Laravel).

Why?

- more flexible
- less tightly coupled
- easier to test

## 6. APIs & Contracts

**What is an idempotent API operation? Give an example of an idempotent vs non-idempotent HTTP method.**

An operation is idempotent if repeating it doesn't change the result.

Examples:

- `GET` -> idempotent (fetching data repeatedly = same result)
- `PUT` -> idempotent (update to same state)
- `POST` -> not idempotent (creates new resource each time)

In real systems (payments, subscriptions), this is critical - you don't want duplicate transactions if a request retries.

## 7. Concurrency vs Parallelism

**Define both. What problems do race conditions and deadlocks cause, and how can you mitigate them?**

- Concurrency -> handling multiple tasks at once (async, event loop)
- Parallelism -> actually running tasks at the same time (multi-core)

Problems:

- Race conditions -> inconsistent data
- Deadlocks -> system freeze

Mitigation:

- locks (carefully)
- queues (like Celery, job systems)
- avoiding shared mutable state

From experience, I prefer queue-based systems over heavy locking.

## 8. Databases

**When would you pick SQL vs NoSQL? What are indexes and how can they both help and hurt performance?**

I'd pick:

- SQL (PostgreSQL, MySQL) -> structured data, relationships
- NoSQL -> flexible schema, scaling, logs/events

Since I've worked with structured systems (users, memberships, payments), I mostly use SQL.

Indexes:

- Help -> faster reads
- Hurt -> slower writes, extra storage

So I only index fields I query often (like `user_id`, `email`).

## 9. Testing

**Contrast unit, integration, and end-to-end tests. When should you mock, and what are the risks of over-mocking?**

- Unit tests -> small pieces (functions/services)
- Integration tests -> modules working together
- E2E tests -> full system flow

Mocking:

- useful when external systems exist (DB, APIs)

But over-mocking is dangerous:

- tests pass, real system fails
- you test assumptions, not reality

I try to balance it - mock external stuff, but keep core logic real.

## 10. Version Control

**Explain the differences between merge and rebase in Git. When would you favor one over the other?**

- Merge -> keeps history, adds merge commit
- Rebase -> rewrites history, cleaner timeline

I use:

- Rebase -> on my own branches (clean commits)
- Merge -> on shared branches (safer, no history rewriting)

Rule I follow:

- Never rebase shared/public branches.
