// Node-only SVG-floor adapter for geometry checks; browser behavior is covered separately.
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),{DOMParser}=require('linkedom'),{Path2D,createCanvas,DOMMatrix,DOMPoint}=require('@napi-rs/canvas');
const read=n=>JSON.parse(fs.readFileSync('assets/'+n+'.json'));
const ctx=vm.createContext({DOMParser,console,RECIPES:read('recipes'),ROOM_FORMULAS:read('room-formulas'),FURNITURE_STYLES:read('styles'),LAYOUT_SIZES:read('layout-sizes'),CATALOG:read('catalog'),VOCAB:read('vocabulary'),KEYS:[],Path2D});
const canvas=createCanvas(10,10).getContext('2d'),cache=new Map();
function transform(str){let m=new DOMMatrix();for(const t of (str||'').matchAll(/(translate|scale|matrix|rotate)\(([^)]+)\)/g)){const a=t[2].trim().split(/[\s,]+/).map(Number);if(t[1]==='translate')m=m.translate(a[0],a[1]||0);if(t[1]==='scale')m=m.scale(a[0],a[1]??a[0]);if(t[1]==='matrix')m=m.multiply(new DOMMatrix(a));if(t[1]==='rotate'){m=m.translate(a[1]||0,a[2]||0).rotate(a[0]).translate(-(a[1]||0),-(a[2]||0));}}return m;}
ctx.floor=(art,x,y)=>{let paths=cache.get(art.floorSvg);if(!paths){const doc=new DOMParser().parseFromString('<svg>'+art.floorSvg+'</svg>','text/xml');paths=[...doc.querySelectorAll('path,rect,polygon,ellipse,circle')].filter(n=>!n.closest('defs')&&n.getAttribute('fill')!=='none').map(n=>{let p=new Path2D();const num=k=>+(n.getAttribute(k)||0);if(n.localName==='path')p=new Path2D(n.getAttribute('d'));if(n.localName==='rect')p.rect(num('x'),num('y'),num('width'),num('height'));if(['circle','ellipse'].includes(n.localName))p.ellipse(num('cx'),num('cy'),num(n.localName==='circle'?'r':'rx'),num(n.localName==='circle'?'r':'ry'),0,0,Math.PI*2);if(n.localName==='polygon'){const a=n.getAttribute('points').split(/[\s,]+/).map(Number);for(let i=0;i<a.length;i+=2)i?p.lineTo(a[i],a[i+1]):p.moveTo(a[i],a[i+1]);p.closePath();}let m=new DOMMatrix();for(const a of [n,...n.parentElement?function chain(a){return a?[a,...chain(a.parentElement)]:[]}(n.parentElement):[]].reverse())m=m.multiply(transform(a.getAttribute('transform')));return{p,inverse:m.inverse()}});cache.set(art.floorSvg,paths)}return paths.length===0||paths.some(({p,inverse})=>{const v=new DOMPoint(x,y).matrixTransform(inverse);return canvas.isPointInPath(p,v.x,v.y)});};
vm.runInContext(['contract','furnishing','props','draw','build'].map(n=>fs.readFileSync('src/'+n+'.js','utf8')).join('\n')+';furnitureInsideFloor=globalThis.floor;globalThis.api={composeRoom,furnitureLayout,arrangeFurniture,drawFurniture,furniturePaint,namespaceArt};',ctx);
let total=0,placed=0,falls=[];for(const [type,r]of Object.entries(ctx.RECIPES).filter(([,r])=>r.furnishing.mode==='seeded'))for(const size of ['S','M','L'])for(const variant of r.furnishing.variants.filter(v=>v!=='approved')){const p={id:'r',name:type,type,size,furniture:{variant,style:'sage'}};p.inventory=ctx.api.composeRoom(p);const layout=ctx.api.furnitureLayout(p),room={x:0,y:0,w:layout.width,h:layout.height},door={ln:{axis:'H',at:layout.height},at:layout.width/2,width:52};const out=ctx.api.arrangeFurniture(p,room,layout,door);total++;if(p.inventory.furnishing.appliedVariant!=='approved')placed++;else falls.push({type,size,variant});assert.equal(out.objects.length,layout.objects.length);
 const moved=out.objects.filter((o,i)=>o.dx!==layout.objects[i].dx||o.dy!==layout.objects[i].dy);
 for(const o of moved){const b=o.bounds;assert(b[0]>=0&&b[1]>=0&&b[0]+b[2]<=layout.width&&b[1]+b[3]<=layout.height,type+' outside bounds');for(const [u,v]of [[0,0],[1,0],[0,1],[1,1]])assert(ctx.floor(layout.art,b[0]+b[2]*u,b[1]+b[3]*v),type+' outside floor');
  for(const other of out.objects){if(other===o||other.node.furnitureGroup===o.node.furnitureGroup)continue;const a=other.bounds;assert(!(b[0]<a[0]+a[2]&&b[0]+b[2]>a[0]&&b[1]<a[1]+a[3]&&b[1]+b[3]>a[1]),type+' overlapping separate groups');}
 }
} 
assert(placed>20);console.log(JSON.stringify({total,placed,fallbacks:falls},null,2));fs.writeFileSync('work/furniture-unit-qa.json',JSON.stringify({total,placed,fallbacks:falls},null,2));
const painted=ctx.api.furniturePaint('<defs><symbol id="x"><rect data-material="wood" fill="#8c6446"/><rect fill="#ffffff"/></symbol></defs>',{style:'sage',materials:{}});assert(painted.includes('#95816b')&&painted.includes('#ffffff'));

function expandSymbols(svg){
 const doc=new DOMParser().parseFromString(svg,'text/xml'),ids=new Map([...doc.querySelectorAll('[id]')].map(n=>[n.id,n]));
 for(let step=0;step<10;step++){const uses=[...doc.querySelectorAll('use')];if(!uses.length)break;
  for(const use of uses){const src=ids.get((use.getAttribute('href')||use.getAttribute('xlink:href')||'').slice(1));assert(src,'missing raster symbol');
   const out=doc.createElementNS('http://www.w3.org/2000/svg',src.localName==='symbol'?'svg':'g');for(const a of use.attributes)if(!['href','xlink:href'].includes(a.name))out.setAttribute(a.name,a.value);
   if(src.localName==='symbol'){for(const k of ['viewBox','preserveAspectRatio','overflow'])if(src.getAttribute(k))out.setAttribute(k,src.getAttribute(k));for(const child of [...src.childNodes])out.append(child.cloneNode(true));}
   else out.append(src.cloneNode(true));use.replaceWith(out);
  }
 }
 return doc.documentElement.outerHTML;
}
const {loadImage}=require('@napi-rs/canvas');
async function preview(type,furniture,name){
 const p={id:'review-room',name:name||type,type,size:'M',props:[],furniture};p.inventory=ctx.api.composeRoom(p);const layout=ctx.api.furnitureLayout(p),art=layout.art,room={x:0,y:0,w:art.width,h:art.height},horizontal=['north','south'].includes(art.door?.side||'south');
 const door={ln:{axis:horizontal?'H':'V',at:horizontal?art.doorAnchor.y:art.doorAnchor.x},at:horizontal?art.doorAnchor.x:art.doorAnchor.y,width:art.door?.width||52};
 const drawn=ctx.api.drawFurniture(p,'p0-',room,layout,door),doc=new DOMParser().parseFromString('<svg>'+art.architectureSvg+'</svg>','text/xml'),front=doc.querySelector('[data-layer="front-wall-foreground"]'),frontSvg=front?.outerHTML||'';front?.remove();
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700" viewBox="-55 -80 '+(art.width+130)+' '+(art.height+150)+'"><rect x="-55" y="-80" width="'+(art.width+130)+'" height="'+(art.height+150)+'" fill="#eee4cf"/>'+ctx.api.namespaceArt(art.floorSvg+doc.documentElement.innerHTML,'p0-')+drawn.svg+ctx.api.namespaceArt(frontSvg,'p0-')+'</svg>';
 const parsed=new DOMParser().parseFromString(svg,'text/xml'),ids=[...parsed.querySelectorAll('[id]')].map(n=>n.id);assert.equal(ids.length,new Set(ids).size,type+' duplicate SVG IDs');
 const idset=new Set(ids);for(const m of svg.matchAll(/(?:url\(#|href=["']#)([^)"' ]+)/g))assert(idset.has(m[1]),type+' missing '+m[1]);
 for(const item of p.inventory.objects.filter(o=>o.source!=='preset'))assert(drawn.footprints.some(f=>f.id===item.id),type+' lost '+item.id);
 fs.writeFileSync('work/preview-'+name+'.svg',svg);const im=await loadImage(Buffer.from(expandSymbols(svg))),canvas=createCanvas(900,700);canvas.getContext('2d').drawImage(im,0,0);fs.writeFileSync('work/preview-'+name+'.png',canvas.toBuffer('image/png'));
 return{type,name,furnishing:p.inventory.furnishing,diagnostics:p.inventory.diagnostics,instances:drawn.footprints.length};
}
(async()=>{const rows=[];for(const [type,furniture,name]of [
 ['CLASSROOM',{variant:'approved',style:'approved'},'classroom-original'],['CLASSROOM',{variant:'groups',style:'sage'},'classroom-groups'],
 ['LOUNGE',{variant:'approved',style:'approved'},'lounge-original'],['LOUNGE',{variant:'social-clusters',style:'slate'},'lounge-social'],
 ['BEDROOM',{variant:'approved',style:'approved'},'bedroom-original'],['BEDROOM',{variant:'perimeter',style:'burgundy'},'bedroom-perimeter'],
 ['GAMES_ROOM',{preset:'whitecap-games'},'whitecap-games'],['BATHROOM',{preset:'myrtle-bathroom'},'myrtle-bathroom']
])rows.push(await preview(type,furniture,name));fs.writeFileSync('work/furniture-render-qa.json',JSON.stringify(rows,null,2));console.log('PASS static furniture renders',rows.map(r=>({name:r.name,instances:r.instances,diagnostics:r.diagnostics})));})().catch(e=>{console.error(e);process.exit(1)});

for(const variant of ['approved','perimeter']){
 const p={id:'support-test',name:'Office',type:'OFFICE',props:[],furniture:{variant,style:'approved'}};
 const desk=ctx.RECIPES.OFFICE.instancesBySize.M.find(o=>/desk/.test(o.item));p.props=[{id:'book',name:'Book',item:'accessory.book',op:'add',supportId:desk.id}];
 p.inventory=ctx.api.composeRoom(p);const l=ctx.api.furnitureLayout(p),room={x:0,y:0,w:l.width,h:l.height},door={ln:{axis:'H',at:l.height},at:l.width/2,width:52},drawn=ctx.api.drawFurniture(p,'support-',room,l,door),book=drawn.footprints.find(f=>f.id==='book:0'),support=drawn.footprints.find(f=>f.id===desk.id);
 assert(book,variant+' supported book missing');assert.equal(book.supportId,desk.id);assert(book.bounds[0]>=support.supportBounds[0]&&book.bounds[1]>=support.supportBounds[1]);
}
console.log('PASS tabletop support follows approved and moved desk');
