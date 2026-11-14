#!/usr/bin/env node
/* Build: turn content/ into a plain static website in site/.
   Each topic is one file: content/topics/<track>/<id>.html
   Tracks and their sections are listed in content/hub.json.
   The rules are in TOPIC_STYLE.md and formats/<track>.md.

   Usage:  node scripts/build.mjs */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content');
const SRC = path.join(ROOT, 'src');
const SITE = path.join(ROOT, 'site');

const DEFAULT_SECTIONS = [
  ['what', 'What is it?'],
  ['why', 'Why do we need it?'],
  ['realWorld', 'Understand it with a real-world example'],
  ['software', 'Understand it with a software example'],
  ['internals', 'How does it work internally?'],
  ['types', 'Different types or approaches'],
  ['numbers', 'Practical example with numbers'],
  ['tradeoffs', 'Advantages, disadvantages, and trade-offs'],
  ['whenToUse', 'When should I use it?'],
  ['mistakes', 'Common mistakes'],
  ['interview', 'Interview perspective'],
  ['revision', 'Quick revision'],
];

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const noSvg = html => String(html).replace(/<svg[\s\S]*?<\/svg>/gi, ' ');

const plain = html => String(html)
  .replace(/<\/?(strong|em|code|b|i|span|sup|sub)\b[^>]*>/gi, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim();

const ICON = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#2949C6"/>' +
  '<path d="M8 11h16M8 16h16M8 21h10" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>');

const THEME_ICON =
  '<svg class="i-moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a.7.7 0 0 0-.9-.9A10 10 0 1 0 21.4 15.500a.7.7 0 0 0-.9-.9z"/></svg>' +
  '<svg class="i-sun" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 2.5v2.2M12 19.300v2.2M2.500 12h2.2M19.300 12h2.2M5.300 5.300l1.500 1.500M17.200 17.200l1.500 1.500M5.300 18.700l1.500-1.500M17.200 6.800l1.500-1.500"/></svg>';

const SIDE_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9.5 4.5v15" fill="none" stroke="currentColor" stroke-width="1.8"/><rect class="side-fill" x="5.4" y="6.4" width="2.4" height="11.2" rx=".8" fill="currentColor"/></svg>';

const BOOK_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round" d="M12 6.500C10.300 5.200 7.800 4.500 4.500 4.500v13c3.300 0 5.800.700 7.500 2 1.700-1.300 4.200-2 7.500-2v-13c-3.300 0-5.800.700-7.500 2zM12 6.500v13"/></svg>';

function page({ root, title, description, bodyAttrs, body, scripts, v }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<script>(function(){document.documentElement.className+=" js";if(/^#t-/.test(location.hash))document.documentElement.setAttribute("data-home","list");try{var t=localStorage.getItem("sd-hub-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);var v=localStorage.getItem("sd-hub-view");if(v==="list")document.documentElement.setAttribute("data-view","list");if(localStorage.getItem("sd-hub-sidebar")==="0")document.documentElement.setAttribute("data-side","off");if(localStorage.getItem("sd-hub-reading")==="1"){document.documentElement.setAttribute("data-reading","");var i=parseInt(localStorage.getItem("sd-hub-reading-intensity"),10);if(i>=10&&i<=100)document.documentElement.style.setProperty("--read-intensity",i/100)}}catch(e){}})()</script>
<link rel="icon" href="${ICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Literata:opsz,wght@7..72,400;7..72,500;7..72,600;7..72,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${root}assets/styles.css?v=${v}">
</head>
<body ${bodyAttrs} data-root="${root}" data-v="${v}">
${body}
${scripts.map(s => `<script src="${root}assets/${s}?v=${v}"></script>`).join('\n')}
</body>
</html>
`;
}

function topbar(root, hubTitle, withSidebar) {
  return `<header class="topbar">
  <div class="topbar-in">
    ${withSidebar ? `<button class="theme-btn side-btn" id="sideBtn" type="button" aria-label="Hide sidebar" title="Hide sidebar" aria-expanded="true" aria-controls="sidebar">${SIDE_ICON}</button>` : ''}
    <a class="brand" href="${root}index.html"><span class="brand-mark" aria-hidden="true"></span><span class="brand-text">${esc(hubTitle)}</span></a>
    <div class="gsearch" role="search">
      <span class="gsearch-field"><svg class="gsearch-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="11" cy="11" r="6.500" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l4.500 4.500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <input id="gsearch" type="search" placeholder="Search all topics" autocomplete="off" spellcheck="false" role="combobox" aria-label="Search all topics" aria-expanded="false" aria-controls="gsearchList" aria-autocomplete="list"></span>
      <ul class="gsearch-list" id="gsearchList" role="listbox" aria-label="Suggestions" hidden></ul>
    </div>
    <a class="top-link top-home" href="${root}index.html">Home</a>
    <div class="reading">
      <button class="theme-btn" id="readBtn" type="button" aria-label="Reading mode" title="Reading mode" aria-expanded="false" aria-controls="readPanel">${BOOK_ICON}</button>
      <div class="read-panel" id="readPanel" hidden>
        <label class="read-row"><span><strong>Reading mode</strong><small>A warm tint that is easier on the eyes.</small></span><input type="checkbox" class="switch" id="readOn"></label>
        <label class="read-row col"><span>Intensity <output id="readVal" for="readRange">50%</output></span><input type="range" id="readRange" min="10" max="100" step="5" value="50"></label>
      </div>
    </div>
    <button class="theme-btn" id="themeBtn" type="button" aria-label="Switch between light and dark theme">${THEME_ICON}</button>
  </div>
</header>`;
}

/* Words a developer would not say out loud to a teammate. TOPIC_STYLE.md part 8 lists the plain swaps. */
/* Length and visual budget. TOPIC_STYLE.md part 7.
   A topic is for learning, so it stays short and leans on diagrams. */
const MAX_TOPIC_WORDS = 2000;   // about a 10 minute read; the target is 1200-1700
const MAX_SECTION_WORDS = 250;  // prose only; code and diagram text don't count
const MIN_DIAGRAMS = 2;

const FORMAL_WORDS = /\b(utili[sz]e[sd]?|utili[sz]ing|leverag(?:e|es|ed|ing)|facilitat\w+|subsequently|consequently|furthermore|moreover|thus|hence|therefore|whereas|aforementioned|in order to|prior to|with respect to|numerous|commenc\w+|thereby|wherein|plethora|myriad|paradigm|seamless(?:ly)?|delv(?:e|es|ed|ing)|pivotal|paramount|compris\w+|ascertain\w*|elucidat\w+|necessitat\w+|pertaining|albeit|whilst|nonetheless|nevertheless|approximately|sufficient(?:ly)?|obtain(?:s|ed|ing)?|mitigat\w+|additionally|regarding|endeavou?r\w*)\b/gi;

/* Read one topic file: a header comment with "key: value" lines,
   then sections split by <!-- section: key --> marker lines. */
function parseTopic(file, sectionKeys, problems) {
  const id = path.basename(file, '.html');
  const bad = msg => problems.push(`${path.basename(path.dirname(file))}/${path.basename(file)}: ${msg}`);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) bad('file name must use only small letters, digits and dashes');

  const raw = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const head = raw.match(/^\s*<!--([\s\S]*?)-->/);
  if (!head) { bad('must start with a <!-- ... --> header holding title, summary, category, order, related'); return null; }

  const meta = {};
  for (const line of head[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
  }
  if (!meta.title) bad('header needs a "title:" line');
  if (meta.order && !Number.isFinite(Number(meta.order))) bad('"order:" must be a number');

  const parts = raw.slice(head[0].length).split(/^[ \t]*<!--\s*section:\s*([A-Za-z0-9_-]+)\s*-->[ \t]*$/m);
  if (parts[0].trim()) bad('found content before the first "<!-- section: ... -->" line');
  const sections = {};
  for (let i = 1; i < parts.length; i += 2) {
    const key = parts[i], html = parts[i + 1].trim();
    if (!sectionKeys.includes(key)) { bad(`unknown section "${key}". Use one of: ${sectionKeys.join(', ')}`); continue; }
    if (key in sections) { bad(`section "${key}" appears twice`); continue; }
    if (/<script\b/i.test(html)) { bad(`section "${key}" has a <script> tag, which is not allowed`); continue; }
    if (html) sections[key] = html;
  }
  if (!Object.keys(sections).length) bad('has no sections');

  return {
    id,
    title: meta.title || id,
    summary: meta.summary || '',
    category: meta.category || '',
    order: meta.order ? Number(meta.order) : 999,
    prerequisites: (meta.related || '').split(',').map(s => s.trim()).filter(Boolean),
    sections,
  };
}

export function build() {
  /* ---- load content ---- */
  let hub = {};
  try { hub = JSON.parse(fs.readFileSync(path.join(CONTENT, 'hub.json'), 'utf8')); } catch (e) {}
  const hubTitle = hub.title || 'UnderTheHood';
  const hubIntro = hub.intro || '';

  /* A track is one group on the home page (Core Concepts, System Design, ...).
     Each track has a folder in content/topics/ and its own fixed list of
     sections, defined in content/hub.json and explained in formats/<track>.md. */
  const tracks = (Array.isArray(hub.tracks) && hub.tracks.length ? hub.tracks
    : [{ id: 'core-concepts', title: 'Core Concepts', description: '', sections: DEFAULT_SECTIONS }])
    .map(tr => ({ ...tr, topics: [] }));
  const trackById = new Map(tracks.map(tr => [tr.id, tr]));

  const topicsDir = path.join(CONTENT, 'topics');
  const problems = [], notes = [];

  for (const tr of tracks) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(tr.id || '')) problems.push(`hub.json: track id "${tr.id}" must use only small letters, digits and dashes`);
    if (!tr.title) problems.push(`hub.json: track "${tr.id}" needs a title`);
    const ok = Array.isArray(tr.sections) && tr.sections.length &&
      tr.sections.every(s => Array.isArray(s) && typeof s[0] === 'string' && typeof s[1] === 'string');
    if (!ok) { problems.push(`hub.json: track "${tr.id}" needs a "sections" list of [key, title] pairs`); tr.sections = []; }
    if (!fs.existsSync(path.join(ROOT, '.claude', 'skills', 'add-topic', 'tracks', tr.id + '.md'))) {
      notes.push(`.claude/skills/add-topic/tracks/${tr.id}.md is missing. Every track needs a playbook for the add-topic skill`);
    }
    const doc = path.join(ROOT, 'formats', tr.id + '.md');
    if (!fs.existsSync(doc)) notes.push(`formats/${tr.id}.md is missing. Every track needs a format file that explains its sections`);
    else {
      const text = fs.readFileSync(doc, 'utf8');
      const gone = tr.sections.map(s => s[0]).filter(k => !text.includes('`' + k + '`'));
      if (gone.length) notes.push(`formats/${tr.id}.md does not explain these sections from hub.json: ${gone.join(', ')}`);
    }
  }

  for (const e of (fs.existsSync(topicsDir) ? fs.readdirSync(topicsDir, { withFileTypes: true }) : [])) {
    if (e.isFile() && e.name.endsWith('.html')) {
      problems.push(`${e.name}: topic files must sit inside a track folder, for example content/topics/${tracks[0].id}/${e.name}`);
    }
    if (e.isDirectory() && !trackById.has(e.name)) {
      problems.push(`content/topics/${e.name}/: there is no track with this id in content/hub.json. Tracks: ${tracks.map(t => t.id).join(', ')}`);
    }
  }

  const topics = [];
  const byId = new Map();
  for (const tr of tracks) {
    const dir = path.join(topicsDir, tr.id);
    if (!fs.existsSync(dir)) continue;
    const keys = tr.sections.map(s => s[0]);
    const found = fs.readdirSync(dir).filter(f => f.endsWith('.html'))
      .map(f => parseTopic(path.join(dir, f), keys, problems))
      .filter(Boolean)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title));
    for (const t of found) {
      t.track = tr;
      if (byId.has(t.id)) {
        problems.push(`${t.id}.html is in both ${byId.get(t.id).track.id}/ and ${tr.id}/. A topic file name must be unique across all tracks`);
        continue;
      }
      byId.set(t.id, t);
      tr.topics.push(t);
      topics.push(t);
    }
  }

  for (const t of topics) {
    const file = `${t.track.id}/${t.id}.html`;
    const missing = t.track.sections.map(s => s[0]).filter(k => !t.sections[k]);
    if (missing.length) notes.push(`${file}: missing sections: ${missing.join(', ')}`);
    for (const r of t.prerequisites) if (!byId.has(r)) problems.push(`${file}: related topic "${r}" does not exist`);
    if (!t.summary) notes.push(`${file}: header has no "summary:" line`);
    if (!t.category) notes.push(`${file}: header has no "category:" line`);

    /* style checks from TOPIC_STYLE.md (code blocks are skipped) */
    const ids = {};
    const formal = {};
    for (const html of Object.values(t.sections)) {
      const prose = html.replace(/<pre[\s\S]*?<\/pre>/gi, ' ').replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
        .replace(/<code>[\s\S]*?<\/code>/gi, ' ').replace(/<[^>]+>/g, ' ');
      for (const m of prose.matchAll(FORMAL_WORDS)) formal[m[0].toLowerCase()] = (formal[m[0].toLowerCase()] || 0) + 1;
    }
    if (Object.keys(formal).length) {
      notes.push(`${file}: formal words found, use plain ones (see "Writing style" in TOPIC_STYLE.md): ${Object.entries(formal).map(([w, n]) => `${w} ×${n}`).join(', ')}`);
    }
    /* length and visuals: keep topics readable in one sitting (TOPIC_STYLE.md part 7) */
    const all = Object.values(t.sections).join(' ');
    const topicWords = plain(noSvg(all)).split(/\s+/).filter(Boolean).length;
    if (topicWords > MAX_TOPIC_WORDS) {
      notes.push(`${file}: ${topicWords} words, about a ${Math.round(topicWords / 200)} minute read. The budget is 1,200 to 1,700 words (9 minutes). Do the cutting pass in TOPIC_STYLE.md part 7`);
    }
    const long = [];
    const diagrams = (all.match(/class="diagram"/g) || []).length;
    if (diagrams < MIN_DIAGRAMS) {
      notes.push(`${file}: ${diagrams === 0 ? 'no diagrams' : 'only 1 diagram'}. A topic needs at least ${MIN_DIAGRAMS}; turn the longest explanation into one (TOPIC_STYLE.md part 7)`);
    }

    for (const [key, html] of Object.entries(t.sections)) {
      const at = `${file}, section "${key}"`;
      const secWords = plain(noSvg(html).replace(/<pre[\s\S]*?<\/pre>/gi, ' '))
        .split(/\s+/).filter(Boolean).length;
      if (secWords > MAX_SECTION_WORDS) long.push(`${key} ${secWords}`);
      if ((html.match(/<p>/g) || []).length >= 4 && !/<(ul|ol|table|pre|svg|h4)\b/i.test(html)) {
        notes.push(`${at}: four or more paragraphs with no list, table, diagram or code. Break it up or draw it (TOPIC_STYLE.md part 7)`);
      }
      const h = html.replace(/<pre[\s\S]*?<\/pre>/gi, '');
      if (/<h[1-3]\b/i.test(h)) notes.push(`${at}: use <h4> for sub-headings, not h1, h2 or h3`);
      if (/<[a-z][^>]*\son[a-z]+\s*=/i.test(h)) notes.push(`${at}: inline event handlers (onclick and similar) are not allowed`);
      if (/<(img|iframe|object|embed)\b/i.test(h)) notes.push(`${at}: images and embeds are not allowed; draw diagrams as SVG`);
      if (/(fill|stroke|color)\s*[=:]\s*["']?\s*(#[0-9a-f]{3,8}\b|rgb|hsl)/i.test(h)) notes.push(`${at}: hard-coded colour found; use the diagram classes so dark mode works`);
      if ((h.match(/<table\b/gi) || []).length > (h.match(/class="table-wrap"/g) || []).length) notes.push(`${at}: wrap every <table> in <div class="table-wrap">`);
      if ((h.match(/<svg\b/gi) || []).length > (h.match(/class="diagram"/g) || []).length) notes.push(`${at}: wrap every <svg> in <div class="diagram">`);
      if (/<svg\b(?![^>]*aria-label)/i.test(h)) notes.push(`${at}: the <svg> needs role="img" and an aria-label`);
      for (const m of h.matchAll(/<[a-z][^>]*\sid="([^"]+)"/gi)) (ids[m[1]] ||= []).push(key);
    }
    if (long.length) {
      notes.push(`${file}: sections over ${MAX_SECTION_WORDS} words of prose (${long.join(', ')}). Keep each near 150; cut it or draw it (TOPIC_STYLE.md part 7)`);
    }
    for (const [id, where] of Object.entries(ids)) {
      if (where.length > 1) notes.push(`${file}: id "${id}" is used ${where.length} times (sections: ${[...new Set(where)].join(', ')}); ids must be unique in a topic`);
    }
    if (t.sections.revision && /<(h4|details|ol|table)\b/i.test(t.sections.revision)) {
      notes.push(`${file}: revision must be only one summary list (see "The revision section" in TOPIC_STYLE.md)`);
    }
  }
  for (const tr of tracks) {
    const byOrder = {};
    for (const t of tr.topics) (byOrder[t.order] ||= []).push(t.id);
    for (const [order, list] of Object.entries(byOrder)) {
      if (list.length > 1) notes.push(`${tr.id}/: order ${order} is used by ${list.join(' and ')}; give each topic in a track its own number`);
    }
  }
  if (problems.length) {
    throw new Error('Build stopped. Fix these and run it again:\n  - ' + problems.join('\n  - '));
  }
  notes.forEach(n => console.warn('Note: ' + n));

  for (const t of topics) {
    t.secs = t.track.sections.filter(([k]) => t.sections[k]).map(([k, label]) => ({ key: k, label, html: t.sections[k] }));
    const words = t.secs.reduce((n, s) => n + plain(noSvg(s.html)).split(' ').length, 0);
    t.minutes = Math.max(1, Math.round(words / 200));
  }

  /* ---- prepare output folders (only the parts this script owns) ---- */
  fs.rmSync(path.join(SITE, 'topics'), { recursive: true, force: true });
  fs.rmSync(path.join(SITE, 'assets'), { recursive: true, force: true });
  fs.mkdirSync(path.join(SITE, 'topics'), { recursive: true });
  fs.mkdirSync(path.join(SITE, 'assets'), { recursive: true });

  /* ---- assets ---- */
  const css = fs.readFileSync(path.join(SRC, 'styles.css'), 'utf8');
  const js = fs.readFileSync(path.join(SRC, 'app.js'), 'utf8');
  const index = topics.map(t => ({
    id: t.id,
    title: t.title,
    track: t.track.title,
    category: t.category,
    summary: t.summary,
    sections: t.secs.map(s => ({ key: s.key, label: s.label, text: plain(s.html) })),
  }));
  const indexJs = 'window.HUB_INDEX = ' + JSON.stringify(index) + ';\n';
  fs.writeFileSync(path.join(SITE, 'assets', 'styles.css'), css);
  fs.writeFileSync(path.join(SITE, 'assets', 'app.js'), js);
  fs.writeFileSync(path.join(SITE, 'assets', 'search-index.js'), indexJs);
  const v = crypto.createHash('sha1').update(css + js + indexJs).digest('hex').slice(0, 8);
  const updated = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const footer = `<p class="sync">Your progress is saved in this browser only. Last updated on ${esc(updated)}.</p>`;
  const count = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

  /* ---- home page ---- */
  const card = (t, i) => `
    <article class="topic-card" data-id="${esc(t.id)}" data-text="${esc((t.title + ' ' + t.summary + ' ' + t.category + ' ' + t.track.title).toLowerCase())}">
      <div class="card-main">
      <div class="card-top"><span class="cat">${esc(t.category)}</span><span class="card-num">${String(i + 1).padStart(2, '0')}</span></div>
      <h3><a href="topics/${esc(t.id)}.html"><span class="dot" data-dot="${esc(t.id)}" aria-hidden="true"></span>${esc(t.title)}</a></h3>
      <p class="card-sum">${esc(t.summary)}</p>
      <p class="hits" hidden></p>
      </div>
      <div class="card-meta">
        <span class="mins">${t.minutes} min read · ${t.secs.length} sections</span>
        <select class="status-select" aria-label="Status of ${esc(t.title)}">
          <option value="not">Not started</option>
          <option value="progress">In progress</option>
          <option value="done">Completed</option>
        </select>
      </div>
    </article>`;

  const trackNav = `<nav class="track-nav" aria-label="Tracks"><a href="#" class="all" id="allTracks">‹ All tracks</a>${tracks.map(tr =>
    `<a href="#t-${esc(tr.id)}"${tr.topics.length ? '' : ' class="none"'}>${esc(tr.title)}<span>${tr.topics.length}</span></a>`).join('')}</nav>`;

  /* what the home page shows first: one tile per track, and nothing else */
  const trackTiles = `<div class="track-tiles" id="trackTiles">${tracks.map((tr, n) => tr.topics.length ? `
    <a class="track-tile" href="#t-${esc(tr.id)}" data-track="${esc(tr.id)}">
      <span class="tile-top"><span class="track-num">${String(n + 1).padStart(2, '0')}</span><span class="tile-count">${count(tr.topics.length, 'topic')}</span></span>
      <strong class="tile-title">${esc(tr.title)}</strong>
      <span class="tile-desc">${esc(tr.description || '')}</span>
      <span class="tile-progress"><span class="tile-bar" aria-hidden="true"><span></span></span><span class="tile-done"></span></span>
    </a>` : `
    <div class="track-tile is-empty">
      <span class="tile-top"><span class="track-num">${String(n + 1).padStart(2, '0')}</span><span class="tile-count">No topics yet</span></span>
      <strong class="tile-title">${esc(tr.title)}</strong>
      <span class="tile-desc">${esc(tr.description || '')}</span>
    </div>`).join('')}
  </div>`;

  const trackSections = tracks.map((tr, n) => `
  <section class="track${tr.topics.length ? '' : ' is-empty'}" id="track-${esc(tr.id)}" aria-labelledby="th-${esc(tr.id)}">
    <header class="track-head">
      <span class="track-num">${String(n + 1).padStart(2, '0')}</span>
      <div class="track-title"><h2 id="th-${esc(tr.id)}">${esc(tr.title)}</h2>${tr.description ? `<p>${esc(tr.description)}</p>` : ''}</div>
      <span class="track-count">${tr.topics.length ? count(tr.topics.length, 'topic') : 'No topics yet'}</span>
    </header>${tr.topics.length ? `
    <div class="topic-list">${tr.topics.map(card).join('')}
    </div>` : ''}
  </section>`).join('');

  const home = `${topbar('', hubTitle)}
<main class="wrap" id="home">
  <header class="home-head">
    <p class="eyebrow">${count(topics.length, 'topic')} · ${count(tracks.length, 'track')}</p>
    <h1>${esc(hubTitle)}</h1>
    ${hubIntro ? `<p>${esc(hubIntro)}</p>` : ''}
    <a class="continue" id="continue" hidden></a>
    <details class="how">
      <summary>How to use this hub</summary>
      <ul>
        <li>This page shows the tracks, like Core Concepts and System Design. Click a track to see its topics. Every topic in a track follows the same fixed steps.</li>
        <li>Open a topic and just scroll. Each section opens by itself as you reach it. You can still fold or unfold any section by clicking its title, and a section you fold stays folded.</li>
        <li>Mark each topic as Not started, In progress, or Completed. Your progress is saved in this browser.</li>
        <li>Inside a track, switch between grid and list view with the two buttons next to the filters. Your choice is remembered.</li>
        <li>The book button at the top turns on reading mode: a warm tint that is easier on the eyes. Use its slider to make the tint lighter or stronger.</li>
        <li>The search box at the top works on every page. It suggests topics as you type, and it looks inside the topics too. Press <kbd>/</kbd> to jump to it, then use the arrow keys and Enter.</li>
        <li>Inside a track, the filter box narrows the list, and shows which sections mention your word.</li>
        <li>Every topic ends with a quick revision: a short summary of what you learnt.</li>
      </ul>
    </details>
  </header>

  ${trackTiles}

  ${trackNav}
${topics.length ? `
  <div class="progress-row">
    <div class="progress-bar" aria-hidden="true"><span class="b-done" id="barDone"></span><span class="b-prog" id="barProg"></span></div>
    <div class="progress-text" id="progressText" aria-live="polite"></div>
  </div>

  <div class="controls">
    <input class="search" id="search" type="search" placeholder="Filter the topics below" aria-label="Filter the topics on this page" autocomplete="off">
    <div class="filters" role="group" aria-label="Filter by status">
      <button class="chip" type="button" data-filter="all" aria-pressed="true">All</button>
      <button class="chip" type="button" data-filter="not" aria-pressed="false">Not started</button>
      <button class="chip" type="button" data-filter="progress" aria-pressed="false">In progress</button>
      <button class="chip" type="button" data-filter="done" aria-pressed="false">Completed</button>
    </div>
    <div class="view-toggle" role="group" aria-label="Topic layout">
      <button class="view-btn" type="button" data-view="grid" aria-pressed="true" aria-label="Grid view" title="Grid view"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="1.500" y="1.500" width="5" height="5" rx="1.200" fill="currentColor"/><rect x="9.500" y="1.500" width="5" height="5" rx="1.200" fill="currentColor"/><rect x="1.500" y="9.500" width="5" height="5" rx="1.200" fill="currentColor"/><rect x="9.500" y="9.500" width="5" height="5" rx="1.200" fill="currentColor"/></svg></button>
      <button class="view-btn" type="button" data-view="list" aria-pressed="false" aria-label="List view" title="List view"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="1.500" y="2.500" width="13" height="2.400" rx="1.200" fill="currentColor"/><rect x="1.500" y="6.800" width="13" height="2.400" rx="1.200" fill="currentColor"/><rect x="1.500" y="11.100" width="13" height="2.400" rx="1.200" fill="currentColor"/></svg></button>
    </div>
  </div>
  <p class="no-match" id="noMatch" hidden></p>` : ''}

${trackSections}
  ${footer}
</main>`;

  fs.writeFileSync(path.join(SITE, 'index.html'), page({
    root: '', title: hubTitle, description: hubIntro || hubTitle,
    bodyAttrs: 'data-page="home"', body: home, scripts: ['search-index.js', 'app.js'], v,
  }));

  /* ---- topic pages ---- */
  for (const t of topics) {
    const inTrack = t.track.topics;
    const i = inTrack.indexOf(t);
    const prev = inTrack[i - 1], next = inTrack[i + 1];
    const related = (t.prerequisites || []).map(id => byId.get(id)).filter(Boolean);

    const sideTopics = tracks.filter(tr => tr.topics.length).map(tr => `
    <h4>${esc(tr.title)}</h4>
    <ul class="side-topics">${tr.topics.map(x =>
      `<li><a href="${esc(x.id)}.html"${x.id === t.id ? ' aria-current="page"' : ''}><span class="dot" data-dot="${esc(x.id)}" aria-hidden="true"></span>${esc(x.title)}</a></li>`).join('')}</ul>`).join('');
    const sideSecs = t.secs.map(s => `<li><a href="#s-${esc(s.key)}">${esc(s.label)}</a></li>`).join('');

    const sections = t.secs.map((s, n) => `
    <details class="sec" id="s-${esc(s.key)}"${n < 2 ? ' open' : ''}>
      <summary><span class="sec-num">${n + 1}.</span><span class="sec-title">${esc(s.label)}</span><span class="sec-toggle" aria-hidden="true">›</span></summary>
      <div class="sec-body">${s.html}</div>
    </details>`).join('');

    const body = `<div class="readbar" aria-hidden="true"><span id="readbar"></span></div>
${topbar('../', hubTitle, true)}
<div class="wrap topic-layout">
  <nav class="sidebar" id="sidebar" aria-label="Topics and sections">${sideTopics}
    <h4>On this page</h4>
    <ol class="side-secs" id="sideSecs">${sideSecs}</ol>
  </nav>
  <article id="article">
    <a class="back" href="../index.html#t-${esc(t.track.id)}">‹ ${esc(t.track.title)}</a>
    <p class="eyebrow">${esc(t.track.title)}${t.category ? ' · ' + esc(t.category) : ''} · ${t.minutes} min read</p>
    <h1>${esc(t.title)}</h1>
    <p class="topic-intro">${esc(t.summary)}</p>
    <div class="status-row" role="group" aria-label="Topic status">
      <button type="button" class="status-btn s-not" data-s="not" aria-pressed="false">Not started</button>
      <button type="button" class="status-btn s-progress" data-s="progress" aria-pressed="false">In progress</button>
      <button type="button" class="status-btn s-done" data-s="done" aria-pressed="false">Completed</button>
    </div>
    ${related.length ? `<div class="prereq">Related topics: ${related.map(p => `<a href="${esc(p.id)}.html">${esc(p.title)}</a>`).join(', ')}</div>` : ''}
    <div class="expand-row"><button class="linkish" type="button" data-all="open">Expand all</button><button class="linkish" type="button" data-all="close">Collapse all</button></div>
${sections}
    <div class="finish">
      <span>Finished reading?</span>
      <button type="button" class="finish-btn" id="finishBtn">Mark as completed</button>
    </div>
    <nav class="pager" aria-label="Previous and next topic in ${esc(t.track.title)}">
      ${prev ? `<a href="${esc(prev.id)}.html"><small>Previous</small>${esc(prev.title)}</a>` : '<span></span>'}
      ${next ? `<a class="next" href="${esc(next.id)}.html"><small>Next</small>${esc(next.title)}</a>` : ''}
    </nav>
    ${footer}
  </article>
</div>`;

    fs.writeFileSync(path.join(SITE, 'topics', t.id + '.html'), page({
      root: '../', title: `${t.title} · ${hubTitle}`, description: t.summary || t.title,
      bodyAttrs: `data-page="topic" data-topic="${esc(t.id)}" data-title="${esc(t.title)}"`,
      body, scripts: ['app.js'], v,
    }));
  }

  console.log(`Built ${count(topics.length, 'topic page')} in ${count(tracks.filter(tr => tr.topics.length).length, 'track')} (${tracks.length} tracks defined) + home page into ${path.relative(process.cwd(), SITE) || SITE}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { build(); }
  catch (e) { console.error(e.message); process.exit(1); }
}
