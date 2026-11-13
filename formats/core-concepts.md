# Format: Core Concepts

Folder: `content/topics/core-concepts/`

Read `TOPIC_STYLE.md` first. This file only adds what is special about this track.

## What belongs here

One general idea that shows up in many systems, explained from the ground up.
Examples: caching, load balancing, rate limiting, pagination, consistency models, message queues.

## What does not belong here

| If the topic is... | Put it in |
|---|---|
| a full design of one product ("Design a URL shortener") | `system-design` |
| how one named tool works inside (Kafka, PostgreSQL, Redis) | `internals` |
| a story of something that broke | `incidents` |
| a named, reusable solution (circuit breaker, outbox) | `patterns` |
| about using or running a database (indexes, transactions) | `databases` |
| an algorithm or data structure problem | `dsa` |
| an attack and how to defend against it | `security` |
| a choice between options ("SQL vs NoSQL") | `decisions` |

## The 12 sections

Write them in this order. The site adds the titles, so don't repeat them in the content.

| # | Key | Title on the page | What to write |
|---|---|---|---|
| 1 | `what` | What is it? | A plain definition in 2 to 4 short paragraphs. Define each new term the first time it appears. End with a one-line version in a note box. |
| 2 | `why` | Why do we need it? | The problem it solves. What goes wrong without it. Finish with the real question a designer has to answer. |
| 3 | `realWorld` | Understand it with a real-world example | One everyday story (a restaurant, a library, an office). Map each part of the story to the technical idea. Show the costs in the story too, not only the benefits. |
| 4 | `software` | Understand it with a software example | One concrete app feature with real code. Use NestJS / TypeScript on the backend, and PostgreSQL or Redis where a database is needed. After the code, say what is now harder. |
| 5 | `internals` | How does it work internally? | Numbered steps of what happens, from request to response. One diagram that shows the flow. |
| 6 | `types` | Different types or approaches | One `<h4>` per type. For each: how it works, when to use it, good, bad. End with a comparison table. |
| 7 | `numbers` | Practical example with numbers | State the assumptions first and say they are made up. Then show the maths step by step, with each result in bold. |
| 8 | `tradeoffs` | Advantages, disadvantages, and trade-offs | A list of trade-offs. Each item starts with a bold "X vs Y." label. |
| 9 | `whenToUse` | When should I use it? | Signals that it fits. Also when you do **not** need it. |
| 10 | `mistakes` | Common mistakes | A list. Each item starts with the mistake in bold, then why it hurts and the fix. |
| 11 | `interview` | Interview perspective | Three `<h4>` parts: "Common questions" (question in bold, short model answer), "Follow-ups to expect" (list), "How it fits a bigger design" (one or two paragraphs). |
| 12 | `revision` | Quick revision | Only a summary list. See "The revision section" in `TOPIC_STYLE.md`. |

## Must have

- A one-line version in a note box at the end of `what`.
- At least one diagram, in `internals`.
- A comparison table at the end of `types`.
- Worked maths in `numbers`, with assumptions labelled as made up.

## A good example to copy from

`content/topics/core-concepts/realtime-communication.html`

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

<!-- section: realWorld -->

<!-- section: software -->

<!-- section: internals -->

<!-- section: types -->

<!-- section: numbers -->

<!-- section: tradeoffs -->

<!-- section: whenToUse -->

<!-- section: mistakes -->

<!-- section: interview -->

<!-- section: revision -->
```
