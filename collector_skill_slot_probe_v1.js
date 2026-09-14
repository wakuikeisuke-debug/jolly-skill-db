(()=>{
const VERSION='jolly-skill-slot-probe-1.0';
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const abs=(u,b=location.href)=>{try{return new URL(u||'',b).href}catch(e){return u||''}};

let old=document.getElementById('jolly-slot-probe-panel');if(old)old.remove();
const p=document.createElement('div');p.id='jolly-slot-probe-panel';
p.style='position:fixed;z-index:2147483647;left:6px;right:6px;top:6px;background:#111;color:#fff;padding:10px;border-radius:10px;font-size:13px;line-height:1.35;box-shadow:0 2px 14px #000a;max-height:50vh;overflow:auto;font-family:-apple-system,BlinkMacSystemFont,sans-serif';
p.innerHTML='<div style="display:flex;justify-content:space-between"><b>SKILL SLOT probe</b><span id="jsp-status">起動中</span></div>'+
'<div style="height:7px;background:#444;border-radius:5px;margin:7px 0"><div id="jsp-bar" style="height:7px;width:2%;background:#ddd;border-radius:5px"></div></div>'+
'<div id="jsp-summary">初期化中</div><pre id="jsp-log" style="white-space:pre-wrap;margin:6px 0 0;font-size:11px;max-height:20vh;overflow:auto;background:#222;padding:6px;border-radius:6px"></pre><div id="jsp-buttons" style="margin-top:7px"></div>';
(document.body||document.documentElement).appendChild(p);
const $=id=>document.getElementById(id),st=$('jsp-status'),bar=$('jsp-bar'),sum=$('jsp-summary'),logEl=$('jsp-log'),btn=$('jsp-buttons');
const state={version:VERSION,steps:[],errors:[],result:null};
function prog(n,s){bar.style.width=n+'%';st.textContent=s}
function log(s,k='INFO'){const x='['+new Date().toLocaleTimeString()+'] '+k+' '+s;state.steps.push(x);logEl.textContent+=(logEl.textContent?'\n':'')+x}
function err(e,w){state.errors.push({where:w,message:String(e?.message||e)});log(w+': '+String(e?.message||e),'ERROR')}
function save(o){const b=new Blob([JSON.stringify(o,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='jolly_skill_slot_probe.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}
async function copy(o){try{await navigator.clipboard.writeText(JSON.stringify(o,null,2));alert('JSONをコピーしました')}catch(e){err(e,'copy')}}
function buttons(){btn.innerHTML='';for(const [t,f] of [['JSON保存',()=>save(state.result||state)],['JSONコピー',()=>copy(state.result||state)],['閉じる',()=>p.remove()]]){const b=document.createElement('button');b.textContent=t;b.style='padding:8px;margin-right:6px';b.onclick=f;btn.appendChild(b)}}
buttons();

(async()=>{
try{
 log('起動');prog(10,'対象ページ取得');
 const u=new URL(location.href);u.searchParams.set('M','Card');u.searchParams.set('A','Default');u.searchParams.set('card_skill','10000');u.hash='';
 const r=await fetch(u.href,{credentials:'include',cache:'no-store'});
 if(!r.ok)throw new Error('HTTP '+r.status);
 const html=await r.text();log('HTTP 200 / '+html.length+' bytes','OK');prog(35,'DOM解析');
 const doc=new DOMParser().parseFromString(html,'text/html');
 const anchors=[...doc.querySelectorAll('a')].map((a,i)=>({i,text:clean(a.textContent),href:abs(a.getAttribute('href'),u.href),id:a.id||'',class_name:a.className||'',html:a.outerHTML.slice(0,3500)}));
 const imgs=[...doc.images].map((im,i)=>({i,alt:clean(im.alt),src:abs(im.getAttribute('src'),u.href),parent_text:clean(im.parentElement?.textContent).slice(0,500),parent_html:im.parentElement?.outerHTML.slice(0,3500)||''}));
 const candidates=[...doc.querySelectorAll('li,tr,[class*="card"],[id*="card"]')].map((el,i)=>({i,tag:el.tagName,id:el.id||'',class_name:el.className||'',text:clean(el.textContent).slice(0,1200),html:el.outerHTML.slice(0,5000)})).filter(x=>x.text&&x.text.length<1200).slice(0,600);
 prog(65,'SKILL SLOT表記探索');
 const slotContexts=[...doc.querySelectorAll('body *')].filter(el=>{const t=clean(el.textContent);return t&&t.length<1200&&/SKILL\s*SLOT|スキルスロット|技玉/i.test(t)}).slice(0,150).map((el,i)=>({i,tag:el.tagName,id:el.id||'',class_name:el.className||'',text:clean(el.textContent),html:el.outerHTML.slice(0,6000)}));
 const pageLinks=anchors.filter(x=>/^\d+$|NEXT|BACK/.test(x.text)||/card_skill|page|p=/.test(x.href));
 prog(86,'結果作成');
 state.result={version:VERSION,ok:true,collected_at:new Date().toISOString(),source_url:u.href,title:doc.title,counts:{anchors:anchors.length,images:imgs.length,candidates:candidates.length,slot_contexts:slotContexts.length,page_links:pageLinks.length},slot_contexts:slotContexts,page_links:pageLinks,candidates,anchors:anchors.slice(0,800),images:imgs.slice(0,500),body_text:clean(doc.body?.innerText).slice(0,50000),steps:state.steps,errors:state.errors};
 window.__JOLLY_SKILL_SLOT_PROBE=state.result;
 sum.innerHTML='<b>完了</b><br>SKILL SLOT周辺 '+slotContexts.length+'件 / 候補DOM '+candidates.length+'件 / page link '+pageLinks.length;
 prog(100,'完了');buttons();log('診断JSON作成','OK');
 try{completion({ok:true,version:VERSION,slot_contexts:slotContexts.length})}catch(e){}
}catch(e){err(e,'main');sum.textContent='停止: '+String(e?.message||e);prog(100,'エラー');buttons();try{completion({ok:false,error:String(e?.message||e)})}catch(_){ }}
})();
})();
