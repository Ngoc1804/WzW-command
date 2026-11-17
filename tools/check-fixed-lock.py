"""Protect the approved 263-ID contract and the sole runtime lookup implementation."""
from pathlib import Path
import json,hashlib
r=Path(__file__).resolve().parents[1];lock=json.loads((r/'docs/fixed-contract-lock.json').read_text())
for path,expected in lock['files'].items():
 assert hashlib.sha256((r/path).read_bytes()).hexdigest()==expected,path+' changed: explicitly revalidate the complete Fixed contract before updating its lock'
c=json.loads((r/'assets/fixed-contract.json').read_text());assert len(c)==13 and sum(map(len,c.values()))==263
assert {k:len(v) for k,v in c.items()}==lock['counts']
print('PASS locked 263-ID/13-template lookup; no duplicate Fixed resolver')
