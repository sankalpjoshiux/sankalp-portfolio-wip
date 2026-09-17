const glow=document.querySelector('.cursor-glow');
const heroArt=document.querySelector('.hero-art');
if (glow) window.addEventListener('pointermove',e=>glow.style.transform=`translate(${e.clientX}px,${e.clientY}px)`);
heroArt?.addEventListener('pointermove',e=>{const r=heroArt.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;heroArt.querySelector('.agent-stage').style.transform=`rotateX(${y*-8}deg) rotateY(${x*10}deg) translate3d(${x*10}px,${y*10}px,0)`});
heroArt?.addEventListener('pointerleave',()=>heroArt.querySelector('.agent-stage').style.transform='');
const themeToggle = document.getElementById('theme-toggle');
const themeKey = 'sankalp-portfolio-theme';
const themeCookie = 'sankalp-portfolio-theme';
const readTheme = () => {
  try {
    const stored = localStorage.getItem(themeKey);
    if (stored) return stored;
  } catch (_) {}
  return document.cookie.match(/(?:^|; )sankalp-portfolio-theme=(dark|light)/)?.[1];
};
const saveTheme = (theme) => {
  try { localStorage.setItem(themeKey, theme); } catch (_) {}
  document.cookie = `${themeCookie}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
};
const applyTheme = (theme) => {
  const dark = theme === 'dark';
  document.documentElement.classList.toggle('dark', dark);
  document.body.classList.toggle('dark', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  if (themeToggle) themeToggle.setAttribute('aria-pressed', String(dark));
};
applyTheme(readTheme());
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const dark = !document.documentElement.classList.contains('dark');
    const theme = dark ? 'dark' : 'light';
    saveTheme(theme);
    applyTheme(theme);
  });
}

// Use Tabler-style outline arrows for interactive labels instead of text glyphs.
const tablerArrow = (direction) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('icon-tabler');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('d', direction === 'down' ? 'M12 5v14m6-6-6 6-6-6' : direction === 'up-right' ? 'M5 19 19 5m-7 0h7v7' : 'M5 12h14m-6-6 6 6-6 6');
  svg.append(path);
  return svg;
};
const decorateArrows = () => {
  document.querySelectorAll('.scroll-prompt b, .independent-info > b, .line-link b, .contact .email span, .socials a, .project-links a').forEach((element) => {
    const text = element.textContent.trim();
    const glyph = text.endsWith('↗') ? '↗' : text.endsWith('→') ? '→' : text.endsWith('↓') ? '↓' : '';
    if (!glyph || element.dataset.arrowIcon) return;
    element.dataset.arrowIcon = 'true';
    const direction = glyph === '↗' ? 'up-right' : glyph === '↓' ? 'down' : 'right';
    element.querySelectorAll('*').forEach((child) => {
      if (child.tagName === 'svg') child.setAttribute('aria-hidden', 'true');
    });
    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) node.textContent = node.textContent.replace(glyph, '');
    });
    element.append(tablerArrow(direction));
  });
};
decorateArrows();
document.addEventListener('DOMContentLoaded', decorateArrows);
