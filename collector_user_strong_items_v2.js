(()=>{
const VERSION='jolly-strong-items-click-collector-1.0';
const MAX_PAGES=20, WAIT_MS=12000;
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const abs=u=>{try{return new URL(u||'',location.href).href}catch(e){return u||''}};

let old=document.getElementById('jolly-strong-click-panel');if(old)old.remove();
const p=document.createElement('div');p.id='jolly-strong-click-panel';
p.style='position:fixed;z-index:2147483647;left:6px;right:6px;top:6px;background:#111;color:#fff;padding:10px;border-radius:10px;font-size:13px;line-height:1.35;box-shadow:0 2px 14px #000a;max-height:52vh;overflow:auto;font-family:-apple-system,BlinkMacSystemFont,sans-serif';
p.innerHTML='<div style="display:flex;justify-content:space-between;gap:8px"><b>強化アイテム全件collector</b><span id="jscc-status">起動中</span></div>'+
'<div style="height:7px;background:#444;border-radius:5px;margin:7px 0"><div id="jscc-bar" style="height:7px;width:3%;background:#ddd;border-radius:5px"></div></div>'+
'<div id="jscc-summary">初期化中</div><pre id="jscc-log" style="white-space:pre-wrap;margin:6px 0 0;font-size:11px;max-height:20vh;overflow:auto;background:#222;padding:6px;border-radius:6px"></pre><div id="jscc-buttons" style="margin-top:7px"></div>';
(document.body||document.documentElement).appendChild(p);
const $=id=>document.getElementById(id),st=$('jscc-status'),bar=$('jscc-bar'),sum=$('jscc-summary'),logEl=$('jscc-log'),btn=$('jscc-buttons');
const state={version:VERSION,steps:[],warnings:[],errors:[],result:null};
function log(s,k='INFO'){const x='['+new Date().toLocaleTimeString()+'] '+k+' '+s;state.steps.push(x);logEl.textContent+=(logEl.textContent?'\n':'')+x;logEl.scrollTop=logEl.scrollHeight}
function prog(n,s){bar.style.width=Math.max(3,Math.min(100,n))+'%';st.textContent=s}
function save(o){const b=new Blob([JSON.stringify(o,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='jolly_user_strong_items_raw_v2.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1200)}
async function copy(o){try{await navigator.clipboard.writeText(JSON.stringify(o,null,2));alert('JSONをコピーしました')}catch(e){log(String(e),'ERROR')}}
function buttons(){btn.innerHTML='';for(const [t,f] of [['JSON保存',()=>save(state.result||state)],['JSONコピー',()=>copy(state.result||state)],['閉じる',()=>p.remove()]]){const b=document.createElement('button');b.textContent=t;b.style='padding:8px;margin-right:6px';b.onclick=f;btn.appendChild(b)}}buttons();

function parseCurrent(pageIndex){
 const rows=[...document.querySelectorAll('li.design_item_default_item_list')].map((li,ri)=>{
   const a=li.querySelector('a.design_item_default_item_list_link')||li.querySelector('a');
   const href=abs(a?.getAttribute('href')), img=li.querySelector('img.design_item_default_item_list_img')||li.querySelector('img');
   const m=(href+' '+(img?.getAttribute('src')||'')).match(/(?:[?&]item=|\/item\/150\/)(\d+)/);
   const name=clean(li.querySelector('.design_item_default_item_list_name')?.textContent);
   const countTxt=clean(li.querySelector('.design_item_default_item_list_item_count_text .design_item_default_item_list_count')?.textContent||li.querySelector('.design_item_default_item_list_count')?.textContent);
   const detail=clean(li.querySelector('.design_item_default_item_list_detail')?.textContent);
   return {page_index:pageIndex,row_index:ri,item_id:m?m[1]:null,item_name:name||null,owned_count:/^[0-9,]+$/.test(countTxt)?Number(countTxt.replace(/,/g,'')):null,detail:detail||null,href,image_url:abs(img?.getAttribute('src'))};
 });
 return rows;
}
function sig(rows){return rows.map(x=>(x.item_id||'')+'|'+(x.item_name||'')).join('||')}
function nextButton(){return document.getElementById('page_item_default_item_list_nextpage')||document.querySelector('.parts_default_page_nextpage')}
function isVisible(el){if(!el)return false;const cs=getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden'&&el.getClientRects().length>0}
async function waitChanged(prev){
 const t=Date.now();
 while(Date.now()-t<WAIT_MS){
   await sleep(180);
   const rows=parseCurrent(-1), s=sig(rows);
   if(rows.length && s && s!==prev)return rows;
 }
 throw new Error('ページ切替を確認できませんでした（'+WAIT_MS+'ms）');
}

(async()=>{
try{
 log('起動');prog(5,'前提確認');
 const active=[...document.querySelectorAll('.item_navbar')].find(x=>!String(x.className||'').includes('grayscale_50'));
 if(active?.id!=='item_navbar_strong_item')throw new Error('「強化」タブを手動で開いてから実行してください。現在='+clean(active?.textContent||'不明'));
 log('強化タブ確認 OK','OK');

 const pages=[], all=[], seenSigs=new Set();
 for(let pi=0;pi<MAX_PAGES;pi++){
   prog(8+Math.round(pi/MAX_PAGES*75),'収集 '+(pi+1)+'ページ目');
   const rows=parseCurrent(pi), s=sig(rows);
   if(!rows.length)throw new Error('現在ページのアイテム行が0件です');
   if(seenSigs.has(s)){log('既出ページを検出して停止','WARN');break}
   seenSigs.add(s); all.push(...rows);
   const nb=nextButton();
   pages.push({page_index:pi,row_count:rows.length,signature:s.slice(0,180),next_visible:isVisible(nb)});
   log('page '+(pi+1)+' '+rows.length+'件','OK');
   if(!isVisible(nb)){log('NEXT非表示。最終ページと判定','OK');break}
   const prev=s;
   try{
     nb.click();
     log('NEXT click');
     await waitChanged(prev);
   }catch(e){
     state.errors.push({page_index:pi,message:String(e?.message||e)});
     log(String(e?.message||e),'ERROR');
     break;
   }
 }
 prog(88,'監査');
 const ids=all.map(x=>x.item_id).filter(Boolean), cnt={};ids.forEach(x=>cnt[x]=(cnt[x]||0)+1);
 const dup=Object.entries(cnt).filter(([,n])=>n>1).map(([item_id,count])=>({item_id,count}));
 const audit={
   missing_item_id:all.filter(x=>!x.item_id).length,
   missing_item_name:all.filter(x=>!x.item_name).length,
   missing_owned_count:all.filter(x=>x.owned_count===null).length,
   duplicate_item_ids:dup,
   navigation_errors:state.errors
 };
 const last=pages[pages.length-1], endedByLastPage=!!last && last.next_visible===false;
 const audit_ok=all.length>0&&audit.missing_item_id===0&&audit.missing_item_name===0&&audit.missing_owned_count===0&&dup.length===0&&state.errors.length===0&&endedByLastPage;
 state.result={version:VERSION,collected_at:new Date().toISOString(),source:{page_url:location.href,tab:'強化',navigation:'client-side NEXT click because pagination anchors have no href'},meta:{pages_collected:pages.length,row_count:all.length,unique_item_ids:new Set(ids).size,total_owned:all.reduce((s,x)=>s+(x.owned_count||0),0),audit_ok},audit,pages,items:all,steps:state.steps,warnings:state.warnings,errors:state.errors};
 window.__JOLLY_STRONG_ITEMS_V2=state.result;
 sum.innerHTML='<b>完了</b><br>ページ '+pages.length+' / アイテム '+all.length+'種 / 所有合計 '+state.result.meta.total_owned+'<br>監査: '+(audit_ok?'OK':'REVIEW_REQUIRED');
 prog(100,audit_ok?'完了':'要確認');buttons();log('audit '+(audit_ok?'OK':'REVIEW_REQUIRED'),audit_ok?'OK':'WARN');
 try{completion({ok:audit_ok,version:VERSION,pages:pages.length,rows:all.length,audit_ok})}catch(e){}
}catch(e){
 state.errors.push({message:String(e?.message||e),stack:String(e?.stack||'')});log(String(e?.message||e),'ERROR');sum.textContent='停止: '+String(e?.message||e);prog(100,'エラー');buttons();try{completion({ok:false,error:String(e?.message||e)})}catch(_){}
}
})();
})();
