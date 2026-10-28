const cv=document.getElementById('c'),g=cv.getContext('2d'),W=800,H=533;g.direction='rtl';
let S={name:'لاعب',skin:'#f1c27d',hair:'#3b2a1a',shirt:'#e14a4a',hat:'',ch:0,owned:[''],gold:50};
try{const t=localStorage.getItem('w2');if(t)S=Object.assign(S,JSON.parse(t))}catch(e){}
S.look=cleanLook(S.look);g.imageSmoothingQuality='high';
function save(){try{localStorage.setItem('w2',JSON.stringify(S))}catch(e){}}
const me={x:400,y:300,tx:400,ty:300,say:'',st:0};
// ---- Sanalika-style rooms (each bg is 1536x1024 drawn into 800x533 world) ----
const inP=(x,y,p)=>{let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const[a,b]=p[i],[d,e]=p[j];if((b>y)!==(e>y)&&x<(d-a)*(y-b)/(e-b)+a)c=!c}return c};
const ROOMS={
 street:{name:'الشارع الرئيسي',bg:'assets/map-street.jpg',spawn:[400,300],
  walk:[[[70,215],[300,95],[520,60],[720,165],[700,300],[560,500],[300,520],[120,370]]],
  doors:[{to:'cafe',x:120,y:235,l:'☕ الكافيه'},{to:'pier',x:150,y:400,l:'🎣 الرصيف'},{to:'party',x:680,y:310,l:'🎉 الحفلة'}],
  seats:[[325,232,232],[505,232,232],[338,365,365],[505,355,355]]},
 pier:{name:'رصيف الصيد',bg:'assets/map-pier.jpg',spawn:[300,260],fish:true,
  walk:[[[0,60],[170,60],[200,150],[440,200],[470,245],[470,390],[400,395],[160,330],[140,200],[0,190]],[[455,230],[560,250],[700,275],[730,300],[640,335],[540,290],[460,270]]],
  doors:[{to:'street',x:60,y:110,l:'🏙 الشارع'}],seats:[]},
 cafe:{name:'كافيه الكراج',bg:'assets/map-cafe.jpg',spawn:[450,400],
  walk:[[[100,320],[330,225],[640,300],[780,365],[740,470],[480,520],[110,430]]],
  doors:[{to:'street',x:200,y:265,l:'🏙 الشارع'}],
  seats:[[417,262,262],[458,268,268],[500,274,274],[290,330,330],[340,350,350],[575,330,330],[640,375,375]]},
 party:{name:'نادي الحفلات',bg:'assets/map-party.jpg',spawn:[400,240],dance:true,
  walk:[[[230,120],[420,120],[600,200],[680,300],[520,450],[240,460],[110,320],[200,170]]],
  doors:[{to:'street',x:290,y:115,l:'🏙 الشارع'}],
  seats:[[560,240,240],[690,215,215],[540,345,345],[630,330,330]]}};
Object.values(ROOMS).forEach(r=>{r.img=new Image();r.img.onload=()=>r.ok=true;r.img.src=r.bg});
let ROOM=localStorage.getItem('room')||'street';if(!ROOMS[ROOM])ROOM='street';
let SEATS=ROOMS[ROOM].seats;
function goRoom(id){if(!ROOMS[id])return;ROOM=id;localStorage.setItem('room',id);const r=ROOMS[id];SEATS=r.seats;me.sit=null;me.want=null;me.x=me.tx=r.spawn[0];me.y=me.ty=r.spawn[1];me.px=undefined;Object.keys(others).forEach(k=>{if(others[k].room!==id)delete others[k]});logLine('📍 دخلت '+r.name);const mp=document.getElementById('mapP');if(mp)mp.style.display='none'}
const onPier=(x,y)=>!!ROOMS[ROOM].fish;
const ok=(x,y)=>x>=4&&x<=796&&y>=40&&y<=528&&ROOMS[ROOM].walk.some(q=>inP(x,y,q));
const OBJ=[];
const BENCH=[];
const seatAt=(x,y)=>SEATS.findIndex(s=>Math.hypot(s[0]-x,s[1]-y)<18);
const depth=y=>0.72+0.55*(y-60)/455;
// Solid footprints: umbrellas and loungers are scenery, not walkable floor.
const blocked=(x,y,allowSeat=-1)=>{
  // Each lounger blocks feet from crossing its body. The marked sitting point is in front.
  for(let i=0;i<SEATS.length;i++){const [sx,sy]=SEATS[i]; if(i===allowSeat) continue;
    if(Math.abs(x-sx)<12 && y>sy-23 && y<sy-3) return true;
  }
  for(const[x0,y0,x1,y1]of BENCH)if(x>x0&&x<x1&&y>y0&&y<y1)return true;
  return false;
};
const SPEED=46,ACC=3.2;
function step(a,dt){if(a.sit!=null)return;if(a.want!=null&&Math.hypot(a.tx-a.x,a.ty-a.y)<1.5){const s=SEATS[a.want];a.x=s[0];a.y=s[1];a.sit=a.want;a.want=null;return}const dx=a.tx-a.x,dy=a.ty-a.y,d=Math.hypot(dx,dy);if(d<1){a.stuck=0;a.v=0;return}
a.v=(a.v||0)+((d>6?1:Math.max(.35,d/6))-(a.v||0))*(1-Math.exp(-ACC*dt*2));const sp=Math.min(d,SPEED*a.v*dt*depth(a.y)),ux=dx/d*sp,uy=dy/d*sp;
const allowed=a.want!=null?a.want:-1;
if((ok(a.x+ux,a.y+uy)||!ok(a.x,a.y))&&!blocked(a.x+ux,a.y+uy,allowed)){a.x+=ux;a.y+=uy;a.stuck=0}
else if(Math.abs(ux)>.01&&ok(a.x+Math.sign(ux)*sp,a.y)&&!blocked(a.x+Math.sign(ux)*sp,a.y,allowed)){a.x+=Math.sign(ux)*sp*.8;a.stuck=(a.stuck||0)+dt}
else if(Math.abs(uy)>.01&&ok(a.x,a.y+Math.sign(uy)*sp)&&!blocked(a.x,a.y+Math.sign(uy)*sp,allowed)){a.y+=Math.sign(uy)*sp*.8;a.stuck=(a.stuck||0)+dt}
else a.stuck=1;
if(a.stuck>.6){a.tx=a.x;a.ty=a.y;a.stuck=0}
if(a.want!=null&&Math.hypot(a.tx-a.x,a.ty-a.y)<1.5){const s=SEATS[a.want];a.x=s[0];a.y=s[1];a.sit=a.want;a.want=null}}
function R(c,x,y,w,h){g.fillStyle=c;g.fillRect(x,y,w,h)}
function P(c,pts){g.fillStyle=c;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill()}
function tree(x,y){R('#6b4423',x-4,y-10,8,30);g.fillStyle='#2f8f3a';g.beginPath();g.arc(x,y-25,26,0,7);g.fill();g.fillStyle='#3fae4c';g.beginPath();g.arc(x-8,y-32,14,0,7);g.fill()}
function win(x,y,w,h){R('#5b3a2a',x-2,y-2,w+4,h+4);R('#bfe3f5',x,y,w,h);R('rgba(255,255,255,.5)',x,y,w/2,h)}
function label(t,x,y,c,f){g.font=f||'bold 15px system-ui';g.textAlign='center';g.fillStyle=c;g.fillText(t,x,y)}
function scene(){
const s=g.createLinearGradient(0,0,0,120);s.addColorStop(0,'#9bd3ff');s.addColorStop(1,'#e4f4ff');R(s,0,0,W,H);g.fillStyle=s;g.fillRect(0,0,W,120);
// buildings
R('#f2c14e',0,20,105,215);for(let i=0;i<3;i++)win(15+i*30,50,20,30),win(15+i*30,110,20,30);
R('#b8453a',110,0,230,235);for(let r=0;r<2;r++)for(let c=0;c<4;c++)win(125+c*52,25+r*80,34,46);
R('#5b3a2a',200,165,50,70);label('☕ مقهى',225,158,'#fff','bold 13px system-ui');
R('#3a86c8',350,70,190,165);R('#2a5f95',350,70,190,22);label('كافيه الشارع',445,87,'#fff','bold 14px system-ui');
win(365,105,50,40);win(480,105,50,40);R('#1e3550',430,160,36,75);
for(let i=0;i<8;i++)R(i%2?'#fff':'#d63a3a',350+i*24,150,24,18);
R('#e9d3a2',630,50,125,185);R('#c9a96a',630,50,125,20);label('العقاري',692,66,'#3a2a1a','bold 13px system-ui');win(645,90,30,40);win(710,90,30,40);win(645,150,30,40);win(710,150,30,40);
R('#7a4f27',760,60,40,175);
R('#2b2b2b',455,10,150,60);R('#ffd24a',470,20,40,40);label('حفلة',560,48,'#ffd24a','bold 24px system-ui');
// sidewalk
P('#e6d3a6',[[0,235],[800,235],[800,262],[0,262]]);P('#d8c08a',[[0,262],[800,262],[800,268],[0,268]]);
// grass park
P('#7bc24a',[[0,268],[260,268],[200,515],[0,515]]);P('#6aae3c',[[0,268],[40,268],[0,330]]);
g.fillStyle='#3aa0d8';g.beginPath();g.ellipse(75,420,80,42,0,0,7);g.fill();g.strokeStyle='#e6f5ff';g.lineWidth=5;g.stroke();
g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.ellipse(60,412,30,8,0,0,7);g.fill();
tree(40,320);tree(150,300);tree(30,480);
// road
P('#6e6e73',[[260,268],[700,268],[560,430],[200,515],[220,515]]);P('#6e6e73',[[200,515],[330,515],[560,380],[420,268],[260,268]]);
g.strokeStyle='#f2f2f2';g.lineWidth=4;g.setLineDash([22,16]);g.beginPath();g.moveTo(340,268);g.lineTo(280,515);g.stroke();g.setLineDash([]);
for(let i=0;i<6;i++)R('#f2f2f2',365+i*17,285,10,40);
// sidewalk right of road + plaza
P('#e6d3a6',[[430,268],[800,268],[800,420],[520,420]]);
// sea
P('#3aa0d8',[[430,440],[800,300],[800,515],[430,515]]);
g.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<7;i++)R('rgba(255,255,255,.35)',450+((Date.now()/30+i*45)%330),455+i*8,24,3);
P('#e6d3a6',[[430,440],[600,372],[600,395],[430,470]]);
// pier
R('#a87b45',600,395,200,40);for(let i=0;i<11;i++)R('#7a5028',600+i*19,395,2,40);R('#7a5028',600,433,200,5);
// umbrella stand
R('#6b4423',255,445,4,40);g.fillStyle='#d63a3a';g.beginPath();g.arc(257,445,34,Math.PI,0);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(257,445,34,Math.PI*1.35,Math.PI*1.65);g.lineTo(257,445);g.fill();
// balloons
g.fillStyle='#222';[[20,255],[38,248],[30,268]].forEach(b=>{g.beginPath();g.ellipse(b[0],b[1]-55,10,13,0,0,7);g.fill()});
}
function avatar(a,mine){if(a.dance&&Date.now()-a.dt<6000&&a.sit==null){g.save();const j=Math.abs(Math.sin(Date.now()/160))*5;g.translate(0,-j);const r=sprAvatar(a,mine);g.restore();return r}return sprAvatar(a,mine)}
function sprAvatar(a,mine){if(a.look){return sprite(a,mine)}const{x,y}=a,w=Math.sin(Date.now()/120)*(Math.hypot(a.tx-a.x,a.ty-a.y)>3?4:0);
g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x,y+2,16,6,0,0,7);g.fill();
R('#2b3a55',x-9,y-22,7,22+w/2);R('#2b3a55',x+2,y-22,7,22-w/2);R(a.shirt,x-12,y-48,24,28);
g.fillStyle=a.skin;g.beginPath();g.arc(x,y-60,13,0,7);g.fill();
g.fillStyle=a.hair;g.beginPath();g.arc(x,y-63,13,Math.PI,0);g.fill();
R('#222',x-6,y-60,3,3);R('#222',x+3,y-60,3,3);
if(a.hat){g.font='22px serif';g.textAlign='center';g.fillText(a.hat,x,y-72)}
g.font='12px system-ui';g.textAlign='center';g.strokeStyle='rgba(0,0,0,.6)';g.lineWidth=3;const nm=a.n||S.name;g.strokeText(nm,x,y-90);g.fillStyle=mine?'#ffd24a':'#fff';g.fillText(nm,x,y-90);
if(a.say&&Date.now()-a.st<4000){g.font='13px system-ui';const tw=g.measureText(a.say).width+16;g.fillStyle='#fff';g.beginPath();g.roundRect(x-tw/2,y-130,tw,24,8);g.fill();g.fillStyle='#111';g.fillText(a.say,x,y-113)}}
function sil(m){if(m._sil)return m._sil;const c=document.createElement('canvas');c.width=m.width;c.height=m.height;const x=c.getContext('2d');x.drawImage(m,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);return m._sil=c}
function armsDraw(s,ww,hh,oy,aL,aR){const f=ww/150;[[s.l,58,156,aL],[s.r,92,156,aR]].forEach(([A,px,py,an])=>{g.save();g.translate(-ww/2+px*f,oy+py*f);g.rotate(an);g.drawImage(A,-px*f,-py*f,ww,hh);g.restore()})}
function sprite(a,mine){
if(a.px===undefined){a.px=a.x;a.py=a.y;a.ph=0;a.amp=0;a.fl=0;a.bk=0}
const vx=a.x-a.px,vy=a.y-a.py;if(a.sit!=null)a.bk=0;else if(vy<-0.06&&Math.abs(vy)>Math.abs(vx)*0.7)a.bk=1;else if(vy>0.06||Math.abs(vx)>0.08)a.bk=0;
const SP=lookSprite(a),m=SP.b,k=depth(a.y),hh=(window.AVP&&AVP.on()?44:38)*k,ww=m.width*hh/m.height,sx=m.width/ww,hip=hh*0.56;
const mvd=Math.hypot(vx,vy);a.px=a.x;a.py=a.y;const stride=(window.AVP&&AVP.on())?hh*0.3:hh*0.62;a.ph+=mvd/stride*Math.PI;const tgt=mvd>0.03?Math.min(1,mvd/(0.9*k)):0;a.amp+=(tgt-a.amp)*0.15;if(a.amp<0.02){a.amp=0;a.ph+=(Math.round(a.ph/Math.PI)*Math.PI-a.ph)*0.3}
if(vx<-0.05)a.fl=1;else if(vx>0.05)a.fl=0;
let{x,y}=a;
if(a.sit!=null){const s=SEATS[a.sit];x=s[0];y=s[1];
g.save();g.translate(x,y);if(a.fl)g.scale(-1,1);
g.save();g.translate(0,-2*k);g.rotate(-0.78);g.drawImage(m,0,(hip-3)*sx,m.width,(hh-hip+3)*sx,-ww/2,-2*k,ww,hh-hip+3);g.restore();
g.save();g.rotate(-0.28);g.drawImage(m,0,0,m.width,hip*sx,-ww/2,-hip*0.88,ww,hip);armsDraw(SP,ww,hh,-hip*0.88,0.14,-0.14);g.restore();g.restore();
labels(a,mine,x,y-hip-4,k);return}
if(window.AVP&&AVP.on()){humanWalk(a,SP,m,x,y,hh,ww,k,mine);return}
const sw=Math.sin(a.ph)*0.36*a.amp,bob=(1-Math.abs(Math.cos(a.ph)))*1.1*a.amp*k,top=y-hh+bob*0.4-Math.abs(Math.sin(a.ph))*0.0;
// 2.5D cast shadow (sun from upper-left) + contact shadow
g.save();g.globalAlpha=0.22;g.translate(x,y);g.transform(1,0,0.9,0.32,0,0);g.drawImage(sil(m),-ww/2,-hh,ww,hh);g.restore();
g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(x,y,ww*0.32,hh*0.06+1,0,0,7);g.fill();
g.save();g.translate(x,top);if(a.fl)g.scale(-1,1);
const leg=(x0,x1,ang,lift)=>{g.save();g.translate((x0+x1)/2-ww/2,hip);g.rotate(ang);const L=hh-hip+3-lift;g.drawImage(m,x0*sx,(hip-3)*sx,(x1-x0)*sx,(hh-hip+3)*sx,-(x1-x0)/2,-3,x1-x0,L);g.restore()};
const lf=Math.max(0,Math.cos(a.ph))*1.4*a.amp*k,rf=Math.max(0,-Math.cos(a.ph))*1.4*a.amp*k;leg(ww/2,ww,-sw,lf);leg(0,ww/2,sw,rf);
g.translate(0,hip);g.rotate(0.05*a.amp+Math.sin(a.ph*2)*0.012*a.amp);g.translate(Math.sin(a.ph)*0.5*a.amp,-hip-bob*0.6);g.drawImage(m,0,0,m.width,hip*sx,-ww/2,0,ww,hip);armsDraw(SP,ww,hh,0,-sw*1.2,sw*1.2);g.restore();
labels(a,mine,x,top,k)}

// ---- human walk for the one-piece PNG body: split into torso, 2 arms, 2 thighs, 2 shins ----
// Fractions measured on the 600x1320 Night Bloom body (crotch y=940, legs split x=312, knee y~1110, arms free below y~690).
const HB={crotch:0.705,hipJ:0.675,knee:0.84,split:0.52,armY:0.52,armTop:0.47,armLX:0.362,armRX:0.686,shL:[0.37,0.49],shR:[0.66,0.49]};
function bodyParts(m){if(m._hp)return m._hp;const W=m.width,H=m.height,mk=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c};
 const t=mk(),tc=t.getContext('2d');tc.drawImage(m,0,0);tc.clearRect(0,H*HB.crotch+2,W,H);
 const aL=mk(),aR=mk(),y0=H*HB.armY;
 [[aL,0,W*HB.armLX],[aR,W*HB.armRX,W]].forEach(([c,x0,x1])=>{const x=c.getContext('2d');x.drawImage(m,x0,y0,x1-x0,H*0.78-y0,x0,y0,x1-x0,H*0.78-y0);
  // soften the top edge of the arm so the seam at the shoulder is invisible
  x.globalCompositeOperation='destination-out';const gr=x.createLinearGradient(0,y0,0,y0+H*0.03);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(x0,y0,x1-x0,H*0.03);
  tc.clearRect(x0,y0+H*0.02,x1-x0,H*0.78)});
 return m._hp={t,aL,aR}}
function humanWalk(a,SP,m,x,y,hh,ww,k,mine){
 const W=m.width,H=m.height,s=ww/W,P=bodyParts(m),A=a.amp,p=a.ph;
 const hipY=H*HB.hipJ,kneeY=H*HB.knee,thL=(kneeY-hipY)*s,shL=(H-kneeY)*s;
 // each leg: thigh angle + knee flex (knee bends while the leg swings forward, straight when planted)
 const legA=ph=>{const th=-0.42*Math.sin(ph)*A,fl=0.75*A*Math.pow(Math.max(0,Math.cos(ph)),1.6)+0.06*A;return{th,fl,len:thL*Math.cos(th)+shL*Math.cos(th+fl)}};
 const L=legA(p),R=legA(p+Math.PI),full=thL+shL,drop=full-Math.max(L.len,R.len);
 const top=y-hh+drop+0.4*k*A*Math.abs(Math.sin(p*1))*0; // planted foot always touches the ground -> natural bob
 g.save();g.globalAlpha=0.22;g.translate(x,y);g.transform(1,0,0.9,0.32,0,0);g.drawImage(sil(m),-ww/2,-hh,ww,hh);g.restore();
 g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(x,y,ww*0.32,hh*0.06+1,0,0,7);g.fill();
 g.save();g.translate(x,top);if(a.fl)g.scale(-1,1);g.translate(-ww/2,0);g.imageSmoothingQuality='high';
 const leg=(x0,x1,q)=>{const sx0=W*x0,sw=W*(x1-x0),px=(sx0+sw/2)*s;g.save();g.translate(px,hipY*s);g.rotate(q.th);
  const ty=H*HB.crotch-6; g.drawImage(m,sx0,ty,sw,kneeY+8-ty,sx0*s-px,(ty-hipY)*s,sw*s,(kneeY+8-ty)*s);
  g.translate(0,thL);g.rotate(q.fl);g.drawImage(m,sx0,kneeY,sw,H-kneeY,sx0*s-px,0,sw*s,shL);g.restore()};
 const armA=0.32*Math.sin(p)*A;
 const arm=(c,sh,an)=>{const px=W*sh[0]*s,py=H*sh[1]*s;g.save();g.translate(px,py);g.rotate(an);g.drawImage(c,-px,-py,ww,H*s);g.restore()};
 // far side first, then body, then near side
 arm(P.aR,HB.shR,-armA);leg(HB.split,0.75,R);leg(0.33,HB.split,L);
 g.save();g.translate(ww/2,hipY*s);g.rotate(0.035*A+Math.sin(p*2)*0.01*A);g.translate(-ww/2,-hipY*s);g.drawImage(P.t,0,0,ww,H*s);g.restore();
 arm(P.aL,HB.shL,armA);
 g.restore();labels(a,mine,x,top,k)}
function labels(a,mine,x,t,k){if(a.emo&&Date.now()-a.et<3500){g.font=Math.round(18*k)+'px serif';g.textAlign='center';g.fillText(a.emo,x,t-(a.say&&Date.now()-a.st<4000?40:20)-Math.sin(Date.now()/150)*3)}if(a.hat){g.font=Math.round(16*k)+'px serif';g.textAlign='center';g.fillText(a.hat,x,t-2)}
g.font='bold '+Math.round(8*k)+'px system-ui';g.textAlign='center';g.strokeStyle='rgba(0,0,0,.7)';g.lineWidth=2.5;const nm=a.n||S.name;g.strokeText(nm,x,t-6);g.fillStyle=mine?'#ffd24a':'#fff';g.fillText(nm,x,t-6);
if(a.say&&Date.now()-a.st<4000){g.font='11px system-ui';const tw=g.measureText(a.say).width+14;g.fillStyle='#fff';g.beginPath();g.roundRect(x-tw/2,t-34,tw,20,7);g.fill();g.fillStyle='#111';g.fillText(a.say,x,t-20)}}
let fishing=false;
let bgOk=true;
const others={};
let sc=1,cx=0,cy=0,zoom=1;
const activePointers=new Map();let pinchStart=0,pinchZoom=1;
let last=performance.now();
function loop(){const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;const d=devicePixelRatio||1,vw=innerWidth,vh=innerHeight;if(cv.width!==vw*d||cv.height!==vh*d){cv.width=vw*d;cv.height=vh*d}
sc=Math.max(vw/W,vh/H)*zoom;cx=Math.max(0,Math.min(W*sc-vw,me.x*sc-vw/2));cy=Math.max(0,Math.min(H*sc-vh,me.y*sc-vh/2));g.setTransform(d*sc,0,0,d*sc,-cx*d,-cy*d);{const r=ROOMS[ROOM];r.ok?g.drawImage(r.img,0,0,W,H):(R('#2a1c14',0,0,W,H));drawDoors()}step(me,dt);Object.assign(me,{skin:S.skin,hair:S.hair,shirt:S.shirt,hat:S.hat,look:S.look});
const L=[{z:me.sit!=null?SEATS[me.sit][2]+.5:me.y,f:()=>avatar(me,1)}];Object.values(others).forEach(o=>{o.x+=(o.tx-o.x)*.2;o.y+=(o.ty-o.y)*.2;L.push({z:o.sit!=null&&SEATS[o.sit]?SEATS[o.sit][2]+.5:o.y,f:()=>avatar(o,0)})});
if(bgOk)OBJ.forEach(o=>o.m.complete&&L.push({z:o.z,f:()=>{const k=0.84;g.drawImage(o.m,o.x+(o.m.width-o.m.width*k)/2,o.y+(o.m.height-o.m.height*k),o.m.width*k,o.m.height*k)}}));L.sort((p,q)=>p.z-q.z).forEach(e=>e.f());
const sb=document.getElementById('bSit'),ns=seatAt(me.x,me.y);sb.style.display=(me.sit!=null||ns>=0)?'':'none';sb.textContent=me.sit!=null?'🧍':'🪑';sb.title=me.sit!=null?'قوم':'اقعد';
const near=onPier(me.x,me.y),b=document.getElementById('bF');b.disabled=!near||fishing;b.textContent=fishing?'⏳':'🎣';
document.getElementById('gold').textContent='🪙 '+S.gold;requestAnimationFrame(loop)}
cv.addEventListener('pointerdown',e=>{activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(activePointers.size===2){const a=[...activePointers.values()];pinchStart=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);pinchZoom=zoom;return}if(activePointers.size>1)return;const r=cv.getBoundingClientRect(),wx=(e.clientX-r.left+cx)/sc,wy=(e.clientY-r.top+cy)/sc;
const dr=ROOMS[ROOM].doors.find(d=>Math.abs(d.x-wx)<45&&Math.abs(d.y-wy)<16);if(dr){goRoom(dr.to);sync();return}
const si=SEATS.findIndex(s=>Math.hypot(s[0]-wx,s[1]-wy)<22);
if(si>=0){if(me.sit!=null)me.sit=null;me.want=si;me.tx=SEATS[si][0];me.ty=SEATS[si][1];return}
if(me.sit!=null){me.sit=null;me.y+=5;if(!ok(me.x,me.y)||blocked(me.x,me.y))me.y-=5}
me.want=null;me.tx=wx;me.ty=wy;});
cv.addEventListener('pointermove',e=>{if(!activePointers.has(e.pointerId))return;activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(activePointers.size>=2&&pinchStart>0){const a=[...activePointers.values()];const dist=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);zoom=Math.max(0.75,Math.min(2.4,pinchZoom*dist/pinchStart));}});
function clearPointer(e){activePointers.delete(e.pointerId);if(activePointers.size<2)pinchStart=0}
cv.addEventListener('pointerup',clearPointer);cv.addEventListener('pointercancel',clearPointer);cv.addEventListener('pointerleave',e=>{if(e.buttons===0)clearPointer(e)});cv.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.75,Math.min(2.4,zoom*(e.deltaY<0?1.1:.9)))},{passive:false});
document.getElementById('bSit').onclick=()=>{if(me.sit!=null){const old=me.sit;me.sit=null;me.y+=7;if(!ok(me.x,me.y)||blocked(me.x,me.y,old))me.y-=7;me.want=null;me.tx=me.x;me.ty=me.y;return}const i=seatAt(me.x,me.y);if(i<0)return;if(Object.values(others).some(o=>o.sit===i))return say('الكرسي ده محجوز 😅');me.want=i;me.tx=SEATS[i][0];me.ty=SEATS[i][1]};
function say(t){me.say=t;me.st=Date.now()}
async function send(){const i=document.getElementById('ch');const text=i.value.trim();if(!text)return;i.value='';say(text);logLine('<b>'+esc(S.name)+':</b> '+esc(text));if(!realtimeChannel||!currentUser){console.warn('Chat message was only shown locally because Realtime is not connected.');return}try{const payload={...realtimePayload(),message:text.slice(0,60),sentAt:Date.now()};const result=await realtimeChannel.send({type:'broadcast',event:'chat',payload});if(result&&result!=='ok'&&result.status!=='ok')console.warn('Chat broadcast status:',result)}catch(e){console.warn('Chat broadcast failed:',e);say('تعذر إرسال الرسالة؛ تحقق من الاتصال')}}
document.getElementById('send').onclick=send;document.getElementById('ch').onkeydown=e=>{if(e.key==='Enter')send()};
document.getElementById('bF').onclick=()=>{fishing=true;say('🎣 ...');setTimeout(()=>{fishing=false;if(Math.random()<.75){const r=5+(Math.random()*20|0);S.gold+=r;say('🐟 +'+r+' دهب!')}else say('السمكة هربت 😅');save()},2500)};
const Pn=document.getElementById('panel');let tab='';
function open(t){tab=tab===t?'':t;render()}
document.getElementById('bS').onclick=()=>open('s');
const sk=['#f1c27d','#e0ac69','#c68642','#8d5524','#ffdbac'],hr=['#3b2a1a','#111','#6b4423','#d9a441','#c0392b','#7d3cff'],sh=['#e14a4a','#2a7de1','#3aa76d','#d96ad9','#f5a623','#222','#fff'];
const items=[['👓','نظارة',40],['🎩','قبعة',60],['🧢','كاب',50],['👑','تاج',150],['🎧','سماعة',80]];
function sws(k,a){return a.map(c=>`<span class="sw ${S[k]===c?'on':''}" style="background:${c}" onclick="S.${k}='${c}';save();render()"></span>`).join('')}
function render(){if(!tab){Pn.style.display='none';return}Pn.style.display='block';
if(tab==='c')Pn.innerHTML=`<div>الاسم: <input value="${S.name}" maxlength="12" oninput="S.name=this.value||'لاعب';save()"></div><div>الشخصية: ${[1,2,3].map(i=>`<img src="assets/char${i}.png" class="pk ${S.ch===i?'on':''}" onclick="S.ch=${i};save();render()">`).join('')}</div><div>البشرة: ${sws('skin',sk)}</div><div>الشعر: ${sws('hair',hr)}</div><div>التيشرت: ${sws('shirt',sh)}</div><div>الإكسسوار: ${S.owned.filter(x=>x).concat(['']).map(h=>`<button class="${S.hat===h?'p':''}" onclick="S.hat='${h}';save();render()">${h||'بدون'}</button>`).join(' ')}</div>`;
else Pn.innerHTML=items.map(i=>`<div class="it"><span>${i[0]} ${i[1]}</span>${S.owned.includes(i[0])?'<small>ملكك ✓</small>':`<button ${S.gold<i[2]?'disabled':''} onclick="buy('${i[0]}',${i[2]})">🪙 ${i[2]}</button>`}</div>`).join('')}
function buy(h,p){if(S.gold<p)return;S.gold-=p;S.owned.push(h);S.hat=h;save();render()}
loop();
// Supabase Realtime v2 multiplayer. Auth itself is kept intact.
let currentUser=null, realtimeChannel=null, realtimeTimer=null, presenceTimer=null;
const realtimeSeen=new Set();
function realtimeRemovePlayer(id){ if(id) delete others['sb-'+id]; }
function realtimeUpsertPlayer(data){
  if(!data || data.userId===currentUser?.id) return;
  if((data.room||'street')!==ROOM){delete others['sb-'+String(data.userId||data.name)];return}
  const id=String(data.userId || data.name || 'player');
  const x=Number(data.x), y=Number(data.y);
  if(!Number.isFinite(x)||!Number.isFinite(y)) return;
  let o=others['sb-'+id];
  if(!o) o=others['sb-'+id]={x,y,tx:x,ty:y,st:Date.now()};
  o.tx=x; o.ty=y; o.n=String(data.name||'لاعب');
  o.skin=data.skin||'#f1c27d'; o.hair=data.hair||'#3b2a1a'; o.shirt=data.shirt||'#e14a4a';
  o.hat=data.hat||''; o.look=cleanLook(data.look); o.sit=null; o.room=data.room||'street';
  realtimeSeen.add(id);
}
function realtimePayload(){
  return { userId:currentUser?.id || '', x:Number(me.x)||0, y:Number(me.y)||0,
    name:String(S.name||'لاعب').slice(0,16), skin:S.skin, hair:S.hair,
    shirt:S.shirt, hat:S.hat, look:S.look, room:ROOM };
}
function realtimeApplyPresence(){
  if(!realtimeChannel) return;
  const state=realtimeChannel.presenceState();
  const alive=new Set();
  Object.values(state).forEach(metas=>{
    (Array.isArray(metas)?metas:[]).forEach(meta=>{
      const data=meta?.state || meta;
      if(data?.userId && data.userId!==currentUser?.id){alive.add(String(data.userId));realtimeUpsertPlayer(data)}
    });
  });
  for(const id of Array.from(realtimeSeen)) if(!alive.has(id)){realtimeRemovePlayer(id);realtimeSeen.delete(id)}
}
async function startRealtime(){
  if(realtimeChannel || !currentUser) return;
  const client=window.gameSupabase;
  if(!client){say('تعذر بدء الأونلاين: عميل Supabase غير جاهز.');return}
  const username=String(S.name||currentUser.user_metadata?.username||currentUser.email?.split('@')[0]||'لاعب').trim().slice(0,16)||'لاعب';
  const channel=client.channel('cairo50-room',{config:{presence:{key:username},broadcast:{self:false}}});
  realtimeChannel=channel;
  channel.on('presence',{event:'sync'},()=>realtimeApplyPresence());
  channel.on('presence',{event:'join'},({newPresences})=>{
    (newPresences||[]).forEach(meta=>realtimeUpsertPlayer(meta?.state||meta));
  });
  channel.on('presence',{event:'leave'},({leftPresences})=>{
    (leftPresences||[]).forEach(meta=>{const id=String((meta?.state||meta)?.userId||'');realtimeRemovePlayer(id);realtimeSeen.delete(id)});
  });
  channel.on('broadcast',{event:'move'},({payload})=>{
    if(payload && payload.userId!==currentUser?.id) realtimeUpsertPlayer(payload);
  });
  // Chat uses its own Broadcast event on the same shared room.
  channel.on('broadcast',{event:'emote'},({payload})=>{if(!payload||payload.userId===currentUser?.id)return;realtimeUpsertPlayer(payload);const o=others['sb-'+String(payload.userId)];if(o){o.emo=String(payload.emo||'').slice(0,4);o.et=Date.now();if(payload.dance){o.dance=1;o.dt=Date.now()}}});
  channel.on('broadcast',{event:'chat'},({payload})=>{
    if(!payload || !payload.userId || payload.userId===currentUser?.id) return;
    realtimeUpsertPlayer(payload);
    const other=others['sb-'+String(payload.userId)];
    if(other && typeof payload.message==='string'){other.say=payload.message.slice(0,60);other.st=Date.now();logLine('<b>'+esc(other.n)+':</b> '+esc(other.say))}
  });
  channel.subscribe(async status=>{
    if(status==='SUBSCRIBED'){
      try{
        await channel.track(realtimePayload());
        // Presence is for join/leave and recovery; Broadcast carries fast movement.
        // Tracking presence every 50ms would create needless presence churn.
        if(presenceTimer)clearInterval(presenceTimer);
        presenceTimer=setInterval(()=>{
          if(realtimeChannel===channel) channel.track(realtimePayload()).catch(e=>console.warn('Presence track failed',e));
        },5000);
        if(realtimeTimer)clearInterval(realtimeTimer);
        realtimeTimer=setInterval(()=>{
          if(realtimeChannel!==channel)return;
          const p=realtimePayload();
          channel.send({type:'broadcast',event:'move',payload:p}).catch(e=>console.warn('Movement broadcast failed',e));
        },50);
        realtimeApplyPresence();
        say('🌐 أونلاين — روم cairo50-room');
      }catch(e){console.error('Supabase Realtime subscribe setup failed',e);say('فشل تشغيل الأونلاين؛ راجع إعدادات Realtime في Supabase.')}
    }else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'||status==='CLOSED'){
      console.error('Supabase Realtime channel status:',status);
      say('اتصال الأونلاين اتقطع؛ حدّث الصفحة وحاول تاني.');
    }
  });
}
function disconnectRealtime(){
  if(realtimeTimer)clearInterval(realtimeTimer);realtimeTimer=null;
  if(presenceTimer)clearInterval(presenceTimer);presenceTimer=null;
  const old=realtimeChannel;realtimeChannel=null;
  realtimeSeen.forEach(realtimeRemovePlayer);realtimeSeen.clear();
  if(old && window.gameSupabase) window.gameSupabase.removeChannel(old).catch(e=>console.warn('Channel cleanup failed',e));
}

// start screen: dress-up creator + name
(function(){const st=document.getElementById('start'),nm=document.getElementById('nm');nm.value=S.name==='لاعب'?'':S.name;
makeCreator(S.look,save);
document.getElementById('go').onclick=()=>{const n=nm.value.trim();if(!n)return alert('اكتب اسم شخصيتك');S.name=n.slice(0,12);S.ch=1;save();st.style.display='none'};
document.getElementById('bC').onclick=()=>{nm.value=S.name==='لاعب'?'':S.name;st.style.display='flex'};})();

document.getElementById('fs').onclick=()=>{const e=document.documentElement;document.fullscreenElement?document.exitFullscreen():(e.requestFullscreen||e.webkitRequestFullscreen||(()=>{})).call(e);try{screen.orientation.lock('landscape')}catch(_){}};

const GP=document.getElementById('gearP');document.getElementById('gear').onclick=()=>GP.style.display='flex';document.getElementById('gx').onclick=()=>GP.style.display='none';
document.getElementById('chg').onclick=()=>{GP.style.display='none';document.getElementById('start').style.display='flex'};

// Supabase authentication and player profile persistence.
(function setupAuth(){
  const authRoot=document.getElementById('auth');
  if(!window.supabase){document.getElementById('authStatus').textContent='تعذر تحميل خدمة الحسابات. تحقق من الإنترنت ثم أعد تحميل الصفحة.';return;}
  const SUPABASE_URL='https://zklsggugbqasamvpumgw.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY='sb_publishable_rt6xbelrp6IJ5zvJfkoC5w_eeMqzG4G';
  const authClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
  // Share this same client with multiplayer; authentication setup/flows remain unchanged.
  window.gameSupabase=authClient;
  const status=document.getElementById('authStatus'),submit=document.getElementById('authSubmit'),userRow=document.getElementById('usernameRow');
  let mode='login',busy=false;
  const msg=(text,good=false)=>{status.textContent=text;status.className=good?'good':''};
  function setMode(m){mode=m;document.getElementById('tabLogin').classList.toggle('p',m==='login');document.getElementById('tabRegister').classList.toggle('p',m==='register');userRow.style.display=m==='register'?'flex':'none';submit.textContent=m==='register'?'إنشاء الحساب':'دخول إلى العالم';document.getElementById('authPass').autocomplete=m==='register'?'new-password':'current-password';msg('');}
  document.getElementById('tabLogin').onclick=()=>setMode('login');document.getElementById('tabRegister').onclick=()=>setMode('register');
  async function saveProfile(user){
    const username=String(user.user_metadata?.username||user.email?.split('@')[0]||'لاعب').trim().slice(0,16)||'لاعب';
    // Uses a profile table with RLS; auth user ID is the row key, never trust a client-supplied ID.
    const {error}=await authClient.from('players').upsert({id:user.id,email:user.email,username,updated_at:new Date().toISOString()},{onConflict:'id'});
    if(error)console.warn('Profile save failed. Run supabase_setup.sql in Supabase SQL Editor.',error.message);
    S.name=username.slice(0,12);save();
  }
  async function enter(user,session){
    currentUser=user;await saveProfile(user);
    document.getElementById('nm').value=S.name;
    authRoot.style.display='none';
    document.getElementById('ch').disabled=false;document.getElementById('send').disabled=false;
    // Join the shared Supabase Realtime room only after Supabase authentication succeeds.
    startRealtime();
    msg('');
  }
  submit.onclick=async()=>{
    if(busy)return;const email=document.getElementById('authEmail').value.trim().toLowerCase(),password=document.getElementById('authPass').value,username=document.getElementById('authUser').value.trim();
    if(!email||!/^\S+@\S+\.\S+$/.test(email)){msg('اكتب بريد إلكتروني صحيح.');return}
    if(password.length<6){msg('كلمة المرور لازم تكون 6 أحرف على الأقل.');return}
    if(mode==='register'&&username.length<2){msg('اكتب اسم لاعب من حرفين على الأقل.');return}
    busy=true;submit.disabled=true;msg('جاري المعالجة...');
    try{
      if(mode==='register'){
        const {data,error}=await authClient.auth.signUp({email,password,options:{data:{username},emailRedirectTo:location.origin}});
        if(error)throw error;
        if(data.session&&data.user){await saveProfile(data.user);msg('تم إنشاء الحساب. تقدر تدخل العالم الآن.',true);await enter(data.user,data.session)}
        else msg('تم إنشاء الطلب. افتح بريدك واضغط رابط تأكيد الحساب، ثم ارجع وسجّل الدخول.',true);
      }else{
        const {data,error}=await authClient.auth.signInWithPassword({email,password});if(error)throw error;
        if(!data.session||!data.user)throw new Error('لم يتم إنشاء جلسة دخول. حاول مرة أخرى.');
        await enter(data.user,data.session);
      }
    }catch(e){msg(e.message||'حصل خطأ، حاول مرة أخرى.')}finally{busy=false;submit.disabled=false}
  };
  document.getElementById('forgotPass').onclick=async()=>{
    const email=document.getElementById('authEmail').value.trim();if(!email){msg('اكتب بريدك الإلكتروني أولًا.');return}
    const {error}=await authClient.auth.resetPasswordForEmail(email,{redirectTo:location.origin});msg(error?error.message:'لو البريد مسجل، هيوصلك رابط استعادة كلمة المرور.',!error);
  };
  document.getElementById('ch').disabled=true;document.getElementById('send').disabled=true;
  authClient.auth.getSession().then(async({data,error})=>{if(error){msg(error.message);return}if(data.session?.user)await enter(data.session.user,data.session)});
  authClient.auth.onAuthStateChange((event,session)=>{
    if(event==='SIGNED_OUT'){currentUser=null;disconnectRealtime();authRoot.style.display='flex';document.getElementById('start').style.display='none';}
  });
  // Add a sign-out action to settings.
  const out=document.createElement('button');out.id='signOut';out.textContent='🚪 تسجيل الخروج';out.className='p';document.querySelector('#gearP .card').appendChild(out);
  out.onclick=async()=>{const {error}=await authClient.auth.signOut();if(error)msg(error.message);else{document.getElementById('gearP').style.display='none';document.getElementById('start').style.display='none';}};
})();

// ---- Sanalika-style extras: doors, map, emotes, chat log ----
function esc(t){return String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function drawDoors(){const t=Date.now()/400;ROOMS[ROOM].doors.forEach(d=>{g.save();g.globalAlpha=.55+.35*Math.sin(t);g.fillStyle='#ffd24a';g.beginPath();g.ellipse(d.x,d.y,26,10,0,0,7);g.fill();g.restore();g.font='bold 11px system-ui';g.textAlign='center';const w=g.measureText(d.l).width+14;g.fillStyle='rgba(30,20,10,.82)';g.beginPath();g.roundRect(d.x-w/2,d.y-30,w,18,9);g.fill();g.fillStyle='#ffd24a';g.fillText(d.l,d.x,d.y-17)})}
function logLine(h){const L=document.getElementById('log');if(!L)return;const d=document.createElement('div');d.innerHTML=h;L.appendChild(d);while(L.children.length>40)L.firstChild.remove();L.scrollTop=1e9}
function sync(){if(realtimeChannel){realtimeChannel.track(realtimePayload()).catch(()=>{});realtimeChannel.send({type:'broadcast',event:'move',payload:realtimePayload()}).catch(()=>{})}}
function emote(e,dance){me.emo=e;me.et=Date.now();if(dance){me.dance=1;me.dt=Date.now()}if(realtimeChannel)realtimeChannel.send({type:'broadcast',event:'emote',payload:{...realtimePayload(),emo:e,dance:!!dance}}).catch(()=>{});document.getElementById('emoP').style.display='none'}
(function(){
 const EM=[['👋'],['😂'],['😍'],['😢'],['😡'],['😮'],['👍'],['❤️'],['🔥'],['💃',1],['🕺',1],['🎉',1]];
 const ep=document.getElementById('emoP');ep.innerHTML=EM.map(([e,d])=>`<button class="ic" data-e="${e}" data-d="${d?1:''}">${e}</button>`).join('');
 ep.onclick=ev=>{const b=ev.target.closest('button');if(b)emote(b.dataset.e,b.dataset.d)};
 document.getElementById('bE').onclick=()=>{ep.style.display=ep.style.display==='grid'?'none':'grid'};
 const mp=document.getElementById('mapP');mp.innerHTML='<h3>🗺 خريطة المدينة</h3>'+Object.entries(ROOMS).map(([k,r])=>`<button class="mapb" data-r="${k}"><img src="${r.bg}"><span>${r.name}</span></button>`).join('')+'<button id="mx">إغلاق</button>';
 mp.onclick=ev=>{if(ev.target.id==='mx'){mp.style.display='none';return}const b=ev.target.closest('.mapb');if(b){goRoom(b.dataset.r);sync()}};
 document.getElementById('bM').onclick=()=>{mp.style.display='grid'};
 document.getElementById('bL').onclick=()=>{const l=document.getElementById('log');l.classList.toggle('open')};
 document.getElementById('roomName').textContent=ROOMS[ROOM].name;
 setInterval(()=>{document.getElementById('roomName').textContent=ROOMS[ROOM].name},500);
 me.x=me.tx=ROOMS[ROOM].spawn[0];me.y=me.ty=ROOMS[ROOM].spawn[1];
})();
