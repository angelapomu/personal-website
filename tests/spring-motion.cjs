const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const assert = require('node:assert/strict');
const source = readFileSync(require('node:path').join(__dirname,'../spring-hero.js'),'utf8');
function setup(search='') {
  const events = {}, globalEvents = {};
  const glyph = {style:{}};
  const anchor = {firstElementChild:glyph,getBoundingClientRect:()=>({left:100,top:100,width:60,height:70,right:160})};
  const hero = {dataset:{},querySelectorAll:()=>[anchor],closest:()=>({hidden:false}),addEventListener:(n,f)=>events[n]=f};
  const preference = {matches:true,addEventListener:(n,f)=>preference.change=f};
  let queue = new Map(), id=0, time=0, observed;
  const context={document:{hidden:false,querySelector:()=>hero,addEventListener(){}},window:{addEventListener:(n,f)=>globalEvents[n]=f},location:{search},URLSearchParams,matchMedia:()=>preference,innerWidth:390,requestAnimationFrame:f=>{queue.set(++id,f);return id},cancelAnimationFrame:i=>queue.delete(i),IntersectionObserver:class{constructor(f){observed=f}observe(){}}};
  runInNewContext(source,context);
  observed([{isIntersecting:true}]);
  function frames(n=20){for(let i=0;i<n;i++){time+=1000/60;const callbacks=[...queue.values()];queue.clear();callbacks.forEach(f=>f(time));}}
  function move(){events.pointermove({clientX:110,clientY:120});frames();}
  return {hero,glyph,move,events,frames,queue,preference,observed,globalEvents};
}
const regular=setup();
regular.move();
assert.equal(regular.queue.size,0,'Reduced motion defaults to paused');
regular.preference.matches=false; regular.preference.change(); regular.move();
assert.match(regular.glyph.style.transform,/translate\(/,'Normal motion preference enables animation');
assert.equal(regular.hero.dataset.motionEnabled,'true');
regular.events.pointerleave();regular.frames(500);
assert.equal(regular.glyph.style.transform,'','Release returns letters to rest');
assert.equal(regular.queue.size,0,'Settled animation stops');
regular.move();regular.preference.matches=true;regular.preference.change();
assert.equal(regular.glyph.style.transform,'','Pause clears displaced letters');
assert.equal(regular.hero.dataset.motionEnabled,'false');
assert.equal(regular.queue.size,0);
const preview=setup('?motion=on');preview.move();
assert.match(preview.glyph.style.transform,/translate\(/,'Requested animation preview must opt in');
preview.observed([{isIntersecting:false}]);
assert.equal(preview.queue.size,0,'Offscreen still pauses explicitly enabled motion');
assert.equal(preview.hero.dataset.heroVisible,'false','Scroll cue pauses offscreen');
console.log('PASS: reduced-motion default, preference changes, spring return, preview link, offscreen stop');
