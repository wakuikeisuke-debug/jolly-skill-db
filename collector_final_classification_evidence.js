(() => {
'use strict';
const CARDS=[["1573", "紅闇の針エクテレシィ"], ["1574", "月夜のスナイパー・ショコラ"], ["1575", "糖月のスナイパー・ショコラ"], ["1576", "霊冥の聖女ユスフェミア"], ["1577", "亡竜乗りのシズク"], ["1578", "夜咆竜乗りのシズク"]], SKILLS=[["10731", "フェアリーライト"], ["8066", "キャプテングローリー"], ["7301", "魔科医の往診"], ["7304", "クイックドロウ"], ["4398", "闇の鉄鎖"], ["4245", "セメタリーパーク"], ["4246", "瞬硬の秘法"]], PROPS=[[1, "戦"], [2, "魔"], [3, "飛"], [4, "獣"], [9, "船"]], GENRES=[[1, "攻撃系スキル"], [2, "回復・支援系"], [3, "デッキ制御系"], [4, "援護系"], [5, "潜在能力系"], [6, "攻撃補助系"], [7, "仲間系"], [100, "防御系"], [13, "ステータスUP系"], [8, "対レイドモンスター系"]];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
async function doc(url){
 const r=await fetch(url,{credentials:'include',cache:'no-store'});
 if(!r.ok) throw new Error('HTTP '+r.status);
 return new DOMParser().parseFromString(await r.text(),'text/html');
}
function cardNos(d){
 const s=new Set();
 for(const a of d.querySelectorAll('a[href*="A=AlbumDetail"][href*="card="]')){
  try { const n=new URL(a.href,location.href).searchParams.get('card'); if(n)s.add(n); } catch(_){}
 }
 return [...s];
}
function pageHasSkill(d,id,name){
 const body=clean(d.body?.innerText||'');
 let byId=false;
 for(const a of d.querySelectorAll('a[href*="skill_no="]')){
  try { if(new URL(a.href,location.href).searchParams.get('skill_no')===String(id)) byId=true; }catch(_){}
 }
 return {found:byId || body.includes(name), by_id:byId, by_name:body.includes(name)};
}
let LAST=null;
function show(out){
 LAST=out;
 document.getElementById('jolly-final-evidence')?.remove();
 const x=document.createElement('div'); x.id='jolly-final-evidence';
 x.style.cssText='position:fixed;left:10px;right:10px;bottom:10px;z-index:2147483647;background:#111827;color:#fff;padding:12px;border-radius:14px;font:13px -apple-system,sans-serif;box-shadow:0 8px 30px #0008';
 x.innerHTML=`<b>分類証拠取得完了</b><div style="margin:7px 0">カード確定 ${out.meta.card_resolved}/6 ・ スキル確定 ${out.meta.skill_resolved}/7 ・ エラー ${out.errors.length}</div><button id="jrSave" style="width:100%;padding:10px;border:0;border-radius:9px;font-weight:700">JSON保存</button>`;
 document.body.appendChild(x);
 document.getElementById('jrSave').onclick=async()=>{
  const f=new File([JSON.stringify(LAST,null,2)],'jolly_final_classification_evidence.json',{type:'application/json'});
  if(navigator.canShare&&navigator.canShare({files:[f]})) await navigator.share({files:[f]});
  else {await navigator.clipboard.writeText(JSON.stringify(LAST,null,2));alert('JSONをコピーしました');}
 };
}
async function run(){
 if(!confirm('過去ログで有効性を確認済みの分類元だけを使い、カード属性6件＋スキルジャンル7件を照合します。'))return;
 const out={meta:{version:'jolly-final-classification-evidence-1.0',collected_at:new Date().toISOString(),method:'authoritative-filter-membership'},cards:[],skills:[],errors:[]};

 // Album supports property and card_no filters. 5 classifications x 6 cards; no pagination crawl.
 for(const [id,name] of CARDS){
  const hits=[];
  for(const [pid,pname] of PROPS){
   try{
    const u=`${location.origin}/?M=Card&A=Album&property=${pid}&name_text=&rare=&gacha_style=0&year=0&skill_no=&card_no=${encodeURIComponent(id)}&p=0`;
    const d=await doc(u); const nums=cardNos(d);
    if(nums.includes(String(id))) hits.push({property_id:pid,property:pname,url:u});
   }catch(e){out.errors.push({type:'card_property',id,property_id:pid,error:String(e)});}
   await sleep(500);
  }
  out.cards.push({card_no:id,card_name:name,matches:hits,resolved:hits.length===1,resolution:hits.length===1?hits[0]:null});
 }

 // SkillSearch's own SkillType classifications, using its search field to avoid full category crawls.
 for(const [id,name] of SKILLS){
  const hits=[];
  for(const [gid,gname] of GENRES){
   try{
    const u=`${location.origin}/?M=Help&A=SkillSearch&skill_kind=0&SkillType=${gid}&search=${encodeURIComponent(name)}&page_scroll=1&p=0`;
    const d=await doc(u); const hit=pageHasSkill(d,id,name);
    if(hit.found) hits.push({skill_type:gid,genre:gname,url:u,match:hit});
   }catch(e){out.errors.push({type:'skill_genre',id,skill_type:gid,error:String(e)});}
   await sleep(500);
  }
  out.skills.push({skill_id:id,skill_name:name,matches:hits,resolved:hits.length===1,resolution:hits.length===1?hits[0]:null});
 }
 out.meta.card_resolved=out.cards.filter(x=>x.resolved).length;
 out.meta.skill_resolved=out.skills.filter(x=>x.resolved).length;
 out.meta.error_count=out.errors.length;
 show(out);
 alert(`完了\nカード ${out.meta.card_resolved}/6\nスキル ${out.meta.skill_resolved}/7\nエラー ${out.errors.length}\n画面下のJSON保存をタップしてください。`);
}
run().catch(e=>alert('停止: '+(e?.message||e)));
})();
