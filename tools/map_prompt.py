"""One fast-scan Gemini block: story settings, contract, native layout IDs, official loader."""
from pathlib import Path
import json,re,sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
from loader import loader
root=Path(__file__).resolve().parents[1];release=json.loads((root/'assets/runtime-release.json').read_text());sha=release['runtimeCommit'];assert re.fullmatch('[0-9a-f]{40}',sha)
base='https://cdn.jsdelivr.net/gh/'+release['repository']+'@'+sha+'/dist/'
r=json.loads((root/'assets/recipes.json').read_text());c=json.loads((root/'assets/catalog.json').read_text());a=json.loads((root/'assets/atlas.json').read_text())
def wrap(values):
 lines=[];line=''
 for value in values:
  if len(line)+len(value)+1>100:lines.append(line);line=''
  line+=(' 'if line else'')+value
 if line:lines.append(line)
 return '\n'.join(lines)
lookup='## 3. LAYOUT / NATIVE ID LOOKUP\n\n'+(root/'prompts/ATLAS_GEMINI_MIN.txt').read_text()+'\nTower/AU scope aliases→atlasAnchor (native supported aliases):\n'+wrap(json.loads((root/'assets/vocabulary.json').read_text())['scopes'])+'\n\nGEOMETRY→layoutType\nhorizontal vertical windows ell tee cross court cloister curved tower\n\nLAYOUT→places[].type (49; default furniture automatic)\n'+wrap(r)+'\n\nOptional whole interiors→props[].item. Prefix cluster.layout- + listed suffix gives native ID; no alias layer. Do not duplicate default inventory. Missing suitable layout→build required objects. No tabletop-component lookup.\n'
lookup+=wrap(k.removeprefix('cluster.layout-')for k in c if k.startswith('cluster.layout-')and not re.search(r'_(notes|cards|writing|scroll|flowers|painting)$',k))+'\n'
example={'schemaVersion':'2.0.0','meta':{'date':'','time':'','areaName':'','quote':''},'atlasAnchor':'','pcPlace':'','pcSpot':'','places':[],'actors':[{'name':'','isPC':True,'spot':''}],'events':[]}
html=loader(base,json.dumps(example,ensure_ascii=False,indent=2))
out='\n\n'.join([(root/'prompts/MAP_RULES.txt').read_text(),lookup,'## 4. HTML OUTPUT\nFill map-data and required values from current RP. Keep the standard loader and release URLs unchanged; escape < inside JSON strings as \\u003c. No unresolved placeholders in emitted HTML.\n```html\n'+html+'\n```\n'])
(root/'prompts/MAP_PROMPT.txt').write_text(out);print('MAP prompt',len(out.encode()),'bytes;',len(out),'characters; 49 layouts; standard loader.')
