# Playbook: Database Engineering

Use this after `add-topic` has picked the `databases` track.
Guide for the sections: `formats/databases.md`.

## Scope the topic

- One database subject per topic: indexes, isolation levels, connection pooling, and so on.
- Pick the database first. Use PostgreSQL unless the topic is about another one. Say which in `what`.
- If the topic is how the engine does it at the level of files and data structures, it belongs in `internals`. Go back to routing.
- Title: the subject's usual name. "Indexes", "Isolation Levels".

## Get the facts right first

Behaviour differs between databases, and between versions.

- Every statement about locks, isolation, defaults or limits must be true for the database you named. If you are not sure, check its documentation.
- When PostgreSQL and MySQL differ on something important for this topic, say so in one sentence.

## Work in this order

The file order is fixed by the guide. This is the order to think in.

1. **`example`.** Write the SQL first: `CREATE TABLE`, a few `INSERT`s, then the queries that show the idea, with their results. Run it in your head from an empty database, top to bottom. It must work.
2. **`internals`.** What the database does for those exact queries, as steps and a diagram.
3. **`commands`.** The SQL and commands used in real work: creating it, checking it, finding problems. Show `EXPLAIN` output where it applies, and say how to read it.
4. **The comparison table for `types`,** then the prose about each type.
5. **`numbers`.** Rows, pages, time, size. Assumptions labelled.
6. **`tradeoffs`, `whenToUse`, `mistakes`.**
7. **`interview`.**
8. **`what` and `why`.** Write the opening last, with the database named.
9. **`revision`.**

## Keep it short and visual

The reader wants to understand this well enough to explain it and use it. Everything past that is weight.

- Budget: **1,200 to 1,700 words** for the whole topic, 100 to 150 per section, 250 at the very most. Full rule: `TOPIC_STYLE.md` part 7.
- **Draw first.** Sketch the two diagrams before writing prose: what the database does in `internals`, and the rows, pages or index shape in `example` or `numbers`. Then write only what the diagrams don't already say.
- A table beats three paragraphs comparing things. A numbered list beats a paragraph of steps.
- Say the useful thing in a section, then stop. A short section is not a thin one.
- **Cutting pass, every time.** Run `npm run build`, take the section it flags as longest, cut what repeats, turn the longest explanation left into a diagram or a table. Build again. Repeat until the topic is under 9 minutes.
- First thing to cut here: extra `EXPLAIN` output, and settings that don't change the behaviour you explained.

## Traps in this track

- SQL that would not run: a table that was never created, a column that does not exist.
- Results shown that the query would not return.
- Saying "the database does X" when only one database does X.
- `EXPLAIN` output that is made up and does not match the query above it.
- Advice with no cost. Every index, lock and setting costs something.

## Checks before you finish

- [ ] The database is named in `what`.
- [ ] All the SQL in `example` runs in order on an empty database, and the results shown are what it returns.
- [ ] Any `EXPLAIN` output matches its query, and the text says how to read it.
- [ ] Every behaviour claim is true for the named database.
- [ ] Every number in `numbers` adds up when recalculated.
- [ ] `whenToUse` says when you do not need it.
- [ ] Every "Must have" item in the guide is there.
- [ ] The build shows the topic at 9 minutes or less, with no length or diagram `Note:`.
- [ ] Two diagrams at least, where the guide says they go.
- [ ] The cutting pass was actually done, not just planned.
