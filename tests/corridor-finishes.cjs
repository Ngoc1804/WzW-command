const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),{DOMParser}=require('linkedom');
const ctx=vm.createContext({DOMParser,structuredClone,XMLSerializer:class{serializeToString(n){return n.outerHTML}},document:{getElementById:()=>null},window:{},FURNITURE_STYLES:JSON.parse(fs.readFileSync('assets/styles.json'))});
vm.runInContext(fs.readFileSync('assets/source/corridors.js','utf8').split('function Q(')[0]+';globalThis.CORRIDORS={patterns:N,materials:S,defaults:s,build:V,draw:q,templates:t};',ctx);
vm.runInContext(fs.readFileSync('src/corridor-finish.js','utf8')+';globalThis.api={finishCorridorMap,corridorFinishChoice};',ctx);
const {CORRIDORS:core,api}=ctx,parse=svg=>new DOMParser().parseFromString(svg,'image/svg+xml');
const shapeSnapshot=svg=>[...parse(svg).querySelectorAll('*')].filter(n=>!n.closest('defs')).map(n=>[n.localName,[...n.attributes].filter(a=>a.name!=='fill'&&a.name!=='xmlns').map(a=>[a.name,a.value])]);
let cases=0;
const palettes=ctx.FURNITURE_STYLES.corridors.palettes;
for(const template of core.templates){
 const cfg=structuredClone(core.defaults);cfg.type=template.id;cfg.count=4;const geometry=core.build(cfg),original={kind:'indoor',geometry,svg:core.draw(geometry,cfg),footprints:[{id:'existing'}]};
 for(const palette of palettes){
  const out=api.finishCorridorMap(original,{}, {atlasAnchor:palette.floors[0]+'-N'});
  assert.equal(out.geometry,geometry);assert.equal(out.footprints,original.footprints);assert.equal(out.corridorFinish.id,palette.id);
  assert(out.corridorFinish.paintedFloors>0,template.id+' floor unchanged');assert(out.corridorFinish.paintedWalls>0,template.id+' walls unchanged');
  assert.deepEqual(shapeSnapshot(out.svg),shapeSnapshot(original.svg),template.id+' geometry/layers altered');
  const before=parse(original.svg),after=parse(out.svg),originalFloors=[...before.querySelector('[data-layer="floors"]').children],newFloors=[...after.querySelector('[data-layer="floors"]').children];
  assert.equal(originalFloors.length,newFloors.length);
  originalFloors.forEach((n,i)=>{if(n.getAttribute('fill')==='url(#floor-tile)')assert.equal(newFloors[i].getAttribute('fill'),n.getAttribute('fill'),'room floor changed');});
  for(const floor of palette.floors)assert.equal(api.corridorFinishChoice({}, {atlasAnchor:floor+'-W'}).id,palette.id);
  assert.equal(api.finishCorridorMap(original,{}, {atlasAnchor:'AU-PC-HOME'}),original);
  assert.equal(api.finishCorridorMap(original,{}, {atlasAnchor:'DUNGEONS-N',corridorFinish:'approved'}),original);
  assert.equal(api.finishCorridorMap({...original,kind:'outdoor'},{},{atlasAnchor:'F1-N'}).svg,original.svg);
  cases++;
 }
 const single={...original,geometry:{...geometry,halls:[]}};assert.equal(api.finishCorridorMap(single,{}, {atlasAnchor:'F1-N'}),single);
}
assert.equal(api.corridorFinishChoice({}, {atlasAnchor:'F1-N',corridorFinish:{floor:{base:'#123456',texture:'wood'}}}).floor.base,'#123456');
assert.equal(api.corridorFinishChoice({}, {atlasAnchor:'F1-N',corridorFinish:{wall:{base:'url(x)'}}}).wall.base,palettes[1].wall.base);
fs.mkdirSync('work',{recursive:true});fs.writeFileSync('work/corridor-finishes-qa.json',JSON.stringify({cases,palettes:palettes.length,geometryLayersUnchanged:true,roomFloorsUnchanged:true,approvedAndUnknownUntouched:true},null,2));console.log('PASS corridor finishes:',cases,'cases; 10 shapes x 6 palettes; geometry/layers/room floors unchanged');
