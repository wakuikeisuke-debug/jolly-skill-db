(()=>{
'use strict';
const VERSION='jolly-official-reincarnation-2026-10-29-v1', CHUNK=16, DELAY=550, MAX_PAGE=90;
const ORIGIN=location.origin; const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const make=(tag,style='',value='')=>{const n=document.createElement(tag);n.style.cssText=style;n.textContent=value;return n;};
const old=document.getElementById('jolly-reincarnation-audit'); if(old)old.remove();
const panel=make('div','position:fixed;z-index:2147483647;top:5px;left:5px;right:5px;max-height:82vh;overflow:auto;background:#111;color:#fff;border:1px solid #888;border-radius:11px;padding:12px;font:13px/1.55 -apple-system,sans-serif;');panel.id='jolly-reincarnation-audit';
const title=make('div','font-size:16px;font-weight:bold','JOLLY 公式転生関係の収集');
const status=make('div','','開始を押してください。ログイン済みの同じSafariタブで実行してください。');
const buttons=make('div','display:flex;gap:8px;flex-wrap:wrap;margin:8px 0');
const progress=make('div','height:7px;background:#555;border-radius:6px;overflow:hidden');const bar=make('div','background:#74cfb0;height:100%;width:0');progress.appendChild(bar);
const logs=make('pre','white-space:pre-wrap;background:#252525;max-height:30vh;overflow:auto;font-size:11px;padding:5px;');
panel.append(title,status,buttons,progress,logs);document.body.appendChild(panel);
let running=false, page=0, chunk=0, lastCache=null, finished=false, startedAt=new Date().toISOString(), emptyStreak=0, everFound=0;
function log(t){logs.textContent+='['+new Date().toLocaleTimeString()+'] '+t+'\n';logs.scrollTop=logs.scrollHeight;}
function button(text,fn){const b=make('button','padding:7px 10px;font-size:14px;touch-action:manipulation',text);b.onclick=fn;buttons.appendChild(b);return b;}
function menu(){buttons.innerHTML='';if(page===0&&!lastCache)button('開始（公式転生一覧）',collect);else{button('今回区間のJSONを保存',save);if(!finished)button('次の区間へ',collect);}button('終了',()=>{if(running){alert('取得中は終了できません');return;}panel.remove();try{completion({closed:true,version:VERSION});}catch(e){}});}
function save(){if(!lastCache){alert('まだ出力がありません');return;}const name='jolly_reincarnation_official_2026-10-29_p'+String(lastCache.start_page).padStart(3,'0')+'-'+String(lastCache.end_page).padStart(3,'0')+'.json';const url=URL.createObjectURL(new Blob([JSON.stringify(lastCache,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},4000);log('保存 '+name);}
function cardImage(src,size){const m=String(src||'').match(new RegExp('/img/card/'+size+'/([0-9]+)\\.(?:jpg|png|webp)','i'));return m?m[1]:'';}
function parse(doc,p,rawurl){
 const list=[...doc.querySelectorAll('img[src]')].map((im,i)=>({im,i,id320:cardImage(im.getAttribute('src')||im.src,320),id120:cardImage(im.getAttribute('src')||im.src,120)})).filter(x=>x.id320||x.id120);
 const pairs=[];let target=null,sourceCount=0,orphanSources=0;
 for(const x of list){
  if(x.id320){target={id:x.id320,img:x.im,ordinal:x.i};sourceCount=0;continue;}
  if(x.id120){if(target && sourceCount===0){pairs.push({page:p,source_card_no:x.id120,target_card_no:target.id,source_image_url:x.im.src,target_image_url:target.img.src,source_context:clean(x.im.closest('li,article,section')?.textContent||x.im.parentElement?.parentElement?.textContent).slice(0,350),page_url:rawurl});sourceCount++;}else orphanSources++;}
 }
 return {pairs,images320:list.filter(x=>x.id320).length,images120:list.filter(x=>x.id120).length,orphanSources,document_title:doc.title};
}
function urlOf(n){const u=new URL('/',ORIGIN);u.search=new URLSearchParams({M:'LimitBreak',A:'List',sort:'13',property:'0',p:String(n)}).toString();return u.toString();}
async function collect(){if(running||finished)return;if(lastCache&&!confirm('前の区間のJSONを保存しましたか？ 保存前ならキャンセルしてください。'))return;running=true;buttons.querySelectorAll('button').forEach(x=>x.disabled=true);const start=page;const ends=Math.min(start+CHUNK-1,MAX_PAGE);let stop=false,success=true,records=[],pages=[],errors=[];
try{for(let p=start;p<=ends;p++){
 status.textContent=`公式転生一覧 p=${p} 取得中`;bar.style.width=((p-start)/CHUNK*100).toFixed(0)+'%';let url=urlOf(p),res=null,html='';
 try{res=await fetch(url,{credentials:'include',cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);html=await res.text();}catch(e){errors.push({page:p,message:String(e)});pages.push({page:p,ok:false});success=false;log('ERROR p='+p+' '+e);break;}
 const doc=new DOMParser().parseFromString(html,'text/html');const out=parse(doc,p,res.url||url);let ok=true;
 if(p===0&&out.images320===0){ok=false;errors.push({page:p,message:'公式転生カード画像(320px)が見つかりません。ログインやDOMを確認してください。'});}
 pages.push({page:p,ok,images320:out.images320,images120:out.images120,pairs:out.pairs.length,orphan_sources:out.orphanSources,url:res.url||url,title:out.document_title,html_bytes:html.length});
 records.push(...out.pairs);log(`p=${p}: 公式320px画像 ${out.images320} / 120px画像 ${out.images120} / 関係 ${out.pairs.length}`);
 if(!ok){success=false;break;}
 if(out.images320===0){emptyStreak++;}else{emptyStreak=0;everFound+=out.pairs.length;}
 if(emptyStreak>=2&&everFound>0){stop=true;log('連続2空ページのため終端と判定');break;}
 await sleep(DELAY);
 }}catch(e){success=false;errors.push({page:page,message:String(e)});log('ERROR '+e);}
 finally{const end=pages.length?pages[pages.length-1].page:start-1;const byPair=new Map();for(const r of records)byPair.set(r.source_card_no+'>'+r.target_card_no,r);const duplicates=records.length-byPair.size;lastCache={version:VERSION,privacy:'public_master_only',started_at:startedAt,collected_at:new Date().toISOString(),start_page:start,end_page:end,chunk_index:chunk,meta:{complete_chunk:success,finished:success&&stop,raw_relations:records.length,unique_relations:byPair.size,duplicate_relations:duplicates,errors:errors.length,empty_streak:emptyStreak,ever_found:everFound},pages,relations:[...byPair.values()],errors};page=end+1;chunk++;finished=success&&stop;running=false;bar.style.width='100%';status.textContent=`p=${start}〜${end} / ${byPair.size}組 / ${finished?'全ページ完了':success?'保存後に次の区間へ':'取得エラーあり・診断保存をお願いします'}`;menu();if(!success)log('成功判定ではありません。診断JSONを保存してください。');}
}
menu();
})();
