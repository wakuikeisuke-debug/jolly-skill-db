(()=>{
const VERSION='jolly-owned-current-skills-delta-12-1.0';
const OUTPUT_NAME='jolly_owned_current_skills_delta_12_v1.json';
const TARGETS=[
  {instance_id:'50292263',card_image_id:'37',card_name:'智慧のオリビア',level:1,level_max:15,master_skill_names:['激励'],known_material:false},
  {instance_id:'50292254',card_image_id:'75',card_name:'マーライオン',level:1,level_max:20,master_skill_names:[],known_material:false},
  {instance_id:'50292253',card_image_id:'33',card_name:'剛強のカイザー',level:1,level_max:15,master_skill_names:['攻戦','【戦】緩和'],known_material:false},
  {instance_id:'50274207',card_image_id:'1536',card_name:'曲技のフィーニャ',level:1,level_max:30,master_skill_names:['疾駆','情熱'],known_material:false},
  {instance_id:'50262729',card_image_id:'106',card_name:'シュリンプ',level:1,level_max:10,master_skill_names:['飛散'],known_material:false},
  {instance_id:'50262726',card_image_id:'9112',card_name:'荒ぶる海賊の霊魂',level:1,level_max:1,master_skill_names:[],known_material:true},
  {instance_id:'50262724',card_image_id:'64',card_name:'海底の怪物アビス・ゼリー',level:1,level_max:10,master_skill_names:['【戦】反射'],known_material:false},
  {instance_id:'50250824',card_image_id:'1910',card_name:'才智のサラサ',level:1,level_max:25,master_skill_names:['マジックストーム','ブーストエリア'],known_material:false},
  {instance_id:'50241906',card_image_id:'9009',card_name:'船長のとくぱん',level:1,level_max:1,master_skill_names:[],known_material:true},
  {instance_id:'50241903',card_image_id:'9111',card_name:'孤独な海賊の霊魂',level:1,level_max:1,master_skill_names:[],known_material:true},
  {instance_id:'50241898',card_image_id:'4',card_name:'ペンギン音楽隊員アドルフ',level:1,level_max:10,master_skill_names:['一心【ペンギン音楽隊員エドガー】'],known_material:false},
  {instance_id:'50217411',card_image_id:'36',card_name:'享楽の魔女スティーナ',level:1,level_max:15,master_skill_names:['不仲【追跡者ビアンカ】','【魔】無効'],known_material:false}
];
const MAX_ATTEMPTS=3;
const BETWEEN_MS=900;
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

let old=document.getElementById('jolly-current-skills-delta12-panel');
if(old)old.remove();
const panel=document.createElement('div');
panel.id='jolly-current-skills-delta12-panel';
panel.style='position:fixed;z-index:2147483647;left:6px;right:6px;top:6px;background:#111;color:#fff;padding:10px;border-radius:10px;font-size:13px;line-height:1.35;box-shadow:0 2px 14px #000a;max-height:64vh;overflow:auto;font-family:-apple-system,BlinkMacSystemFont,sans-serif';
panel.innerHTML='<b>current skill 新規12件取得</b> <span id="jocsd-status">起動中</span>'+
'<div style="height:7px;background:#444;border-radius:5px;margin:7px 0"><div id="jocsd-bar" style="height:7px;width:3%;background:#ddd;border-radius:5px"></div></div>'+
'<div id="jocsd-summary">初期化中</div><pre id="jocsd-log" style="white-space:pre-wrap;background:#222;padding:6px;font-size:11px;max-height:24vh;overflow:auto"></pre><div id="jocsd-buttons"></div>';
(document.body||document.documentElement).appendChild(panel);
const $=id=>document.getElementById(id);
const statusEl=$('jocsd-status'),bar=$('jocsd-bar'),summary=$('jocsd-summary'),logEl=$('jocsd-log'),buttons=$('jocsd-buttons');
const state={version:VERSION,result:null,steps:[],errors:[]};
const rowMap=new Map();

function log(s,k='INFO'){
  const line='['+new Date().toLocaleTimeString()+'] '+k+' '+s;
  state.steps.push(line);
  logEl.textContent+=(logEl.textContent?'\n':'')+line;
  logEl.scrollTop=logEl.scrollHeight;
}
function progress(n,s){bar.style.width=Math.max(3,Math.min(100,n))+'%';statusEl.textContent=s}
function saveResult(result){
  const blob=new Blob([JSON.stringify(result,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download=OUTPUT_NAME;
  document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);
}
function addButton(text,action){
  const b=document.createElement('button');
  b.textContent=text;b.style='padding:10px;margin:8px 8px 0 0;font-weight:600';b.onclick=action;
  buttons.appendChild(b);
}
function closeCollector(){
  panel.remove();
  try{completion({ok:true,version:VERSION})}catch(e){}
}
function parseDetail(html,url,target,response){
  const doc=new DOMParser().parseFromString(html,'text/html');
  const bodyText=clean(doc.body?.textContent);
  const slotEls=[...doc.querySelectorAll('[id^="page_deck_select_master_card_skill_name"]')];
  const slotLabels=slotEls.map(el=>clean(el.textContent)).filter(Boolean);
  const currentSkills=[];
  for(const name of slotLabels){
    if(!name||name==='－'||name==='-'||name==='—'||name==='SKILL SLOT')continue;
    if(!currentSkills.includes(name))currentSkills.push(name);
  }
  const hasSkillSlotDom=slotEls.length>0;
  let classificationHint='resolved';
  if(!hasSkillSlotDom){
    classificationHint=target.known_material&&target.master_skill_names.length===0
      ?'resolved_no_skill_material_candidate'
      :'unresolved_card_detail_dom';
  }
  return {
    instance_id:String(target.instance_id),
    card_no:String(target.card_image_id),
    card_name:target.card_name,
    location:'card_list',
    detail_url:url,
    level:target.level,
    level_max:target.level_max,
    current_skills:currentSkills,
    empty_skill_slot_count:slotLabels.filter(x=>x==='SKILL SLOT').length,
    slot_labels:slotLabels,
    skill_slot_evidence:slotEls.map((el,i)=>({i,id:el.id||'',text:clean(el.textContent),html:el.outerHTML.slice(0,3000)})),
    master_reference:{skill_count:target.master_skill_names.length,skill_names:target.master_skill_names,known_material:target.known_material},
    parse_audit:{
      slot_node_count:slotEls.length,
      has_skill_slot_dom:hasSkillSlotDom,
      page_title:clean(doc.title),
      response_url:response.url||url,
      expected_name_found:bodyText.includes(target.card_name),
      body_text_prefix:bodyText.slice(0,800),
      classification_hint:classificationHint
    }
  };
}
async function fetchOne(target){
  const url='https://yamada.kaizoku-jolly.com/?M=Card&A=Detail&card='+encodeURIComponent(target.instance_id)+'&item=0';
  let lastError='';
  for(let attempt=1;attempt<=MAX_ATTEMPTS;attempt++){
    try{
      const response=await fetch(url,{credentials:'include',cache:'no-store'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const row=parseDetail(await response.text(),url,target,response);
      row.ok=true;row.http_status=response.status;row.fetch_attempts=attempt;
      row.needs_review=row.parse_audit.classification_hint==='unresolved_card_detail_dom';
      return row;
    }catch(e){
      lastError=String(e?.message||e);
      log(target.card_name+' attempt '+attempt+'/'+MAX_ATTEMPTS+' '+lastError,'WARN');
      if(attempt<MAX_ATTEMPTS)await sleep(1500*attempt);
    }
  }
  return {
    instance_id:String(target.instance_id),card_no:String(target.card_image_id),card_name:target.card_name,
    location:'card_list',detail_url:url,ok:false,error:lastError,fetch_attempts:MAX_ATTEMPTS,
    master_reference:{skill_count:target.master_skill_names.length,skill_names:target.master_skill_names,known_material:target.known_material}
  };
}
function buildResult(rows){
  const ok=rows.filter(x=>x.ok).length;
  const failed=rows.filter(x=>!x.ok).length;
  const resolved=rows.filter(x=>x.ok&&x.parse_audit?.classification_hint==='resolved').length;
  const materialNoSkill=rows.filter(x=>x.ok&&x.parse_audit?.classification_hint==='resolved_no_skill_material_candidate').length;
  const unresolved=rows.filter(x=>x.ok&&x.parse_audit?.classification_hint==='unresolved_card_detail_dom').length;
  return {
    version:VERSION,
    collected_at:new Date().toISOString(),
    source_inventory:{filename:'jolly_user_inventory_raw_v2.json',exported_at:'2026-09-16T08:47:12.747Z',total_owned_instances:716,card_list_count:674,stock_count:42},
    target_count:TARGETS.length,
    meta:{ok,failed,resolved,resolved_no_skill_material_candidate:materialNoSkill,unresolved_card_detail_dom:unresolved,audit_ok:failed===0&&unresolved===0},
    cards:rows
  };
}
async function collect(targets){
  buttons.innerHTML='';logEl.textContent='';
  summary.innerHTML='<b>'+targets.length+'件を取得中</b><br>画面を閉じずにお待ちください。';
  for(let i=0;i<targets.length;i++){
    const target=targets[i];
    progress(5+Math.round(i/targets.length*88),(i+1)+'/'+targets.length+' '+target.card_name);
    rowMap.set(String(target.instance_id),await fetchOne(target));
    await sleep(BETWEEN_MS);
  }
  const rows=TARGETS.map(t=>rowMap.get(String(t.instance_id))).filter(Boolean);
  const result=buildResult(rows);
  state.result=result;window.__JOLLY_CURRENT_SKILLS_DELTA12=result;
  progress(100,result.meta.audit_ok?'完了':'要確認');
  summary.innerHTML='<b>取得完了</b><br>成功 '+result.meta.ok+'/'+TARGETS.length+
    ' / 通信失敗 '+result.meta.failed+
    ' / DOM解決 '+result.meta.resolved+
    ' / 素材候補 '+result.meta.resolved_no_skill_material_candidate+
    ' / 未解決 '+result.meta.unresolved_card_detail_dom+
    '<br><b>JSONを保存してアップロードしてください。</b>';
  buttons.innerHTML='';
  addButton('JSON保存',()=>saveResult(result));
  const retryTargets=rows.filter(x=>!x.ok||x.parse_audit?.classification_hint==='unresolved_card_detail_dom')
    .map(x=>TARGETS.find(t=>String(t.instance_id)===String(x.instance_id))).filter(Boolean);
  if(retryTargets.length)addButton('未解決だけ再取得',async()=>{log('未解決 '+retryTargets.length+'件を再取得します');await collect(retryTargets)});
  addButton('閉じる',closeCollector);
}

setTimeout(()=>collect(TARGETS).catch(e=>{
  state.errors.push(String(e?.message||e));log(String(e?.message||e),'ERROR');
  summary.textContent='停止: '+String(e?.message||e);progress(100,'エラー');buttons.innerHTML='';
  addButton('閉じる',closeCollector);
}),100);
})();
