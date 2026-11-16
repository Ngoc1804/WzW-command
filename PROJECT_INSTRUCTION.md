# MAP 2 — ACTIVE CONTRACT (GEMINI-AUTHORITATIVE)

## Ownership and delivery

`Gemini (W4 + R14.6) → MAP_DATA v2.0.0 → GitHub (Fixed / Atlas / approved SVG + 49 S/M/L recipes) → HTML Preview`.

- **Gemini is authoritative** for map owner/template, current places, English/native room IDs, PC/NPC positions, events, activities and RP furniture changes. All player-visible text is Vietnamese. W4 supplies location IDs/ownership; R14.6 tells Gemini how to produce MAP_DATA. GitHub MUST NOT apply an Information Gate, knowledge filter, story veto, or invent new RP content.
- **GitHub** renders MAP_DATA as provided: Generated maps construct only `places[]`; Fixed uses its approved artwork. Native IDs win over Vietnamese labels; an explicit W4 ID absent from Atlas remains unchanged and uses supplied type/recipe. Atlas fills absent architecture and furniture defaults only; explicit MAP_DATA/RP overrides win. Renderer validates technical structure but NEVER applies PC awareness or story-content censorship. Event rows take priority over NPC rows at the same resolved location in HÓNG HỚT; both map markers remain.
- **Atlas Master**: `docs/WZW_MAP2_ATLAS_GITHUB_MASTER.md` is the immutable design source (locations, geometry, room functions, furnishing notes). Its historical runtime/Gate instructions are NOT active rules. `assets/atlas.json` is the executable catalogue, synchronized by verified ID and design notes, not loaded by parsing Markdown.
- **Active Atlas**: `assets/atlas.json` stores 285 Hogwarts/AU rooms, 105 World room/site records and 53 World sites. Master design notes are attached to all 285 rooms and all 67 World site components. Seven differences from historical Master recipe suggestions are resolved in favor of approved runtime `type`/`interiorPlan.recipe` and locked in Atlas; historical suggestions remain non-executable provenance. See `docs/ATLAS_COVERAGE_CURRENT.md`. `assets/room-formulas.json` holds 49 approved functional fallbacks.
- **Visuals**: `examples/WIZAMAP_FIXED_UI.html` is the canonical Fixed/UI source, `assets/recipes.json` and `assets/layout-sizes.json` are the approved 49 S/M/L interior design sources, `assets/catalog.json` contains native SVG and `assets/source/corridors.js` contains corridor geometry. 13 Fixed artworks and their furniture remain immutable.
- **Runtime**: `src/contract.js`, `src/resolver.js`, `src/props.js`, `src/draw.js`, `src/build.js`, `src/index.js`, and the pinned `assets/runtime-release.json`. The HTML loader imports `dist/shell.css`, `dist/templates-pack.js`, and `dist/bundle.js`.

## Interior build order

1. **Locked shell, furniture-only variation**: preserve existing floor/wall/door SVG, room dimensions and layer ordering. Keep authored furniture as the approved variant; functional rooms may use the ID-seeded group variants in `recipes.json`/`room-formulas.json`. Special rooms retain approved furniture/colors by default. Explicit MAP_DATA furniture/props overrides win. Never rotate/shear native artwork or change shell construction. Hogwarts corridor-only paint/texture follows paired levels in `assets/styles.json`; finishing never changes geometry/layer order. See `docs/FURNITURE_VARIANTS.md`.
2. **Fallback formula second**: when no approved room artwork exists, use function-based assets, walls, floor, size and furniture zones from `room-formulas.json`. Place clusters by real function, keep door openings/travel lanes clear, avoid overlap. These are illustrative baselines, not canon-guaranteed décor.
3. **Safe object fallback last**: use named native assets or validated vector shapes for missing objects. No synthetic magical effects or narrative event simulation.

## Prompt ownership and loader

W4 and R14.6 live in Gemini and are the **only active RP/map prompts**. Do not store or regenerate story-specific prompts or another MAP prompt in this repository. `tools/loader.py` is the canonical HTML loader builder; provide it the pinned release base from `assets/runtime-release.json`. Only the JSON in `script#map-data` changes per RP snapshot. GitHub does not select quests or story settings.

## Build and test

`python tools/rebuild.py` verifies atlas and existing art, builds runtime distribution and runs ID checks. The build does **not** generate story prompts. `node tests/canonical-sources.cjs`, `python tools/test_all.py` and `tests/loader.cjs` check structure, browser and loader from `tools/loader.py` + runtime manifest (no prompt file dependency). GitHub Actions publishes only distribution assets, release manifest and build metrics. Update the common loader's SHA only AFTER the new distribution is published and verified.

Do not change `main`. Never erase `assets/FINAL_NOTICES.txt`.
