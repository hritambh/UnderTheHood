# Playbook: Internals & Deep Dives

Use this after `add-topic` has picked the `internals` track.
Guide for the sections: `formats/internals.md`.

## Scope the topic

- One tool, and one mechanism inside it. If the user only named the tool ("add Kafka"), pick the mechanism people most need to understand, and say which one you picked in your report. "How Kafka Stores Messages" is a topic. "How Kafka Works" is not.
- Fix the version before writing anything, like "PostgreSQL 16". Use a current stable version.
- Title: say the mechanism. "How Kafka Stores Messages", "PostgreSQL MVCC", "The Node.js Event Loop".

## Get the facts right first

Internals are easy to get subtly wrong, and they change between versions.

- For anything you are not fully sure of (a default value, a limit, a file name, the order of steps), check the tool's own documentation before writing it.
- If you can't check a fact, leave it out. Don't write it with a hedge.
- Keep a short list of anything you could not verify. Put it in your report to the user.

## Work in this order

The file order is fixed by the guide. This is the order to think in.

1. **Pick the one operation to follow.** One write, one query, one message. Everything else hangs off it.
2. **`walkthrough`.** Follow that operation through every part, as numbered steps. This is the main section. Write it first.
3. **`bigPicture`.** Draw the diagram from the parts that showed up in the walkthrough. If a part is in the diagram but not in the walkthrough, cut it or use it.
4. **`storage`.** The data structures and files the walkthrough touched.
5. **`failure`.** Crash the same operation halfway through. What is lost, what is not, how it recovers.
6. **`guarantees` and `performance`.** Derive both from the steps. Every claim should point back to a step.
7. **`settings`.** Only settings that change something already explained.
8. **`tryIt`.** Commands the reader can run to watch it happen, and what to look for.
9. **`myths`.**
10. **`what` and `why`.** Write the opening last, with the version named.
11. **`revision`.**

## Keep it short and visual

The reader wants to understand this well enough to explain it and use it. Everything past that is weight.

- Budget: **about 2,500 words** for the whole topic, 100 to 200 per section, 300 at the very most. It is a target, not a wall: a subject that genuinely needs more room gets it. Full rule: `TOPIC_STYLE.md` part 7.
- **Draw first.** Sketch the two diagrams before writing prose: the parts in `bigPicture`, and the operation's path in `walkthrough`. Then write only what the diagrams don't already say.
- A table beats three paragraphs comparing things. A numbered list beats a paragraph of steps.
- Say the useful thing in a section, then stop. A short section is not a thin one.
- **Cutting pass, every time.** Run `npm run build`, take the section it flags as longest, cut what repeats, turn the longest explanation left into a diagram or a table. Build again. Repeat until every sentence left is earning its place.
- First thing to cut here: every part of the tool this topic is not about. One operation, followed properly.

## Traps in this track

- Covering the whole tool instead of one mechanism.
- A list of components with nothing moving through them.
- Stating defaults and limits from memory.
- Settings listed because they exist, not because they connect to the explanation.
- Benchmark claims. Use labelled example numbers.

## Checks before you finish

- [ ] The version is named in `what`.
- [ ] One operation is followed all the way through in `walkthrough`, and the same one is crashed in `failure`.
- [ ] Every part in the diagram appears in the walkthrough.
- [ ] Every claim in `guarantees` and `performance` can be traced to a step.
- [ ] The commands in `tryIt` work on a default install of the named version.
- [ ] Anything you could not verify is left out and listed in your report.
- [ ] Every "Must have" item in the guide is there.
- [ ] The build prints no length or diagram `Note:` for the topic.
- [ ] Two diagrams at least, where the guide says they go.
- [ ] The cutting pass was actually done, not just planned.
