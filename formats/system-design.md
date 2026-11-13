# Format: System Design

Folder: `content/topics/system-design/`

Read `TOPIC_STYLE.md` first. This file only adds what is special about this track.

## What belongs here

The full design of one product or system, end to end, the way you would do it in a design interview.
Examples: "Design a URL shortener", "Design a chat app", "Design a news feed", "Design a rate limiter service".

Title it as the thing being built: "URL Shortener", "Chat App". Don't start the title with "Design".

## What does not belong here

- One idea used inside many designs (caching, sharding). That is `core-concepts`.
- A choice between two options without a full system around it. That is `decisions`.
- How one existing product works inside. That is `internals`.

When a design uses an idea that has its own topic, explain it in one or two sentences and add that topic to `related`. Don't re-teach it.

## The 12 sections

| # | Key | Title on the page | What to write |
|---|---|---|---|
| 1 | `problem` | What are we building? | The product in 2 or 3 short paragraphs, as a user sees it. Name one or two real products that do this. End with a one-line version in a note box. |
| 2 | `requirements` | Requirements | Three `<h4>` parts: "Must do" (the features, as a numbered list), "Must be" (speed, uptime, consistency, as a list with a target for each), "Not doing" (what is left out, and why). |
| 3 | `estimates` | Scale and numbers | State the assumptions and say they are made up. Then work out requests per second, storage per year, and read-to-write ratio. Show each step. Finish with a small table of the final numbers. |
| 4 | `api` | API design | The main endpoints in a table: method and path, what it takes, what it returns. Then one code block with an example request and response for the most important one. |
| 5 | `data` | Data model and storage | The tables or collections, with their main columns, as SQL `CREATE TABLE` or a table. Say which database type you pick and why, in two or three sentences. Name the indexes. |
| 6 | `highLevel` | High-level design | One diagram with the main boxes: clients, load balancer, services, databases, caches, queues. Then numbered steps that follow the two most important requests through the boxes. |
| 7 | `deepDives` | Deep dives into the hard parts | Two to four `<h4>` parts. Each one is a hard question in this design ("How do we make short codes unique?"). For each: the options, the pick, and why. |
| 8 | `scaling` | Bottlenecks and scaling | What breaks first as traffic grows 10 times, then 100 times. For each bottleneck: how you would notice it, and the fix. Use the numbers from `estimates`. |
| 9 | `failures` | What can go wrong | A table: what fails, what the user sees, how the system handles it. Cover at least a database going down, a service crashing, and a traffic spike. |
| 10 | `tradeoffs` | Trade-offs and other options | A list. Each item starts with a bold "X vs Y." label, says what this design picked, and what it gave up. |
| 11 | `interview` | How to present it in an interview | Three `<h4>` parts: "The order to go in" (a numbered plan with rough minutes for each step), "Questions to ask first" (list), "Follow-ups to expect" (list with short answers). |
| 12 | `revision` | Quick revision | Only a summary list. See "The revision section" in `TOPIC_STYLE.md`. |

## Must have

- Numbers in `estimates` that are used again in `scaling`. The maths has to connect.
- One architecture diagram in `highLevel`.
- An endpoint table in `api`, and a failure table in `failures`.
- A stated database choice with the reason, in `data`.
- A "Not doing" list in `requirements`. A design with no limits is not a design.

## Skeleton

```html
<!--
title:
summary:
category:
order:
related:
-->

<!-- section: problem -->

<!-- section: requirements -->

<!-- section: estimates -->

<!-- section: api -->

<!-- section: data -->

<!-- section: highLevel -->

<!-- section: deepDives -->

<!-- section: scaling -->

<!-- section: failures -->

<!-- section: tradeoffs -->

<!-- section: interview -->

<!-- section: revision -->
```
