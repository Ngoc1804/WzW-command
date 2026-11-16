# MAP 2 — ACTIVE PROJECT CONTRACT

## Ownership
`Gemini RP → MAP_DATA 2.0.0 → GitHub renderer → Browser Preview`.
Gemini supplies current RP facts, locations, actors, events and **Vietnamese display text**. Existing room IDs remain native English/W4/Atlas keys. GitHub renders accepted data only; it does not create RP actions, actors, quests, routes or translations. The map overview does not transfer knowledge to PC memory.

## Canonical sources
- `examples/WIZAMAP_FIXED_UI.html`: approved Fixed/UI source; 13 Fixed artworks and their furniture/geometry are immutable.
- `assets/atlas.json`: 59 scopes, 285 Hogwarts/AU rooms, 105 World room/site records, 53 World sites; Atlas enriches only rooms actually requested in MAP_DATA.
- `assets/recipes.json` + `assets/layout-sizes.json`: 49 approved recipe families × S/M/L; matching approved art wins over procedural defaults.
- `assets/room-formulas.json`: fallback for rooms without approved art. `assets/catalog.json`: native SVG/asset IDs; `assets/source/corridors.js`: 10 corridor geometries.
- `src/{contract,props,resolver,draw,build,index}.js`: renderer source. `tools/rebuild.py` generates `dist/{shell.css,templates-pack.js,bundle.js}`.
- `docs/ATLAS_COVERAGE_CURRENT.md`: current coverage and illustrative-vs-source limitations. Historical design snapshots remain in Git history, never an executable source.
- `assets/FINAL_NOTICES.txt`: required third-party attribution; preserve.

## Runtime behavior
Render the most specific existing Fixed map; otherwise use a requested Atlas/World/Custom scene. Existing IDs win over translated names; `places[].name` is Vietnamese presentation only. Preserve Fixed geometry, anchors, furniture and 6-step footprints. An outdoor NPC whose resolved point anchors inside a building uses `footstep:hidden`; do not generalize this rule to every outdoor NPC. Event rows take precedence over actor rows at the same place. Do not fabricate empty rooms or unverified aliases.

## Story prompts
`prompts/MAP_PROMPT_OUTLINE.md` is the **only canonical shared /MAP prompt**. Fill only `QUEST_DISTRIBUTION`, `MAP_QUEST_LIMIT`, `SPECIAL_ROOMS`, `ICON_MAPPING` for a specific RP; return the filled prompt in chat. Never commit story/campaign data or additional prompt variants here.

## Maintenance / release
`python tools/rebuild.py` → `node tests/canonical-sources.cjs` → `python tools/test_all.py`. Source edits require reproducible dist, all regressions passing and verified published release SHA. `python tools/verify-release.py` verifies the pinned jsDelivr commit actually contains the current dist, not just a matching manifest label. After CI publishes changed dist, pin the resulting build commit in `assets/runtime-release.json` and the three loader URLs, then verify again; never pin unpublished content. Keep `main` unchanged. Maintain `DEMO-01` and do not delete or modify old Git history.
