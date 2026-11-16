// Paint-only overlay: never modifies corridor construction or layer order.
function corridorFinishChoice(scene,d){
 const styles=FURNITURE_STYLES.corridors,explicit=d.corridorFinish;
 if(!styles||explicit==='approved'||explicit?.palette==='approved')return null;
 const scope=String(d.atlasAnchor||scene.cluster?.id||'').toUpperCase();
 // Resolve exact seeded floor keys only; AU and arbitrary names do not imply a floor.
 const floor=styles.floorOrder.find(id=>scope===id||scope.startsWith(id+'-'));
 let palette=styles.palettes.find(p=>p.id===explicit?.palette)||styles.palettes.find(p=>p.floors.includes(floor));
 if(!palette)return null;
 palette=structuredClone(palette);
 for(const part of ['floor','wall']){
  const override=explicit?.[part];if(!override||typeof override!=='object')continue;
  const choices=CORRIDORS.materials[part==='floor'?'hallFloor':'wall'].values;
  if(Object.hasOwn(choices,override.texture||'')&&override.texture!=='runner')palette[part].texture=override.texture;
  for(const channel of ['base','accent','grout'])if(/^#[0-9a-f]{6}$/i.test(override[channel]||''))palette[part][channel]=override[channel];
 }
 return palette;
}
function corridorPaintPattern(doc,source,part,id){
 const original=source.querySelector('[id="'+(part.kind==='floor'?'floor-':'wall-')+part.texture+'"]');
 if(!original)return null;
 const pattern=doc.importNode(original,true);pattern.setAttribute('id',id);
 const fills=[...new Set([...pattern.querySelectorAll('[fill]')].map(n=>n.getAttribute('fill')).filter(v=>/^#/.test(v)))];
 for(const n of pattern.querySelectorAll('[fill]')){const fill=n.getAttribute('fill');if(/^#/.test(fill))n.setAttribute('fill',fill===fills[0]?part.base:part.accent);}
 for(const n of pattern.querySelectorAll('[stroke]'))if(/^#/.test(n.getAttribute('stroke')))n.setAttribute('stroke',part.grout);
 return pattern;
}
function finishCorridorMap(map,scene,d){
 if(map.kind!=='indoor'||!map.geometry?.halls?.length)return map;
 const finish=corridorFinishChoice(scene,d);if(!finish)return map;
 const parser=new DOMParser(),doc=parser.parseFromString(map.svg,'image/svg+xml'),root=doc.documentElement;
 if(root.querySelector('parsererror'))throw Error('Invalid corridor SVG');
 const source=parser.parseFromString('<svg xmlns="http://www.w3.org/2000/svg">'+CORRIDORS.patterns()+'</svg>','image/svg+xml');
 const ns='http://www.w3.org/2000/svg',defs=doc.createElementNS(ns,'defs');
 let suffix=0;while(root.querySelector('[id="corridor-finish-'+suffix+'-floor"]')||root.querySelector('[id="corridor-finish-'+suffix+'-wall"]'))suffix++;
 const floorId='corridor-finish-'+suffix+'-floor',wallId='corridor-finish-'+suffix+'-wall';
 const floorPattern=corridorPaintPattern(doc,source,{...finish.floor,kind:'floor'},floorId),wallPattern=corridorPaintPattern(doc,source,{...finish.wall,kind:'wall'},wallId);
 if(!floorPattern||!wallPattern)return map;
 defs.append(floorPattern,wallPattern);root.prepend(defs);
 const floors=[...root.children].find(n=>n.getAttribute('data-layer')==='floors');
 let paintedFloors=0,paintedWalls=0;
 for(const node of [...floors?.children||[]]){
  const matching=map.geometry.halls.some(h=>['x','y','width','height'].every((attr,i)=>Math.abs(+(node.getAttribute(attr)||0)-[h.x,h.y,h.w,h.h][i])<.01));
  const curve=map.geometry.special?.type==='curve'&&node.localName==='path';
  if((matching||curve)&&/^url\(#floor-/.test(node.getAttribute('fill')||'')){node.setAttribute('fill','url(#'+floorId+')');paintedFloors++;}
 }
 const wallKey=(axis,x,y)=>axis+':'+(+x).toFixed(3)+':'+(+y).toFixed(3);
 const corridorWalls=new Set(map.geometry.walls.filter(w=>w.A?.kind==='hall'||w.B?.kind==='hall').map(w=>wallKey(w.axis,w.axis==='H'?w.a:w.at,w.axis==='H'?w.at:w.a)));
 for(const node of root.querySelectorAll('[data-wall]')){
  if(node.closest('defs'))continue;
  const matrix=node.getAttribute('transform')?.match(/^matrix\(([^)]+)\)$/)?.[1].trim().split(/[\s,]+/).map(Number);
  if(matrix?.length!==6||!corridorWalls.has(wallKey(node.getAttribute('data-wall'),matrix[4],matrix[5])))continue;
  const face=node.querySelector('path');if(face){face.setAttribute('fill','url(#'+wallId+')');paintedWalls++;}
 }
 for(const arc of root.querySelectorAll('[data-arc-wall="curve"]'))for(const path of arc.querySelectorAll('path'))if(/^url\(#wall-/.test(path.getAttribute('fill')||'')){path.setAttribute('fill','url(#'+wallId+')');paintedWalls++;}
 return{...map,svg:new XMLSerializer().serializeToString(root),corridorFinish:{id:finish.id,floor:finish.floor,wall:finish.wall,paintedFloors,paintedWalls}};
}
