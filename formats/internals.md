# Format: Internals & Deep Dives

Folder: `content/topics/internals/`

Read `TOPIC_STYLE.md` first. This file only adds what is special about this track.

## What belongs here

How one named tool or technology works on the inside.
Examples: "How Kafka stores messages", "PostgreSQL MVCC", "The Node.js event loop", "How Redis saves data to disk", "How HTTPS sets up a connection".

Each topic is about one thing inside one tool. "How Kafka works" is too wide. "How Kafka stores messages" is right.

## What does not belong here

- A general idea that is not tied to one tool. That is `core-concepts`.
- How to use a database feature day to day (writing indexes, picking isolation levels). That is `databases`. How the database engine does it inside goes here.
- An outage caused by the tool. That is `incidents`.

## Accuracy rule for this track

Internals change between versions. So:

- Name the version you are describing in `what`, like "PostgreSQL 16".
- Don't state a default value, a limit or a file layout unless you are sure of it. If unsure, check the tool's own documentation, or leave it out.
- Say "by default" when a setting can change the behaviour.

## The 12 sections

| # | Key | Title on the page | What to write |
|---|---|---|---|
| 1 | `what` | What is it? | The tool in one paragraph, then the one part of it this topic looks inside. Name the version. End with a one-line version in a note box. |
| 2 | `why` | Why look inside? | What you can do better once you know this: which bugs make sense, which settings you can choose well, which interview questions it answers. |
| 3 | `bigPicture` | The big picture | The main parts and how they connect, with one diagram. Name each part and say what it does in one sentence. No details yet. |
| 4 | `walkthrough` | Follow one request through it | Pick one real operation (one write, one query, one message). Numbered steps of everything that happens to it, part by part. This is the main section. |
| 5 | `storage` | What it keeps in memory and on disk | The data structures and files it uses, and what each is for. A table works well: name, where it lives, what it holds. |
| 6 | `guarantees` | What it promises, and what it doesn’t | Two lists: what you can rely on, and what people wrongly think they can rely on. Be exact about the conditions. |
| 7 | `performance` | What is fast, what is slow, and why | Which operations are cheap and which are costly, explained from the steps in `walkthrough`. Use labelled example numbers, never benchmark claims. |
| 8 | `failure` | What happens when it crashes | Numbered steps of a crash in the middle of the operation from `walkthrough`, then how it recovers. Say what can be lost, and what can't. |
| 9 | `settings` | Settings that matter | Three to six settings in a table: name, what it changes, when you would touch it. Only ones that link to what was explained above. |
| 10 | `tryIt` | See it yourself | Commands or queries the reader can run to watch this happen, with what to look for in the output. |
| 11 | `myths` | Common misunderstandings | A list. Each item starts with the wrong belief in bold, then what is really true. |
| 12 | `revision` | Quick revision | Only a summary list. See "The revision section" in `TOPIC_STYLE.md`. |

## Must have

- The version named in `what`.
- One diagram in `bigPicture`.
- One operation followed all the way through in `walkthrough`, and the same operation used again in `failure`.
- Real commands in `tryIt` that work on a default install.

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

<!-- section: bigPicture -->

<!-- section: walkthrough -->

<!-- section: storage -->

<!-- section: guarantees -->

<!-- section: performance -->

<!-- section: failure -->

<!-- section: settings -->

<!-- section: tryIt -->

<!-- section: myths -->

<!-- section: revision -->
```
