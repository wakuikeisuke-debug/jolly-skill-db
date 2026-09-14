(()=>{
const VERSION='jolly-user-skillballs-collector-1.0';
const TOTAL_PAGES=21;
const DELAY_MS=450;
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const abs=(u,base=location.href)=>{try{return new URL(u||'',base).href}catch(e){return u||''}};

// ---------- visible diagnostics panel first ----------
let old=document.getElementById('jolly-skillball-collector-panel'); if(old) old.remove();
const p=document.createElement('div');
p.id='jolly-skillball-collector-panel';
p.style='position:fixed;z-index:2147483647;left:6px;right:6px;top:6px;background:#111;color:#fff;padding:10px;border-radius:10px;font-size:13px;line-height:1.35;box-shadow:0 2px 14px #000a;max-height:48vh;overflow:auto;font-family:-apple-system,BlinkMacSystemFont,sans-serif';
p.innerHTML=
 '<div style="display:flex;justify-content:space-between;gap:8px"><b>技玉 全件collector v1.0</b><span id="jsc-status">起動中</span></div>'+
 '<div style="height:7px;background:#444;border-radius:5px;margin:7px 0"><div id="jsc-bar" style="height:7px;width:2%;background:#ddd;border-radius:5px"></div></div>'+
 '<div id="jsc-summary">初期化中</div>'+
 '<pre id="jsc-log" style="white-space:pre-wrap;margin:6px 0 0;font-size:11px;max-height:19vh;overflow:auto;background:#222;padding:6px;border-radius:6px"></pre>'+
 '<div id="jsc-buttons" style="margin-top:7px"></div>';
(document.body||document.documentElement).appendChild(p);

const $=id=>document.getElementById(id);
const statusEl=$('jsc-status'), barEl=$('jsc-bar'), summaryEl=$('jsc-summary'), logEl=$('jsc-log'), btnEl=$('jsc-buttons');
const state={version:VERSION,started_at:new Date().toISOString(),steps:[],warnings:[],errors:[],result:null};

function prog(n,s){barEl.style.width=Math.max(2,Math.min(100,n))+'%'; statusEl.textContent=s}
function log(s,k='INFO'){
  const x='['+new Date().toLocaleTimeString()+'] '+k+' '+s;
  state.steps.push(x); logEl.textContent+=(logEl.textContent?'\n':'')+x; logEl.scrollTop=logEl.scrollHeight;
}
function warn(s){state.warnings.push(s);log(s,'WARN')}
function fail(e,where='main'){
  state.errors.push({where,message:String(e?.message||e),stack:String(e?.stack||'')});
  log(where+': '+String(e?.message||e),'ERROR');
}
function download(obj){
  try{
    const b=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(b); a.download='jolly_user_skillballs_raw_v1.json';
    document.body.appendChild(a); a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1200);
    log('JSON保存処理を開始','OK');
  }catch(e){fail(e,'download')}
}
async function copy(obj){
  try{await navigator.clipboard.writeText(JSON.stringify(obj,null,2)); alert('JSONをコピーしました');log('JSONコピー完了','OK')}
  catch(e){fail(e,'copy')}
}
function buttons(){
  btnEl.innerHTML='';
  const defs=[
    ['JSON保存',()=>download(state.result||state)],
    ['JSONコピー',()=>copy(state.result||state)],
    ['閉じる',()=>p.remove()]
  ];
  for(const [t,f] of defs){const b=document.createElement('button');b.textContent=t;b.style='padding:8px;margin-right:6px';b.onclick=f;btnEl.appendChild(b)}
}
buttons();

function paramsFromHref(href){
  try{
    const u=new URL(href,location.href);
    const g=k=>u.searchParams.get(k);
    const num=k=>{const v=g(k);return v===null?null:Number(v)};
    return {
      no:g('no'),
      property:num('property'),
      card_lv:num('card_lv'),
      card_rare:num('card_rare'),
      card_sex:num('card_sex'),
      skill_group:num('skill_group'),
      card_character:num('card_character')
    };
  }catch(e){return {no:null,property:null,card_lv:null,card_rare:null,card_sex:null,skill_group:null,card_character:null}}
}
function propertyName(v){return ({1:'戦',2:'魔',3:'飛',4:'獣'})[v]||null}

function parseRow(li,pageIndex,rowIndex,baseUrl){
  const a=li.querySelector('a[href*="ItemSkillCardList"]')||li.querySelector('a');
  const href=abs(a?.getAttribute('href'),baseUrl);
  const prm=paramsFromHref(href);
  const blue=[...li.querySelectorAll('span')].find(s=>{
    const c=(s.getAttribute('style')||'').replace(/\s/g,'').toLowerCase();
    return c.includes('color:#0033cc')||c.includes('color:rgb(0,51,204)');
  });
  const name=clean(blue?.textContent)||null;
  const countEl=li.querySelector('.textcolor_red');
  let owned=countEl?Number(clean(countEl.textContent).replace(/,/g,'')):null;
  if(!Number.isFinite(owned)){
    const m=clean(li.textContent).match(/もっている数[：:]?\s*([0-9,]+)/);
    owned=m?Number(m[1].replace(/,/g,'')):null;
  }
  const detailEl=li.querySelector('.lineheight1_1_white')||li.querySelector('.ui-li-desc');
  const effect=clean(detailEl?.textContent)||null;
  const img=li.querySelector('img');
  const tokens=name?[...name.matchAll(/【([^】]+)】/g)].map(m=>m[1]):[];
  return {
    page_index:pageIndex,
    row_index:rowIndex,
    skillball_no:prm.no,
    display_name:name,
    owned_count:Number.isFinite(owned)?owned:null,
    effect_text:effect,
    install_constraints_structured:{
      min_rarity:prm.card_rare||null,
      property_id:prm.property||null,
      property:propertyName(prm.property),
      card_sex:prm.card_sex||0,
      card_character:prm.card_character||0,
      card_lv:prm.card_lv||0
    },
    skill_group:prm.skill_group,
    bracket_tokens_raw:tokens,
    source_url:href,
    image_url:abs(img?.getAttribute('src'),baseUrl),
    source_selector:'li.design_item_default_trump_list'
  };
}
function parsePage(html,url,pageIndex){
  const doc=new DOMParser().parseFromString(html,'text/html');
  const rows=[...doc.querySelectorAll('li.design_item_default_trump_list')];
  return {
    rows:rows.map((li,i)=>parseRow(li,pageIndex,i,url)),
    title:doc.title||'',
    hasNext:[...doc.querySelectorAll('a')].some(a=>clean(a.textContent)==='NEXT'),
    body_text:clean(doc.body?.innerText).slice(0,3000)
  };
}
function makeUrl(pageno){
  const u=new URL(location.href);
  u.searchParams.set('M','Item');
  u.searchParams.set('A','Skill');
  const defaults={skill:'0',property:'0',rare:'0',sex:'0',card:'0',card_no:'0',rare_flg:'0',exclusive:'0'};
  for(const [k,v] of Object.entries(defaults))u.searchParams.set(k,v);
  u.searchParams.set('p',String(pageno));
  u.hash='';
  return u.href;
}

(async()=>{
try{
  log('collector起動');
  prog(5,'前提確認');
  const nav=[...document.querySelectorAll('.item_navbar')];
  const active=nav.find(x=>!String(x.className||'').includes('grayscale_50'));
  if(active?.id!=='item_navbar_skillball') throw new Error('技玉タブを手動で開いてから実行してください。現在='+clean(active?.textContent||'不明'));
  log('技玉タブ確認 OK','OK');

  const pages=[], all=[];
  for(let pi=0;pi<TOTAL_PAGES;pi++){
    prog(8+Math.round((pi/TOTAL_PAGES)*78),'取得 '+(pi+1)+'/'+TOTAL_PAGES);
    const url=makeUrl(pi);
    log('page '+(pi+1)+' fetch');
    let res;
    try{
      res=await fetch(url,{credentials:'include',cache:'no-store'});
    }catch(e){
      fail(e,'fetch page '+(pi+1));
      pages.push({page_index:pi,url,http_status:0,ok:false,row_count:0,error:String(e?.message||e)});
      await sleep(DELAY_MS);
      continue;
    }
    if(!res.ok){
      warn('page '+(pi+1)+' HTTP '+res.status);
      pages.push({page_index:pi,url,http_status:res.status,ok:false,row_count:0});
      await sleep(DELAY_MS);
      continue;
    }
    const html=await res.text();
    let parsed;
    try{parsed=parsePage(html,url,pi)}
    catch(e){fail(e,'parse page '+(pi+1));pages.push({page_index:pi,url,http_status:res.status,ok:false,row_count:0,error:String(e?.message||e)});await sleep(DELAY_MS);continue}
    pages.push({page_index:pi,url,http_status:res.status,ok:true,row_count:parsed.rows.length,has_next:parsed.hasNext});
    all.push(...parsed.rows);
    log('page '+(pi+1)+' '+parsed.rows.length+'件','OK');
    await sleep(DELAY_MS);
  }

  prog(89,'監査');
  const ids=all.map(x=>x.skillball_no).filter(Boolean);
  const idCounts={}; ids.forEach(x=>idCounts[x]=(idCounts[x]||0)+1);
  const duplicateIds=Object.entries(idCounts).filter(([,n])=>n>1).map(([id,n])=>({skillball_no:id,count:n}));
  const missingIds=all.filter(x=>!x.skillball_no).length;
  const missingNames=all.filter(x=>!x.display_name).length;
  const failedPages=pages.filter(x=>!x.ok);
  const emptyPages=pages.filter(x=>x.ok&&x.row_count===0);
  const finished=failedPages.length===0 && pages.length===TOTAL_PAGES;
  const audit_ok=finished && missingIds===0 && missingNames===0 && duplicateIds.length===0 && emptyPages.length===0;

  state.result={
    version:VERSION,
    collected_at:new Date().toISOString(),
    source:{
      page_url:location.href,
      endpoint:'?M=Item&A=Skill',
      page_parameter:'p',
      page_range:{first:0,last:TOTAL_PAGES-1,count:TOTAL_PAGES},
      row_selector:'li.design_item_default_trump_list',
      detail_link:'?M=Card&A=ItemSkillCardList&no=...'
    },
    meta:{
      pages_expected:TOTAL_PAGES,
      pages_fetched:pages.length,
      pages_ok:pages.filter(x=>x.ok).length,
      row_count:all.length,
      unique_skillball_no:new Set(ids).size,
      total_owned_copies:all.reduce((s,x)=>s+(Number(x.owned_count)||0),0),
      finished,
      audit_ok
    },
    audit:{
      failed_pages:failedPages,
      empty_pages:emptyPages,
      missing_skillball_no:missingIds,
      missing_display_name:missingNames,
      duplicate_skillball_no:duplicateIds
    },
    pages,
    skillballs:all,
    warnings:state.warnings,
    errors:state.errors,
    steps:state.steps
  };
  window.__JOLLY_USER_SKILLBALLS=state.result;
  summaryEl.innerHTML='<b>完了</b><br>ページ '+state.result.meta.pages_ok+'/'+TOTAL_PAGES+
    ' / 技玉 '+all.length+'種 / 所有合計 '+state.result.meta.total_owned_copies+
    '<br>監査: '+(audit_ok?'OK':'REVIEW_REQUIRED');
  prog(100,audit_ok?'完了':'要確認');
  buttons();
  log('全件取得終了 / audit '+(audit_ok?'OK':'REVIEW_REQUIRED'),audit_ok?'OK':'WARN');
  try{completion({ok:audit_ok,version:VERSION,pages:pages.length,rows:all.length,audit_ok})}catch(e){}
}catch(e){
  fail(e,'main');
  summaryEl.textContent='停止: '+String(e?.message||e);
  prog(100,'エラー');buttons();
  try{completion({ok:false,version:VERSION,error:String(e?.message||e)})}catch(_){}
}
})();
})();
