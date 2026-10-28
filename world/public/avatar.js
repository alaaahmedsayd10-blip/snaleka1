// Procedural chibi avatar: base body + wearable items, drawn in code so every item sits on the body and recolors with the skin.
(function(){
const mixC=(a,b,t)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),x=p(a),y=p(b);return'#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const dk=(c,t)=>mixC(c,'#2a1830',t),lt=(c,t)=>mixC(c,'#ffffff',t);
const SKIN=['#f9ebe6','#fbe0cc','#f6d5b8','#e9b98f','#c68a5c','#8d5a3a','#5b3a29'],EYEC=['#3c86dc','#35a86f','#8d5ad8','#8a5a36','#e0679a'],TOPC=['#f6f7fb','#26262b','#7fa8e8','#f1a7c1'],PANTC=['#1d1d21','#6d7078','#25304f','#d8cdb5'],SHOEC=['#f7fafc','#2c2c31','#f4b3cc','#d9464a'],HAIRC=['#16161a','#4a3426','#8a5a36','#d9b36a','#c8c8d0','#d9464a'];
const DEF={skin:'#f9ebe6',hair:'',hairC:'#16161a',eyes:'',eyeC:'#3c86dc',brows:'',glasses:'',nose:'',mouth:'',tats:'',top:'',topC:'#f6f7fb',pants:'',pantsC:'#1d1d21',shoes:'',shoesC:'#f7fafc'};
const CAT=[
 {k:'skin',t:'البشرة',colors:SKIN},
 {k:'hair',t:'الشعر',crop:'head',cc:'hairC',colors:HAIRC,items:[['','بدون'],['messy','Messy Fringe','r']]},
 {k:'eyes',t:'العيون',crop:'head',cc:'eyeC',colors:EYEC,items:[['','بدون'],['floral','Soft Floral Eyes','e']]},
 {k:'brows',t:'الحواجب',crop:'head',items:[['','بدون'],['furrowed','Furrowed Brows','c']]},
 {k:'glasses',t:'النظارة',crop:'head',items:[['','بدون'],['kpop','Kpop Glasses','e']]},
 {k:'nose',t:'الأنف',crop:'head',items:[['','بدون'],['ring','Nose Ring','c']]},
 {k:'mouth',t:'الفم',crop:'head',items:[['','بدون'],['monster','Baby Monster Mouth','c'],['pout','Plump Pout','c']]},
 {k:'tats',t:'التاتو',crop:'body',items:[['','بدون'],['roses','Night Bloom Tats','r']]},
 {k:'top',t:'القميص',crop:'body',cc:'topC',colors:TOPC,items:[['','بدون'],['formal','Formal Button Up Undershirt','r']]},
 {k:'pants',t:'البنطلون',crop:'body',cc:'pantsC',colors:PANTC,items:[['','بدون'],['sweat','Black Baggy Sweatpants','c']]},
 {k:'shoes',t:'الجزمة',crop:'feet',cc:'shoesC',colors:SHOEC,items:[['','بدون'],['airmojo','White Airmojo 21s','r']]}];
const RAR={c:['عادي','#6b7280'],r:['نادر','#3b82f6'],e:['ملحمي','#8b5cf6']};
for(const k of['tats','top','pants','shoes']){const i=CAT.findIndex(c=>c.k===k);if(i>=0)CAT.splice(i,1)}
if(window.AVP&&AVP.on()){CAT.length=0;AVP.cat().forEach(c=>CAT.push(c))}
const okC=v=>typeof v==='string'&&/^#[0-9a-fA-F]{6}$/.test(v),okI=v=>typeof v==='string'&&/^[a-z]{0,10}$/.test(v);
function cleanLook(o){if(window.AVP&&AVP.on())return AVP.clean(o);const r={};o=o&&typeof o==='object'?o:{};for(const k in DEF)r[k]=(/C$|^skin$/.test(k)?okC(o[k]):okI(o[k]))?o[k]:DEF[k];r.tats=r.top=r.pants=r.shoes='';return r}

function drawAvatar(L,back,sc,part){
 if(window.AVP&&AVP.on())return AVP.draw(L,back,sc,part);
 sc=sc||1;part=part||'all';
 const cv=document.createElement('canvas');cv.width=Math.round(150*sc);cv.height=Math.round(330*sc);
 const c=cv.getContext('2d');c.scale(sc,sc);c.lineJoin=c.lineCap='round';
 const doBody=part!=='armL'&&part!=='armR',doL=part==='all'||part==='armL',doR=part==='all'||part==='armR';
 const sk=L.skin,skS=mixC(sk,'#8f84c0',.2),skS2=mixC(sk,'#6f64a8',.38),skH=lt(sk,.2);
 const mir=p=>p.map(q=>[150-q[0],q[1]]);
 const path=pts=>{const q=new Path2D();pts.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.closePath();return q};
 const fillP=(q,f)=>{c.fillStyle=f;c.fill(q)};
 const el=(x,y,rx,ry,f,r)=>{c.beginPath();c.ellipse(x,y,rx,ry,r||0,0,7);c.fillStyle=f;c.fill()};
 const hg=(x0,x1,a,b,m)=>{const g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,a);if(m)g.addColorStop(.5,m);g.addColorStop(1,b);return g};
 const st=(col,w,fn)=>{c.beginPath();fn();c.strokeStyle=col;c.lineWidth=w;c.stroke()};
 const rr=(x,y,w,h,r,f)=>{c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=f;c.fill()};
 const bz=(a,b,c,d,n=6)=>Array.from({length:n},(_,i)=>{const t=(i+1)/n,u=1-t;return[u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]]});
 const LEG_L=[[51,200],[75,204],[73,250],[71,292],[70,308],[56,308],[56,292],[52,250]],LEG_R=mir(LEG_L);
 const TORSO=[[58,150],[92,150],[91,172],[88,194],[100,204],[75,208],[50,204],[62,194],[59,172]];
 const ARM_L=[[54,140],...bz([54,140],[49,140],[45,147],[44,158]),...bz([44,158],[43,178],[42,196],[42,212]),[52,213],...bz([52,213],[53,196],[55,178],[59,164]),...bz([59,164],[61,154],[60,144],[54,140])],ARM_R=mir(ARM_L);
 // ---- tattoos ----
 const tf=mixC(sk,'#5d5f66',.6),td=mixC(sk,'#2e2f33',.72),tl=mixC(sk,'#66705c',.6);
 const rose=(x,y,r)=>{c.fillStyle=tf;c.beginPath();c.arc(x,y,r,0,7);c.fill();c.strokeStyle=td;c.lineWidth=Math.max(.7,r*.16);c.beginPath();c.arc(x,y,r,0,7);c.stroke();c.beginPath();c.arc(x,y,r*.6,.4,5);c.stroke();c.beginPath();c.arc(x+r*.12,y,r*.28,.2,5.4);c.stroke()};
 const leaf=(x,y,a,l)=>{c.save();c.translate(x,y);c.rotate(a);c.beginPath();c.ellipse(l/2,0,l/2,l*.32,0,0,7);c.fillStyle=tl;c.fill();c.strokeStyle=td;c.lineWidth=.5;c.stroke();c.restore()};
 const vine=p=>st(td,1.1,()=>{c.moveTo(p[0][0],p[0][1]);c.bezierCurveTo(p[1][0],p[1][1],p[2][0],p[2][1],p[3][0],p[3][1])});
 // ---- shoes (drawn before pants so the hem falls over them) ----
 const shoe=(x,y,col)=>{const so=dk(lt(col,.1),.14),ln=dk(col,.2);
  rr(x-15,y+10,30,10,5,so);st(dk(so,.22),1.2,()=>{c.moveTo(x-13,y+14.5);c.lineTo(x+13,y+14.5)});
  c.beginPath();c.moveTo(x-14,y+11);c.bezierCurveTo(x-16,y,x-9,y-6,x,y-6);c.bezierCurveTo(x+9,y-6,x+16,y,x+14,y+11);c.closePath();c.fillStyle=col;c.fill();
  c.beginPath();c.moveTo(x-14,y+11);c.bezierCurveTo(x-16,y,x-9,y-6,x-4,y-6);c.lineTo(x-4,y+11);c.closePath();c.fillStyle='rgba(60,50,90,.10)';c.fill();
  st(ln,1.1,()=>{c.moveTo(x-13,y+8);c.quadraticCurveTo(x,y+1.5,x+13,y+8)});
  for(let i=0;i<3;i++)st(dk(col,.1),.9,()=>{c.moveTo(x-6,y-3+i*3);c.lineTo(x+6,y+i*3);c.moveTo(x+6,y-3+i*3);c.lineTo(x-6,y+i*3)});
  st(ln,1,()=>{c.moveTo(x-12,y+9);c.quadraticCurveTo(x-6,y+3,x+1,y+9.5)})};

 function hairDraw(){if(!L.hair)return;const hc=L.hairC,hD=mixC(hc,'#000000',.45),hL=lt(hc,.3);
  const g=c.createLinearGradient(40,10,124,120);g.addColorStop(0,lt(hc,.12));g.addColorStop(.5,hc);g.addColorStop(1,hD);
  c.beginPath();c.moveTo(38,100);c.bezierCurveTo(26,52,48,8,84,8);c.bezierCurveTo(120,8,140,52,126,102);
  if(back){c.bezierCurveTo(128,128,112,138,84,140);c.bezierCurveTo(54,138,36,126,38,100)}
  else{c.bezierCurveTo(124,80,118,58,104,50);c.bezierCurveTo(98,62,90,66,82,60);c.bezierCurveTo(74,66,60,64,52,52);c.bezierCurveTo(44,64,40,84,38,100)}
  c.closePath();c.fillStyle=g;c.fill();
  const lock=(x,y,tx,ty,w,col)=>{const mx=(x+tx)/2+(tx-x)*.15,my=(y+ty)/2-4;c.beginPath();c.moveTo(x-w,y);c.quadraticCurveTo(mx-w,my,tx,ty);c.quadraticCurveTo(mx+w,my+3,x+w,y);c.closePath();c.fillStyle=col;c.fill()};
  if(!back){[[82,40,60,78],[82,40,104,80],[70,42,48,92],[96,42,118,94],[60,42,40,112],[106,44,124,114],[76,44,72,82],[90,44,94,80],[52,46,38,70],[114,46,128,74]].forEach((l,i)=>lock(l[0],l[1],l[2],l[3],6+(i%3),i%2?hc:hD));
   [[70,26,56,58],[96,24,110,56],[84,18,84,46]].forEach(h=>{c.globalAlpha=.5;st(hL,1,()=>{c.moveTo(h[0],h[1]);c.quadraticCurveTo((h[0]+h[2])/2+4,(h[1]+h[3])/2,h[2],h[3])})});c.globalAlpha=1;
   st(dk(hc,.7),1,()=>{c.moveTo(82,30);c.lineTo(81,58)})}
  else{[[60,120,52,142],[84,126,84,148],[108,120,116,142],[70,124,66,146],[98,124,102,146]].forEach(l=>lock(l[0],l[1],l[2],l[3],7,hc));
   [[64,30,52,90],[96,26,112,88]].forEach(h=>{c.globalAlpha=.4;st(hL,1.2,()=>{c.moveTo(h[0],h[1]);c.quadraticCurveTo(h[0]-6,(h[1]+h[3])/2,h[2],h[3])});c.globalAlpha=1})}}
 // ---- body ----
 if(doBody){
  if(part==='all'){const g=c.createRadialGradient(75,314,2,75,314,70);g.addColorStop(0,'rgba(120,110,225,.5)');g.addColorStop(1,'rgba(95,115,190,0)');c.save();c.translate(75,314);c.scale(1,.17);c.translate(-75,-314);c.fillStyle=g;c.beginPath();c.arc(75,314,62,0,7);c.fill();c.restore()}
  const bp=new Path2D();bp.moveTo(68,134);bp.bezierCurveTo(61,136,55,138,52,146);bp.bezierCurveTo(50,156,55,170,57,184);bp.bezierCurveTo(58,194,51,200,51,212);bp.bezierCurveTo(51,236,53,256,54,272);bp.bezierCurveTo(53,284,55,296,58,308);bp.lineTo(73,308);bp.bezierCurveTo(73,290,74,262,74,236);bp.bezierCurveTo(74,224,75,216,75,212);bp.bezierCurveTo(75,216,76,224,76,236);bp.bezierCurveTo(76,262,77,290,77,308);bp.lineTo(92,308);bp.bezierCurveTo(95,296,97,284,96,272);bp.bezierCurveTo(97,256,99,236,99,212);bp.bezierCurveTo(99,200,92,194,93,184);bp.bezierCurveTo(95,170,100,156,98,146);bp.bezierCurveTo(95,138,89,136,82,134);bp.closePath();
  fillP(bp,hg(44,106,skS,skH,sk));if(L.shoes!=='airmojo'){el(60,308,13,6,skS,.22);el(90,308,13,6,sk,-.22)}
  fillP(path([[69,116],[81,116],[82,138],[68,138]]),mixC(sk,skS,.5));
  c.save();c.clip(bp);{const sh=c.createLinearGradient(50,0,100,0);sh.addColorStop(0,'rgba(120,105,190,.18)');sh.addColorStop(.35,'rgba(120,105,190,0)');sh.addColorStop(.75,'rgba(120,105,190,0)');sh.addColorStop(1,'rgba(120,105,190,.12)');c.fillStyle=sh;c.fillRect(40,130,70,185);
   st(skS,1,()=>{c.moveTo(56,262);c.quadraticCurveTo(61,266,66,262);c.moveTo(84,262);c.quadraticCurveTo(89,266,94,262)});
   }c.restore();

  if(!back){st(skS2,1,()=>{c.moveTo(74,177);c.quadraticCurveTo(76,180,78,177)});st(skS2,1,()=>{c.moveTo(66,141);c.quadraticCurveTo(75,146,84,141)});}
  else{st(skS,1.2,()=>{c.moveTo(75,144);c.quadraticCurveTo(73,168,75,190)});st(skS,1,()=>{c.moveTo(62,152);c.quadraticCurveTo(68,162,73,156)});st(skS,1,()=>{c.moveTo(88,152);c.quadraticCurveTo(82,162,77,156)})}
  if(L.tats==='roses'){c.save();c.clip(bp);
   vine([[66,160],[88,168],[62,184],[80,206]]);leaf(72,170,-.6,6);leaf(84,184,2.6,6);leaf(66,190,.5,5);rose(79,172,7.5);rose(71,190,6);
   vine([[64,208],[54,236],[72,262],[62,302]]);leaf(60,244,2.7,6);leaf(68,272,-.4,6);rose(61,228,6.5);rose(65,260,5.5);rose(60,292,4.8);c.restore()}
  if(L.shoes==='airmojo'){shoe(58,299,L.shoesC);shoe(92,299,L.shoesC)}
  if(L.pants==='sweat'){const pc=L.pantsC,pD=dk(pc,.4),pM=dk(pc,.16),pL=lt(pc,.14);
   const PL=[[51,188],[75,188],[76,250],[76,288],[72,305],[43,305],[46,288],[49,250]],PR=mir(PL);
   fillP(path(PL),hg(43,76,pL,pM));fillP(path(PR),hg(74,107,pM,pL));
   [[45,292,75,305],[75,292,105,305]].forEach(b=>{fillP(path([[b[0],b[1]],[b[2],b[1]],[b[2]-2,b[3]],[b[0]-2,b[3]]]),'rgba(10,8,16,.28)');st(pL,1,()=>{c.moveTo(b[0],b[1]);c.lineTo(b[2],b[1])})});
   [[52,232,58,258,54,288],[66,226,68,258,70,290]].forEach(f=>{st(pD,1,()=>{c.moveTo(f[0],f[1]);c.quadraticCurveTo(f[2],f[3],f[4],f[5])});st(pD,1,()=>{c.moveTo(150-f[0],f[1]);c.quadraticCurveTo(150-f[2],f[3],150-f[4],f[5])})});
   st(pD,1.2,()=>{c.moveTo(75,192);c.lineTo(75,305)});
   if(!back){st(pD,1,()=>{c.moveTo(52,196);c.quadraticCurveTo(48,214,50,230);c.moveTo(98,196);c.quadraticCurveTo(102,214,100,230)})}
   rr(49,183,52,14,5,pM);st(pD,.8,()=>{c.moveTo(51,188);c.lineTo(99,188);c.moveTo(51,192);c.lineTo(99,192)});
   if(!back){const sc2='#b8b8c2';st(sc2,1.1,()=>{c.moveTo(73,197);c.quadraticCurveTo(69,208,71,217);c.moveTo(77,197);c.quadraticCurveTo(81,208,79,217)});rr(70,216,2,4,1,'#8a8a94');rr(78,216,2,4,1,'#8a8a94')}}
  if(L.top==='formal'){const tc=L.topC,tS=dk(tc,.14),dark=parseInt(tc.slice(1,3),16)<90,tie=dark?'#e8e8f0':'#17161c';
   fillP(path([[57,149],[93,149],[95,172],[98,196],[100,204],[75,208],[50,204],[52,196],[55,172]]),hg(50,100,tS,tc,lt(tc,.08)));
   st(tS,1,()=>{c.moveTo(51,203);c.quadraticCurveTo(75,209,99,203)});
   if(!back){st(tS,1,()=>{c.moveTo(75,158);c.lineTo(75,203)});
    [[[65,146],[75,153],[68,165]],[[85,146],[75,153],[82,165]]].forEach(f=>{fillP(path(f),lt(tc,.06));c.strokeStyle=tS;c.lineWidth=.8;c.stroke(path(f))});
    fillP(path([[71.5,153],[78.5,153],[79,159],[71,159]]),tie);fillP(path([[71,159],[79,159],[82,192],[75,202],[68,192]]),tie);st(dark?'#fff':'#55546a',.8,()=>{c.moveTo(75,160);c.lineTo(75,196)})}
   else{fillP(path([[64,146],[86,146],[84,155],[66,155]]),lt(tc,.05));st(tS,.8,()=>{c.moveTo(66,155);c.lineTo(84,155)})}}
  // ---- head ----
  c.save();c.translate(75,22);c.scale(.78,.78);c.translate(-82,-22);
  el(74,64,48,50,mixC(sk,'#9a8fc0',.42));el(33,97,8,12,dk(sk,.14),.1);el(34,98,4.5,8,dk(sk,.3),.1);
  c.beginPath();c.moveTo(82,22);c.bezierCurveTo(114,22,124,56,121,88);c.bezierCurveTo(119,116,108,134,93,143);c.bezierCurveTo(86,148,77,148,71,144);c.bezierCurveTo(52,134,42,114,42,86);c.bezierCurveTo(42,50,54,22,82,22);c.closePath();
  c.fillStyle=hg(42,121,dk(sk,.03),skH,sk);c.fill();
  el(66,52,16,24,'rgba(255,255,255,.35)',-.3);
  if(!back){
   if(L.eyes||L.brows||L.mouth){c.globalAlpha=.26;el(56,114,11,7,'#d9776f',.2);el(108,114,11,7,'#d9776f',-.2);c.globalAlpha=1;st(dk(sk,.28),1.2,()=>{c.moveTo(80,98);c.quadraticCurveTo(78,108,77,113)});el(83,114,5,3.2,dk(sk,.12));el(83,112,2.6,1.6,lt(sk,.25));el(79.5,115,1.3,.9,dk(sk,.45));el(86.5,115,1.3,.9,dk(sk,.45));}
   if(L.eyes==='floral'){const ic=L.eyeC;
    const eye=(x,y,s,fl)=>{c.save();c.translate(x,y);c.scale(fl?-s:s,s);
     c.beginPath();c.ellipse(0,0,10,8,0,0,7);c.fillStyle='#fff';c.fill();c.save();c.beginPath();c.ellipse(0,0,10,8,0,0,7);c.clip();
     const gi=c.createLinearGradient(0,-7,0,8);gi.addColorStop(0,dk(ic,.35));gi.addColorStop(1,lt(ic,.15));c.beginPath();c.arc(0,.5,7.2,0,7);c.fillStyle=gi;c.fill();
     c.strokeStyle=dk(ic,.5);c.lineWidth=.9;c.stroke();
     c.fillStyle=lt(ic,.78);for(let i=0;i<5;i++){const a=i*Math.PI*2/5-Math.PI/2;c.beginPath();c.arc(Math.cos(a)*2.7,.5+Math.sin(a)*2.7,1.9,0,7);c.fill()}
     c.fillStyle=dk(ic,.1);c.beginPath();c.arc(0,.5,1.3,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(-3.4,-3,1.5,0,7);c.fill();c.beginPath();c.arc(3,3.4,.9,0,7);c.fill();c.restore();
     c.strokeStyle='#15131a';c.lineWidth=2.6;c.beginPath();c.arc(0,2,10.6,Math.PI*1.06,Math.PI*1.95);c.stroke();
     c.lineWidth=1.3;c.beginPath();c.moveTo(-10,.5);c.quadraticCurveTo(-13,-1,-15.5,-3.5);c.moveTo(-9.6,-1.5);c.quadraticCurveTo(-11.5,-5,-13.5,-7.5);c.moveTo(-9,2.8);c.quadraticCurveTo(-13,3,-15.5,2);c.moveTo(7,-6);c.lineTo(8.5,-9);c.moveTo(3.5,-7.5);c.lineTo(4,-10.5);c.stroke();
     c.lineWidth=.8;c.globalAlpha=.7;c.beginPath();c.arc(0,-1,9.4,.25,Math.PI-.25);c.stroke();c.globalAlpha=1;c.restore()};
    eye(62,94,1.15,0);eye(101,94,1.15,1)}
   if(L.nose==='ring'){el(84,112,3.2,2.4,'#e8907e');el(83.2,111.2,1.2,.8,'#f7bcae');st('#16151a',1.4,()=>{c.arc(85,114.4,2.9,-.5,Math.PI*1.35)})}
   if(L.mouth==='pout'){c.beginPath();c.moveTo(70,126);c.bezierCurveTo(75,121,80,121.5,83,124);c.bezierCurveTo(86,121.5,91,121,96,126);c.bezierCurveTo(90,127,87,127,83,127);c.bezierCurveTo(79,127,76,127,70,126);c.fillStyle='#dc8786';c.fill();
    c.beginPath();c.moveTo(70.5,126);c.bezierCurveTo(76,127.2,90,127.2,95.5,126);c.bezierCurveTo(92,132.5,87,134,83,134);c.bezierCurveTo(79,134,74,132.5,70.5,126);c.fillStyle='#f0a3a1';c.fill();el(83,130,5,1.6,'rgba(255,255,255,.55)')}
   if(L.mouth==='monster'){st('#b9665e',1.6,()=>{c.moveTo(70,126);c.quadraticCurveTo(76,130.5,83,127.5);c.quadraticCurveTo(90,131,96,125.5)});el(83,131.5,5,2,'#eab4a2');fillP(path([[73.5,128],[76.5,129],[75,133]]),'#fff');fillP(path([[89.5,128.5],[92.5,127.5],[91.5,132.5]]),'#fff')}
   if(L.glasses==='kpop'){const lens=(x,y)=>{c.beginPath();c.arc(x,y,15.5,0,7);c.fillStyle='rgba(255,255,255,.16)';c.fill();c.strokeStyle='#c9cfd6';c.lineWidth=2.2;c.stroke();st('rgba(255,255,255,.7)',1.2,()=>{c.moveTo(x-8,y-7);c.lineTo(x-2,y-12);c.moveTo(x-10,y-1);c.lineTo(x+2,y-12)})};
    lens(62,94);lens(101,94);st('#c9cfd6',2,()=>{c.moveTo(77,90);c.quadraticCurveTo(82,87,86,90);c.moveTo(47,89);c.lineTo(36,93);c.moveTo(116.5,89);c.lineTo(123,93)})}
   if(L.brows==='furrowed'){const bw=(xo,yo,xi,yi,t)=>{c.beginPath();c.moveTo(xo,yo);c.quadraticCurveTo((xo+xi)/2,(yo+yi)/2-t*.9,xi,yi-t*.3);c.lineTo(xi,yi+t*.7);c.quadraticCurveTo((xo+xi)/2,(yo+yi)/2+t*.2,xo,yo+1.2);c.fillStyle='#17151a';c.fill();const d=xo<xi?-1:1;st('#17151a',.7,()=>{for(let i=0;i<3;i++){c.moveTo(xo-d*(-i*1.6),yo+i*.3);c.lineTo(xo+d*2.2-d*(-i*1.6),yo-2.2+i*.5)}})};bw(46,72,77,81,4.2);bw(117,72,87,81,4.2)}
  }
  hairDraw();if(L.glasses==='kpop'){const ch=(x0,y0,x1,y1,x2,y2,x3,y3)=>{for(let i=0;i<=14;i++){const t=i/14,u=1-t,x=u*u*u*x0+3*u*u*t*x1+3*u*t*t*x2+t*t*t*x3,y=u*u*u*y0+3*u*u*t*y1+3*u*t*t*y2+t*t*t*y3;c.beginPath();c.ellipse(x,y,1.5,i%2?2.1:1.1,0,0,7);c.strokeStyle='#bfc6ce';c.lineWidth=.9;c.stroke()}};
   if(!back){ch(38,95,32,118,34,140,44,164);ch(122,93,128,115,126,138,116,164)}else{ch(36,95,32,118,34,140,44,164)}}
  if(back&&L.glasses==='kpop')st('#c9cfd6',2,()=>{c.moveTo(34,93);c.lineTo(46,90)});
  c.restore();
 }
 // ---- arms (separate layers so they can swing opposite to the legs) ----
 const arm=s=>{const P=s<0?ARM_L:ARM_R,q=path(P),hx=s<0?47.5:102.5,col=s<0?skS:sk;
  fillP(q,col);el(hx+(s<0?.5:-.5),217,5.6,8.8,col,s<0?.06:-.06);el(hx+(s<0?5.6:-5.6),213,2,4.2,col,s<0?.4:-.4);
  if(L.tats==='roses'){c.save();c.clip(q);
   if(s<0){vine([[50,156],[58,172],[46,190],[48,222]]);leaf(52,176,2.4,5);leaf(48,200,-.3,5);rose(51,168,3.8);rose(47,192,3.3);rose(45,213,2.9)}
   else{vine([[100,156],[108,176],[98,196],[102,222]]);leaf(104,180,.4,5);rose(103,170,3.4);rose(100,203,2.8)}c.restore()}
  if(L.top==='formal'){const tc=L.topC,tS=dk(tc,.14),sl=[[49,150],[65,152],[57,194],[53,221],[38,221],[41,194]],cf=[[37,218],[54,218],[54,227],[37,227]];
   fillP(path(s<0?sl:mir(sl)),s<0?hg(38,65,tS,tc):hg(85,112,tc,tS));
   st(tS,1,()=>{const m=s<0?1:-1,X=x=>s<0?x:150-x;c.moveTo(X(52),170);c.quadraticCurveTo(X(50),195,X(46),214)});
   const cp=path(s<0?cf:mir(cf));fillP(cp,lt(tc,.05));c.strokeStyle=tS;c.lineWidth=.8;c.stroke(cp);el(s<0?41:109,222.5,1,1,tS)}};
 if(doL)arm(-1);if(doR)arm(1);
 return cv}

// ---- sprite cache for the game ----
const SC=new Map();if(window.AVP)AVP.onload=()=>{SC.clear();window._creatorRefresh&&window._creatorRefresh()};
function lookSprite(a){const L=a.look;if(L!==a._l){a._l=L;a._k=JSON.stringify(L)}const key=a._k+(a.bk?'b':'f');let s=SC.get(key);
 if(!s){s={b:drawAvatar(L,a.bk,2.6,'body'),l:drawAvatar(L,a.bk,1,'armL'),r:drawAvatar(L,a.bk,1,'armR')};SC.set(key,s);if(SC.size>80)SC.delete(SC.keys().next().value)}return s}

// ---- dress-up creator ----
function makeCreator(L,onChange){
 const tabs=document.getElementById('tabs'),grid=document.getElementById('grid'),cols=document.getElementById('colors'),pv=document.getElementById('prev');
 let cat=CAT[Math.min(1,CAT.length-1)],back=0;const TH={};
 function thumb(ct,id){const N=(window.AVP&&AVP.on())?AVP.thumbLook(L):Object.assign({},DEF,{skin:L.skin,hair:'',eyes:'',brows:'',glasses:'',nose:'',mouth:'',tats:'',top:'',pants:'',shoes:''});N[ct.k]=id;if(ct.cc)N[ct.cc]=L[ct.cc];
  const key=JSON.stringify(N)+ct.k;if(TH[key])return TH[key];const s=drawAvatar(N,0,1.4,'all'),o=document.createElement('canvas');o.width=o.height=120;const x=o.getContext('2d');x.fillStyle='#1c1a2e';x.fillRect(0,0,120,120);
  const R=Array.isArray(ct.crop)?ct.crop:{head:[8,4,134,150],body:[0,6,150,324],feet:[26,282,98,46],all:[0,0,150,330]}[ct.crop],k=1.4,f=Math.min(112/R[2],112/R[3]);x.imageSmoothingQuality='high';
  x.drawImage(s,R[0]*k,R[1]*k,R[2]*k,R[3]*k,60-R[2]*f/2,60-R[3]*f/2,R[2]*f,R[3]*f);const u=o.toDataURL();return(window.AVP&&AVP.pending())?u:(TH[key]=u)}
 function paint(){const s=drawAvatar(L,back,1.7,'all');pv.width=s.width;pv.height=s.height;pv.getContext('2d').drawImage(s,0,0)}
 function setK(k,v){L[k]=v;onChange&&onChange();ui()}
 function ui(){
  tabs.innerHTML=CAT.map(c=>`<button data-k="${c.k}" class="${c===cat?'on':''}">${c.t}</button>`).join('');
  tabs.querySelectorAll('button').forEach(b=>b.onclick=()=>{cat=CAT.find(c=>c.k===b.dataset.k);ui()});
  const cl=cat.colors,ck=cat.k==='skin'?'skin':cat.cc;
  cols.style.display=cl?'flex':'none';cols.innerHTML=cl?cl.map(c=>`<span class="sw ${L[ck]===c?'on':''}" style="background:${c}" data-c="${c}"></span>`).join(''):'';
  cols.querySelectorAll('.sw').forEach(s=>s.onclick=()=>setK(ck,s.dataset.c));
  grid.style.display=cat.items?'grid':'none';
  if(cat.items)grid.innerHTML=cat.items.map(([id,n,r])=>`<div class="itc ${L[cat.k]===id?'on':''}" data-id="${id}"><img src="${thumb(cat,id)}" alt=""><div>${n}</div>${r?`<span class="rar" style="background:${RAR[r][1]}">${RAR[r][0]}</span>`:''}</div>`).join('');
  grid.querySelectorAll('.itc').forEach(d=>d.onclick=()=>setK(cat.k,d.dataset.id));
  document.getElementById('vF').classList.toggle('p',!back);document.getElementById('vB').classList.toggle('p',!!back);paint()}
 document.getElementById('vF').onclick=()=>{back=0;ui()};document.getElementById('vB').onclick=()=>{back=1;ui()};
 window._creatorRefresh=ui;ui();return{refresh:ui}}
window.drawAvatar=drawAvatar;window.lookSprite=lookSprite;window.cleanLook=cleanLook;window.makeCreator=makeCreator;window.DEFLOOK=(window.AVP&&AVP.on())?AVP.clean({}):DEF;
})();
