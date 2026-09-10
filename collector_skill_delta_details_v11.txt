(() => {
'use strict';

const VERSION = "jolly-skill-delta-details-1.0";
const TARGETS = [{"skill_id":"10731","skill_name_hint":"","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=Album&skill_no=10731","probe_observed_text":"フェアリーライト 妖精女王の聖なる力で身を守り、敵からの攻撃を100％反射し、異常状態にもかからない。[ダメージ無効:自分][反攻][異常ガード:自分]","probe_changed_fields":[],"probe_before":null,"probe_after":null,"reasons":["new"]},{"skill_id":"1125","skill_name_hint":"","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=Album&skill_no=1125","probe_observed_text":"ゴーストラップ 前線に来る敵を亡霊たちが待ち構える。毎ターン最初に行動した敵の【海賊】は、発動者の攻撃力分のダメージを受ける。[バトル開始時発動][倒れるまで有効][攻撃]","probe_changed_fields":[],"probe_before":null,"probe_after":null,"reasons":["new"]},{"skill_id":"2411","skill_name_hint":"","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=Album&skill_no=2411","probe_observed_text":"グルーヴィショット 華麗な銃さばきで的確に射貫き、【前列-中列】の生き残っている敵の中からランダムで、4倍の攻撃力で６回攻撃する。[攻撃][攻撃アップ:自分]","probe_changed_fields":[],"probe_before":null,"probe_after":null,"reasons":["new"]},{"skill_id":"101403","skill_name_hint":"","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=Album&skill_no=101403","probe_observed_text":"魔の血界術 血の世界を生み出し、味方の【海賊】全ての最大体力を、それぞれのコスト×1500引き上げる。(最小1500上昇)[バトル開始時発動][バトル終了まで有効][体力アップ:味方]","probe_changed_fields":[],"probe_before":null,"probe_after":null,"reasons":["new"]},{"skill_id":"10744","skill_name_hint":"","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=Album&skill_no=10744","probe_observed_text":"ベノムカウンター 【前列】で攻撃を受けた場合、反撃する。さらに攻撃してきた相手を「ベノム」と「瀕死」状態にする。[カウンター][異常付加]","probe_changed_fields":[],"probe_before":null,"probe_after":null,"reasons":["new"]},{"skill_id":"10745","skill_name_hint":"","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=Album&skill_no=10745","probe_observed_text":"ペインカウンター 【前列】で攻撃を受けた場合、ダメージを99％軟化し反撃する。さらに攻撃してきた相手を「ベノム」と「瀕死」状態にする。[カウンター][ダメージ軟化:敵][異常付加]","probe_changed_fields":[],"probe_before":null,"probe_after":null,"reasons":["new"]},{"skill_id":"8066","skill_name_hint":"","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=Album&skill_no=8066","probe_observed_text":"キャプテングローリー 夢と憧れを大きな力に変える。攻撃時、【敵・味方】全ての【ニャッカ船長】の攻撃力の合計の200％分だけ自分の攻撃力が上がり、さらにスキル「天眼」の効果を発動する。[攻撃アップ:自分][対防御]","probe_changed_fields":[],"probe_before":null,"probe_after":null,"reasons":["new"]},{"skill_id":"1299","skill_name_hint":"","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=Album&skill_no=1299","probe_observed_text":"妖医の往診 前列で最初に行動する味方にお供して治療を行い、味方の【海賊】全てを発動者の最大体力分回復する。その回復は、味方の最大体力を超えていく。（味方の最大体力の3倍がMAX）[バトル開始時発動][倒れるまで有効][体力回復:味方]","probe_changed_fields":[],"probe_before":null,"probe_after":null,"reasons":["new"]},{"skill_id":"7301","skill_name_hint":"","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=Album&skill_no=7301","probe_observed_text":"魔科医の往診 前列で最初に行動する味方にお供して治療を行い、味方の【海賊】全てを発動者の最大体力分回復する。その回復は、味方の最大体力を超えていく。（味方の最大体力の5倍がMAX）[バトル開始時発動][倒れるまで有効][体力回復:味方]","probe_changed_fields":[],"probe_before":null,"probe_after":null,"reasons":["new"]},{"skill_id":"7302","skill_name_hint":"","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=Album&skill_no=7302","probe_observed_text":"モータルパレード 死に向かう獣たちの行進。味方前列の【獣】の攻撃力を発動者の現体力の200%分上げる。力の代償として味方の全ての【獣】にバトル開始時に「呪い」をかける。[バトル開始時発動][倒れるまで有効][攻撃アップ:味方][異常付加]","probe_changed_fields":[],"probe_before":null,"probe_after":null,"reasons":["new"]},{"skill_id":"7303","skill_name_hint":"","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=Album&skill_no=7303","probe_observed_text":"ライブリーパレード 力強き獣たちの行進。味方前列の【獣】の攻撃力を、発動者の現体力の300%分上げる。さらに「奇魂」を伝授する。(レイドモンスターの防御系スキルは無効にできない)[バトル開始時発動][倒れるまで有効][攻撃アップ:味方][スキル付与:味方]","probe_changed_fields":[],"probe_before":null,"probe_after":null,"reasons":["new"]},{"skill_id":"7304","skill_name_hint":"","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=Album&skill_no=7304","probe_observed_text":"クイックドロウ 超速の曲撃ちで支援し、【前一列】の味方の攻撃力を上げる。(発動者の速さ分上昇。前列の味方が【疾風のラカム】の場合、効果6倍)[バトル開始時発動][倒れるまで有効][攻撃アップ:味方]","probe_changed_fields":[],"probe_before":null,"probe_after":null,"reasons":["new"]},{"skill_id":"7087","skill_name_hint":"","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=Album&skill_no=7087","probe_observed_text":"金の麻酔針 注射器の薬が無くなるまで(現在レベル÷40回まで)身を守り、【海賊】からの攻撃のダメージが届かない。さらに、攻撃してきた敵を「睡眠」させる。(最小1回、最大10回発動)","probe_changed_fields":[],"probe_before":null,"probe_after":null,"reasons":["new"]},{"skill_id":"4398","skill_name_hint":"","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=Album&skill_no=4398","probe_observed_text":"闇の鉄鎖 【後列】にいるとき強力な魔力の鎖で敵を搦め捕り、敵【前列】の【戦・獣】を行動不可能にする。[バトル開始時発動][倒れるまで有効][行動封じ][行動封じ]","probe_changed_fields":[],"probe_before":null,"probe_after":null,"reasons":["new"]},{"skill_id":"4244","skill_name_hint":"","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=Album&skill_no=4244","probe_observed_text":"グレイブヤード 足を踏み入れた者を土の下に誘う。敵の【戦・獣】の中からランダムで4体の体力を、発動者の攻撃力分減少させる。(敵の体力は0以下にはならない)[バトル開始時発動][1戦闘1回][敵体力ダウン]","probe_changed_fields":[],"probe_before":null,"probe_after":null,"reasons":["new"]},{"skill_id":"4245","skill_name_hint":"","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=Album&skill_no=4245","probe_observed_text":"セメタリーパーク 足を踏み入れた者を墓の中に引きずり込む。敵の【戦・獣】の中からランダムで4体の体力を、発動者の攻撃力の400%分減少させる。(敵の体力は0以下にはならない)[バトル開始時発動][1戦闘1回][敵体力ダウン]","probe_changed_fields":[],"probe_before":null,"probe_after":null,"reasons":["new"]},{"skill_id":"4246","skill_name_hint":"","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=Album&skill_no=4246","probe_observed_text":"瞬硬の秘法 瞬間的に肉体の強度を増す幻の薬で、2ターン目まで、味方の【海賊】全員が受けるダメージを軽減する。(発動者の今の体力分軽減。レイドモンスター戦は発動しない)[バトル開始時発動][倒れるまで有効][ダメージ軽減:味方]","probe_changed_fields":[],"probe_before":null,"probe_after":null,"reasons":["new"]}];
const OUTPUT_NAME = 'jolly_delta_skill_details.json';
const WAIT_MS = 500;

const sleep = ms => new Promise(r => setTimeout(r, ms));
const clean = s => (s || '').replace(/\s+/g, ' ').trim();
const abs = u => {
  try { return new URL(u, location.href).href; } catch (_) { return u || ''; }
};

function parsePage(html, target, finalUrl) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const text = clean(doc.body?.innerText || '');
  const title = clean(doc.title || '');

  // Preserve raw page evidence in structured form rather than guessing the site's schema.
  const links = [...doc.querySelectorAll('a[href]')].map(a => ({
    text: clean(a.innerText),
    href: abs(a.getAttribute('href'))
  })).filter(x => x.text || x.href);

  const cardLinks = links.filter(x =>
    /(?:M=Card|Card)/i.test(x.href) &&
    /(?:card_no|no=|A=Detail|A=Album)/i.test(x.href)
  );

  const bracketTokens = [...new Set(
    (target.probe_observed_text || '').match(/\[[^\]]+\]/g) || []
  )];

  let observedName = target.skill_name_hint || '';
  let observedEffect = target.probe_observed_text || '';
  if (observedName && observedEffect.startsWith(observedName)) {
    observedEffect = clean(observedEffect.slice(observedName.length));
  }

  return {
    skill_id: target.skill_id,
    skill_name_hint: target.skill_name_hint || '',
    reasons: target.reasons || [],
    requested_url: target.detail_url,
    final_url: finalUrl,
    page_title: title,
    page_text: text,
    probe_observed_text: target.probe_observed_text || '',
    probe_effect_with_tags: observedEffect,
    probe_bracket_tokens: bracketTokens,
    probe_changed_fields: target.probe_changed_fields || [],
    probe_before: target.probe_before ?? null,
    probe_after: target.probe_after ?? null,
    card_links: cardLinks,
    all_link_count: links.length
  };
}

async function fetchOne(target) {
  const r = await fetch(target.detail_url, { credentials: 'include', cache: 'no-store' });
  const html = await r.text();
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  if (/ログイン|login/i.test(html) && !/ログアウト|logout/i.test(html)) {
    throw new Error('LOGIN_REQUIRED');
  }
  return parsePage(html, target, r.url || target.detail_url);
}

let LAST_EXPORT = null;

function showExportPanel(obj) {
  LAST_EXPORT = obj;

  document.getElementById('jolly_skill_delta_export_panel')?.remove();

  const panel = document.createElement('div');
  panel.id = 'jolly_skill_delta_export_panel';
  panel.style.cssText = [
    'position:fixed',
    'left:10px',
    'right:10px',
    'bottom:10px',
    'z-index:2147483647',
    'background:#111827',
    'color:#fff',
    'padding:12px',
    'border-radius:14px',
    'font-family:-apple-system,BlinkMacSystemFont,sans-serif',
    'font-size:13px',
    'box-shadow:0 8px 30px #0008'
  ].join(';');

  panel.innerHTML = `
    <div style="font-weight:700;margin-bottom:8px">
      スキル差分詳細の取得完了
    </div>
    <div style="margin-bottom:10px;line-height:1.5">
      成功 ${obj.meta.success_count}/${obj.meta.target_count} ／
      エラー ${obj.meta.error_count}<br>
      下の「JSON保存」をタップしてください。
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <button id="jolly_skill_delta_save_btn"
        style="padding:10px;border:0;border-radius:10px;font-weight:700">
        JSON保存
      </button>
      <button id="jolly_skill_delta_copy_btn"
        style="padding:10px;border:0;border-radius:10px;font-weight:700">
        JSONコピー
      </button>
    </div>
  `;

  document.body.appendChild(panel);

  document.getElementById('jolly_skill_delta_save_btn').onclick =
    () => shareLastExport().catch(e =>
      alert('保存失敗: ' + (e?.message || e))
    );

  document.getElementById('jolly_skill_delta_copy_btn').onclick =
    () => copyLastExport().catch(e =>
      alert('コピー失敗: ' + (e?.message || e))
    );
}

async function shareLastExport() {
  if (!LAST_EXPORT) throw new Error('保存対象がありません');
  const text = JSON.stringify(LAST_EXPORT, null, 2);
  const file = new File([text], OUTPUT_NAME, {type:'application/json'});

  if (navigator.canShare && navigator.canShare({files:[file]})) {
    await navigator.share({files:[file]});
    return;
  }

  throw new Error('この環境ではファイル共有を利用できません');
}

async function copyLastExport() {
  if (!LAST_EXPORT) throw new Error('コピー対象がありません');
  const text = JSON.stringify(LAST_EXPORT, null, 2);
  await navigator.clipboard.writeText(text);
  alert('JSON全文をコピーしました');
}

async function run() {
  if (!TARGETS.length) {
    alert('詳細取得対象は0件です。DB更新は不要です。');
    return;
  }
  if (!confirm(`差分スキル ${TARGETS.length}件の詳細証拠を取得します。`)) return;

  const rows = [], errors = [];
  for (let i=0; i<TARGETS.length; i++) {
    const t = TARGETS[i];
    try {
      rows.push(await fetchOne(t));
    } catch (e) {
      errors.push({
        skill_id:t.skill_id,
        skill_name_hint:t.skill_name_hint || '',
        detail_url:t.detail_url,
        error:String(e?.message || e)
      });
    }
    await sleep(WAIT_MS);
  }

  const out = {
    meta:{
      version:VERSION,
      collected_at:new Date().toISOString(),
      target_count:TARGETS.length,
      success_count:rows.length,
      error_count:errors.length,
      source_manifest:"jolly_skill_update_manifest_v34_merged(1).json"
    },
    targets:TARGETS,
    details:rows,
    errors
  };
  showExportPanel(out);
  alert(`取得完了: 成功 ${rows.length} / ${TARGETS.length}、エラー ${errors.length}。画面下の「JSON保存」をタップしてください。`);
}

run().catch(e => alert('取得失敗: ' + (e?.message || e)));
})();
