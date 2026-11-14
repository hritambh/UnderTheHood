# Format: Problem Solving & DSA

Folder: `content/topics/dsa/`

Read `TOPIC_STYLE.md` first. This file only adds what is special about this track.

## What belongs here

Data structures, algorithms, and interview problems.
Two kinds of topic, same format:

- **A technique**: "Sliding Window", "Two Pointers", "Binary Search on the Answer". Teach it through one problem that shows it well.
- **A problem**: "Longest Substring Without Repeating Characters". Solve it fully.

## What does not belong here

- How a data structure is used inside a real tool (B-trees in PostgreSQL). That is `internals` or `databases`.
- System design questions. That is `system-design`.

## Rules for this track

- Write the problem in your own words. Don't copy problem text from a website or a book. You can say which well-known problem it is.
- Code is in TypeScript unless the user asks for another language. It must be complete and runnable: a function with types, not fragments.
- Every solution must be correct. Trace it by hand on the examples before you finish, including the edge cases.
- Always show the simple way first. The reader should see why the better way is needed.
- State time and space cost for every solution shown, with the reason.

## Length and visuals

The same budget as every other track (`TOPIC_STYLE.md` part 7). A topic is for learning, not for reference.

- **1,400 to 1,900 words** for the whole topic: a 7 to 10 minute read. The build prints a `Note:` over 2,200.
- **100 to 150 words** per section, 250 at the very most. All 12 sections are still written. Each one is just short.
- **At least two diagrams**: one in `idea`, one more in `walkthrough` showing the array or pointers at two or three steps.
- Reach for a diagram, a table or a numbered list before a paragraph. A diagram replaces prose; it is not added next to it.
- Moderate depth: enough to understand it, explain it to someone, and use it. Then stop.
- First thing to cut in this track: the second brute-force variant. One slow solution, one fast one, and move on.

## The 12 sections

| # | Key | Title on the page | What to write |
|---|---|---|---|
| 1 | `problem` | The problem | The problem in plain words: what goes in, what comes out, and the limits on the input. For a technique topic, first say what the technique is in two sentences, then give the problem. End with a one-line version in a note box. |
| 2 | `examples` | Examples | Three examples in a table: input, output, why. Make the third one tricky. |
| 3 | `think` | How to think about it | What to notice before writing code: questions to ask the interviewer, what the limits tell you, and what the examples have in common. |
| 4 | `brute` | The simple way first | The most obvious solution, in code. Say its time and space cost, and show with numbers why it is too slow for the limits. |
| 5 | `idea` | The key idea | The one observation that makes it faster. Explain it in words and with one diagram, before any code. |
| 6 | `walkthrough` | Walk through an example | Run the better solution by hand on one example. Use a table: one row per step, with the variables and what was decided. |
| 7 | `code` | Code | The full solution, with a short comment on each important line. Use the same variable names as the walkthrough. |
| 8 | `complexity` | Time and space | Time and space cost, each with a one-sentence reason. Compare with the simple way in a small table. |
| 9 | `edgeCases` | Edge cases | A table: the input, what should happen, why it is easy to get wrong. Cover empty input, one element, all the same, and the largest allowed input. |
| 10 | `pattern` | The pattern, and how to spot it | The general technique behind this solution. Signals in a problem statement that point to it. Three other well-known problems that use it, named only. |
| 11 | `interview` | Interview perspective | Three `<h4>` parts: "How to talk through it" (the order to say things in), "Follow-ups to expect" (changes to the problem, with a short answer each), "Mistakes people make" (list). |
| 12 | `revision` | Quick revision | Only a summary list. See "The revision section" in `TOPIC_STYLE.md`. |

## Must have

- The input limits in `problem`.
- An examples table with three rows in `examples`.
- The simple solution with its cost in `brute`.
- Two diagrams: one in `idea`, and one more in `walkthrough` showing the state at a few steps.
- A step table in `walkthrough` that matches the code in `code`.
- Time and space cost for both solutions in `complexity`.
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

<!-- section: problem -->

<!-- section: examples -->

<!-- section: think -->

<!-- section: brute -->

<!-- section: idea -->

<!-- section: walkthrough -->

<!-- section: code -->

<!-- section: complexity -->

<!-- section: edgeCases -->

<!-- section: pattern -->

<!-- section: interview -->

<!-- section: revision -->
```
