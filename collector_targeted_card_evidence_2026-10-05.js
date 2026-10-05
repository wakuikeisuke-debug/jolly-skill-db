(() => {
'use strict';
const VERSION='jolly-targeted-card-evidence-2026-10-05-v1';
const OUT='jolly_targeted_card_evidence_2026-10-05.json';
const TARGETS=[{"card_no":"208","card_name":"戦女帝アドリアナ","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=AlbumDetail&card=208&property=&p=15&name_text=&rare=&gacha_style=0&year=0"},{"card_no":"429","card_name":"風狸","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=AlbumDetail&card=429&property=&p=28&name_text=&rare=&gacha_style=0&year=0"},{"card_no":"1158","card_name":"木枯らしの風狸","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=AlbumDetail&card=1158&property=&p=70&name_text=&rare=&gacha_style=0&year=0"},{"card_no":"1532","card_name":"操蝶のレテノール","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=AlbumDetail&card=1532&property=&p=99&name_text=&rare=&gacha_style=0&year=0"},{"card_no":"1583","card_name":"天馬の騎士アルフレッド","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=AlbumDetail&card=1583&property=&p=102&name_text=&rare=&gacha_style=0&year=0"},{"card_no":"1590","card_name":"蝶律のレテノール","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=AlbumDetail&card=1590&property=&p=103&name_text=&rare=&gacha_style=0&year=0"},{"card_no":"1591","card_name":"聖馬の騎将アルフレッド","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=AlbumDetail&card=1591&property=&p=103&name_text=&rare=&gacha_style=0&year=0"},{"card_no":"1714","card_name":"【神格】戦女帝アドリアナ","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=AlbumDetail&card=1714&property=&p=105&name_text=&rare=&gacha_style=0&year=0"},{"card_no":"1715","card_name":"【魔格】戦女帝アドリアナ","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=AlbumDetail&card=1715&property=&p=105&name_text=&rare=&gacha_style=0&year=0"},{"card_no":"1797","card_name":"【神格】氷夏の呪術師テマリ","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=AlbumDetail&card=1797&property=&p=105&name_text=&rare=&gacha_style=0&year=0"},{"card_no":"1798","card_name":"【魔格】氷夏の呪術師テマリ","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=AlbumDetail&card=1798&property=&p=105&name_text=&rare=&gacha_style=0&year=0"}];
const PROPERTY={1:'戦',2:'魔',3:'飛',4:'獣'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
let RESULT={meta:{version:VERSION,started_at:new Date().toISOString(),target_count:TARGETS.length},cards:[],property_evidence:[],reincarnation:{relations:[],pages:[],errors:[]},errors:[],warnings:[]};
function panel(){
 document.getElementById('jr-targeted-card-panel')?.remove();
 const d=document.createElement('div');d.id='jr-targeted-card-panel';
 d.style.cssText='position:fixed;left:8px;right:8px;bottom:8px;z-index:2147483647;background:#111827;color:white;padding:12px;border-radius:14px;font:13px -apple-system,sans-serif;box-shadow:0 8px 30px #0008;max-height:75vh;overflow:auto';
 d.innerHTML=`<b>JOLLY カード詳細証跡 2026-10-05</b><div id="jrts" style="margin:8px 0;background:#1f2937;padding:8px;border-radius:9px">準備完了</div><div id="jrtl" style="font-size:11px;white-space:pre-wrap;max-height:180px;overflow:auto"></div><button id="jrgo">取得開始</button><button id="jrsave" style="display:none">JSON保存</button>`;
 const st=document.createElement('style');st.textContent='#jr-targeted-card-panel button{border:0;border-radius:9px;padding:10px;margin-right:6px;font:inherit;font-weight:700}';document.documentElement.appendChild(st);document.body.appendChild(d);
 document.getElementById('jrgo').onclick=()=>run();
 document.getElementById('jrsave').onclick=()=>save();
}
function status(s){const e=document.getElementById('jrts');if(e)e.textContent=s;}
function log(s){const e=document.getElementById('jrtl');if(e){e.textContent+=(e.textContent?'\n':'')+s;e.scrollTop=e.scrollHeight;}}
async function fetchDoc(url){
 const r=await fetch(url,{credentials:'include',cache:'no-store',redirect:'follow'});
 const html=await r.text();
 if(!r.ok)throw new Error('HTTP '+r.status+' '+url);
 if(/ログイン情報入力|module=auth|auth001/.test(html))throw new Error('LOGIN_REQUIRED '+url);
 if(/quota has been exceeded/i.test(html))throw new Error('QUOTA_EXCEEDED '+url);
 return {doc:new DOMParser().parseFromString(html,'text/html'),html,final_url:r.url};
}
function pageIdentity(doc,kind,id){
 const body=clean(doc.body?.innerText||doc.body?.textContent||'');
 if(!body)return false;
 if(kind==='detail') return body.includes(id)||[...doc.querySelectorAll('img[src]')].some(i=>new RegExp('/card/(?:640|320|120)/'+id+'(?:\\.|$)').test(i.src));
 if(kind==='album') return true;
 if(kind==='limit') return body.includes('転生')||[...doc.querySelectorAll('img[src*="/img/card/320/"]')].length>0;
 return true;
}
function cardEvidence(doc,t,finalUrl){
 const body=clean(doc.body?.innerText||doc.body?.textContent||'');
 const imgs=[...doc.querySelectorAll('img[src]')].map(i=>i.src).filter(Boolean);
 const links=[...doc.querySelectorAll('a[href]')].map(a=>({href:new URL(a.getAttribute('href'),finalUrl).href,text:clean(a.textContent)})).filter(x=>/skill_no=|AlbumDetail|LimitBreak/.test(x.href));
 const image=imgs.find(x=>new RegExp('/card/(?:640|320|120)/'+t.card_no+'(?:\\.|$)').test(x))||'';
 function pair(label){const m=body.match(new RegExp(label+'\\s*([0-9]+)\\s*[~～]\\s*([0-9]+)'));return m?{min:+m[1],max:+m[2]}:null;}
 const rarity=(body.match(/\[(Legend|Ultra Rare|Super Rare|High Rare|Rare|Normal)\]/)||[])[1]||'';
 const gender=(body.match(/性別\s*([男女？?])/ )||[])[1]||'';
 const cost=(body.match(/コスト\s*([0-9.]+)/)||[])[1]||'';
 return {card_no:t.card_no,manifest_card_name:t.card_name,final_url:finalUrl,image_url:image,rarity,gender,cost:cost?Number(cost):null,hp:pair('体力'),attack:pair('攻撃'),speed:pair('速さ'),relevant_links:links,body_text:body};
}
function propertyUrl(cardNo,p){
 const u=new URL(location.origin+'/');u.searchParams.set('M','Card');u.searchParams.set('A','Album');u.searchParams.set('property',String(p));u.searchParams.set('name_text','');u.searchParams.set('rare','');u.searchParams.set('gacha_style','0');u.searchParams.set('year','0');u.searchParams.set('skill_no','');u.searchParams.set('card_no',String(cardNo));u.searchParams.set('p','0');return u.href;
}
function detectMembership(doc,cardNo){
 return [...doc.querySelectorAll('a[href*="A=AlbumDetail"][href*="card="]')].some(a=>{try{return new URL(a.href,location.href).searchParams.get('card')===String(cardNo)}catch(e){return false}});
}
function imgCardId(src,size){const m=String(src||'').match(new RegExp('/img/card/'+size+'/([0-9]+)\\.'));return m?m[1]:null;}
function nearbyText(img){const box=img.closest('.ui-bar-c,.ui-body,.ui-content,li,tr,div')||img.parentElement;return clean(box?.innerText||box?.textContent||'').slice(0,1200);}
function parseLimitRelations(doc,page,url){
 const imgs=[...doc.querySelectorAll('img[src]')],rels=[];
 for(let i=0;i<imgs.length;i++){
  const target=imgCardId(imgs[i].src,'320');if(!target)continue;
  let srcImg=null;
  for(let j=i+1;j<imgs.length;j++){
   if(imgCardId(imgs[j].src,'320'))break;
   if(imgCardId(imgs[j].src,'120')){srcImg=imgs[j];break;}
  }
  if(!srcImg)continue;
  const source=imgCardId(srcImg.src,'120');
  rels.push({page,source_card_no:source,target_card_no:target,source_image_url:srcImg.src,target_image_url:imgs[i].src,source_context:nearbyText(srcImg),target_context:nearbyText(imgs[i]),page_url:url});
 }
 return rels;
}
async function save(){
 const txt=JSON.stringify(RESULT,null,2),f=new File([txt],OUT,{type:'application/json'});
 if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f]});return;}catch(e){}}
 await navigator.clipboard.writeText(txt);alert('JSON共有できなかったため全文をコピーしました');
}
async function run(){
 document.getElementById('jrgo').disabled=true;
 try{
  RESULT.meta.started_at=new Date().toISOString();
  for(let i=0;i<TARGETS.length;i++){
   const t=TARGETS[i];status(`カード詳細 ${i+1}/${TARGETS.length}: ${t.card_name}`);
   try{
    const u=new URL(location.origin+'/');u.searchParams.set('M','Card');u.searchParams.set('A','AlbumDetail');u.searchParams.set('card',t.card_no);
    const x=await fetchDoc(u.href);if(!pageIdentity(x.doc,'detail',t.card_no))throw new Error('DETAIL_IDENTITY_FAILED '+t.card_no);
    RESULT.cards.push(cardEvidence(x.doc,t,x.final_url));log('detail OK '+t.card_no);
   }catch(e){RESULT.errors.push({stage:'card_detail',card_no:t.card_no,error:String(e)});log('detail ERROR '+t.card_no+' '+e);}
   await sleep(500);
  }
  for(let i=0;i<TARGETS.length;i++){
   const t=TARGETS[i],matches=[];
   for(let p=1;p<=4;p++){
    status(`属性判定 ${i+1}/${TARGETS.length} / ${PROPERTY[p]}`);
    try{const u=propertyUrl(t.card_no,p),x=await fetchDoc(u);if(!pageIdentity(x.doc,'album'))throw new Error('ALBUM_IDENTITY_FAILED');if(detectMembership(x.doc,t.card_no))matches.push({property_id:p,property:PROPERTY[p],url:u});}
    catch(e){RESULT.errors.push({stage:'property',card_no:t.card_no,property_id:p,error:String(e)});}
    await sleep(500);
   }
   RESULT.property_evidence.push({card_no:t.card_no,card_name:t.card_name,matches,resolved:matches.length===1,resolution:matches.length===1?matches[0]:null});
  }
  let empty=0;
  for(let p=0;p<80;p++){
   status(`転生公式一覧 ${p+1}ページ目`);
   const u=new URL(location.origin+'/');u.searchParams.set('M','LimitBreak');u.searchParams.set('A','List');u.searchParams.set('sort','13');u.searchParams.set('property','0');if(p)u.searchParams.set('p',String(p));
   try{
    const x=await fetchDoc(u.href);if(!pageIdentity(x.doc,'limit')){if(p===0)throw new Error('LIMITBREAK_IDENTITY_FAILED');}
    const rel=parseLimitRelations(x.doc,p,u.href);RESULT.reincarnation.pages.push({page:p,url:u.href,relation_count:rel.length});
    if(rel.length){RESULT.reincarnation.relations.push(...rel);empty=0;} else empty++;
    if(empty>=2)break;
   }catch(e){RESULT.reincarnation.errors.push({page:p,url:u.href,error:String(e)});if(p===0)throw e;empty++;if(empty>=2)break;}
   await sleep(500);
  }
  const uniq=new Map();for(const r of RESULT.reincarnation.relations)uniq.set(r.source_card_no+'>'+r.target_card_no,r);RESULT.reincarnation.relations=[...uniq.values()];
  RESULT.meta.card_saved_count=RESULT.cards.length;RESULT.meta.property_resolved_count=RESULT.property_evidence.filter(x=>x.resolved).length;
  RESULT.meta.reincarnation_relation_count=RESULT.reincarnation.relations.length;RESULT.meta.reincarnation_page_count=RESULT.reincarnation.pages.length;
  RESULT.meta.error_count=RESULT.errors.length+RESULT.reincarnation.errors.length;RESULT.meta.finished=true;RESULT.meta.finished_at=new Date().toISOString();
  if(RESULT.reincarnation.relations.length<308)RESULT.warnings.push('REINCARNATION_RELATION_COUNT_BELOW_PREVIOUS_308');
  status(`完了: detail ${RESULT.cards.length}/11 / 属性 ${RESULT.meta.property_resolved_count}/11 / 転生 ${RESULT.reincarnation.relations.length}件 / errors ${RESULT.meta.error_count}`);
  document.getElementById('jrsave').style.display='inline-block';
 }catch(e){RESULT.errors.push({stage:'fatal',error:String(e)});status('停止: '+e);document.getElementById('jrsave').style.display='inline-block';}
}
panel();
})();
