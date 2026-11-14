# Format: Engineering Patterns & Practices

Folder: `content/topics/patterns/`

Read `TOPIC_STYLE.md` first. This file only adds what is special about this track.

## What belongs here

A named, reusable way to solve a problem that keeps coming back. It can be in code, in architecture, or in how a team works.
Examples: circuit breaker, retry with backoff, outbox, idempotency keys, CQRS, feature flags, blue-green deploys, code review practices.

The test: can you say "use the X pattern here" and another developer knows what to build? Then it is a pattern.

## What does not belong here

- A wide idea with many forms (caching, replication). That is `core-concepts`.
- A choice between patterns ("saga vs 2PC"). That is `decisions`.
- An attack and its defence. That is `security`.

## Length and visuals

The same budget as every other track (`TOPIC_STYLE.md` part 7). A topic is for learning, not for reference.

- **1,400 to 1,900 words** for the whole topic: a 7 to 10 minute read. The build prints a `Note:` over 2,200.
- **100 to 150 words** per section, 250 at the very most. All 12 sections are still written. Each one is just short.
- **At least two diagrams**: one in `problem` showing how it breaks without the pattern, one in `how` showing it working.
- Reach for a diagram, a table or a numbered list before a paragraph. A diagram replaces prose; it is not added next to it.
- Moderate depth: enough to understand it, explain it to someone, and use it. Then stop.
- First thing to cut in this track: variants down to the two people actually use.

## The 12 sections

| # | Key | Title on the page | What to write |
|---|---|---|---|
| 1 | `what` | What is it? | The pattern in 2 or 3 short paragraphs. Give its other names if it has any. End with a one-line version in a note box. |
| 2 | `problem` | The problem it solves | The situation without the pattern, with a concrete example of how it goes wrong. The reader should feel the pain before seeing the cure. |
| 3 | `realWorld` | Understand it with a real-world example | One everyday story that works the same way. Map each part of the story to the pattern. |
| 4 | `how` | How it works | Numbered steps, and one diagram. If the pattern has states (open, closed, half-open), show them. |
| 5 | `code` | Code example | Working code in NestJS / TypeScript. First the code without the pattern, in a few lines. Then with it. Keep it small enough to read in one go. |
| 6 | `variants` | Variants | The common versions of the pattern. One `<h4>` each: what changes, and when to pick it. |
| 7 | `tradeoffs` | Costs and trade-offs | What the pattern costs: more code, more moving parts, slower paths, harder debugging. Each item starts with a bold label. |
| 8 | `whenToUse` | When to use it, and when not to | Two `<h4>` parts: "Use it when" and "Skip it when". Be honest about over-use. |
| 9 | `mistakes` | Common mistakes | A list. Each item starts with the mistake in bold, then why it hurts and the fix. |
| 10 | `relatedPatterns` | Patterns that go with it | Patterns often used together with this one, and patterns people confuse it with. One or two sentences each on how they differ. |
| 11 | `interview` | Interview perspective | Three `<h4>` parts: "Common questions" (question in bold, short model answer), "Follow-ups to expect" (list), "Where it fits in a design" (one paragraph). |
| 12 | `revision` | Quick revision | Only a summary list. See "The revision section" in `TOPIC_STYLE.md`. |

## Must have

- A concrete failure in `problem`, before the pattern is explained.
- Two diagrams: how it breaks in `problem`, and how it works in `how`.
- Before and after code in `code`.
- A "Skip it when" part in `whenToUse`.
- The whole topic under 1,900 words, and no section over 250. See "Length and visuals" above.

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

<!-- section: problem -->

<!-- section: realWorld -->

<!-- section: how -->

<!-- section: code -->

<!-- section: variants -->

<!-- section: tradeoffs -->

<!-- section: whenToUse -->

<!-- section: mistakes -->

<!-- section: relatedPatterns -->

<!-- section: interview -->

<!-- section: revision -->
```
