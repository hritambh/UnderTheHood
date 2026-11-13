# Format: Engineering Decisions & Trade-offs

Folder: `content/topics/decisions/`

Read `TOPIC_STYLE.md` first. This file only adds what is special about this track.

## What belongs here

A choice a team really has to make, where both sides are reasonable.
Examples: "SQL vs NoSQL", "Monolith vs Microservices", "REST vs gRPC", "Build vs Buy", "Sync vs Async communication", "Saga vs Two-Phase Commit".

Title it as the choice: "X vs Y". Two options is best. Three is the most a topic should take.

## What does not belong here

- Teaching one of the options from the ground up. That is a `core-concepts`, `patterns` or `databases` topic. Here, give each option three or four sentences and link to its own topic in `related`.
- A full system design. That is `system-design`.

## Rules for this track

- Be fair. Each option gets its strongest case. If the topic reads like an advert for one side, rewrite it.
- No winner without a context. The answer is always "it depends on...", and the topic's job is to say exactly what it depends on.
- Every "it depends" must be followed by the thing it depends on and which way it pushes.

## The 12 sections

| # | Key | Title on the page | What to write |
|---|---|---|---|
| 1 | `decision` | The decision | What is being chosen, and the moment in a project when this choice comes up. Why it is hard. End with a one-line version in a note box. |
| 2 | `options` | The options | One `<h4>` per option. Three or four sentences each: what it is and what it is best at. Keep them the same length. |
| 3 | `realWorld` | Understand it with a real-world example | One everyday choice that has the same shape (renting vs buying, one big kitchen vs food stalls). Map each side to an option. |
| 4 | `criteria` | What matters when choosing | The questions that decide it: team size, traffic, how often things change, consistency needs. For each question, say which answer points to which option. |
| 5 | `compare` | Side by side | One comparison table. Rows are the criteria from the section before. Columns are the options. Short cells. |
| 6 | `numbers` | Practical example with numbers | One made-up but realistic situation, with numbers, worked through for each option. Show how the numbers change the answer. |
| 7 | `whenEach` | When each option wins | One `<h4>` per option: "Pick X when". A list of clear signals under each. Add a last part, "When it doesn't matter much". |
| 8 | `hiddenCosts` | Costs people miss | What each option costs later that nobody mentions at the start: operations, hiring, debugging, migration. One list per option. |
| 9 | `changing` | How hard is it to change later? | What moving from one option to the other takes, in both directions. Say which direction is easier, and what to do now to keep the door open. |
| 10 | `mistakes` | Common mistakes | A list. Each item starts with the mistake in bold ("Choosing for scale you don't have"), then why it hurts. |
| 11 | `interview` | Interview perspective | Three `<h4>` parts: "How to answer 'which would you pick?'" (a short structure for the answer), "Follow-ups to expect" (list), "What a strong answer includes" (list). |
| 12 | `revision` | Quick revision | Only a summary list. See "The revision section" in `TOPIC_STYLE.md`. |

## Must have

- A comparison table in `compare`, with the same criteria that `criteria` explains.
- Each option's own topic listed in `related`, when one exists.
- Both directions covered in `changing`.
- A "When it doesn't matter much" part in `whenEach`.
- Fair treatment of every option, as described above.

## Skeleton

```html
<!--
title:
summary:
category:
order:
related:
-->

<!-- section: decision -->

<!-- section: options -->

<!-- section: realWorld -->

<!-- section: criteria -->

<!-- section: compare -->

<!-- section: numbers -->

<!-- section: whenEach -->

<!-- section: hiddenCosts -->

<!-- section: changing -->

<!-- section: mistakes -->

<!-- section: interview -->

<!-- section: revision -->
```
