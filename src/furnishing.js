// Furniture-only variation. Shell SVG, walls, floors, doors and stacking stay owned by build.js.
function furnitureHash(value){let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function furnitureChoice(place,rid){
 const options=place.furniture&&typeof place.furniture==='object'?place.furniture:{};
 const policy=RECIPES[rid]?.furnishing||{};
 const presets=ROOM_FORMULAS.furniturePresets||{};
 let preset=null;
 if(options.preset&&options.preset!=='approved'){
  const requested=presets[options.preset];
  if(requested?.type===rid)preset={...requested,id:options.preset};
 }

 const seed=furnitureHash(String(place.id||rid)+'|'+String(options.seed??''));
 const variants=policy.variants||['approved'];
 const requested=typeof options.variant==='string'?options.variant:null;
 const available=preset?RECIPES[preset.sourceRecipe]?.furnishing?.variants||variants:variants;
 const variant=requested&&available.includes(requested)?requested:preset?.variant||
  (policy.mode==='seeded'&&options.seed!==undefined?variants[seed%variants.length]:'approved');
 const style=options.style==='approved'?'approved':Object.hasOwn(FURNITURE_STYLES.palettes,options.style||'')?options.style:
  preset?.style||'approved';
 const materials=Object.fromEntries(Object.entries(options.materials||{}).filter(([k,v])=>/^[a-z]+$/.test(k)&&/^#[0-9a-f]{6}$/i.test(v)));
 return{seed,variant,style,materials,preset,sourceRecipe:preset?.sourceRecipe||rid,invalidVariant:!!requested&&!available.includes(requested),invalidPreset:!!options.preset&&options.preset!=='approved'&&!preset};
}
function furnitureReference(art,choice,size){
 if(!choice?.preset)return art;
 const source=LAYOUT_SIZES[choice.sourceRecipe]?.[size];if(!source||!art)return art;
 const scale=Math.min(art.width/source.width,art.height/source.height,1),dx=(art.width-source.width*scale)/2,dy=(art.height-source.height*scale)/2;
 return{...art,defs:art.defs+namespaceArt(source.defs,'preset-'),objects:source.objects.map(o=>({...o,bounds:[o.bounds[0]*scale+dx,o.bounds[1]*scale+dy,o.bounds[2]*scale,o.bounds[3]*scale],svg:`<g transform="translate(${dx} ${dy}) scale(${scale})">${namespaceArt(o.svg,'preset-')}</g>`}))};
}
// Read the existing floor shape as a constraint; never write or replace it.
const furnitureFloorPaths=new Map();
let furnitureFloorContext=null;
function furnitureInsideFloor(art,x,y){
 if(!art?.floorSvg)return true;
 let shapes=furnitureFloorPaths.get(art.floorSvg);
 if(!shapes){
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('width',art.width);svg.setAttribute('height',art.height);svg.style.cssText='position:absolute;visibility:hidden;pointer-events:none';svg.innerHTML=art.floorSvg;document.body.append(svg);
  const rootMatrix=svg.getCTM();shapes=[...svg.querySelectorAll('path,rect,polygon,ellipse,circle')].filter(n=>!n.closest('defs')&&n.getAttribute('fill')!=='none').map(n=>{
   let path;
   if(n.localName==='polygon'){path=new Path2D();const points=(n.getAttribute('points')||'').trim().split(/[\s,]+/).map(Number);for(let i=0;i<points.length;i+=2){if(i)path.lineTo(points[i],points[i+1]);else path.moveTo(points[i],points[i+1]);}path.closePath();}
   else path=outdoorShape(n);
   return{path,inverse:rootMatrix.inverse().multiply(n.getCTM()).inverse()};
  });
  svg.remove();furnitureFloorPaths.set(art.floorSvg,shapes);
 }
 furnitureFloorContext||=document.createElement('canvas').getContext('2d');
 return shapes.length===0||shapes.some(({path,inverse})=>{const p=new DOMPoint(x,y).matrixTransform(inverse);return furnitureFloorContext.isPointInPath(path,p.x,p.y);});
}
function furnitureOverlap(a,b,gap=6){return a[0]<b[0]+b[2]+gap&&a[0]+a[2]+gap>b[0]&&a[1]<b[1]+b[3]+gap&&a[1]+a[3]+gap>b[1];}
function furnitureTarget(pattern,index,count){
 const n=Math.max(count,1),cols=Math.max(1,Math.ceil(Math.sqrt(n))),rows=Math.ceil(n/cols),col=index%cols,row=Math.floor(index/cols),grid=[(col+.5)/cols,(row+.5)/rows];
 switch(pattern){
 case 'rows':return[.18+.64*grid[0],.22+.58*grid[1]];
 case 'groups':case 'islands':case 'storage-islands':return[.16+.68*grid[0],.16+.68*grid[1]];
 case 'paired':return[index%2?.73:.27,.22+.56*(Math.floor(index/2)+.5)/Math.ceil(n/2)];
 case 'galley':return[index%2?.78:.22,.18+.63*(Math.floor(index/2)+.5)/Math.ceil(n/2)];
 case 'perimeter':case 'clear-axis':case 'u-shape':{const edge=index%3,t=(Math.floor(index/3)+.5)/Math.ceil(n/3);return edge===0?[.16,.22+.56*t]:edge===1?[.84,.22+.56*t]:[.2+.6*t,.2];}
 case 'stations':return[.2+.6*grid[0],.2+.56*grid[1]];
 case 'central':return index===0?[.5,.48]:[index%2?.22:.78,.24+.5*grid[1]];
 case 'consultation':return index===0?[.5,.36]:[index%2?.28:.72,.6+.18*grid[1]];
 case 'sleep-and-study':return index===0?[.28,.4]:[.72,.24+.5*(index/n)];
 case 'working-islands':return index===0?[.55,.4]:[.22+.56*grid[0],.22+.58*grid[1]];
 case 'reading-islands':return[index%2?.73:.27,.28+.45*grid[1]];
 case 'social-clusters':return[.5+Math.cos(index*2*Math.PI/n)*.25,.48+Math.sin(index*2*Math.PI/n)*.24];
 default:return grid;
 }
}
function arrangeFurniture(place,room,layout,door){
 const choice=layout.inventory.furnishing;if(!choice||choice.variant==='approved'||!layout.art||layout.art.source!=='APPROVED_DECOR')return layout;
 const groups=new Map(),fixed=[];
 for(const o of layout.objects){const role=o.node.placementRole||CATALOG[o.node.item]?.placement?.role||'standalone';
  if(role==='fixed'||o.node.focalGroup||o.bounds[1]<0){fixed.push(o);continue;}
  const id=o.node.furnitureGroup||o.item.id;if(!groups.has(id))groups.set(id,[]);groups.get(id).push(o);
 }
 const boxOf=items=>{const x=Math.min(...items.map(o=>o.bounds[0])),y=Math.min(...items.map(o=>o.bounds[1]));return[x,y,Math.max(...items.map(o=>o.bounds[0]+o.bounds[2]))-x,Math.max(...items.map(o=>o.bounds[1]+o.bounds[3]))-y];};
 const units=[...groups.values()].map(items=>({items,box:boxOf(items)})).sort((a,b)=>b.box[2]*b.box[3]-a.box[2]*a.box[3]);
 const occupied=fixed.map(o=>o.bounds),placed=[],w=layout.width,h=layout.height;
 const doorBox=door?(door.ln.axis==='H'?[door.at-room.x-door.width/2-12,door.ln.at-room.y-32,door.width+24,64]:[door.ln.at-room.x-32,door.at-room.y-door.width/2-12,64,door.width+24]):null;
 const valid=b=>b[0]>=12&&b[1]>=12&&b[0]+b[2]<=w-12&&b[1]+b[3]<=h-30&&
  (!doorBox||!furnitureOverlap(b,doorBox,4))&&!occupied.some(o=>furnitureOverlap(b,o,8))&&
  [[0,0],[1,0],[0,1],[1,1],[.5,.5]].every(([u,v])=>furnitureInsideFloor(layout.art,b[0]+b[2]*u,b[1]+b[3]*v));
 for(const [i,unit]of units.entries()){
  const [u,v]=furnitureTarget(choice.variant,i,units.length),[bx,by,bw,bh]=unit.box;
  const desired=[w*u-bw/2,h*v-bh/2],candidates=[];
  for(let y=14;y+bh<h-28;y+=18)for(let x=14;x+bw<w-10;x+=18)candidates.push([x,y,bw,bh]);
  candidates.push([desired[0],desired[1],bw,bh],unit.box);
  candidates.sort((a,b)=>Math.hypot(a[0]-desired[0],a[1]-desired[1])-Math.hypot(b[0]-desired[0],b[1]-desired[1])||a[1]-b[1]||a[0]-b[0]);
  const target=candidates.find(valid);
  if(!target){layout.inventory.diagnostics.push('furniture-variant-fallback:'+choice.variant);layout.inventory.furnishing.appliedVariant='approved';return layout;}
  occupied.push(target);const dx=target[0]-bx,dy=target[1]-by;
  for(const o of unit.items)placed.push({...o,dx:o.dx+dx,dy:o.dy+dy,bounds:[o.bounds[0]+dx,o.bounds[1]+dy,o.bounds[2],o.bounds[3]]});
 }
 layout.inventory.furnishing.appliedVariant=choice.variant;
 const byId=new Map([...fixed,...placed].map(o=>[o.item.id,o]));
 return{...layout,objects:layout.objects.map(o=>byId.get(o.item.id)||o)};
}
const furniturePaintCache=new Map();
function furniturePaint(markup,choice){
 if(!choice||choice.style==='approved'&&!Object.keys(choice.materials).length||!markup.includes('data-material'))return markup;
 const cacheKey=choice.style+'|'+JSON.stringify(choice.materials)+'|'+markup;if(furniturePaintCache.has(cacheKey))return furniturePaintCache.get(cacheKey);
 const colors={...(FURNITURE_STYLES.palettes[choice.style]||{}),...choice.materials};
 const doc=new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg">'+markup+'</svg>','image/svg+xml');
 if(doc.querySelector('parsererror'))return markup;
 const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)),luma=v=>v[0]*.2126+v[1]*.7152+v[2]*.0722;
 const tagged=[...doc.querySelectorAll('[data-material]')];
 const bases=new Map();
 for(const node of tagged){const slot=node.getAttribute('data-material');for(const attr of ['fill','stop-color','stroke']){const old=node.getAttribute(attr);if(/^#[0-9a-f]{6}$/i.test(old||'')){if(!bases.has(slot))bases.set(slot,[]);bases.get(slot).push(luma(rgb(old)));}}}
 for(const node of tagged){const slot=node.getAttribute('data-material'),color=colors[slot];if(!color)continue;const values=bases.get(slot)||[],base=values.reduce((a,b)=>a+b,0)/Math.max(1,values.length);
  for(const attr of ['fill','stop-color','stroke']){const old=node.getAttribute(attr);if(!/^#[0-9a-f]{6}$/i.test(old||''))continue;
   const shade=Math.max(.55,Math.min(1.3,luma(rgb(old))/Math.max(1,base))),next='#'+rgb(color).map(v=>Math.round(Math.min(255,v*shade)).toString(16).padStart(2,'0')).join('');node.setAttribute(attr,next);
  }
 }
 const result=doc.documentElement.innerHTML;if(furniturePaintCache.size>128)furniturePaintCache.clear();furniturePaintCache.set(cacheKey,result);return result;
}
function furnitureSupportBounds(asset,box){
 const ref=asset?.occupancy,s=asset?.surface;if(!ref||!s||!asset?.placement?.supportsDetails)return null;
 const sx=box[2]/Math.max(1,ref.width),sy=box[3]/Math.max(1,ref.height);
 const x=Math.max(box[0],box[0]+(s.x-ref.x)*sx),y=Math.max(box[1],box[1]+(s.y-ref.y)*sy);
 const right=Math.min(box[0]+box[2],box[0]+(s.x+s.width-ref.x)*sx),bottom=Math.min(box[1]+box[3],box[1]+(s.y+s.height-ref.y)*sy);
 return right>x&&bottom>y?[x,y,right-x,bottom-y]:null;
}
function furnitureViewBox(asset){
 const ref=asset?.occupancy;if(ref)return[ref.x,ref.y,ref.width,ref.height];
 if(asset?.viewBox)return asset.viewBox;
 const parsed=asset?.svg?.match(/viewBox=["']([^"']+)/)?.[1].trim().split(/[\s,]+/).map(Number);
 return parsed?.length===4&&parsed.every(Number.isFinite)?parsed:[0,0,100,100];
}
