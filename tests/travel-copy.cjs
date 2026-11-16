const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('src/index.js','utf8');
const elements={'#place-title':{textContent:'Hagrid'},'#actors':{textContent:'Hagrid'},'#observation':{textContent:'Khói bốc từ mái nhà.'},'#go-status':{textContent:''}};
let clipboard='',fallback='',removed=false;
const ctx=vm.createContext({$:s=>elements[s],put:(s,v)=>elements[s].textContent=v,navigator:{clipboard:{writeText:async t=>{clipboard=t}}},document:{activeElement:{focus(){}},createElement:()=>({setAttribute(){},style:{},select(){fallback=this.value},remove(){removed=true}}),execCommand:()=>true},root:{append(){}}});
vm.runInContext('let selectedMapPlace={name:"Chòi Hagrid"};let sceneData={meta:{areaName:"Khuôn viên Hogwarts"}};'+source.slice(source.indexOf('function travelCopyText'),source.indexOf('function showEventDetails')),ctx);
(async()=>{await ctx.copyTravel();assert.equal(clipboard,'/NEXT - Hagrid - Khuôn viên Hogwarts - Chòi Hagrid\n\nAI ĐÓ: Hagrid\n\nQUAN SÁT: Khói bốc từ mái nhà.\n\n[ Nhập hành động ở đây ]');
elements['#actors'].textContent='';elements['#place-title'].textContent='Nhà kính';vm.runInContext('selectedMapPlace={name:"Nhà kính"};navigator.clipboard.writeText=async()=>{throw Error()}',ctx);await ctx.copyTravel();assert(fallback.includes('/NEXT - Nhà kính'));assert(fallback.includes('AI ĐÓ: \n'));assert(removed);vm.runInContext('selectedMapPlace=null',ctx);assert.equal(ctx.travelCopyText(),'');console.log('PASS current selection, empty NPCs, clipboard and iframe fallback');})().catch(e=>{console.error(e);process.exit(1)});
