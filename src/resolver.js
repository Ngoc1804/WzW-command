function resolve(d){
 const diagnostics=d.diagnostics;
 const seenNames=new Set();for(const p of d.places){if(seenNames.has(key(p.name)))diagnostics.push('duplicate-place-name:'+p.name);seenNames.add(key(p.name));}
 let cluster=ATLAS.clusters[d.atlasAnchor],fixedId=Object.hasOwn(DATA.maps,d.atlasAnchor)?d.atlasAnchor:null;
 if(!fixedId&&cluster&&!cluster.rooms.length&&cluster.pointers.length===1&&DATA.maps[cluster.pointers[0]])fixedId=cluster.pointers[0];
 const sandbox=d.forceSandbox||(['h1','h2'].includes(fixedId)&&d.places.some(p=>p.isNewConstruction));
 const source=sandbox?null:fixedId?DATA.maps[fixedId]:null;
 // MAP_DATA owns Generated scene membership; Atlas is an enrichment registry, not a room quota.
 let places=source?source.places.map(p=>({...p})):[];
 let registry=!source&&!sandbox&&cluster?cluster.rooms:[];
 const bindings={},used=new Set(),unresolved=[];
 // World registry selects one focus building, never every site in a macro region.
 let worldSite=null,worldMode=null;
 const fold=v=>key(v).normalize('NFD').replace(/\p{M}/gu,'').replace(/đ/g,'d').replace(/[’']/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 const stripRelation=v=>fold(v).replace(/^(?:o|tai|gan|quanh|ven|ben|duoi|tren|trong|di dao quanh|loi vao|loi ra|near|around|inside|on|by|at)\s+/,'');
 const editDistance=(a,b)=>{if(Math.abs(a.length-b.length)>Math.max(2,Math.floor(Math.max(a.length,b.length)*.24)))return 999;
  let prev=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){const cur=[i];for(let j=1;j<=b.length;j++)cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=cur;}return prev[b.length];};
 const fixedNames=source&&ATLAS.fixed[fixedId]?new Map(ATLAS.fixed[fixedId].places.map(p=>[p.id,[p.name,...(p.aliases||[])].filter(Boolean)])):null;
 const worldRef=ref=>{let label=fold(ref);for(const alias of [...(worldSite?.aliases||[])].sort((a,b)=>b.length-a.length)){const a=fold(alias);if(label.startsWith(a+' ')){label=label.slice(a.length+1);break;}}const level=label.match(/^(g|f\d+)(?: |$)/)?.[1]?.toUpperCase();return{label:level?label.replace(/^(g|f\d+) ?/,''):label,level};};
 if(!source&&!sandbox&&cluster?.rpScope&&cluster.sites){
  const pcInput=d.places.find(p=>p.id===d.pcPlace||key(p.name)===key(d.pcPlace));
  const refs=[d.pcPlace,text(d.meta.areaName),pcInput?.name].filter(Boolean);
  for(const ref of refs){
   const label=fold(ref);
   const candidates=cluster.sites.filter(site=>site.aliases.some(alias=>{const a=fold(alias);return label===a||label.startsWith(a+' ')||label.endsWith(' '+a);}));
   if(candidates.length===1){worldSite=candidates[0];break;}
   if(candidates.length>1){diagnostics.push('ambiguous-world-site:'+ref);break;}
  }
  if(worldSite){
   const {label:roomLabel,level:explicitLevel}=worldRef(d.pcPlace);
   const focus=worldSite.rooms.filter(room=>fold(room.name)===roomLabel&&(!explicitLevel||room.level===explicitLevel));
   const level=explicitLevel||(focus.length===1?focus[0].level:null);
   if(focus.length===1)worldMode=focus[0].type?.startsWith('OUT_')?'outdoor':'indoor';
   else if(worldSite.rooms.length===1)worldMode=worldSite.rooms[0].type?.startsWith('OUT_')?'outdoor':'indoor';
   registry=worldSite.rooms.filter(room=>(!room.conditional||focus.includes(room))&&(!level||room.level===level));
   // The World site/level selects a catalogue, never auto-adds its unrequested rooms.
   if(focus.length===1)bindings[d.pcPlace]=focus[0].id;
  }
 }
 const exact=(ref,region=d.region)=>{
  if(!ref)return null;
  const bound=bindings[ref];if(bound)return places.find(p=>p.id===bound)||null;
  if(worldSite){const r=worldRef(ref),hits=places.filter(p=>fold(p.name)===r.label&&(!r.level||p.level===r.level));if(hits.length===1)return hits[0];}
  const byId=places.filter(p=>p.id===ref);if(byId.length===1)return byId[0];
  // Preserve existing strict shop/room bindings; fuzzy tolerance is for outdoor overview owners only.
  if(source&&!['h1','h2'].includes(fixedId)){
   const canonical=key(ref),hits=places.filter(p=>key(p.name)===canonical||p.aliases?.some(a=>key(a)===canonical)||ATLAS.fixed[fixedId]?.places.find(x=>x.id===p.id)?.aliases?.some(a=>key(a)===canonical));
   if(hits.length>1&&fixedId==='diagon-knockturn'&&['diagon','knockturn'].includes(region)){const scoped=hits.filter(p=>p.id.startsWith(region==='diagon'?'da-':'ka-'));return scoped.length===1?scoped[0]:null;}
   return hits.length===1?hits[0]:null;
  }
  const canonical=fold(ref),bare=stripRelation(ref);
  const labels=p=>[p.id,p.name,...(p.aliases||[]),...(fixedNames?.get(p.id)||[])].filter(Boolean).map(fold);
  const hits=places.filter(p=>labels(p).some(name=>name===canonical||name===bare));
  const scope=arr=>arr.length>1&&fixedId==='diagon-knockturn'&&['diagon','knockturn'].includes(region)?arr.filter(p=>p.id.startsWith(region==='diagon'?'da-':'ka-')):arr;
  const direct=scope(hits);if(direct.length===1)return direct[0];if(direct.length>1)return null;
  // Fuzzy is a spelling fallback, never a semantic location guess.
  if(!source||bare.length<7)return null;
  const scores=places.map(p=>({p,distance:Math.min(999,...labels(p).filter(s=>s.length>=7).map(s=>editDistance(bare,s)))})).sort((a,b)=>a.distance-b.distance);
  const threshold=Math.min(3,Math.floor(bare.length*.16));
  if(scores.length&&scores[0].distance<=threshold&&(!scores[1]||scores[1].distance-scores[0].distance>=2)){
   diagnostics.push('fuzzy-fixed-match:'+ref+'->'+scores[0].p.id);return scores[0].p;
  }
  return null;
 };
 // Generated catalogue lookups preserve native furniture/architecture without drawing unused rooms.
 // Gemini is responsible for translating Vietnamese/English synonyms to a unique ID.
 const catalogPlace=p=>{
  if(source||sandbox)return null;
  if(p.id){const idHits=registry.filter(x=>x.id===p.id);if(idHits.length===1)return idHits[0];}
  const names=[p.name,p.placeName,...(p.aliases||[])].filter(Boolean).map(fold);
  const matches=registry.filter(x=>[x.name,...(x.aliases||[])].filter(Boolean).some(n=>names.includes(fold(n))));
  if(matches.length===1)return matches[0];
  if(matches.length>1)diagnostics.push('ambiguous-atlas-room:'+p.name);
  return null;
 };
 const locate=p=>{
  if(p.id){const hit=places.find(x=>x.id===p.id);if(hit){if(key(hit.name)!==key(p.name))diagnostics.push('place-id-name-conflict:'+p.id);return hit;}}
  const hit=exact(p.name,p.region||d.region);
  if(hit){if(p.id&&p.id!==hit.id)diagnostics.push('place-id-fallback:'+p.id);return hit;}
  return catalogPlace(p);
 };
 // Reserve explicitly addressed houses before allocating AU entries. Stable ordering avoids payload-order reshuffles.
 for(const p of d.places){const hit=locate(p);if(hit)used.add(hit.id);}
 for(const ref of [d.pcPlace,...d.actors.map(a=>a.placeId||a.placeName),...d.events.map(e=>e.placeId||e.placeName)]){const hit=exact(ref);if(hit)used.add(hit.id);}
 // Keep RP room order; only Fixed AU house allocation requires sorting for stable assignment.
 const sorted=source?[...d.places].sort((a,b)=>key(a.id||a.name).localeCompare(key(b.id||b.name))):d.places;
 const emitted=new Set();
 for(const p of sorted){
  let match=locate(p);
  if(!match&&source&&['village-static','diagon-knockturn'].includes(fixedId)&&/shop|store|pub|cafe|house|home|tiệm|quán|nhà/.test(key(p.type)+' '+key(p.name))){
   const region=p.region||d.region;
   if(fixedId==='diagon-knockturn'&&!['diagon','knockturn'].includes(region))diagnostics.push('missing-alley-region:'+p.name);
   const pool=places.filter(x=>/^Nhà dân(?:\b|\s|$)/i.test(x.name)&&!used.has(x.id)&&(fixedId==='village-static'||region==='diagon'&&x.id.startsWith('da-')||region==='knockturn'&&x.id.startsWith('ka-'))).sort((a,b)=>a.id.localeCompare(b.id));
   if(pool.length){match=pool[0];used.add(match.id);}else diagnostics.push('no-empty-house-binding:'+p.name);
  }
  if(match){
   // Exactly one rendered room per resolved physical identity, even if two labels were supplied.
   if(emitted.has(match.id)){diagnostics.push('duplicate-resolved-place:'+match.id);if(p.id)bindings[p.id]=match.id;bindings[p.name]=match.id;continue;}
   const canonical=places.find(x=>x.id===match.id);
   const target=canonical||{...match};
   const originalCoords=source?{x:target.x,y:target.y}:{};
   // RP overrides Atlas only for values explicitly supplied; an empty type cannot erase its recipe.
   const overrides={...p};if(!overrides.type)delete overrides.type;
   Object.assign(target,overrides,{id:match.id,description:p.description||target.description||target.desc,desc:p.description||target.description||target.desc,...originalCoords});
   if(!canonical)places.push(target);
   emitted.add(match.id);bindings[p.name]=match.id;if(p.placeName)bindings[p.placeName]=match.id;if(p.id)bindings[p.id]=match.id;
  }
  else if(source){unresolved.push(p);diagnostics.push('unresolved-fixed-place:'+p.name);}
  else{
   const duplicate=places.some(x=>key(x.name)===key(p.name)||p.id&&x.id===p.id);
   if(duplicate){unresolved.push(p);diagnostics.push('ambiguous-place:'+p.name);continue;}
   const id=p.id||'rp:'+key(p.name);
   places.push({...p,id,desc:p.description});emitted.add(id);bindings[p.name]=id;if(p.id)bindings[p.id]=id;
  }
 }
 // New RP places are allowed in Generated, but an invalid ID must not become a fictitious named room.
 for(const ref of [d.pcPlace,...d.actors.filter(a=>!a.isPC).map(a=>a.placeId||a.placeName),...d.events.map(e=>e.placeId||e.placeName)].filter(Boolean)){
  if(exact(ref))continue;
  const actor=d.actors.find(a=>a.placeId===ref),event=d.events.find(e=>e.placeId===ref);
  const name=actor?.placeName||event?.placeName||ref;
  const hit=exact(name);if(hit){bindings[ref]=hit.id;diagnostics.push('reference-name-fallback:'+ref);continue;}
  if(source){diagnostics.push('unresolved-location:'+ref);continue;}
  if(d.actors.some(a=>a.placeId===ref&&!a.placeName)||d.events.some(e=>e.placeId===ref&&!e.placeName)){diagnostics.push('unresolved-location:'+ref);continue;}
  // MAP_DATA is the sole room-membership authority: unresolved actor/event refs
  // must not silently fabricate additional Generated rooms.
  diagnostics.push('unresolved-location-not-in-map-data:'+ref);
 }
 for(const place of places){place.description=place.description||place.desc||'Không gian yên tĩnh, không có gì đặc biệt.';place.overhear=place.overhear||'Không có hoạt động gì đáng chú ý.';place.inventory=source?{objects:[],diagnostics:[],illustrative:false}:composeRoom(place);}
 // An empty Generated MAP_DATA is an empty scene, not a new room.
 return {worldSite,mapMode:worldMode,source,fixedId:source?fixedId:null,cluster:sandbox?null:cluster,places,bindings,unresolved,diagnostics,detail:false,route:source?'fixed':cluster&&!sandbox?'atlas':'sandbox',exact};
}
