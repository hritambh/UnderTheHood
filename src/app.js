/* Small script shared by every page. The pages are plain HTML and readable
   without it; this adds progress tracking, search, theme, grid/list view,
   reading mode and reading helpers. */
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
        var text = pre.textContent;
        var done = function () {
          btn.textContent = 'Copied';
          setTimeout(function () { btn.textContent = 'Copy'; }, 1400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, fallback);
        } else fallback();
        function fallback() {
          var ta = document.createElement('textarea');
          ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
      });
      wrap.appendChild(btn);
    });
  }

  paint();
})();
