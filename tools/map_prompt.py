"""Generate the supplied story prompt with one shared explicit-document loader."""
from pathlib import Path
import json,re,sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
from loader import loader
r=Path(__file__).resolve().parents[1];release=json.loads((r/'assets/runtime-release.json').read_text());sha=release['runtimeCommit'];assert re.fullmatch('[0-9a-f]{40}',sha)
base='https://cdn.jsdelivr.net/gh/'+release['repository']+'@'+sha+'/dist/'
data={'schemaVersion':'2.0.0','meta':{'date':'','time':'','areaName':'','quote':''},'atlasAnchor':'','pcPlace':'','pcSpot':'','places':[],'actors':[{'name':'','isPC':True,'spot':''}],'events':[]}
s=(r/'prompts/MAP_RULES.txt').read_text();assert s.count('{{MAP_HTML}}')==1
out=s.replace('{{MAP_HTML}}','```html\n'+loader(base,json.dumps(data,ensure_ascii=False,indent=2))+'\n```')
(r/'prompts/MAP_PROMPT.txt').write_text(out)
print('Generated explicit head/body HTML prompt:',len(out.encode()),'bytes')
