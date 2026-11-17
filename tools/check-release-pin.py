"""Fail when the Gemini-pinned commit serves bytes different from the current checked distribution."""
from pathlib import Path
import hashlib, json, re, subprocess

root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'assets/runtime-release.json').read_text())
pin=manifest['runtimeCommit']
if not re.fullmatch(r'[a-f0-9]{40}',pin):
    raise SystemExit('Release pin is not a 40-character commit SHA')
def git(*args,check=True):
    return subprocess.run(['git',*args],cwd=root,capture_output=True,check=check)
if git('cat-file','-e',pin+'^{commit}',check=False).returncode:
    git('fetch','--no-tags','--depth=1','origin',pin)
for name,expected in manifest['files'].items():
    if name not in {'bundle.js','templates-pack.js','shell.css'}:
        raise SystemExit('Unknown release file: '+name)
    local=(root/'dist'/name).read_bytes()
    remote=git('show',pin+':dist/'+name).stdout
    for source,data in [('local',local),('pinned',remote)]:
        if len(data)!=expected['bytes'] or hashlib.sha256(data).hexdigest()!=expected['sha256']:
            raise SystemExit(f'{source} dist/{name} does not match runtime-release.json')
print('PASS release pin:',pin,'(3 local + 3 pinned dist hashes)')
