# Playbook: Engineering Decisions & Trade-offs

Use this after `add-topic` has picked the `decisions` track.
Guide for the sections: `formats/decisions.md`.

## Scope the topic

- One choice per topic, between two options. Three at most.
- Both sides must be reasonable. If one option is simply better, it is not a decision. Tell the user.
- Title: "X vs Y", in the order people usually say it.
- Check which options already have their own topic. Those get three or four sentences here and a `related` link. If an option has no topic of its own, say so in your report as a suggestion.

## Stay fair

- Each option gets its strongest case, written as someone who would choose it would put it.
- No winner without a context. The answer is always "it depends on...", and every "it depends" is followed by the thing it depends on and which way it pushes.
- Give the options the same amount of space.

## Work in this order

The file order is fixed by the guide. This is the order to think in.

1. **`criteria`.** List the questions that decide it: team size, traffic, how often things change, consistency needs. For each, say which answer points to which option. This is the centre of the topic.
2. **`compare`.** Build the table. Rows are the criteria from step 1, columns are the options. If a row reads the same in every column, it is not a criterion. Cut it.
3. **`options`.** Three or four sentences each, the same length.
4. **`numbers`.** One realistic situation worked through for each option. Then change one number and show the answer flip.
5. **`whenEach`.** Clear signals for each option, and "When it doesn't matter much".
6. **`hiddenCosts`.** What each option costs later.
7. **`changing`.** Moving from one to the other, in both directions. Say which direction is easier.
8. **`mistakes`.**
9. **`realWorld`.** An everyday choice with the same shape.
10. **`interview`.**
11. **`decision`.** Write the opening last: what is being chosen, and when it comes up.
12. **`revision`.**

## Keep it short and visual

The reader wants to understand this well enough to explain it and use it. Everything past that is weight.

- Budget: **about 2,500 words** for the whole topic, 100 to 200 per section, 300 at the very most. It is a target, not a wall: a subject that genuinely needs more room gets it. Full rule: `TOPIC_STYLE.md` part 7.
- **Draw first.** Sketch the two diagrams before writing prose: the options side by side in `options`, and the migration path in `changing`. Then write only what the diagrams don't already say.
- A table beats three paragraphs comparing things. A numbered list beats a paragraph of steps.
- Say the useful thing in a section, then stop. A short section is not a thin one.
- **Cutting pass, every time.** Run `npm run build`, take the section it flags as longest, cut what repeats, turn the longest explanation left into a diagram or a table. Build again. Repeat until every sentence left is earning its place.
- First thing to cut here: anything past three options, and any criterion that doesn't change the answer.

## Traps in this track

- Writing an advert for one side.
- "It depends" with nothing after it.
- A comparison table where one column is all good and the other all bad.
- Teaching each option from the ground up instead of linking to its topic.
- Leaving out how hard it is to switch later.

## Checks before you finish

- [ ] The rows in `compare` are the same criteria that `criteria` explains.
- [ ] Each option has about the same amount of text, and its strongest case is made.
- [ ] Every "it depends" says what it depends on and which way it pushes.
- [ ] `numbers` shows the answer changing when a number changes.
- [ ] `changing` covers both directions.
- [ ] `whenEach` has a "When it doesn't matter much" part.
- [ ] Every "Must have" item in the guide is there.
- [ ] The build prints no length or diagram `Note:` for the topic.
- [ ] Two diagrams at least, where the guide says they go.
- [ ] The cutting pass was actually done, not just planned.
