# WIZAMAP 2

One renderer for Gemini RP `/MAP`: Gemini outputs MAP_DATA 2.0.0; the browser renders it from this repository. Work on `DEMO-01`; `main` is not the active release branch.

## Find what you need
| Location | Purpose |
|---|---|
| `PROJECT_INSTRUCTION.md` | Current architecture, rules, release policy |
| `prompts/MAP_PROMPT_OUTLINE.md` | Single reusable story-neutral /MAP prompt |
| `assets/` | Atlas, 49 recipes/147 sizes, SVG catalog, corridors, release manifest |
| `src/` | MAP_DATA normalization, location resolving, room construction and UI |
| `examples/WIZAMAP_FIXED_UI.html` | Canonical immutable 13 Fixed maps and UI source |
| `examples/WIZAMAP_LAYOUTS.html` | Layout/S/M/L preview |
| `examples/WIZAMAP_ASSETS.html` | Offline assets review/editor |
| `dist/` | Three generated files served by jsDelivr; **do not delete** |
| `docs/ATLAS_COVERAGE_CURRENT.md` | Current Atlas coverage/known limitations |
| `tests/`, `tools/` | Regression tests and maintenance commands |

## Build and test
Requires Python 3, Node.js, Chromium and Playwright (the GitHub Actions workflow installs these).
```sh
python tools/rebuild.py
node tests/canonical-sources.cjs
python tools/test_all.py
python tools/verify-release.py
```
`rebuild.py` regenerates distribution files deterministically from canonical sources. Tests use `work/` for temporary output; Git ignores it. Fixed art and native asset IDs are not to be regenerated from story prompts.

## Publish
1. Commit canonical source changes on `DEMO-01`; CI rebuilds, tests and commits changed generated files to `dist/` as a separate `[skip ci]` build commit.
2. Use the **published build commit SHA** that contains all three `dist/` files. Update `assets/runtime-release.json` `runtimeCommit` and the three jsDelivr URLs in the one common prompt; update the layout viewer fallback pin when needed.
3. Run `python tools/verify-release.py`; it compares current dist bytes and hashes with the files stored at the pinned commit, not just the string in the manifest. Confirm jsDelivr and AI Studio Preview before claiming production parity.
4. Never pin a source commit before the distribution has been published. If the post-publish pin check fails, the build artifact may be usable, but the current story prompt is not the new release yet.

Historical plans, earlier test reports and version snapshots remain recoverable in Git history, not mixed into the active project tree. See `PROJECT_INSTRUCTION.md` for non-negotiable map rules and attribution requirements.
