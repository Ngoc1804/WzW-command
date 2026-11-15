"""Run all current suites against a quiet local server; never publish or mutate source."""
from pathlib import Path
import concurrent.futures,subprocess,http.server,threading,os,json,time
root=Path(__file__).resolve().parents[1];os.chdir(root);(root/'work').mkdir(exist_ok=True)
class Handler(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start();base='http://127.0.0.1:'+str(server.server_port);env=dict(os.environ,MAP_BASE_URL=base,MAP_PREVIEW_URL=base+'/examples/WIZAMAP_FIXED_UI.html')
def run(path):
 start=time.time()
 try:
  p=subprocess.run(['node',str(path)],cwd=root,env=env,capture_output=True,text=True,timeout=100);row={'test':path.name,'exit':p.returncode,'seconds':round(time.time()-start,1),'output':p.stdout+p.stderr}
 except subprocess.TimeoutExpired:row={'test':path.name,'exit':124,'seconds':100,'output':'TIMEOUT'}
 print(path.name,'PASS'if row['exit']==0 else'FAIL',flush=True)
 if row['exit']!=0: print(row['output'][-12000:],flush=True)
 return row
try:
 with concurrent.futures.ThreadPoolExecutor(max_workers=3)as pool:rows=list(pool.map(run,[p for p in sorted((root/'tests').glob('*.cjs'))if p.name!='runtime-fixture.cjs']))
 (root/'work/test-all.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2));print('PASS',sum(r['exit']==0 for r in rows),'/',len(rows));raise SystemExit(any(r['exit']for r in rows))
finally:server.shutdown();server.server_close()
