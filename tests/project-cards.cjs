const {readFileSync} = require('node:fs');
const {runInNewContext} = require('node:vm');
const assert = require('node:assert/strict');
const source = readFileSync(require('node:path').join(__dirname,'../project-cards.js'),'utf8');
function fixture({reduce=false,search='',supported=true}={}) {
  const callbacks={},events={},observed=new Set(),animations=[];
  let intersect;
  const cards=[0,1,2,3].map(i=>{
    const classes=new Set();
    return {offsetTop:i<2?100:900,classList:{add:c=>classes.add(c),remove:c=>classes.delete(c),contains:c=>classes.has(c)},
      animate:()=>{throw Error('not configured')},previousElementSibling:null};
  });
  for(let i=0;i<cards.length;i++) {
    cards[i].previousElementSibling=i%2?cards[i-1]:null;
    cards[i].animate=(frames,options)=>{let finish,reject;const animation={frames,options,cancelled:false,finished:new Promise((a,b)=>{finish=a;reject=b}),cancel(){this.cancelled=true;reject(new Error('cancelled'))},finish(){finish()}};animations.push(animation);return animation;};
  }
  const home={querySelectorAll:()=>cards,addEventListener:(n,f)=>events[n]=f};
  const media={matches:reduce,addEventListener:(n,f)=>callbacks.preference=f};
  const ctx={document:{querySelector:()=>home},location:{search,hash:'#home'},URLSearchParams,window:{addEventListener:(n,f)=>callbacks[n]=f},matchMedia:()=>media};
  if(supported)ctx.IntersectionObserver=class{constructor(f){intersect=f}observe(c){observed.add(c)}unobserve(c){observed.delete(c)}};
  runInNewContext(source,ctx);
  return {cards,animations,media,events,callbacks,ctx,observed,enter:(...cs)=>intersect(cs.map(target=>({target,isIntersecting:true})))};
}
(async()=>{
  const f=fixture();
  assert.equal(f.observed.size,4);
  f.enter(f.cards[0],f.cards[1]);
  assert.equal(f.animations.length,2);
  assert.equal(f.animations[0].options.delay,0);
  assert.equal(f.animations[1].options.delay,100);
  f.animations.forEach(a=>a.finish());await Promise.resolve();
  assert.ok(!f.cards[0].classList.contains('card-enter-pending'));
  f.enter(f.cards[0]);assert.equal(f.animations.length,2,'Seen cards never replay');
  f.events.focusin({target:{closest:()=>f.cards[2]}});
  assert.ok(!f.cards[2].classList.contains('card-enter-pending'),'Keyboard focus reveals immediately');
  f.media.matches=true;f.callbacks.preference();
  assert.equal(f.observed.size,0,'Reduced motion reveals pending content');
  const reduced=fixture({reduce:true});assert.equal(reduced.observed.size,0);
  const preview=fixture({reduce:true,search:'?motion=on'});preview.enter(preview.cards[0]);
  assert.equal(preview.animations.length,1,'Explicit preview enables motion');
  preview.ctx.location.hash='#project/woma';preview.callbacks.hashchange();await Promise.resolve();
  assert.ok(!preview.cards[0].classList.contains('card-enter-pending'),'Detail navigation settles active entrances');
  const single=fixture();single.cards[1].offsetTop=700;single.enter(single.cards[1]);
  assert.equal(single.animations[0].options.delay,0,'Single column has no stagger');
  const unsupported=fixture({supported:false});
  assert.ok(unsupported.cards.every(c=>!c.classList.contains('card-enter-pending')),'Unsupported browsers keep content visible');
  console.log('PASS: once-only entrance, row stagger, single-column timing, focus, reduced motion, preview override, route return, fallback');
})().catch(err=>{console.error(err);process.exitCode=1});
