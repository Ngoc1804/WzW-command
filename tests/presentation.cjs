const{chromium}=require('playwright'),fs=require('fs'),assert=require('assert');
(async()=>{fs.mkdirSync('work',{recursive:true});const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});let checks=[],errors=[];try{for(const mobile of [false,true]){const p=await b.newPage({viewport:mobile?{width:390,height:844}:{width:1280,height:900}});p.on('pageerror',e=>errors.push(e.message));await p.setContent(fs.readFileSync('examples/WIZAMAP_FIXED_UI.html','utf8'));await p.waitForFunction(()=>window.WZWTemplateUI?.state);
 const policy=await p.evaluate(async()=>{const rows=[];for(const id of Object.keys(DATA.maps)){await WZWTemplateUI.setTemplate(id);const map=DATA.maps[id],place=map.places[0],point={x:originalVB[0]+originalVB[2]*.5,y:originalVB[1]+originalVB[3]*.5};for(const inside of [true,false]){await WZWTemplateUI.mountActors([{name:'Kiểm vị trí',placeId:place.id,inside,scenePoint:point,footstep:'hidden'}]);const count=svg.querySelectorAll('[data-layer="actor-feet"]>g').length,expected=inside&&['h1','h2','village-static','diagon-knockturn'].includes(id)?0:1;if(count!==expected)throw Error(id+' inside='+inside+' feet '+count+' expected '+expected);rows.push({id,inside,count})}}return rows});checks.push({mobile,footstepPolicies:policy});
 await p.evaluate(async()=>{await WZWTemplateUI.setTemplate('hall');const place=DATA.maps.hall.places[1];await WZWTemplateUI.mountActors([{name:'Kiểm zoom',placeId:place.id,inside:true,scenePoint:{x:place.x,y:place.y},footstep:'walk'}]);WZWTemplateUI.mountEvents([{placeId:place.id,title:'Điểm neo'}])});
 const sample=()=>p.evaluate(()=>{const tag=document.querySelector('.qa-tags .npc-tag'),event=document.querySelector('.event-marker'),feet=svg.querySelector('[data-layer="actor-feet"]>g'),ctm=svg.getScreenCTM(),inverse=ctm.inverse(),t=tag.getBoundingClientRect(),e=event.getBoundingClientRect(),f=new DOMPoint(0,0).matrixTransform(feet.getScreenCTM()),world=new DOMPoint(e.x+e.width/2,e.y+e.height/2).matrixTransform(inverse);return{tag:{x:t.x+t.width/2,bottom:t.bottom,w:t.width},feet:{x:f.x,y:f.y},event:{x:world.x,y:world.y,w:e.width},scale:Math.hypot(ctm.a,ctm.b),gap:(f.y-t.bottom)/Math.hypot(ctm.a,ctm.b)}});
 const initial=await sample();for(const factor of [.8,.8,1.25,1.25]){await p.evaluate(f=>zoom(f),factor);const s=await sample();assert(Math.abs(s.tag.x-s.feet.x)<.1,'name/feet x mismatch');assert(Math.abs(s.event.x-initial.event.x)<.1&&Math.abs(s.event.y-initial.event.y)<.1,'event drift');assert(Math.abs(s.tag.w/initial.tag.w-s.scale/initial.scale)<.01,'tag scale mismatch');assert(Math.abs(s.event.w/initial.event.w-s.scale/initial.scale)<.01,'icon scale mismatch');assert(Math.abs(s.gap-initial.gap)<.1,'foot gap mismatch');}
 await p.evaluate(()=>{vb[0]+=80;vb[1]-=30;paintVB()});const pan=await sample();assert(Math.abs(pan.tag.x-pan.feet.x)<.1);assert(Math.abs(pan.event.x-initial.event.x)<.1);
 const walk=await p.evaluate(()=>{
  const tag=document.querySelector('.qa-tags .npc-tag').getBoundingClientRect();
  const shoes=[...svg.querySelectorAll('[data-layer="actor-feet"] use')].map(node=>{
   const {e:x,f:y,a,b}=node.transform.baseVal.consolidate().matrix;
   const bounds=node.getBoundingClientRect();
   return {side:node.getAttribute('href').slice(-1),x,y,a,b,underRibbon:bounds.top>=tag.bottom-.1&&bounds.left>=tag.left-.1&&bounds.right<=tag.right+.1};
  });
  return {shoes,steps:Array.from({length:6},(_,i)=>feetState(i*550,'walk')),beforePause:feetState(3299,'walk'),pauseStart:feetState(3300,'walk'),pauseEnd:feetState(5299,'walk'),restart:feetState(5300,'walk'),idle:[feetState(800),feetState(2400)],reduced:feetState(800,'walk',true)};
 });
 assert.deepEqual(walk.shoes.map(s=>s.side),['l','r','l','r','l','r']);
 assert.deepEqual(walk.shoes.map(s=>s.x),[-42.5,-25.5,-8.5,8.5,25.5,42.5]);
 assert.deepEqual(walk.shoes.map(s=>s.y),[-7,7,-7,7,-7,7]);
 assert(walk.shoes.every(s=>Math.abs(s.a)<.11&&s.b>.99&&s.underRibbon),'shoe points along the ribbon and stays beneath it');
 const only=i=>Array.from({length:6},(_,j)=>Number(i===j));
 assert.deepEqual(walk.steps,Array.from({length:6},(_,i)=>only(i)));
 assert.deepEqual(walk.beforePause,only(5));
 assert.deepEqual(walk.pauseStart,only(-1));
 assert.deepEqual(walk.pauseEnd,only(-1));
 assert.deepEqual(walk.restart,only(0));
 assert(walk.idle[0][0]>walk.idle[0][1]&&walk.idle[1][0]<walk.idle[1][1],'idle pair alternates ink');
 assert.deepEqual(walk.reduced,[.78,.78]);
 await p.screenshot({path:'work/presentation-'+(mobile?'mobile':'desktop')+'.png'});checks.push({mobile,zoomPanScale:'PASS',horizontalWalkCycle:'PASS'});await p.close();}
 const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.setContent(require('./runtime-fixture.cjs')());await p.waitForFunction(()=>window.WZWMap&&document.querySelector('#wzw-map').dataset.status==='ready');for(const mode of ['indoor','outdoor'])for(const spot of (mode==='indoor'?['inside']:['inside','outdoor'])){await p.evaluate(({mode,spot})=>WZWMap.render({schemaVersion:'2.0.0',forceSandbox:true,mapMode:mode,pcPlace:'r',pcSpot:spot,meta:{},places:[{id:'r',name:'R',type:mode==='indoor'?'OFFICE':'OUT_BUILDING_YARD'}],actors:[{name:'PC',isPC:true,placeId:'r',spot,footstep:'hidden'}],events:[]}),{mode,spot});assert.equal(await p.locator('.npc-tag').count(),1,mode+spot+' keeps actor tag');const c=await p.locator('[data-layer="actor-feet"]>g').count();assert.equal(c,1,mode+spot+' PC feet remain unless NPC inside building');checks.push({mode,spot,feet:c})}
 await p.evaluate(()=>WZWMap.render({schemaVersion:'2.0.0',forceSandbox:true,mapMode:'outdoor',pcPlace:'r',pcSpot:'outdoor',meta:{},places:[{id:'r',name:'Sân',type:'OUT_BUILDING_YARD'}],actors:[{name:'PC',isPC:true,placeId:'r',spot:'outdoor'},{name:'NPC trong nhà',placeId:'r',spot:'inside',footstep:'hidden'}],events:[]}));
 assert.equal(await p.locator('.npc-tag').count(),2,'both PC and indoor-building NPC have ribbons');
 assert.equal(await p.locator('[data-layer="actor-feet"]>g').count(),2,'generated scene retains PC and NPC feet');
 checks.push({mode:'outdoor',spot:'inside NPC on building',feet:2,actors:2});
 await p.close();
 assert.deepEqual(errors,[]);for(const f of ['examples/WIZAMAP_RUNTIME_CHECK.html','examples/WIZAMAP_MECHANISMS_CHECK.html','examples/WIZAMAP_LAYOUTS_H40_SML.html'])assert(!fs.existsSync(f));fs.writeFileSync('work/presentation-qa.json',JSON.stringify({checks,errors,targetPreview:'NOT RUN',scope:'Zoom/pan anchors, marker scaling and footstep rules. No artwork/layout redesign or replacement review HTML.'},null,2));console.log('PASS 13 Fixed policies × desktop/mobile, Generated Indoor/Outdoor, zoom/pan/tag/icon/feet alignment, horizontal walk cycle, retired HTMLs absent');}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
