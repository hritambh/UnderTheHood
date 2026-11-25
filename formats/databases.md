# Format: Database Engineering

Folder: `content/topics/databases/`

Read `TOPIC_STYLE.md` first. This file only adds what is special about this track.

## What belongs here

How to use and run a database well.
Examples: indexes, transactions and isolation levels, locks, query plans, schema design, migrations without downtime, replication, connection pooling, backups.

## What does not belong here

- How one database engine does something inside, at the level of files and data structures ("PostgreSQL MVCC"). That is `internals`.
- A choice between databases ("SQL vs NoSQL"). That is `decisions`.
- An idea that is bigger than databases (caching, pagination across an API). That is `core-concepts`.

## Rules for this track

- Use PostgreSQL for examples unless the topic is about another database. Say which one in `what`.
- Every claim about behaviour must be true for that database. Isolation levels, locks and defaults differ between PostgreSQL and MySQL. Say which one you mean.
- SQL must be real and runnable. Create the table before you query it.

## Length and visuals

The same budget as every other track (`TOPIC_STYLE.md` part 7). A topic is for learning, not for reference.

- **About 2,500 words** for the whole topic: a 12 to 13 minute read. That is a target, not a wall. A subject that genuinely needs more room gets it rather than being cut until the required parts go missing; the build only prints a `Note:` past 3,000.
- **100 to 200 words** per section, 300 at the very most. All 12 sections are still written. Each one is just short.
- **At least two diagrams**: one in `internals` showing what the database does, one more in `example` or `numbers` (rows, pages, or what the index looks like).
- Reach for a diagram, a table or a numbered list before a paragraph. A diagram replaces prose; it is not added next to it.
- Moderate depth: enough to understand it, explain it to someone, and use it. Then stop.
- First thing to cut in this track: extra `EXPLAIN` output, and settings that don't change the behaviour you just explained.

## The 12 sections

| # | Key | Title on the page | What to write |
|---|---|---|---|
| 1 | `what` | What is it? | A plain definition in 2 to 4 short paragraphs. Say which database the examples use. End with a one-line version in a note box. |
| 2 | `why` | Why does it matter? | What goes wrong without it: slow queries, wrong data, lost data, downtime. Give one concrete example. |
| 3 | `example` | See it with a small example | One small table with a few rows, shown as SQL. Then the queries that show the idea working, with their results. The reader should be able to run all of it. |
| 4 | `internals` | How the database does it inside | Numbered steps of what the database does, and one diagram. Enough to explain the behaviour, not every detail. |
| 5 | `types` | Different types or options | One `<h4>` per type. For each: how it works, when to use it, good, bad. End with a comparison table. |
| 6 | `numbers` | Practical example with numbers | State the assumptions and say they are made up. Then the maths: rows, pages, time, size. Each result in bold. |
| 7 | `commands` | Queries and commands to know | The SQL and commands used with this in real work: creating it, checking it, finding problems. Show `EXPLAIN` output where it applies, and say how to read it. |
| 8 | `tradeoffs` | Advantages, disadvantages, and trade-offs | A list. Each item starts with a bold "X vs Y." label. |
| 9 | `whenToUse` | When should I use it? | Signals that it fits. Also when you do **not** need it. |
| 10 | `mistakes` | Common mistakes | A list. Each item starts with the mistake in bold, then why it hurts and the fix. |
| 11 | `interview` | Interview perspective | Three `<h4>` parts: "Common questions" (question in bold, short model answer), "Follow-ups to expect" (list), "How it fits a bigger design" (one paragraph). |
| 12 | `revision` | Quick revision | Only a summary list. See "The revision section" in `TOPIC_STYLE.md`. |

## Must have

- The database named in `what`.
- Runnable SQL in `example`, starting from `CREATE TABLE`.
- Two diagrams: one in `internals`, and one more in `example` or `numbers`.
- A comparison table at the end of `types`.
- Real commands in `commands`, with a note on how to read their output.
- The whole topic around 2,500 words, and no section over 300. See "Length and visuals" above.

## Skeleton

```html
<!--
title:
summary:
category:
order:
related:
-->

<!-- section: what -->

<!-- section: why -->

<!-- section: example -->

<!-- section: internals -->

<!-- section: types -->

<!-- section: numbers -->

<!-- section: commands -->

<!-- section: tradeoffs -->

<!-- section: whenToUse -->

<!-- section: mistakes -->

<!-- section: interview -->

<!-- section: revision -->
```
