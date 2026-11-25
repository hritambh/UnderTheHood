# Format: Work Experience & Projects

Folder: `content/topics/experience/`

Read `TOPIC_STYLE.md` first. This file only adds what is special about this track.

## What belongs here

One piece of work you did yourself, written up so you can tell its story well.
Usually a project, a migration, a feature you owned, or a system you built or rebuilt.

One topic = one piece of work, not one job. A three-year job with four interesting
projects is four topics, each with its own story. Name the employer in `context`.

Title it by the work, not by the company or the job: "Rebuilding the Lead Assignment
Engine", "Moving Reporting Off the Main Database". The company name belongs in the
`category` and the first section, so the track groups by employer on the home page.

## What does not belong here

- A general explanation of an idea you used at work (caching, sagas, sharding).
  That is `core-concepts` or another track. Link to it from `approach`.
- The story of one outage. That is `incidents`.
- A design you never built, or a design question from an interview. That is `system-design`.

## Three rules that are stricter in this track

**1. The site is public. Keep it to what you would say in an interview.**

This is the one track that names a real employer, and the rule is the same one a
public interview answer follows. Write freely about:

- the shape of the problem, your design, and why you chose it
- the name of a component you built, and what it does. The internal addresses it lives at are a different thing, and they stay out
- technologies, patterns and schema ideas
- what you learnt, and what you would do differently
- numbers your employer has already published, or rough ones you are free to share

Never write:

- a customer's name, or anything that identifies one
- internal host names, URLs, IP addresses, repository paths, environment variable names, internal API routes, ticket numbers
- real keys, passwords, config, or any customer data
- revenue, contract values, or internal metrics you were not cleared to share
- code copied from the employer's codebase

Where a real detail cannot go in, use a plain stand-in and say so: "a large
insurance customer", "about a third of all requests", "roughly 50 calls a second".
Re-create any code or schema as a small example of the idea, written for this site.
Never paste the original.

**2. Write what you actually did.**

Say plainly which parts were yours and which were the team's. "I built", "we
decided", "another team owned this" are all fine, and an interviewer will ask.
Don't claim a result you can't explain the reason behind. If you don't remember a
number, say what you do remember, and mark anything approximate as approximate.

**3. No blame, no complaints.**

Write about what the system or the constraints made hard, not about people,
managers or other teams. An interviewer reads a complaint as a risk.

## Length and visuals

The same budget as every other track (`TOPIC_STYLE.md` part 7). A topic is for
revision, not for a full design document.

- **About 2,500 words** for the whole topic: a 12 to 13 minute read. That is a target, not a wall. A subject that genuinely needs more room gets it rather than being cut until the required parts go missing; the build only prints a `Note:` past 3,000.
- **100 to 200 words** per section, 300 at the very most. All 12 sections are still written. Each one is just short.
- **At least two diagrams**: one in `architecture` showing how the pieces fitted together, and one more showing what changed &mdash; a before and after in `problem` or `results`, or the flow of the hardest part in `hardParts`.
- Reach for a diagram, a table or a numbered list before a paragraph. A diagram replaces prose; it is not added next to it.
- First thing to cut in this track: background about the company and the team that doesn't change how the work is understood.

## The 12 sections

| # | Key | Title on the page | What to write |
|---|---|---|---|
| 1 | `context` | The context | Where this was: the employer, roughly when, what the product does in two sentences, the size of the team, and your role on it. End with the whole story in one line in a note box &mdash; this is the line you say first in an interview. |
| 2 | `problem` | The problem | What was broken, missing or too slow, and who felt it. Say it in terms a non-engineer would follow, then add the technical shape of it. What would have happened if nobody fixed it. |
| 3 | `constraints` | What I had to work within | The real limits: time, team size, the stack already in place, data that couldn't move, customers who couldn't have downtime. A list. These are what make the decisions interesting. |
| 4 | `approach` | What I decided to do | The approach you took, and the two or three you turned down, in a small table: option, why it was tempting, why it lost. Link to the topic that explains any pattern you used. |
| 5 | `architecture` | How it fitted together | One diagram of the pieces and what moves between them, with a short caption. Name the technologies. Say which parts you wrote and which already existed. |
| 6 | `build` | What I built | The parts worth talking about: the data model, the one algorithm that mattered, the API shape. A small schema or code example, re-created for this site, not copied. |
| 7 | `hardParts` | The hard parts | The two or three problems that took the longest, and how you got past each one. This is the section an interviewer digs into, so be concrete about what you tried first and why it failed. |
| 8 | `results` | What changed | What was different afterwards, with numbers where you have them and are free to share them. Mark estimates as estimates. Include what didn't improve. |
| 9 | `tradeoffs` | Trade-offs and what I'd do differently | What the approach cost: complexity, money, work for other teams. Then what you would change with what you know now, and why. Be honest; a candidate who sees nothing to change sounds unreflective. |
| 10 | `learnings` | What I took away | Three to five things that stuck, each starting with the lesson in bold, then a sentence on where it came from. They should apply beyond this one project. |
| 11 | `interview` | Telling the story in an interview | Three `<h4>` parts: "The two-minute version" (the story as you'd actually say it, in order), "Questions it invites" (what an interviewer will dig into, with a short answer each), "Traps" (the parts that are easy to tell badly, or to overclaim). |
| 12 | `revision` | Quick revision | Only a summary list. See "The revision section" in `TOPIC_STYLE.md`. |

## Must have

- The employer, the rough dates, the team size and your own role, in `context`.
- A one-line version of the story in a note box at the end of `context`.
- An options table in `approach` showing what you turned down.
- Two diagrams: the architecture, and one showing what changed or how the hardest part worked.
- At least one honest cost in `tradeoffs`, and at least one thing you'd do differently.
- A two-minute spoken version in `interview`.
- No private details, as described above.
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

<!-- section: context -->

<!-- section: problem -->

<!-- section: constraints -->

<!-- section: approach -->

<!-- section: architecture -->

<!-- section: build -->

<!-- section: hardParts -->

<!-- section: results -->

<!-- section: tradeoffs -->

<!-- section: learnings -->

<!-- section: interview -->

<!-- section: revision -->
```
