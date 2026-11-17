const fs=require('fs'),vm=require('vm'),zlib=require('zlib'),assert=require('assert'),{chromium}=require('playwright');
const html=fs.readFileSync('examples/WIZAMAP_FIXED_UI.html','utf8'),packed=html.match(/<script[^>]*id="wzw-embedded-atlas"[^>]*>(.*?)<\/script>/s)[1];
const DATA=JSON.parse(zlib.gunzipSync(Buffer.from(packed,'base64'))),ATLAS=JSON.parse(fs.readFileSync('assets/atlas.json')),VOCAB=JSON.parse(fs.readFileSync('assets/vocabulary.json')),RECIPES=JSON.parse(fs.readFileSync('assets/recipes.json'));
const ctx=vm.createContext({DATA,ATLAS,VOCAB,RECIPES,FIXED_CONTRACT:JSON.parse(fs.readFileSync('assets/fixed-contract.json')),KEYS:['unknown','gryffindor']});
vm.runInContext(['contract','props','fixed-locations','resolver'].map(x=>fs.readFileSync('src/'+x+'.js','utf8')).join('\n')+';globalThis.run=x=>resolve(normalize(x))',ctx);
for(const [ref,id] of [['h1-lake-tree','lakeside-tree'],['h1-hagrid-hut','region:extra:5'],['h1-forest-edge','region-4'],['h1-outer-lawns','school-grounds'],['h1-greenhouses','region:extra:0'],['h1-quidditch-approach','region:extra:4']]){
 const r=ctx.run({schemaVersion:'2.0.0',atlasAnchor:'h1',pcPlace:ref,places:[],actors:[{name:'PC',isPC:true}],events:[]});
 assert.equal(r.exact(ref)?.id,id,ref);assert.equal(r.places.length,new Set(Object.values(JSON.parse(fs.readFileSync('assets/fixed-contract.json')).h1)).size);
}
(async()=>{
 const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 const p=await b.newPage({viewport:{width:1300,height:920}});
 await p.setContent(require('./runtime-fixture.cjs')({schemaVersion:'2.0.0',atlasAnchor:'hall',pcPlace:'gf-staff',pcSpot:'inside',meta:{areaName:'Đại Sảnh · Phòng giáo viên'},places:[],actors:[{name:'PC',isPC:true,placeId:'gf-staff',spot:'inside'},{name:'NPC thử',placeId:'gf-staff',spot:'inside'}],events:[]}));
 await p.waitForFunction(()=>document.querySelector('#wzw-map')?.dataset.status==='ready');
 assert.equal((await p.locator('#actors').innerText()).trim(),'');
 assert.equal((await p.locator('#activity').innerText()).trim(),'Đi khám phá nào');
 assert.equal((await p.locator('#observation').innerText()).trim(),'Đi khám phá nào');
 await p.evaluate(()=>document.querySelector('#mapmount>svg').dispatchEvent(new CustomEvent('wzw-place-selected',{detail:{id:'gf-staff'}})));
 assert((await p.locator('#actors').innerText()).includes('NPC thử'));
 console.log('PASS W4 aliases and idle inspector');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exit(1)});
