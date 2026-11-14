---
name: review-topic
description: Check a topic file of the UnderTheHood site (formerly the System Design Learning Hub) against the style guide and its track's format. Use after any file in content/topics/ is added, edited or moved between tracks (by the user or by Claude), before a deploy that includes new or changed topics, and when the user asks to review, check, validate or proofread a topic.
---

# Review a topic

Checks one or more files under `content/topics/` against:

- `TOPIC_STYLE.md`: the rules shared by every track.
- `formats/<track>.md`: the 12 sections and the "Must have" list of the topic's track. The track is the folder the file sits in.
- `.claude/skills/add-topic/tracks/<track>.md`: the track's playbook. Its "Checks before you finish" list is part of this review.

These three files are the source of truth.

The first thing to check is always the same: **is this easy to learn from?** Moderate depth, short, and visual. A topic over 9 minutes, or with fewer than two diagrams, has a real problem even if everything in it is correct.

## Steps

1. **Read `TOPIC_STYLE.md`** from start to end. Then, for each track you are reviewing, read **`formats/<track>.md`** and **`.claude/skills/add-topic/tracks/<track>.md`**.

2. **Work out which topics to review.** Use the ones the user named. If they named none, review the files that were added or changed in this session. If that is unclear, ask.

3. **Run `npm run build`.**
   - Errors: the file breaks the format. These must be fixed.
   - Lines starting with `Note:`: problems the build can detect. Length and visuals (topic over 2,200 words, sections over 250, fewer than two diagrams, four paragraphs in a row with nothing between them), and style (missing sections, wrong heading level, unwrapped table, hard-coded colour, repeated id, repeated order number, formal words, a revision that is more than a list).

4. **Read the whole topic file** and check what the build cannot:

   **Track and structure**
   - The topic is in the right track, by the nine questions under "Picking the track" in `TOPIC_STYLE.md`.
   - All 12 sections of that track are there, in order.
   - Each section holds what its row in the format table asks for. It is not a section from another track's format under a different name.
   - Every item in the format file's "Must have" list is there.
   - Every item under "Checks before you finish" in the track's playbook passes. Do each check for real. For `dsa`, that means running the code.
   - The extra rules in the format file are followed (for example: version named in `internals`, source named and no private details in `incidents`, runnable SQL in `databases`, hand-traced code in `dsa`, defence only in `security`, fair to both sides in `decisions`).
   - The first section ends with a one-line version in a note box.
   - `revision` is only a summary list of 6 to 10 points. It has no questions, key terms or scenario, and nothing that the topic did not teach earlier.

   **Depth, length and visuals** (`TOPIC_STYLE.md` part 7)
   - The whole topic is 1,400 to 1,900 words, a 7 to 10 minute read. The build prints the notes; the page header shows the time.
   - No section runs past about 250 words, and no paragraph past 5 sentences.
   - At least two diagrams, in the places the format file names.
   - The depth is moderate: what it is, why, how it works at whiteboard level, when to use it, what it costs, the usual mistakes. Flag every list of options and flags, long edge-case chain, history lesson, and second example that makes the same point as the first.
   - Nothing is explained twice. Flag a paragraph that says what a diagram, table or list next to it already says.
   - Comparisons are tables, steps are numbered lists, flows are diagrams. Flag prose doing any of those jobs.
   - For each thing you flag here, say what to cut or what to draw instead. Don't only say "too long".

   **Building blocks**
   - Code blocks escape `<`, `>` and `&`, and start with a comment that names the file or the query.
   - Diagrams read clearly: labels fit inside their boxes, arrows start and end at box edges, nothing overlaps.

   **Writing**
   - The tone is one developer explaining to another. Read a few paragraphs out loud in your head. Flag anything that sounds like a textbook, a docs page or a blog post.
   - Plain everyday words. Flag every word from the swap table in `TOPIC_STYLE.md`, and any other word a developer would not say out loud to a teammate.
   - Short sentences. Flag sentences over about 25 words, or with more than one idea.
   - It talks to the reader with "you" and "we", in active voice.
   - Every technical term is explained in plain words where it first appears.
   - No filler and no praise of the technology.
   - Costs are stated next to benefits.

   **Placement**
   - Search the other files under `content/topics/`, in every track, for the same subject and its key terms.
   - Flag it if this topic repeats something another topic already explains, if it is really a part of another topic, or if another topic holds a long explanation that belongs here.
   - Flag any topic that sits in the wrong track, and any content that sits in the wrong topic or section, even in topics you were not asked to review.
   - For each one, say what it is, where it is now, and where it should be. Do not move it yourself.

   **Accuracy and safety**
   - Redo every calculation. The numbers must add up.
   - Trace the code against its example. Check that it would plausibly run and matches the text around it.
   - Flag any claim that looks wrong, outdated, or stated with more certainty than it deserves.
   - Made-up example numbers are labelled as assumptions.
   - No private details: no real employer or customer names, internal host names, keys, or real customer data. The site is public.
   - Nothing copied from a book, a course or another website.

5. **Report findings as a short list**, most serious first. For each one give the section, what is wrong, and the fix. If nothing is wrong, say that in one line.

6. **Fixing.**
   - If you wrote the topic in this session, fix everything you found, then build again. That includes cutting it to length and drawing the missing diagrams. Cutting is not optional because the writing is good.
   - If the user wrote it, fix only mechanical problems (escaping, a missing wrapper, a repeated id). List wording, structure and accuracy problems and let the user choose before you rewrite their text.
   - Private details are the exception: point them out at once, whoever wrote the topic.

## Do not

- Do not push or deploy as part of a review. A push to `main` goes live automatically.
- Do not rewrite sections that have no problem.
- Do not pass a topic that is over budget because the subject is big. Say what to cut, or say it should be split into two topics.
- Do not move a topic to another track yourself. Flag it.
