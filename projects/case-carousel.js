(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const track = root.querySelector('.carousel-track');
    const slides = [...track.children];
    const tabs = [...root.querySelectorAll('.carousel-tabs [data-chapter]')];
    const prev = root.querySelector('[data-prev]');
    const next = root.querySelector('[data-next]');
    const count = root.querySelector('[data-count]');
    let index = 0;
    let frame = 0;

    const go = (i) => {
      const target = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: slides[target].offsetLeft, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    };

    const render = () => {
      const chapter = slides[index].dataset.chapter;
      tabs.forEach((tab) => {
        if (tab.dataset.chapter === chapter) tab.setAttribute('aria-current', 'true');
        else tab.removeAttribute('aria-current');
      });
      count.textContent = `${index + 1} / ${slides.length}`;
      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;
    };

    track.addEventListener('scroll', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const nearest = Math.round(track.scrollLeft / track.clientWidth);
        if (nearest !== index) {
          index = Math.max(0, Math.min(slides.length - 1, nearest));
          render();
        }
      });
    }, { passive: true });

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => go(slides.findIndex((s) => s.dataset.chapter === tab.dataset.chapter)));
    });
    prev.addEventListener('click', () => go(index - 1));
    next.addEventListener('click', () => go(index + 1));
    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); go(index + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1); }
    });

    render();
  });
})();
