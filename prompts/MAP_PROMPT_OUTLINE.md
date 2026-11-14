### R14.6 — /MAP · WIZAMAP 2 (REUSABLE STORY-NEUTRAL OUTLINE)

> **This is the only canonical Gemini /MAP prompt stored in GitHub.** The repository contains NO filled story settings, narrative pack, campaign-specific prompt, Monthly Pack, or story-derived quest details. To prepare a story prompt, fill ONLY the four Story Settings below, preserve all shared rules and the loader, then deliver a separate Markdown file in chat. Do not commit filled story prompts.

## 1. STORY SETTINGS — FILL ONCE PER STORY (ONLY FOUR FIELDS)

```text
QUEST_DISTRIBUTION = {{QUEST_DISTRIBUTION}}
MAP_QUEST_LIMIT = {{MAP_QUEST_LIMIT}}
SPECIAL_ROOMS = {{SPECIAL_ROOMS}}
ICON_MAPPING = {{ICON_MAPPING}}
```

- `QUEST_DISTRIBUTION`: relative allocation among story quest/activity classes (e.g. MAIN, SIDE, POOL, HIDDEN), priority and eligibility. A maximum is not a quota; do not invent opportunities to fill slots.
- `MAP_QUEST_LIMIT`: maximum simultaneous event markers on one map, including any hidden discoveries. If fewer valid opportunities exist, show fewer.
- `SPECIAL_ROOMS`: only verified story-specific or newly introduced places requiring extra attention, their owner/relationships and furnishing exceptions; `none` if none. Use real Atlas IDs when present and RP-defined names for genuinely new rooms.
- `ICON_MAPPING`: classify event kinds into **BINOCULARS** (`events[].hidden:false`, visible activity/quest) or **MAGNIFIER** (`events[].hidden:true`, discoverable clue/location). The flag chooses visual icon, not knowledge filtering. Do not send icon or class metadata fields in MAP_DATA.

The current RP already supplies date/time, NPCs, House, monthly packs and narrative; do not hardcode a particular protagonist, year, monthly pack, quest count, PC identity, House, or named antagonist into this outline. No other prompts or runtime rules change between stories.

## 2. AUTHORITY & GENERAL EXECUTION

`/MAP` is a **read-only** illustrated snapshot of the current accepted RP. Gemini generates MAP_DATA from the existing RP world state; GitHub renders geometry, known layouts, SVG assets, markers and UI. Calling /MAP must NEVER advance the clock, move an actor, invent a player decision, accept or complete a quest, assign reward, or simulate new activity.

Map owner always follows the PC's actual current position, not an event/NPC elsewhere. Determine a valid location from the accepted RP and Atlas without inventing travel. Use the 13 approved Fixed maps, verified Atlas cluster/World site or a named Custom space. Do not use an `unknown` location, fabricated canon room identifier, unverified entrance, or arbitrary coordinates.

**Map-wide overview:** do not apply an Information Gate, perception/access gate, or knowledge filter to nearby NPC activity, room state, or event marker summaries inside the current map. Display actual supported activity even if the PC is not looking at or hearing it. This visualization never grants those facts to PC/NPC memories in the roleplay. Do not reveal a complete quest solution, hidden trigger, secret outcome or entire plot twist. Do not invent NPC, conversation, activity, rooms or quest content merely to fill the UI.

Technical field names, IDs and instruction language are English. **All player-visible names and prose must be Vietnamese**, including room names. Gemini translates English/native Atlas room names; GitHub is NOT a translation service. Existing room: `places[].id` is the exact native English/technical Atlas ID and `places[].name` is the Vietnamese display text. PC/NPC/event `placeId` references the same native ID; `placeName` is for genuine new RP places only. Never create another room because the English and Vietnamese names differ.

`meta.areaName` is `Major Vietnamese area · Vietnamese subarea`. The Inspector heading VỊ TRÍ shows the major area and its next line shows `· subarea`. The Header shows small WIZAMAP on the left, quote in the middle, date and time on the right. It must never display debug metadata or technical IDs.

## 3. LOCATION ROUTING — ONE MAP OWNER

**Approved FIXED maps (artwork and interiors are immutable; only markers and text may change):**

`h1` · `h2` · `hall` · `gryffindor-common` · `ravenclaw-common` · `hufflepuff-common` · `slytherin-common` · `village-static` · `pitch-static` · `express` · `diagon-knockturn` · `ministry2` · `ministry-8-10`

- `h1`: Hogwarts outer grounds, lake, forest, Hagrid hut, greenhouses, and nearby exterior.
- `h2`: Hogwarts castle external blocks, courtyards, gates, bridges, Owlery.
- `hall`: Great Hall/Entrance Hall and its existing selected rooms.
- `gryffindor-common`, `ravenclaw-common`, `hufflepuff-common`, `slytherin-common`: corresponding common rooms and included dormitory artwork.
- `village-static`: inside Hogsmeade, including shops and existing houses.
- `pitch-static`: inside Hogwarts Quidditch pitch, changing rooms and spectator area.
- `express`: King's Cross/Hogsmeade station or Hogwarts Express, differentiated by PC place.
- `diagon-knockturn`: Diagon/Knockturn shops; `region:diagon|knockturn` where relevant.
- `ministry2`: Ministry floors 1–7; `ministry-8-10`: floors 8–10.

If a location is covered by Fixed, **do not create an interior on top of Fixed**, do not replace native walls, furnishings, colors or objects. An AU shop in Hogsmeade/Diagon/Knockturn uses a suitable empty existing Fixed building without displacing canon shops. A genuinely new building in H1/H2 which cannot be represented within artwork, or explicitly requested separate schematic, uses a Custom/Generated map instead.

**Generated Hogwarts and AU scope IDs from source (use exact spelling):**

`SUB-DUNGEONS-N` · `SUB-DUNGEONS-E` · `SUB-DUNGEONS-S` · `SUB-DUNGEONS-W` · `DUNGEONS-N` · `DUNGEONS-E` · `DUNGEONS-S` · `DUNGEONS-W` · `KITCHENS-N` · `KITCHENS-E` · `KITCHENS-S` · `KITCHENS-W` · `F1-N` · `F1-E` · `F1-S` · `F1-W` · `F2-N` · `F2-E` · `F2-S` · `F2-W` · `F3-N` · `F3-E` · `F3-S` · `F3-W` · `F4-N` · `F4-E` · `F4-S` · `F4-W` · `F5-N` · `F5-E` · `F5-S` · `F5-W` · `F6-N` · `F6-E` · `F6-S` · `F6-W` · `F7-N` · `F7-E` · `F7-S` · `F7-W` · `F8-N` · `F8-E` · `F8-S` · `F8-W` · `TOWER-NORTH-DIVINATION-N` · `TOWER-ASTRONOMY-NW` · `TOWER-HEADMASTER-S-N-CENTER` · `TOWER-CLOCK-TOWER-SW` · `TOWER-BELL-TOWER-N` · `TOWER-FACULTY-TOWER-S` · `TOWER-DADA-TOWER-E` · `TOWER-GRAND-STAIRCASE-TOWER-CENTER` · `AU-PC-HOME` · `AU-CCC-07-18` · `AU-LIAD-S-ATTIC` · `AU-WHITECAP-ESTATE`

**World scope IDs:**

`LONDON` · `ENGLAND_REGIONS` · `TRANSIT_AND_INTL`

Resolve one site/building and relevant floor inside a World scope; never render all of London or England as a single indoor map. A World site-level illustration is not an assertion of canonical internal rooms. When new RP rooms are genuinely needed, supply their descriptive place data and route to supported Generated/Custom form.

**Supported native scope aliases:**

- tower-divination → TOWER-NORTH-DIVINATION-N
- tower-astronomy → TOWER-ASTRONOMY-NW
- tower-headmaster → TOWER-HEADMASTER-S-N-CENTER
- tower-clock → TOWER-CLOCK-TOWER-SW
- tower-bell → TOWER-BELL-TOWER-N
- tower-faculty → TOWER-FACULTY-TOWER-S
- tower-dada → TOWER-DADA-TOWER-E
- tower-stairs → TOWER-GRAND-STAIRCASE-TOWER-CENTER
- au-home → AU-PC-HOME
- au-ccc → AU-CCC-07-18
- au-liad → AU-LIAD-S-ATTIC
- au-whitecap → AU-WHITECAP-ESTATE

Priority: explicit authorized separate view or unsupported H1/H2 construction → Custom; else most specific Fixed → existing Hogwarts/AU Atlas cluster → suitable World site/floor → supported Custom. A source pointer (`→`) is not a physical room or a new route. Do not invent routes between tower levels or compass directions; F1 refers to Hogwarts ground floor.

**Corridor layouts, if a Generated cluster requires one:**

`horizontal` · `vertical` · `ell` · `tee` · `cross` · `court` · `cloister` · `windows` · `curved` · `tower`

Use the Atlas cluster's selected corridor by default. The topology is a starting geometry for generating a believable map, never a mandatory placement of each room. `layoutType` overrides only if justified by the current actual space. Approved architectural shapes, doors and circulation must be respected.

## 4. ROOMS, APPROVED LAYOUTS, INTERIORS

GitHub Atlas is the spatial/furnishing source: `assets/atlas.json` has the current technical room ID, floor/wall materials, room size, static description and base interior recipe. `docs/WZW_MAP2_ATLAS_GITHUB_MASTER.md` documents the fuller historical design and intended furniture organization. Gemini sends **RP changes and Vietnamese display overrides**; never dump the entire fixed inventory or generate SVG coordinates manually.

**49 native functional recipes, including 41 indoor and 8 outdoor:**

`HEADMASTER_OFFICE` · `DIVINATION_CLASSROOM` · `ASTRONOMY_OBSERVATORY` · `PREFECTS_BATHROOM` · `ROOM_OF_REQUIREMENT` · `CHAMBER_OF_SECRETS` · `TOWER_CLOCKWORK` · `BALLROOM` · `TROPHY_ROOM` · `CLASSROOM` · `MAGIC_PRACTICE` · `POTIONS_LAB` · `RESEARCH_LAB` · `OFFICE` · `STUDY_ROOM` · `MEETING_CLUB` · `LIBRARY` · `ARCHIVE` · `STORAGE` · `WORKSHOP` · `GALLERY` · `MUSIC_ROOM` · `LOUNGE` · `BEDROOM` · `KITCHEN` · `DINING_ROOM` · `BATHROOM` · `LAUNDRY` · `HOSPITAL_WARD` · `RECEPTION` · `GUARDROOM` · `PASSAGE_PROPS` · `UTILITY_ROOM` · `SECURE_VAULT` · `DETENTION_CELL` · `PUBLIC_COUNTER` · `CEREMONY_HALL` · `ENTRANCE_VESTIBULE` · `CLOAKROOM_LOCKERS` · `ART_CARTOGRAPHY_STUDIO` · `GAMES_ROOM` · `OUT_COURTYARD` · `OUT_GARDEN` · `OUT_LAWN` · `OUT_WOODLAND` · `OUT_WATERSIDE` · `OUT_BUILDING_YARD` · `OUT_CAMP` · `OUT_SERVICE_GARDEN`

Render priority:
1. **Approved layouts S/M/L first**: use native `assets/layout-sizes.json` + `assets/recipes.json`, preserve SVG artwork, authored composition and relative placement.
2. If no approved layout exists for a room: use a **function-based construction formula**, with suitable room size, floor, wall, door, wall-mounted assets, work/furniture zones, visual focus and clear circulation. Prefer existing asset IDs, textures and room recipe instances. Never create a repetitive grid of random props.
3. If a new RP object has no native asset, use safe structured `visual.shapes` or the existing named fallback. Never generate magical artifact effects or narrative secrets from decoration.

Furniture and room inventory are illustrative defaults, not RP facts. Story changes may add, remove or replace whole native objects/groups; do not duplicate default inventory. Existing `props` rules: `merge` preserves defaults, `replace` is complete desired inventory (empty list removes furniture only), `op:ensure` sets desired total, `op:add` increments. Count zero or states removed/missing/destroyed remove an object; broken is only a state indicator. Never guess native instance IDs or use component/support/parent/child links. New objects can use stable `rp:*` IDs. Keep doorways, stairs, water and traversal spaces clear.

Supported floor: `tile` · `wood` · `brick` · `octagon` · `mosaic` · `herringbone` · `diamond` · `cobble`.

Supported wall: `stone` · `dark` · `timber` · `wainscot` · `plaster` · `brick` · `ashlar` · `panel` · `limestone` · `rubble`.

Visual material: `wood` · `stone` · `metal` · `fabric` · `paper` · `glass` · `plant` · `ink`.

Zone: `center` · `entrance` · `left` · `right` · `end` · `wall_north` · `wall_south` · `wall_west` · `wall_east`.

New Custom rooms can select `size:S|M|L`, `architecture:{floor,wall}`, `type` by functional recipe and controlled `props`. `OUT_*` alone does not request outdoor mode: specify `mapMode:outdoor` when actually outside.

All displayed rooms need non-empty concise natural Vietnamese Inspector content: `description` describes appearance/atmosphere, `overhear` summarizes what people are actually doing/saying or the room's current activity. These do **not** mean the PC personally heard it. If there is no current activity, emit `Không có hoạt động gì đáng chú ý.`; a truly empty room may be `Căn phòng trống trải, yên tĩnh.`. The Atlas already provides static descriptions for unmodified rooms; Gemini need not send every unchanged room. Ensure current PC/selected rooms and all relevant active rooms have accurate Vietnamese overrides.

## 5. NPC, TAGS, FOOTSTEPS & INSPECTOR

Exactly one `isPC:true` actor and **up to 10** NPC/group name ribbons (10 is a maximum, not a minimum requiring invented arrivals). Use verified current actors, names, House category, position, posture, activity and group membership from RP. Unknown names use a neutral descriptive label; never grant a guessed identity. Every actor has a verified `placeId` and `spot`. Group known co-located actors via `members` and a short `summary`. `AI ĐÓ` may be empty when there are no NPCs. Footsteps attach to actual RP positions and existing movement; no synthetic patrol or invented footsteps.

Supported tagType values:

`gryffindor` · `slytherin` · `ravenclaw` · `hufflepuff` · `beauxbatons` · `durmstrang` · `teacher` · `adult` · `patrol` · `animal` · `monster` · `ghost` · `unknown` · `crowd`

Spot: `inside | corridor | threshold | outdoor`; posture: `standing | sitting | lying | hidden`; footstep: `walk | idle | hidden`. Patrol requires accepted current evidence and `onPatrol:true`.

Inspector content:
- VỊ TRÍ: area heading + subarea, not a selected actor's name.
- NGHE HÓNG: one short natural sentence describing activity (including non-audible map activity).
- QUAN SÁT: one short natural sentence describing room or immediate scene, **not** inventory counts or diagnostics.
- AI ĐÓ: actual NPC ribbons; empty is permitted.
- HÓNG HỚT TÁM PHƯƠNG: a **table of contents** of ALL NPC and event markers on the displayed map, regardless of selected room. Each row: NPC/event name plus a very short **italic subtitle** (ideally 4–10 Vietnamese words). Selecting row focuses and highlights its linked marker and shows that actor/event's contextual location in the Inspector.

All `quote`, `description`, `overhear`, `activity`, `observation`, `summary`, `detail`: **one sentence under 20 Vietnamese whitespace-delimited words**, without metadata, itemized objects, inventory, stage, rewards or secret solutions. Prefer a brief poetic but non-spoiling quote.

## 6. STORY-CONFIGURED QUEST & EVENT MARKERS

Use the four filled Story Settings and accepted current quest/Monthly Pack/Pool RP state. Select events whose activity/quest/clue actually exists in the displayed local map at the relevant time. Apply `MAP_QUEST_LIMIT` and `QUEST_DISTRIBUTION` as upper bounds, not a demand to invent or generate new quest events. Never silently replace a missing MAIN/SIDE/HIDDEN with a fabricated event. Do not resurrect failed/expired quests or advance a stage simply because its marker appears.

Use `ICON_MAPPING` to assign each event into exactly one of the two supported marker renderings:
- `hidden:false` = **BINOCULARS** (ordinary visible quest/activity/opportunity).
- `hidden:true` = **MAGNIFIER** (discovery/investigable clue marker).

The word `hidden` is an icon-selection flag only. It does not impose a knowledge gate on map scope, conceal the full payload from the user, or justify revealing secret answers. Every event needs a real linked `placeId`, a concise Vietnamese `title`, and a teaser `detail`; an event listing is NOT proof the PC accepted/completed it. No internal quest ID, pack quota, trigger, reward, resolution or debug category may be displayed.

## 7. EXACT MAP_DATA 2.0.0 FIELD CONTRACT

Output exactly **one complete fenced `html` document** with a single current JSON object placed inside the fixed loader's `<script type="application/json" id="map-data">` tag. Never output JSON alone, OOC, a STATUS/BODY/META block, markdown explanations or escaped HTML tags.

ROOT REQUIRED: `schemaVersion:"2.0.0"`, `meta:{date,time,areaName,quote}`, `atlasAnchor`, `pcPlace`, `pcSpot`, `places:[]`, `actors:[]`, `events:[]`.

ROOT OPTIONAL: `mapMode:indoor|outdoor|template`, `layoutType`, `forceSandbox:boolean`, `region:diagon|knockturn`.

PLACE: `name` (Vietnamese display string), `id?` (verified technical Atlas ID), `type?` (one of 49 recipe IDs), `size?:S|M|L`, `description?`, `overhear?`, `region?`, `isNewConstruction?`, `architecture?:{floor?,wall?}`, `propsMode?:merge|replace`, `props?:(string|PROP)[]`.

PROP: `name`, `item?:nativeAssetId`, `id?:wholeInstanceId`, `count?:integer>=0`, `op?:ensure|add`, `state?:intact|broken|removed|missing|destroyed`, `zone?:ZONE`, `visual?:{shapes:SHAPE[]}`.

ACTOR: `name`, `isPC?:boolean`, `id?`, `placeId?`, `placeName?`, `spot?:inside|corridor|threshold|outdoor`, `zone?:ZONE`, `tagType?:TAG`, `activity?`, `observation?`, `members?:string[]`, `summary?`, `footstep?:walk|idle|hidden`, `posture?:standing|sitting|lying|hidden`, `onPatrol?:boolean`.

EVENT: `title`, `detail?`, `placeId?`, `placeName?`, `hidden?:boolean`, `id?`.

SHAPE: `{kind:"rect",x,y,width,height,material?}` OR `{kind:"ellipse",cx,cy,rx,ry,material?}` OR `{kind:"path",d,material?}`; use 1–32 valid shapes in a 100×100 local viewport. No untrusted raw SVG, HTML, URLs or JavaScript.

Known `placeId` references must resolve to a native room in scope. `pcPlace` is authoritative for PC. Do not output arbitrary seed/viewport/zoom values, legacy `templateState`, or unsupported unknown IDs. New visual assets are optional and safe data only.

## 8. RENDER & OUTPUT VALIDATION

Before returning HTML, verify:
1. Current PC location/owner/date/time and exactly one PC. No RP state mutation.
2. Every existing Atlas room uses verified native ID; Vietnamese name is display only.
3. Activity and observation non-empty where displayed, short and grounded; neutral fallbacks for empty rooms.
4. All NPC/group and event marker locations refer to actual places; ≤10 NPC ribbons; quest count and classes obey filled Story Settings.
5. No furniture duplication, no changes to Fixed, correct orientation/doorways and preserved approved layout.
6. No raw technical metadata, inventory list or complete quest answer appears in user text.
7. One HTML page, valid JSON encoded safely (escape a literal `<` inside JSON strings as `\\u003c`), and all three runtime files loaded from the same pinned SHA.
8. No extra commentary, side effects, story actions or file attachments in Gemini output.

The wider RP rules R1–R20, World and Communication remain responsible for story continuity. /MAP is only an overview and does not transfer map knowledge into the narrative state.

## 9. FIXED HTML LOADER (RELEASE-MANAGED, NOT A STORY SETTING)

Preserve all HTML tags, inline fallback code and the three linked jsDelivr URLs verbatim. In the final Gemini answer, replace only the JSON between the `map-data` script tags with current valid MAP_DATA, and return precisely one fenced HTML document. Pinned release URLs are maintained by the GitHub build/release process; never edit them while filling a story.

```html
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><title>WIZAMAP</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ngoc1804/wzw-hogwarts-map-2@97c42cd977bc0e41ddc9d46affda95b1cfb311f1/dist/shell.css" onerror="window.WZW_LOAD_FAILED=true;document.getElementById('wzw-map')?.setAttribute('data-status','load-error')">
</head>
<body>
<div id="wzw-map"><p role="status">Đang mở bản đồ…</p></div>
<script type="application/json" id="map-data">{
  "schemaVersion": "2.0.0",
  "meta": {
    "date": "",
    "time": "",
    "areaName": "",
    "quote": ""
  },
  "atlasAnchor": "",
  "pcPlace": "",
  "pcSpot": "",
  "places": [],
  "actors": [
    {
      "name": "",
      "isPC": true,
      "spot": ""
    }
  ],
  "events": []
}</script>

<script>window.WZW_START=performance.now();window.wzwLoadError=function(){window.WZW_LOAD_FAILED=true;const r=document.getElementById('wzw-map');r.replaceChildren();let d={};try{d=JSON.parse(document.getElementById('map-data').textContent)||{}}catch{}for(const v of [d.meta?.areaName,...[d.places,d.actors,d.events].flatMap(a=>Array.isArray(a)?a.map(x=>[x?.name||x?.title,x?.description||x?.activity||x?.detail].filter(Boolean).join(' — ')):[])])if(v){const p=document.createElement('p');p.textContent=v;r.append(p)}if(!r.childNodes.length)r.textContent='Bản đồ RP';r.dataset.status='text-fallback'};</script>

<script src="https://cdn.jsdelivr.net/gh/Ngoc1804/wzw-hogwarts-map-2@97c42cd977bc0e41ddc9d46affda95b1cfb311f1/dist/templates-pack.js" onerror="wzwLoadError()"></script>

<script src="https://cdn.jsdelivr.net/gh/Ngoc1804/wzw-hogwarts-map-2@97c42cd977bc0e41ddc9d46affda95b1cfb311f1/dist/bundle.js" onerror="wzwLoadError()"></script>

</body>
</html>
```
