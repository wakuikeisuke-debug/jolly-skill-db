(()=>{
'use strict';
// Public script: contains only public card/skill IDs. Do not commit the resulting JSON if logged in.
const VERSION='jolly-missing-evidence-2026-10-29-v1',DELAY=650,CHUNK=25;
const CARDS=['859','1572','1582','1623','2634','2635'];
const SKILLS=['100132','100133','100134','1296','100416','4295','4228','4219','4260','4264','4261','4262','4263','100418','100517','7086'];
const BASE=location.origin,wait=ms=>new Promise(r=>setTimeout(r,ms)),clean=s=>String(s??'').replace(/\s+/g,' ').trim();
const node=(tag,text='',css='')=>{const n=document.createElement(tag);n.textContent=text;n.style.cssText=css;return n;};
let prev=document.getElementById('jolly-evidence-refresh');if(prev)prev.remove();
const panel=node('div','','position:fixed;z-index:2147483647;top:5px;left:5px;right:5px;max-height:82vh;overflow:auto;color:#fff;background:#111;border:1px solid #777;border-radius:12px;padding:12px;font:13px/1.5 -apple-system,sans-serif');panel.id='jolly-evidence-refresh';
const title=node('b','JOLLY 欠落したマスター根拠を収集（実機検証前）');const status=node('div','取得対象を選択してください');const controls=node('div','','display:flex;gap:7px;flex-wrap:wrap;margin:8px 0');const logs=node('pre','','background:#292929;white-space:pre-wrap;max-height:24vh;overflow:auto;font:11px/1.5 monospace;padding:6px');panel.append(title,status,controls,logs);document.body.appendChild(panel);
let mode='',categories=[],idx=0,page=0,chunkNo=0,startedAt='',running=false,cache=null,finished=false,categoryPages=[],errors=[],rawCards=[];
function log(s){logs.textContent+='['+new Date().toLocaleTimeString()+'] '+s+'\n';logs.scrollTop=logs.scrollHeight;}
function add(s,fn){const b=node('button',s,'padding:8px;font-size:13px');b.onclick=fn;controls.appendChild(b);return b;}
function menu(){controls.innerHTML='';if(!mode){add('カード6枚の詳細',()=>start('detail'));add('カード属性・公式分類',()=>start('property'));add('新スキル16件のジャンル',()=>start('genre'));}else{add('今回の区間JSONを保存',save);if(!finished)add('次の区間を収集',crawl);add('別モード',()=>{if(running)return;mode='';cache=null;menu();});}add('閉じる',()=>{if(!running)panel.remove()});}
function save(){if(!cache)return alert('保存するデータがありません');const name=`jolly_evidence_${mode}_2026-10-29_chunk${String(cache.chunk_index).padStart(2,'0')}.json`;const url=URL.createObjectURL(new Blob([JSON.stringify(cache,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);a.remove()},4000);log('保存：'+name);}
async function get(u){const r=await fetch(u,{credentials:'include',cache:'no-store'});if(!r.ok)throw Error(`HTTP ${r.status} ${u}`);const html=await r.text();return {doc:new DOMParser().parseFromString(html,'text/html'),url:r.url||u,bytes:html.length};}
function href(id,property){const u=new URL('/',BASE);u.search=new URLSearchParams({M:'Card',A:'AlbumDetail',card:id,property:property||''}).toString();return u.toString();}
function listingIDs(doc,kind){const out=new Set();const q=kind==='cards'?'a[href*="AlbumDetail"]':'a[href*="skill_no="]';for(const a of doc.querySelectorAll(q)){try{const x=new URL(a.getAttribute('href'),BASE),id=x.searchParams.get(kind==='cards'?'card':'skill_no');if(/^\d+$/.test(id||''))out.add(id);}catch(e){}}return [...out];}
function pageBound(doc,kind){const vals=[];for(const a of doc.querySelectorAll('a[href]'))try{const u=new URL(a.getAttribute('href'),BASE),expectedA=kind==='cards'?'Album':'SkillSearch';if(u.searchParams.get('A')!==expectedA||!u.searchParams.has('p'))continue;const n=Number(u.searchParams.get('p'));if(Number.isInteger(n)&&n>=0)vals.push(n);}catch(e){}return vals.length?Math.max(...vals):null;}
function parseDetail(d,id,u){const scope=d.querySelector('#page_card_detail,.card_detail,article,main,#contents,#content')||d.body;const t=clean(scope?.textContent||'');const imgs=[...scope.querySelectorAll('img[src*="/img/card/"]')].map(x=>x.getAttribute('src')).slice(0,12);const blocks=[...scope.querySelectorAll('h1,h2,h3,h4,h5,dt,dd,li,p,[class*="skill"],[class*="detail"],[class*="status"]')].map(x=>({tag:x.tagName,cls:typeof x.className==='string'?x.className.slice(0,100):'',text:clean(x.textContent).slice(0,1200)})).filter(x=>x.text&&x.text.length<2000).slice(0,240);const anchors=[...scope.querySelectorAll('a[href]')].map(a=>({label:clean(a.textContent).slice(0,80),href:a.getAttribute('href')})).filter(x=>/skill_no=|AlbumDetail|item=/i.test(x.href||'')).slice(0,90);return {card_no:id,url:u,title:d.title,detail_text:t.slice(0,22000),detail_text_length:t.length,card_images:imgs,structured_blocks:blocks,related_links:anchors,detail_scope:scope.tagName+' '+(scope.id||scope.className||''),warning:'ログイン中のページ文字列を含む可能性があります。JSONは非公開で提出。属性はこの詳細だけで判定しない。'};}
async function start(m){if(running)return;mode=m;categories=[];idx=0;page=0;chunkNo=0;cache=null;finished=false;categoryPages=[];errors=[];rawCards=[];startedAt=new Date().toISOString();
if(m==='property'){categories=[{value:'1',label:'戦'},{value:'2',label:'魔'},{value:'3',label:'飛'},{value:'4',label:'獣'},{value:'5',label:'船'}];log('属性フィルタ5分類を順番に確認します');}
if(m==='genre'){
 try{const d=(await get(BASE+'/?'+new URLSearchParams({M:'Help',A:'SkillSearch',skill_kind:'0',SkillType:'',search:'',page_scroll:'1',p:'0'}))).doc;const list=[...d.querySelectorAll('select')].find(x=>/skilltype/i.test(x.name||x.id||''));if(!list)throw Error('SkillTypeのselectが検出できません。DOM診断が必要です');categories=[...list.options].map(o=>({value:String(o.value),label:clean(o.textContent)})).filter(x=>x.value&&x.value!=='0'&&!/全て|すべて|指定なし/i.test(x.label));if(!categories.length)throw Error('ジャンル選択肢が見つかりません');log('ジャンル：'+categories.map(x=>x.value+'='+x.label).join(', '));}
 catch(e){log('ジャンル選択肢取得エラー：'+e);cache={version:VERSION,mode,collected_at:new Date().toISOString(),meta:{errors:1,finished:false},error:String(e),select_diagnostics:'SkillType select not found'};menu();return;}}
await crawl();}
function queryUrl(kind,category,p){const u=new URL('/',BASE);u.search=kind==='property'?new URLSearchParams({M:'Card',A:'Album',property:category.value,p:String(p)}).toString():new URLSearchParams({M:'Help',A:'SkillSearch',skill_kind:'0',SkillType:category.value,search:'',page_scroll:'1',p:String(p)}).toString();return u.href;}
async function crawl(){if(running||!mode||finished)return;if(cache&&!confirm('前の区間のJSONを保存しましたか？'))return;running=true;controls.querySelectorAll('button').forEach(x=>x.disabled=true);let results=[],pages=[],failure=false,attempted=0,startCat=idx,startPage=page;
try{
 if(mode==='detail'){
  for(const id of CARDS){status.textContent='カード詳細 No.'+id;const u=href(id);try{const r=await get(u),row=parseDetail(r.doc,id,r.url);results.push(row);if(row.detail_text_length<100)throw Error('detail body unexpectedly short');log('No.'+id+' 詳細 '+row.detail_text_length+'文字');}catch(e){failure=true;errors.push({card_no:id,error:String(e)});log('エラー：'+e);break;}await wait(DELAY);}
  finished=!failure&&results.length===CARDS.length;
 }else{
  while(idx<categories.length&&attempted<CHUNK){const c=categories[idx],u=queryUrl(mode,c,page),r=await get(u),ids=listingIDs(r.doc,mode==='property'?'cards':'skills');if(page===0){const last=pageBound(r.doc,mode==='property'?'cards':'skills');categoryPages[idx]=last;log(c.label+' 末尾ページ(参考)='+last);}
   const targets=mode==='property'?CARDS:SKILLS;const hits=ids.filter(x=>targets.includes(x));results.push(...hits.map(id=>({id,category_value:c.value,category_label:c.label,page,source_url:r.url})));pages.push({category_value:c.value,category_label:c.label,page,count:ids.length,matched_ids:hits,html_bytes:r.bytes,url:r.url,expected_last_page:categoryPages[idx]});log(c.label+' p='+page+' 総'+ids.length+' / 対象'+hits.join(','));attempted++;
   if(ids.length===0&&page===0)throw Error(c.label+' 分類の1ページ目が0件：フィルタ/ログイン要確認');
   // Never conclude from a single empty page that classification has finished, unless a prior page was populated.
   const final=(categoryPages[idx]!==null&&Number.isInteger(categoryPages[idx])?page>=categoryPages[idx]:ids.length===0);
   if(final){idx++;page=0;}else page++;
   await wait(DELAY);
  }
  finished=idx>=categories.length;
 }
}catch(e){failure=true;errors.push({category:categories[idx]||null,page,error:String(e)});log('取得中断：'+e);}
finally{cache={version:VERSION,mode,privacy:'public_reference_only_but_check_for_login_leaks',started_at:startedAt,collected_at:new Date().toISOString(),chunk_index:chunkNo,meta:{complete_chunk:!failure,finished,errors:errors.length,processed_pages:pages.length,matched:results.length,category_count:categories.length},start:{category_index:startCat,page:startPage},next:{category_index:idx,page},categories,pages,records:results,errors:[...errors]};chunkNo++;running=false;status.textContent=`${mode} ${finished?'全件終了':failure?'エラー：JSON診断保存':'この区間完了'} / 根拠${results.length}件。JSONを保存してください。`;menu();if(failure)log('JSONを保存して送ってください。自動的に成功扱いしません');}
}
menu();
})();
