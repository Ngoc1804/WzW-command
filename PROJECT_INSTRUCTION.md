# MAP 2 — PROJECT INSTRUCTIONS (STORY-NEUTRAL)

## Ownership and delivery

`Gemini RP → MAP_DATA v2.0.0 → 13 Fixed / Atlas JSON / 49 approved layouts S/M/L / formula fallback → Browser Preview`.

- **Gemini** chooses PC/NPC/quest/story facts, current date and locations, and supplies Vietnamese display strings. Technical Atlas IDs remain in English/native form. Map-wide activity overviews are permitted without applying a Player Information Gate; they do not transfer knowledge to narrative PC/NPC memory and must not reveal a quest solution.
- **GitHub** renders accepted data, resolves native room IDs, controls wall/floor, 10 corridor geometry forms, 49 approved layout families, native assets, markers, zoom and the Inspector. GitHub does not generate RP facts or quests.
- **Atlas Master**: `docs/WZW_MAP2_ATLAS_GITHUB_MASTER.md` is the intact recovered historical design specification; it is reference material, not an automatically parsed executable source.
- **Active canonical source**: `assets/atlas.json` stores 285 Hogwarts/AU rooms, 105 World room/site records and 53 World sites, each room with descriptive/furnishing metadata. `assets/room-formulas.json` provides 49 functional fallback patterns. `docs/ATLAS_COVERAGE_CURRENT.md` discloses illustrated vs canon-confirmed details.
- **Visuals**: `examples/WIZAMAP_FIXED_UI.html` is the canonical Fixed/UI source, `assets/recipes.json` and `assets/layout-sizes.json` are the approved 49 S/M/L interior design sources, `assets/catalog.json` contains native SVG and `assets/source/corridors.js` contains corridor geometry. 13 Fixed artworks and their furniture remain immutable.
- **Runtime**: `src/contract.js`, `src/resolver.js`, `src/props.js`, `src/draw.js`, `src/build.js`, `src/index.js`, and the pinned `assets/runtime-release.json`. The HTML loader imports `dist/shell.css`, `dist/templates-pack.js`, and `dist/bundle.js`.

## Interior build order

1. **Approved layout first**: preserve all existing SVG, authored furniture positions, size and decor when the matching recipe and S/M/L reference art is available. Never replace reviewed artistry with an auto-grid.
2. **Fallback formula second**: when no approved room artwork exists, use function-based assets, walls, floor, size and furniture zones from `room-formulas.json`. Place clusters by real function, keep door openings/travel lanes clear, avoid overlap. These are illustrative baselines, not canon-guaranteed décor.
3. **Safe object fallback last**: use named native assets or validated vector shapes for missing objects. No synthetic magical effects or narrative event simulation.

## Only reusable prompt in repository

`prompts/MAP_PROMPT_OUTLINE.md` is the ONE English-language common prompt. It contains the template, layout and scope lists, NPC tag types, DATA contract, all map rules and three jsDelivr runtime links.

For each story, fill **only** `QUEST_DISTRIBUTION`, `MAP_QUEST_LIMIT`, `SPECIAL_ROOMS`, `ICON_MAPPING`. Deliver the resulting `MAP_PROMPT_[STORY].md` to the user **inside the ChatGPT conversation**. Do not commit story-specific prompt data or generated story Markdown to GitHub. No Atlas Mini / standalone MAP_RULES / MAP_PROMPT on GitHub.

## Build and test

`python tools/rebuild.py` verifies atlas and existing art, builds runtime distribution and runs ID checks. The build does **not** generate story prompts. `node tests/canonical-sources.cjs`, `python tools/test_all.py` and `tests/loader.cjs` check structural, browser and loader behavior. GitHub Actions publishes only distribution assets, release manifest and build metrics. Update the common loader's SHA only AFTER the new distribution is published and verified.

Do not change `main`. Never erase `assets/FINAL_NOTICES.txt`.
