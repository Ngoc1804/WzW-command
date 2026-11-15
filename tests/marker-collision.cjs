// Marker collision integration: NPC ribbons and Event icons share an anchored placement field.
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const cases=[
   {name:'Fixed hall',atlasAnchor:'hall',placeId:'gf-staff',spot:'inside'},
   {name:'Generated indoor',atlasAnchor:'custom',placeId:'room',spot:'inside',forceSandbox:true,mapMode:'indoor',type:'OFFICE'}
  ];
  let checks=0;
  for(const tc of cases){
   const page=await browser.newPage({viewport:{width:1400,height:1000}});
   const places=tc.forceSandbox?[{id:tc.placeId,name:'Phòng',type:tc.type,size:'M'}]:[];
   const actors=[{name:'PC',isPC:true,placeId:tc.placeId,spot:tc.spot},...Array.from({length:3},(_,i)=>({name:'NPC_'+i,placeId:tc.placeId,spot:tc.spot,tagType:'gryffindor'}))];
   const events=Array.from({length:3},(_,i)=>({title:'Đầu mối '+i,placeId:tc.placeId,hidden:!!(i%2)}));
   const data={schemaVersion:'2.0.0',meta:{areaName:'Kiểm chồng marker'},atlasAnchor:tc.atlasAnchor,pcPlace:tc.placeId,pcSpot:tc.spot,places,actors,events,...(tc.forceSandbox?{forceSandbox:true,mapMode:'indoor'}:{})};
   await page.setContent(require('./runtime-fixture.cjs')(data));
   await page.waitForFunction(()=>['ready','text-fallback','invalid-data'].includes(document.querySelector('#wzw-map')?.dataset.status),{timeout:60000});
   const state=await page.locator('#wzw-map').getAttribute('data-status');
   assert.equal(state,'ready',tc.name+' map initialization');
   const initial=await page.evaluate(()=>{
    const tags=[...document.querySelectorAll('.qa-tags>.npc-tag')],evs=[...document.querySelectorAll('.qa-tags>.event-marker')];
    const bounds=[...tags,...evs].map(n=>({name:n.textContent||n.getAttribute('aria-label'),r:n.getBoundingClientRect().toJSON()}));
    const collisions=[];for(let i=0;i<bounds.length;i++)for(let j=i+1;j<bounds.length;j++){
     const a=bounds[i].r,b=bounds[j].r,w=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left)),h=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
     if(w*h>2)collisions.push([bounds[i].name,bounds[j].name,Math.round(w*h)]);
    }
    return{tags:tags.length,events:evs.length,collisions,points:bounds};
   });
   assert.equal(initial.tags,4,tc.name+' four actor ribbons');
   assert.equal(initial.events,3,tc.name+' three event icons');
   assert.deepEqual(initial.collisions,[],tc.name+' overlapping markers: '+JSON.stringify(initial.collisions));
   checks+=3;
   await page.close();
  }
  console.log('PASS marker collision',checks,'assertions across fixed and generated maps');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
