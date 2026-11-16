"""One loader shape for local example and SHA-pinned Gemini instructions."""
import json

def loader(base, payload):
 data=json.dumps(payload,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c') if not isinstance(payload,str) else payload
 return '''<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><title>WIZAMAP</title><link rel="stylesheet" href="'''+base+'''shell.css" onerror="window.WZW_LOAD_FAILED=true;document.getElementById('wzw-map')?.setAttribute('data-status','load-error')">
</head>
<body>
<div id="wzw-map"><p role="status">Đang mở bản đồ…</p></div>
<script type="application/json" id="map-data">'''+data+'''</script>

<script>window.WZW_START=performance.now();window.wzwLoadError=function(){window.WZW_LOAD_FAILED=true;const r=document.getElementById('wzw-map');r.replaceChildren();let d={};try{d=JSON.parse(document.getElementById('map-data').textContent)||{}}catch{}for(const v of [d.meta?.areaName,...[d.places,d.actors,d.events].flatMap(a=>Array.isArray(a)?a.map(x=>[x?.name||x?.title,x?.description||x?.activity||x?.detail].filter(Boolean).join(' — ')):[])])if(v){const p=document.createElement('p');p.textContent=v;r.append(p)}if(!r.childNodes.length)r.textContent='Bản đồ RP';r.dataset.status='text-fallback'};</script>

<script src="'''+base+'''templates-pack.js" onerror="wzwLoadError()"></script>

<script src="'''+base+'''bundle.js" onerror="wzwLoadError()"></script>

</body>
</html>'''
