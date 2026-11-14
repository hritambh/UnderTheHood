# Playbook: Problem Solving & DSA

Use this after `add-topic` has picked the `dsa` track.
Guide for the sections: `formats/dsa.md`.

## Scope the topic

- Work out which kind it is:
  - **A technique** ("Sliding Window"): pick one problem that shows it clearly, and teach the technique through it.
  - **A problem**: solve that problem fully.
- Write the problem in your own words, with the limits on the input. Don't copy problem text from a website or a book. You can name the well-known problem it is.
- Language: TypeScript, unless the user asked for another.
- Title: the technique's name, or a short name for the problem.

## Work in this order

The file order is fixed by the guide. This is the order to think in.

1. **`problem`.** What goes in, what comes out, the limits.
2. **`examples`.** Three examples in a table. Make the third one tricky.
3. **`brute`.** Write the obvious solution as complete code. Work out its cost, and show with the limits why it is too slow.
4. **`idea`.** The one observation that makes it faster, in words and one diagram. No code yet.
5. **`code`.** The full better solution, as one complete function with types.
6. **Run both solutions.** Put them in a file in your scratch folder, outside the project, and run them with `node` on all three examples and on the edge cases. Both must give the same answers. Fix the code until they do. Don't skip this by tracing in your head.
7. **`walkthrough`.** Build the step table from a real run of one example. Use the same variable names as the code.
8. **`complexity`.** Time and space for both solutions, each with a one-sentence reason.
9. **`edgeCases`.** The table, using the cases you ran in step 6.
10. **`think`.** Now that you know the answer, write what should have been noticed up front.
11. **`pattern`.** The general technique, the signals that point to it, and three other well-known problems that use it, named only.
12. **`interview`**, then **`revision`**.

## Keep it short and visual

The reader wants to understand this well enough to explain it and use it. Everything past that is weight.

- Budget: **1,400 to 1,900 words** for the whole topic, 100 to 150 per section, 250 at the very most. Full rule: `TOPIC_STYLE.md` part 7.
- **Draw first.** Sketch the two diagrams before writing prose: the key idea in `idea`, and the array or pointers at a few steps in `walkthrough`. Then write only what the diagrams don't already say.
- A table beats three paragraphs comparing things. A numbered list beats a paragraph of steps.
- Say the useful thing in a section, then stop. A short section is not a thin one.
- **Cutting pass, every time.** Run `npm run build`, take the section it flags as longest, cut what repeats, turn the longest explanation left into a diagram or a table. Build again. Repeat until the topic is under 10 minutes.
- First thing to cut here: the second brute-force variant. One slow solution, one fast one.

## Traps in this track

- Code that was never run. Off-by-one mistakes hide here.
- A walkthrough table that does not match the code.
- Skipping the simple solution, so the reader never sees why the better one is needed.
- Code fragments instead of a complete function.
- A cost stated with no reason.
- Problem text copied from somewhere.

## Checks before you finish

- [ ] Both solutions were run, and they agree on the three examples and every edge case in the table.
- [ ] The code in the file is exactly the code that was run.
- [ ] The walkthrough table matches a real run, with the same variable names as the code.
- [ ] Time and space cost are given for both solutions, with reasons.
- [ ] The input limits are in `problem`, and `brute` uses them to show it is too slow.
- [ ] The problem statement is in your own words.
- [ ] Every "Must have" item in the guide is there.
- [ ] The build shows the topic at 10 minutes or less, with no length or diagram `Note:`.
- [ ] Two diagrams at least, where the guide says they go.
- [ ] The cutting pass was actually done, not just planned.
