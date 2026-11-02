/* Once-only gallery entrances. Content stays visible if animation is unsupported. */
(() => {
  'use strict';
  const home = document.querySelector('.figma-home');
  if (!home || typeof IntersectionObserver === 'undefined') return;
  const cards = [...home.querySelectorAll('.project-card')];
  if (!cards.length || cards.some(card => typeof card.animate !== 'function')) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const preview = new URLSearchParams(location.search).get('motion') === 'on';
  const allowed = () => preview || !preference.matches;
  const seen = new Set();
  const running = new Map();
  function showImmediately(card) {
    seen.add(card);
    observer.unobserve(card);
    card.classList.remove('card-enter-pending');
    running.get(card)?.cancel();
    running.delete(card);
  }
  function enter(card) {
    if (seen.has(card)) return;
    if (!allowed()) { showImmediately(card); return; }
    seen.add(card);
    observer.unobserve(card);
    const previous = card.previousElementSibling;
    const sameRow = previous && Math.abs(previous.offsetTop - card.offsetTop) < 2;
    try {
      const animation = card.animate([
        {opacity:0,transform:'translateY(28px)'},
        {opacity:1,transform:'translateY(0)'}
      ], {duration:600,delay:sameRow ? 100 : 0,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
      running.set(card,animation);
      animation.finished.then(() => {
        card.classList.remove('card-enter-pending');
        running.delete(card);
        animation.cancel();
      }, () => {
        card.classList.remove('card-enter-pending');
        running.delete(card);
      });
    } catch { showImmediately(card); }
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) enter(entry.target);
  }, {threshold:.08,rootMargin:'0px 0px -56px 0px'});
  for (const card of cards) {
    if (allowed()) { card.classList.add('card-enter-pending'); observer.observe(card); }
    else showImmediately(card);
  }
  home.addEventListener('focusin', event => {
    const card = event.target.closest('.project-card');
    if (cards.includes(card)) showImmediately(card);
  });
  preference.addEventListener('change', () => {
    if (!allowed()) cards.forEach(showImmediately);
  });
  window.addEventListener('hashchange', () => {
    if (location.hash.startsWith('#project/')) [...running.keys()].forEach(showImmediately);
  });
})();
