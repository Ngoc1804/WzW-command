function resolve(d){
 const diagnostics=d.diagnostics;
 const seenNames=new Map();for(const p of d.places){const name=key(p.name),previous=seenNames.get(name);if(previous&&(!p.id||!previous.id||p.id===previous.id))diagnostics.push('duplicate-place-name:'+p.name);if(!previous)seenNames.set(name,p);}
 let cluster=ATLAS.clusters[d.atlasAnchor],fixedId=Object.hasOwn(DATA.maps,d.atlasAnchor)?d.atlasAnchor:null;
 if(!fixedId&&cluster&&!cluster.rooms.length&&cluster.pointers.length===1&&DATA.maps[cluster.pointers[0]])fixedId=cluster.pointers[0];
 const sandbox=d.forceSandbox||(['h1','h2'].includes(fixedId)&&d.places.some(p=>p.isNewConstruction));
 const source=sandbox?null:fixedId?DATA.maps[fixedId]:null;
 if(source)return resolveFixed(d,fixedId,source);
 // MAP_DATA owns Generated scene membership; Atlas is an enrichment registry, not a room quota.
 let places=source?source.places.map(p=>({...p})):[];
 let registry=!source&&!sandbox&&cluster?cluster.rooms:[];
 const bindings={},unresolved=[];
 // World registry selects one focus building, never every site in a macro region.
 let worldSite=null,worldMode=null;
 const fold=v=>key(v).normalize('NFD').replace(/\p{M}/gu,'').replace(/đ/g,'d').replace(/[’']/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
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
 // Fixed lookup is owned exclusively by fixed-locations.js.
 const shortKeys=d.atlasAnchor==='F5-N'?{'hogwarts-library':'F5-N:01'}:{};
 const exact=ref=>{
  if(!ref)return null;
  if(bindings[ref])return places.find(p=>p.id===bindings[ref])||null;
  if(worldSite){const r=worldRef(ref),hits=places.filter(p=>fold(p.name)===r.label&&(!r.level||p.level===r.level));if(hits.length===1)return hits[0];}
  const id=shortKeys[key(ref)]||ref,byId=places.find(p=>p.id===id);if(byId)return byId;
  const hits=places.filter(p=>[p.name,...(p.aliases||[])].some(n=>fold(n)===fold(ref)));return hits.length===1?hits[0]:null;
 };
 // Generated catalogue lookups preserve native furniture/architecture without drawing unused rooms.
 // Gemini is responsible for translating Vietnamese/English synonyms to a unique ID.
 // English technical identity always wins; Vietnamese display text never overrides a room ID.
 const catalogPlace=p=>{
  if(sandbox)return null;
  const candidates=ref=>registry.filter(x=>[x.name,...(x.aliases||[])].filter(Boolean).some(n=>fold(n)===fold(ref)));
  if(p.id){
   const native=registry.filter(x=>x.id===(shortKeys[key(p.id)]||p.id));if(native.length===1)return native[0];
   // W4 English room keys (e.g. "Kitchen") may resolve to Atlas canonical IDs.
   const english=candidates(p.id);if(english.length===1)return english[0];
   if(english.length>1)diagnostics.push('ambiguous-english-room-id:'+p.id);
   // A supplied English/W4 ID is authoritative even without an Atlas entry.
   // Never replace it with a different ID via placeName or Vietnamese label.
   return null;
  }
  const refs=[p.placeName,...(p.aliases||[]),...(!p.id?[p.name]:[])].filter(Boolean);
  const matches=registry.filter(x=>refs.some(ref=>[x.name,...(x.aliases||[])].filter(Boolean).some(n=>fold(n)===fold(ref))));
  if(matches.length===1)return matches[0];
  if(matches.length>1)diagnostics.push('ambiguous-atlas-room:'+p.name);
  return null;
 };
 const locate=p=>{
  if(p.id){const hit=places.find(x=>x.id===p.id);if(hit)return hit;}
  if(!source&&!sandbox){
   const native=catalogPlace(p);if(native)return native;
   // A declared English/native key must never fall back to another room's Vietnamese name.
   if(p.id||p.placeName)return null;
  }
  const hit=exact(p.name,p.region||d.region);
  if(hit){if(p.id&&p.id!==hit.id)diagnostics.push('place-id-fallback:'+p.id);return hit;}
  return catalogPlace(p);
 };
 const bindName=(label,id)=>{
  if(!label)return;
  if(Object.hasOwn(bindings,label)&&bindings[label]!==id){bindings[label]=null;diagnostics.push('ambiguous-place-label:'+label);}
  else if(!Object.hasOwn(bindings,label))bindings[label]=id;
 };
 const sorted=d.places;
 const emitted=new Set();
 for(const p of sorted){
  let match=locate(p);
  if(match){
   // Exactly one rendered room per resolved physical identity, even if two labels were supplied.
   if(emitted.has(match.id)){diagnostics.push('duplicate-resolved-place:'+match.id);if(p.id)bindings[p.id]=match.id;bindName(p.name,match.id);continue;}
   const canonical=places.find(x=>x.id===match.id);
   const target=canonical||{...match};
   const originalCoords={};
   // RP overrides Atlas only for values explicitly supplied; an empty type cannot erase its recipe.
   const overrides={...p};if(!overrides.type)delete overrides.type;
   Object.assign(target,overrides,{id:match.id,description:p.description||target.description||target.desc,desc:p.description||target.description||target.desc,...originalCoords});
   if(!canonical)places.push(target);
   emitted.add(match.id);bindName(p.name,match.id);bindName(p.placeName,match.id);if(p.id)bindings[p.id]=match.id;
  }
  else{
   // Room membership comes from MAP_DATA; Atlas only enriches visuals.
   const duplicate=places.some(x=>p.id?x.id===p.id:key(x.name)===key(p.name));
   if(duplicate){unresolved.push(p);diagnostics.push('ambiguous-place:'+p.name);continue;}
   const id=p.id||'rp:'+key(p.name);
   places.push({...p,id,desc:p.description});emitted.add(id);bindName(p.name,id);if(p.id)bindings[p.id]=id;
  }
 }
 // New RP places are allowed in Generated, but an invalid ID must not become a fictitious named room.
 for(const ref of [d.pcPlace,...d.actors.filter(a=>!a.isPC).map(a=>a.placeId||a.placeName),...d.events.map(e=>e.placeId||e.placeName)].filter(Boolean)){
  if(exact(ref))continue;
  const actor=d.actors.find(a=>a.placeId===ref),event=d.events.find(e=>e.placeId===ref);
  const name=actor?.placeName||event?.placeName||ref;
  const hit=exact(name);if(hit){bindings[ref]=hit.id;diagnostics.push('reference-name-fallback:'+ref);continue;}
  if(d.actors.some(a=>a.placeId===ref&&!a.placeName)||d.events.some(e=>e.placeId===ref&&!e.placeName)){diagnostics.push('unresolved-location:'+ref);continue;}
  // MAP_DATA is the sole room-membership authority: unresolved actor/event refs
  // must not silently fabricate additional Generated rooms.
  diagnostics.push('unresolved-location-not-in-map-data:'+ref);
 }
 for(const place of places){place.description=place.description||place.desc||'Không gian yên tĩnh, không có gì đặc biệt.';place.overhear=place.overhear||'Không có hoạt động gì đáng chú ý.';place.inventory=composeRoom(place);}
 // An empty Generated MAP_DATA is an empty scene, not a new room.
 return {worldSite,mapMode:worldMode,source,fixedId:source?fixedId:null,cluster:sandbox?null:cluster,places,bindings,unresolved,diagnostics,detail:false,route:source?'fixed':cluster&&!sandbox?'atlas':'sandbox',exact};
}
