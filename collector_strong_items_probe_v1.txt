(()=>{
const VERSION='jolly-strong-items-collector-0.9-validated-probe';
const PAGES=5, DELAY=450;
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const abs=(u,b=location.href)=>{try{return new URL(u||'',b).href}catch(e){return u||''}};

let old=document.getElementById('jolly-strong-items-panel'); if(old) old.remove();
const p=document.createElement('div');
p.id='jolly-strong-items-panel';
p.style='position:fixed;z-index:2147483647;left:6px;right:6px;top:6px;background:#111;color:#fff;padding:10px;border-radius:10px;font-size:13px;line-height:1.35;box-shadow:0 2px 14px #000a;max-height:50vh;overflow:auto;font-family:-apple-system,BlinkMacSystemFont,sans-serif';
p.innerHTML='<div style="display:flex;justify-content:space-between"><b>強化アイテム collector</b><span id="jsi-status">起動中</span></div>'+
'<div style="height:7px;background:#444;border-radius:5px;margin:7px 0"><div id="jsi-bar" style="height:7px;width:2%;background:#ddd;border-radius:5px"></div></div>'+
'<div id="jsi-summary">初期化中</div><pre id="jsi-log" style="white-space:pre-wrap;margin:6px 0 0;font-size:11px;max-height:20vh;overflow:auto;background:#222;padding:6px;border-radius:6px"></pre><div id="jsi-buttons" style="margin-top:7px"></div>';
(document.body||document.documentElement).appendChild(p);
const $=id=>document.getElementById(id), st=$('jsi-status'), bar=$('jsi-bar'), sum=$('jsi-summary'), logEl=$('jsi-log'), btn=$('jsi-buttons');
const state={version:VERSION,steps:[],errors:[],warnings:[],result:null};
function prog(n,s){bar.style.width=Math.max(2,Math.min(100,n))+'%';st.textContent=s}
function log(s,k='INFO'){const x='['+new Date().toLocaleTimeString()+'] '+k+' '+s;state.steps.push(x);logEl.textContent+=(logEl.textContent?'\n':'')+x;logEl.scrollTop=logEl.scrollHeight}
function err(e,w){state.errors.push({where:w,message:String(e?.message||e)});log(w+': '+String(e?.message||e),'ERROR')}
function save(obj){const b=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='jolly_user_strong_items_raw_v1.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}
async function copy(obj){try{await navigator.clipboard.writeText(JSON.stringify(obj,null,2));alert('JSONをコピーしました')}catch(e){err(e,'copy')}}
function buttons(){btn.innerHTML='';for(const [t,f] of [['JSON保存',()=>save(state.result||state)],['JSONコピー',()=>copy(state.result||state)],['閉じる',()=>p.remove()]]){const b=document.createElement('button');b.textContent=t;b.style='padding:8px;margin-right:6px';b.onclick=f;btn.appendChild(b)}}
buttons();

function makeUrl(i){
  const u=new URL(location.href);
  u.searchParams.set('M','Item');
  u.searchParams.set('type','2');
  u.searchParams.set('p',String(i));
  u.hash=''; return u.href;
}
function parseItemId(el){
  const s=[el.querySelector('a')?.getAttribute('href')||'',el.querySelector('img')?.getAttribute('src')||''].join(' ');
  let m=s.match(/[?&]item=(\d+)/); if(!m)m=s.match(/\/item\/(?:60|100|150|320|640)\/(\d+)\./); return m?m[1]:null;
}
function parsePage(html,url,pi){
  const doc=new DOMParser().parseFromString(html,'text/html');
  const rows=[...doc.querySelectorAll('li.design_item_default_item_list')].map((li,ri)=>{
    const name=clean(li.querySelector('.design_item_default_item_list_name')?.textContent);
    const ct=clean(li.querySelector('.design_item_default_item_list_count')?.textContent);
    const detail=clean(li.querySelector('.design_item_default_item_list_detail')?.textContent);
    return {page_index:pi,row_index:ri,item_id:parseItemId(li),item_name:name||null,owned_count:/^[0-9,]+$/.test(ct)?Number(ct.replace(/,/g,'')):null,detail:detail||null,href:abs(li.querySelector('a')?.getAttribute('href'),url),image_url:abs(li.querySelector('img')?.getAttribute('src'),url)};
  });
  return {rows, title:doc.title||'', body:clean(doc.body?.innerText).slice(0,1000)};
}

(async()=>{
try{
 log('起動'); prog(5,'前提確認');
 const active=[...document.querySelectorAll('.item_navbar')].find(x=>!String(x.className||'').includes('grayscale_50'));
 if(active?.id!=='item_navbar_strong_item') throw new Error('「強化」タブを手動で開いてから実行してください。現在='+clean(active?.textContent||'不明'));
 log('強化タブ確認 OK','OK');

 const pages=[],items=[],pageSignatures=[];
 for(let i=0;i<PAGES;i++){
   prog(10+Math.round(i/PAGES*70),'取得 '+(i+1)+'/'+PAGES);
   const url=makeUrl(i); log('page '+(i+1)+' fetch');
   try{
     const r=await fetch(url,{credentials:'include',cache:'no-store'});
     if(!r.ok){pages.push({page_index:i,url,http_status:r.status,ok:false,row_count:0});log('HTTP '+r.status,'WARN');await sleep(DELAY);continue}
     const html=await r.text(), parsed=parsePage(html,url,i);
     const sig=parsed.rows.map(x=>x.item_id+'|'+x.item_name).join('||');
     pageSignatures.push(sig);
     pages.push({page_index:i,url,http_status:r.status,ok:true,row_count:parsed.rows.length});
     items.push(...parsed.rows); log('page '+(i+1)+' '+parsed.rows.length+'件','OK');
   }catch(e){err(e,'page '+(i+1));pages.push({page_index:i,url,http_status:0,ok:false,row_count:0})}
   await sleep(DELAY);
 }
 prog(86,'監査');
 const ids=items.map(x=>x.item_id).filter(Boolean), counts={};ids.forEach(x=>counts[x]=(counts[x]||0)+1);
 const dup=Object.entries(counts).filter(([,n])=>n>1).map(([item_id,count])=>({item_id,count}));
 const repeatedPages=[];
 for(let i=0;i<pageSignatures.length;i++)for(let j=i+1;j<pageSignatures.length;j++)if(pageSignatures[i]&&pageSignatures[i]===pageSignatures[j])repeatedPages.push([i,j]);
 const audit={
   failed_pages:pages.filter(x=>!x.ok),
   empty_pages:pages.filter(x=>x.ok&&x.row_count===0),
   missing_item_id:items.filter(x=>!x.item_id).length,
   missing_item_name:items.filter(x=>!x.item_name).length,
   duplicate_item_ids:dup,
   repeated_page_signatures:repeatedPages
 };
 const audit_ok=audit.failed_pages.length===0&&audit.empty_pages.length===0&&audit.missing_item_id===0&&audit.missing_item_name===0&&dup.length===0&&repeatedPages.length===0;
 state.result={version:VERSION,collected_at:new Date().toISOString(),source:{endpoint:'?M=Item&type=2',page_parameter:'p',pages_attempted:PAGES,row_selector:'li.design_item_default_item_list'},meta:{pages_ok:pages.filter(x=>x.ok).length,row_count:items.length,unique_item_ids:new Set(ids).size,total_owned:items.reduce((s,x)=>s+(x.owned_count||0),0),audit_ok},audit,pages,items,steps:state.steps,errors:state.errors};
 window.__JOLLY_STRONG_ITEMS=state.result;
 sum.innerHTML='<b>完了</b><br>ページ '+state.result.meta.pages_ok+'/'+PAGES+' / アイテム '+items.length+'種<br>監査: '+(audit_ok?'OK':'REVIEW_REQUIRED');
 prog(100,audit_ok?'完了':'要確認');buttons();log('audit '+(audit_ok?'OK':'REVIEW_REQUIRED'),audit_ok?'OK':'WARN');
 try{completion({ok:audit_ok,version:VERSION,rows:items.length,audit_ok})}catch(e){}
}catch(e){err(e,'main');sum.textContent='停止: '+String(e?.message||e);prog(100,'エラー');buttons();try{completion({ok:false,error:String(e?.message||e)})}catch(_){ }}
})();
})();
