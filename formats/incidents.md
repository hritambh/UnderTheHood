# Format: Incidents & Production Learnings

Folder: `content/topics/incidents/`

Read `TOPIC_STYLE.md` first. This file only adds what is special about this track.

## What belongs here

The story of one thing that broke in production, and what it teaches.
Two kinds:

- **Public incidents**: a well-known outage that the company wrote about itself.
- **Your own incidents**: something from your own work.

Title it by what failed, not by who: "A retry storm that took down checkout", "The database that ran out of connection slots".

## What does not belong here

- A general list of mistakes about an idea. That goes in the `mistakes` section of that idea's topic.
- A pattern that prevents a class of failures (circuit breaker). That is `patterns`. Link to it from `prevention`.

## Two rules that are stricter in this track

**1. This site is public. Keep private details out.**
For your own incidents, never write:

- the company's name, a customer's name, or a person's name
- internal host names, service names, URLs, IP addresses, ticket numbers
- real customer data, keys, or passwords
- exact revenue or user numbers from real work

Replace them with plain stand-ins: "a payments service", "a large customer", "about a third of requests". Change details that could identify the event, and say in `summary` that details were changed.

**2. Don't make up facts.**

- For a public incident, only use what the company published. Name the source in `summary` ("based on the company's own write-up from March 2024"). If the write-up doesn't say something, write "not stated". Don't guess.
- For your own incident, write what you know. Mark guesses as guesses.
- No blame. Write about what the system allowed, not about who did it.

## Length and visuals

The same budget as every other track (`TOPIC_STYLE.md` part 7). A topic is for learning, not for reference.

- **1,200 to 1,700 words** for the whole topic: a 6 to 9 minute read. The build prints a `Note:` over 2,000.
- **100 to 150 words** per section, 250 at the very most. All 12 sections are still written. Each one is just short.
- **At least two diagrams**: one in `context` showing the system before, one more in `rootCause` showing the chain of causes.
- Reach for a diagram, a table or a numbered list before a paragraph. A diagram replaces prose; it is not added next to it.
- Moderate depth: enough to understand it, explain it to someone, and use it. Then stop.
- First thing to cut in this track: timeline rows where nothing was learnt or decided.

## The 12 sections

| # | Key | Title on the page | What to write |
|---|---|---|---|
| 1 | `summary` | What happened | The whole incident in 3 or 4 sentences: what broke, for how long, the cause, the fix. Name the source, or say details were changed. End with the one lesson in a note box. |
| 2 | `context` | The system before the incident | Only the parts of the system that matter for this story, with one diagram. Explain what normal looked like. |
| 3 | `timeline` | Timeline | A table: time, what happened, what people knew at that point. Use real times for public incidents, and "T+0, T+5 min" for your own. |
| 4 | `impact` | Impact | Who was affected and how: errors, slow pages, lost data, money. How long. Use numbers where they are known. |
| 5 | `detection` | How it was noticed | What told people something was wrong (an alert, a customer, a dashboard), and how long after it started. Say what should have caught it sooner. |
| 6 | `rootCause` | Root cause | The chain from first cause to visible failure, as numbered steps. Keep asking "why did that happen?" until you reach something that can be fixed. |
| 7 | `factors` | What made it worse | The things that turned a small problem into a big one: missing limits, retries, a slow rollback, a confusing dashboard. One list item each. |
| 8 | `fix` | The fix | Two `<h4>` parts: "Stopping the damage" (what was done during the incident) and "The real fix" (what was changed after). |
| 9 | `prevention` | How to stop it happening again | The changes made so this class of failure can't repeat: limits, alerts, tests, process. Link to patterns that have their own topic. |
| 10 | `lessons` | Lessons for other systems | Three to five lessons that apply beyond this system. Each starts with the lesson in bold, then one or two sentences on why. |
| 11 | `checklist` | Check your own system | Questions the reader can ask about their own system, as a list. Each should be answerable with yes or no. |
| 12 | `revision` | Quick revision | Only a summary list. See "The revision section" in `TOPIC_STYLE.md`. |

## Must have

- The source named, or a line saying details were changed, in `summary`.
- A timeline table in `timeline`.
- Two diagrams: the system in `context`, and the chain of causes in `rootCause`.
- A root cause that goes at least three "why"s deep.
- No private details and no blame, as described above.
- The whole topic under 1,700 words, and no section over 250. See "Length and visuals" above.

## Skeleton

```html
<!--
title:
summary:
category:
order:
related:
-->

<!-- section: summary -->

<!-- section: context -->

<!-- section: timeline -->

<!-- section: impact -->

<!-- section: detection -->

<!-- section: rootCause -->

<!-- section: factors -->

<!-- section: fix -->

<!-- section: prevention -->

<!-- section: lessons -->

<!-- section: checklist -->

<!-- section: revision -->
```
