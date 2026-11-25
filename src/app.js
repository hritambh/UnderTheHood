/* Small script shared by every page. The pages are plain HTML and readable
   without it; this adds progress tracking, search, theme, grid/list view,
   reading mode, reading helpers and reading a topic out loud. */
(function () {
  'use strict';

  var LS_PROGRESS = 'sd-hub-progress-v1';
  var LS_THEME = 'sd-hub-theme';
  var LS_LAST = 'sd-hub-last';
  var LS_VIEW = 'sd-hub-view';
  var LS_READING = 'sd-hub-reading';
  var LS_READ_INT = 'sd-hub-reading-intensity';
  var LS_SIDEBAR = 'sd-hub-sidebar';
  var LS_SCROLL_ON = 'sd-hub-autoscroll';
  var LS_SCROLL_SPEED = 'sd-hub-autoscroll-speed';
  var LABEL = { not: 'Not started', progress: 'In progress', done: 'Completed' };

  function load(key, fallback) {
    try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function $(id) { return document.getElementById(id); }
  /* clipboard, with the old-browser fallback in one place */
  function copyText(text, done) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else fallback();
  }
  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* the search index keeps the original text; lower-case copies are made once, for matching */
  var indexReady = false;
  function prepIndex() {
    if (indexReady || !window.HUB_INDEX) return;
    indexReady = true;
    window.HUB_INDEX.forEach(function (t) {
      t._title = t.title.toLowerCase();
      t._meta = ((t.track || '') + ' ' + (t.category || '') + ' ' + (t.summary || '')).toLowerCase();
      t.sections.forEach(function (s) { s._text = s.text.toLowerCase(); });
    });
  }

  var progress = load(LS_PROGRESS, {}) || {};
  function statusOf(id) { return progress[id] || 'not'; }
  function setStatus(id, s) { progress[id] = s; save(LS_PROGRESS, progress); paint(); }

  /* ---------- theme ---------- */
  var themeBtn = $('themeBtn');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var root = document.documentElement;
    var now = root.getAttribute('data-theme') ||
      (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = now === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(LS_THEME, next); } catch (e) {}
  });

  /* ---------- reading mode: a warm tint with adjustable strength ---------- */
  var readBtn = $('readBtn');
  if (readBtn) (function () {
    var root = document.documentElement;
    var panel = $('readPanel'), onBox = $('readOn'), range = $('readRange'), val = $('readVal');
    function stored() {
      var on = false, v = 50;
      try {
        on = localStorage.getItem(LS_READING) === '1';
        var n = parseInt(localStorage.getItem(LS_READ_INT), 10);
        if (n >= 10 && n <= 100) v = n;
      } catch (e) {}
      return { on: on, v: v };
    }
    function apply(on, v) {
      if (on) root.setAttribute('data-reading', ''); else root.removeAttribute('data-reading');
      root.style.setProperty('--read-intensity', v / 100);
      onBox.checked = on;
      range.value = v;
      val.textContent = v + '%';
    }
    function store(on, v) {
      try { localStorage.setItem(LS_READING, on ? '1' : '0'); localStorage.setItem(LS_READ_INT, String(v)); } catch (e) {}
      apply(on, v);
    }
    function open(show) {
      panel.hidden = !show;
      readBtn.setAttribute('aria-expanded', String(show));
    }
    var s = stored();
    apply(s.on, s.v);
    readBtn.addEventListener('click', function () { open(panel.hidden); });
    onBox.addEventListener('change', function () { store(onBox.checked, Number(range.value)); });
    // moving the slider turns reading mode on, so the change is visible
    range.addEventListener('input', function () { store(true, Number(range.value)); });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !e.target.closest('.reading')) open(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { open(false); readBtn.focus(); }
    });
    window.addEventListener('storage', function (e) {
      if (e.key === LS_READING || e.key === LS_READ_INT) { var x = stored(); apply(x.on, x.v); }
    });
  })();

  /* ---------- auto scroll: creep the page down at a speed the reader picks ----------
     Scrolling by hand never stops it: the reader can run ahead or drop back and
     it carries on creeping from wherever they land. Only a double tap (or a
     double click), the switch, or Escape stops it. Both the switch and the
     speed are remembered, so it carries straight on to the next page. At the
     bottom it waits instead of switching off, and picks up again when a folded
     section opens and makes the page taller. */
  var scrollBtn = $('scrollBtn');
  if (scrollBtn) (function () {
    var root = document.documentElement;
    var range = $('scrollRange'), val = $('scrollVal'), stopBtn = $('scrollStop');
    var MIN = 10, MAX = 200;
    var speed = 40;       // pixels a second
    var raf = 0, last = 0, carry = 0;
    var TAP_GAP = 350, TAP_NEAR = 40, TAP_SLOP = 10;   // double tap: ms, px apart, px of drift

    function stored() {
      var on = false;
      try {
        on = localStorage.getItem(LS_SCROLL_ON) === '1';
        var n = parseInt(localStorage.getItem(LS_SCROLL_SPEED), 10);
        if (n >= MIN && n <= MAX) speed = n;
      } catch (e) {}
      return on;
    }
    function remember(on) {
      try {
        localStorage.setItem(LS_SCROLL_ON, on ? '1' : '0');
        localStorage.setItem(LS_SCROLL_SPEED, String(speed));
      } catch (e) {}
    }
    function paintSpeed() {
      range.value = speed;
      val.textContent = speed + ' px/s';
    }
    /* One frame. We keep the leftover fraction of a pixel, so even the slowest
       speed keeps moving instead of rounding down to nothing every frame. */
    function step(now) {
      raf = requestAnimationFrame(step);
      var dt = (now - last) / 1000;
      last = now;
      if (dt <= 0) return;
      if (dt > 0.25) dt = 0.25;        // the tab was in the background
      carry += speed * dt;
      var px = Math.floor(carry);
      if (px < 1) return;
      carry -= px;
      // 'instant' matters: the page sets scroll-behavior:smooth, which would fight this.
      // At the bottom this moves nothing, and we keep running: a section opening
      // below makes the page taller, and then there is somewhere to go again.
      window.scrollBy({ top: px, left: 0, behavior: 'instant' });
    }
    function start(save) {
      if (save) remember(true);
      scrollBtn.setAttribute('aria-pressed', 'true');
      root.setAttribute('data-autoscroll', '');
      if (raf) return;
      carry = 0;
      last = window.performance ? performance.now() : Date.now();
      raf = requestAnimationFrame(step);
    }
    function stop(save) {
      if (save) remember(false);
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      root.removeAttribute('data-autoscroll');
      scrollBtn.setAttribute('aria-pressed', 'false');
    }

    var wasOn = stored();
    paintSpeed();
    if (wasOn) start(false);        // it was still running when the last page was left

    scrollBtn.addEventListener('click', function () {
      if (raf) stop(true); else start(true);
    });
    stopBtn.addEventListener('click', function () { stop(true); });
    /* The bar is only on screen while it is running, so the slider never has to
       start it; it just changes the speed under the reader's finger. */
    range.addEventListener('input', function () {
      speed = Number(range.value);
      paintSpeed();
      remember(true);
    });

    /* Stopping is a deliberate double tap, nothing else. Scrolling by hand is
       how the reader keeps up or drops back, so neither direction switches it
       off; the loop just carries on from wherever they left the page. A control
       is left alone, so double clicking the slider or a button does not stop it. */
    function isAControl(el) {
      return !!(el && el.closest && el.closest(
        'input,textarea,select,button,a,summary,label,[contenteditable],.read-panel,.autobar'));
    }
    document.addEventListener('dblclick', function (e) {
      if (raf && !isAControl(e.target)) stop(true);
    });

    /* The same thing by finger. A tap only counts if it did not drag, so a swipe
       through the page is never half of a double tap. */
    var tapAt = 0, tapX = 0, tapY = 0, fromX = 0, fromY = 0, dragged = true;
    window.addEventListener('touchstart', function (e) {
      dragged = !e.touches || e.touches.length !== 1;
      if (dragged) return;
      fromX = e.touches[0].clientX;
      fromY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchmove', function (e) {
      if (dragged || !e.touches || e.touches.length !== 1) return;
      if (Math.abs(e.touches[0].clientX - fromX) > TAP_SLOP ||
          Math.abs(e.touches[0].clientY - fromY) > TAP_SLOP) dragged = true;
    }, { passive: true });
    window.addEventListener('touchend', function (e) {
      if (dragged) { tapAt = 0; return; }          // that was a swipe
      var now = Date.now();
      var near = Math.abs(fromX - tapX) < TAP_NEAR && Math.abs(fromY - tapY) < TAP_NEAR;
      if (tapAt && now - tapAt < TAP_GAP && near) {
        tapAt = 0;
        if (raf && !isAControl(e.target)) stop(true);
        return;
      }
      tapAt = now; tapX = fromX; tapY = fromY;
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && raf) stop(true);
    });
    window.addEventListener('storage', function (e) {
      if (e.key === LS_SCROLL_SPEED) {
        var v = parseInt(e.newValue, 10);
        if (v >= MIN && v <= MAX) { speed = v; paintSpeed(); }
      } else if (e.key === LS_SCROLL_ON) {
        if (e.newValue === '1') start(false); else stop(false);
      }
    });
  })();

  /* ---------- global search with suggestions (every page) ---------- */
  var gInput = $('gsearch');
  if (gInput) (function () {
    var list = $('gsearchList');
    var root = document.body.getAttribute('data-root') || '';
    var rows = [], active = -1, loading = false;

    // the index is big, so pages other than home only load it when the search is used
    function withIndex(cb) {
      if (window.HUB_INDEX) { prepIndex(); return cb(); }
      if (loading) return;
      loading = true;
      var s = document.createElement('script');
      s.src = root + 'assets/search-index.js?v=' + (document.body.getAttribute('data-v') || '');
      s.onload = function () { prepIndex(); cb(); };
      s.onerror = function () { loading = false; };
      document.head.appendChild(s);
    }

    function find(q) {
      var topics = [], inside = [];
      window.HUB_INDEX.forEach(function (t) {
        var i = t._title.indexOf(q), score = -1;
        if (i === 0) score = 100;                                          // title starts with it
        else if (i > 0 && /[^a-z0-9]/.test(t._title.charAt(i - 1))) score = 80;  // a word in the title starts with it
        else if (i > 0) score = 60;
        else if (t._meta.indexOf(q) >= 0) score = 40;                      // track, category or summary
        if (score >= 0) topics.push({ score: score, t: t });
        // how often the word appears decides which topics come first
        var count = 0, hits = [];
        t.sections.forEach(function (s) {
          var at = s._text.indexOf(q);
          if (at < 0) return;
          count += s._text.split(q).length - 1;
          if (hits.length < 2) hits.push({ t: t, s: s, at: at });
        });
        if (hits.length) inside.push({ count: count, hits: hits });
      });
      topics.sort(function (a, b) { return b.score - a.score; });
      inside.sort(function (a, b) { return b.count - a.count; });
      var first = inside.map(function (x) { return x.hits[0]; });
      var second = inside.filter(function (x) { return x.hits[1]; }).map(function (x) { return x.hits[1]; });
      return topics.slice(0, 5).concat(first, second).slice(0, 8);
    }

    // text with the matching part wrapped in <mark>
    function marked(text, q) {
      var frag = document.createDocumentFragment();
      var at = text.toLowerCase().indexOf(q);
      if (at < 0) { frag.append(text); return frag; }
      var m = document.createElement('mark');
      m.textContent = text.slice(at, at + q.length);
      frag.append(text.slice(0, at), m, text.slice(at + q.length));
      return frag;
    }
    function snippet(text, at, q) {
      var start = Math.max(0, at - 45), end = Math.min(text.length, at + q.length + 75);
      var s = text.slice(start, end);
      if (start > 0) s = '…' + s.slice(s.indexOf(' ') + 1);
      if (end < text.length) s = s.slice(0, s.lastIndexOf(' ')) + '…';
      return s;
    }

    function open(show) {
      list.hidden = !show;
      gInput.setAttribute('aria-expanded', String(show));
      if (!show) { active = -1; gInput.removeAttribute('aria-activedescendant'); }
    }
    function setActive(n) {
      if (!rows.length) return;
      active = (n + rows.length) % rows.length;
      rows.forEach(function (a, i) {
        a.parentNode.classList.toggle('active', i === active);
        a.parentNode.setAttribute('aria-selected', String(i === active));
      });
      gInput.setAttribute('aria-activedescendant', rows[active].parentNode.id);
      rows[active].parentNode.scrollIntoView({ block: 'nearest' });
    }
    function render() {
      var q = gInput.value.trim().toLowerCase();
      list.textContent = '';
      rows = [];
      active = -1;
      if (q.length < 2) return open(false);
      var res = find(q);
      if (!res.length) {
        var none = document.createElement('li');
        none.className = 'gs-empty';
        none.textContent = 'No topics match “' + gInput.value.trim() + '”.';
        list.appendChild(none);
      }
      res.forEach(function (r, n) {
        var li = document.createElement('li');
        li.id = 'gs-' + n;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        var a = document.createElement('a');
        a.tabIndex = -1;
        a.href = root + 'topics/' + r.t.id + '.html' + (r.s ? '#s-' + r.s.key : '');
        var title = document.createElement('span');
        title.className = 'gs-title';
        title.appendChild(marked(r.t.title, q));
        var sub = document.createElement('span');
        sub.className = 'gs-sub';
        sub.textContent = r.s ? 'In: ' + r.s.label : [r.t.track, r.t.category].filter(Boolean).join(' · ');
        a.appendChild(title);
        a.appendChild(sub);
        if (r.s) {
          var snip = document.createElement('span');
          snip.className = 'gs-snip';
          snip.appendChild(marked(snippet(r.s.text, r.at, q), q));
          a.appendChild(snip);
        }
        a.addEventListener('click', function () { open(false); gInput.blur(); });
        li.appendChild(a);
        list.appendChild(li);
        rows.push(a);
      });
      open(true);
    }
    function update() {
      if (gInput.value.trim().length < 2) return open(false);
      withIndex(render);
    }

    gInput.addEventListener('input', update);
    gInput.addEventListener('focus', update);
    gInput.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) update(); else setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (!list.hidden) setActive(active - 1); }
      else if (e.key === 'Enter') {
        var go = rows[active >= 0 ? active : 0];
        if (go && !list.hidden) { e.preventDefault(); go.click(); }
      }
      else if (e.key === 'Escape') {
        if (!list.hidden) open(false);
        else { gInput.value = ''; gInput.blur(); }
      }
    });
    document.addEventListener('click', function (e) {
      if (!list.hidden && !e.target.closest('.gsearch')) open(false);
    });
    document.addEventListener('keydown', function (e) {
      var typing = /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName || '');
      var slash = e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey;
      var cmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      if (slash || cmdK) { e.preventDefault(); gInput.focus(); gInput.select(); }
    });
  })();

  /* ---------- things that depend on progress ---------- */
  var painters = [];
  function paint() {
    all('[data-dot]').forEach(function (d) { d.className = 'dot ' + statusOf(d.getAttribute('data-dot')); });
    painters.forEach(function (fn) { fn(); });
  }
  // keep several open tabs in step
  window.addEventListener('storage', function (e) {
    if (e.key === LS_PROGRESS) { progress = load(LS_PROGRESS, {}) || {}; paint(); }
  });

  /* ---------- listen: read a page out loud ----------
       The browser's own speech engine does the talking, so there are no audio
       files, no keys and nothing to pay for. The work here is turning a page
       into something worth listening to:
         - diagrams are read from their aria-label, because on this site a
           diagram replaces prose rather than decorating it, so skipping one
           would drop real content;
         - tables are read row by row as "heading: value", which is how these
           topics carry their numbers;
         - code blocks are announced and skipped. SQL read aloud is noise.
       Each sentence is its own utterance. That keeps pause and skip responsive,
       and keeps Chrome from cutting off long ones. */
  function setupListen(opt) {
    var synth = window.speechSynthesis;
    var listenBtn = $('listenBtn');
    if (!listenBtn || !synth || !('SpeechSynthesisUtterance' in window)) return;
    (function () {
      var article = opt.article, secs = opt.secs, id = opt.id;
      var WORD = opt.word || 'Section';
      var root = document.documentElement;
      var toggleBtn = $('playToggle'), prevBtn = $('playPrev'), nextBtn = $('playNext');
      var stopBtn = $('playStop'), whereEl = $('playWhere');
      var rateEl = $('playRate'), rateVal = $('playRateVal'), voiceSel = $('playVoice');
      var LS_LISTEN = 'sd-hub-listen', LS_LISTEN_AT = 'sd-hub-listen-at';
      var MINR = 0.7, MAXR = 1.8, LONG = 190;
      var chunks = [], idx = -1, gen = 0;
      var playing = false, held = false;
      var rate = 1, voiceId = '', voices = [];
      var markEl = null, markSec = -1, followUntil = 0, utterAt = 0;

      var CFGV = 2;
      var cfg = load(LS_LISTEN, {});
      if (typeof cfg.rate === 'number' && cfg.rate >= MINR && cfg.rate <= MAXR) rate = cfg.rate;
      /* Version 1 defaulted to the first local voice, which on a Mac can be a
         novelty one. Drop a v1 choice so the ranking above gets a say; anything
         chosen since is kept. */
      if (cfg.v === CFGV && typeof cfg.voice === 'string') voiceId = cfg.voice;
      function saveCfg() { save(LS_LISTEN, { v: CFGV, rate: rate, voice: voiceId }); }

      /* ---- turning markup into something speakable ---- */

      var UNITS = { KB: 'kilobytes', MB: 'megabytes', GB: 'gigabytes', TB: 'terabytes', PB: 'petabytes' };

      function say(t) {
        return String(t)
          .replace(/×/g, ' times ')
          .replace(/÷/g, ' divided by ')
          .replace(/→/g, ' to ')
          .replace(/−/g, ' minus ')
          .replace(/≈/g, ' about ')
          .replace(/[—–]/g, ', ')
          .replace(/…/g, '. ')
          .replace(/₹/g, ' rupees ')
          .replace(/[“”‘’]/g, "'")
          .replace(/[✓✔]/g, ' yes ')
          .replace(/(\d)\s*\/\s*s\b/g, '$1 per second')
          .replace(/(\d)\s*(KB|MB|GB|TB|PB)\b/g, function (m, n, u) { return n + ' ' + UNITS[u]; })
          .replace(/(\d)\s*ms\b/g, '$1 milliseconds')
          .replace(/(\d)\s+s\b/g, '$1 seconds')
          .replace(/(\d)m\b/g, '$1 million')
          .replace(/(\d)bn\b/g, '$1 billion')
          .replace(/\b(\d[\d,]*)\s*:\s*(\d[\d,]*)\b/g, '$1 to $2')
          .replace(/\s+/g, ' ')
          .trim();
      }
      /* An identifier read letter by letter is painful, so loosen it up first. */
      function codeSay(t) {
        return ' ' + String(t).replace(/[{}`]/g, '').replace(/_/g, ' ')
          .replace(/\//g, ' slash ').replace(/-/g, ' ') + ' ';
      }
      function textOf(el) {
        var out = '';
        Array.prototype.slice.call(el.childNodes).forEach(function (n) {
          if (n.nodeType === 3) { out += n.nodeValue; return; }
          if (n.nodeType !== 1) return;
          var tag = n.tagName.toLowerCase();
          if (tag === 'svg' || tag === 'button') return;
          if (tag === 'sup') { out += ' to the power ' + n.textContent + ' '; return; }
          if (tag === 'code') { out += codeSay(n.textContent); return; }
          out += textOf(n);
        });
        return out;
      }
      /* One sentence per utterance, and a very long one broken at a comma. */
      function cut(t) {
        var out = [], parts = [];
        if (!t) return out;
        t.replace(/([.!?])\s+/g, '$1\u0001').split('\u0001').forEach(function (p) {
          p = p.trim();
          while (p.length > LONG) {
            var at = p.lastIndexOf(', ', LONG);
            if (at < 60) at = p.lastIndexOf(' ', LONG);
            if (at < 40) break;
            parts.push(p.slice(0, at + 1).trim());
            p = p.slice(at + 1).trim();
          }
          if (p) parts.push(p);
        });
        /* Pack short sentences back together up to the same cap. One utterance
           per full stop makes the engine stop dead at every one of them; giving
           it a paragraph's worth lets it carry the phrasing across, which is
           most of what makes it sound stilted. The highlight is per block, so
           nothing is lost by grouping. */
        var buf = '';
        parts.forEach(function (p) {
          if (!buf) { buf = p; return; }
          if (buf.length + 1 + p.length <= LONG) { buf += ' ' + p; return; }
          out.push(buf);
          buf = p;
        });
        if (buf) out.push(buf);
        return out;
      }

      function push(el, sec, text) { if (text) chunks.push({ el: el, sec: sec, text: text }); }

      /* the blocks of one section, in reading order, without their nested parts */
      function blocksOf(box) {
        if (!box) return [];
        var list = all('p, h4, ul, ol, pre, table, .diagram, div.note', box);
        return list.filter(function (el) {
          for (var i = 0; i < list.length; i++) {
            if (list[i] !== el && list[i].contains(el)) return false;
          }
          return true;
        });
      }
      function addTable(tbl, sec) {
        var rows = all('tr', tbl);
        if (!rows.length) return;
        var head = all('th', rows[0]).map(function (th) { return say(textOf(th)); });
        push(rows[0], sec, 'Table.');
        rows.forEach(function (tr) {
          var cells = all('td', tr);
          if (!cells.length) return;
          var line = cells.map(function (td, n) {
            var v = say(textOf(td));
            return head[n] ? head[n] + ': ' + v : v;
          }).join('. ');
          cut(line).forEach(function (s) { push(tr, sec, s); });
        });
      }
      function addBlock(el, sec) {
        var tag = el.tagName.toLowerCase();
        if (el.classList.contains('diagram')) {
          var svg = el.querySelector('svg');
          var label = svg ? (svg.getAttribute('aria-label') || '') : '';
          if (!label) return;
          cut(say('Diagram: ' + label)).forEach(function (s) { push(el, sec, s); });
          return;
        }
        if (tag === 'pre') { push(el.parentNode || el, sec, 'Code block, on the screen.'); return; }
        if (tag === 'table') { addTable(el, sec); return; }
        if (tag === 'ul' || tag === 'ol') {
          all('li', el).forEach(function (li) {
            if (li.parentNode !== el) return;
            cut(say(textOf(li))).forEach(function (s) { push(li, sec, s); });
          });
          return;
        }
        cut(say(textOf(el))).forEach(function (s) { push(el, sec, s); });
      }
      function build() {
        chunks = [];
        var h1 = article.querySelector('h1');
        var intro = article.querySelector('.topic-intro');
        if (h1) push(h1, null, say(h1.textContent));
        if (intro) cut(say(textOf(intro))).forEach(function (s) { push(intro, null, s); });
        secs.forEach(function (d, n) {
          var sum = d.querySelector('summary');
          var title = d.querySelector('.sec-title');
          push(sum, d, WORD + ' ' + (n + 1) + '. ' + say(title ? title.textContent : ''));
          blocksOf(d.querySelector('.sec-body')).forEach(function (el) { addBlock(el, d); });
        });
      }

      /* ---- following along on screen ---- */

      function openSec(d) { if (d && !d.open) opt.open(d); }
      function mark(el) {
        if (markEl === el) return;
        if (markEl) markEl.classList.remove('speaking');
        markEl = el;
        if (markEl) markEl.classList.add('speaking');
      }
      function follow(el) {
        if (!el || Date.now() < followUntil) return;   // the reader just scrolled; leave them alone
        var r = el.getBoundingClientRect();
        if (r.top > 120 && r.bottom < window.innerHeight - 150) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      function paintWhere() {
        var c = chunks[idx];
        var n = c && c.sec ? secs.indexOf(c.sec) + 1 : 0;
        whereEl.textContent = n ? WORD + ' ' + n + ' of ' + secs.length : 'Intro';
      }
      function paintRate() {
        rateEl.value = rate;
        rateVal.textContent = rate.toFixed(1) + '×';
      }

      /* ---- where we got to, per topic ---- */

      function remember() {
        var c = chunks[idx], n = c && c.sec ? secs.indexOf(c.sec) : -1;
        if (n === markSec) return;              // only write when the section changes
        markSec = n;
        var at = load(LS_LISTEN_AT, {});
        at[id] = idx;
        save(LS_LISTEN_AT, at);
      }
      function forget() {
        var at = load(LS_LISTEN_AT, {});
        delete at[id];
        save(LS_LISTEN_AT, at);
        markSec = -1;
      }
      function savedIdx() {
        var at = load(LS_LISTEN_AT, {})[id];
        return (typeof at === 'number' && at > 0 && at < chunks.length) ? at : 0;
      }

      /* ---- voices ---- */

      function voiceById(vid) {
        for (var i = 0; i < voices.length; i++) {
          if ((voices[i].voiceURI || voices[i].name) === vid) return voices[i];
        }
        return null;
      }
      /* macOS ships a pile of novelty voices (Bubbles, Zarvox, Bad News). They
         stay in the list, at the bottom, but are never picked for you. */
      var JOKE = /^(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|junior|organ|pipe organ|princess|superstar|trinoids|whisper|wobble|zarvox|grandma|grandpa|eddy|flo|reed|rocko|sandy|shelley|kathy|ralph|fred|bruce|agnes|victoria)\b/i;
      var PLAIN = /^(samantha|daniel|karen|moira|tessa|rishi|alex|ava|allison|susan|tom|serena|fiona|nicky|aaron|zoe|evan|joelle|nathan|noelle)\b/i;
      var TIER = ['novelty', '', '', 'online', 'enhanced', 'natural'];

      /* How human a voice is likely to sound. It goes on the name the engine
         reports, so it is a guess, but a reliable one. */
      function grade(v) {
        var n = v.name || '';
        if (/natural|neural/i.test(n)) return 5;      // Edge's free neural voices
        if (/premium|enhanced/i.test(n)) return 4;    // the macOS extra downloads
        if (/^google/i.test(n)) return 3;             // Chrome's online voices
        if (PLAIN.test(n)) return 2;                  // the decent built-in ones
        if (JOKE.test(n)) return 0;
        return 1;
      }
      function fillVoices() {
        var allV = synth.getVoices() || [];
        if (!allV.length) return;
        var en = allV.filter(function (v) { return /^en/i.test(v.lang); });
        voices = (en.length ? en : allV).slice().sort(function (a, b) {
          return grade(b) - grade(a) || a.name.localeCompare(b.name);
        });
        voiceSel.textContent = '';
        voices.forEach(function (v) {
          var o = document.createElement('option');
          var tier = TIER[grade(v)];
          o.value = v.voiceURI || v.name;
          o.textContent = v.name.replace(/\s*\(.*\)$/, '').replace(/^(Microsoft|Google)\s+/, '') +
            (tier ? ' · ' + tier : '');
          voiceSel.appendChild(o);
        });
        if (!voiceById(voiceId)) {
          // the best there is, and never a novelty voice unless nothing else exists
          var best = voices.filter(function (v) { return grade(v) >= 2; })[0] || voices[0];
          voiceId = best ? (best.voiceURI || best.name) : '';
        }
        voiceSel.value = voiceId;
      }
      fillVoices();
      // Chrome fills the list asynchronously, so it is usually empty on the first ask
      if (typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', fillVoices);
      else synth.onvoiceschanged = fillVoices;

      /* ---- playing ---- */

      function speakAt(i) {
        if (i < 0) i = 0;
        if (i >= chunks.length) return finishAll();
        var mine = ++gen;
        idx = i;
        remember();
        var c = chunks[i];
        openSec(c.sec);
        mark(c.el);
        follow(c.el);
        paintWhere();
        var u = new SpeechSynthesisUtterance(c.text);
        u.rate = rate;
        var v = voiceById(voiceId);
        if (v) { u.voice = v; u.lang = v.lang; }
        u.onend = function () {
          if (mine !== gen || !playing || held) return;
          speakAt(idx + 1);
        };
        u.onerror = function (e) {
          if (mine !== gen || !playing || held) return;
          if (e && (e.error === 'interrupted' || e.error === 'canceled')) return;
          speakAt(idx + 1);              // one bad sentence should not end the session
        };
        utterAt = Date.now();
        synth.speak(u);
      }
      function start(from) {
        if (!chunks.length) build();
        if (!chunks.length) return;
        // listening and auto scroll would both be moving the page
        var ss = $('scrollStop');
        if (ss && root.hasAttribute('data-autoscroll')) ss.click();
        playing = true;
        held = false;
        root.setAttribute('data-listen', 'on');
        listenBtn.setAttribute('aria-pressed', 'true');
        toggleBtn.setAttribute('aria-label', 'Pause');
        gen++;
        synth.cancel();
        speakAt(typeof from === 'number' ? from : savedIdx());
      }
      /* pause() is unreliable on Android and iOS, so holding drops the current
         sentence and playing starts it again. One sentence repeated is a far
         smaller annoyance than a pause that never resumes. */
      function hold() {
        held = true;
        gen++;
        synth.cancel();
        root.setAttribute('data-listen', 'hold');
        toggleBtn.setAttribute('aria-label', 'Play');
      }
      function unhold() {
        held = false;
        root.setAttribute('data-listen', 'on');
        toggleBtn.setAttribute('aria-label', 'Pause');
        speakAt(idx < 0 ? 0 : idx);
      }
      function stop() {
        playing = false;
        held = false;
        gen++;
        synth.cancel();
        root.removeAttribute('data-listen');
        listenBtn.setAttribute('aria-pressed', 'false');
        mark(null);
      }
      function finishAll() { stop(); forget(); }

      function secStart(sec) {
        for (var i = 0; i < chunks.length; i++) if (chunks[i].sec === sec) return i;
        return 0;
      }
      /* Back goes to the top of the section you are in, unless you are already
         there, in which case it goes to the one before. Same as any music player. */
      function jump(dir) {
        var c = chunks[idx] || chunks[0];
        if (!c) return;
        var cur = c.sec ? secs.indexOf(c.sec) : -1, target;
        if (dir < 0) {
          var top = c.sec ? secStart(c.sec) : 0;
          target = idx > top + 1 ? top : (cur <= 0 ? 0 : secStart(secs[cur - 1]));
        } else {
          if (cur + 1 >= secs.length) return finishAll();
          target = secStart(secs[cur + 1]);
        }
        gen++;
        synth.cancel();
        held = false;
        root.setAttribute('data-listen', 'on');
        toggleBtn.setAttribute('aria-label', 'Pause');
        speakAt(target);
      }

      /* ---- wiring ---- */

      paintRate();
      listenBtn.addEventListener('click', function () { if (playing) stop(); else start(); });
      toggleBtn.addEventListener('click', function () {
        if (!playing) return start();
        if (held) unhold(); else hold();
      });
      stopBtn.addEventListener('click', function () { stop(); });
      prevBtn.addEventListener('click', function () { jump(-1); });
      nextBtn.addEventListener('click', function () { jump(1); });

      /* A new speed only reaches the engine on the next sentence, so the current
         one is restarted at the new speed. */
      rateEl.addEventListener('input', function () {
        rate = Number(rateEl.value);
        paintRate();
        saveCfg();
      });
      rateEl.addEventListener('change', function () {
        if (playing && !held) { gen++; synth.cancel(); speakAt(idx); }
      });
      voiceSel.addEventListener('change', function () {
        voiceId = voiceSel.value;
        saveCfg();
        if (playing && !held) { gen++; synth.cancel(); speakAt(idx); }
      });

      // turning auto scroll on while listening stops the listening instead
      var sBtn = $('scrollBtn');
      if (sBtn) sBtn.addEventListener('click', function () {
        if (playing && root.hasAttribute('data-autoscroll')) stop();
      });

      // scrolling by hand means "I want to look at something": stop following for a bit
      ['wheel', 'touchmove'].forEach(function (type) {
        window.addEventListener(type, function () {
          if (playing) followUntil = Date.now() + 6000;
        }, { passive: true });
      });

      document.addEventListener('keydown', function (e) {
        var t = e.target;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
        if (e.key === 'l' || e.key === 'L') { if (playing) stop(); else start(); }
        else if (e.key === 'Escape' && playing) stop();
      });

      /* Chrome stops a single utterance after about 15 seconds. Sentences are
         short enough that it almost never bites; this catches the long ones. */
      setInterval(function () {
        if (!playing || held || !synth.speaking) return;
        if (Date.now() - utterAt < 10000) return;
        synth.pause();
        synth.resume();
      }, 4000);

      // the engine lives outside the page, so it keeps talking unless we stop it
      window.addEventListener('pagehide', function () { synth.cancel(); });
      window.addEventListener('beforeunload', function () { synth.cancel(); });
    })();
  }

  var page = document.body.getAttribute('data-page');

  /* =================== HOME =================== */
  if (page === 'home') {
    var docRoot = document.documentElement;
    var cards = all('.topic-card');
    var tracks = all('.track');
    var search = $('search');
    var filter = 'all';
    var selected = null;   // the track whose topics are showing, or null for the tiles
    var index = {};
    prepIndex();
    (window.HUB_INDEX || []).forEach(function (t) { index[t.id] = t; });
    function isDone(c) { return statusOf(c.getAttribute('data-id')) === 'done'; }

    var last = load(LS_LAST, null);
    var cont = $('continue');
    if (cont && last && last.id && index[last.id]) {
      cont.href = 'topics/' + last.id + '.html';
      cont.textContent = 'Continue: ' + index[last.id].title + ' →';
      cont.hidden = false;
    }

    /* The home page shows only the track tiles. Picking a track (#t-<id>) shows its topics. */
    function route() {
      var m = /^#t-(.+)$/.exec(location.hash || '');
      var target = m ? document.getElementById('track-' + m[1]) : null;
      selected = target && target.classList.contains('track') ? target : null;
      if (selected) docRoot.setAttribute('data-home', 'list'); else docRoot.removeAttribute('data-home');
      tracks.forEach(function (tr) { tr.classList.toggle('is-selected', tr === selected); });
      all('.track-nav a').forEach(function (a) {
        if (selected && a.getAttribute('href') === '#t-' + selected.id.replace(/^track-/, '')) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      if (search) search.value = '';
      paint();
      // start at the top of the list, not wherever the browser jumped to
      if (selected) window.scrollTo({ top: 0, behavior: 'instant' });
    }
    var allLink = $('allTracks');
    if (allLink) allLink.addEventListener('click', function (e) {
      e.preventDefault();
      try { history.pushState(null, '', location.pathname + location.search); } catch (err) { location.hash = ''; }
      route();
      window.scrollTo(0, 0);
    });
    window.addEventListener('hashchange', route);
    window.addEventListener('popstate', route);

    /* tiles and track headers: how much of each track is done */
    painters.push(function () {
      cards.forEach(function (c) { c.querySelector('select').value = statusOf(c.getAttribute('data-id')); });
      all('.track-tile[data-track]').forEach(function (tile) {
        var sec = document.getElementById('track-' + tile.getAttribute('data-track'));
        var inside = sec ? all('.topic-card', sec) : [];
        if (!inside.length) return;
        var d = inside.filter(isDone).length;
        tile.querySelector('.tile-bar span').style.width = (d / inside.length * 100) + '%';
        tile.querySelector('.tile-done').textContent = d + ' of ' + inside.length + ' completed';
      });
      tracks.forEach(function (tr) {
        var inside = all('.topic-card', tr);
        var cnt = tr.querySelector('.track-count');
        if (!cnt || !inside.length) return;
        var d = inside.filter(isDone).length;
        cnt.textContent = inside.length + (inside.length === 1 ? ' topic' : ' topics') + (d ? ' · ' + d + ' completed' : '');
      });
    });

    /* the topics of the picked track: progress, status filter, text filter */
    painters.push(function () {
      var nm = $('noMatch');
      if (!search) return;
      var inside = selected ? all('.topic-card', selected) : [];
      var total = inside.length;
      all('.controls, .progress-row').forEach(function (x) { x.hidden = !total; });
      if (!total) { nm.hidden = true; return; }

      var done = 0, prog = 0;
      inside.forEach(function (c) {
        var s = statusOf(c.getAttribute('data-id'));
        if (s === 'done') done++; else if (s === 'progress') prog++;
      });
      $('barDone').style.width = (done / total * 100) + '%';
      $('barProg').style.width = (prog / total * 100) + '%';
      $('progressText').textContent = done + ' of ' + total + ' completed, ' + prog + ' in progress';

      var q = search.value.trim().toLowerCase();
      var shown = 0;
      inside.forEach(function (c) {
        var id = c.getAttribute('data-id');
        var hitsEl = c.querySelector('.hits');
        hitsEl.hidden = true; hitsEl.textContent = '';
        var ok = filter === 'all' || statusOf(id) === filter;
        if (ok && q) {
          var hits = ((index[id] || {}).sections || []).filter(function (s) { return s._text.indexOf(q) >= 0; });
          ok = c.getAttribute('data-text').indexOf(q) >= 0 || hits.length > 0;
          if (hits.length) {
            hitsEl.append('Found in:');
            hits.slice(0, 4).forEach(function (s) {
              var a = document.createElement('a');
              a.href = 'topics/' + id + '.html#s-' + s.key;
              a.textContent = s.label;
              hitsEl.appendChild(a);
            });
            if (hits.length > 4) hitsEl.append('+' + (hits.length - 4) + ' more');
            hitsEl.hidden = false;
          }
        }
        c.hidden = !ok;
        if (ok) shown++;
      });
      nm.hidden = shown > 0;
      if (!shown) nm.textContent = q
        ? 'No topics here match “' + search.value.trim() + '”. Try another word, or use the search box at the top to look in every track.'
        : 'No topics with this status in this track yet.';
    });

    /* grid / list view */
    var viewBtns = all('.view-btn');
    function setView(v) {
      if (v === 'list') docRoot.setAttribute('data-view', 'list');
      else docRoot.removeAttribute('data-view');
      viewBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === v)); });
    }
    viewBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-view');
        setView(v);
        try { localStorage.setItem(LS_VIEW, v); } catch (e) {}
      });
    });
    setView(docRoot.getAttribute('data-view') === 'list' ? 'list' : 'grid');

    if (search) {
      search.addEventListener('input', paint);
      all('.chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          filter = chip.getAttribute('data-filter');
          all('.chip').forEach(function (x) { x.setAttribute('aria-pressed', String(x === chip)); });
          paint();
        });
      });
      cards.forEach(function (c) {
        var sel = c.querySelector('select');
        sel.addEventListener('change', function () { setStatus(c.getAttribute('data-id'), sel.value); });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && e.target === search) { search.value = ''; paint(); }
      });
    }
    route();
  }

  /* =================== TOPIC =================== */
  if (page === 'topic') {
    var id = document.body.getAttribute('data-topic');
    var article = $('article');
    var secs = all('details.sec', article);
    var statusBtns = all('.status-btn', article);
    var finish = $('finishBtn');

    save(LS_LAST, { id: id });

    statusBtns.forEach(function (b) {
      b.addEventListener('click', function () { setStatus(id, b.getAttribute('data-s')); });
    });
    finish.addEventListener('click', function () {
      setStatus(id, statusOf(id) === 'done' ? 'progress' : 'done');
    });
    painters.push(function () {
      var s = statusOf(id);
      statusBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-s') === s)); });
      finish.setAttribute('aria-pressed', String(s === 'done'));
      finish.textContent = s === 'done' ? '✓ ' + LABEL.done : 'Mark as completed';
    });

    /* Folded sections open by themselves as the reader scrolls to them.
       A section the reader folded by hand stays folded until they open it again. */
    var closedByHand = {};
    var autoPausedUntil = 0;    // set while a jump to a section is still scrolling
    var scrolled = false;
    var lastY = window.scrollY;
    function pauseAuto() { autoPausedUntil = Date.now() + 2000; }
    function resumeAuto() { autoPausedUntil = 0; }
    function autoOpen() {
      var y = window.scrollY, dy = y - lastY;
      lastY = y;
      if (!dy || Date.now() < autoPausedUntil) return;
      var d, r, n;
      if (dy > 0) {
        // Scrolling down. A folded section whose title is on screen, or about to come up from
        // below, opens downwards. Nothing above it moves. Measured one at a time, in page
        // order, because opening one pushes the next ones down and out of range.
        for (n = 0; n < secs.length; n++) {
          d = secs[n];
          if (d.open || closedByHand[d.id]) continue;
          r = d.getBoundingClientRect();
          if (r.top >= -5 && r.top < window.innerHeight + 120) {
            d.classList.add('auto-open');
            d.open = true;
          }
        }
      } else {
        // Scrolling up. A folded section just above the screen, or in its upper part, opens
        // upwards: the page is moved by the height it gained, so what the reader is looking at
        // stays where it is and they scroll up into the end of that section, as on a page that
        // was never folded. Bottom-most first, so only the nearest one opens.
        for (n = secs.length - 1; n >= 0; n--) {
          d = secs[n];
          if (d.open || closedByHand[d.id]) continue;
          r = d.getBoundingClientRect();
          if (r.bottom > -150 && r.top < window.innerHeight * 0.6) {
            d.classList.add('auto-open');
            d.open = true;
            window.scrollBy({ top: d.getBoundingClientRect().height - r.height, left: 0, behavior: 'instant' });
            lastY = window.scrollY;   // that move was ours, not the reader's
          }
        }
      }
    }
    secs.forEach(function (d) {
      d.querySelector('summary').addEventListener('click', function () {
        // the click toggles the section first; then we note what the reader chose
        setTimeout(function () {
          if (d.open) delete closedByHand[d.id]; else closedByHand[d.id] = true;
        }, 0);
      });
    });
    // any real input from the reader ends the pause straight away
    ['wheel', 'touchmove', 'keydown'].forEach(function (type) {
      window.addEventListener(type, resumeAuto, { passive: true });
    });
    window.addEventListener('scrollend', resumeAuto);

    all('[data-all]', article).forEach(function (b) {
      b.addEventListener('click', function () {
        var open = b.getAttribute('data-all') === 'open';
        secs.forEach(function (d) {
          d.open = open;
          if (open) delete closedByHand[d.id]; else closedByHand[d.id] = true;
        });
      });
    });

    /* jump to a section: open it first, then scroll */
    function goTo(hash, smooth) {
      var target = hash && document.getElementById(hash.slice(1));
      if (!target || target.tagName !== 'DETAILS') return false;
      target.open = true;
      delete closedByHand[target.id];
      pauseAuto();   // don't open the sections the jump passes over, or the target would move
      target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      return true;
    }
    all('#sideSecs a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var hash = a.getAttribute('href');
        if (goTo(hash, true)) {
          e.preventDefault();
          try { history.replaceState(null, '', hash); } catch (err) {}
        }
      });
    });
    window.addEventListener('hashchange', function () { goTo(location.hash, false); });
    if (location.hash) goTo(location.hash, false);

    /* hide or show the sidebar (wide screens only; saved in the browser) */
    var sideBtn = $('sideBtn');
    if (sideBtn) (function () {
      var root = document.documentElement;
      function paintSide() {
        var off = root.getAttribute('data-side') === 'off';
        var label = off ? 'Show sidebar' : 'Hide sidebar';
        sideBtn.setAttribute('aria-expanded', String(!off));
        sideBtn.setAttribute('aria-label', label);
        sideBtn.title = label + ' ( [ )';
      }
      function setSide(off, keep) {
        // the text re-flows when the column changes width, so hold on to the block being read
        var mark = null, was = 0;
        if (keep && window.scrollY > 0) {
          var blocks = all('.sec-body > *, details.sec > summary', article);
          for (var i = 0; i < blocks.length; i++) {
            var r = blocks[i].getBoundingClientRect();
            if (r.height && r.bottom > 70) { mark = blocks[i]; was = r.top; break; }
          }
        }
        if (off) root.setAttribute('data-side', 'off'); else root.removeAttribute('data-side');
        paintSide();
        if (mark) {
          var moved = mark.getBoundingClientRect().top - was;
          if (Math.abs(moved) > 1) { pauseAuto(); window.scrollBy({ top: moved, behavior: 'instant' }); }
        }
      }
      function toggleSide() {
        var off = root.getAttribute('data-side') !== 'off';
        try { localStorage.setItem(LS_SIDEBAR, off ? '0' : '1'); } catch (e) {}
        setSide(off, true);
      }
      paintSide();
      sideBtn.addEventListener('click', toggleSide);
      document.addEventListener('keydown', function (e) {
        if (e.key !== '[' || e.metaKey || e.ctrlKey || e.altKey) return;
        var t = e.target;
        if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
        if (!sideBtn.offsetParent) return;   // narrow screen: there is no sidebar to toggle
        toggleSide();
      });
      window.addEventListener('storage', function (e) {
        if (e.key === LS_SIDEBAR) setSide(e.newValue === '0', false);
      });
    })();

    /* reading bar + highlight the section being read */
    var bar = $('readbar');
    var links = {};
    all('#sideSecs a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var ticking = false;
    function onScroll() {
      ticking = false;
      if (scrolled) { scrolled = false; autoOpen(); }
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + '%';
      var current = null;
      secs.forEach(function (d) { if (d.getBoundingClientRect().top <= 140) current = d.id; });
      Object.keys(links).forEach(function (k) {
        if (k === current) links[k].setAttribute('aria-current', 'true');
        else links[k].removeAttribute('aria-current');
      });
    }
    function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
    window.addEventListener('scroll', function () { scrolled = true; requestTick(); }, { passive: true });
    window.addEventListener('resize', requestTick);
    secs.forEach(function (d) { d.addEventListener('toggle', requestTick); });
    onScroll();

    /* copy buttons on code blocks */
    all('.sec-body pre', article).forEach(function (pre) {
      var wrap = document.createElement('div');
      wrap.className = 'code-wrap';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', function () {
        copyText(pre.textContent, function () {
          btn.textContent = 'Copied';
          setTimeout(function () { btn.textContent = 'Copy'; }, 1400);
        });
      });
      wrap.appendChild(btn);
    });

    setupListen({
      article: article, secs: secs, id: id, word: 'Section',
      open: function (d) {
        delete closedByHand[d.id];
        pauseAuto();              // don't let the jump drag other sections open
        d.open = true;
      }
    });
  }


  /* =================== REVISE A WHOLE TRACK ===================
     One page per track holding every topic's revision list. It is the page you
     open on the morning of an interview: scroll it, filter it, copy it, print
     it, or press L and listen to the lot on the way there. */
  if (page === 'revise') {
    var trackId = document.body.getAttribute('data-track') || '';
    var trackTitle = document.body.getAttribute('data-track-title') || '';
    var box = $('article');
    var rsecs = all('details.sec', box);
    var fInput = $('revFilter'), none = $('revNone');

    // the same progress the rest of the site uses, as a dot per topic
    painters.push(function () {
      rsecs.forEach(function (d) {
        d.setAttribute('data-status', statusOf(d.getAttribute('data-rev-topic')));
      });
    });

    all('[data-all]').forEach(function (b) {
      b.addEventListener('click', function () {
        var open = b.getAttribute('data-all') === 'open';
        rsecs.forEach(function (d) { d.open = open; });
      });
    });

    /* Filtering keeps the markup intact: matches are wrapped in <mark> by
       walking text nodes, so the <code> and <strong> inside a point survive. */
    function unmark(el) {
      all('mark', el).forEach(function (m) {
        m.parentNode.replaceChild(document.createTextNode(m.textContent), m);
      });
      el.normalize();
    }
    function markIn(el, q) {
      var walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      var hits = [], n;
      while ((n = walk.nextNode())) {
        if (n.nodeValue.toLowerCase().indexOf(q) >= 0) hits.push(n);
      }
      hits.forEach(function (node) {
        var text = node.nodeValue, low = text.toLowerCase(), at = 0, i;
        var frag = document.createDocumentFragment();
        while ((i = low.indexOf(q, at)) >= 0) {
          if (i > at) frag.appendChild(document.createTextNode(text.slice(at, i)));
          var m = document.createElement('mark');
          m.textContent = text.slice(i, i + q.length);
          frag.appendChild(m);
          at = i + q.length;
        }
        if (at < text.length) frag.appendChild(document.createTextNode(text.slice(at)));
        node.parentNode.replaceChild(frag, node);
      });
    }
    function runFilter() {
      var raw = fInput.value.trim(), q = raw.toLowerCase();
      var shown = 0, points = 0;
      rsecs.forEach(function (d) {
        unmark(d);
        var items = all('li', d);
        var inTitle = !!q && d.querySelector('.sec-title').textContent.toLowerCase().indexOf(q) >= 0;
        var hit = 0;
        items.forEach(function (li) {
          var m = !q || inTitle || li.textContent.toLowerCase().indexOf(q) >= 0;
          li.hidden = !m;
          if (m) hit++;
        });
        var show = !q || inTitle || hit > 0;
        d.hidden = !show;
        if (show) { shown++; points += hit; if (q) { d.open = true; markIn(d, q); } }
      });
      if (!q) { none.hidden = true; return; }
      none.hidden = shown > 0;
      if (!shown) none.textContent = 'Nothing in this track mentions “' + raw + '”.';
    }
    if (fInput) {
      fInput.addEventListener('input', runFilter);
      fInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && fInput.value) { fInput.value = ''; runFilter(); }
      });
    }

    /* Copy what is on screen, so a filtered view copies only what it shows. */
    var copyBtn = $('revCopy');
    if (copyBtn) copyBtn.addEventListener('click', function () {
      var out = [trackTitle + ' — revision', ''];
      rsecs.forEach(function (d, n) {
        if (d.hidden) return;
        out.push((n + 1) + '. ' + d.querySelector('.sec-title').textContent.trim());
        var note = d.querySelector('.note');
        if (note) out.push('   ' + note.textContent.replace(/\s+/g, ' ').trim());
        all('li', d).forEach(function (li) {
          if (li.hidden) return;
          out.push('   - ' + li.textContent.replace(/\s+/g, ' ').trim());
        });
        out.push('');
      });
      copyText(out.join('\n'), function () {
        copyBtn.textContent = 'Copied';
        setTimeout(function () { copyBtn.textContent = 'Copy as text'; }, 1400);
      });
    });

    // printing a folded section would print nothing, so open everything first
    function openAll() { rsecs.forEach(function (d) { d.open = true; }); }
    var printBtn = $('revPrint');
    if (printBtn) printBtn.addEventListener('click', function () { openAll(); window.print(); });
    window.addEventListener('beforeprint', openAll);

    // an empty track has no topics to read, and no listen button in its top bar
    if (rsecs.length) setupListen({
      article: $('revise'), secs: rsecs, id: 'revise-' + trackId, word: 'Topic',
      open: function (d) { d.open = true; }
    });

    var rbar = $('readbar');
    if (rbar) {
      var rTick = false;
      function rPaint() {
        rTick = false;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        rbar.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + '%';
      }
      window.addEventListener('scroll', function () {
        if (!rTick) { rTick = true; requestAnimationFrame(rPaint); }
      }, { passive: true });
      window.addEventListener('resize', rPaint);
      rsecs.forEach(function (d) { d.addEventListener('toggle', rPaint); });
      rPaint();
    }
  }

  paint();
})();
