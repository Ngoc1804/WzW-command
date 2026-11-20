# DEMO-01 release readiness

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

## Validation

Local rebuild, footstep timing and lifecycle, authored interior defaults, tabletop fit, 147 approved SVG views, 263 Fixed IDs and their 263 local-anchor cases pass. Browser validation runs through the GitHub Actions canonical build workflow. Current local Chromium cannot start because its process socket is blocked.

The source commit retains the prior verified distribution pin. After CI builds and publishes the repaired distribution, pin the manifest to that exact commit and verify all three jsDelivr files before updating Gemini's loader URLs. Record the final run and distribution commit here once verified.
