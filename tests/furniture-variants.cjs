const fs=require('fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{fs.mkdirSync('work',{recursive:true});const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setContent(require('./runtime-fixture.cjs')());await page.waitForFunction(()=>window.WZWMap&&document.querySelector('#wzw-map').dataset.status==='ready');
 const report=await page.evaluate(async({recipes,formulas})=>{
  const rows=[],ok=(v,m)=>{if(!v)throw Error(m);};
  const data=place=>({schemaVersion:'2.0.0',forceSandbox:true,mapMode:'indoor',atlasAnchor:'custom',pcPlace:place.id,pcSpot:'inside',places:[place],actors:[{name:'PC',isPC:true,placeId:place.id,spot:'inside'}],events:[],meta:{areaName:'Nội thất'}});
  const snapshot=()=>({shell:document.querySelector('[data-approved-shell]').outerHTML,layers:[...document.querySelectorAll('#mapmount>svg [data-layer]')].filter(n=>!n.closest('defs')).map(n=>n.getAttribute('data-layer')),objects:[...document.querySelectorAll('[data-instance]')].map(n=>({id:n.dataset.instance,transform:n.innerHTML}))});
  let changed=0;
  for(const [type,recipe]of Object.entries(recipes).filter(([,r])=>r.furnishing.mode==='seeded')){
   const place={id:'variant-room',name:type,type,size:'M',furniture:{variant:'approved',style:'approved'}};await WZWMap.render(data(place));const base=snapshot();
   for(const variant of recipe.furnishing.variants.filter(v=>v!=='approved')){
    await WZWMap.render(data({...place,furniture:{variant,style:'sage'}}));const next=snapshot(),inventory=WZW_SCENE.exact(place.id).inventory;
    ok(next.shell===base.shell,type+'/'+variant+' changed shell');ok(JSON.stringify(next.layers)===JSON.stringify(base.layers),type+'/'+variant+' changed layer order');
    ok(JSON.stringify(next.objects.map(o=>o.id))===JSON.stringify(base.objects.map(o=>o.id)),type+'/'+variant+' lost instances');
    const svg=document.querySelector('#mapmount>svg'),ids=[...svg.querySelectorAll('[id]')].map(n=>n.id);ok(ids.length===new Set(ids).size,type+' duplicate SVG IDs');
    const applied=inventory.furnishing.appliedVariant||'approved';if(applied!=='approved')changed++;
    rows.push({type,variant,applied,diagnostics:inventory.diagnostics});
   }
  }
  ok(changed>20,'fewer than 20 functional variants actually placed');
  const place={id:'stable-office',name:'Office A',type:'OFFICE',furniture:{variant:'perimeter',style:'slate'}};
  await WZWMap.render(data(place));const first=snapshot();await WZWMap.render(data({...place,name:'Office B'}));ok(JSON.stringify(snapshot())===JSON.stringify(first),'renaming changed furniture');
  const table=recipes.OFFICE.instancesBySize.M.find(o=>/desk/.test(o.item));
  await WZWMap.render(data({...place,furniture:{variant:'approved',style:'approved'},props:[{id:'book-on-desk',name:'Book',item:'accessory.book',op:'add',supportId:table.id}]}));
  const fp=WZW_SCENE.rendered.footprints,book=fp.find(o=>o.id==='book-on-desk:0'),support=fp.find(o=>o.id===table.id);ok(book?.supportId===table.id,'book detached from support');ok(book.bounds[0]>=support.supportBounds[0]&&book.bounds[1]>=support.supportBounds[1],'book outside desk');
  for(const [preset,p]of Object.entries(formulas.furniturePresets)){
   const pl={id:'special',name:'Preset',type:p.type,furniture:{preset}};await WZWMap.render(data({...pl,furniture:{variant:'approved',style:'approved',preset:'approved'}}));const shell=snapshot().shell;
   await WZWMap.render(data(pl));ok(snapshot().shell===shell,preset+' replaced shell');ok(WZW_SCENE.exact('special').inventory.furnishing.preset.id===preset,preset+' selection');
  }
  const special={id:'headmaster',name:'Office',type:'HEADMASTER_OFFICE'};await WZWMap.render(data(special));ok(WZW_SCENE.exact('headmaster').inventory.furnishing.style==='approved','special artwork colors changed by default');
  return{rows,placedVariants:changed,presets:Object.keys(formulas.furniturePresets).length,stableRename:true,supportPlacement:true,shellAndLayersUnchanged:true};
 },{recipes:JSON.parse(fs.readFileSync('assets/recipes.json')),formulas:JSON.parse(fs.readFileSync('assets/room-formulas.json'))});
 assert.deepEqual(errors,[]);await page.screenshot({path:'work/furniture-variants.png'});fs.writeFileSync('work/furniture-variants-qa.json',JSON.stringify({...report,errors},null,2));console.log('PASS furniture runtime',report.rows.length,'variants;',report.placedVariants,'placed;',report.presets,'presets; locked shells/layers, stable seeds and support placement');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
