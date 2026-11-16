# MAP 2 — Atlas Master synchronization (DEMO-01)

**Executable source:** `assets/atlas.json`; **immutable design source:** `docs/WZW_MAP2_ATLAS_GITHUB_MASTER.md`. Master is not parsed at runtime; its historical Information Gate and auto-cluster-room rules are **not active**.

## Exact coverage

| Data | Count / status |
|---|---:|
| Fixed artwork / native anchors | 13 / 348 — unchanged |
| Generated Hogwarts/AU scopes/rooms | 56 / 285; native IDs and names preserved |
| World macro scopes / sites / room-or-scene entries | 3 / 53 / 105 |
| All Generated + World records | 390 |
| Master room IDs matched to runtime | 285/285 |
| Room descriptions previously identical to Master | 203 |
| Additional room descriptions compacted from Master in this synchronization | 82 |
| Master design notes attached to Hogwarts/AU rooms | 285/285 |
| World site components mapped to Master | 67/67 (53 sites) |
| Approved layout/recipe families and sizes | 49 × 3 = 147 |
| Legacy Master recipe differences resolved in favor of running recipes | 7/7 |

### Recipe decisions (runtime recipes approved; Master retained as historical provenance)

| Room ID | Original Master recipe | **Locked runtime recipe** |
|---|---|---|
| `DUNGEONS-N:05` | `BATHROOM` | `UTILITY_ROOM` |
| `KITCHENS-N:04` | `BATHROOM` | `KITCHEN` |
| `F1-N:05` | `TOWER_CLOCKWORK` | `STORAGE` |
| `F6-N:02` | `PREFECTS_BATHROOM` | `PASSAGE_PROPS` |
| `F6-S:04` | `TOWER_CLOCKWORK` | `STORAGE` |
| `F7-N:03` | `TOWER_CLOCKWORK` | `STORAGE` |
| `F8-N:01` | `HEADMASTER_OFFICE` | `PASSAGE_PROPS` |

**Approved:** the seven listed rooms use only `type` and `interiorPlan.recipe` from the running renderer. `interiorPlan.recipeDecision:runtime-approved` locks the decision. `masterRecipe` remains as historical, non-executable provenance from the immutable Master; `masterRecipeConflict` is removed. A corridor remains `PASSAGE_PROPS`, a gear store remains `STORAGE`. No pending recipe decision.

## World/AU and illustration integrity

Every one of 67 World site components has an exact Master design note under `components[].masterDesign`; 53 sites are preserved. The 105 World records retain their canonical IDs and illustrative/conditional markers. **Site-level scene entries are illustrative, not confirmation of canonical interior rooms**. The 285 Hogwarts/AU rooms inherit exact Master design notes; 82 existing shorter/recipe-derived descriptions were replaced with the concise first descriptive sentence of the matching Master room row. No speculative rooms, actors or quests were created.

Runtime layout priority remains **approved SVG S/M/L → functional recipe/formula → safe native fallback**. Atlas defaults never add a room absent from `MAP_DATA.places[]`, nor override explicit Gemini room content. Fixed SVGs and their furniture are not regenerated. User-visible text remains Gemini's Vietnamese responsibility.

## Validation scope

`tools/atlas.py`, `tools/check-id-links.py`, `tests/canonical-sources.cjs` and browser regressions check IDs, recipes, layouts and loader. GitHub Actions success alone is **not** approval of every illustrated interior or a Google AI Studio live Preview. Previous generated verification JSON was removed; obtain fresh evidence from the latest CI run.
