"""Guard reviewed room shells, paint order, native SVG and existing IDs."""
from pathlib import Path
import json,hashlib
r=Path(__file__).resolve().parents[1]
lock=json.loads((r/'docs/furniture-locks.json').read_text())
for p,digest in lock['files'].items():assert hashlib.sha256((r/p).read_bytes()).hexdigest()==digest,p+' changed'
catalog=json.loads((r/'assets/catalog.json').read_text())
for aid,digest in lock['catalogSVG'].items():assert hashlib.sha256(catalog[aid].get('svg','').encode()).hexdigest()==digest,aid+' original asset SVG changed'
layouts=json.loads((r/'assets/layout-sizes.json').read_text());recipes=json.loads((r/'assets/recipes.json').read_text())
assert list(layouts)==lock['recipes']==list(recipes),'recipe IDs/order changed'
keys=['width','height','wallHeight','floorSvg','floorShapes','architectureSvg','door','doorAnchor','floorFill','wallFill','sceneSvg','terrainShapes','walkableRects','defs','decorSvg']
hashv=lambda v:hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
count=0
for rid,sizes in layouts.items():
 for size,a in sizes.items():
  expected=lock['views'][rid][size]
  assert hashv({k:a[k]for k in keys if k in a})==expected['shell'],f'{rid}/{size}: shell changed'
  assert hashv([{k:v for k,v in o.items()if k not in ['furnitureGroup','placementRole','focalGroup']} for o in a['objects']])==expected['objects'],f'{rid}/{size}: source objects changed'
  count+=1
print(f'PASS {count} locked shells and source furniture; IDs, wall/floor/layer code, Fixed/UI, CSS and template pack unchanged')
