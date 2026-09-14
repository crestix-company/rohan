const menu = document.querySelector('#mobile-menu');
const toggle = document.querySelector('.menu-toggle');
const close = document.querySelector('.menu-close');
if (menu && toggle && close) {
  const finish = () => {toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open');};
  toggle.addEventListener('click', () => {menu.showModal(); toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('menu-open');});
  close.addEventListener('click', () => menu.close());
  menu.addEventListener('close', finish);
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.close()));
  menu.addEventListener('click', event => {if(event.target === menu){const rect=menu.getBoundingClientRect(); if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom) menu.close();}});
}
const motion = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motion.matches) {
  const targets = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {if (entry.isIntersecting) {entry.target.classList.add('revealed'); observer.unobserve(entry.target);}}), {threshold:0.06});
  targets.forEach(target => {target.classList.add('reveal-ready'); observer.observe(target);});
  motion.addEventListener('change', () => {if(motion.matches){targets.forEach(t=>t.classList.add('revealed'));observer.disconnect();}});
}
