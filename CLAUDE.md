# UnderTheHood (static website)

The site was called "My System Design Learning Hub" until 2026-11-13. The project folder, the Vercel project and the live URL still use the old name `system-design-hub`.

A plain static website of engineering topics, grouped into tracks. It started as a copy of a Claude artifact, but the artifact is no longer used. The files in `content/` are the only source.

## How it fits together

- **Tracks** — the nine groups on the home page: Core Concepts, System Design, Internals & Deep Dives, Incidents & Production Learnings, Engineering Patterns & Practices, Database Engineering, Problem Solving & DSA, Security Engineering, Engineering Decisions & Trade-offs. They are defined, in order, in `content/hub.json`.
- `content/topics/<track>/<id>.html` — one file per topic. The folder is the track. **This is what the site is built from.**
- `TOPIC_STYLE.md` — the rules shared by every topic: how to pick a track, file layout, building blocks, tone, what is not allowed.
- `formats/<track>.md` — one file per track: its 12 sections, what goes in each, its "Must have" list, and a skeleton to copy.
- `content/hub.json` — hub title, intro, and for each track: id, title, description, and its section keys and titles.
- `src/styles.css`, `src/app.js` — look and behaviour of the site.
- `scripts/build.mjs` — content → `site/` (home page + one page per topic). No dependencies. It stops with a list of problems if a topic file breaks its track's format, and prints `Note:` lines for style problems.
- `site/` — the generated website. Don't edit by hand; it is rewritten on every build.
- Global search — the search box in the top bar of every page suggests topics and section matches as you type. It reads `site/assets/search-index.js`, which the build generates. The home page loads that file up front; other pages load it the first time the search is used.
- Reading mode — the book button in the top bar puts a warm tint over every page, with a slider for its strength. Saved in the reader's browser (`sd-hub-reading`, `sd-hub-reading-intensity`).
- `.claude/skills/add-topic` — the skill for every new topic. It decides the track by itself (the user does not have to name one), then applies that track's playbook and format file.
- `.claude/skills/add-topic/tracks/<track>.md` — one playbook per track: how to scope a topic, the order to work in, the traps, and the checks before finishing.
- `.claude/skills/review-topic` — the checks for a new or edited topic.

Topic pages are served at `/topics/<id>.html` whatever the track, so an id must be unique across all tracks.

## Rules for any content change

These apply every time a topic is added or edited, with or without the skills:

- **The skill picks the track.** When the user asks for a topic, don't ask them which track. Decide with the nine questions under "Picking the track" in `TOPIC_STYLE.md`, say the choice and the reason in one line, and carry on. If the user did name a track, use theirs.
- **Same format every time.** A topic uses exactly the 12 sections of its track, as listed in `formats/<track>.md`, with every "Must have" item, written by following the track's playbook. Read `TOPIC_STYLE.md`, the track's format file and its playbook before writing.
- **Tone.** Topics are written the way one developer explains something to another: plain everyday words, short sentences, no formal or academic English. The full rule and the word list are under "Writing style" in `TOPIC_STYLE.md`.
- **Placement.** Before adding a topic or any content, look through the existing topics in every track. Flag it to the user if the content is already covered, belongs inside another topic or another track, or if existing content sits in the wrong place. Flag only; don't move existing content without the user saying so.
- **Public site.** No real employer or customer names, internal host names, keys, or real customer data in any topic.
- **No quiz features.** The user reads and revises from plain summaries. Don't add recall, quiz or flashcard features.

## Changing tracks or formats

Only when the user asks for it.

- **Add a track:** add it to `tracks` in `content/hub.json` (id, title, description, 12 `[key, title]` sections ending with `revision`), create `formats/<id>.md` and `.claude/skills/add-topic/tracks/<id>.md` in the same shape as the others, add it to the tables in `TOPIC_STYLE.md` parts 1 and 5, and to the skill description in `.claude/skills/add-topic/SKILL.md`.
- **Change a track's sections:** change `content/hub.json` and `formats/<track>.md` together, then update every existing topic in that track. The build prints a note if the two files disagree, and stops if a topic uses a key its track does not have.
- **Move a topic to another track:** move the file to the other folder and rewrite its sections for that track's format.

## Commands

- `npm run build` — check the topic files and rebuild `site/`.
- `npm run preview` — serve `site/` at http://localhost:4173.

## Git

- Repository: https://github.com/hritambh/UnderTheHood (public), branch `main`, remote `origin`.
- This repo uses the user's personal git email, set in the repo's own git config. Don't change it, and don't commit with any other email.
- The repo is public, so everything committed is visible to anyone. The "Public site" rule above applies to every file, not only topics.

## Hosting

- Live at https://system-design-hub-rho.vercel.app (Vercel project `system-design-hub`, public).
- Vercel runs `node scripts/build.mjs` and serves `site/` (see `vercel.json`).
- A deploy is a separate step from a build: `npx vercel deploy --prod`. Deploy only when the user asks.
