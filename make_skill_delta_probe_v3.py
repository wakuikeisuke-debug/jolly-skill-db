import json
from pathlib import Path

DB_FILE = Path("jolly_card_db_latest.json")
OUT_FILE = Path("collector_skill_delta_probe_v3.js")

EXPECTED_SKILLS = 2188
EXPECTED_STATUSES = 37


def clean(v):
    return " ".join(str(v or "").split()).strip()


def listify(v):
    if v is None:
        return []
    if isinstance(v, list):
        return [clean(x) for x in v if clean(x)]
    s = clean(v)
    if not s:
        return []
    # DB の「全タグ」「異常状態」は " / " 区切りが基本。
    if " / " in s:
        return [clean(x) for x in s.split(" / ") if clean(x)]
    return [s]


def get_skill_id(skill):
    return clean(skill.get("ID") or skill.get("skill_id"))


def get_skill_name(skill):
    return clean(
        skill.get("スキル名")
        or skill.get("skill_name")
        or skill.get("original_skill_name")
    )


def get_genre(skill):
    return clean(skill.get("ジャンル") or skill.get("genre"))


def get_effect(skill):
    return clean(skill.get("効果") or skill.get("effect"))


def get_tags(skill):
    tags = skill.get("tags")
    if isinstance(tags, list):
        return sorted(set(listify(tags)))

    all_tags = skill.get("全タグ")
    if all_tags:
        return sorted(set(listify(all_tags)))

    values = []
    for i in range(1, 6):
        x = clean(skill.get(f"タグ{i}"))
        if x:
            values.append(x)
    return sorted(set(values))


def get_statuses(skill):
    v = skill.get("statuses")
    if isinstance(v, list):
        return sorted(set(listify(v)))
    return sorted(set(listify(skill.get("異常状態"))))


with DB_FILE.open("r", encoding="utf-8") as f:
    db = json.load(f)

raw_skills = []
raw_skills.extend(db.get("skills", []))
raw_skills.extend(db.get("supplemental_skills", []))

skill_baseline = {}
for skill in raw_skills:
    sid = get_skill_id(skill)
    if not sid:
        continue

    tags = get_tags(skill)
    statuses = get_statuses(skill)

    skill_baseline[sid] = {
        "skill_id": sid,
        "skill_name": get_skill_name(skill),
        "genre": get_genre(skill),
        "effect": get_effect(skill),
        "tags": tags,
        "statuses": statuses,
    }

status_baseline = {}
for status in db.get("statuses", []):
    sid = clean(status.get("異常状態ID") or status.get("status_id"))
    name = clean(status.get("異常状態名") or status.get("status_name"))
    if sid:
        status_baseline[sid] = {
            "status_id": sid,
            "status_name": name,
        }

print()
print("=== V3 BASELINE AUDIT ===")
print("raw skills:", len(raw_skills))
print("skill baseline:", len(skill_baseline))
print("status baseline:", len(status_baseline))

if len(skill_baseline) != EXPECTED_SKILLS:
    raise RuntimeError(
        f"skill baseline が{EXPECTED_SKILLS}件ではありません: {len(skill_baseline)}"
    )

if len(status_baseline) != EXPECTED_STATUSES:
    raise RuntimeError(
        f"status baseline が{EXPECTED_STATUSES}件ではありません: {len(status_baseline)}"
    )

# タグ名の「:」より前も語彙に含める。
tag_vocab = set()
for s in skill_baseline.values():
    for tag in s["tags"]:
        tag_vocab.add(tag)
        if ":" in tag:
            tag_vocab.add(tag.split(":", 1)[0])

skill_json = json.dumps(
    skill_baseline, ensure_ascii=False, separators=(",", ":")
)
status_json = json.dumps(
    status_baseline, ensure_ascii=False, separators=(",", ":")
)
tag_vocab_json = json.dumps(
    sorted(tag_vocab), ensure_ascii=False, separators=(",", ":")
)

js = r"""
(() => {
  'use strict';

  const VERSION = 'jolly-skill-delta-probe-3.1';
  const STATE_KEY = 'JOLLY_SKILL_DELTA_STATE_V3';

  const SKILL_BASELINE = __SKILL_BASELINE__;
  const STATUS_BASELINE = __STATUS_BASELINE__;
  const TAG_VOCAB = __TAG_VOCAB__;

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  function clean(value) {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function uniqSorted(values) {
    return [...new Set((values || []).map(clean).filter(Boolean))].sort();
  }

  function normalizeTagForCompare(tag) {
    return clean(tag).replace(/^\[|\]$/g, '');
  }

  function generalizedTag(tag) {
    const x = normalizeTagForCompare(tag);
    return x.includes(':') ? x.split(':', 1)[0] : x;
  }

  function emptyState() {
    return {
      start_url: null,
      pending_urls: [],
      visited_urls: [],
      items: [],
      running: false,
      stopped: false,
      finished: false,
      errors: []
    };
  }

  function compactItem(item) {
    if (!item || !item.id) return null;

    const id = String(item.id);

    if (SKILL_BASELINE[id]) {
      return {
        id,
        detected_type: 'skill',
        observed_text: clean(item.observed_text || item.raw_text || ''),
        detail_url: item.detail_url || '',
        source_page: item.source_page || ''
      };
    }

    if (STATUS_BASELINE[id]) {
      return {
        id,
        detected_type: 'status',
        observed_text: clean(item.observed_text || item.raw_text || '')
      };
    }

    return {
      id,
      detected_type: 'unknown',
      observed_text: clean(item.observed_text || item.raw_text || ''),
      detail_url: item.detail_url || '',
      source_page: item.source_page || ''
    };
  }

  function compactItems(items) {
    const map = new Map();

    for (const raw of (items || [])) {
      const item = compactItem(raw);
      if (!item || !item.id) continue;

      const old = map.get(item.id);
      if (!old || (item.observed_text || '').length > (old.observed_text || '').length) {
        map.set(item.id, item);
      }
    }

    return [...map.values()];
  }

  function compactState(src) {
    const s = src || emptyState();

    return {
      start_url: s.start_url || null,
      pending_urls: Array.isArray(s.pending_urls) ? s.pending_urls : [],
      visited_urls: Array.isArray(s.visited_urls) ? s.visited_urls : [],
      items: compactItems(s.items || []),
      running: false,
      stopped: !!s.stopped,
      finished: !!s.finished,
      errors: Array.isArray(s.errors) ? s.errors : []
    };
  }

  function loadState() {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return emptyState();

    try {
      return compactState(JSON.parse(raw));
    } catch (error) {
      console.error('V3 state解析失敗', error);
      return emptyState();
    }
  }

  let state = loadState();

  function saveState() {
    const compact = compactState(state);

    state.start_url = compact.start_url;
    state.pending_urls = compact.pending_urls;
    state.visited_urls = compact.visited_urls;
    state.items = compact.items;
    state.stopped = compact.stopped;
    state.finished = compact.finished;
    state.errors = compact.errors;

    localStorage.setItem(STATE_KEY, JSON.stringify(compact));
  }

  function normalizeUrl(href, base) {
    try {
      const url = new URL(href, base);
      if (url.origin !== location.origin) return null;
      url.hash = '';
      return url.href;
    } catch (_) {
      return null;
    }
  }

  function extractNumericId(url, element) {
    const params = ['skill_no', 'skill', 'skill_id', 'id', 'no'];

    for (const key of params) {
      const value = url.searchParams.get(key);
      if (value && /^\d+$/.test(value)) return value;
    }

    const attrs = [
      element?.getAttribute('data-skill-id'),
      element?.getAttribute('data-skill-no'),
      element?.getAttribute('data-id')
    ];

    for (const value of attrs) {
      if (value && /^\d+$/.test(value)) return value;
    }

    return null;
  }

  function extractItemsFromDoc(doc, pageUrl) {
    const found = [];

    for (const link of doc.querySelectorAll('a[href]')) {
      const href = normalizeUrl(link.getAttribute('href'), pageUrl);
      if (!href) continue;

      let url;
      try {
        url = new URL(href);
      } catch (_) {
        continue;
      }

      if (!url.searchParams.has('skill_no')) continue;

      const id = extractNumericId(url, link);
      if (!id) continue;

      const ownText = clean(link.textContent);
      const parentText = clean(link.parentElement?.textContent);

      const rawText =
        parentText.length > ownText.length
          ? parentText
          : ownText;

      found.push({
        id: String(id),
        observed_text: rawText,
        detail_url: href,
        source_page: pageUrl
      });
    }

    return compactItems(found);
  }

  function sameSkillSearch(candidateUrl) {
    try {
      const url = new URL(candidateUrl);

      return (
        url.origin === location.origin &&
        url.searchParams.get('M') === 'Help' &&
        url.searchParams.get('A') === 'SkillSearch'
      );
    } catch (_) {
      return false;
    }
  }

  function extractNextPages(doc, pageUrl) {
    const urls = [];

    for (const link of doc.querySelectorAll('a[href]')) {
      const href = normalizeUrl(link.getAttribute('href'), pageUrl);

      if (!href || !sameSkillSearch(href)) continue;

      const url = new URL(href);
      if (!url.searchParams.has('p')) continue;

      urls.push(href);
    }

    return [...new Set(urls)];
  }

  async function fetchPage(url) {
    const response = await fetch(url, {
      credentials: 'include',
      cache: 'no-store',
      redirect: 'follow'
    });

    const html = await response.text();

    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }

    if (
      /ログイン情報入力/.test(html) ||
      /module=auth/.test(html) ||
      /auth001/.test(html)
    ) {
      throw new Error('LOGIN_REQUIRED');
    }

    if (
      /The quota has been exceeded\.?/i.test(html) ||
      /quota has been exceeded/i.test(html)
    ) {
      throw new Error('QUOTA_EXCEEDED');
    }

    return new DOMParser().parseFromString(html, 'text/html');
  }

  function stripName(observedText, oldName) {
    const text = clean(observedText);
    const name = clean(oldName);

    if (!name) return text;
    if (text === name) return '';
    if (text.startsWith(name + ' ')) {
      return clean(text.slice(name.length + 1));
    }

    return null;
  }

  function baselineDisplayVariants(base) {
    const name = clean(base.skill_name);
    const genre = clean(base.genre);
    const effect = clean(base.effect);
    const tags = uniqSorted(base.tags);
    const statuses = uniqSorted(base.statuses);

    const tagSlash = tags.join(' / ');
    const tagSpace = tags.join(' ');
    const statusSlash = statuses.join(' / ');
    const statusSpace = statuses.join(' ');

    const tails = new Set();

    if (effect) tails.add(effect);

    const extras = [
      tagSlash,
      tagSpace,
      statusSlash,
      statusSpace,
      clean([tagSlash, statusSlash].filter(Boolean).join(' ')),
      clean([tagSpace, statusSpace].filter(Boolean).join(' '))
    ].filter(Boolean);

    for (const extra of extras) {
      tails.add(clean([effect, extra].filter(Boolean).join(' ')));
    }

    const variants = new Set();

    for (const tail of tails) {
      variants.add(clean([name, tail].filter(Boolean).join(' ')));

      if (genre) {
        variants.add(clean([name, genre, tail].filter(Boolean).join(' ')));
      }
    }

    return variants;
  }

  function extractKnownTags(text) {
    const t = clean(text);
    const found = [];

    for (const rawTag of TAG_VOCAB) {
      const tag = clean(rawTag);
      if (!tag) continue;

      const general = generalizedTag(tag);

      if (
        t.includes(tag) ||
        t.includes('[' + tag + ']') ||
        t.includes('【' + tag + '】') ||
        (general && (
          t.includes('[' + general + ']') ||
          t.includes('【' + general + '】')
        ))
      ) {
        found.push(tag);
      }
    }

    return uniqSorted(found);
  }

  function inferBracketTokens(text) {
    const out = [];
    const t = clean(text);

    for (const m of t.matchAll(/\[([^\]]+)\]/g)) {
      out.push(clean(m[1]));
    }

    return uniqSorted(out);
  }

  function compareSkillItem(item) {
    const id = String(item.id);
    const base = SKILL_BASELINE[id];
    const observed = clean(item.observed_text);

    if (!base) return null;

    const variants = baselineDisplayVariants(base);

    if (variants.has(observed)) {
      return null;
    }

    const tail = stripName(observed, base.skill_name);

    const before = {
      skill_name: clean(base.skill_name),
      genre: clean(base.genre),
      effect: clean(base.effect),
      tags: uniqSorted(base.tags),
      statuses: uniqSorted(base.statuses)
    };

    const after = {
      observed_text: observed,
      observed_body: tail === null ? '' : tail,
      observed_known_tags: extractKnownTags(observed),
      observed_bracket_tokens: inferBracketTokens(observed)
    };

    const changedFields = [];
    let changeType = 'text_only';
    let reviewRequired = false;

    if (tail === null) {
      changedFields.push('skill_name');
      changeType = 'renamed_or_layout_change';
      reviewRequired = true;
    } else {
      const effect = clean(base.effect);

      if (effect && !tail.includes(effect)) {
        changedFields.push('effect');
        changeType = 'effect_change';
        reviewRequired = true;
      }

      const beforeTagGeneral = new Set(
        uniqSorted(base.tags).map(generalizedTag)
      );

      const observedTagGeneral = new Set(
        [
          ...extractKnownTags(observed).map(generalizedTag),
          ...inferBracketTokens(observed).map(generalizedTag)
        ].filter(Boolean)
      );

      const possibleAddedTagCategories =
        [...observedTagGeneral]
          .filter(x => TAG_VOCAB.includes(x) && !beforeTagGeneral.has(x));

      if (possibleAddedTagCategories.length) {
        changedFields.push('tags');
        after.possible_added_tag_categories = possibleAddedTagCategories;
        changeType = 'tag_change';
        reviewRequired = true;
      }

      // effect がそのままで末尾だけ増減した場合も変更として残す。
      if (!changedFields.length) {
        changedFields.push('display_text');
        changeType = 'text_only';
      }
    }

    return {
      skill_id: id,
      skill_name: clean(base.skill_name),
      change_type: changeType,
      changed_fields: [...new Set(changedFields)],
      before,
      after,
      detail_url: item.detail_url || '',
      source_page: item.source_page || '',
      review_required: reviewRequired
    };
  }

  function classify() {
    const items = compactItems(state.items);

    const skills = [];
    const statuses = [];
    const unknown = [];

    for (const item of items) {
      const id = String(item.id);

      if (SKILL_BASELINE[id]) {
        skills.push(item);
      } else if (STATUS_BASELINE[id]) {
        statuses.push(item);
      } else {
        unknown.push(item);
      }
    }

    return { skills, statuses, unknown };
  }

  function compare() {
    const grouped = classify();

    const skillIds = new Set(grouped.skills.map(x => String(x.id)));
    const statusIds = new Set(grouped.statuses.map(x => String(x.id)));

    const missingSkills =
      Object.values(SKILL_BASELINE)
        .filter(x => !skillIds.has(String(x.skill_id)));

    const missingStatuses =
      Object.values(STATUS_BASELINE)
        .filter(x => !statusIds.has(String(x.status_id)));

    const changedSkills =
      grouped.skills
        .map(compareSkillItem)
        .filter(Boolean);

    const renamedSkills =
      changedSkills
        .filter(x => x.changed_fields.includes('skill_name'));

    return {
      skill_baseline_count: Object.keys(SKILL_BASELINE).length,
      skill_latest_count: grouped.skills.length,
      status_baseline_count: Object.keys(STATUS_BASELINE).length,
      status_latest_count: grouped.statuses.length,
      new_candidates: grouped.unknown,
      missing_skills: missingSkills,
      missing_statuses: missingStatuses,
      renamed_skill_candidates: renamedSkills,
      changed_skills: changedSkills,
      review_required_count:
        changedSkills.filter(x => x.review_required).length
    };
  }

  function setStatus(message) {
    const el = document.getElementById('jsdp30_status');
    if (el) el.textContent = message;
  }

  function refreshSummary() {
    const diff = compare();

    setStatus(
      'スキル ' +
      diff.skill_latest_count + '/' + diff.skill_baseline_count +
      ' ／ 異常状態 ' +
      diff.status_latest_count + '/' + diff.status_baseline_count +
      ' ／ 新規候補 ' +
      diff.new_candidates.length +
      ' ／ 消失 ' +
      diff.missing_skills.length +
      ' ／ 内容変更候補 ' +
      diff.changed_skills.length +
      ' ／ 要確認 ' +
      diff.review_required_count +
      ' ／ 巡回済 ' +
      state.visited_urls.length +
      ' ／ 未巡回 ' +
      state.pending_urls.length +
      ' ／ エラー ' +
      state.errors.length
    );
  }

  async function run() {
    if (state.running) return;

    if (!state.start_url) {
      state.start_url = location.href;
      state.pending_urls = [location.href];
      state.visited_urls = [];
      state.items = [];
      state.errors = [];
    }

    state.running = true;
    state.stopped = false;
    state.finished = false;
    saveState();

    while (!state.stopped && state.pending_urls.length) {
      const url = state.pending_urls.shift();

      if (state.visited_urls.includes(url)) continue;

      setStatus(
        '巡回中 ' +
        (state.visited_urls.length + 1) +
        'ページ ／ 保存項目 ' +
        state.items.length
      );

      try {
        const doc = await fetchPage(url);

        const pageItems = extractItemsFromDoc(doc, url);
        state.items = compactItems([...state.items, ...pageItems]);

        const nextPages = extractNextPages(doc, url);

        for (const next of nextPages) {
          if (
            !state.visited_urls.includes(next) &&
            !state.pending_urls.includes(next)
          ) {
            state.pending_urls.push(next);
          }
        }

        state.visited_urls.push(url);

        state.errors =
          state.errors.filter(x => x.url !== url);

      } catch (error) {
        state.errors =
          state.errors.filter(x => x.url !== url);

        state.errors.push({
          url,
          message: String(error?.message || error),
          at: new Date().toISOString()
        });

        const message =
          String(error?.message || error);

        if (message.includes('LOGIN_REQUIRED')) {
          if (!state.pending_urls.includes(url)) {
            state.pending_urls.unshift(url);
          }

          state.stopped = true;
          setStatus('ログイン切れを検出。現在ページを保持して停止しました。');
          saveState();
          break;
        }

        if (message.includes('QUOTA_EXCEEDED')) {
          if (!state.pending_urls.includes(url)) {
            state.pending_urls.unshift(url);
          }

          state.stopped = true;
          setStatus(
            'サイト側のquota上限を検出。現在ページを保持して安全停止しました。時間を空けて「① 取得開始/続き」で再開できます。'
          );
          saveState();
          break;
        }

        /*
          その他の一時エラーもページを失わないよう、
          現在URLを未巡回へ戻して停止する。
        */
        if (!state.pending_urls.includes(url)) {
          state.pending_urls.unshift(url);
        }

        state.stopped = true;
        setStatus(
          '取得エラーで安全停止しました。現在ページは未巡回として保持しています。'
        );
        saveState();
        break;
      }

      saveState();

      /*
        サイト負荷とquota回避のため低速化。
        通常は1.5秒間隔、20ページごとに15秒休止。
      */
      if (
        state.visited_urls.length > 0 &&
        state.visited_urls.length % 20 === 0
      ) {
        setStatus(
          '20ページ取得済み。quota回避のため15秒休止中…'
        );
        saveState();
        await sleep(15000);
      } else {
        await sleep(1500);
      }
    }

    state.running = false;

    if (!state.pending_urls.length && !state.stopped) {
      state.finished = true;
    }

    saveState();
    refreshSummary();
  }

  function stop() {
    state.stopped = true;
    saveState();
    setStatus('停止要求を受け付けました');
  }

  function buildExport() {
    const diff = compare();

    return {
      meta: {
        version: VERSION,
        checked_at: new Date().toISOString(),
        start_url: state.start_url,
        skill_baseline_count: diff.skill_baseline_count,
        skill_latest_count: diff.skill_latest_count,
        status_baseline_count: diff.status_baseline_count,
        status_latest_count: diff.status_latest_count,
        new_candidate_count: diff.new_candidates.length,
        missing_skill_count: diff.missing_skills.length,
        missing_status_count: diff.missing_statuses.length,
        renamed_skill_candidate_count: diff.renamed_skill_candidates.length,
        changed_skill_count: diff.changed_skills.length,
        review_required_count: diff.review_required_count,
        visited_page_count: state.visited_urls.length,
        pending_page_count: state.pending_urls.length,
        finished: state.finished,
        error_count: state.errors.length
      },
      new_candidates: diff.new_candidates,
      missing_skills: diff.missing_skills,
      missing_statuses: diff.missing_statuses,
      renamed_skill_candidates: diff.renamed_skill_candidates,
      changed_skills: diff.changed_skills,
      errors: state.errors
    };
  }

  function showDiff() {
    const diff = compare();

    const lines = [
      'スキル: ' +
      diff.skill_latest_count + '/' + diff.skill_baseline_count,
      '異常状態: ' +
      diff.status_latest_count + '/' + diff.status_baseline_count,
      '',
      '新規候補: ' + diff.new_candidates.length,
      'スキル消失: ' + diff.missing_skills.length,
      '異常状態消失: ' + diff.missing_statuses.length,
      '名称変更候補: ' + diff.renamed_skill_candidates.length,
      '内容変更候補: ' + diff.changed_skills.length,
      '要確認: ' + diff.review_required_count,
      ''
    ];

    for (const x of diff.changed_skills.slice(0, 30)) {
      lines.push(
        '＊ ' +
        x.skill_id + ' ' +
        x.skill_name + ' [' +
        x.changed_fields.join(', ') + ']'
      );
    }

    lines.push(
      '',
      '巡回済: ' + state.visited_urls.length,
      '未巡回: ' + state.pending_urls.length,
      'エラー: ' + state.errors.length
    );

    alert(lines.join('\n'));
  }

  async function shareJson() {
    const text = JSON.stringify(buildExport(), null, 2);

    const file = new File(
      [text],
      'jolly_skill_update_manifest_v3.json',
      { type: 'application/json' }
    );

    if (
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch (_) {}
    }

    await navigator.clipboard.writeText(text);
    alert('JSON共有できなかったため全文をコピーしました');
  }

  async function copyJson() {
    const text = JSON.stringify(buildExport(), null, 2);
    await navigator.clipboard.writeText(text);
    alert('JSON全文をコピーしました');
  }

  function resetAll() {
    if (
      !confirm(
        'V3のスキル差分確認結果と進捗を全削除しますか？'
      )
    ) {
      return;
    }

    localStorage.removeItem(STATE_KEY);
    state = emptyState();
    refreshSummary();
  }

  function makePanel() {
    document
      .getElementById('jolly_skill_delta_panel_v30')
      ?.remove();

    const panel = document.createElement('div');

    panel.id = 'jolly_skill_delta_panel_v30';

    panel.style.cssText = [
      'position:fixed',
      'left:8px',
      'right:8px',
      'bottom:8px',
      'z-index:2147483647',
      'background:#111827',
      'color:#fff',
      'padding:12px',
      'border-radius:16px',
      'font-family:-apple-system,BlinkMacSystemFont,sans-serif',
      'font-size:13px',
      'box-shadow:0 8px 30px #0008',
      'max-height:70vh',
      'overflow:auto'
    ].join(';');

    panel.innerHTML = `
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:8px;
      ">
        <b>JOLLY スキル差分確認 v3.1</b>
        <button id="jsdp30_close">×</button>
      </div>

      <div
        id="jsdp30_status"
        style="
          background:#1f2937;
          padding:8px;
          border-radius:10px;
          margin-bottom:8px;
          line-height:1.5;
        "
      >
        読み込み中…
      </div>

      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:7px;
      ">
        <button id="jsdp30_start">① 取得開始/続き</button>
        <button id="jsdp30_stop">停止</button>
        <button id="jsdp30_show">② 差分表示</button>
        <button id="jsdp30_share">差分JSON保存</button>
        <button id="jsdp30_copy">JSON全文コピー</button>
        <button id="jsdp30_reset">全リセット</button>
      </div>

      <div style="
        color:#cbd5e1;
        font-size:11px;
        line-height:1.5;
        margin-top:8px;
      ">
        v2の巡回方式を維持しつつ、
        既存スキルの表示内容も比較します。
        通常1.5秒間隔・20ページごとに15秒休止します。
        quota検出時は現在ページを未巡回へ戻して安全停止し、
        保存済み進捗から再開できます。
      </div>
    `;

    const style = document.createElement('style');

    style.textContent = `
      #jolly_skill_delta_panel_v30 button {
        border:0;
        border-radius:10px;
        padding:9px 7px;
        background:#fff;
        color:#111827;
        font:inherit;
        font-weight:700;
      }
    `;

    document.documentElement.appendChild(style);
    document.body.appendChild(panel);

    document.getElementById('jsdp30_close').onclick =
      () => panel.remove();

    document.getElementById('jsdp30_start').onclick =
      () => run().catch(error => alert(error.message));

    document.getElementById('jsdp30_stop').onclick = stop;
    document.getElementById('jsdp30_show').onclick = showDiff;

    document.getElementById('jsdp30_share').onclick =
      () => shareJson().catch(error => alert(error.message));

    document.getElementById('jsdp30_copy').onclick =
      () => copyJson().catch(error => alert(error.message));

    document.getElementById('jsdp30_reset').onclick = resetAll;

    refreshSummary();
  }

  makePanel();
})();
"""

js = (
    js.replace("__SKILL_BASELINE__", skill_json)
      .replace("__STATUS_BASELINE__", status_json)
      .replace("__TAG_VOCAB__", tag_vocab_json)
)

OUT_FILE.write_text(js, encoding="utf-8")

print()
print("=== OUTPUT ===")
print("file:", OUT_FILE)
print("version: jolly-skill-delta-probe-3.1")
print("baseline skills:", len(skill_baseline))
print("baseline statuses:", len(status_baseline))
print()
print("次:")
print("1) collector_skill_delta_probe_v3.js をGitHubへ追加")
print("2) Safariで SkillSearch を開く")
print("3) v3 collector を実行")
print("4) jolly_skill_update_manifest_v3.json を保存")
