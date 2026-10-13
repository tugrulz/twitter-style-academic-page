/* Twitter-style Academic Page by Tuğrulcan Elmas (https://tugrulcan.com) · MIT */
/* Homepage interactions (Verified Human design). The page itself is rendered by Jekyll;
   this adds: expanding paper posts, the publication filters, "Show all publications",
   tab tracking while scrolling, and the verified-badge note. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var TABS = $$('.tab').map(function (t) { return t.dataset.tab; });
  var allPanel = $('#publications'), allBtn = $('#allBtn');

  /* ---------- tabs: scroll to a section, highlight the one in view ---------- */
  var current = null;
  function mark(id) {
    if (id === current) return;
    current = id;
    $$('.tab').forEach(function (t) { if (t.dataset.tab === id) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current'); });
    $$('.side-link, .bb').forEach(function (b) { if (b.dataset.tab === id) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    var tb = $('#tab-' + id), tl = $('#tablist');
    if (tb) tl.scrollLeft = Math.max(0, tb.offsetLeft - (tl.clientWidth - tb.offsetWidth) / 2);
  }
  function spy() {
    var line = Math.min(window.innerHeight / 3, $('#tabbar').offsetHeight + 140), id = TABS[0];
    TABS.forEach(function (t) { if (document.getElementById(t).getBoundingClientRect().top <= line) id = t; });
    // the full publication list belongs to Papers
    if (!allPanel.hidden && allPanel.getBoundingClientRect().top <= line) id = 'papers';
    mark(id);
  }
  window.addEventListener('scroll', spy, { passive: true });

  function setHash(h) { try { history.replaceState(null, '', '#' + h); } catch (e) {} }
  function scrollTo(el) { el.scrollIntoView({ block: 'start' }); }

  /* ---------- all publications (a hidden panel at the bottom) ---------- */
  function expandAll(open, scroll) {
    allPanel.hidden = !open;
    allBtn.setAttribute('aria-expanded', open);
    allBtn.lastChild.textContent = open ? 'Jump to all publications' : allBtn.dataset.label;
    if (scroll) open ? scrollTo(allPanel) : allBtn.scrollIntoView({ block: 'center' });
  }
  allBtn.dataset.label = allBtn.lastChild.textContent;

  /* ---------- "go to" links: stats, Publications button ---------- */
  function go(id) {
    if (id === 'all-papers') expandAll(true);
    var el = document.getElementById(id), rail = document.getElementById('rail-' + id);
    // on wide screens some sections live in the right rail: point at the rail card instead
    if (el && !el.offsetParent && rail && rail.offsetParent) { rail.classList.remove('flash'); void rail.offsetWidth; rail.classList.add('flash'); return; }
    if (el) { scrollTo(el); setHash(id); }
  }

  /* ---------- paper posts: click to show the abstract and links ---------- */
  function toggleTweet(t) {
    var q = $('.tw-quote', t), open = q.getAttribute('aria-expanded') !== 'true';
    q.setAttribute('aria-expanded', open); t.classList.toggle('open', open);
    document.getElementById(q.getAttribute('aria-controls')).hidden = !open;
  }

  /* ---------- publication filters ---------- */
  var F = { theme: 'all', type: 'all', first: false };
  var total = $$('#pubList .pubwrap').length;
  var TAGS = {}; $$('#trends .trend').forEach(function (b) { TAGS[b.dataset.theme] = $('.trend-t', b).textContent; });
  function filter() {
    var shown = 0;
    $$('#pubList .year').forEach(function (y) {
      var n = 0;
      $$('.pubwrap', y).forEach(function (w) {
        var ok = (F.theme === 'all' || w.dataset.topics.split(' ').indexOf(F.theme) > -1) && (F.type === 'all' || w.dataset.type === F.type) && (!F.first || w.dataset.first);
        w.hidden = !ok; if (ok) n++;
      });
      y.hidden = !n; $('.year-h small', y).textContent = n + (n === 1 ? ' paper' : ' papers'); shown += n;
    });
    $('#pubEmpty').hidden = shown > 0;
    $('#pubStatus').textContent = 'Showing ' + shown + ' of ' + total + ' papers' + (F.theme === 'all' ? '' : ' in ' + TAGS[F.theme]) + (F.type === 'all' ? '' : ' · ' + F.type);
    $$('[data-ftheme]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.ftheme === F.theme); });
    $$('[data-ftype]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.ftype === F.type); });
    $$('#trends [data-theme]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.theme === F.theme); });
  }

  /* ---------- clicks ---------- */
  var vBtn = $('#verifiedBtn'), vPop = $('#verifiedPop');
  function toggleVerified(open) { vBtn.setAttribute('aria-expanded', open); vPop.hidden = !open; }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-tab]');
    if (b) { var p = document.getElementById(b.dataset.tab); scrollTo(p); mark(b.dataset.tab); setHash(b.dataset.tab); if (!b.classList.contains('tab')) p.focus({ preventScroll: true }); return; }
    if ((b = e.target.closest('#verifiedBtn'))) { e.stopPropagation(); toggleVerified(vBtn.getAttribute('aria-expanded') !== 'true'); return; }
    if (!vPop.hidden && !e.target.closest('#verifiedPop')) toggleVerified(false);
    if ((b = e.target.closest('[data-goto]'))) { e.preventDefault(); go(b.dataset.goto); return; }
    if ((b = e.target.closest('#allBtn'))) { expandAll(true, true); setHash('all-papers'); return; }
    if ((b = e.target.closest('#allHide'))) { expandAll(false, true); return; }
    if ((b = e.target.closest('[data-ftheme]'))) { F.theme = b.dataset.ftheme; filter(); return; }
    if ((b = e.target.closest('[data-ftype]'))) { F.type = b.dataset.ftype; filter(); return; }
    if ((b = e.target.closest('[data-theme]'))) {
      // hashtags, theme cards and trends filter the full list (clicking the active trend again clears it)
      var id = b.dataset.theme;
      F.theme = (b.closest('#trends') && F.theme === id) ? 'all' : id; F.type = 'all'; filter(); go('all-papers'); return;
    }
    if (!e.target.closest('a, button, input, label, .tw-more') && (b = e.target.closest('[data-tweet]')) && !String(getSelection())) toggleTweet(b);
  });
  document.addEventListener('keydown', function (e) {
    var q = e.target.closest && e.target.closest('.tw-quote[role="button"]');
    if (q && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggleTweet(q.closest('[data-tweet]')); }
    if (e.key === 'Escape' && !vPop.hidden) { toggleVerified(false); vBtn.focus(); }
  });
  document.addEventListener('change', function (e) { if (e.target.id === 'onlyFirst') { F.first = e.target.checked; filter(); } });

  /* ---------- Work with me: a DM that "types" the question, then the answers arrive ---------- */
  var dm = $('#work-with-me'), dmBody = $('.dm-body', dm), draft = $('.dm-draft', dm), typing = $('.typing', dm);
  var steps = $$('[data-step]', dm), timers = [], played = false, lastFocus = null;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function showAll() {
    timers.forEach(clearTimeout); timers = [];
    steps.forEach(function (s) { s.classList.remove('pending'); });
    typing.hidden = true; draft.textContent = '';
  }
  function reveal(n) { steps.forEach(function (s) { if (s.dataset.step === String(n)) s.classList.remove('pending'); }); dmBody.scrollTop = dmBody.scrollHeight; }
  function play() {
    steps.forEach(function (s) { s.classList.add('pending'); });
    var q = $('.dm-msg.out p', dm).textContent, t = 350;
    // the visitor's question types itself into the message box, then sends
    for (var i = 1; i <= q.length; i++) (function (i) { later(function () { draft.textContent = q.slice(0, i); }, t + i * 38); })(i);
    t += q.length * 38 + 350;
    later(function () { draft.textContent = ''; reveal(0); }, t);
    // each answer: a typing indicator, then the message (longer messages take a little longer)
    $$('.dm-msg.in[data-step]', dm).forEach(function (m) {
      var n = m.dataset.step;
      later(function () { typing.hidden = false; dmBody.appendChild(typing); dmBody.scrollTop = dmBody.scrollHeight; }, t += 350);
      later(function () { typing.hidden = true; reveal(n); }, t += Math.min(1100, 400 + m.textContent.length * 2));
    });
  }
  // opening adds a history entry, so the phone's back button closes the DM instead of leaving the page
  function openDM() {
    if (!dm.hidden) return;
    try { history.pushState({ dm: 1 }, ''); } catch (e) {}
    lastFocus = document.activeElement;
    dm.hidden = false; document.body.classList.add('dm-open');
    $('.dm-close', dm).focus();
    if (!played && !calm) play(); else showAll();
    played = true;
  }
  function closeDM(fromBack) {
    if (dm.hidden) return;
    if (!fromBack && history.state && history.state.dm) { history.back(); return; } // popstate closes it
    showAll(); dm.hidden = true; document.body.classList.remove('dm-open');
    if (location.hash === '#work-with-me') { try { history.replaceState(null, '', location.pathname); } catch (e) {} }
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-dm]');
    if (b) { e.preventDefault(); openDM(); return; }
    if (dm.hidden) return;
    if (e.target.closest('.dm-close') || e.target === dm) { e.preventDefault(); closeDM(); return; }
    if (e.target.closest('.dm-body') && !e.target.closest('a')) showAll(); // tap to skip the animation
  }, true);
  window.addEventListener('popstate', function () { if (!dm.hidden) closeDM(true); });
  document.addEventListener('keydown', function (e) {
    if (dm.hidden) return;
    if (e.key === 'Escape') { closeDM(); return; }
    if (e.key === 'Tab') { // keep focus inside the window
      var f = $$('a[href], button', dm).filter(function (x) { return x.offsetParent; }), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- share: each post gets a stable id, and sharing links to the post on this page ---------- */
  function hashId(str) { var h = 5381; for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0; return 'post-' + h.toString(36); }
  var used = {};
  $$('article.post').forEach(function (p) {
    if (p.id) return;
    var t = $('.tw-text', p); if (!t) return;
    var id = hashId(t.textContent.trim()), n = 1;
    while (used[id + (n > 1 ? '-' + n : '')] || document.getElementById(id + (n > 1 ? '-' + n : ''))) n++;
    p.id = id + (n > 1 ? '-' + n : ''); used[p.id] = 1;
  });
  var toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast);
  function say(msg) { toast.textContent = msg; toast.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { toast.classList.remove('on'); }, 2200); }
  // share menu: copy link, X, LinkedIn, and the phone's share sheet where there is one
  var menu = document.createElement('div'); menu.className = 'share-menu'; menu.setAttribute('role', 'menu'); menu.hidden = true; document.body.appendChild(menu);
  var shareData = null, shareBtn = null;
  function closeMenu() { if (menu.hidden) return; menu.hidden = true; if (shareBtn) shareBtn.setAttribute('aria-expanded', 'false'); }
  function openMenu(b) {
    var post = b.closest('article.post'), paper = post.matches('[data-tweet]');
    var text = ($('.tw-text', post) || post).textContent.replace(/\s+/g, ' ').trim();
    var url = location.origin + location.pathname + '#' + post.id; // always the post on this page
    shareData = { title: paper ? $('.embed-t', post).textContent : document.title, text: text.length > 200 ? text.slice(0, 197) + '…' : text, url: url };
    var enc = encodeURIComponent;
    // phones: same-tab links so iOS/Android can hand them to the installed X / LinkedIn app,
    // and the native share sheet (which lists the apps) comes first
    var phone = matchMedia('(pointer: coarse)').matches, tgt = phone ? '' : ' target="_blank"';
    var native = navigator.share ? '<button type="button" role="menuitem" data-share="native">' + ico('share') + 'Share via…</button>' : '';
    menu.innerHTML = (phone ? native : '') +
      '<button type="button" role="menuitem" data-share="copy">' + ico('link') + 'Copy link</button>' +
      '<a role="menuitem"' + tgt + ' rel="noopener" href="https://x.com/intent/post?text=' + enc(shareData.text) + '&url=' + enc(url) + '">' + ico('at') + 'Share on X</a>' +
      '<a role="menuitem"' + tgt + ' rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=' + enc(url) + '">' + ico('brief') + 'Share on LinkedIn</a>' +
      (phone ? '' : native);
    menu.hidden = false; shareBtn = b; b.setAttribute('aria-expanded', 'true');
    var r = b.getBoundingClientRect(), w = menu.offsetWidth, h = menu.offsetHeight;
    var top = r.bottom + 6 + h > innerHeight ? r.top - h - 6 : r.bottom + 6;
    menu.style.top = (top + scrollY) + 'px'; menu.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.right - w) + scrollX) + 'px';
    menu.querySelector('[role="menuitem"]').focus();
  }
  function ico(n) { return '<svg class="ico" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.top = '0'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
    ta.remove(); return ok;
  }
  function copy(text) {
    var done = function () { say('Link copied'); }, fail = function () { if (fallbackCopy(text)) done(); else say('Copy this link: ' + text); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fail); else fail();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.share-btn');
    if (b) { e.preventDefault(); if (!menu.hidden && shareBtn === b) closeMenu(); else openMenu(b); return; }
    var it = e.target.closest('.share-menu [role="menuitem"]');
    if (it) {
      if (it.dataset.share === 'copy') copy(shareData.url);
      else if (it.dataset.share === 'native') navigator.share(shareData).catch(function () {});
      closeMenu(); return;
    }
    closeMenu();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { closeMenu(); if (shareBtn) shareBtn.focus(); } });
  window.addEventListener('resize', closeMenu);

  // opening a link to a post: show it (open the full list if it lives there) and highlight it
  (function () {
    var h = decodeURIComponent((location.hash || '').slice(1)), el = h && /^post-/.test(h) && document.getElementById(h);
    if (!el) return;
    if (allPanel.contains(el)) expandAll(true);
    setTimeout(function () { el.scrollIntoView({ block: 'center' }); el.classList.add('flash-post'); }, 50);
  })();

  /* ---------- trends ranked by paper count ---------- */
  var tr = $('#trends');
  $$('li', tr).sort(function (a, b) { return b.dataset.count - a.dataset.count; }).forEach(function (li, i) { $('.trend-i', li).textContent = i + 1; tr.appendChild(li); });

  /* ---------- start ---------- */
  var h = (location.hash || '').slice(1);
  if (h === 'all-papers' || h === 'publications') { expandAll(true); scrollTo(allPanel); }
  if (h === 'work-with-me') openDM();
  spy();
})();
