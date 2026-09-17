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
