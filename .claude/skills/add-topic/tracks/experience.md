# Playbook: Work Experience & Projects

Use this after `add-topic` has picked the `experience` track.
Guide for the sections: `formats/experience.md`.

## Before anything else: you cannot invent this

Every other track can be written from what you already know. This one can't.
The content is the user's own work, and getting it wrong is worse than useless,
because they will repeat it in an interview.

So:

- **Ask the user for the facts first.** Employer, roughly when, team size, their
  role, what the product does, what the problem was, what they built, what
  changed afterwards, what was hard, what they'd do differently.
- **Write only what they told you**, plus the general engineering knowledge
  needed to explain it clearly. If a piece is missing, ask, or leave a short
  `<p class="note">` saying what to fill in. Never fill a gap with a plausible guess.
- **Check anything you inferred** with them before the topic is finished. List
  every inference in your report.
- If the user gives you very little, write what you can and tell them exactly
  which sections need more from them. A thin honest topic beats an invented one.

## Scope the topic

- **One piece of work, not one job.** If the user describes a whole role, pick the
  single project with a real problem and a real outcome, and offer to write the
  others as their own topics.
- The best candidates are the ones with a decision in them: something was slow,
  broken or impossible, and they chose an approach over other approaches.
- Title by the work, not the company or the job title.
- `category` is the employer's name, so the track groups by employer.
- `order`: keep each employer's topics together and in the order they happened.

## Work in this order

The file order is fixed by the guide. This is the order to think in.

1. **Get the facts.** Ask, and write the answers down before drafting.
2. **`problem` and `results`.** The two ends of the story. Pin these first; the
   rest is the path between them.
3. **`constraints`.** What made the obvious answer impossible. Without these the
   work sounds easy and the decisions sound arbitrary.
4. **`approach`.** The options table. What was turned down matters as much as what
   was chosen.
5. **`architecture`.** Draw it. Then write only what the drawing doesn't say.
6. **`build`** and **`hardParts`.** The parts an interviewer digs into.
7. **`context`.** Now you know what matters, keep only the background that
   explains the rest.
8. **`tradeoffs`**, **`learnings`**, **`interview`**, **`revision`**.

## Keep it private-safe

Go through the finished file once, looking only for this:

- customer names, or details that identify a customer
- internal host names, service names, repository names, URLs, ticket numbers
- keys, passwords, config, customer data
- internal revenue or metrics the user isn't free to share
- code or schema that looks copied from the employer's codebase

The employer's own name is allowed in this track, and nothing else from that list
is. Replace what has to go with a plain stand-in, and say in the text that it is one.

## Traps in this track

- Inventing a number because the section wants one. Ask, or say "roughly".
- Writing the company's story instead of the user's work.
- Claiming a team result as a personal one. Say who did what.
- Burying the decisions. If no option was turned down, there is no story yet.
- A complaint about people or process. Write about the constraint, not the blame.
- Copying code or a schema from the real codebase. Re-create a small example.
- Background that goes on for three paragraphs before anything happens.

## Checks before you finish

- [ ] Every fact in the topic came from the user, or is general knowledge.
- [ ] Every inference you made is listed in your report.
- [ ] The employer, rough dates, team size and the user's own role are in `context`.
- [ ] `context` ends with the one-line version in a note box.
- [ ] `approach` has an options table with what was turned down.
- [ ] Two diagrams: the architecture, and one showing what changed or the hardest part.
- [ ] `tradeoffs` names a real cost and a real thing to do differently.
- [ ] `interview` has a two-minute version that reads like speech, not like a document.
- [ ] Nothing on the private-safe list above is in the file.
- [ ] The build shows the topic at 10 minutes or less, with no length or diagram `Note:`.
- [ ] The cutting pass was actually done, not just planned.
