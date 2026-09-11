const glow=document.querySelector('.cursor-glow');
const heroArt=document.querySelector('.hero-art');
window.addEventListener('pointermove',e=>glow.style.transform=`translate(${e.clientX}px,${e.clientY}px)`);
heroArt?.addEventListener('pointermove',e=>{const r=heroArt.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;heroArt.querySelector('.agent-stage').style.transform=`rotateX(${y*-8}deg) rotateY(${x*10}deg) translate3d(${x*10}px,${y*10}px,0)`});
heroArt?.addEventListener('pointerleave',()=>heroArt.querySelector('.agent-stage').style.transform='');
document.getElementById('theme-toggle').addEventListener('click',()=>document.body.classList.toggle('dark'));
