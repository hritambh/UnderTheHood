# Topic style guide

How to write a topic for the System Design Learning Hub.

This file holds the rules that are the same for every topic.
Each track also has its own format file in `formats/`, which lists the 12 sections for that track.
Read both before writing: this file, then `formats/<track>.md`.

## 1. Tracks: what goes where

The home page is split into nine groups called **tracks**. Every topic belongs to exactly one.

| # | Track | Folder and format file | What it holds | Example topics |
|---|---|---|---|---|
| 1 | Core Concepts | `core-concepts` | One general idea used in many systems | Caching, Pagination, Rate Limiting |
| 2 | System Design | `system-design` | The full design of one product | URL Shortener, Chat App, News Feed |
| 3 | Internals & Deep Dives | `internals` | How one named tool works inside | How Kafka Stores Messages, PostgreSQL MVCC |
| 4 | Incidents & Production Learnings | `incidents` | The story of one thing that broke | A Retry Storm That Took Down Checkout |
| 5 | Engineering Patterns & Practices | `patterns` | A named, reusable solution | Circuit Breaker, Outbox, Feature Flags |
| 6 | Database Engineering | `databases` | Using and running a database well | Indexes, Isolation Levels, Query Plans |
| 7 | Problem Solving & DSA | `dsa` | Algorithms, data structures, interview problems | Sliding Window, Two Pointers |
| 8 | Security Engineering | `security` | An attack and its defence | SQL Injection, XSS, Secrets Management |
| 9 | Engineering Decisions & Trade-offs | `decisions` | A choice between reasonable options | SQL vs NoSQL, Monolith vs Microservices |

### Picking the track

Ask these questions in order. The first "yes" wins.

1. Is it the story of a real failure? → `incidents`
2. Is it a choice between two or three options ("X vs Y")? → `decisions`
3. Is it the whole design of one product? → `system-design`
4. Is it an algorithm, a data structure, or an interview coding problem? → `dsa`
5. Is it an attack, or a defence against attacks? → `security`
6. Is it about how one named tool works on the inside? → `internals`
7. Is it about using or running a database? → `databases`
8. Is it a named solution you could tell a teammate to "use here"? → `patterns`
9. Otherwise, it is a general idea. → `core-concepts`

If two tracks still fit, pick the one whose format lets you say the most useful things, and say why in your report.
The same subject can appear in two tracks from two angles. "PostgreSQL MVCC" in `internals` and "Isolation Levels" in `databases` are both fine. They must not repeat each other. Each one links to the other in `related`.

Every format file has a "What does not belong here" part. Check it before you start.

## 2. Where a topic lives

- One topic = one file: `content/topics/<track>/<id>.html`
- The folder decides the track. To move a topic to another track, move the file. Its sections must then be rewritten for the new track's format.
- The file name is the topic's id and its web address. `content/topics/patterns/circuit-breaker.html` becomes `/topics/circuit-breaker.html`.
- File name rules: small letters, digits and dashes only.
- A file name must be unique across all tracks.
- Don't rename a file after it is published. The id is used to save reading progress and to link topics.

## 3. File layout

A topic file has two parts: a header, then the sections.

```html
<!--
title: Caching
summary: Keeping a copy of slow-to-get data somewhere fast, so the next request does not pay the full cost again.
category: Performance
order: 40
related: database-sharding, pagination
-->

<!-- section: what -->
<p>...</p>

<!-- section: why -->
<p>...</p>

... and so on, in the order from the track's format file
```

Rules:

- The header must be the first thing in the file.
- Each section starts with its marker on its own line: `<!-- section: key -->`.
- Everything after a marker, up to the next marker, is that section's content.
- Only the section keys of the topic's own track are allowed. The build stops on any other key.
- Section content is plain HTML. Only use the building blocks from part 6.

Each format file ends with an empty skeleton to copy.

## 4. Header fields

Each field is one line, written as `name: value`.

| Field | Needed? | What it is |
|---|---|---|
| `title` | Yes | The topic name. Shown on the card and as the page heading. Keep it under about 50 characters. |
| `summary` | Yes | One or two simple sentences. Shown on the card and under the page heading. Say what the thing is, not why it is great. |
| `category` | Yes | A short label inside the track, 1 to 3 words, like `Performance` or `Messaging`. Reuse one that the track already has when it fits. |
| `order` | Yes | A number. Lower numbers come first **inside the track**. Use steps of 10 (10, 20, 30) so a topic can be placed between two others later. |
| `related` | No | Ids of related topics, separated by commas. They can be in any track. Each id must be an existing file name without `.html`. |

## 5. Sections

Every track has exactly 12 sections. They are listed, in order, in the track's format file:

| Track | Format file |
|---|---|
| Core Concepts | `formats/core-concepts.md` |
| System Design | `formats/system-design.md` |
| Internals & Deep Dives | `formats/internals.md` |
| Incidents & Production Learnings | `formats/incidents.md` |
| Engineering Patterns & Practices | `formats/patterns.md` |
| Database Engineering | `formats/databases.md` |
| Problem Solving & DSA | `formats/dsa.md` |
| Security Engineering | `formats/security.md` |
| Engineering Decisions & Trade-offs | `formats/decisions.md` |

Rules that hold for every track:

- Write all 12 sections, in the order given. The site adds the section titles, so don't repeat them inside the content.
- Each format file has a "Must have" list. Every item on it is required.
- A section can be left out only if it truly does not apply. The build prints a note for every missing section, so nothing is left out by accident.
- A topic should be about as deep as the existing Core Concepts topics: roughly a 12 to 20 minute read.
- The first section always ends with a one-line version in a note box.
- The last section is always `revision`.

The section keys and titles also live in `content/hub.json`, which is what the site is built from. If a format ever changes, change both places. The build prints a note when they disagree.

### The revision section

Every track ends with `revision`, and the rules are the same everywhere. It is only a summary of what the topic taught.

- It is one `<ul>` list of 6 to 10 points. No headings, no paragraphs around it.
- Each point is one idea, in one or two short sentences.
- Follow the order the topic taught things.
- Each point must make sense by itself, so the list works as a quick refresher a week later.
- Nothing new. If a point is not explained earlier in the topic, it does not belong here.
- No test questions, no answers, no key-terms list, no scenario.

```html
<!-- section: revision -->
<ul>
<li>HTTP alone can’t let the server start a conversation.</li>
<li>Short polling asks every N seconds. It is simple, but wasteful and delayed.</li>
<li>Pick the simplest option that meets the freshness and direction needs.</li>
</ul>
```

## 6. Building blocks

Only these are styled. Anything else will look out of place. They are the same in every track.

### Text

```html
<p>A paragraph. Use <strong>bold</strong> for a key term the first time it appears,
<em>italics</em> for stress, and <code>inline code</code> for names like user_id.</p>

<ul>
  <li><strong>Label</strong>: explanation.</li>
</ul>

<ol>
  <li>First step.</li>
</ol>

<h4>A sub-heading inside a section</h4>
```

- `<h4>` is the only heading allowed inside a section. Never use `<h1>`, `<h2>` or `<h3>`.

### Note box

For a one-line version, a warning, or a side fact.

```html
<p class="note">One-line version: polling = “keep asking”, SSE = “server keeps talking”.</p>
```

Use `<div class="note">` instead of `<p class="note">` when the note holds a list.

### Code block

```html
<pre><code>// orders.controller.ts
const items: Array&lt;Order&gt; = await repo.find();
if (a &amp;&amp; b) { ... }</code></pre>
```

- Inside code, write `&lt;` for `<`, `&gt;` for `>`, and `&amp;` for `&`. Otherwise the browser reads them as HTML.
- Start with a comment that names the file, like `// orders.controller.ts`. For SQL, use `-- what this query does`.
- Keep lines under about 80 characters so they fit on a phone.
- Use NestJS / TypeScript for backend code and PostgreSQL for SQL, unless the format file or the topic says otherwise.
- A copy button is added to every code block by the site.

### Table

Always wrap the table, so it can scroll sideways on a phone.

```html
<div class="table-wrap"><table>
<tr><th></th><th>Option A</th><th>Option B</th></tr>
<tr><td>Delay</td><td>Low</td><td>High</td></tr>
</table></div>
```

### Diagram

Diagrams are drawn as SVG inside the topic file. No image files.

```html
<div class="diagram">
<svg viewBox="0 0 640 200" role="img" aria-label="Request goes from user to API server to database">
<defs><marker id="ah-caching" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="ahead"/></marker></defs>

<rect x="20" y="70" width="120" height="50" rx="8" class="box"/>
<text x="80" y="100" text-anchor="middle" class="lbl">User</text>

<rect x="260" y="70" width="140" height="50" rx="8" class="box hi"/>
<text x="330" y="92" text-anchor="middle" class="lbl">API server</text>
<text x="330" y="109" text-anchor="middle" class="sub">checks the cache</text>

<line x1="140" y1="95" x2="258" y2="95" class="arr" marker-end="url(#ah-caching)"/>
</svg>
</div>
```

Classes to use:

| Class | Use it on | Looks like |
|---|---|---|
| `box` | `<rect>`, `<circle>` | Normal box |
| `box hi` | `<rect>`, `<circle>` | Highlighted box (the part being explained) |
| `box warn` | `<rect>`, `<circle>` | Warning box (a failure, a hot spot) |
| `box faintbox` | `<rect>` | Dashed, faded box (optional or removed part) |
| `lbl` | `<text>` | Bold label |
| `sub` | `<text>` | Small grey caption |
| `arr` | `<line>`, `<path>` | Main arrow or line |
| `arr dim` | `<line>`, `<path>` | Grey arrow (a reply, a side path) |
| `arr faint` | `<line>`, `<path>` | Very light line (paths not taken) |
| `arr warnline` | `<line>`, `<path>` | Warning-coloured line |
| `ahead` | the `<path>` inside a `<marker>` | Arrow head |
| `ahead-warn` | the `<path>` inside a `<marker>` | Warning-coloured arrow head |

Diagram rules:

- Keep the `viewBox` about 640 wide. The height can be anything.
- Never write colours in the SVG (`fill="#..."`, `stroke="red"`). The classes above switch colours for dark mode. Hard-coded colours break it.
- Give each marker a unique id, like `ah-<topic id>`. Two diagrams with the same marker id on one page will clash.
- Always add `role="img"` and an `aria-label` that says what the diagram shows.
- One idea per diagram. If it needs a legend to be understood, split it.

## 7. Writing style

The same in every track.

### Tone: one developer explaining to another

Write the way you would explain it to a teammate at a whiteboard. Not like a textbook, a docs page, or a blog post.

- Use plain, everyday words. If you would not say the word out loud to a colleague, don't write it.
- Talk to the reader. Use "you" and "we": "Say you have a table with 10 million rows."
- Keep sentences short. Most should be under 20 words, with one idea each. If a sentence has two commas and a "which", split it.
- Say what happens, directly. Use active voice.
- Contractions are fine: don't, it's, can't.
- Technical terms are fine. Words like "shard key", "idempotent" and "cursor" are the vocabulary of the job. Explain each one once in plain words, then use it freely. This rule is about the words around the terms.
- Test: read it out loud. If it sounds like a lecture, rewrite it.

Plain words to use:

| Don't write | Write |
|---|---|
| utilize, leverage | use |
| facilitate | help, let |
| in order to | to |
| prior to | before |
| subsequently | then, after that |
| consequently, thus, hence, therefore | so |
| furthermore, moreover, additionally | also |
| whereas | but, while |
| nevertheless, nonetheless | still, but |
| numerous | many |
| sufficient | enough |
| approximately | about |
| obtain | get |
| commence | start |
| mitigate | reduce, avoid |
| regarding, with respect to, pertaining to | about |
| necessitates | needs |
| comprises | has, is made of |
| seamless, paradigm, pivotal, paramount, plethora, myriad, delve | drop the word and say the plain thing |

The build prints a `Note:` when it finds one of these words in a topic.

Before and after:

- Before: "Offset pagination necessitates that the database traverse and subsequently discard all preceding rows."
- After: "With offset, the database has to read the first million rows and throw them away."

- Before: "In order to mitigate this issue, one may utilize a cursor."
- After: "To avoid this, use a cursor."

### Other writing rules

- Explain every technical term the first time it is used, in the same sentence or the next one.
- Start from the problem, then the idea, then the details.
- Prefer a concrete example over a general statement.
- Use real numbers, and show the maths: `10,000 users ÷ 5 s = 2,000 requests/s`.
- Say when numbers are made up for the example. Never present them as benchmarks.
- Be honest about costs. Every "good" needs a matching "bad".
- Be accurate. Don't invent facts, limits, version details or quotes. If you are not sure, check it or leave it out.
- No filler ("it is important to note that", "in today's world").
- Don't praise the technology. Describe it.
- Use curly quotes in normal text (“like this”, don’t), and straight quotes inside code.
- When you mention another topic, name it and add it to `related` in the header. Don't re-teach what another topic already covers. Give it one or two sentences and link.

## 8. Not allowed

- `<script>` tags. The build stops if it finds one.
- `onclick` and other inline event handlers.
- `<h1>`, `<h2>`, `<h3>` inside a section.
- Images, iframes, or anything loaded from another website.
- Inline colours (`style="color:..."`, `fill="#..."`).
- A line that looks like `<!-- section: ... -->` inside the content. The build reads it as a new section.
- **Private details.** This site is public. Never write a real employer's or customer's name, internal host names or URLs, real keys or passwords, or real customer data. This matters most in `incidents`, and applies everywhere.
- Text copied from a book, a course, or another website.

## 9. Checklist before publishing

- [ ] The file is in the right track folder (part 1), and the file name is small letters, digits and dashes.
- [ ] Header has `title`, `summary`, `category`, `order`.
- [ ] Every id in `related` is an existing topic file.
- [ ] All 12 sections of the track's format are there, in order, or one is left out on purpose.
- [ ] Every item in the format file's "Must have" list is there.
- [ ] Every new term is explained where it first appears.
- [ ] The tone is developer to developer, with no words from the "Don't write" list.
- [ ] Code uses `&lt;`, `&gt;`, `&amp;`.
- [ ] Tables are wrapped in `<div class="table-wrap">`.
- [ ] Diagrams have no hard-coded colours and a unique marker id.
- [ ] Revision is only a summary list, with nothing in it that the topic did not teach.
- [ ] No private details, and nothing copied.
- [ ] `npm run build` finishes with no errors and no lines starting with `Note:`.
- [ ] `npm run preview` shows the topic correctly in light and dark mode, and on a narrow window.

## 10. Publishing

```
npm run build       # check the files and rebuild site/
npm run preview     # look at it on http://localhost:4173
npx vercel deploy --prod   # put it on the live site
```

The build stops and lists what to fix if a topic file breaks the format.
A failed build leaves the last good site in place.
