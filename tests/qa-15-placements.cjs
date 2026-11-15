// Browser QA: ten distinct Fixed owners and five canonical Generated indoor scopes.
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const out='work/qa15';fs.mkdirSync(out,{recursive:true});
const ATLAS=JSON.parse(fs.readFileSync('assets/atlas.json','utf8'));
const fixed=[
 ['F01-h1-lake','h1','h1-lake-tree','near','outdoor'],
 ['F02-h2-courtyard','h2','h2-place-4','on','outdoor'],
 ['F03-hall-staff','hall','gf-staff','inside','inside'],
 ['F04-gryffindor','gryffindor-common','gryffindor-hearth','inside','inside'],
 ['F05-ravenclaw','ravenclaw-common','ravenclaw-hearth','inside','inside'],
 ['F06-hufflepuff','hufflepuff-common','huff-lounge','inside','inside'],
 ['F07-slytherin','slytherin-common','sly-lounge','inside','inside'],
 ['F08-village','village-static','v-home-3','inside','inside'],
 ['F09-quidditch','pitch-static','q-field','on','outdoor'],
 ['F10-express','express','coach-0-room-1','inside','inside']
];
const indoor=[
 ['I01-potions','DUNGEONS-N','DUNGEONS-N:01','inside','inside'],
 ['I02-north','F1-N','F1-N:01','inside','inside'],
 ['I03-dada','F2-W','F2-W:01','inside','inside'],
 ['I04-east','F3-E','F3-E:01','inside','inside'],
 ['I05-au','AU-CCC-07-18','AU-CCC-07-18:anteroom','inside','inside']
];
const cases=[...fixed.map(x=>({kind:'Fixed',label:x[0],anchor:x[1],placeId:x[2],relation:x[3],spot:x[4]})),...indoor.map(x=>({kind:'Indoor',label:x[0],anchor:x[1],placeId:x[2],relation:x[3],spot:x[4]}))];
function payload(c){
 const npc=Array.from({length:3},(_,i)=>({name:'NPC '+(i+1)+' '+c.label,placeId:c.placeId,relation:c.relation,spot:c.spot,tagType:'gryffindor',activity:'Đang trò chuyện và hoạt động trong khu vực.'}));
 const events=Array.from({length:2},(_,i)=>({id:c.label+'-event-'+i,title:'Sự kiện '+(i+1)+' '+c.label,placeId:c.placeId,relation:c.relation,hidden:!!i,detail:'Có một cơ hội khám phá hợp lệ ở đây.'}));
 return{schemaVersion:'2.0.0',atlasAnchor:c.anchor,meta:{date:'10/10/1992',time:'15:30',areaName:c.label+' · Kiểm thử',quote:'Bản đồ kiểm tra tương tác.'},pcPlace:c.placeId,pcSpot:c.spot,places:c.kind==='Indoor'?[(()=>{const p=ATLAS.clusters[c.anchor].rooms.find(x=>x.id===c.placeId);return{id:p.id,name:p.name,type:p.type,size:p.size||'M'};})()]:[],actors:[{name:'PC',isPC:true,placeId:c.placeId,relation:c.relation,spot:c.spot,tagType:'gryffindor'},...npc],events};
}
function reportRects(rects){
 let collisions=[];for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){
  const a=rects[i],b=rects[j],w=Math.max(0,Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left)),h=Math.max(0,Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top));
  if(w*h>4)collisions.push({a:a.name,b:b.name,area:Math.round(w*h)});
 }return collisions;
}
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const rows=[],screens=[];
 try{
 const p=await browser.newPage({viewport:{width:1340,height:900},deviceScaleFactor:1});
 p.on('pageerror',e=>{if(rows.length)rows[rows.length-1].pageError=(rows[rows.length-1].pageError||[]).concat(e.message)});
 await p.setContent(require('./runtime-fixture.cjs')(payload(cases[2])));
 await p.waitForFunction(()=>document.querySelector('#wzw-map')?.dataset.status==='ready',{timeout:60000});
 for(const c of cases){
  const row={case:c.label,kind:c.kind,atlasAnchor:c.anchor,placeId:c.placeId};
  rows.push(row);
  try{
   await p.evaluate(async d=>await WZWMap.render(d),payload(c));
   await p.waitForFunction(()=>document.querySelector('#wzw-map')?.dataset.status==='ready',{timeout:25000});
   const details=await p.evaluate(ref=>{
    const map=document.querySelector('#wzw-map'),tagEls=[...document.querySelectorAll('.qa-tags>.npc-tag')],eventEls=[...document.querySelectorAll('.qa-tags>.event-marker')];
    const rects=[...tagEls,...eventEls].map(n=>({name:n.textContent||n.getAttribute('aria-label'),r:n.getBoundingClientRect().toJSON()}));
    const exact=window.WZW_SCENE?.exact?.(ref);
    return{status:map?.dataset.status,canonicalId:exact?.id||null,tagCount:tagEls.length,eventCount:eventEls.length,rects,sidebarNPC:document.querySelector('#actors')?.textContent?.trim(),hear:document.querySelector('#activity')?.textContent?.trim(),observe:document.querySelector('#observation')?.textContent?.trim(),unresolved:window.WZW_SCENE?.unresolved?.length||0};
   },c.placeId);
   row.canonicalId=details.canonicalId;row.tags=details.tagCount;row.events=details.eventCount;row.overlaps=reportRects(details.rects);
   row.idle=details.sidebarNPC===''&&details.hear==='Đi khám phá nào'&&details.observe==='Đi khám phá nào';
   row.unresolved=details.unresolved;
   row.pass=details.status==='ready'&&!!details.canonicalId&&details.tagCount===4&&details.eventCount===2&&row.overlaps.length===0&&row.idle&&row.unresolved===0;
   row.errors=[];
   if(details.tagCount!==4)row.errors.push('tags '+details.tagCount+'/4');
   if(details.eventCount!==2)row.errors.push('events '+details.eventCount+'/2');
   if(row.overlaps.length)row.errors.push('overlap '+JSON.stringify(row.overlaps));
   if(!row.idle)row.errors.push('idle inspector');
   if(!details.canonicalId)row.errors.push('unresolved place');
   if(row.unresolved)row.errors.push('unresolved places '+row.unresolved);
   if(!row.pass&&!row.errors.length)row.errors.push('unexpected status');
   const shot=path.join(out,c.label+'.png');
   await p.screenshot({path:shot,animations:'disabled'});
   screens.push({label:c.label,file:shot,kind:c.kind});
  }catch(e){row.pass=false;row.errors=[String(e.stack||e).slice(0,500)];}
  console.log(c.label, row.pass?'PASS':'FAIL',JSON.stringify({tags:row.tags,events:row.events,canonicalId:row.canonicalId,errors:row.errors}));
 }
 await p.close();
 for(const type of ['Fixed','Indoor']){
  const entries=screens.filter(s=>s.kind===type);
  if(!entries.length)continue;
  const tileW=500,tileH=340,cols=2,rowsN=Math.ceil(entries.length/cols),height=rowsN*tileH+50;
  const cards=entries.map((e,i)=>{
   const data=fs.readFileSync(e.file).toString('base64');
   return '<div class="tile"><header>'+(i+1)+'. '+e.label+'</header><img src="data:image/png;base64,'+data+'"/></div>';
  }).join('');
  const html='<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:10px;background:#e4dbc8;font:600 16px sans-serif}.title{height:30px}.grid{display:grid;grid-template-columns:repeat(2,500px);gap:12px}.tile{height:325px;background:#f7f1e4;border:1px solid #baa890;overflow:hidden}.tile header{height:27px;padding:5px 10px;background:#e8dcc5}.tile img{display:block;width:100%;height:298px;object-fit:contain;object-position:center}</style></head><body><div class="title">MAP2 browser QA — '+type+'</div><div class="grid">'+cards+'</div></body></html>';
  const sheet=await browser.newPage({viewport:{width:1030,height},deviceScaleFactor:1});
  await sheet.setContent(html,{waitUntil:'load'});
  await sheet.screenshot({path:path.join(out,'CONTACT-'+type.toUpperCase()+'.png'),fullPage:true});
  await sheet.close();
 }
 fs.writeFileSync(path.join(out,'RESULTS.json'),JSON.stringify({total:rows.length,passed:rows.filter(x=>x.pass).length,fixed:rows.filter(x=>x.kind==='Fixed').length,indoor:rows.filter(x=>x.kind==='Indoor').length,cases:rows},null,2));
 }finally{await browser.close();}
 const bad=rows.filter(r=>!r.pass);console.log('RESULT',rows.length-bad.length+'/'+rows.length,'cases PASS; fixed',fixed.length,'indoor',indoor.length);
 if(bad.length){console.error('FAILED',JSON.stringify(bad));process.exit(1)}
})().catch(e=>{console.error(e);process.exit(1)});
