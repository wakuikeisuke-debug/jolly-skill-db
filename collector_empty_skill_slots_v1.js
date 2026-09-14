(()=>{
const VERSION='jolly-empty-skill-slots-collector-1.0';
const TOTAL_PAGES=24, DELAY=450;
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const abs=(u,b=location.href)=>{try{return new URL(u||'',b).href}catch(e){return u||''}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

let old=document.getElementById('jolly-empty-slot-panel');if(old)old.remove();
const p=document.createElement('div');p.id='jolly-empty-slot-panel';
p.style='position:fixed;z-index:2147483647;left:6px;right:6px;top:6px;background:#111;color:#fff;padding:10px;border-radius:10px;font-size:13px;line-height:1.35;box-shadow:0 2px 14px #000a;max-height:50vh;overflow:auto';
p.innerHTML='<b>空きSKILL SLOT collector</b> <span id="jes-status">起動中</span>'+
'<div style="height:7px;background:#444;border-radius:5px;margin:7px 0"><div id="jes-bar" style="height:7px;width:2%;background:#ddd;border-radius:5px"></div></div>'+
'<div id="jes-summary">初期化中</div><pre id="jes-log" style="white-space:pre-wrap;background:#222;padding:6px;font-size:11px;max-height:18vh;overflow:auto"></pre><div id="jes-buttons"></div>';
(document.body||document.documentElement).appendChild(p);
const $=id=>document.getElementById(id),st=$('jes-status'),bar=$('jes-bar'),sum=$('jes-summary'),logEl=$('jes-log'),btn=$('jes-buttons');
const state={version:VERSION,steps:[],errors:[],warnings:[],result:null};
function log(s,k='INFO'){const x='['+new Date().toLocaleTimeString()+'] '+k+' '+s;state.steps.push(x);logEl.textContent+=(logEl.textContent?'\n':'')+x;logEl.scrollTop=logEl.scrollHeight}
function prog(n,s){bar.style.width=Math.max(2,Math.min(100,n))+'%';st.textContent=s}
function save(o){const b=new Blob([JSON.stringify(o,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='jolly_empty_skill_slots_raw_v1.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}
async function copy(o){try{await navigator.clipboard.writeText(JSON.stringify(o,null,2));alert('コピーしました')}catch(e){log(String(e),'ERROR')}}
function buttons(){btn.innerHTML='';for(const [t,f] of [['JSON保存',()=>save(state.result||state)],['JSONコピー',()=>copy(state.result||state)],['閉じる',()=>p.remove()]]){const b=document.createElement('button');b.textContent=t;b.style='padding:8px;margin:6px 6px 0 0';b.onclick=f;btn.appendChild(b)}}buttons();

function pageUrl(pn){
 const u=new URL(location.href);u.search='';u.searchParams.set('M','Card');u.searchParams.set('A','Default');u.searchParams.set('deck','0');u.searchParams.set('sort','0');u.searchParams.set('property','0');u.searchParams.set('card_cost','0');u.searchParams.set('card_skill','10000');u.searchParams.set('card_name','0');u.searchParams.set('item','0');u.searchParams.set('card_rare','0');u.searchParams.set('card_mark','');u.searchParams.set('p',String(pn));u.hash='';return u.href;
}
function parsePage(html,url,pn){
 const doc=new DOMParser().parseFromString(html,'text/html');
 const rows=[];
 [...doc.querySelectorAll('li')].forEach((li,ri)=>{
   const a=li.querySelector('a[href*="M=Card"][href*="A=Detail"][href*="card="]');
   if(!a)return;
   const blocks=[...li.querySelectorAll('.skillmini_border02')];
   const hasEmpty=blocks.some(b=>clean(b.querySelector('.page_deck_select_card_status_card_skill_name0')?.textContent)==='SKILL SLOT');
   if(!hasEmpty)return;
   const href=abs(a.getAttribute('href'),url), u=new URL(href);
   const instanceId=u.searchParams.get('card');
   const name=clean(li.querySelector('.cardcolor_name')?.textContent);
   const img=li.querySelector('img[src*="/card/120/"]');
   let cardNo=null;if(img){const m=(img.getAttribute('src')||'').match(/\/card\/120\/(\d+)\./);if(m)cardNo=m[1]}
   const skills=blocks.map(b=>({
      name:clean(b.querySelector('.page_deck_select_card_status_card_skill_name0')?.textContent),
      effect:clean(b.querySelector('.page_deck_select_card_status_card_skill_text0')?.textContent)
   })).filter(x=>x.name);
   rows.push({page_index:pn,row_index:ri,instance_id:instanceId,card_no:cardNo,card_name:name||null,empty_skill_slot_count:skills.filter(x=>x.name==='SKILL SLOT').length,current_skills:skills.filter(x=>x.name!=='SKILL SLOT'),detail_url:href,image_url:abs(img?.getAttribute('src'),url)});
 });
 return rows;
}

(async()=>{
try{
 log('起動');
 const pages=[],all=[];
 for(let pn=0;pn<TOTAL_PAGES;pn++){
   prog(5+Math.round(pn/TOTAL_PAGES*82),'取得 '+(pn+1)+'/'+TOTAL_PAGES);
   const url=pageUrl(pn);log('page '+(pn+1)+' fetch');
   try{
     const r=await fetch(url,{credentials:'include',cache:'no-store'});
     if(!r.ok){pages.push({page_index:pn,ok:false,http_status:r.status,row_count:0,url});log('HTTP '+r.status,'WARN');await sleep(DELAY);continue}
     const html=await r.text(),rows=parsePage(html,url,pn);
     pages.push({page_index:pn,ok:true,http_status:r.status,row_count:rows.length,url});all.push(...rows);log('page '+(pn+1)+' '+rows.length+'個体','OK');
   }catch(e){pages.push({page_index:pn,ok:false,http_status:0,row_count:0,url,error:String(e)});state.errors.push({page_index:pn,message:String(e)});log(String(e),'ERROR')}
   await sleep(DELAY);
 }
 prog(91,'監査');
 const ids=all.map(x=>x.instance_id).filter(Boolean),cnt={};ids.forEach(x=>cnt[x]=(cnt[x]||0)+1);
 const dup=Object.entries(cnt).filter(([,n])=>n>1).map(([instance_id,count])=>({instance_id,count}));
 const failed=pages.filter(x=>!x.ok), empty=pages.filter(x=>x.ok&&x.row_count===0);
 const audit_ok=failed.length===0&&empty.length===0&&dup.length===0&&all.every(x=>x.instance_id&&x.card_no&&x.card_name&&x.empty_skill_slot_count>0);
 state.result={version:VERSION,collected_at:new Date().toISOString(),source:{endpoint:'?M=Card&A=Default&card_skill=10000',page_parameter:'p',pages:{first:0,last:23,count:24}},meta:{pages_ok:pages.filter(x=>x.ok).length,instance_count:all.length,unique_instances:new Set(ids).size,card_type_count:new Set(all.map(x=>x.card_no)).size,audit_ok},audit:{failed_pages:failed,empty_pages:empty,duplicate_instance_ids:dup,missing_instance_id:all.filter(x=>!x.instance_id).length,missing_card_no:all.filter(x=>!x.card_no).length,missing_name:all.filter(x=>!x.card_name).length},pages,cards:all,steps:state.steps,errors:state.errors};
 window.__JOLLY_EMPTY_SKILL_SLOTS=state.result;
 sum.innerHTML='<b>完了</b><br>ページ '+state.result.meta.pages_ok+'/'+TOTAL_PAGES+' / 空きスロット個体 '+all.length+' / カード種 '+state.result.meta.card_type_count+'<br>監査: '+(audit_ok?'OK':'REVIEW_REQUIRED');
 prog(100,audit_ok?'完了':'要確認');buttons();log('audit '+(audit_ok?'OK':'REVIEW_REQUIRED'),audit_ok?'OK':'WARN');
 try{completion({ok:audit_ok,version:VERSION,instances:all.length,audit_ok})}catch(e){}
}catch(e){state.errors.push({message:String(e)});log(String(e),'ERROR');sum.textContent='停止: '+String(e);prog(100,'エラー');buttons();try{completion({ok:false,error:String(e)})}catch(_){ }}
})();
})();
