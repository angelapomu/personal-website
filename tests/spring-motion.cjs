const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const assert = require('node:assert/strict');
const source = readFileSync(require('node:path').join(__dirname,'../spring-hero.js'),'utf8');
function setup(search='') {
  const events = {}, buttonEvents = {}, globalEvents = {};
  const glyph = {style:{}};
  const instruction = {textContent:''};
  const button = {hidden:true,textContent:'',setAttribute(){},addEventListener:(n,f)=>buttonEvents[n]=f};
  const anchor = {firstElementChild:glyph,getBoundingClientRect:()=>({left:100,top:100,width:60,height:70,right:160})};
  const hero = {dataset:{},querySelectorAll:()=>[anchor],querySelector:s=>s==='.spring-motion-toggle'?button:instruction,closest:()=>({hidden:false}),addEventListener:(n,f)=>events[n]=f};
  const preference = {matches:true,addEventListener:(n,f)=>preference.change=f};
  let queue = new Map(), id=0, time=0, observed;
  const context={document:{hidden:false,querySelector:()=>hero,addEventListener(){}},window:{addEventListener:(n,f)=>globalEvents[n]=f},location:{search},URLSearchParams,matchMedia:()=>preference,innerWidth:390,requestAnimationFrame:f=>{queue.set(++id,f);return id},cancelAnimationFrame:i=>queue.delete(i),IntersectionObserver:class{constructor(f){observed=f}observe(){}}};
  runInNewContext(source,context);
  observed([{isIntersecting:true}]);
  function frames(n=20){for(let i=0;i<n;i++){time+=1000/60;const callbacks=[...queue.values()];queue.clear();callbacks.forEach(f=>f(time));}}
  function move(){events.pointermove({clientX:110,clientY:120});frames();}
  return {button,buttonEvents,hero,glyph,move,events,frames,queue,preference,observed,globalEvents};
}
const regular=setup();
regular.move();
assert.equal(regular.queue.size,0,'Reduced motion defaults to paused');
assert.equal(regular.button.hidden,false,'Offer an explicit motion control');
regular.buttonEvents.click(); regular.move();
assert.match(regular.glyph.style.transform,/translate\(/,'Explicit opt-in must animate despite system preference');
assert.equal(regular.hero.dataset.motionEnabled,'true');
regular.events.pointerleave();regular.frames(500);
assert.equal(regular.glyph.style.transform,'','Release returns letters to rest');
assert.equal(regular.queue.size,0,'Settled animation stops');
regular.move();regular.buttonEvents.click();
assert.equal(regular.glyph.style.transform,'','Pause clears displaced letters');
assert.equal(regular.hero.dataset.motionEnabled,'false');
assert.equal(regular.queue.size,0);
const preview=setup('?motion=on');preview.move();
assert.match(preview.glyph.style.transform,/translate\(/,'Requested animation preview must opt in');
preview.observed([{isIntersecting:false}]);
assert.equal(preview.queue.size,0,'Offscreen still pauses explicitly enabled motion');
console.log('PASS: reduced-motion default, explicit opt-in, spring return, pause, preview link, offscreen stop');
