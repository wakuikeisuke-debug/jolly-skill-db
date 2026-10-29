(()=>{
'use strict';
const VERSION='jolly-current-skill-priority-refresh-2026-10-29-v3.1';
const CHUNK=20;
const KEY='jolly_current_skill_priority_oct29_v31_results';
if(!/\b(?:yamada|a)\.kaizoku-jolly\.com$/.test(location.hostname)){
 alert('ジョリーロジャーのログイン画面で実行してください。');try{completion({ok:false,version:VERSION})}catch(e){}return;
}
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let existing=document.getElementById('jolly-priority-skill-v3');if(existing)existing.remove();
const root=document.createElement('div');root.id='jolly-priority-skill-v3';
root.style='position:fixed;z-index:2147483647;top:6px;left:6px;right:6px;max-height:78vh;overflow:auto;background:#111;color:#fff;border-radius:12px;padding:12px;font:13px/1.45 -apple-system,BlinkMacSystemFont,sans-serif;box-shadow:0 2px 12px #0009';
root.innerHTML=`<b>JOLLY 現在技46件・差分再収集 v3</b><div style="margin:7px 0">非公開ターゲットJSONをiPhoneの「ファイル」から選択してください。GitHubへはアップロードしません。</div><input type="file" id="jpc-file" accept=".json,application/json" style="font-size:13px;width:100%;color:#fff"><div id="jpc-sum" style="margin:9px 0">未読込</div><div style="height:7px;border-radius:8px;background:#444"><div id="jpc-bar" style="height:7px;background:#b6e5bd;width:1%;border-radius:8px"></div></div><pre id="jpc-log" style="padding:8px;background:#292929;color:#fff;max-height:27vh;overflow:auto;white-space:pre-wrap"></pre><div id="jpc-buttons" style="display:flex;gap:6px;flex-wrap:wrap"></div>`;
(document.body||document.documentElement).appendChild(root);
const $=id=>document.getElementById(id);
const logEl=$('jpc-log'),sum=$('jpc-sum'),bar=$('jpc-bar'),buttons=$('jpc-buttons');
const state={targets:[],results:[],running:false,fileLoaded:false,started_at:new Date().toISOString(),errors:[],log:[]};
function log(m){const s='['+new Date().toLocaleTimeString()+'] '+m;state.log.push(s);logEl.textContent=(logEl.textContent+'\n'+s).trim();logEl.scrollTop=logEl.scrollHeight}
function remaining(){let done=new Set(state.results.filter(r=>r.ok&&r.parse_audit?.classification_hint==='resolved').map(r=>String(r.instance_id)));return state.targets.filter(t=>!done.has(String(t.instance_id)))}
function status(){let all=state.targets.length,ok=state.results.filter(x=>x.ok&&x.parse_audit?.classification_hint==='resolved').length,err=state.results.filter(x=>!x.ok||x.parse_audit?.classification_hint!=='resolved').length;
 sum.textContent=all?'対象 '+all+'件 / 成功 '+ok+'件 / 未確認 '+(all-ok)+'件 / 要確認ログ '+err+'件':'ターゲットJSONを選択してください';bar.style.width=(all?Math.max(1,Math.min(100,100*ok/all)):1)+'%'}
function persist(){try{localStorage.setItem(KEY,JSON.stringify({version:VERSION,results:state.results,started_at:state.started_at}))}catch(e){log('ローカル保存不可。区間ごとにJSONを保存してください: '+e)}}
function button(text,handler){const b=document.createElement('button');b.textContent=text;b.style='border:1px solid #ddd;border-radius:8px;background:#eee;color:#111;padding:9px;font-weight:600';b.disabled=state.running;b.onclick=handler;buttons.appendChild(b)}
function exportResult(){const good=new Set(state.results.filter(x=>x.ok&&x.parse_audit?.classification_hint==='resolved').map(x=>String(x.instance_id)));const all=state.targets.length;
 return {version:VERSION,mode:'owned_current_skills_priority',privacy:'private_only_do_not_publish',started_at:state.started_at,collected_at:new Date().toISOString(),target_count:all,meta:{processed:state.results.length,ok:good.size,unresolved_or_failed:all-good.size,audit_ok:state.fileLoaded&&all>0&&good.size===all},cards:state.results,errors:state.errors,steps:state.log,source:'user_private_target_json_loaded_locally'};}
function save(){const data=exportResult(),a=document.createElement('a'),u=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.href=u;a.download='jolly_owned_current_skills_oct29_priority_v3.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(u);a.remove()},3000);log('JSON保存を実行しました。ファイルへの保存完了は確認してください')}
function end(){if(state.running)return;root.remove();try{completion({version:VERSION,ok:exportResult().meta.audit_ok})}catch(e){}}
function renderButtons(){buttons.innerHTML='';button('次の20件を収集',nextChunk);button('今回のJSONを保存',save);button('終了',end)}
function parse(html,url,target,response){const doc=new DOMParser().parseFromString(html,'text/html');let body=clean(doc.body?.textContent);
 const slots=[...doc.querySelectorAll('[id^="page_deck_select_master_card_skill_name"]')];const labels=slots.map(x=>clean(x.textContent)).filter(Boolean),skills=[];
 for(const x of labels)if(!['－','-','—','SKILL SLOT'].includes(x)&&!skills.includes(x))skills.push(x);
 const namePresent=body.includes(target.card_name||'__none__'),listPage=body.includes('仲間の海賊たち')&&body.includes('カードリスト')&&body.includes('カードストック');
 let hint='resolved';if(listPage&&!namePresent)hint='redirect_to_list';else if(!slots.length)hint='missing_skill_dom';
 return {instance_id:String(target.instance_id),card_no:String(target.card_no||''),card_name:target.card_name,location:'card_list',detail_url:url,ok:true,http_status:response.status,current_skills:skills,empty_skill_slot_count:labels.filter(x=>x==='SKILL SLOT').length,slot_labels:labels,parse_audit:{slot_node_count:slots.length,expected_name_found:namePresent,list_page_markers:listPage,classification_hint:hint},collected_at:new Date().toISOString()}}
async function fetchOne(t){let url=t.detail_url||('https://yamada.kaizoku-jolly.com/?M=Card&A=Detail&card='+encodeURIComponent(t.instance_id)+'&item=0');let valid=/^https:\/\/(?:yamada|a)\.kaizoku-jolly\.com\/\?M=Card&A=Detail&card=\d+&item=0(?:&.*)?$/;
 if(!valid.test(url))return {instance_id:t.instance_id,ok:false,error:'対象URLが検証済みのカード詳細形式ではありません'};
 let last='';for(let i=1;i<=3;i++){try{const r=await fetch(url,{credentials:'include',cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const row=parse(await r.text(),url,t,r);row.fetch_attempts=i;return row}catch(e){last=String(e?.message||e);if(i<3)await sleep(1100*i)}}return {instance_id:String(t.instance_id),card_no:String(t.card_no||''),card_name:t.card_name,ok:false,error:last,fetch_attempts:3,collected_at:new Date().toISOString()}}
async function nextChunk(){if(state.running)return;if(!state.fileLoaded){log('先に非公開ターゲットJSONを選択してください');return}const todo=remaining();if(!todo.length){log('46件の確認が完了しました。JSONを保存してください');return}
 state.running=true;renderButtons();try{const chunk=todo.slice(0,CHUNK);log('今回 '+chunk.length+'件を取得');for(let i=0;i<chunk.length;i++){let t=chunk[i];let row=await fetchOne(t);let pos=state.results.findIndex(x=>String(x.instance_id)===String(row.instance_id));if(pos>=0)state.results[pos]=row;else state.results.push(row);
 log((i+1)+'/'+chunk.length+' '+t.card_name+' '+(row.ok?row.parse_audit.classification_hint:'ERROR'));status();persist();if(i<chunk.length-1)await sleep(850)}
 log('区間終了。JSONを保存するか、次の20件を収集してください');}
 catch(e){state.errors.push(String(e));log('処理停止 '+e)}finally{state.running=false;renderButtons();status();persist()}}
$('jpc-file').onchange=async e=>{try{const file=e.target.files?.[0];if(!file)return;const json=JSON.parse(await file.text());if(!Array.isArray(json.targets)||json.targets.length!==46||json.target_count!==46)throw Error('2026-10-29用46件のターゲットJSONではありません');
 const ids=new Set();for(const t of json.targets){if(!/^\d+$/.test(String(t.instance_id))||ids.has(String(t.instance_id))||t.location!=='card_list')throw Error('個体IDが重複・不正、またはstockが混入');ids.add(String(t.instance_id))}
 state.targets=json.targets;state.fileLoaded=true;state.results=[];
 try{const stored=JSON.parse(localStorage.getItem(KEY)||'null');if(stored?.version===VERSION&&Array.isArray(stored.results)){state.results=stored.results.filter(r=>ids.has(String(r.instance_id)));if(stored.started_at)state.started_at=stored.started_at;log('前回保存した結果 '+state.results.length+'件を再読込')}}catch(e){log('前回結果の読み込み不可: '+e)}
 log('ターゲット '+state.targets.length+'件の読み込み完了。個体IDはGitHubへ送信されません');status();renderButtons();}
 catch(e){state.errors.push(String(e));log('JSONの確認エラー: '+e);state.fileLoaded=false}}
renderButtons();status();log('準備完了');
})();
