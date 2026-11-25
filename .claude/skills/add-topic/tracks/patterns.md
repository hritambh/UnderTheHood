# Playbook: Engineering Patterns & Practices

Use this after `add-topic` has picked the `patterns` track.
Guide for the sections: `formats/patterns.md`.

## Scope the topic

- One named pattern or practice per topic. It must pass this test: you can say "use X here" and another developer knows what to build or do.
- If it is a choice between two patterns, it belongs in `decisions`. Go back to routing.
- Title: the pattern's usual name. Put other names it goes by in `what`.

## Work in this order

The file order is fixed by the guide. This is the order to think in.

1. **`problem`.** Write the failure first: a concrete situation, what goes wrong, what it costs. The reader should want the pattern before they see it.
2. **`code`, the "before" half.** A few lines that have the problem.
3. **`how`.** The steps, and the diagram. If the pattern has states, name them and show how it moves between them.
4. **`code`, the "after" half.** The same code with the pattern. Small enough to read in one go.
5. **`variants`.** Only versions that are used in practice.
6. **`tradeoffs`.** What it costs: more code, more parts, slower paths, harder debugging.
7. **`whenToUse`.** Both halves: "Use it when" and "Skip it when".
8. **`mistakes` and `relatedPatterns`.**
9. **`realWorld`.** An everyday story that works the same way, including the states if it has them.
10. **`interview`.**
11. **`what`.** Write the opening and the one-line version last.
12. **`revision`.**

## Keep it short and visual

The reader wants to understand this well enough to explain it and use it. Everything past that is weight.

- Budget: **about 2,500 words** for the whole topic, 100 to 200 per section, 300 at the very most. It is a target, not a wall: a subject that genuinely needs more room gets it. Full rule: `TOPIC_STYLE.md` part 7.
- **Draw first.** Sketch the two diagrams before writing prose: how it breaks in `problem`, and how it works in `how`. Then write only what the diagrams don't already say.
- A table beats three paragraphs comparing things. A numbered list beats a paragraph of steps.
- Say the useful thing in a section, then stop. A short section is not a thin one.
- **Cutting pass, every time.** Run `npm run build`, take the section it flags as longest, cut what repeats, turn the longest explanation left into a diagram or a table. Build again. Repeat until every sentence left is earning its place.
- First thing to cut here: variants, down to the two people actually use.

## Traps in this track

- Explaining the cure before the pain.
- Code so large that the pattern is hard to see in it.
- No "Skip it when". Every pattern is over-used somewhere.
- Describing a library's API instead of the pattern.
- Mixing it up with a nearby pattern. `relatedPatterns` should say how they differ.

## Checks before you finish

- [ ] `problem` shows a concrete failure before the pattern is explained.
- [ ] The "after" code fixes the exact failure the "before" code has.
- [ ] The diagram in `how` matches the steps next to it.
- [ ] `whenToUse` has a "Skip it when" part with real cases.
- [ ] `relatedPatterns` says how each one differs from this pattern.
- [ ] Every "Must have" item in the guide is there.
- [ ] The build prints no length or diagram `Note:` for the topic.
- [ ] Two diagrams at least, where the guide says they go.
- [ ] The cutting pass was actually done, not just planned.
