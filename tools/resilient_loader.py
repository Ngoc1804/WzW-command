"""Scene HTML with SHA-verified CDN assets and an identical embedded backup."""
from pathlib import Path
import base64,gzip,hashlib,json
ROOT=Path(__file__).resolve().parents[1]
def loader(base,payload):
    names=['shell.css','templates-pack.js','bundle.js']
    assets={name:(ROOT/'dist'/name).read_text() for name in names}
    hashes={name:hashlib.sha256(assets[name].encode()).hexdigest() for name in names}
    backup=base64.b64encode(gzip.compress(json.dumps(assets,ensure_ascii=False,separators=(',',':')).encode(),mtime=0)).decode()
    data=json.dumps(payload,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
    boot=r'''window.WZW_START=performance.now();
(async()=>{
 const root=document.getElementById('wzw-map');
 const names=['shell.css','templates-pack.js','bundle.js'];
 const base=BASE;
 const hashes=HASHES;
 let files,source='cdn';
 try{
  const values=await Promise.all(names.map(async name=>{
   const control=new AbortController();const timer=setTimeout(()=>control.abort(),5000);
   try{
    const response=await fetch(base+name,{signal:control.signal});if(!response.ok)throw Error('HTTP '+response.status);
    const bytes=await response.arrayBuffer();
    if(crypto.subtle){const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');if(digest!==hashes[name])throw Error('Asset mismatch');}
    return new TextDecoder().decode(bytes);
   }finally{clearTimeout(timer);}
  }));files=Object.fromEntries(names.map((name,i)=>[name,values[i]]));
 }catch{
  source='embedded';const raw=Uint8Array.from(atob(document.getElementById('runtime-backup').textContent.trim()),c=>c.charCodeAt(0));
  files=JSON.parse(await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
 }
 const style=document.createElement('style');style.textContent=files['shell.css'];document.head.append(style);
 for(const name of names.slice(1)){const script=document.createElement('script');script.textContent=files[name];document.body.append(script);}
 await window.WZWMap.ready;
 root.dataset.assetSource=source;
})().catch(error=>{
 console.error(error);const root=document.getElementById('wzw-map');root.textContent='Không thể mở bản đồ. Dữ liệu cảnh vẫn được giữ trong MAP_DATA.';root.dataset.status='load-error';
});'''.replace('BASE',json.dumps(base)).replace('HASHES',json.dumps(hashes))
    return '<!DOCTYPE html>\n<html lang="vi">\n<head>\n<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><title>WIZAMAP</title>\n</head>\n<body>\n<div id="wzw-map"><p role="status">Đang mở bản đồ…</p></div>\n<script type="application/json" id="map-data">'+data+'</script>\n<script type="application/octet-stream" id="runtime-backup">'+backup+'</script>\n<script>'+boot+'</script>\n</body>\n</html>\n'
if __name__=='__main__':
    import sys
    print(loader(sys.argv[1],json.load(sys.stdin)))
