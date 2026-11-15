// Browser regression: multiple rooms paint from rear to front as independent SVG stacks.
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1400,height:900}});
  await page.setContent(require('./runtime-fixture.cjs')());
  await page.waitForFunction(()=>window.WZWMap&&document.querySelector('#wzw-map').dataset.status==='ready');
  const checks=await page.evaluate(async()=>{
   const result=[],check=(value,label)=>{if(!value)throw Error(label);result.push(label);};
   const places=['OFFICE','CLASSROOM','STORAGE','POTIONS_LAB','STUDY_ROOM'].map((type,i)=>({id:'stack'+i,name:'Phòng '+i,type,size:'M'}));
   const data=(layoutType,rooms=places)=>({schemaVersion:'2.0.0',forceSandbox:true,mapMode:'indoor',layoutType,meta:{},pcPlace:rooms[0].id,pcSpot:'inside',places:rooms,actors:[{name:'PC',isPC:true,placeId:rooms[0].id,spot:'inside'}],events:[]});
   for(const layoutType of ['horizontal','vertical','windows','ell','tee','cross','court','cloister','curved','tower']){
    await WZWMap.render(data(layoutType));
    const plan=WZW_SCENE.rendered.geometry,svg=document.querySelector('#mapmount>svg'),stacks=svg.querySelector('[data-layer="room-stacks"]');
    check(!!stacks,layoutType+' room stack exists');
    const nodes=[...stacks.children],depths=nodes.map(n=>+n.getAttribute('data-depth'));
    check(nodes.length===plan.rooms.length,layoutType+' all rooms grouped');
    check(depths.every((depth,i)=>i===0||depth>=depths[i-1]),layoutType+' rear-to-front order');
    check(svg.querySelectorAll('[data-wall]').length===plan.walls.length,layoutType+' original wall count preserved');
    check(svg.querySelector('[data-layer="corridor-furniture"]')&&svg.querySelector('[data-layer="selection"]'),layoutType+' corridor and selection retained');
    for(const room of plan.rooms){
     const node=nodes.find(n=>+n.getAttribute('data-room-index')===room.index);
     check(!!node,layoutType+' room '+room.index+' has its own group');
     const names=[...node.children].map(c=>c.getAttribute('data-layer'));
     check(names.join(',')==='room-floor,room-back-wall,room-furniture,room-front-wall',layoutType+' room '+room.index+' wall/decor paint order');
     if(!room.circular)check(!!node.querySelector('[data-layer="room-floor"]>*'),layoutType+' room '+room.index+' floor retained');
    }
    const walls=[...svg.querySelectorAll('[data-wall]')];
    check(walls.every(n=>n.getAttribute('transform')?.startsWith('matrix(')&&!!n.querySelector('path[d]')),layoutType+' exact source wall shapes retained');
    // Room walls must be assigned once; corridor-only walls may remain static.
    check(walls.every(n=>!!n.closest('[data-layer="room-depth"]')||!!n.closest('[data-layer="architecture"]')),layoutType+' wall ownership valid');
   }
   await WZWMap.render(data('horizontal',[places[0]]));
   check(!document.querySelector('[data-layer="room-stacks"]'),'single approved room untouched');
   return result;
  });
  assert(checks.length>100);
  console.log('PASS room-depth browser regression',checks.length,'checks; all ten corridor layouts');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
