"""Canonical runtime Atlas: validate JSON directly; never parse historical Markdown."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1];a=json.loads((root/'assets/atlas.json').read_text())
assert len(a['fixed'])==13 and sum(len(x['places']) for x in a['fixed'].values())==348
assert len(a['clusters'])==59
rooms=[p for c in a['clusters'].values() for p in c['rooms']]
assert len(rooms)==285 and len({p['id'] for p in rooms})==285
valid=set(a['fixed'])|set(a['clusters']);assert all(p in valid for c in a['clusters'].values() for p in c.get('pointers',[]))
recipes=json.loads((root/'assets/recipes.json').read_text());assert all(not p.get('type') or p['type'] in recipes for p in rooms)
world=[p for c in a['clusters'].values() for site in c.get('sites',[]) for p in site['rooms']]
assert len(world)==105 and len({p['id'] for p in rooms+world})==390
assert all(p.get('description') and p.get('interiorPlan',{}).get('recipe') and p.get('architecture') for p in rooms+world)
formulas=json.loads((root/'assets/room-formulas.json').read_text())
assert set(formulas['recipes'])==set(recipes)
assert all(p['interiorPlan']['recipe'] in formulas['recipes'] for p in rooms+world)
print('PASS Atlas: 13 Fixed/348 anchors; 59 scopes, 285 Hogwarts/AU rooms, 105 World scenes/rooms, 49 formula references')
