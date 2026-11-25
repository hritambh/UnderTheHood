# UnderTheHood (static website)

The site was called "My System Design Learning Hub" until 2026-11-13. The project folder is `/Users/hritambh/Documents/UnderTheHood` (renamed from `system-design-hub` on 2026-11-14). The Vercel project still uses the old name `system-design-hub`.

A plain static website of engineering topics, grouped into tracks. It started as a copy of a Claude artifact, but the artifact is no longer used. The files in `content/` are the only source.

## How it fits together

- **Home page** — it shows only the ten track tiles, with a count and a progress bar on each. Topics are not listed there. Clicking a tile (address `index.html#t-<track>`) swaps the tiles for that track's topics, with the status filters, the filter box and the grid/list switch. The user asked for the home page to stay this clean, so don't add topic lists or other panels to it.
- **Tracks** — the ten groups on the home page: Core Concepts, System Design, Internals & Deep Dives, Incidents & Production Learnings, Engineering Patterns & Practices, Database Engineering, Problem Solving & DSA, Security Engineering, Engineering Decisions & Trade-offs, Work Experience & Projects. They are defined, in order, in `content/hub.json`.
- `content/topics/<track>/<id>.html` — one file per topic. The folder is the track. **This is what the site is built from.**
- `TOPIC_STYLE.md` — the rules shared by every topic: how to pick a track, file layout, building blocks, tone, what is not allowed.
- `formats/<track>.md` — one file per track: its 12 sections, what goes in each, its "Must have" list, and a skeleton to copy.
- `content/hub.json` — hub title, intro, and for each track: id, title, description, and its section keys and titles.
- `src/styles.css`, `src/app.js` — look and behaviour of the site.
- `scripts/build.mjs` — content → `site/` (home page + one page per topic). No dependencies. It stops with a list of problems if a topic file breaks its track's format, and prints `Note:` lines for style problems.
- `site/` — the generated website. Don't edit by hand; it is rewritten on every build.
- Topic pages — the first two sections start open and the rest are folded. A folded section opens by itself when the reader scrolls to it. A section the reader folds by hand stays folded, and jumping to a section from the sidebar or a link does not open the ones it passes over.
- Global search — the search box in the top bar of every page suggests topics and section matches as you type. It reads `site/assets/search-index.js`, which the build generates. The home page loads that file up front; other pages load it the first time the search is used.
- Sidebar toggle — on topic pages, the button at the left of the top bar (or the `[` key) hides or shows the sidebar. Only on screens wide enough to have a sidebar (920px and up). Saved in the reader's browser (`sd-hub-sidebar`).
- Reading mode — the book button in the top bar puts a warm tint over every page, with a slider for its strength. Saved in the reader's browser (`sd-hub-reading`, `sd-hub-reading-intensity`).
- Listen — a headphones button in the top bar of a topic page (or the `L` key) reads the topic out loud with the browser's own speech engine (`speechSynthesis`). No audio files, no API key, nothing to pay for. While it runs, a bar sits at the bottom with play/pause, previous and next section, the section it is on, a voice picker, a speed slider (0.7x to 1.8x) and a Stop button. It opens each folded section as it reaches it, highlights the block it is speaking and scrolls to follow, backing off for 6 seconds whenever the reader scrolls by hand. Diagrams are read from their `aria-label`, tables row by row as "heading: value", and code blocks are announced and skipped. Each sentence is its own utterance, so pause and skip respond at once and Chrome does not cut long ones off. Pausing drops the current sentence and replays it on resume, because `speechSynthesis.pause()` is unreliable on phones. Turning it on stops auto scroll, and turning auto scroll on stops it. The voice and speed are saved in the reader's browser (`sd-hub-listen`), and where they got to in each topic is saved per topic (`sd-hub-listen-at`) so it picks up from that section next time.
- Auto scroll — its own button in the top bar, next to the book button. It creeps the page down on its own, and while it runs a bar sits at the bottom of the screen with a Stop button, a speed slider (10 to 200 pixels a second), the current speed, and a line saying how to stop it. The bar is only there while it runs, so the slider never has to start it. Scrolling by hand does **not** stop it, in either direction: the reader can run ahead or drop back and it carries on creeping from wherever they land. It stops on a double click, a double tap (a tap that drags is a swipe, not a tap), Escape, the Stop button, or the top-bar button. Clicks on a control (the bar, the reading panel, any button, link or field) are left alone. At the bottom it waits rather than switching off, so it picks up again when a folded section opens. Both the switch and the speed are saved in the reader’s browser (`sd-hub-autoscroll`, `sd-hub-autoscroll-speed`), so it carries straight on to the next page.
- `.claude/skills/add-topic` — the skill for every new topic. It decides the track by itself (the user does not have to name one), then applies that track's playbook and format file.
- `.claude/skills/add-topic/tracks/<track>.md` — one playbook per track: how to scope a topic, the order to work in, the traps, and the checks before finishing.
- `.claude/skills/review-topic` — the checks for a new or edited topic.
- `.claude/skills/refactor-topic` — reworking an existing topic to the current length and visual rules.

Topic pages are served at `/topics/<id>.html` whatever the track, so an id must be unique across all tracks.

## Rules for any content change

These apply every time a topic is added or edited, with or without the skills:

- **The skill picks the track.** When the user asks for a topic, don't ask them which track. Decide with the ten questions under "Picking the track" in `TOPIC_STYLE.md`, say the choice and the reason in one line, and carry on. If the user did name a track, use theirs.
- **Same format every time.** A topic uses exactly the 12 sections of its track, as listed in `formats/<track>.md`, with every "Must have" item, written by following the track's playbook. Read `TOPIC_STYLE.md`, the track's format file and its playbook before writing.
- **Moderate depth, visual.** Topics are for learning, not for reference. About 2,500 words (a 12 to 13 minute read), 100 to 200 per section, at least two diagrams. That is a target, not a wall: a subject that genuinely needs more room gets it rather than being cut until the required parts go missing. What is never acceptable is padding. Cover the fundamentals, how it works, where it is used and what it costs, then stop. Prefer a diagram, table or numbered list over paragraphs. The build prints a `Note:` when a topic runs long or has too few diagrams. The full rule is part 7 of `TOPIC_STYLE.md`.
- **Tone.** Topics are written the way one developer explains something to another: plain everyday words, short sentences, no formal or academic English. The full rule and the word list are under "Writing style" in `TOPIC_STYLE.md`.
- **Placement.** Before adding a topic or any content, look through the existing topics in every track. Flag it to the user if the content is already covered, belongs inside another topic or another track, or if existing content sits in the wrong place. Flag only; don't move existing content without the user saying so.
- **Public site.** No real customer names, internal host names, keys, or real customer data in any topic. The one carve-out is the `experience` track, which is the user's own work history: it may name the user's own employers, and nothing else on that list. It is kept to what the user would say in a public interview. `formats/experience.md` has the full rule.
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

- Live at https://underthehood-hub.vercel.app (Vercel project `system-design-hub`, public). The older address https://system-design-hub-rho.vercel.app still serves the same site.
- Reading progress is saved per address, so progress saved on one address does not show on the other.
- Vercel runs `node scripts/build.mjs` and serves `site/` (see `vercel.json`).
- The Vercel project is connected to the GitHub repo. **Every push to `main` deploys to the live site automatically.** Other branches get a preview link.
- So a push to `main` is a deploy. Commit locally as needed, but push to `main` only when the user asks to push or deploy.
- `npx vercel deploy --prod` still works for a deploy without a push, but it should not be needed.
