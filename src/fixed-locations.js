// Technical lookup only. No story selection or new room/actor generation.
function resolveFixed(d,fixedId,source){
 const diagnostics=d.diagnostics,contract=FIXED_CONTRACT[fixedId],native=source.places,bindings={},requested=new Map(),places=[];
 const nativeById=new Map(native.map(p=>[p.id,p])),allowed=new Set(Object.values(contract));
 const resolveAnchor=ref=>{if(!ref)return null;const id=contract[ref]||source.lookupAliases?.[ref]||ref;return allowed.has(id)?nativeById.get(id):null;};
 // All approved physical sites remain selectable; unrelated artwork is background only.
 for(const id of allowed){const p=nativeById.get(id);if(p)places.push({...p});}
 const find=ref=>{if(bindings[ref])return places.find(p=>p.id===bindings[ref])||null;return places.find(p=>p.id===ref)||null;};
 const bind=(ref,id)=>{if(!ref)return;if(bindings[ref]&&bindings[ref]!==id){bindings[ref]=null;diagnostics.push('ambiguous-place-label:'+ref);}else bindings[ref]=id;};
 const unresolved=[];
 for(const p of d.places){
  const anchor=resolveAnchor(p.anchor||p.id)||(!p.anchor?native.find(n=>allowed.has(n.id)&&[n.name,...(n.aliases||[]),...(ATLAS.fixed[fixedId]?.places.find(a=>a.id===n.id)?.aliases||[])].some(v=>key(v)===key(p.placeName||p.name))):null);
  if(!anchor){unresolved.push(p);diagnostics.push('unresolved-fixed-place:'+p.name);continue;}
  const id=p.id||anchor.id;
  if(requested.has(id)){diagnostics.push('duplicate-place-id:'+id);continue;}
  const target={...anchor,...p,id,nativeAnchor:anchor.id,description:p.description||anchor.description||anchor.desc,desc:p.description||anchor.description||anchor.desc};
  // RP cannot rewrite technical floor boundaries or placement masks.
  for(const k of ['x','y','freeRegion','regionBox','geometry','bounds'])if(anchor[k]!==undefined)target[k]=anchor[k];
  if(p.position!==undefined){if(Array.isArray(p.position)&&p.position.length===2&&p.position.every(v=>Number.isFinite(v)&&v>=0&&v<=1))target.position=[...p.position];else{delete target.position;diagnostics.push('invalid-region-position:'+id);}}
  if(id===anchor.id){const index=places.findIndex(p=>p.id===id);places[index]=target;}else places.push(target);
  requested.set(id,target);bind(id,id);bind(p.name,id);bind(p.placeName,id);
 }
 const exact=ref=>find(ref)||(()=>{const a=resolveAnchor(ref);return a?requested.get(ref)||find(a.id):null;})();
 for(const p of places)p.inventory={objects:[],diagnostics:[],illustrative:false};
 return{worldSite:null,mapMode:'template',source,fixedId,cluster:null,places,bindings,unresolved,diagnostics,detail:false,route:'fixed',exact};
}
function mountFixedScene(scene){
 const map=DATA.maps[activeId],allowed=new Set(scene.places.map(p=>p.nativeAnchor||p.id));
 // Disable obsolete/decoration click targets, keeping every painted element intact.
 for(const node of [...svg.querySelectorAll('[data-id]')])if(!node.closest('defs')&&!allowed.has(node.dataset.id)){node.dataset.legacyId=node.dataset.id;node.removeAttribute('data-id');node.removeAttribute('tabindex');node.removeAttribute('role');}
 for(const place of scene.places){
  const id=place.nativeAnchor||place.id,source=[...svg.querySelectorAll('[data-id]')].find(n=>n.dataset.id===id&&!n.closest('defs'));
  if(source&&place.id===id){source.setAttribute('aria-label',place.name);continue;}
  if(!source&&!place.freeRegion)continue;
  const box=place.freeRegion?{x:originalVB[0]+place.regionBox[0]*originalVB[2],y:originalVB[1]+place.regionBox[1]*originalVB[3],w:place.regionBox[2]*originalVB[2],h:place.regionBox[3]*originalVB[3]}:worldBox(source);
  const group=uiElement('g',{'data-id':place.id,'data-presentation-anchor':'scene','aria-label':place.name},svg);
  uiElement('rect',{x:box.x,y:box.y,width:box.w,height:box.h,fill:'transparent','pointer-events':'none'},group);
 }
 // Every overlay keeps its own scene identity, including two places on one region.
 map.places=scene.places;
 map.lookupAliases=Object.fromEntries(scene.places.map(p=>[p.id,p.id]));
}
