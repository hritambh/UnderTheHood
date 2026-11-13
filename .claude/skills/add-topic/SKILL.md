---
name: add-topic
description: Write and add a new topic to the UnderTheHood site (formerly the System Design Learning Hub). This skill decides by itself which track the topic belongs in (Core Concepts, System Design, Internals & Deep Dives, Incidents & Production Learnings, Engineering Patterns & Practices, Database Engineering, Problem Solving & DSA, Security Engineering, Engineering Decisions & Trade-offs), then applies that track's own playbook and format guide. Use whenever the user asks to add, create, write or draft a topic, a design, an incident write-up, a pattern, a DSA problem or an "X vs Y" comparison for the hub, with or without naming a track, or whenever a new file is about to be created in content/topics/.
---

# Add a topic to the hub

The user only has to say what they want added, for example "add a topic on rate limiting" or "add Kafka". This skill does the rest in two stages:

1. **Route.** Decide which track the topic belongs in. You decide. Don't ask the user to pick.
2. **Write.** Apply that track's own playbook and format guide, so the topic is covered the same way as every other topic in the track.

A topic is one file, `content/topics/<track>/<id>.html`.

Three files define how it must be written:

| File | What it is |
|---|---|
| `TOPIC_STYLE.md` (project root) | Rules shared by every track: picking a track, file layout, building blocks, tone, what is not allowed. |
| `formats/<track>.md` (project root) | The track's **guide**: its 12 sections, what goes in each, its "Must have" list, a skeleton. |
| `tracks/<track>.md` (next to this file) | The track's **playbook**: how to scope the topic, what order to work in, the traps, and the checks before finishing. |

These files are the source of truth. If anything here disagrees with them, follow them.
Never invent your own structure, skip the track's files, or copy the Core Concepts structure into another track.

## Stage 1: Route

1. **Read `TOPIC_STYLE.md` from start to end.** Do this every time, even if you think you remember it. It may have changed.

2. **Decide the track yourself.**
   - Take what the user asked for and go through the nine questions under "Picking the track" in `TOPIC_STYLE.md`, in order. The first "yes" is the track.
   - A subject can often be written from more than one angle. "Kafka" could be how it stores messages (`internals`), message queues in general (`core-concepts`), or "Kafka vs RabbitMQ" (`decisions`). Go by the words the user used. A bare tool name means `internals`. "X vs Y" means `decisions`. "Design X" means `system-design`. A story of a failure means `incidents`.
   - If two tracks still fit, pick the one whose format lets you say the most useful things. Don't stop to ask.
   - Say your decision in one line before you write: the track, the reason, and the runner-up if there was one. Example: "Putting this in Engineering Patterns & Practices, because Circuit Breaker is a named solution you can tell a teammate to use. Runner-up: Core Concepts."
   - If the user named a track, use theirs. If the nine questions point somewhere else, say so in the same one line, then carry on with their choice.
   - Ask the user only when you cannot tell what the topic is about at all.

3. **Open the track's two files and read both from start to end:**
   - the guide: `formats/<track>.md`
   - the playbook: `tracks/<track>.md` in this skill's folder (`.claude/skills/add-topic/tracks/`)

   Check the guide's "What does not belong here" part against the topic. If it rules the topic out, go back to step 2 and pick again.

4. **Look at what already exists.**
   - List every folder in `content/topics/`.
   - Read the header (the first comment block) of every topic in every track: title, category, order, related.
   - Read one full topic from the same track to match its depth and tone. If the track is empty, read `content/topics/core-concepts/realtime-communication.html` for depth and tone only. Take the structure from the guide, not from that topic.

5. **Check where the content belongs, and flag anything in the wrong place.** Search every file under `content/topics/` for the subject (its name, its other names, and its key terms). Then tell the user, before you go on, if any of these is true:
   - **It is already covered.** An existing topic explains this subject, fully or in a long sub-section. Say which topic and which section.
   - **It belongs inside another topic.** The new content is small or is really one part of an existing topic.
   - **Existing content belongs in the new topic.** An older topic holds a long explanation that should live in the new topic, with the older topic keeping a short mention and a `related` link.
   - **An existing topic is in the wrong track.** By the nine questions, it fits another track better.
   - **Existing content is in the wrong topic or section.** You notice it while searching, even if it is not about the new topic.

   For each one, say what it is, where it is now, and where you think it should be. Do not move, cut or merge existing content yourself. If the subject is already fully covered, stop and ask whether to update that topic instead. Otherwise flag and carry on. If nothing is misplaced, say so in one line.

## Stage 2: Write

6. **Follow the track's playbook.** `tracks/<track>.md` says how to scope the topic, what to work out first, and in what order to write. Do what it says. The steps below apply to every track on top of it.

7. **Decide the header.**
   - `id` (the file name): short, small letters, digits and dashes. It must not exist in any track.
   - `title`: follow the title rule in the playbook.
   - `category`: a short label inside the track. Reuse one the track already has when it fits.
   - `order`: where it belongs in reading order inside its track. Pick a number no other topic in that track uses. Don't renumber other topics unless the user asks.
   - `related`: only ids of topics that exist. They can be in other tracks.

8. **Write the file.** Start from the skeleton at the end of `formats/<track>.md`.
   - Write all 12 sections of that track, in the file order the guide gives, each holding what its row in the guide's table asks for. The playbook may tell you to work them out in a different order. The file order never changes.
   - Include every item in the guide's "Must have" list.
   - Use only the building blocks from `TOPIC_STYLE.md`.
   - Follow "Writing style" in `TOPIC_STYLE.md`. The tone is one developer explaining to another at a whiteboard:
     - plain everyday words, no formal or academic ones (use the swap table)
     - short sentences, mostly under 20 words, one idea each
     - talk to the reader with "you" and "we"
     - technical terms are fine, but explain each one in plain words the first time
     - if a sentence sounds like a textbook or a docs page when read out loud, rewrite it
   - Give every diagram marker a unique id, like `ah-<topic id>`.
   - Be accurate. Don't invent benchmarks, limits, version details, incident facts or quotes. Label made-up example numbers as assumptions. If you are not sure a fact is right, check it or leave it out.
   - `revision` is only a summary list of what the topic taught. No questions, key terms or scenario.
   - Don't re-teach what another topic covers. Give it one or two sentences and add that topic to `related`.

9. **Leave existing topics alone.** Don't edit other topic files. If an older topic should link back to the new one, say so in your report and let the user decide.

10. **Build and fix.** Run `npm run build`.
    - Errors stop the build. Fix every one.
    - Lines starting with `Note:` are style problems. Fix those too, until the build prints none for the new topic.

11. **Run the playbook's checks.** Every item under "Checks before you finish" in `tracks/<track>.md` must pass.

12. **Review it.** Go through the `review-topic` skill for the new file.

13. **Look at the result.** Run `npm run preview` and open the new topic page, or read the built file in `site/topics/<id>.html`. Check the diagrams, the tables and the code blocks.

14. **Report to the user**, briefly:
    - the track you chose and why
    - the file you created and where it sits in the track's order
    - anything you flagged in step 5
    - anything you left out, could not verify, or were unsure about
    - any back-links you suggest for older topics

## Do not

- Do not ask the user which track to use. Deciding that is this skill's job.
- Do not push or deploy. A push to `main` goes live automatically, so push only when the user asks to push or deploy. Say that the topic is built locally and not live yet.
- Do not edit anything in `site/` by hand. It is rewritten on every build.
- Do not change `TOPIC_STYLE.md`, `formats/`, the playbooks, `content/hub.json`, `src/` or `scripts/` to make a topic fit. Make the topic fit the format. If the format itself seems wrong for this topic, tell the user.
- Do not add a new track or change a track's sections unless the user asks for exactly that. `CLAUDE.md` says how it is done.
