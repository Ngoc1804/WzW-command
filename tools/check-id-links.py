"""Read-only integrity checks against current canonical JSON and packed runtime."""
from pathlib import Path
import json,re,gzip,base64,collections,xml.etree.ElementTree as ET
from layout_pool import unpack
root=Path(__file__).resolve().parents[1]
read=lambda p:json.loads((root/p).read_text())
c=read('assets/catalog.json');r=read('assets/recipes.json');a=read('assets/atlas.json');l=read('assets/layout-sizes.json');v=read('assets/vocabulary.json');issues=[]
for rid,recipe in r.items():
 for size in ['S','M','L']:
  art=l[rid][size];items=recipe.get('instancesBySize',{}).get(size,recipe['instances']);byid={i['id']:i for i in items}
  if len(byid)!=len(items):issues.append(['duplicate-instance',rid,size])
  if set(byid)!={i['id']for i in art['objects']}:issues.append(['inventory-art',rid,size])
  for item in items:
   if item['item']not in c:issues.append(['missing-item',rid,size,item['item']])
  for obj in art['objects']:
   if obj['id']in byid and obj['item']!=byid[obj['id']]['item']:issues.append(['art-item',rid,size,obj['id']])
rooms=[]
for scope,cluster in a['clusters'].items():
 for p in cluster['rooms']+[p for site in cluster.get('sites',[])for p in site['rooms']]:
  rooms.append(p['id'])
  if p.get('type')and p['type']not in r:issues.append(['atlas-recipe',scope,p['id']])
 for pointer in cluster.get('pointers',[]):
  if pointer not in a['fixed']and pointer not in a['clusters']:issues.append(['pointer',scope,pointer])
if len(rooms)!=len(set(rooms)):issues.append(['duplicate-room-id'])
for group,target in [('recipes',r),('legacyRecipes',r),('scopes',{**a['fixed'],**a['clusters'],'custom':{}}),('itemAliases',c)]:
 for alias,key in v.get(group,{}).items():
  if key not in target:issues.append(['alias',group,alias,key])
for key,obj in c.items():
 try:svg=ET.fromstring(obj['svg'])
 except ET.ParseError:issues.append(['svg-parse',key]);continue
 ids=[n.get('id')for n in svg.iter()if n.get('id')];refs=set()
 for node in svg.iter():
  for attr,value in node.attrib.items():
   refs.update(re.findall(r'url\([\"\']?#([^\)\"\']+)',value))
   if attr.endswith('href')and value.startswith('#'):refs.add(value[1:])
 if len(ids)!=len(set(ids)):issues.append(['duplicate-svg-id',key])
 for ref in refs-set(ids):issues.append(['svg-ref',key,ref])
bundle=(root/'dist/bundle.js').read_text();decoder=json.JSONDecoder()
for name,data in [('CATALOG',c),('RECIPES',r),('ATLAS',a)]:
 packed=decoder.raw_decode(bundle.split('const '+name+'=',1)[1])[0]
 if set(data)!=set(packed):issues.append(['runtime-keys',name])
packed=decoder.raw_decode(bundle.split('const LAYOUT_SIZES_PACK=',1)[1])[0]
if unpack(json.loads(gzip.decompress(base64.b64decode(packed))))!=l:issues.append(['runtime-layout-payload'])
fixed=read('assets/atlas.json')['fixed'];html=(root/'examples/WIZAMAP_FIXED_UI.html').read_text();pack=json.loads(gzip.decompress(base64.b64decode(re.search(r'id="wzw-embedded-atlas"[^>]*>(.*?)</script>',html,re.S)[1])))
for fid,source in fixed.items():
 actual={p['id']for p in pack['maps'][fid]['places']}
 for p in source['places']:
  if p['id']not in actual:issues.append(['fixed-binding',fid,p['id']])
report={'catalog':len(c),'recipes':len(r),'views':sum(len(x)for x in l.values()),'fixed':len(fixed),'scopes':len(a['clusters']),'roomsIncludingWorld':len(rooms),'issues':issues}
(root/'work').mkdir(exist_ok=True);(root/'work/id-audit.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2));raise SystemExit(bool(issues))
