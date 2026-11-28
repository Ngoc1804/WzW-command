# MAP 2 release readiness

## Current repair

All Fixed and Generated maps share the DEMO-1 V12 footstep cycle. Six alternating marks appear for 550 ms each along the lower ribbon edge, followed by 2000 ms fully hidden. Reduced motion uses a static pair.

Map ribbons summarize groups. Inspector expands up to six members, preserving supplied individual identities and tag colors when available. Larger groups retain a group chip.

Approved S/M/L interiors retain their furniture and color by default. Explicit variants, seeds, presets, materials and RP object operations remain supported. Automatic tabletop substitutions are removed. Oversized authored tabletop clusters fit uniformly inside their supporting surfaces. LIBRARY S/M/L uses its approved furniture; an F5-N cloister scene still follows its supplied six-room membership and corridor layout.

## Canonical files

- Fixed artwork, shared presentation and footsteps live in examples/WIZAMAP_FIXED_UI.html.
- Interior sources live in assets/layout-sizes.json, assets/recipes.json and assets/catalog.json.
- tools/rebuild.py generates dist and the asset viewer.
- tools/loader.py uses assets/runtime-release.json for delivery.
- Four focused example viewers remain. The unreferenced furniture-preview.png snapshot and unused Inspector/placement code were removed.

## Verified release

GitHub Actions run [44825123793](https://github.com/Ngoc1804/WzW-command/actions/runs/44825123793) passes 43/43 suites on source commit afbef15bdd8d0fe0239cdc7c21301fe5b4623870.

Coverage includes all 13 Fixed owners, 147 S/M/L views, 263 Fixed IDs and 263 local-anchor cases, 10601 animation times, desktop/mobile presentation and Inspector, group sizes 2/4/6/7, authored interior defaults, support fitting, props overrides, clipboard fallback and loader checks. Desktop/mobile Inspector and presentation screenshots are retained in the run artifact and were reviewed.

Verified distribution commit e060cbb27862f9d175e6cea774935344c31d8b20. assets/runtime-release.json pins this exact build. The subsequent documentation/pin commit carries identical distribution bytes. All three jsDelivr files are checked against their manifest sizes and SHA-256 hashes before handoff. Existing SHA-pinned Gemini snippets use this distribution commit for shell.css, templates-pack.js and bundle.js.
