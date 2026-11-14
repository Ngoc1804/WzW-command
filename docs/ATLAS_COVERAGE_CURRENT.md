# WZW MAP 2 — ATLAS COVERAGE & INTERIOR BASELINE

> Applies to current `DEMO-01` source. The recovered `WZW_MAP2_ATLAS_GITHUB_MASTER.md` is a historical specification, not proof of canonical completeness. Current Atlas is illustrated RP architecture, not an exhaustive canon floor plan.

## Exact data counts

| Category | Records |
|---|---:|
| Fixed artwork (immutable) | 13 |
| Native Fixed anchors | 348 |
| Hogwarts & AU clusters (including World macro scopes) | 59 |
| Hogwarts/AU room records | 285 |
| World sites | 53 |
| Previously defined World rooms | 64 |
| Site-level World illustration records newly added | 41 |
| Current World room/site records | 105 |
| Generated/non-Fixed room+site records | 390 |
| Approved functional recipe/layout families | 49 |
| Approved size variants | 147 |
| Rooms with direct description from recovered historical Master | 203 |
| Rooms whose static descriptions are inferred from named function/recipe (NOT canon) | 187 |

## What changed

All 390 non-Fixed room/site records have `type`, short `description`, `size:S|M|L`, `architecture:{floor,wall}`, and `interiorPlan` with verified native recipe and a sample of matching native asset IDs. Most existing Hogwarts room IDs are untouched; 41 locations which previously had no rooms now expose one **site-level map illustration** with ID ending `:site`. That is a marker/scene surface, NOT a claim that a canon-confirmed room/floor exists within the building. Existing 64 World rooms remain intact.

49 basic function-based fallback formulas in `assets/room-formulas.json` specify materials, room size profiles, prop families and furniture zones. When a matching approved SVG layout S/M/L exists, **the approved layout wins**; generated formulas are not permitted to replace it. New Custom spaces without approved artwork can reuse these compact formulas, native SVG assets, clear doorway padding and basic non-overlap placement.

## Known limitations

1. This is NOT the full Harry Potter universe or a definitive architectural canon map. Geography, room/floor counts and interiors for many story locations remain unspecified.
2. Site-level World illustrations do not reconstruct an entire Manor, hotel, village, Quidditch stadium or hospital on their own.
3. 187 descriptions are functional/illustrative, not independently verified passages from books or film.
4. 13 Fixed artwork components and their internal furnishings are preserved, not regenerated from per-room formulas.
5. Visual equivalence between procedural new rooms and approved HTML/SVG layouts is NOT certified. Formula output needs direct viewport comparison for the relevant new rooms, including S/M/L and mixed hallway cases.
6. GitHub stores no campaign/story settings. Live activities, overhear summaries, actor tags, dialogue and quests come only from Gemini MAP_DATA.

## Validation

`tools/atlas.py` verifies all room IDs and formulas, `tests/canonical-sources.cjs` verifies counts, and `tools/check-id-links.py` verifies recipe/native asset IDs. Browser regression and a Google AI Studio Preview test are separate requirements; an automated build pass alone is not a visual acceptance of every site.
