"""One pipeline from canonical source JSON, never a deleted editor."""
from pathlib import Path
import subprocess,sys,json,hashlib
root=Path(__file__).resolve().parents[1]
for name in ['atlas.py','check-approved-svg.py','build.py','check-furniture-locks.py','asset-review.py','check-id-links.py']:
 subprocess.run([sys.executable,str(root/'tools'/name)],cwd=root,check=True)
 if name=='build.py':
  manifest=root/'assets/runtime-release.json';release=json.loads(manifest.read_text())
  for filename in release['files']:
   content=(root/'dist'/filename).read_bytes()
   release['files'][filename]={'bytes':len(content),'sha256':hashlib.sha256(content).hexdigest()}
  manifest.write_text(json.dumps(release,ensure_ascii=False,indent=2)+'\n')
subprocess.run(['node','tests/canonical-sources.cjs'],cwd=root,check=True)
