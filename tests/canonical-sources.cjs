const fs=require('node:fs'),assert=require('node:assert/strict');const l=JSON.parse(fs.readFileSync('assets/layout-sizes.json','utf8'));assert.equal(Object.keys(l).length,49);for(const [id,s] of Object.entries(l))for(const size of ['S','M','L']){assert(s[size],id+' '+size);assert(s[size].width>0&&s[size].height>0)}const a=JSON.parse(fs.readFileSync('assets/atlas.json','utf8'));assert.equal(Object.keys(a.fixed).length,13);assert.equal(Object.keys(a.clusters).length,59);assert.equal(Object.values(a.clusters).reduce((n,c)=>n+c.rooms.length,0),285);const rooms=Object.values(a.clusters).flatMap(c=>[...c.rooms,...(c.sites||[]).flatMap(s=>s.rooms)]);assert.equal(rooms.length,390);assert(rooms.every(p=>p.description&&p.interiorPlan?.recipe&&p.architecture));const formulas=JSON.parse(fs.readFileSync('assets/room-formulas.json','utf8'));assert.equal(Object.keys(formulas.recipes).length,49);const html=fs.readFileSync('examples/WIZAMAP_LAYOUTS.html','utf8');assert(!/WIZAMAP_DECOR_EDITOR|wzw-custom-paint-data|wzw-custom-decor-data/.test(html));assert(!fs.readFileSync('tools/build.py','utf8').includes('p4-art.json'));console.log('PASS canonical 49 layouts x S/M/L + 13 Fixed + Atlas scopes');

// Master synchronization locks native IDs, design metadata, and World site component coverage.
const data=JSON.parse(fs.readFileSync('assets/atlas.json','utf8'));
const native=Object.values(data.clusters).flatMap(c=>c.rooms);
const sites=Object.values(data.clusters).flatMap(c=>c.sites||[]);
assert.equal(native.filter(r=>r.interiorPlan?.masterDesign).length,285,'all 285 rooms reference Master design');
assert.equal(sites.reduce((n,s)=>n+(s.components||[]).filter(c=>c.masterDesign).length,0),67,'all World site components reference Master design');
const approved={"DUNGEONS-N:05":"UTILITY_ROOM","KITCHENS-N:04":"KITCHEN","F1-N:05":"STORAGE","F6-N:02":"PASSAGE_PROPS","F6-S:04":"STORAGE","F7-N:03":"STORAGE","F8-N:01":"PASSAGE_PROPS"};
assert.equal(native.filter(r=>r.interiorPlan?.masterRecipeConflict).length,0,'no unresolved Master recipe conflicts');
assert.equal(native.filter(r=>r.interiorPlan?.recipeDecision==='runtime-approved').length,7,'seven runtime-approved recipe decisions');
for(const [id,recipe] of Object.entries(approved)){const room=native.find(r=>r.id===id);assert(room,'missing approved room '+id);assert.equal(room.type,recipe,id+' type');assert.equal(room.interiorPlan.recipe,recipe,id+' active recipe');assert.equal(room.interiorPlan.recipeDecision,'runtime-approved',id+' decision');}
console.log('PASS seven locked runtime recipes; immutable Master provenance retained');
console.log('PASS Master-aligned atlas IDs and design notes');
