# Format: Security Engineering

Folder: `content/topics/security/`

Read `TOPIC_STYLE.md` first. This file only adds what is special about this track.

## What belongs here

How systems get attacked, and how to build them so they hold up.
Examples: SQL injection, XSS, CSRF, secrets management, password storage, TLS, rate limiting against abuse, least privilege, threat modelling.

Two kinds of topic, same format:

- **An attack**: "SQL Injection". Explain the attack, then the defence.
- **A defence**: "Secrets Management". In `attack`, explain what an attacker does when this defence is missing.

## What does not belong here

- How login and permissions work in general (sessions, JWT, roles). That is a `core-concepts` topic. A specific attack on them (session fixation, JWT algorithm confusion) belongs here.
- A real breach told as a story. That is `incidents`.

## Rules for this track

- The goal is defence. Explain an attack well enough that a developer can spot and fix the bug in their own code. Stop there.
- Show the vulnerable code and a simple example input that triggers it. Don't write tools, scanners, or steps for attacking a real site.
- Never use a real company, site or person as the target in an example. Use `example.com` and made-up names.
- Every vulnerable example must be followed by the fixed version.
- Don't invent security advice. If you are not sure a defence works, check a trusted source such as OWASP, or leave it out.

## Length and visuals

The same budget as every other track (`TOPIC_STYLE.md` part 7). A topic is for learning, not for reference.

- **1,400 to 1,900 words** for the whole topic: a 7 to 10 minute read. The build prints a `Note:` over 2,200.
- **100 to 150 words** per section, 250 at the very most. All 12 sections are still written. Each one is just short.
- **At least two diagrams**: one in `attack` showing the attacker's path, one more in `defence` showing where the fix sits.
- Reach for a diagram, a table or a numbered list before a paragraph. A diagram replaces prose; it is not added next to it.
- Moderate depth: enough to understand it, explain it to someone, and use it. Then stop.
- First thing to cut in this track: extra payload variations. One attack, one fix, then the layers.

## The 12 sections

| # | Key | Title on the page | What to write |
|---|---|---|---|
| 1 | `what` | What is it? | A plain definition in 2 or 3 short paragraphs. Say what the attacker wants and what mistake lets them get it. End with a one-line version in a note box. |
| 2 | `impact` | What can go wrong | The damage, concretely: data read, data changed, accounts taken over, money lost. Say who is affected. |
| 3 | `realWorld` | Understand it with a real-world example | One everyday story that works the same way (a forged signature, a bank teller following a note). Map each part to the technical idea. |
| 4 | `attack` | How the attack works | Numbered steps from the attacker's first move to the damage, with one diagram. For a defence topic: what an attacker does when the defence is missing. |
| 5 | `vulnerable` | Vulnerable code | A small piece of NestJS / TypeScript code with the bug, and one example input that triggers it. Point at the exact line that is wrong, and say why. |
| 6 | `defence` | How to defend | The same code, fixed. Explain why the fix works. If there is more than one correct fix, show the main one and name the others. |
| 7 | `layers` | More layers of defence | Other protections that limit the damage if the main fix is missed somewhere. One list item each, with what it stops. |
| 8 | `detect` | How to detect it | How to find the bug before attackers do (code review signs, tests, tools), and how to notice an attack in progress (logs, alerts). |
| 9 | `tradeoffs` | Costs and trade-offs | What the defences cost: speed, user friction, developer effort. Each item starts with a bold label. |
| 10 | `mistakes` | Common mistakes | A list of fixes that look right but aren't. Each starts with the mistake in bold, then why it fails and what to do instead. |
| 11 | `interview` | Interview perspective | Three `<h4>` parts: "Common questions" (question in bold, short model answer), "Follow-ups to expect" (list), "Where it fits in a design" (one paragraph). |
| 12 | `revision` | Quick revision | Only a summary list. See "The revision section" in `TOPIC_STYLE.md`. |

## Must have

- Two diagrams: the attacker's path in `attack`, and where the fix sits in `defence`.
- Vulnerable code in `vulnerable` and the fixed version in `defence`, clearly paired.
- At least two extra layers in `layers`.
- A list of wrong fixes in `mistakes`.
- No real targets and no attack tooling, as described above.
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

<!-- section: impact -->

<!-- section: realWorld -->

<!-- section: attack -->

<!-- section: vulnerable -->

<!-- section: defence -->

<!-- section: layers -->

<!-- section: detect -->

<!-- section: tradeoffs -->

<!-- section: mistakes -->

<!-- section: interview -->

<!-- section: revision -->
```
