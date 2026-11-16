"""Fail if the /MAP loader pins a commit whose dist differs from the active release."""
from pathlib import Path
import hashlib, json, re, subprocess, sys

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'assets/runtime-release.json').read_text())
sha = manifest['runtimeCommit']
if not re.fullmatch(r'[a-f0-9]{40}', sha):
    raise SystemExit('Invalid pinned release commit SHA')
prompt = (ROOT / 'prompts/MAP_PROMPT_OUTLINE.md').read_text()
links = re.findall(r'https://cdn\.jsdelivr\.net/gh/Ngoc1804/wzw-hogwarts-map-2@([a-f0-9]{40})/dist/(shell\.css|templates-pack\.js|bundle\.js)', prompt)
if len(links) != 3 or {name for _, name in links} != set(manifest['files']) or {pin for pin, _ in links} != {sha}:
    raise SystemExit('Prompt loader URLs disagree with runtime-release.json')
for name, meta in manifest['files'].items():
    local = (ROOT / 'dist' / name).read_bytes()
    try:
        published = subprocess.check_output(['git', 'show', f'{sha}:dist/{name}'], cwd=ROOT, stderr=subprocess.PIPE)
    except subprocess.CalledProcessError:
        raise SystemExit(f'Pinned commit {sha[:12]} is unavailable: fetch full Git history')
    digest = hashlib.sha256(local).hexdigest()
    if local != published or len(local) != meta['bytes'] or digest != meta['sha256']:
        raise SystemExit(f'UNPUBLISHED DIST: {name} differs from pinned {sha[:12]}; publish build first, then update release SHA and loader URLs')
print(f'PASS pinned dist SHA {sha} (3 files, exact Git object bytes and manifest hashes)')
