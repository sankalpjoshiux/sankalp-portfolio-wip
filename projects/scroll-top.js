(() => {
  const script = document.currentScript;
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('scroll-top.css', script.src).href;
  document.head.append(css);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'scroll-top';
  button.setAttribute('aria-label', 'Scroll to top');
  button.tabIndex = -1;
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Scroll to top</span>';
  document.body.append(button);

  const footer = document.querySelector('footer');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;

  const update = () => {
    frame = 0;
    const doc = document.documentElement;
    const remaining = doc.scrollHeight - (window.scrollY + window.innerHeight);
    const scrollable = doc.scrollHeight > window.innerHeight * 1.5;
    const show = scrollable && remaining < Math.min(500, window.innerHeight * 0.6);
    button.classList.toggle('is-visible', show);
    button.tabIndex = show ? 0 : -1;
    const footerShown = footer ? Math.max(0, window.innerHeight - footer.getBoundingClientRect().top) : 0;
    button.style.setProperty('--scroll-top-lift', `${footerShown}px`);
  };

  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    button.blur();
  });
  update();
})();
