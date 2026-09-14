(()=>{
const VERSION='jolly-skillball-probe-1.2';
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const abs=u=>{try{return new URL(u||'',location.href).href}catch(e){return u||''}};

// ---------- visible panel FIRST ----------
let old=document.getElementById('jolly-skillball-probe-panel'); if(old) old.remove();
const p=document.createElement('div');
p.id='jolly-skillball-probe-panel';
p.style=[
 'position:fixed','z-index:2147483647','left:6px','right:6px','top:6px',
 'background:#111','color:#fff','padding:10px','border-radius:10px',
 'font-size:13px','line-height:1.35','box-shadow:0 2px 14px #000a',
 'max-height:46vh','overflow:auto','font-family:-apple-system,BlinkMacSystemFont,sans-serif'
].join(';');
p.innerHTML=
 '<div style="display:flex;justify-content:space-between;gap:8px;align-items:center">'+
 '<b>技玉 probe v1.2</b><span id="jsp-status">起動中…</span></div>'+
 '<div style="height:7px;background:#444;border-radius:5px;margin:7px 0"><div id="jsp-bar" style="height:7px;width:3%;background:#ddd;border-radius:5px"></div></div>'+
 '<div id="jsp-summary" style="margin-bottom:5px">初期化しています</div>'+
 '<pre id="jsp-log" style="white-space:pre-wrap;margin:0;font-size:11px;max-height:18vh;overflow:auto;background:#222;padding:6px;border-radius:6px"></pre>'+
 '<div id="jsp-buttons" style="margin-top:7px"></div>';
(document.body||document.documentElement).appendChild(p);

const statusEl=document.getElementById('jsp-status');
const barEl=document.getElementById('jsp-bar');
const summaryEl=document.getElementById('jsp-summary');
const logEl=document.getElementById('jsp-log');
const btnEl=document.getElementById('jsp-buttons');

const state={version:VERSION,started_at:new Date().toISOString(),steps:[],errors:[],warnings:[],result:null};
function progress(n,msg){
  barEl.style.width=Math.max(3,Math.min(100,n))+'%';
  statusEl.textContent=msg||'';
}
function log(msg,kind='INFO'){
  const line='['+new Date().toLocaleTimeString()+'] '+kind+' '+msg;
  state.steps.push(line);
  logEl.textContent+=(logEl.textContent?'\n':'')+line;
  logEl.scrollTop=logEl.scrollHeight;
}
function warn(msg){state.warnings.push(msg);log(msg,'WARN')}
function fail(err,where='unknown'){
  const rec={where,message:String(err?.message||err),stack:String(err?.stack||'')};
  state.errors.push(rec);
  log(where+': '+rec.message,'ERROR');
  statusEl.textContent='エラー';
  summaryEl.textContent='エラーが発生しました。下の「診断JSON保存」で内容を保存できます。';
  progress(100,'エラー');
  showButtons();
}
function download(obj,name){
  try{
    const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob); a.download=name;
    document.body.appendChild(a); a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1200);
    log(name+' の保存処理を開始しました','OK');
  }catch(e){fail(e,'download')}
}
async function copy(obj){
  try{
    await navigator.clipboard.writeText(JSON.stringify(obj,null,2));
    log('JSONをクリップボードへコピーしました','OK');
    alert('JSONをコピーしました');
  }catch(e){fail(e,'copy')}
}
function showButtons(){
  btnEl.innerHTML='';
  const b1=document.createElement('button');
  b1.textContent=state.result?'JSON保存':'診断JSON保存';
  b1.style='padding:8px;margin-right:6px';
  b1.onclick=()=>download(state.result||state,'jolly_skillball_probe_v12.json');
  btnEl.appendChild(b1);
  const b2=document.createElement('button');
  b2.textContent='JSONコピー'; b2.style='padding:8px;margin-right:6px';
  b2.onclick=()=>copy(state.result||state); btnEl.appendChild(b2);
  const b3=document.createElement('button');
  b3.textContent='閉じる'; b3.style='padding:8px';
  b3.onclick=()=>p.remove(); btnEl.appendChild(b3);
}
showButtons();

try{
  log('スクリプト起動');
  progress(10,'ページ確認');

  const navbars=[...document.querySelectorAll('.item_navbar')];
  log('タブ検出: '+navbars.length+'個');
  const active=navbars.find(x=>!String(x.className||'').includes('grayscale_50'));
  const skillTab=document.getElementById('item_navbar_skillball');

  if(!skillTab){
    throw new Error('item_navbar_skillball が見つかりません。このページは想定したアイテム一覧ではない可能性があります。');
  }

  log('技玉タブはDOM上に存在');
  log('現在アクティブ: '+(active?.id||'不明')+' / '+clean(active?.textContent));

  if(active?.id!=='item_navbar_skillball'){
    warn('現在は技玉タブではありません。先に画面上の「技玉」を手動で開き、そのページで再実行してください。');
    progress(100,'技玉タブ待ち');
    summaryEl.innerHTML='<b>収集はまだ開始していません。</b><br>現在: '+clean(active?.textContent||'不明')+'。先に「技玉」タブを手動で開いてから、このスクリプトをもう一度実行してください。';
    state.result={
      version:VERSION,ok:false,reason:'skillball_tab_not_active',
      collected_at:new Date().toISOString(),page_url:location.href,
      active_tab:{id:active?.id||null,text:clean(active?.textContent),class_name:active?.className||''},
      navbars:navbars.map(x=>({id:x.id||'',text:clean(x.textContent),class_name:x.className||'',html:x.outerHTML.slice(0,1800)})),
      errors:state.errors,warnings:state.warnings,steps:state.steps
    };
    showButtons();
    setTimeout(()=>{try{completion({ok:false,version:VERSION,reason:'skillball_tab_not_active'})}catch(e){}},50);
    return;
  }

  progress(25,'DOM探索');
  log('技玉タブがアクティブ。候補DOMを探索');

  function parseId(el){
    const vals=[
      el?.querySelector('img')?.getAttribute('src')||'',
      el?.querySelector('a')?.getAttribute('href')||'',
      el?.getAttribute('data-item')||'',
      el?.getAttribute('data-id')||''
    ].join(' ');
    let m=vals.match(/\/item\/(?:60|100|150|320|640)\/(\d+)\./);
    if(!m)m=vals.match(/[?&](?:item|item_no)=(\d+)/);
    return m?m[1]:null;
  }

  function rowFrom(el,i,source){
    const nameEl=
      el.querySelector('.design_item_default_item_list_name')||
      el.querySelector('[class*="name"]');
    const countEl=
      el.querySelector('.design_item_default_item_list_count')||
      el.querySelector('[class*="count"]');
    const detailEl=
      el.querySelector('.design_item_default_item_list_detail')||
      el.querySelector('.ui-li-desc')||
      el.querySelector('p');
    const a=el.querySelector('a');
    const img=el.querySelector('img');
    const text=clean(el.textContent);
    const name=clean(nameEl?.textContent);
    let count=clean(countEl?.textContent);
    if(!count){
      const m=text.match(/もっている数[：:]?\s*([0-9,]+)/);
      if(m)count=m[1];
    }
    return {
      index:i,source_selector:source,item_id:parseId(el),
      item_name:name||null,
      owned_count:/^[0-9,]+$/.test(count)?Number(count.replace(/,/g,'')):count||null,
      detail:clean(detailEl?.textContent)||null,
      text,
      href:abs(a?.getAttribute('href')),
      image_url:abs(img?.getAttribute('src')),
      id:el.id||'',class_name:el.className||'',
      html:el.outerHTML.slice(0,7000)
    };
  }

  const selectors=[
    'li.design_item_default_item_list',
    'li[class*="item"]',
    'li.ui-li',
    '[class*="skillball"]',
    '[id*="skillball"]'
  ];
  let candidates=[];
  selectors.forEach((sel,idx)=>{
    const els=[...document.querySelectorAll(sel)];
    log(sel+' → '+els.length+'件');
    els.forEach((el,i)=>{
      const r=rowFrom(el,i,sel);
      if(r.text&&r.text.length<2500)candidates.push(r);
    });
    progress(30+idx*8,'DOM探索 '+(idx+1)+'/'+selectors.length);
  });

  const seen=new Set();
  candidates=candidates.filter(r=>{
    const k=(r.item_id||'')+'|'+(r.item_name||'')+'|'+r.text;
    if(seen.has(k))return false; seen.add(k); return true;
  });
  const likelyItems=candidates.filter(r=>r.item_id||r.item_name||/もっている数/.test(r.text));
  log('重複除去後候補: '+candidates.length+'件','OK');
  log('アイテム候補: '+likelyItems.length+'件','OK');

  progress(78,'ページ送り確認');
  const pager=[...document.querySelectorAll('.parts_default_page_number,#page_item_default_item_list_nextpage,#page_item_default_item_list_backpage')].map(a=>({
    text:clean(a.textContent),id:a.id||'',class_name:a.className||'',
    href:abs(a.getAttribute('href')),html:a.outerHTML.slice(0,1800)
  }));
  log('ページ送り要素: '+pager.length+'件');

  progress(90,'結果作成');
  state.result={
    version:VERSION,ok:true,collected_at:new Date().toISOString(),page_url:location.href,title:document.title,
    active_tab:{id:active?.id||null,text:clean(active?.textContent),class_name:active?.className||''},
    counts:{candidates:candidates.length,likely_items:likelyItems.length,pager:pager.length},
    likely_items:likelyItems,candidates:candidates.slice(0,500),
    navbars:navbars.map(x=>({id:x.id||'',text:clean(x.textContent),class_name:x.className||'',html:x.outerHTML.slice(0,1800)})),
    pager,body_text:clean(document.body?.innerText).slice(0,50000),
    warnings:state.warnings,errors:state.errors,steps:state.steps
  };
  window.__JOLLY_SKILLBALL_PROBE=state.result;
  summaryEl.innerHTML='<b>収集完了</b><br>候補行: '+candidates.length+' / アイテム候補: '+likelyItems.length+' / ページ送り: '+pager.length;
  log('結果JSONを作成','OK');
  progress(100,'完了');
  showButtons();

  setTimeout(()=>{try{completion({ok:true,version:VERSION,likely_items:likelyItems.length,pager:pager.length})}catch(e){}},50);

}catch(e){
  fail(e,'main');
  setTimeout(()=>{try{completion({ok:false,version:VERSION,error:String(e?.message||e)})}catch(_){ }},50);
}
})();
