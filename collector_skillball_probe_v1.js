(()=>{
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const abs=u=>{try{return new URL(u||'',location.href).href}catch(e){return u||''}};
const parseId=(el)=>{
  const vals=[
    el?.querySelector('img')?.getAttribute('src')||'',
    el?.querySelector('a')?.getAttribute('href')||'',
    el?.getAttribute('data-item')||'',
    el?.getAttribute('data-id')||''
  ].join(' ');
  let m=vals.match(/\/item\/(?:150|320|640)\/(\d+)\./);
  if(!m)m=vals.match(/[?&](?:item|item_no)=(\d+)/);
  return m?m[1]:null;
};
function rows(){
  return [...document.querySelectorAll('li.design_item_default_item_list')].map((li,i)=>{
    const name=clean(li.querySelector('.design_item_default_item_list_name')?.textContent);
    const countText=clean(li.querySelector('.design_item_default_item_list_count')?.textContent);
    const detail=clean(li.querySelector('.design_item_default_item_list_detail')?.textContent);
    const a=li.querySelector('a');
    const img=li.querySelector('img');
    return {
      index:i,
      item_id:parseId(li),
      item_name:name,
      owned_count:/^\d+$/.test(countText)?Number(countText):countText,
      detail,
      href:abs(a?.getAttribute('href')),
      image_url:abs(img?.getAttribute('src')),
      html:li.outerHTML.slice(0,5000)
    };
  }).filter(x=>x.item_name);
}
function pager(){
  return [...document.querySelectorAll('.parts_default_page_number,#page_item_default_item_list_nextpage,#page_item_default_item_list_backpage')].map((a,i)=>({
    i,
    text:clean(a.textContent),
    id:a.id||'',
    cls:a.className||'',
    href:abs(a.getAttribute('href')),
    html:a.outerHTML.slice(0,1800)
  }));
}
function snapshot(stage){
  return {
    stage,
    at:new Date().toISOString(),
    url:location.href,
    title:document.title,
    navbar:[...document.querySelectorAll('.item_navbar')].map(x=>({id:x.id,text:clean(x.textContent),cls:x.className||'',style:x.getAttribute('style')||''})),
    rows:rows(),
    pager:pager(),
    body_text:clean(document.body?.innerText).slice(0,50000)
  };
}
const before=snapshot('before');
const tab=document.getElementById('item_navbar_skillball');
if(!tab){
  const result={version:'jolly-skillball-probe-1.0',ok:false,error:'item_navbar_skillball not found',before};
  try{completion(result)}catch(e){}
  alert('技玉タブが見つかりません');
  return;
}
tab.click();
setTimeout(()=>{
  const after=snapshot('after_skillball_click');
  const result={
    version:'jolly-skillball-probe-1.0',
    ok:true,
    collected_at:new Date().toISOString(),
    before,
    after,
    diagnostics:{
      before_rows:before.rows.length,
      after_rows:after.rows.length,
      url_changed:before.url!==after.url,
      names_changed:JSON.stringify(before.rows.map(x=>x.item_name))!==JSON.stringify(after.rows.map(x=>x.item_name)),
      skillball_word_count:(after.body_text.match(/技玉/g)||[]).length
    }
  };
  window.__JOLLY_SKILLBALL_PROBE=result;
  function save(){
    const blob=new Blob([JSON.stringify(result,null,2)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='jolly_skillball_probe.json';
    document.body.appendChild(a);a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);
  }
  let old=document.getElementById('jolly-skillball-probe-panel');if(old)old.remove();
  const p=document.createElement('div');
  p.id='jolly-skillball-probe-panel';
  p.style='position:fixed;z-index:2147483647;right:8px;bottom:8px;background:#111;color:#fff;padding:10px;border-radius:10px;font-size:13px;max-width:90vw;box-shadow:0 2px 12px #0008';
  p.innerHTML='<b>技玉 probe 完了</b><br>技玉行: '+after.rows.length+'<br>URL変化: '+result.diagnostics.url_changed+'<br><button id="jolly-skillball-save" style="margin-top:7px;padding:7px">JSON保存</button><button id="jolly-skillball-copy" style="margin:7px 0 0 6px;padding:7px">JSONコピー</button>';
  document.body.appendChild(p);
  document.getElementById('jolly-skillball-save').onclick=save;
  document.getElementById('jolly-skillball-copy').onclick=async()=>{
    try{await navigator.clipboard.writeText(JSON.stringify(result,null,2));alert('コピーしました')}
    catch(e){alert('コピー失敗: '+e)}
  };
  try{completion({ok:true,version:result.version,rows:after.rows.length,url_changed:result.diagnostics.url_changed,message:'右下のJSON保存をタップ'})}catch(e){}
},1500);
})();
