/* Adapted from 首屏 想回来2 推开会自己弹回来.html.
 * Same repulsion / spring / damping; stable layout anchors, bounded frame time,
 * and a sleeping loop keep it usable on touchscreens and off-screen routes. */
(() => {
  'use strict';
  const hero = document.querySelector('.spring-hero');
  if (!hero) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const letters = [...hero.querySelectorAll('.spring-char')].map(anchor => ({
    anchor, glyph: anchor.firstElementChild, x: 0, y: 0, vx: 0, vy: 0
  }));
  let pointer = null, frame = 0, lastTime = 0, visible = false;
  const active = () => visible && !document.hidden && !reduced.matches && !hero.closest('.view').hidden;
  function reset() {
    cancelAnimationFrame(frame); frame = 0; lastTime = 0; pointer = null;
    for (const o of letters) {
      o.x = o.y = o.vx = o.vy = 0;
      o.glyph.style.transform = '';
    }
  }
  function wake() {
    if (!frame && active()) { lastTime = 0; frame = requestAnimationFrame(tick); }
  }
  function tick(time) {
    frame = 0;
    if (!active()) { reset(); return; }
    // A fixed 60 Hz integration preserves the reference's feel at any refresh rate.
    const elapsed = lastTime ? Math.min(time - lastTime, 32) : 1000 / 60;
    lastTime = time;
    const steps = Math.max(1, Math.ceil(elapsed / (1000 / 60)));
    const dt = elapsed / (1000 / 60) / steps;
    const radius = Math.min(190, innerWidth * .32);
    let moving = false;
    for (const o of letters) {
      const r = o.anchor.getBoundingClientRect();
      const dx = pointer ? r.left + r.width / 2 - pointer.x : 0;
      const dy = pointer ? r.top + r.height / 2 - pointer.y : 0;
      const distance = Math.hypot(dx,dy) || 1;
      const force = pointer && distance < radius ? (1 - distance / radius) * 5 : 0;
      for (let step = 0; step < steps; step++) {
        o.vx += (dx / distance * force - o.x * .035) * dt;
        o.vy += (dy / distance * force - o.y * .035) * dt;
        o.vx *= Math.pow(.88,dt); o.vy *= Math.pow(.88,dt);
        o.x += o.vx * dt; o.y += o.vy * dt;
      }
      // Keep edge letters readable when a finger pushes toward the viewport edge.
      const left = Math.max(-70, 8 - r.left), right = Math.min(70, innerWidth - 8 - r.right);
      if (o.x < left || o.x > right) { o.x = Math.max(left,Math.min(right,o.x)); o.vx = 0; }
      const settled = Math.abs(o.vx) + Math.abs(o.vy) < .035;
      if (!pointer && settled && Math.abs(o.x) + Math.abs(o.y) < .15) {
        o.x = o.y = o.vx = o.vy = 0; o.glyph.style.transform = '';
      } else {
        o.glyph.style.transform = `translate(${o.x.toFixed(2)}px,${o.y.toFixed(2)}px) rotate(${(o.x * .18).toFixed(2)}deg)`;
        moving ||= !settled || (!pointer && Math.abs(o.x) + Math.abs(o.y) >= .15);
      }
    }
    if (moving) frame = requestAnimationFrame(tick);
    else lastTime = 0;
  }
  function move(event) { pointer = {x:event.clientX,y:event.clientY}; wake(); }
  function release() { pointer = null; wake(); }
  hero.addEventListener('pointermove', move, {passive:true});
  hero.addEventListener('pointerdown', move, {passive:true});
  hero.addEventListener('pointerleave', release);
  window.addEventListener('pointerup', event => { if (event.pointerType !== 'mouse') release(); }, {passive:true});
  window.addEventListener('pointercancel', release, {passive:true});
  window.addEventListener('scroll', release, {passive:true});
  window.addEventListener('resize', reset, {passive:true});
  window.addEventListener('hashchange', reset);
  window.addEventListener('blur', release);
  document.addEventListener('visibilitychange', reset);
  reduced.addEventListener('change', reset);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible) reset();
  }).observe(hero);
})();
