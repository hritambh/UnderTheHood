# Playbook: Incidents & Production Learnings

Use this after `add-topic` has picked the `incidents` track.
Guide for the sections: `formats/incidents.md`.

## Scope the topic

- One incident per topic.
- Work out which kind it is. This changes where the facts come from.
  - **Public incident:** a known outage. You need the company's own write-up. Find it, or ask the user for the link. Use only what it says. If there is no official write-up, tell the user and stop. Don't write an incident from memory or from news reports.
  - **The user's own incident:** the facts come from the user. Use what they told you. If something needed for a section is missing, ask for it once, in one message, with all your questions together. If they don't know, write "not known" in that section.
- Title: what failed, not who. "A Retry Storm That Took Down Checkout".

## Keep it safe to publish

This site is public. Before writing, and again before finishing:

- Replace every company, customer and person name with a plain stand-in ("a payments service", "a large customer").
- Remove internal host names, service names, URLs, IP addresses, emails, ticket numbers, keys.
- Replace exact business numbers with rough ones ("about a third of requests").
- For the user's own incident, say in `summary` that details were changed.
- No blame. Write what the system allowed, not who did it.

If the user's description contains private details, don't copy them into the file, and tell the user you changed them.

## Work in this order

The file order is fixed by the guide. This is the order to think in.

1. **`timeline`.** Lay out what happened and when, as a table. Everything else is built on this.
2. **`rootCause`.** Start from the visible failure and ask "why did that happen?" until you reach something that can be fixed. At least three levels.
3. **`factors`.** What turned a small problem into a big one.
4. **`detection` and `impact`.**
5. **`fix` and `prevention`.** Keep "stopping the damage" apart from "the real fix".
6. **`context`.** Draw only the parts of the system that appear in the story.
7. **`lessons`.** Lessons that apply beyond this one system.
8. **`checklist`.** Turn the lessons into yes-or-no questions.
9. **`summary`.** Write it last, with the source or the "details were changed" line, and the one lesson in a note box.
10. **`revision`.**

## Keep it short and visual

The reader wants to understand this well enough to explain it and use it. Everything past that is weight.

- Budget: **1,200 to 1,700 words** for the whole topic, 100 to 150 per section, 250 at the very most. Full rule: `TOPIC_STYLE.md` part 7.
- **Draw first.** Sketch the two diagrams before writing prose: the system before in `context`, and the chain of causes in `rootCause`. Then write only what the diagrams don't already say.
- A table beats three paragraphs comparing things. A numbered list beats a paragraph of steps.
- Say the useful thing in a section, then stop. A short section is not a thin one.
- **Cutting pass, every time.** Run `npm run build`, take the section it flags as longest, cut what repeats, turn the longest explanation left into a diagram or a table. Build again. Repeat until the topic is under 9 minutes.
- First thing to cut here: timeline rows where nothing was learnt or decided.

## Traps in this track

- Filling gaps with guesses. Write "not stated" or "not known".
- A root cause that stops at "a bad deploy" or "human error".
- Lessons so general they fit any incident ("test more").
- Private details left in a diagram label or a code sample.
- Blame.

## Checks before you finish

- [ ] `summary` names the source, or says details were changed.
- [ ] Every fact in a public incident is in the company's write-up.
- [ ] Search the file for names, host names, URLs, IP addresses, emails and ticket numbers. None are real.
- [ ] The root cause goes at least three "why"s deep and ends on something fixable.
- [ ] Each lesson would be useful to someone on a different system.
- [ ] Each checklist item can be answered yes or no.
- [ ] Every "Must have" item in the guide is there.
- [ ] The build shows the topic at 9 minutes or less, with no length or diagram `Note:`.
- [ ] Two diagrams at least, where the guide says they go.
- [ ] The cutting pass was actually done, not just planned.
