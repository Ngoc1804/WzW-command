let sceneData=null;const runtimeShell=root.innerHTML;
let selectedMapPlace=null;
const fallbackHear='Không có hoạt động gì đáng chú ý.';
const fallbackObserve='Không gian yên tĩnh, không có gì đặc biệt.';
const idleHint='Đi khám phá nào';
function inspectorText(selector,value,idle=false){const el=$(selector);if(!el)return;el.textContent=value;el.style.opacity=idle?'.48':'';el.style.fontStyle=idle?'italic':'';}
function inferFixedRelation(entity,places){
 if(['near','around','inside','on'].includes(entity.relation))return entity.relation;
 if(entity.spot==='inside')return'inside';
 if(entity.spot==='outdoor'&&/black-lake|lakeside|region-3/.test(entity.placeId||''))return'near';
 const place=places.find(p=>p.id===entity.placeId||p.name===entity.placeName);
 const ref=[entity.placeName,entity.placeId,place?.name].filter(Boolean).join(' ').toLowerCase();
 if(/(?:quanh|đi dạo|around|h1-outer-lawns|h1-grounds)/.test(ref))return'around';
 if(/(?:^|\s)(?:trên sân|on field|trên quảng trường)/.test(ref))return'on';
 if(/(?:gần|ven|bờ|bìa|lối|dưới|near|edge|approach|path|lake-tree|h1-lake|h1-hagrid-hut)/.test(ref))return'near';
 return '';
}
function shortRP(value,fallback=''){const s=String(value||'').replace(/\s+/g,' ').trim();return (s||fallback).split(/\s+/).slice(0,19).join(' ');}
function putContextLocation(value){const el=$('#context-location');if(el){el.textContent=value||'';el.hidden=!value;}}
function setAreaIdentity(title='',room=''){
 put('#area-heading',sceneData?.meta?.areaName||'Khu vực hiện tại');
 put('#place-title',title);put('#place-area',room);putContextLocation('');
}
function inspect(place,kind='room',entity=null){
 selectedMapPlace=place||null;
 const go=$('#go-there');if(go)go.disabled=!place;put('#go-status','');
 const title=kind==='actor'?entity?.name:kind==='event'?entity?.title:place?.name;
 setAreaIdentity(title||'',place&&kind!=='room'?place.name:'');
 put('#drawer-name',title||sceneData?.meta?.areaName||'Khu vực');
 inspectorText('#activity',place?shortRP(kind==='actor'?entity?.activity||entity?.summary||place.overhear:kind==='event'?entity?.detail||place.overhear:place.overhear,fallbackHear):idleHint,!place);
 inspectorText('#observation',place?shortRP(kind==='actor'?entity?.observation||place.description||place.desc:place.description||place.desc,fallbackObserve):idleHint,!place);
 const list=$('#actors');list.replaceChildren();
 if(!place)return;
 if(matchMedia('(max-width:720px)').matches){$('.layout')?.classList.add('drawer-open');$('#drawer-toggle')?.setAttribute('aria-expanded','true');}
 const actors=inspectorActors(kind==='actor'?[entity]:groupRoomActors(sceneData.actors).filter(a=>a.placeId===place.id));
 for(const a of actors){if(!a||a.isPC)continue;const row=actorTag(a,true);row.onclick=()=>showActorDetails(a,place);list.append(row);}
}
function travelCopyText(){
 if(!selectedMapPlace)return '';
 const read=selector=>$(selector)?.textContent.trim()||'';
 return `/NEXT - ${read('#place-title')||selectedMapPlace.name} - ${sceneData?.meta?.areaName||''} - ${selectedMapPlace.name}

AI ĐÓ: ${[...$('#actors').children].map(tag=>tag.textContent.trim()).join(', ')}

QUAN SÁT: ${read('#observation')}

[ Nhập hành động ở đây ]`;
}
async function copyTravel(){
 const text=travelCopyText();if(!text)return;
 let copied=false;
 try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);copied=true;}}catch{}
 if(!copied){
  const focus=document.activeElement,field=document.createElement('textarea');field.value=text;field.setAttribute('readonly','');field.style.cssText='position:fixed;left:-9999px;top:0';root.append(field);field.select();
  try{copied=document.execCommand('copy');}catch{}finally{field.remove();focus?.focus();}
 }
 put('#go-status',copied?'Đã sao chép':'Không thể sao chép. Hãy cho phép quyền sao chép.');
}
function showEventDetails(event,place){inspect(place,'event',event);}
function renderContents(scene){const list=$('#quests');list.replaceChildren();const entries=[],eventLocations=new Set();
 for(const e of sceneData.events){const place=scene.exact(e.placeId||e.placeName);if(!place)continue;eventLocations.add(place.id);entries.push({type:'event',value:e,place,title:e.title,summary:shortRP(e.detail,'Có điều thú vị ở đây.').split(/\s+/).slice(0,10).join(' ')});}
 for(const a of sceneData.actors){if(a.isPC||a.unresolvedAnchor)continue;const place=scene.exact(a.placeId||a.placeName);if(!place||eventLocations.has(place.id))continue;entries.push({type:'actor',value:a,place,title:a.name,summary:shortRP(a.activity||a.summary||a.observation,'Có người ở khu vực này.').split(/\s+/).slice(0,10).join(' ')});}
 put('#hintcount',String(entries.length));
 for(const entry of entries){const row=document.createElement('button');row.type='button';row.className='event-row';const name=document.createElement('strong');name.textContent=entry.title;const subtitle=document.createElement('em');subtitle.textContent=entry.summary;row.append(name,subtitle);row.title=entry.title+' · '+entry.summary;
 row.onclick=()=>{if(entry.type==='actor'){showActorDetails(entry.value,entry.place);presentation?.focusActor(entry.value);}else{showEventDetails(entry.value,entry.place);presentation?.focusEvent(entry.value);}const layout=$('.layout');if(matchMedia('(max-width:720px)').matches&&layout){layout.classList.add('drawer-open');$('#drawer-toggle')?.setAttribute('aria-expanded','true');}};list.append(row);}
}
async function renderInput(input){const renderStart=performance.now();root.parentElement.querySelectorAll('[data-rp-detail]').forEach(e=>e.remove());sceneData=normalize(input);const d=sceneData;
 if(d.fatal){
  window.WZW_SCENE=null;presentation?.dispose();stopScene();$("#mapmount").replaceChildren();
  inspect(null);$("#quests")?.replaceChildren();put("#hintcount",'0');
  inspectorText("#observation",'Không thể dựng bản đồ vì dữ liệu chưa hợp lệ.');
  root.dataset.status="invalid-data";return null;
 }
 if(!window.WZW_ORIGINAL_MAPS)window.WZW_ORIGINAL_MAPS=structuredClone(DATA.maps);DATA.maps=structuredClone(window.WZW_ORIGINAL_MAPS);
 const scene=resolve(d);d.unresolvedPlaces=scene.unresolved;
 if(!scene.source&&!scene.places.length){
  presentation?.dispose();stopScene();$("#mapmount").replaceChildren();
  const note=document.createElement('p');note.setAttribute('role','status');
  note.textContent='Chưa có địa điểm nào để hiển thị.';$("#mapmount")?.append(note);
  inspect(null);$("#quests")?.replaceChildren();put("#hintcount",'0');
  root.dataset.status='empty-map';window.WZW_SCENE={...scene,rendered:null};return scene;
 }
 let mapId=scene.source?scene.fixedId:'rp-scene';if(scene.source){DATA.maps[mapId].places=scene.places.filter(p=>scene.source.places.some(x=>x.id===p.id));}else DATA.maps[mapId]=finishCorridorMap(buildMap(scene,d),scene,d);
 await setTemplate(mapId);
 if(scene.source)mountFixedScene(scene);
 async function mount(){DATA.maps[activeId].actorPoints=[];for(const a of d.actors){a.relation=inferFixedRelation(a,d.places);const place=scene.exact(a.placeId||a.placeName);a.placeId=place?.id;if(a.isPC){a.placeName=d.pcPlace;a.placeId=scene.exact(d.pcPlace)?.id;a.spot=d.pcSpot||a.spot;}a.inside=a.spot==='inside';a.scenePoint=undefined;a.unresolvedAnchor=false;const resolved=scene.exact(a.placeId||a.placeName);a.hearingText=resolved?.overhear||'';if(!resolved)a.unresolvedAnchor=true;const map=DATA.maps[activeId];if(!scene.source&&resolved){a.scenePoint=generatedActorPoint(map,resolved,a.spot,a);if(!a.scenePoint)a.unresolvedAnchor=true;else if(!a.isPC&&map.kind==='outdoor'&&a.scenePoint.buildingAnchor)a.footstep='hidden';}/* Footstep visibility follows the active map's presentation policy. */}for(const e of d.events){e.relation=inferFixedRelation(e,d.places);e.placeId=scene.exact(e.placeId||e.placeName)?.id;}await presentation.mountActors(d.actors.filter(a=>a.placeId&&!a.unresolvedAnchor));presentation.mountEvents(d.events.filter(e=>e.placeId));svg.addEventListener('wzw-place-selected',e=>inspect(scene.places.find(p=>p.id===e.detail.id)));inspect(null);renderContents(scene);}
 await mount();root.querySelector('.sidebar-foot')?.remove();put('#map-caption',String(d.meta.areaName||'').toUpperCase());for(const [selector,value]of [['.quote',d.meta.quote],['.date',d.meta.date],['.clock',d.meta.time]]){const el=$(selector);if(el)el.textContent=value||'';}
 root.dataset.status='ready';root.dataset.renderMs=String(performance.now()-renderStart);window.WZW_SCENE={...scene,rendered:{kind:DATA.maps[activeId].kind,geometry:DATA.maps[activeId].geometry,footprints:DATA.maps[activeId].footprints,corridorFinish:DATA.maps[activeId].corridorFinish},diagnostics:d.diagnostics};return scene;}
let renderQueue=Promise.resolve(),initialized=false;
function enqueue(input){const task=renderQueue.then(()=>renderInput(input));renderQueue=task.catch(()=>{});return task;}
function transportError(message,status='incomplete'){
 presentation?.dispose();stopScene();window.WZW_SCENE=null;sceneData=null;
 root.replaceChildren();const p=document.createElement('p');p.setAttribute('role','alert');p.textContent=message;root.append(p);root.dataset.status=status;
}
async function initialize(){if(initialized)return;
 if(!window.WZW_TEMPLATE_PACK)throw Error('Template pack unavailable');
 const b=Uint8Array.from(atob(window.WZW_TEMPLATE_PACK),c=>c.charCodeAt(0));
 DATA=JSON.parse(await new Response(new Blob([b]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
 // One compressed canonical layout payload (49 recipes × S/M/L); decompress once on boot.
 const bytes=Uint8Array.from(atob(LAYOUT_SIZES_PACK),c=>c.charCodeAt(0));
 const layoutPayload=JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
 LAYOUT_SIZES=layoutPayload.layouts;
 for(const sizes of Object.values(LAYOUT_SIZES))for(const art of Object.values(sizes))if(art.defsRef){art.defs=layoutPayload.defs[art.defsRef];delete art.defsRef;}
 if(!document.getElementById("mapmount"))root.innerHTML=runtimeShell;bindUI();const go=$('#go-there');if(go)go.onclick=copyTravel;initialized=true;
}
async function boot(){let input=window.MAP_DATA;
 try{const t=document.getElementById('map-data');if(t)input=JSON.parse(t.textContent)}
 catch{transportError('MAP_DATA sai JSON hoặc bị cắt. Chưa dựng cảnh RP.');return;}
 try{if(window.WZW_LOAD_FAILED)throw Error('Không tải được CSS hoặc template pack');await initialize();window.MAP_DATA=input;await enqueue(input)}
 catch(error){console.error('WIZAMAP render error',error);transportError('Không thể mở bản đồ. Vui lòng kiểm tra dữ liệu bản đồ.','text-fallback');}
}
window.WZWMap={normalize,composeRoom,render:async input=>{await window.WZWMap.ready;
 if(!initialized)await initialize();
 window.MAP_DATA=input;return enqueue(input)}};
if(!window.WZW_BOOT){window.WZW_BOOT=true;window.WZWMap.ready=boot();}
