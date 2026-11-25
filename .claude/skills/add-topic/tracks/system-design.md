# Playbook: System Design

Use this after `add-topic` has picked the `system-design` track.
Guide for the sections: `formats/system-design.md`.

## Scope the topic

- One product per topic. Pick three to five things it must do. Everything else goes under "Not doing".
- Title: the thing being built. "URL Shortener", "Chat App". No "Design a" at the front.
- Find which ideas the design uses that already have their own topic (sharding, pagination, auth). Those get one or two sentences and a `related` link. They are not re-taught.

## Work in this order

The file order is fixed by the guide. This is the order to think in.

1. **`requirements`.** "Must do", "Must be" with a target for each, and "Not doing". Nothing else can be decided until this is fixed.
2. **`estimates`.** State the assumptions, then work out requests per second, storage per year and the read-to-write ratio. Write the final numbers down in a table. You will reuse them.
3. **`api`.** One endpoint per "Must do" item. If a feature has no endpoint, something is missing.
4. **`data`.** Tables, main columns, indexes. Choose the database type from the numbers and the "Must be" list, and say why.
5. **`highLevel`.** Draw the diagram, then follow the two most important requests through it step by step. Every box must appear in a step. Every step must touch a box.
6. **`deepDives`.** Pick two to four questions that are hard *in this design*, because of these requirements and these numbers. For each: the options, the pick, the reason.
7. **`scaling`.** Take the numbers from step 2, multiply by 10 and by 100, and find what breaks first.
8. **`failures`.** Go through the boxes in the diagram one by one. What does the user see when each one dies?
9. **`tradeoffs`.** List every choice made above and what it gave up.
10. **`interview`.** The order to present it in, with minutes.
11. **`problem`.** Write the opening now that the scope is settled.
12. **`revision`.** Last.

## Keep it short and visual

The reader wants to understand this well enough to explain it and use it. Everything past that is weight.

- Budget: **about 2,500 words** for the whole topic, 100 to 200 per section, 300 at the very most (`deepDives` is allowed 500). It is a target, not a wall: six tables and a schema are mandatory here, so this track usually lands at the top of the range. Full rule: `TOPIC_STYLE.md` part 7.
- **Draw first.** Sketch the two diagrams before writing prose: the architecture in `highLevel`, and one more in `deepDives` or `data`. Then write only what the diagrams don't already say.
- A table beats three paragraphs comparing things. A numbered list beats a paragraph of steps.
- Say the useful thing in a section, then stop. A short section is not a thin one.
- **Cutting pass, every time.** Run `npm run build`, take the section it flags as longest, cut what repeats, turn the longest explanation left into a diagram or a table. Build again. Repeat until every sentence left is earning its place.
- First thing to cut here: deep dives, down to two. And the API, down to the four or five endpoints that matter.

## Traps in this track

- A diagram of generic boxes with no request followed through it.
- Estimates that are worked out and then never used again.
- Adding every component you know. Each box must be there because of a requirement or a number.
- Re-teaching a concept that has its own topic.
- No "Not doing" list, so the design has no edges.

## Checks before you finish

- [ ] Every "Must do" item has an endpoint in `api` and is handled in `highLevel`.
- [ ] Every number in `scaling` comes from `estimates`, and the maths is right.
- [ ] Every box in the diagram is named in the steps under it, and appears in `failures`.
- [ ] Each deep dive gives options, a pick and a reason.
- [ ] The database choice in `data` is stated with its reason.
- [ ] Concepts with their own topic are linked in `related`, not explained again.
- [ ] Every "Must have" item in the guide is there.
- [ ] The build prints no length or diagram `Note:` for the topic.
- [ ] Two diagrams at least, where the guide says they go.
- [ ] The cutting pass was actually done, not just planned.
