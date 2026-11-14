# Playbook: Core Concepts

Use this after `add-topic` has picked the `core-concepts` track.
Guide for the sections: `formats/core-concepts.md`.

## Scope the topic

- One idea per topic. If the user asked for something wide ("caching"), keep it to the idea itself and its main types. Leave tool details out.
- If the subject turns out to be one named tool, a named pattern, or an "X vs Y" choice, it is in the wrong track. Go back to routing.
- Title: the common name of the idea, as a developer would say it. "Rate Limiting", not "An Introduction to Rate Limiting".

## Work in this order

The file order is fixed by the guide. This is the order to think in.

1. **`what` and its one-line version.** If you can't say it in one line, you don't understand it well enough yet.
2. **The comparison table for `types`.** Fill the table before writing any prose about the types. If two columns come out the same, they are not two types.
3. **`numbers`.** Pick the assumptions, do the maths, check it twice. The numbers often change what you say in `tradeoffs` and `whenToUse`.
4. **`realWorld`.** Pick a story where the costs show up too, not only the benefits. Every type from the table should have a part in the story.
5. **`software` and `internals`.** One app feature, real code, then the steps and the diagram.
6. **`tradeoffs`, `whenToUse`, `mistakes`.** Draw these from the table and the numbers.
7. **`interview`.**
8. **`why`.** Now that you know the costs, write the problem it solves and end on the real design question.
9. **`revision`.** Last, and only from what is already written.

## Keep it short and visual

The reader wants to understand this well enough to explain it and use it. Everything past that is weight.

- Budget: **1,200 to 1,700 words** for the whole topic, 100 to 150 per section, 250 at the very most. Full rule: `TOPIC_STYLE.md` part 7.
- **Draw first.** Sketch the two diagrams before writing prose: the flow in `internals`, and the types side by side in `realWorld` or `types`. Then write only what the diagrams don't already say.
- A table beats three paragraphs comparing things. A numbered list beats a paragraph of steps.
- Say the useful thing in a section, then stop. A short section is not a thin one.
- **Cutting pass, every time.** Run `npm run build`, take the section it flags as longest, cut what repeats, turn the longest explanation left into a diagram or a table. Build again. Repeat until the topic is under 9 minutes.
- First thing to cut here: the third and fourth type. Two or three explained well beat six listed.

## Traps in this track

- Turning it into a tutorial for one tool or library. The idea should make sense without the tool.
- Types that differ only in name.
- Numbers that look like benchmarks. Always label them as made up.
- A real-world story that only fits the first paragraph and is then dropped.

## Checks before you finish

- [ ] The one-line version in `what` is true and covers every type.
- [ ] Every type in the table is explained in `types`, and every type explained is in the table.
- [ ] Every number in `numbers` adds up when recalculated.
- [ ] The code in `software` matches the feature described around it.
- [ ] `whenToUse` says when you do not need it.
- [ ] Every "Must have" item in the guide is there.
- [ ] The build shows the topic at 9 minutes or less, with no length or diagram `Note:`.
- [ ] Two diagrams at least, where the guide says they go.
- [ ] The cutting pass was actually done, not just planned.
