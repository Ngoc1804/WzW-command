const fs=require('fs'),assert=require('assert'),{spawnSync}=require('child_process'),{chromium}=require('playwright');
const data={schemaVersion:'2.0.0',meta:{date:'16/08/1992',time:'11:30',areaName:'Whitecap · Kiểm tra',quote:'Kiểm tra HTML'},atlasAnchor:'AU-WHITECAP-ESTATE',pcPlace:'veranda',pcSpot:'outdoor',places:[{id:'veranda',name:'Hiên',type:'LOUNGE',description:'Mái che nhìn ra biển.'},{id:'living',name:'Phòng khách',type:'LOUNGE',description:'Ghế ngồi bên cửa sổ.'},{id:'beach',name:'Bãi biển',type:'LOUNGE',description:'Cát vàng bên biển.'}],actors:[{name:'PC',isPC:true,placeId:'veranda',spot:'outdoor'},{name:'NPC hiên',placeId:'veranda',spot:'outdoor'},{name:'NPC khách',placeId:'living',spot:'inside'},{name:'NPC biển',placeId:'beach',spot:'outdoor'}],events:[{title:'Hoạt động ngoài hiên',placeId:'veranda'}]};
const base='https://cdn.jsdelivr.net/gh/Ngoc1804/wzw-hogwarts-map-2@639833c437e3364855ed2e8ad275ef317d64631a/dist/';
const generated=spawnSync('python3',['tools/resilient_loader.py',base],{input:JSON.stringify(data),encoding:'utf8',maxBuffer:15e6});assert.equal(generated.status,0,generated.stderr);const html=generated.stdout;
(async()=>{fs.mkdirSync('work/qa15',{recursive:true});const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{
 for(const mode of ['cdn','blocked','corrupt','timeout'])for(const mobile of [false,true]){
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1400,height:950}});const errors=[];let copied='';page.on('pageerror',e=>errors.push(e.message));
  await page.exposeFunction('saveCopied',text=>{copied=text});
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>window.saveCopied(text)},configurable:true}));
  await page.route('https://cdn.jsdelivr.net/**',async route=>{if(mode==='blocked')return route.abort();if(mode==='timeout'){await new Promise(resolve=>setTimeout(resolve,6000));return route.abort().catch(()=>{});}const name=new URL(route.request().url()).pathname.split('/').pop();await route.fulfill({body:mode==='corrupt'&&name==='bundle.js'?'broken':fs.readFileSync('dist/'+name),contentType:name.endsWith('.css')?'text/css':'text/javascript',headers:{'access-control-allow-origin':'*'}})});
  await page.route('https://map-test.invalid/',route=>route.fulfill({body:'<!doctype html><html></html>',contentType:'text/html'}));
  await page.goto('https://map-test.invalid/');
  await page.setContent(html);
  await page.waitForFunction(()=>document.querySelector('#wzw-map')?.dataset.status==='ready'&&document.querySelector('#wzw-map')?.dataset.assetSource,{timeout:20000});
  assert.equal(await page.locator('#wzw-map').getAttribute('data-asset-source'),mode==='cdn'?'cdn':'embedded');assert.equal(await page.locator('#mapmount > svg').count(),1);
  assert(await page.locator('#go-there').isDisabled());if(mobile)await page.locator('#drawer-toggle').click();
  await page.locator('#quests .event-row').filter({hasText:'Hoạt động ngoài hiên'}).click();assert.equal(await page.locator('#actors').innerText(),'NPC hiên');
  await page.locator('#go-there').click();await page.waitForFunction(()=>document.querySelector('#go-status').textContent==='Đã sao chép');assert(copied.includes('AI ĐÓ: NPC hiên'));assert(copied.includes('[ Nhập hành động ở đây ]'));
  await page.locator('#quests .event-row').filter({hasText:'NPC khách'}).click();assert.equal(await page.locator('#actors').innerText(),'NPC khách');await page.locator('#go-there').click();assert(!copied.includes('NPC hiên'));
  assert.deepEqual(await page.locator('#map-data').evaluate(e=>JSON.parse(e.textContent)),data);assert.deepEqual(errors,[]);
  await page.screenshot({path:'work/qa15/resilient-'+mode+'-'+(mobile?'mobile':'desktop')+'.png'});await page.close();console.log('PASS resilient loader',mode,mobile?'mobile':'desktop');
 }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
