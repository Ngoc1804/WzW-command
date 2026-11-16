const fs=require('fs'),vm=require('vm'),zlib=require('zlib'),assert=require('assert'),{chromium}=require('playwright');
const html=fs.readFileSync('examples/WIZAMAP_FIXED_UI.html','utf8');
const DATA=JSON.parse(zlib.gunzipSync(Buffer.from(html.match(/id="wzw-embedded-atlas"[^>]*>(.*?)<\/script>/s)[1],'base64')));
const ATLAS=JSON.parse(fs.readFileSync('assets/atlas.json')),VOCAB=JSON.parse(fs.readFileSync('assets/vocabulary.json')),RECIPES=JSON.parse(fs.readFileSync('assets/recipes.json'));
const ctx=vm.createContext({DATA,ATLAS,VOCAB,RECIPES,KEYS:['unknown','gryffindor']});
vm.runInContext(['contract','props','resolver'].map(n=>fs.readFileSync('src/'+n+'.js','utf8')).join('\n')+';globalThis.run=x=>resolve(normalize(x))',ctx);
function payload(owner,key,places=[]){return{schemaVersion:'2.0.0',atlasAnchor:owner,pcPlace:key,pcSpot:'inside',meta:{areaName:'Khu Bắc · Tầng 5'},places,actors:[{name:'PC',isPC:true,placeId:key}],events:[]};}
for(const [owner,key,id,label] of [['h1','quidditch','region:extra:4','Sân Quidditch'],['h1','black-lake','region-3','Hồ Đen'],['h1','hagrid-hut','region:extra:5','Nhà Hagrid'],['F5-N','hogwarts-library','F5-N:01','Thư viện Hogwarts']]){
 const r=ctx.run(payload(owner,key,[{id:key,name:label}]));
 assert.equal(r.exact(key)?.id,id,key);assert.equal(r.exact(key)?.name,label);
 assert(!r.diagnostics.some(x=>x.startsWith('fuzzy-fixed-match:')),'short key must match before fuzzy');
 assert.equal(r.places.filter(x=>x.id===id).length,1);
}
assert.equal(ctx.run(payload('h2','quidditch')).exact('quidditch'),null,'short keys must stay owner scoped');
assert.equal(ctx.run(payload('F5-N','hogwarts-librari')).exact('hogwarts-librari'),null,'no fuzzy indoor guesses');
const d=payload('F5-N','hogwarts-library',[{id:'hogwarts-library',name:'Thư viện Hogwarts',description:'Những kệ sách phủ kín tường.',overhear:'Có người đang đọc sách.'}]);
d.actors.push({name:'Draco',spot:'inside',placeId:'hogwarts-library',tagType:'gryffindor',activity:'Draco đang đọc sách.',observation:'Ánh nến soi trang sách.'},{name:'Harry',spot:'inside',placeId:'F5-N:01',activity:'Harry đang tìm sách.'});
d.events=[{title:'Quyển sách lạ',placeId:'hogwarts-library',detail:'Một quyển sách khẽ rung.'},{title:'Dấu mực mới',placeId:'F5-N:01',detail:'Dấu mực chưa khô.',hidden:true},{title:'Trang giấy gấp',placeId:'hogwarts-library',detail:'Một trang giấy vừa rơi.'}];
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{for(const mobile of [false,true]){
 const p=await b.newPage({viewport:mobile?{width:390,height:844}:{width:1400,height:950},isMobile:mobile,hasTouch:mobile});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.setContent(require('./runtime-fixture.cjs')(d));await p.waitForFunction(()=>document.querySelector('#wzw-map')?.dataset.status==='ready');
 assert.equal(await p.locator('#area-heading').innerText(),d.meta.areaName);
 assert.equal(await p.locator('#actors').innerText(),'');assert.equal(await p.locator('#activity').innerText(),'Đi khám phá nào');
 assert.equal(await p.locator('#quests .event-row').count(),3,'events suppress all NPC rows at canonical shared place');
 await p.locator('.qa-tags .npc-tag').filter({hasText:'Draco'}).click({force:true});
 assert.equal(await p.locator('#place-title').innerText(),'Draco');assert.equal(await p.locator('#place-area').innerText(),'Thư viện Hogwarts');
 assert.equal(await p.locator('#actors').innerText(),'Draco');assert.equal(await p.locator('#activity').innerText(),'Draco đang đọc sách.');assert.equal(await p.locator('#observation').innerText(),'Ánh nến soi trang sách.');
 await p.locator('.event-marker').first().click({force:true});
 const eventState=await p.evaluate(()=>['#area-heading','#place-title','#place-area','#activity','#observation','#actors'].map(s=>document.querySelector(s).textContent));
 assert.equal(eventState[1],d.events[0].title);assert.equal(eventState[2],'Thư viện Hogwarts');assert.equal(eventState[3],d.events[0].detail);assert.equal(eventState[4],d.places[0].description);assert(eventState[5].includes('Draco')&&eventState[5].includes('Harry'),'event includes canonical same-place NPCs');
 await p.locator('#quests .event-row').first().click({force:true});assert.deepEqual(await p.evaluate(()=>['#area-heading','#place-title','#place-area','#activity','#observation','#actors'].map(s=>document.querySelector(s).textContent)),eventState,'sidebar and map event use same Inspector');
 await p.evaluate(()=>document.querySelector('#mapmount>svg').dispatchEvent(new CustomEvent('wzw-place-selected',{detail:{id:'F5-N:01'}})));
 assert.equal(await p.locator('#place-title').innerText(),'Thư viện Hogwarts');assert.equal(await p.locator('#place-area').innerText(),'');assert((await p.locator('#actors').innerText()).includes('Harry'));
 await p.evaluate(async data=>await WZWMap.render(data),{...d,actors:[d.actors[0],{name:'Nhóm học sinh',spot:'inside',members:['Ron','Hermione'],placeId:'hogwarts-library',activity:'Cả nhóm đang bàn bạc.'}]});
 await p.locator('.qa-tags .npc-tag').filter({hasText:'Nhóm học sinh'}).click({force:true});
 assert.equal(await p.locator('#actors .actor-chip').count(),1,'clicked group remains one ribbon');assert((await p.locator('#actors').innerText()).includes('Nhóm học sinh'));
 await p.screenshot({path:'work/inspector-'+(mobile?'mobile':'desktop')+'.png'});assert.deepEqual(errors,[]);await p.close();
 }console.log('PASS exact scoped keys and desktop/mobile NPC/group/event/room Inspector');}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
