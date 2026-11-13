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
