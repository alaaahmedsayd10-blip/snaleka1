// Night Bloom avatar body + wearable layers (600x1320 transparent PNGs, aligned to the body).
window.AVATAR_PACK={
 enabled:true,
 base:'avatar/',
 w:600,h:1320,
 order:['body','shoes','bottom','top','eyes','brows','nose','mouth','hair','glasses','tats','face','acc'],
 slots:[
  {k:'body',t:'الجسم',required:1,def:'night_bloom',crop:[0,0,150,330]},
  {k:'eyes',t:'العيون',def:'floral',crop:[38,14,74,112]},
  {k:'brows',t:'الحواجب',def:'furrowed',crop:[38,14,74,112]},
  {k:'nose',t:'الأنف',def:'ring',crop:[38,14,74,112]},
  {k:'mouth',t:'الفم',def:'flirt',crop:[38,14,74,112]},
  {k:'glasses',t:'النظارة',def:'kpop',crop:[20,14,110,140]},
  {k:'hair',t:'الشعر',def:'burst',crop:[38,14,74,112]},
  {k:'top',t:'القميص',def:'spiked_denim',crop:[20,120,110,110]},
  {k:'bottom',t:'البنطلون',def:'breezy',crop:[20,190,110,130]},
  {k:'shoes',t:'الجزمة',def:'airmojo',crop:[30,270,90,50]},
  {k:'tats',t:'التاتو',crop:[20,120,110,200]},
  {k:'face',t:'الوش',crop:[38,14,74,112]},
  {k:'acc',t:'إكسسوار',crop:[38,14,74,112]}
 ],
 items:{
  body:[{id:'night_bloom',name:'Night Bloom',front:'body/night_bloom_front.png',back:'body/night_bloom_back.png'}],
  eyes:[{id:'floral',name:'Soft Floral Eyes',rar:'e',front:'eyes/floral_front.png',back:false}],
  brows:[{id:'furrowed',name:'Furrowed Brows',rar:'c',front:'brows/furrowed_front.png',back:false}],
  nose:[{id:'ring',name:'Nose Ring',rar:'c',front:'nose/ring_front.png',back:false}],
  mouth:[{id:'flirt',name:'Fangless Flirt',rar:'e',front:'mouth/flirt_front.png',back:false}],
  glasses:[{id:'kpop',name:'Kpop Glasses',rar:'e',front:'glasses/kpop_front.png',back:false}],
  hair:[{id:'burst',name:'Burst Fade Mullet',rar:'r',front:'hair/burst_front.png',back:'hair/burst_back.png'}],
  top:[{id:'spiked_denim',name:'Spiked Denim Jacket',rar:'e',front:'top/spiked_denim_front.png',back:'top/spiked_denim_back.png'}],
  bottom:[{id:'breezy',name:'White Breezy Jeans',rar:'r',front:'bottom/breezy_front.png',back:'bottom/breezy_back.png'}],
  shoes:[{id:'airmojo',name:'White Airmojo 21s',rar:'r',front:'shoes/airmojo_front.png',back:'shoes/airmojo_back.png'}],
  tats:[],face:[],acc:[]
 }
};
