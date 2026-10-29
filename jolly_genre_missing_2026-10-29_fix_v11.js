/*
 * JOLLY 2026-10-29 missing genre evidence v1.1
 * Runs only in the user's signed-in JOLLY page, via GitHub-hosted JS loader.
 * Does not send game content to third-party servers; output is manual JSON save.
 * This is an independent genre collector. It does not alter previous collector state.
 */
(async function () {
  'use strict';
  const VERSION = 'jolly-missing-genre-evidence-2026-10-29-v1.1';
  const KEY = 'jolly_missing_genre_20261029_v11_private_progress';
  const TARGET = {
    '1296':'トレランス','4219':'トリプルウォール','4228':'プラスアームズ',
    '4260':'鋼鉄の要塞','4261':'捕縛の糸','4262':'足縛の粘糸','4263':'蝕む毒液',
    '4264':'鋼糸の壁','4295':'ポイズンスプレー','7086':'スモークカーテン',
    '100132':'蛇の毒池','100133':'蛇神の毒沼','100134':'ダブルストーンボム',
    '100416':'幻煙','100418':'蛇の毒玉','100517':'裏社会の流儀'
  };
  // Validated IDs: do not renumber or infer from display order.
  const CATEGORIES = [
    {id:'1',name:'攻撃系'},{id:'2',name:'回復・支援系'},
    {id:'3',name:'デッキ制御系'},{id:'4',name:'援護系'},
    {id:'5',name:'潜在能力系'},{id:'6',name:'攻撃補助系'},
    {id:'7',name:'仲間系'},{id:'100',name:'防御系'},
    {id:'13',name:'ステータスUP系'},{id:'8',name:'対レイドモンスター系'}
  ];
  const MAX_PAGES_PER_CATEGORY = 300;
  const MAX_TOTAL_PAGES = 1000;
  const DELAY_MS = 80;
  const previous = document.getElementById('jolly-genre-v11-panel');
  if (previous) { previous.remove(); return; }
  if (!/kaizoku-jolly\.com$/i.test(location.hostname)) {
    alert('ジョリーロジャーのログイン済み画面で実行してください。');
    return;
  }
  const fresh = () => ({version:VERSION, started_at:new Date().toISOString(),
    next:{category_index:0,page:0}, pages:[], records:{}, errors:[],
    first_page_fingerprints:{}, finished:false});
  function load() {
    try { const data=JSON.parse(localStorage.getItem(KEY)||'null');
      return data&&data.version===VERSION&&data.next&&data.records?data:fresh();
    } catch (_) { return fresh(); }
  }
  let state=load(), running=false, requestStop=false;
  function persist() { localStorage.setItem(KEY,JSON.stringify(state)); }
  function h(tag, text, parent, css) {
    const e=document.createElement(tag); if(text!==null) e.textContent=text;
    if(css) e.style.cssText=css; parent.appendChild(e); return e;
  }
  const panel=h('div',null,document.body,
    'position:fixed;z-index:2147483647;top:12px;left:9px;right:9px;max-height:47vh;overflow:auto;'+
    'font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;line-height:1.5;'+
    'color:white;background:#141414;padding:14px;border-radius:12px;border:1px solid #777;'+
    'box-shadow:0 3px 24px #0009;box-sizing:border-box');
  panel.id='jolly-genre-v11-panel';
  h('div','JOLLY 新スキル16件・ジャンル根拠収集 v1.1',panel,'font-size:15px;font-weight:700');
  const status=h('div','',panel,'margin:5px 0 8px;color:#d6e8ff;white-space:pre-wrap');
  const bar=h('div',null,panel,'display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px');
  const log=h('pre','',panel,'margin:0;padding:8px;background:#303030;white-space:pre-wrap;'+
    'font-size:11px;max-height:115px;overflow:auto;word-break:break-word');
  const logs=[];
  const notice=(s)=>{logs.push('['+new Date().toLocaleTimeString('ja-JP')+'] '+s);
    log.textContent=logs.slice(-11).join('\n');};
  function b(label, fn) {
    const el=h('button',label,bar,'border:0;border-radius:30px;background:#e8e8e8;'+
      'color:#111;padding:8px 12px;font-size:12px;font-weight:600');
    el.addEventListener('click',fn); return el;
  }
  function update() {
    const c=CATEGORIES[state.next.category_index];
    status.textContent='確定 '+Object.keys(state.records).length+'/16件 / 確認ページ '+state.pages.length+
      ' / 次: '+(c?c.name+' p='+state.next.page:'全分類終了')+
      (running?' / 収集中':' / 停止中')+(state.finished?' / 全分類走査済み':'');
  }
  function urlFor(category, page) {
    const u=new URL('/',location.origin);
    u.searchParams.set('M','Help'); u.searchParams.set('A','SkillSearch');
    u.searchParams.set('skill_kind','0'); u.searchParams.set('SkillType',category.id);
    u.searchParams.set('search',''); u.searchParams.set('page_scroll','1');
    u.searchParams.set('p',String(page));
    return u;
  }
  const norm=(x)=>String(x||'').replace(/&amp;/g,'&');
  function extractIds(doc) {
    const found=new Set();
    // The catalog's canonical rows link to Card/Album?skill_no=ID.
    for (const el of doc.querySelectorAll('a[href], [onclick], [data-url], [data-href]')) {
      for (const v of [el.getAttribute('href'),el.getAttribute('onclick'),
                       el.getAttribute('data-url'),el.getAttribute('data-href')]) {
        if (!v || !/skill_no\s*=/i.test(v)) continue;
        const match=norm(v).match(/(?:\?|&|["'\s])skill_no\s*=\s*(\d+)/i);
        if (match) found.add(match[1]);
      }
    }
    return [...found];
  }
  function pageNavEnd(doc, catId) {
    let max=-1;
    for (const a of doc.querySelectorAll('a[href]')) {
      let u;
      try {u=new URL(norm(a.getAttribute('href')),location.origin);} catch(_){continue;}
      if(u.searchParams.get('M')!=='Help'||u.searchParams.get('A')!=='SkillSearch') continue;
      if(u.searchParams.get('SkillType')!==catId) continue;
      const n=Number(u.searchParams.get('p'));
      if(Number.isSafeInteger(n) && n>=0 && n<MAX_PAGES_PER_CATEGORY) max=Math.max(max,n);
    }
    return max;
  }
  async function readPage(cat,page) {
    const u=urlFor(cat,page);
    const res=await fetch(u.toString(),{credentials:'include',cache:'no-store',redirect:'follow'});
    if(!res.ok) throw new Error('HTTP '+res.status);
    const html=await res.text();
    if(!res.url.includes('SkillSearch')) throw new Error('SkillSearch以外へ遷移（ログイン状態を確認）');
    const doc=new DOMParser().parseFromString(html,'text/html');
    const ids=extractIds(doc);
    const body=doc.body?.textContent||'';
    const isEmpty=/該当する.{0,20}(スキル|データ|情報).{0,20}(ありません|なし)|検索結果.{0,10}(0件|ありません)|該当.{0,10}0件/.test(body);
    const navEnd=pageNavEnd(doc,cat.id);
    // Never accept an unrecognized page as a valid empty category.
    if(!ids.length && !isEmpty) {
      throw new Error('スキル行を認識できません（DOM診断が必要）。取得先='+u.pathname+u.search+
        ' title='+doc.title+' anchors='+doc.querySelectorAll('a[href]').length+
        ' bytes='+html.length);
    }
    if(ids.length>60) throw new Error('1ページのスキル行が多すぎるため停止：'+ids.length);
    return {url:u.toString(),ids,navEnd,isEmpty,bytes:html.length,title:doc.title};
  }
  function exportFile() {
    const matched=Object.values(state.records).sort((a,b)=>Number(a.skill_id)-Number(b.skill_id));
    const payload={version:VERSION,mode:'genre',privacy:'public_master_only_check_before_sharing',
      started_at:state.started_at,collected_at:new Date().toISOString(),
      meta:{finished:state.finished,matched:matched.length,target_count:16,
        processed_pages:state.pages.length,errors:state.errors.length},
      next:state.next,categories:CATEGORIES,
      targets:Object.keys(TARGET).map(id=>({skill_id:id,name:TARGET[id]})),
      records:matched,pages:state.pages,errors:state.errors};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
    const uri=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=uri; a.download='jolly_evidence_genre_2026-10-29_v11.json';
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(uri),45000);
    notice('JSON保存を開始しました。iPhoneの「ファイル」で保存を確認してください。');
  }
  async function run() {
    if(running)return; running=true;requestStop=false;update();
    notice('再開します。取得済みのページと結果は保持します。');
    try {
      while(!requestStop && state.next.category_index<CATEGORIES.length &&
            state.pages.length<MAX_TOTAL_PAGES) {
        const index=state.next.category_index, page=state.next.page, cat=CATEGORIES[index];
        if(page>=MAX_PAGES_PER_CATEGORY) throw new Error('ページ上限に到達');
        const data=await readPage(cat,page);
        if(page===0 && data.ids.length) {
          const fp=data.ids.join(',');
          for(const [prevId,prevFp] of Object.entries(state.first_page_fingerprints)) {
            if(prevId!==cat.id && fp===prevFp && data.ids.length>=5)
              throw new Error('複数の分類で先頭ページが完全一致。SkillTypeフィルタ無効の可能性');
          }
          state.first_page_fingerprints[cat.id]=fp;
        }
        const hits=data.ids.filter(id=>Object.prototype.hasOwnProperty.call(TARGET,id));
        for(const id of hits) {
          const rec=state.records[id];
          if(rec && rec.skill_type!==cat.id)
            throw new Error('スキル '+id+' が別ジャンルと重複：'+rec.skill_type+'/'+cat.id);
          state.records[id]={skill_id:id,name:TARGET[id],skill_type:cat.id,genre:cat.name,
            page,source_url:data.url,source_method:'unsearched_SkillSearch_SkillType_membership'};
        }
        state.pages.push({skill_type:cat.id,genre:cat.name,page,rows:data.ids.length,
          matched_ids:hits,nav_last_page:data.navEnd,source_url:data.url,html_bytes:data.bytes});
        // Pagination links may omit their last page; 10 is the validated page size.
        // When the server supplies no future link, 10 rows means continue; <10 means end.
        let finishedCat = data.isEmpty || data.ids.length<10;
        if(finishedCat){state.next={category_index:index+1,page:0};
          notice(cat.name+' 完了、該当 '+hits.length+'件（最終p='+page+'）');}
        else {state.next={category_index:index,page:page+1};
          if(hits.length)notice(cat.name+' p='+page+'：'+hits.join(','));}
        persist();update();
        await new Promise(resolve=>setTimeout(resolve,DELAY_MS));
      }
      if(state.next.category_index>=CATEGORIES.length) {
        state.finished=true;persist();
        notice('全10分類の走査を終了。'+Object.keys(state.records).length+'/16件。JSONを保存してください。');
      } else if(state.pages.length>=MAX_TOTAL_PAGES) throw new Error('合計ページ上限');
      else notice('一時停止しました。');
    } catch(e) {
      const rec={at:new Date().toISOString(),next:{...state.next},message:String(e.message||e)};
      if(!state.errors.some(x=>x.next.category_index===rec.next.category_index&&x.next.page===rec.next.page&&x.message===rec.message))state.errors.push(rec);
      persist();notice('停止：'+rec.message);notice('診断結果を含むJSONを保存して送ってください。');
    } finally {running=false;update();}
  }
  b('開始／再開',run);
  b('一時停止',()=>{requestStop=true;notice('今のページ終了後に停止します。');});
  b('JSONを保存',exportFile);
  b('閉じる',()=>{requestStop=true;panel.remove();});
  notice('別途取得済みのカード属性JSONには影響しません。');update();
})();
