---
name: add-topic
description: Write and add a new topic to any track of the System Design Learning Hub site (Core Concepts, System Design, Internals & Deep Dives, Incidents & Production Learnings, Engineering Patterns & Practices, Database Engineering, Problem Solving & DSA, Security Engineering, Engineering Decisions & Trade-offs). Use whenever the user asks to add, create, write or draft a topic, a design, an incident write-up, a pattern, a DSA problem or an "X vs Y" comparison for the hub, or whenever a new file is about to be created in content/topics/.
---

# Add a topic to the hub

A topic is one file, `content/topics/<track>/<id>.html`.

Two files define how it must be written:

- `TOPIC_STYLE.md` at the project root: the rules shared by every track (tracks, file layout, building blocks, tone, what is not allowed).
- `formats/<track>.md`: the 12 sections of that track, what goes in each, and its "Must have" list.

These files are the source of truth. If anything here disagrees with them, follow them.

The point of this skill is that every topic in a track is covered the same way. Never invent your own structure, skip the format file, or copy the Core Concepts structure into another track.

## Steps

1. **Read `TOPIC_STYLE.md` from start to end.** Do this every time, even if you think you remember it. It may have changed.

2. **Pick the track.**
   - Use the nine questions under "Picking the track" in `TOPIC_STYLE.md`.
   - If the user named a track, use it. But if the questions point to a different track, tell the user before you write: which track you think fits, and why. Then follow their answer.
   - If the user did not name a track, pick one and say which in one line.

3. **Read `formats/<track>.md` from start to end.** Check its "What does not belong here" part against the topic.

4. **Look at what already exists.**
   - List every folder in `content/topics/`.
   - Read the header (the first comment block) of every topic in every track: title, category, order, related.
   - Read one full topic from the same track to match its depth and tone. If the track is empty, read `content/topics/core-concepts/realtime-communication.html` for depth and tone only. Take the structure from the format file, not from that topic.

5. **Check where the content belongs, and flag anything in the wrong place.** Do this before writing, for a new topic and for any content added to an existing topic. Search every file under `content/topics/` for the subject (its name, its other names, and its key terms). Then tell the user, before you go on, if any of these is true:
   - **It is already covered.** An existing topic explains this subject, fully or in a long sub-section. Say which topic and which section.
   - **It belongs inside another topic.** The new content is small or is really one part of an existing topic, so it should be a section or sub-heading there instead of a topic of its own.
   - **Existing content belongs in the new topic.** An older topic holds a long explanation that should live in the new topic, with the older topic keeping a short mention and a `related` link.
   - **An existing topic is in the wrong track.** By the nine questions, it fits another track better.
   - **Existing content is in the wrong topic or section.** While searching, you notice something that sits in the wrong place, even if it is not about the new topic.

   For each one, say what it is, where it is now, and where you think it should be. Do not move, cut or merge existing content yourself. Flag it and let the user decide. If nothing is misplaced, say so in one line and carry on.

6. **Decide the header before writing.**
   - `id` (the file name): short, small letters, digits and dashes. It must not exist in any track.
   - `category`: a short label inside the track. Reuse one the track already has when it fits.
   - `order`: where it belongs in reading order inside its track. Pick a number no other topic in that track uses. Don't renumber other topics unless the user asks.
   - `related`: only ids of topics that exist. They can be in other tracks.

7. **Write the file.** Start from the skeleton at the end of `formats/<track>.md`.
   - Write all 12 sections of that track, in order, each holding what its row in the format table asks for.
   - Include every item in the format file's "Must have" list.
   - Follow any extra rules in the format file (for example: name the version in `internals`, no private details in `incidents`, trace the code by hand in `dsa`, defence only in `security`, be fair to both sides in `decisions`).
   - Use only the building blocks from `TOPIC_STYLE.md`.
   - Follow "Writing style" in `TOPIC_STYLE.md`. The tone is one developer explaining to another at a whiteboard:
     - plain everyday words, no formal or academic ones (use the swap table)
     - short sentences, mostly under 20 words, one idea each
     - talk to the reader with "you" and "we"
     - technical terms are fine, but explain each one in plain words the first time
     - if a sentence sounds like a textbook or a docs page when read out loud, rewrite it
   - Give every diagram marker a unique id, like `ah-<topic id>`.
   - Be accurate. Don't invent benchmarks, limits, version details, incident facts or quotes. Label made-up example numbers as assumptions. If you are not sure a fact is right, check it or leave it out.
   - Recalculate every number. Trace every piece of code against its example.
   - `revision` is only a summary list of what the topic taught. No questions, key terms or scenario.
   - Don't re-teach what another topic covers. Give it one or two sentences and add that topic to `related`.

8. **Leave existing topics alone.** Don't edit other topic files. If an older topic should link back to the new one, say so in your report and let the user decide.

9. **Build and fix.** Run `npm run build`.
   - Errors stop the build. Fix every one.
   - Lines starting with `Note:` are style problems. Fix those too, until the build prints none for the new topic.

10. **Review it.** Go through the `review-topic` skill for the new file.

11. **Look at the result.** Run `npm run preview` and open the new topic page, or read the built file in `site/topics/<id>.html`. Check the diagrams, the tables and the code blocks.

12. **Report to the user**, briefly:
    - the track you put it in, and why if you chose it
    - the file you created and where it sits in the track's order
    - anything you flagged in step 5
    - anything you left out or were unsure about
    - any back-links you suggest for older topics

## Do not

- Do not deploy. The live site only changes when the user asks for a deploy (`npx vercel deploy --prod`). Say that the topic is built locally and not live yet.
- Do not edit anything in `site/` by hand. It is rewritten on every build.
- Do not change `TOPIC_STYLE.md`, `formats/`, `content/hub.json`, `src/` or `scripts/` to make a topic fit. Make the topic fit the format. If the format itself seems wrong for this topic, tell the user.
- Do not add a new track or change a track's sections unless the user asks for exactly that. `CLAUDE.md` says how it is done.
