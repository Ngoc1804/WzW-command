const fs=require('fs'),vm=require('vm'),zlib=require('zlib'),assert=require('assert');
const DATA=JSON.parse(zlib.gunzipSync(Buffer.from(fs.readFileSync('examples/WIZAMAP_FIXED_UI.html','utf8').match(/id="wzw-embedded-atlas"[^>]*>(.*?)<\/script>/s)[1],'base64'))),FIXED_CONTRACT=JSON.parse(fs.readFileSync('assets/fixed-contract.json')),ATLAS=JSON.parse(fs.readFileSync('assets/atlas.json')),VOCAB=JSON.parse(fs.readFileSync('assets/vocabulary.json')),RECIPES=JSON.parse(fs.readFileSync('assets/recipes.json'));
const ctx=vm.createContext({DATA:structuredClone(DATA),FIXED_CONTRACT,ATLAS,VOCAB,RECIPES,KEYS:[]});vm.runInContext(['contract','props','fixed-locations','resolver'].map(n=>fs.readFileSync('src/'+n+'.js','utf8')).join('\n')+';globalThis.run=x=>resolve(normalize(x));',ctx);
const payload=(owner,id,places)=>({schemaVersion:'2.0.0',atlasAnchor:owner,pcPlace:id,places,actors:[{name:'PC',isPC:true,placeId:id}],events:[]});let count=0;
for(const [owner,keys]of Object.entries(FIXED_CONTRACT))for(const id of Object.keys(keys)){
 for(const local of [false,true]){const ref=local?'scene:'+id:id;const s=ctx.run(payload(owner,ref,[{id:ref,anchor:id,name:'Tên tùy ý '+count}]));assert(s.exact(ref),owner+'/'+ref);assert.equal(s.exact(ref).name,'Tên tùy ý '+count);assert.equal(s.unresolved.length,0);}
 count++;
}
assert.equal(count,263);for(const owner of ['F3-N','LONDON','custom']){const s=ctx.run(payload(owner,'Kho mới',[{name:'Kho mới',type:'STORAGE'}]));assert(s.exact('Kho mới'));assert.equal(s.places.length,1);}
const s=ctx.run(payload('h1','a',[{id:'a',name:'Bên hồ A',anchor:'lakeside',position:[.2,.3]},{id:'b',name:'Bên hồ B',anchor:'lakeside',position:[.8,.7]}]));assert.notEqual(s.exact('a'),s.exact('b'));assert.deepEqual(Array.from(s.exact('a').position),[.2,.3]);assert(s.exact('a').freeRegion);assert(!s.places.some(p=>p.id==='train-v5'));
const h2=ctx.run(payload('h2','courtyard-1',[{id:'courtyard-1',name:'Sân mới'}]));assert(h2.exact('courtyard-1').freeRegion);assert.equal(h2.places.length,5);
console.log('PASS 263 exact IDs + 263 local-ID/anchor cases; mutable names; two scenes sharing region; name-only Generated rooms; filtered H2 and background');
fs.mkdirSync('work',{recursive:true});fs.writeFileSync('work/fixed-contract-audit.json',JSON.stringify({checked:263,resolved:263,unresolved:0,localAnchorCases:263,scopes:13},null,2));
