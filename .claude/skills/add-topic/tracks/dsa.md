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
