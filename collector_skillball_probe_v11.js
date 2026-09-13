(()=>{
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const abs=u=>{try{return new URL(u||'',location.href).href}catch(e){return u||''}};
const activeTab=[...document.querySelectorAll('.item_navbar')].find(x=>!String(x.className||'').includes('grayscale_50'));
const skillTab=document.getElementById('item_navbar_skillball');

if(!skillTab){
  const result={version:'jolly-skillball-probe-1.1',ok:false,error:'技玉タブがDOMにありません',url:location.href};
  try{completion(result)}catch(e){}
  alert('技玉タブが見つかりません');
  return;
}
if(activeTab?.id!=='item_navbar_skillball'){
  const result={
    version:'jolly-skillball-probe-1.1',
    ok:false,
    error:'技玉タブが開かれていません',
    active_tab_id:activeTab?.id||null,
    active_tab_text:clean(activeTab?.textContent),
    url:location.href
  };
  try{completion(result)}catch(e){}
  alert('先に「技玉」タブを開いてから、このショートカットを実行してください。');
  return;
}

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
  const name=clean(nameEl?.textContent);
  const text=clean(el.textContent);
  let count=clean(countEl?.textContent);
  if(!count){
    const m=text.match(/もっている数[：:]?\s*([0-9,]+)/);
    if(m)count=m[1];
  }
  const numericCount=/^[0-9,]+$/.test(count)?Number(count.replace(/,/g,'')):count||null;
  return {
    index:i,
    source_selector:source,
    item_id:parseId(el),
    item_name:name||null,
    owned_count:numericCount,
    detail:clean(detailEl?.textContent)||null,
    text,
    href:abs(a?.getAttribute('href')),
    image_url:abs(img?.getAttribute('src')),
    id:el.id||'',
    class_name:el.className||'',
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
for(const sel of selectors){
  [...document.querySelectorAll(sel)].forEach((el,i)=>{
    const r=rowFrom(el,i,sel);
    if(r.text && r.text.length<2500)candidates.push(r);
  });
}
const seen=new Set();
candidates=candidates.filter(r=>{
  const k=(r.item_id||'')+'|'+(r.item_name||'')+'|'+r.text;
  if(seen.has(k))return false; seen.add(k); return true;
});

const likelyItems=candidates.filter(r=>
  r.item_id ||
  r.item_name ||
  /もっている数/.test(r.text)
);

const result={
  version:'jolly-skillball-probe-1.1',
  ok:true,
  collected_at:new Date().toISOString(),
  page_url:location.href,
  title:document.title,
  active_tab:{id:activeTab?.id||null,text:clean(activeTab?.textContent),class_name:activeTab?.className||''},
  counts:{
    candidates:candidates.length,
    likely_items:likelyItems.length
  },
  likely_items:likelyItems,
  candidates:candidates.slice(0,500),
  navbars:[...document.querySelectorAll('.item_navbar')].map(x=>({
    id:x.id||'',text:clean(x.textContent),class_name:x.className||'',html:x.outerHTML.slice(0,1800)
  })),
  pager:[...document.querySelectorAll('.parts_default_page_number,#page_item_default_item_list_nextpage,#page_item_default_item_list_backpage')].map(a=>({
    text:clean(a.textContent),id:a.id||'',class_name:a.className||'',href:abs(a.getAttribute('href')),html:a.outerHTML.slice(0,1800)
  })),
  body_text:clean(document.body?.innerText).slice(0,50000)
};

window.__JOLLY_SKILLBALL_PROBE=result;

function save(){
  const blob=new Blob([JSON.stringify(result,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='jolly_skillball_probe_v11.json';
  document.body.appendChild(a); a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);
}
let old=document.getElementById('jolly-skillball-probe-panel'); if(old)old.remove();
const p=document.createElement('div');
p.id='jolly-skillball-probe-panel';
p.style='position:fixed;z-index:2147483647;right:8px;bottom:8px;background:#111;color:#fff;padding:10px;border-radius:10px;font-size:13px;max-width:90vw;box-shadow:0 2px 12px #0008';
p.innerHTML='<b>技玉 probe v1.1 完了</b><br>候補行: '+candidates.length+'<br>アイテム候補: '+likelyItems.length+'<br><button id="jolly-skillball-save" style="margin-top:7px;padding:7px">JSON保存</button><button id="jolly-skillball-copy" style="margin:7px 0 0 6px;padding:7px">JSONコピー</button>';
document.body.appendChild(p);
document.getElementById('jolly-skillball-save').onclick=save;
document.getElementById('jolly-skillball-copy').onclick=async()=>{
  try{await navigator.clipboard.writeText(JSON.stringify(result,null,2));alert('コピーしました')}
  catch(e){alert('コピー失敗: '+e)}
};
try{completion({ok:true,version:result.version,likely_items:likelyItems.length,message:'右下のJSON保存をタップ'})}catch(e){}
})();
