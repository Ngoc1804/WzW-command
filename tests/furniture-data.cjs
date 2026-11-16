const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),cp=require('child_process');
const read=n=>JSON.parse(fs.readFileSync('assets/'+n+'.json'));
const RECIPES=read('recipes'),ROOM_FORMULAS=read('room-formulas'),FURNITURE_STYLES=read('styles'),LAYOUT_SIZES=read('layout-sizes'),CATALOG=read('catalog'),VOCAB=read('vocabulary');
cp.execFileSync('python',['tools/check-furniture-locks.py'],{stdio:'inherit'});
const ctx=vm.createContext({RECIPES,ROOM_FORMULAS,FURNITURE_STYLES,LAYOUT_SIZES,CATALOG,VOCAB,KEYS:[]});
vm.runInContext(['contract','furnishing','props','draw'].map(n=>fs.readFileSync('src/'+n+'.js','utf8')).join('\n')+';globalThis.api={composeRoom,furnitureChoice,furnitureHash,furnitureLayout,arrangeFurniture};',ctx);
const {api}=ctx;let count=0;
for(const [type,recipe]of Object.entries(RECIPES)){
 if(!type.startsWith('OUT_'))assert.deepEqual(recipe.furnishing.variants,LAYOUT_SIZES[type].M.furnishing.variants);
 const place={id:'stable',name:'Name A',type,props:[]};
 assert.equal(JSON.stringify(api.furnitureChoice(place,type)),JSON.stringify(api.furnitureChoice({...place,name:'Name B'},type)),'display name changes seed');
 for(const size of ['S','M','L']){
  const inventory=api.composeRoom({...place,size});assert.equal(inventory.objects.length,recipe.instancesBySize[size].length,type+' retains instances');
  const instance=inventory.objects[0];if(instance){const removed=api.composeRoom({...place,size,props:[{id:instance.id,name:instance.name,state:'removed'}]});assert(!removed.objects.some(o=>o.id===instance.id));}
  assert.equal(api.composeRoom({...place,size,propsMode:'replace'}).objects.length,0);count++;
 }
 for(const variant of recipe.furnishing.variants)assert.equal(api.furnitureChoice({...place,furniture:{variant}},type).variant,variant);
 assert(api.furnitureChoice({...place,furniture:{variant:'unknown'}},type).invalidVariant);
}
for(const [id,preset]of Object.entries(ROOM_FORMULAS.furniturePresets)){
 assert(RECIPES[preset.type]&&RECIPES[preset.sourceRecipe]);
 const inventory=api.composeRoom({id:'r',name:'Room',type:preset.type,props:[],furniture:{preset:id}});
 assert.equal(inventory.furnishing.preset.id,id);assert.equal(inventory.objects.length,RECIPES[preset.sourceRecipe].instancesBySize.M.length+(preset.extraProps?.length||0));
}
const choices=new Set(Array.from({length:20},(_,i)=>api.furnitureChoice({id:'r'+i,type:'CLASSROOM'},'CLASSROOM').variant));assert(choices.size>2);
assert.equal(api.furnitureChoice({id:'r',type:'HEADMASTER_OFFICE'},'HEADMASTER_OFFICE').style,'approved');
assert.equal(api.furnitureChoice({id:'r',type:'OFFICE',furniture:{materials:{wood:'#abcdef',bad:'url(x)'}}},'OFFICE').materials.wood,'#abcdef');
console.log('PASS furniture data:',count,'size/inventory cases; 49 original IDs; 16 presets; deterministic choices and RP removal/replace');
