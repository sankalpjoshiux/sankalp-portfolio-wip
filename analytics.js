/* GA4 behavior tracking. Relies on the gtag() snippet in each page's <head>. */
(() => {
  if (typeof gtag !== 'function') return;

  const path = location.pathname;
  const page = path.split('/').pop().replace('.html', '') || 'home';
  const pageType = page === 'home' ? 'landing' : ['consent-manager', 'meetwell'].includes(page) ? 'experiment' : 'case_study';
  const base = { page_name: page, page_type: pageType };
  const send = (name, params = {}) => { try { gtag('event', name, { ...base, ...params }); } catch (_) {} };
  const text = (el, max = 80) => (el?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, max);
  const once = (set, key) => (set.has(key) ? false : (set.add(key), true));

  send('page_context');

  /* Clicks: projects, navigation, outbound, email, theme toggle, back/next links. */
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button');
    if (!target) return;
    if (target.id === 'theme-toggle') {
      send('theme_toggle', { to_theme: document.body.classList.contains('dark') ? 'light' : 'dark' });
      return;
    }
    if (target.closest('.carousel-controls')) {
      send('carousel_control', { direction: target.hasAttribute('data-next') ? 'next' : 'prev' });
      return;
    }
    if (target.closest('.carousel-tabs')) {
      send('carousel_chapter', { chapter: text(target) });
      return;
    }
    if (target.tagName !== 'A') return;
    const href = target.getAttribute('href') || '';
    const label = text(target) || target.getAttribute('aria-label') || href;
    const tile = target.closest('.project, .independent-card');
    const where = target.closest('header') ? 'header' : target.closest('footer') ? 'footer' : tile ? 'work_tile' : target.closest('.case-next') ? 'case_next' : 'body';
    if (tile) {
      send('project_click', { project_url: href, project_title: text(tile.querySelector('h3')), tile_kind: tile.classList.contains('independent-card') ? 'experiment' : 'case_study' });
    } else if (href.startsWith('mailto:')) {
      send('email_click', { link_location: where });
    } else if (/^https?:/i.test(href) && new URL(href, location.href).host !== location.host) {
      send('outbound_click', { link_url: href, link_text: label, link_location: where });
    } else if (href.startsWith('#')) {
      send('anchor_click', { link_text: label, link_target: href, link_location: where });
    } else {
      send('nav_click', { link_url: href, link_text: label, link_location: where });
    }
  }, true);

  /* Scroll depth (25/50/75/100) and time on page. */
  const depths = new Set();
  const onScroll = () => {
    const doc = document.documentElement;
    const pct = ((window.scrollY + innerHeight) / doc.scrollHeight) * 100;
    [25, 50, 75, 100].forEach((d) => { if (pct >= d - 1 && once(depths, d)) send('scroll_depth', { percent: d }); });
  };
  addEventListener('scroll', onScroll, { passive: true });

  const seconds = [15, 30, 60, 120, 240];
  let visible = 0;
  setInterval(() => {
    if (document.visibilityState !== 'visible') return;
    visible += 1;
    if (seconds.includes(visible)) send('time_on_page', { seconds: visible });
  }, 1000);

  /* Sections that actually come into view. */
  const seen = new Set();
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const name = text(el.querySelector('.chapter, .section-heading p, .about-label, h2'), 60) || el.id;
      if (name && once(seen, name)) send('section_view', { section: name });
      sectionObserver.unobserve(el);
    });
  }, { threshold: 0.35 });
  document.querySelectorAll('main section, section[id], .case-content > section').forEach((s) => sectionObserver.observe(s));

  /* Videos: first view, play progress, loops. */
  document.querySelectorAll('video').forEach((video, i) => {
    const name = (video.getAttribute('src') || '').split('/').pop().split('?')[0] || `video_${i}`;
    const marks = new Set();
    let viewed = false;
    let loops = 0;
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !viewed) { viewed = true; send('video_view', { video_name: name }); }
      });
    }, { threshold: 0.5 }).observe(video);
    video.addEventListener('timeupdate', () => {
      if (!video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      [25, 50, 75].forEach((m) => { if (pct >= m && once(marks, m)) send('video_progress', { video_name: name, percent: m }); });
    });
    video.addEventListener('ended', () => { loops += 1; marks.clear(); if (loops <= 3) send('video_loop', { video_name: name, loops }); });
  });

  /* Carousel slides: report each slide the viewer lands on. */
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const count = root.querySelector('[data-count]');
    const slides = [...root.querySelectorAll('.carousel-slide')];
    if (!count) return;
    const shown = new Set();
    new MutationObserver(() => {
      const n = parseInt(count.textContent, 10);
      if (!n || !once(shown, n)) return;
      send('carousel_slide', { slide_number: n, slide_title: text(slides[n - 1]?.querySelector('h3')) });
    }).observe(count, { childList: true, characterData: true, subtree: true });
  });

  /* Images opened, text copied, and exits. */
  document.addEventListener('copy', () => send('copy_text', { length: String(getSelection()).length }));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') send('page_exit', { seconds_visible: visible, max_scroll: Math.max(0, ...depths) });
  });
})();
