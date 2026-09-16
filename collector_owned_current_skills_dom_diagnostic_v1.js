javascript:(()=>{
const VERSION='jolly-owned-current-skills-dom-diagnostic-1.0';
const TARGETS=[
  {instance_id:'49530833',card_no:'1531',card_name:'風魔のレラ',expected_skills:['カウンターショット','ウィンドブリード']},
  {instance_id:'49104650',card_no:'2555',card_name:'ナツキ・スバル',expected_skills:['インビジブル・プロヴィデンス','共鳴ミーニャ【ベアトリス】','記憶の継承','仲間への鼓舞']}
];
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let old=document.getElementById('jolly-dom-diagnostic');if(old)old.remove();
const panel=document.createElement('div');panel.id='jolly-dom-diagnostic';
panel.style='position:fixed;z-index:2147483647;left:6px;right:6px;top:6px;background:#111;color:#fff;padding:10px;border-radius:10px;font-size:13px;max-height:70vh;overflow:auto;font-family:-apple-system,BlinkMacSystemFont,sans-serif';
panel.innerHTML='<b>current skill DOM診断</b><div id="jdd-status">開始</div><pre id="jdd-log" style="white-space:pre-wrap;background:#222;padding:7px;font-size:11px"></pre><div id="jdd-buttons"></div>';
(document.body||document.documentElement).appendChild(panel);
const status=document.getElementById('jdd-status'),log=document.getElementById('jdd-log'),buttons=document.getElementById('jdd-buttons');
const result={version:VERSION,collected_at:null,cards:[],errors:[]};
function note(s){log.textContent+=(log.textContent?'\n':'')+s}
function scrub(el){const clone=el.cloneNode(true);clone.querySelectorAll('script,style,input,textarea,select,option').forEach(x=>x.remove());clone.querySelectorAll('*').forEach(x=>{[...x.attributes].forEach(a=>{if(/^(href|src|action|value|onclick|data-.*token)/i.test(a.name))x.removeAttribute(a.name)})});return clone.outerHTML.slice(0,4000)}
function save(){const b=new Blob([JSON.stringify(result,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='jolly_owned_current_skills_dom_diagnostic_v1.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1200)}
function showButtons(){buttons.innerHTML='';const s=document.createElement('button');s.textContent='診断JSON保存';s.style='padding:10px;margin:8px 8px 0 0';s.onclick=save;buttons.appendChild(s);const c=document.createElement('button');c.textContent='閉じる';c.style='padding:10px;margin-top:8px';c.onclick=()=>{panel.remove();try{completion({ok:true,version:VERSION})}catch(e){}};buttons.appendChild(c)}
(async()=>{try{
 for(let ti=0;ti<TARGETS.length;ti++){
  const t=TARGETS[ti];status.textContent=(ti+1)+'/'+TARGETS.length+' '+t.card_name;note('取得: '+t.card_name);
  const url='https://yamada.kaizoku-jolly.com/?M=Card&A=Detail&card='+encodeURIComponent(t.instance_id)+'&item=0';
  try{
   const response=await fetch(url,{credentials:'include',cache:'no-store'});const html=await response.text();const doc=new DOMParser().parseFromString(html,'text/html');
   const primary=[...doc.querySelectorAll('[id^="page_deck_select_master_card_skill_name"]')];
   const candidates=[...doc.querySelectorAll('[id*="skill" i],[class*="skill" i]')].slice(0,160).map((el,i)=>({i,tag:el.tagName,id:el.id||'',class_name:String(el.className||'').slice(0,240),text:clean(el.textContent).slice(0,500),html:scrub(el)}));
   const expected_hits=t.expected_skills.map(name=>({name,body_text_found:clean(doc.body?.textContent).includes(name)}));
   result.cards.push({instance_id:t.instance_id,card_no:t.card_no,card_name:t.card_name,http_status:response.status,page_title:clean(doc.title),primary_slot_count:primary.length,primary_slot_texts:primary.map(x=>clean(x.textContent)),expected_hits,candidate_nodes:candidates,body_text_prefix:clean(doc.body?.textContent).slice(0,1200)});
  }catch(e){result.errors.push({instance_id:t.instance_id,card_name:t.card_name,error:String(e?.message||e)});note('ERROR '+String(e?.message||e))}
  await sleep(700);
 }
 result.collected_at=new Date().toISOString();status.textContent='完了';note('保存してアップロードしてください');showButtons();
}catch(e){result.errors.push({error:String(e?.message||e)});status.textContent='停止';note(String(e?.message||e));showButtons()}})();
})();
