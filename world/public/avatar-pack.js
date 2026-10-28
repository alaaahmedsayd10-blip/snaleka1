// Layered PNG avatar pack. When AVATAR_PACK.enabled, every avatar is composed from same-size transparent PNG layers (see avatar/HOWTO.txt).
(function(){
const P=()=>window.AVATAR_PACK,imgs=new Map();let pend=0,tm;
const fire=()=>{clearTimeout(tm);tm=setTimeout(()=>AVP.onload&&AVP.onload(),40)};
function img(src){let e=imgs.get(src);if(!e){e={i:new Image(),ok:0};e.i.onload=()=>{e.ok=1;pend--;fire()};e.i.onerror=()=>{pend--;fire()};pend++;e.i.src=src;imgs.set(src,e)}return e}
const AVP={
 on:()=>!!(P()&&P().enabled),
 pending:()=>pend>0,
 onload:null,
 draw(L,back,sc,part){sc=sc||1;const p=P(),cv=document.createElement('canvas');cv.width=Math.round(150*sc);cv.height=Math.round(330*sc);
  if(part==='armL'||part==='armR')return cv; // PNG layers are one piece: no separate arm swing
  const c=cv.getContext('2d');c.imageSmoothingQuality='high';
  const k=Math.min(cv.width/p.w,cv.height/p.h),dw=p.w*k,dh=p.h*k,ox=(cv.width-dw)/2,oy=cv.height-dh;
  p.order.forEach(slot=>{const id=L[slot];if(!id)return;const it=(p.items[slot]||[]).find(x=>x.id===id);if(!it)return;
   const src=back?(it.back===false?null:(it.back||it.front)):it.front;if(!src)return;const e=img(p.base+src);if(e.ok)c.drawImage(e.i,ox,oy,dw,dh)});
  return cv},
 clean(o){const p=P(),r={};o=o&&typeof o==='object'?o:{};p.slots.forEach(s=>{const v=o[s.k],ok=v===''?!s.required:(typeof v==='string'&&(p.items[s.k]||[]).some(i=>i.id===v));r[s.k]=ok?v:(s.def||'')});return r},
 cat(){const p=P();return p.slots.map(s=>({k:s.k,t:s.t,crop:s.crop||'all',items:[...(s.required?[]:[['','بدون']]),...(p.items[s.k]||[]).map(i=>[i.id,i.name||i.id,i.rar])]}))},
 thumbLook(L){const r={};P().slots.forEach(s=>r[s.k]=s.required?L[s.k]:'');return r},
 preload(){const p=P();Object.keys(p.items).forEach(k=>p.items[k].forEach(i=>{i.front&&img(p.base+i.front);i.back&&img(p.base+i.back)}))}
};
window.AVP=AVP;if(AVP.on())AVP.preload();
})();
