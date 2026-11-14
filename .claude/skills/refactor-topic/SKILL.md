---
name: refactor-topic
description: Rework an existing topic of the UnderTheHood site so it matches the current learning rules: moderate depth, 1,200 to 1,700 words, at least two diagrams, and a table or list wherever prose was doing that job. Use when a topic reads too long, when the build prints a length or diagram Note:, when the user asks to shorten, trim, tighten, simplify or re-illustrate a topic, or after the format rules change.
---

# Refactor a topic

For topics that already exist. The subject stays, the track stays, the file name stays. What changes is the shape: shorter, more visual, easier to learn from.

Read first:

- `TOPIC_STYLE.md` part 7 (depth, length and visuals) and part 8 (writing style)
- `formats/<track>.md` for the topic's track: the 12 sections, "Length and visuals", "Must have"
- `.claude/skills/add-topic/tracks/<track>.md` for the track's traps and checks

## The target

| | Target | Hard limit |
|---|---|---|
| Whole topic | 1,200 to 1,700 words (6 to 9 min) | 2,000 |
| One section | 100 to 150 words | 250 |
| Diagrams | 2 or 3, where the format file says | at least 2 |

All 12 sections stay. Every "Must have" item stays. The id, the title and the `related` links stay, so saved progress and links keep working.

## Steps

1. **Read the whole file.** Note what is genuinely taught, and what is repeated, padded, or there because it was easy to write.

2. **Decide what the reader needs.** Write down, in one line each: what it is, the problem it solves, how it works, when to use it, what it costs. That is the spine. Everything in the file either supports one of those or goes.

3. **Cut these first**, in this order. They are where the length always is:
   - the same point made twice in two sections
   - lists of options, flags and settings that the topic never comes back to
   - the third and fourth example or type, when the first two already made the point
   - history, version-by-version detail, vendor comparisons
   - long "but what if" chains
   - sentences that restate the heading, and run-ups like "Let's look at how this works"
   - anything another topic owns: one sentence and a `related` link instead

4. **Draw, don't explain.** Get to at least two diagrams, in the places the format file names.
   - Turn the longest surviving explanation into a diagram. Then delete the prose it replaced.
   - Turn every comparison of two or more things into a table.
   - Turn every sequence into a numbered list.
   - Use the diagram shapes in `TOPIC_STYLE.md` part 6, the same shape across the whole topic.
   - Unique marker ids: `ah-<topic id>`, `ah2-<topic id>`.

5. **Keep what earns its place.** Don't cut the worked maths in `numbers`, the code the topic is built on, the one-line version in a note box, the comparison table, or the `revision` list. Shorten them instead.

6. **Rewrite, don't patch.** A section that is 500 words does not get to 150 by deleting adjectives. Write the short version from the spine in step 2, then check the old section for any fact worth keeping.

7. **Keep the facts.** Numbers, code, SQL, version details and claims carry over as they are, or get recalculated. Shortening must not turn a careful statement into a wrong one. Recheck every calculation that survives.

8. **Build and repeat.** `npm run build`. Fix every `Note:` for this topic, then read the reading time. Over 9 minutes means go back to step 3.

9. **Review.** Run the `review-topic` skill on the file.

10. **Report**: the before and after reading time, what you cut, what you drew, and anything you removed that the user may want back.

## Do not

- Do not change the file name, the `title`, or the `order`. Links and saved reading progress depend on the id.
- Do not drop a section to hit the budget. Twelve short sections, not nine long ones.
- Do not cut the costs, the trade-offs or the "when not to use it". Those are the parts that are hard to find elsewhere.
- Do not turn prose into a bullet list of the same length. That is the same text with worse grammar.
- Do not push or deploy. A push to `main` goes live automatically.
