# Furniture variation — existing IDs and locked shell

All 49 W4 pool IDs remain unchanged. No room is created from a recipe/preset.
`src/build.js`, corridor construction, source floor/wall/door SVG, native source object SVG/bounds, layer order, Fixed/UI, shell CSS and template pack are locked by `tools/check-furniture-locks.py`.

## Data and runtime

- `recipes.json`: 31 functional families have optional stable furniture variants. Authored arrangements and colors are the default. Special rooms, passage decor and Outdoor retain approved default furniture. Tabletop details retain their authored identity unless MAP_DATA explicitly changes them.
- `room-formulas.json`: 16 explicit furniture presets reuse existing furniture scenes, keeping the target room's shell. Ten presets add function-specific items (including two new tabletop SVG assets). These are reusable furniture compositions, not new canonical architecture.
- `layout-sizes.json`: existing 147 S/M/L views are unchanged except furniture grouping/role metadata. Tables, associated seats and tabletop details move as one group. Oversized tabletop clusters are uniformly fitted inside their actual support surface at runtime; native SVG and stored views remain intact.
- `styles.json`: six muted material palettes apply only to marked furniture channels. Isolated furniture definitions prevent color changes from affecting shared floor/wall definitions. Untagged paint remains original.
- `catalog.json`: 146 used assets receive conservative placement metadata. Their geometry is not rewritten or declared collision-ready. Two new tabletop SVG assets provide physical dice and miniatures for the Whitecap game preset.
- `src/furnishing.js`: explicit seed selection, group placement against the existing floor, door clearance, original-layout fallback, furniture-only painting and support bounds.
- `src/props.js`, `src/draw.js`: apply the selected inventory, preserve RP removal/replacement/count overrides, and render resulting footprints in the existing furniture layer. Actors continue using the existing footprint consumer.

## Optional MAP_DATA fields

Existing `type`, `size`, `props`, `propsMode` remain valid. Furniture controls are optional:

```json
{"id":"room-7","name":"Phòng tự học","type":"STUDY_ROOM","size":"M",
 "furniture":{"variant":"perimeter","style":"sage","seed":0,"details":"approved"}}
```

Omitted furniture controls preserve the authored layout/colors. `furniture.variant:"approved"` and `furniture.style:"approved"` also select them explicitly. A supplied seed enables deterministic arrangement selection. Explicit `furniture.materials` accepts six-digit hex colors by material. The seed uses stable place ID, not display name or actor order. `furniture.preset` is explicit; aliases never select a preset implicitly on rename.

Props can specify an existing `supportId` to place an object on its support. A missing/full support keeps the item in Inspector with diagnostics, rather than drawing it on the floor. Explicit `propsMode:"replace"` still clears recipe/preset furniture. Item replacement by exact instance ID wins over defaults.

Special room defaults keep original furniture/colors. Presets: myrtle-bathroom, snape-office, lockhart-office, transfiguration, charms, restricted-library, elf-kitchen, deathday, liad-attic, ccc-mail, whitecap-games, sunroom, requirement-practice, requirement-meeting, requirement-refuge, requirement-storage. Presets fit within the existing target shell; additional objects may remain detail-only when no legal space exists. They do not assert film/book accuracy or create new locations.

## Checks

See `docs/RELEASE_READINESS.md` for the current validation and release state. `tests/furniture-data.cjs`, `tests/furniture-geometry.cjs` and `tests/furniture-variants.cjs` cover source integrity, geometry and browser runtime respectively.

`examples/WIZAMAP_FURNITURE.html` offers type, size, variant, tone, preset and seed controls against the built runtime. It loads local `dist` files; use a local HTTP server or the repository preview delivery mechanism.
