(()=>{
const VERSION='jolly-strong-tab-source-probe-1.0';
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const abs=u=>{try{return new URL(u||'',location.href).href}catch(e){return u||''}};

let old=document.getElementById('jolly-strong-source-panel');if(old)old.remove();
const p=document.createElement('div');p.id='jolly-strong-source-panel';
p.style='position:fixed;z-index:2147483647;left:6px;right:6px;top:6px;background:#111;color:#fff;padding:10px;border-radius:10px;font-size:13px;line-height:1.35;box-shadow:0 2px 14px #000a;max-height:50vh;overflow:auto';
p.innerHTML='<b>強化タブ source probe</b> <span id="jssp-status">起動中</span>'+
'<div style="height:7px;background:#444;border-radius:5px;margin:7px 0"><div id="jssp-bar" style="height:7px;width:5%;background:#ddd;border-radius:5px"></div></div>'+
'<div id="jssp-summary">初期化中</div><pre id="jssp-log" style="white-space:pre-wrap;background:#222;padding:6px;font-size:11px;max-height:18vh;overflow:auto"></pre><div id="jssp-buttons"></div>';
(document.body||document.documentElement).appendChild(p);
const $=id=>document.getElementById(id),st=$('jssp-status'),bar=$('jssp-bar'),sum=$('jssp-summary'),logEl=$('jssp-log'),btn=$('jssp-buttons');
const state={version:VERSION,steps:[],errors:[],result:null};
function log(s,k='INFO'){const x='['+new Date().toLocaleTimeString()+'] '+k+' '+s;state.steps.push(x);logEl.textContent+=(logEl.textContent?'\n':'')+x}
function prog(n,s){bar.style.width=n+'%';st.textContent=s}
function save(o){const b=new Blob([JSON.stringify(o,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='jolly_strong_tab_source_probe.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}
async function copy(o){try{await navigator.clipboard.writeText(JSON.stringify(o,null,2));alert('コピーしました')}catch(e){log(String(e),'ERROR')}}
function buttons(){btn.innerHTML='';for(const [t,f] of [['JSON保存',()=>save(state.result||state)],['JSONコピー',()=>copy(state.result||state)],['閉じる',()=>p.remove()]]){const b=document.createElement('button');b.textContent=t;b.style='padding:8px;margin:6px 6px 0 0';b.onclick=f;btn.appendChild(b)}}buttons();

try{
  log('起動');prog(15,'タブ確認');
  const nav=[...document.querySelectorAll('.item_navbar')];
  const active=nav.find(x=>!String(x.className||'').includes('grayscale_50'));
  if(active?.id!=='item_navbar_strong_item') throw new Error('強化タブを手動で開いてから実行してください。現在='+clean(active?.textContent||'不明'));
  log('強化タブ確認 OK','OK');

  prog(35,'現在DOM解析');
  const rows=[...document.querySelectorAll('li.design_item_default_item_list')].map((li,i)=>({
    i,text:clean(li.textContent),html:li.outerHTML.slice(0,7000),
    href:abs(li.querySelector('a')?.getAttribute('href')),image_url:abs(li.querySelector('img')?.getAttribute('src'))
  }));
  log('item rows='+rows.length);

  prog(55,'リンク・ページ送り解析');
  const anchors=[...document.querySelectorAll('a')].map((a,i)=>({i,text:clean(a.textContent),href_raw:a.getAttribute('href')||'',href:abs(a.getAttribute('href')),id:a.id||'',class_name:a.className||'',onclick:a.getAttribute('onclick')||'',html:a.outerHTML.slice(0,3500)}));
  const pageCandidates=anchors.filter(x=>/^\d+$|NEXT|BACK|PREV/.test(x.text)||/[?&]p=\d+/.test(x.href)||/item|strong|power|type/i.test(x.href_raw+' '+x.id+' '+x.class_name+' '+x.onclick));
  log('page/link candidates='+pageCandidates.length);

  prog(72,'form/script解析');
  const forms=[...document.forms].map((f,i)=>({i,action:f.action||'',method:f.method||'',id:f.id||'',class_name:f.className||'',text:clean(f.textContent).slice(0,1500),controls:[...f.elements].map(e=>({tag:e.tagName,type:e.type||'',name:e.name||'',value:e.value||'',id:e.id||''})).slice(0,150),html:f.outerHTML.slice(0,8000)}));
  const scripts=[...document.scripts].map((s,i)=>({i,src:abs(s.getAttribute('src')),inline:s.src?'':String(s.textContent||'').slice(0,15000)})).filter(x=>/strong|item_navbar|Item|type|page/i.test(x.src+' '+x.inline)).slice(0,60);
  log('forms='+forms.length+' relevant scripts='+scripts.length);

  state.result={version:VERSION,ok:true,collected_at:new Date().toISOString(),page_url:location.href,active_tab:{id:active.id,text:clean(active.textContent),class_name:active.className||''},counts:{rows:rows.length,anchors:anchors.length,page_candidates:pageCandidates.length,forms:forms.length,relevant_scripts:scripts.length},rows,page_candidates:pageCandidates,forms,relevant_scripts:scripts,navbars:nav.map(x=>({id:x.id||'',text:clean(x.textContent),class_name:x.className||'',html:x.outerHTML.slice(0,2500)})),body_text:clean(document.body?.innerText).slice(0,50000),steps:state.steps,errors:state.errors};
  window.__JOLLY_STRONG_SOURCE=state.result;
  sum.innerHTML='<b>完了</b><br>現在行 '+rows.length+' / link候補 '+pageCandidates.length;
  prog(100,'完了');buttons();log('JSON作成','OK');
  try{completion({ok:true,version:VERSION,rows:rows.length})}catch(e){}
}catch(e){
  state.errors.push({message:String(e?.message||e),stack:String(e?.stack||'')});log(String(e?.message||e),'ERROR');sum.textContent='停止: '+String(e?.message||e);prog(100,'エラー');buttons();try{completion({ok:false,error:String(e?.message||e)})}catch(_){}
}
})();
