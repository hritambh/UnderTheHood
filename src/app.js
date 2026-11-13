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
    var cards = all('.topic-card');
    var search = $('search');
    var filter = 'all';
    var index = {};
    (window.HUB_INDEX || []).forEach(function (t) { index[t.id] = t; });

    var last = load(LS_LAST, null);
    var cont = $('continue');
    if (cont && last && last.id && index[last.id]) {
      cont.href = 'topics/' + last.id + '.html';
      cont.textContent = 'Continue: ' + index[last.id].title + ' →';
      cont.hidden = false;
    }

    painters.push(function () {
      var total = cards.length;
      if (!total) return;
      var done = 0, prog = 0;
      cards.forEach(function (c) {
        var s = statusOf(c.getAttribute('data-id'));
        if (s === 'done') done++; else if (s === 'progress') prog++;
        c.querySelector('select').value = s;
      });
      $('barDone').style.width = (done / total * 100) + '%';
      $('barProg').style.width = (prog / total * 100) + '%';
      $('progressText').textContent = done + ' of ' + total + ' completed, ' + prog + ' in progress';

      var q = search.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (c) {
        var id = c.getAttribute('data-id');
        var hitsEl = c.querySelector('.hits');
        hitsEl.hidden = true; hitsEl.textContent = '';
        var ok = filter === 'all' || statusOf(id) === filter;
        if (ok && q) {
          var hits = ((index[id] || {}).sections || []).filter(function (s) { return s.text.indexOf(q) >= 0; });
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
      var narrowed = !!q || filter !== 'all';
      all('.track').forEach(function (tr) {
        var inside = all('.topic-card', tr);
        var visible = inside.filter(function (c) { return !c.hidden; }).length;
        tr.hidden = narrowed && !visible;
        var cnt = tr.querySelector('.track-count');
        if (cnt && inside.length) {
          var d = inside.filter(function (c) { return statusOf(c.getAttribute('data-id')) === 'done'; }).length;
          cnt.textContent = inside.length + (inside.length === 1 ? ' topic' : ' topics') + (d ? ' · ' + d + ' completed' : '');
        }
      });
      var trackNav = document.querySelector('.track-nav');
      if (trackNav) trackNav.hidden = narrowed;
      var nm = $('noMatch');
      nm.hidden = shown > 0;
      if (!shown) nm.textContent = q
        ? 'No topics match “' + search.value.trim() + '”. Try another word or clear the filter.'
        : 'No topics with this status yet.';
    });

    /* grid / list view */
    var viewBtns = all('.view-btn');
    function setView(v) {
      if (v === 'list') document.documentElement.setAttribute('data-view', 'list');
      else document.documentElement.removeAttribute('data-view');
      viewBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === v)); });
    }
    viewBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-view');
        setView(v);
        try { localStorage.setItem(LS_VIEW, v); } catch (e) {}
      });
    });
    setView(document.documentElement.getAttribute('data-view') === 'list' ? 'list' : 'grid');

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
        var typing = /^(INPUT|SELECT|TEXTAREA)$/.test((e.target.tagName || ''));
        if (e.key === '/' && !typing) { e.preventDefault(); search.focus(); search.select(); }
        if (e.key === 'Escape' && e.target === search) { search.value = ''; paint(); }
      });
    }
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

    all('[data-all]', article).forEach(function (b) {
      b.addEventListener('click', function () {
        var open = b.getAttribute('data-all') === 'open';
        secs.forEach(function (d) { d.open = open; });
      });
    });

    /* jump to a section: open it first, then scroll */
    function goTo(hash, smooth) {
      var target = hash && document.getElementById(hash.slice(1));
      if (!target || target.tagName !== 'DETAILS') return false;
      target.open = true;
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

    /* reading bar + highlight the section being read */
    var bar = $('readbar');
    var links = {};
    all('#sideSecs a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var ticking = false;
    function onScroll() {
      ticking = false;
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
    window.addEventListener('scroll', requestTick, { passive: true });
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
