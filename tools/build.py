"""One approved HTML source; deterministic distribution, no runtime patches."""
from pathlib import Path
import re,json,gzip,base64,hashlib
from svg_pool import share
from layout_pool import pack as pack_layouts
r=Path(__file__).resolve().parents[1];s=(r/'examples/WIZAMAP_FIXED_UI.html').read_text()
packed=re.search(r'<script[^>]*id="wzw-embedded-atlas"[^>]*>(.*?)</script>',s,re.S)[1]
data=json.loads(gzip.decompress(base64.b64decode(packed)))
assert len(data['maps'])==13
# Remove JSON whitespace inside compressed transport; preserve every map/vector.
raw=json.dumps(data,ensure_ascii=False,separators=(',',':')).encode();payload=base64.b64encode(gzip.compress(raw,compresslevel=9,mtime=0)).decode()
s=s.replace(packed,payload)
(r/'examples/WIZAMAP_FIXED_UI.html').write_text(s)
css=re.search(r'<style>(.*?)</style>',s,re.S)[1]
body=re.search(r'<body>(.*?)</body>',s,re.S)[1];scripts=re.findall(r'<script([^>]*)>(.*?)</script>',body,re.S);code=scripts[-1][1]
body=re.sub(r'<script\b[^>]*>.*?</script>','',body,flags=re.S)
code=code[:code.index('async function boot()')]
# Offline-only picker is not shipped to RP runtime.
code=re.sub(r'function mountTemplatePicker\(\)\{.*?\n\}', '', code, flags=re.S)
pack='window.WZW_TEMPLATE_PACK='+json.dumps(payload)+';\n'
# Runtime consumes recipe identities/inventory only; reference transforms/descriptions stay in source.
recipes=json.loads((r/'assets/recipes.json').read_text())
compact_recipes={rid:{**{k:recipe[k] for k in ['w','h','minW','minH','sizeProfiles','instancesBySize'] if k in recipe},**({'instances':recipe['instances']} if not all(size in recipe.get('instancesBySize',{}) for size in ['S','M','L']) else {})} for rid,recipe in recipes.items()}
layout_payload=json.dumps(pack_layouts(json.loads((r/'assets/layout-sizes.json').read_text())),ensure_ascii=False,separators=(',',':')).encode()

atlas=json.loads((r/'assets/atlas.json').read_text());atlas['fixed']={fid:{'places':[{'id':p['id'],'aliases':p['aliases']} for p in f['places'] if p.get('aliases')]} for fid,f in atlas['fixed'].items()} # Artwork already packed; only lookup aliases belong here.
# Reuse the supplied architecture core, excluding the reference editor UI/startup.
# Patterns, wall projection and openings have one active implementation.
corridors=(r/'assets/source/corridors.js').read_text()
corridors=corridors[:corridors.index('function Q(')]
corridors=re.sub(r'try\{const t=JSON.parse\(e\("saved-state"\).textContent\);.*?\}catch\{\}', '', corridors)
architecture='const CORRIDORS=(()=>{'+corridors+';return {build:V,draw:q,defaults:s,templates:t,decor:Z,decorate:A,patterns:N,opening:R,yard:G,materials:S};})();\n'
catalog=json.loads((r/'assets/catalog.json').read_text())
runtime_catalog={k:{field:value for field,value in a.items() if field!='svg' or not a.get('corridorSource')} for k,a in catalog.items()}
runtime_catalog,shared_svg=share(runtime_catalog)
entry='const CATALOG='+json.dumps(runtime_catalog,ensure_ascii=False,separators=(',',':'))+';\nfor(const asset of Object.values(CATALOG))if(asset.svgRef)asset.svg=CATALOG[asset.svgRef].svg;\nfor(const asset of Object.values(CATALOG))if(asset.corridorSource)Object.defineProperty(asset,\"svg\",{get:()=>corridorAssetMarkup(asset)});\n'+architecture+'const LAYOUT_SIZES_PACK='+json.dumps(base64.b64encode(gzip.compress(layout_payload,compresslevel=9,mtime=0)).decode())+';\nlet LAYOUT_SIZES=null;\n'+'const VOCAB='+(r/'assets/vocabulary.json').read_text()+';\nconst RECIPES='+json.dumps(compact_recipes,ensure_ascii=False,separators=(',',':'))+';\nconst ROOM_FORMULAS='+(r/'assets/room-formulas.json').read_text()+';\nconst ATLAS='+json.dumps(atlas,ensure_ascii=False,separators=(',',':'))+';\n'+'\n'.join((r/'src'/name).read_text() for name in ['contract.js','props.js','resolver.js','draw.js','build.js','index.js'])
bundle='(()=>{\nif(window.WZW_BOOT)return;\n'+"const root=document.getElementById('wzw-map');if(!root)throw Error('Missing wzw-map root');root.innerHTML="+json.dumps(body,ensure_ascii=False)+';\n'+code+'\n'+entry+'\n})();\n'
for name,content in [('shell.css',css),('templates-pack.js',pack),('bundle.js',bundle)]: (r/'dist'/name).write_text(content)
report={p.name:{'bytes':len(p.read_bytes()),'gzipBytes':len(gzip.compress(p.read_bytes(),mtime=0)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [r/'examples/WIZAMAP_FIXED_UI.html',*sorted((r/'dist').glob('*'))]}
(r/'docs/build-metrics.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
