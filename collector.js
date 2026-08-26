(() => {
"use strict";

const VERSION = "detail-test-v1.0";
const PANEL_ID = "jolly-detail-test-panel";

const CATALOG_KEY = "jolly_card_catalog_panel_v1";
const DETAIL_KEY  = "jolly_card_detail_test_v1";

const sleep = ms =>
  new Promise(r => setTimeout(r, ms));


// ========================================
// 保存データ
// ========================================

function loadCatalog() {
  try {
    const x = JSON.parse(
      localStorage.getItem(CATALOG_KEY) || "null"
    );

    if (x && Array.isArray(x.cards)) {
      return x.cards;
    }
  } catch(e) {}

  return [];
}


function loadDetails() {
  try {
    const x = JSON.parse(
      localStorage.getItem(DETAIL_KEY) || "null"
    );

    if (Array.isArray(x)) {
      return x;
    }
  } catch(e) {}

  return [];
}


function saveDetails(details) {
  localStorage.setItem(
    DETAIL_KEY,
    JSON.stringify(details)
  );
}


function mergeDetails(oldRows, newRows) {

  const map = new Map();

  for (const x of oldRows) {
    if (x && x.card_no) {
      map.set(String(x.card_no), x);
    }
  }

  for (const x of newRows) {
    if (x && x.card_no) {
      map.set(String(x.card_no), x);
    }
  }

  return [...map.values()].sort(
    (a,b) =>
      Number(a.card_no) -
      Number(b.card_no)
  );
}


// ========================================
// 共通
// ========================================

function cleanText(s) {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim();
}


function splitRange(text) {

  const m =
    cleanText(text)
      .match(
        /([\d.]+)\s*[~～]\s*([\d.]+)/
      );

  if (!m) {
    return {
      min: null,
      max: null,
      raw: cleanText(text)
    };
  }

  return {
    min: Number(m[1]),
    max: Number(m[2]),
    raw: cleanText(text)
  };
}


function absoluteUrl(url) {

  if (!url) return "";

  try {
    return new URL(
      url,
      location.href
    ).href;
  } catch(e) {
    return url;
  }
}


// ========================================
// カード名
// ========================================

function getCardName(doc, fallback) {

  // 多くのAlbumDetailでカード名に使用
  const candidates = [
    ...doc.querySelectorAll(
      '#page_card_albumDetail span'
    )
  ];

  for (const el of candidates) {

    const style =
      (el.getAttribute("style") || "")
        .replace(/\s/g,"")
        .toLowerCase();

    if (
      style.includes("color:#ffff00") ||
      style.includes("color:rgb(255,255,0)")
    ) {

      const t =
        cleanText(el.textContent);

      if (
        t &&
        !t.includes("タップ") &&
        t.length < 100
      ) {
        return t;
      }
    }
  }

  return fallback || "";
}


// ========================================
// レア度
// ========================================

function getRarity(doc) {

  const rare =
    doc.querySelector(
      "#page_card_cardDetail_card_rare"
    );

  if (!rare) {
    return {
      stars: null,
      name: ""
    };
  }

  const stars =
    rare.querySelectorAll(
      'img[src*="card_status_star"]'
    ).length;

  let rareName = "";

  let n =
    rare.nextSibling;

  for (
    let i = 0;
    i < 5 && n;
    i++,
    n = n.nextSibling
  ) {

    const text =
      cleanText(
        n.textContent || ""
      );

    const m =
      text.match(/\[([^\]]+)\]/);

    if (m) {
      rareName = m[1];
      break;
    }
  }

  return {
    stars,
    name: rareName
  };
}


// ========================================
// 性別
// ========================================

function getGender(doc) {

  const status =
    doc.querySelector("#card_status");

  if (!status) return "";

  const text =
    cleanText(
      status.textContent
    );

  const m =
    text.match(
      /性別\s*([^\s]+)/ 
    );

  return m
    ? m[1]
        .replace(/[\[\]]/g,"")
    : "";
}


// ========================================
// 所持数
// ========================================

function getOwnedCounts(doc) {

  let list = null;
  let stock = null;

  const imgs =
    doc.querySelectorAll(
      "img.card_storage_icon"
    );

  imgs.forEach(img => {

    const src =
      img.getAttribute("src") || "";

    const parent =
      img.parentElement;

    if (!parent) return;

    const html =
      parent.innerHTML;

    if (
      src.includes("icon_list.png")
    ) {

      const after =
        html.split(
          img.outerHTML
        )[1] || "";

      const m =
        after.match(
          /×\s*(\d+)/
        );

      if (m) {
        list = Number(m[1]);
      }
    }

    if (
      src.includes("icon_stock.png")
    ) {

      const after =
        html.split(
          img.outerHTML
        )[1] || "";

      const m =
        after.match(
          /×\s*(\d+)/
        );

      if (m) {
        stock = Number(m[1]);
      }
    }
  });


  // HTML解析の予備ルート
  if (
    list === null ||
    stock === null
  ) {

    const text =
      cleanText(
        doc.body.textContent
      );

    // 完全なフォールバックにはしない
    // 誤認防止のためnullを維持
  }


  const owned =
    (
      Number(list || 0) +
      Number(stock || 0)
    ) > 0;


  return {
    list,
    stock,
    owned
  };
}


// ========================================
// スキル
// ========================================

function getSkills(doc) {

  const skills = [];

  const boxes =
    doc.querySelectorAll(
      ".skill_border02"
    );

  let slot = 0;

  boxes.forEach(box => {

    slot++;

    const icon =
      box.querySelector(
        ".page_card_albumDetail_status_skill_icon"
      );

    const nameCandidates =
      [...box.querySelectorAll("span")]
        .filter(el => {

          const style =
            (
              el.getAttribute("style") ||
              ""
            )
            .replace(/\s/g,"")
            .toLowerCase();

          return (
            style.includes(
              "color:#fff280"
            ) ||
            style.includes(
              "color:rgb(255,242,128)"
            )
          );
        });


    const name =
      cleanText(
        nameCandidates[0]
          ?.textContent || ""
      );


    if (
      !name ||
      name === "－" ||
      name === "-"
    ) {
      return;
    }


    const detail =
      box.querySelector(
        ".skillDetail"
      );


    let effect = "";

    if (detail) {

      // タグを含めた全文を保持。
      // 後段で既存スキルDBと結合する。
      effect =
        cleanText(
          detail.textContent
        );
    }


    let iconType = "";

    if (icon) {

      const src =
        icon.getAttribute("src") ||
        "";

      const m =
        src.match(
          /\/icon\/([^/.]+)\.png/i
        );

      if (m) {
        iconType = m[1];
      }
    }


    skills.push({
      slot,
      skill_name: name,
      effect,
      icon_type: iconType,
      acquire_type: "base"
    });
  });


  return skills;
}


// ========================================
// アイテム
// ========================================

function getItems(doc) {

  const items = [];

  doc
    .querySelectorAll(
      ".item_description_toolTip"
    )
    .forEach(el => {

      const id =
        el.id || "";

      const m =
        id.match(
          /item_description_(\d+)/
        );

      if (!m) return;


      const itemId =
        m[1];


      const text =
        cleanText(
          el.textContent
        );


      const nameMatch =
        text.match(
          /【([^】]+)】/
        );


      const itemName =
        nameMatch
          ? nameMatch[1]
          : "";


      const unlockMatch =
        text.match(
          /スキル[「『"]([^」』"]+)[」』"]を覚える/
        );


      const unlockSkill =
        unlockMatch
          ? unlockMatch[1]
          : "";


      items.push({
        item_id: itemId,
        item_name: itemName,
        description: text,
        effect_type:
          unlockSkill
            ? "skill_unlock"
            : "other",
        unlock_skill:
          unlockSkill || null,

        // サンプルHTMLから必要個数は
        // 確定できないため推測しない
        required_count: null
      });
    });


  return items;
}


// ========================================
// 関連カード
// ========================================

function getRelatedCards(doc, ownCardNo) {

  const out = [];
  const seen = new Set();

  const area =
    doc.querySelector(
      "#after_card"
    );

  if (!area) return out;


  area
    .querySelectorAll(
      'a[href*="A=AlbumDetail"][href*="card="]'
    )
    .forEach(a => {

      try {

        const u =
          new URL(
            a.getAttribute("href"),
            location.href
          );

        const no =
          u.searchParams.get(
            "card"
          );

        if (
          !no ||
          no === String(ownCardNo) ||
          seen.has(no)
        ) {
          return;
        }

        seen.add(no);


        const name =
          cleanText(
            a.textContent
          );


        out.push({
          card_no: String(no),
          card_name: name,
          url: u.href
        });

      } catch(e) {}
    });


  return out;
}


// ========================================
// 説明文
// ========================================

function getDescription(doc) {

  const blocks =
    [
      ...doc.querySelectorAll(
        ".lineheight1_1_brown2"
      )
    ];

  for (const el of blocks) {

    if (
      el.closest("#after_card")
    ) {
      continue;
    }

    const text =
      cleanText(
        el.textContent
      );

    if (
      text.length >= 20
    ) {
      return text;
    }
  }

  return "";
}


// ========================================
// 画像
// ========================================

function getImage(doc, cardNo) {

  const selectors = [
    `img[src*="/card/640/${cardNo}.jpg"]`,
    `img[src*="/card/320/${cardNo}.jpg"]`,
    `img[src*="/card/120/${cardNo}.jpg"]`
  ];

  for (const s of selectors) {

    const img =
      doc.querySelector(s);

    if (img) {
      return absoluteUrl(
        img.getAttribute("src")
      );
    }
  }

  return "";
}


// ========================================
// AlbumDetail解析
// ========================================

function parseDetail(
  doc,
  cardNo,
  catalogName
) {

  const rarity =
    getRarity(doc);

  const hp =
    splitRange(
      doc.querySelector(
        "#page_deck_select_master_hp"
      )?.textContent
    );

  const attack =
    splitRange(
      doc.querySelector(
        "#page_deck_select_master_attack"
      )?.textContent
    );

  const speed =
    splitRange(
      doc.querySelector(
        "#page_deck_select_master_speed"
      )?.textContent
    );

  const costText =
    cleanText(
      doc.querySelector(
        "#page_deck_select_master_cost"
      )?.textContent
    );

  const cost =
    costText !== ""
      ? Number(costText)
      : null;


  const owned =
    getOwnedCounts(doc);


  const items =
    getItems(doc);


  const unlockSkills =
    items
      .filter(
        x =>
          x.effect_type ===
          "skill_unlock"
      )
      .map(x => ({
        skill_name:
          x.unlock_skill,

        acquire_type:
          "item_unlock",

        required_item_id:
          x.item_id,

        required_item_name:
          x.item_name,

        required_count:
          x.required_count
      }));


  return {

    card_no:
      String(cardNo),

    card_name:
      getCardName(
        doc,
        catalogName
      ),

    catalog_name:
      catalogName || "",

    rarity_stars:
      rarity.stars,

    rarity_name:
      rarity.name,

    gender:
      getGender(doc),

    cost,

    hp_min:
      hp.min,

    hp_max:
      hp.max,

    attack_min:
      attack.min,

    attack_max:
      attack.max,

    speed_min:
      speed.min,

    speed_max:
      speed.max,

    owned_list:
      owned.list,

    owned_stock:
      owned.stock,

    owned:
      owned.owned,

    image_url:
      getImage(
        doc,
        cardNo
      ),

    detail_url:
      location.origin +
      "/?M=Card&A=AlbumDetail&card=" +
      encodeURIComponent(cardNo),

    description:
      getDescription(doc),

    skills:
      getSkills(doc),

    items,

    unlock_skills:
      unlockSkills,

    related_cards:
      getRelatedCards(
        doc,
        cardNo
      )
  };
}


// ========================================
// 1枚取得
// ========================================

async function fetchDetail(
  cardNo,
  catalogName
) {

  const url =
    "/?M=Card&A=AlbumDetail&card=" +
    encodeURIComponent(
      cardNo
    );


  const res =
    await fetch(
      url,
      {
        credentials:
          "same-origin",
        cache:
          "no-store"
      }
    );


  if (!res.ok) {

    throw new Error(
      "HTTP " +
      res.status +
      " card=" +
      cardNo
    );
  }


  const html =
    await res.text();


  if (
    html.includes(
      "ログイン情報入力"
    ) ||
    html.includes(
      "auth001"
    ) ||
    html.includes(
      "module=auth"
    )
  ) {

    throw new Error(
      "ログインセッションが切れています"
    );
  }


  const doc =
    new DOMParser()
      .parseFromString(
        html,
        "text/html"
      );


  if (
    !doc.querySelector(
      "#page_card_albumDetail"
    )
  ) {

    throw new Error(
      "AlbumDetailを確認できません card=" +
      cardNo
    );
  }


  return parseDetail(
    doc,
    cardNo,
    catalogName
  );
}


// ========================================
// JSON書き出し
// ========================================

function downloadJson(details) {

  const payload = {

    meta: {
      type:
        "jolly_card_detail_test",

      version:
        VERSION,

      count:
        details.length,

      exported_at:
        new Date()
          .toISOString(),

      source:
        location.origin
    },

    cards:
      details
  };


  const blob =
    new Blob(
      [
        JSON.stringify(
          payload,
          null,
          2
        )
      ],
      {
        type:
          "application/json;charset=utf-8"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const a =
    document.createElement(
      "a"
    );


  a.href = url;

  a.download =
    "jolly_card_detail_test_" +
    details.length +
    ".json";


  document.body.appendChild(
    a
  );

  a.click();

  a.remove();


  setTimeout(
    () =>
      URL.revokeObjectURL(
        url
      ),
    5000
  );
}


// ========================================
// パネル
// ========================================

document
  .getElementById(
    PANEL_ID
  )
  ?.remove();


let busy = false;

let details =
  loadDetails();

const catalog =
  loadCatalog();


const root =
  document.createElement(
    "div"
  );

root.id =
  PANEL_ID;


root.innerHTML = `

<style>

#${PANEL_ID} {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  background: rgba(0,0,0,.58);
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  color: #111;
  text-shadow: none;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

#${PANEL_ID} * {
  box-sizing: border-box;
}

#${PANEL_ID} .panel {
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: auto;
  background: #f5f6f8;
  border-radius: 20px 20px 0 0;
  padding:
    14px
    14px
    calc(
      16px +
      env(safe-area-inset-bottom)
    );
}

#${PANEL_ID} .head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#${PANEL_ID} .title {
  font-size: 18px;
  font-weight: 800;
}

#${PANEL_ID} .ver {
  font-size: 11px;
  color: #666;
}

#${PANEL_ID} .box {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 14px;
  padding: 12px;
  margin-top: 10px;
}

#${PANEL_ID} .big {
  font-size: 24px;
  font-weight: 800;
}

#${PANEL_ID} .small {
  font-size: 12px;
  color: #666;
}

#${PANEL_ID} .grid {
  display: grid;
  grid-template-columns:
    1fr 1fr;
  gap: 8px;
  margin-top: 10px;
}

#${PANEL_ID} button {
  border:
    1px solid #ccd0d5;
  background: #fff;
  color: #111;
  border-radius: 12px;
  padding: 11px;
  font-size: 14px;
  font-weight: 700;
}

#${PANEL_ID} button.primary {
  background: #111827;
  color: #fff;
}

#${PANEL_ID} button.danger {
  color: #b42318;
}

#${PANEL_ID} button:disabled {
  opacity: .45;
}

#${PANEL_ID} .close {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 999px;
  font-size: 20px;
}

#${PANEL_ID} .log {
  white-space: pre-wrap;
  background: #111827;
  color: #fff;
  font:
    12px
    ui-monospace,
    Menlo,
    monospace;
  padding: 10px;
  min-height: 100px;
  max-height: 220px;
  overflow: auto;
  border-radius: 12px;
}

</style>


<div class="panel">

  <div class="head">

    <div>
      <div class="title">
        JOLLY カード詳細テスト
      </div>

      <div class="ver">
        ${VERSION}
      </div>
    </div>

    <button
      class="close"
      id="jd-close">
      ×
    </button>

  </div>


  <div class="box">

    <div class="small">
      目録
    </div>

    <div class="big">
      ${catalog.length}件
    </div>

    <div class="small">
      詳細テスト保存済み：
      <span id="jd-count">
        ${details.length}
      </span>
      件
    </div>

  </div>


  <div class="grid">

    <button
      class="primary"
      id="jd-first10">

      先頭10枚を取得

    </button>


    <button
      id="jd-1620">

      解放カード1620を取得

    </button>


    <button
      id="jd-export">

      テストJSONを書き出す

    </button>


    <button
      id="jd-show">

      保存状況を確認

    </button>


    <button
      class="danger"
      id="jd-reset">

      テスト結果を削除

    </button>


    <button
      id="jd-close2">

      閉じる

    </button>

  </div>


  <div class="box">

    <div class="small">
      実行ログ
    </div>

    <div
      class="log"
      id="jd-log">

      準備完了

    </div>

  </div>

</div>
`;


document.body.appendChild(
  root
);


const $ =
  q =>
    root.querySelector(q);


function log(msg) {

  const e =
    $("#jd-log");

  e.textContent =
    "[" +
    new Date()
      .toLocaleTimeString() +
    "] " +
    msg +
    "\n" +
    e.textContent;
}


function render() {

  details =
    loadDetails();

  $("#jd-count")
    .textContent =
    details.length;


  [
    "#jd-first10",
    "#jd-1620",
    "#jd-reset"
  ]
  .forEach(id => {
    $(id).disabled =
      busy;
  });


  $("#jd-export")
    .disabled =
    busy ||
    !details.length;
}


// ========================================
// 先頭10枚
// ========================================

$("#jd-first10")
  .onclick =
  async () => {

    if (busy) return;


    if (
      catalog.length < 10
    ) {

      log(
        "目録がlocalStorageにありません。"
      );

      return;
    }


    busy = true;
    render();


    try {

      const rows = [];

      const targets =
        catalog.slice(
          0,
          10
        );


      for (
        let i = 0;
        i < targets.length;
        i++
      ) {

        const target =
          targets[i];


        log(
          `${i+1}/10 ` +
          `${target.card_no} ` +
          `${target.card_name} 取得中…`
        );


        try {

          const row =
            await fetchDetail(
              target.card_no,
              target.card_name
            );


          rows.push(row);


          log(
            `OK ${row.card_no} ` +
            `${row.card_name} / ` +
            `skill=${row.skills.length} / ` +
            `owned=${row.owned}`
          );


        } catch(e) {

          log(
            "ERROR " +
            target.card_no +
            " " +
            (
              e.message ||
              e
            )
          );
        }


        await sleep(400);
      }


      details =
        mergeDetails(
          loadDetails(),
          rows
        );


      saveDetails(
        details
      );


      log(
        `先頭10枚テスト終了。保存=${details.length}件`
      );


    } finally {

      busy = false;
      render();
    }
  };


// ========================================
// アイテム解放確認カード
// ========================================

$("#jd-1620")
  .onclick =
  async () => {

    if (busy) return;

    busy = true;
    render();


    try {

      log(
        "card 1620 を取得中…"
      );


      const row =
        await fetchDetail(
          "1620",
          "樹氷の幻獣ラタトスク"
        );


      details =
        mergeDetails(
          loadDetails(),
          [row]
        );


      saveDetails(
        details
      );


      log(
        "1620取得成功 / " +
        `skills=${row.skills.length} / ` +
        `items=${row.items.length} / ` +
        `unlock=${row.unlock_skills.length}`
      );


      if (
        row.unlock_skills.length
      ) {

        log(
          "解放スキル: " +
          row.unlock_skills
            .map(
              x =>
                x.required_item_name +
                " → " +
                x.skill_name
            )
            .join(" / ")
        );
      }


    } catch(e) {

      log(
        "ERROR 1620 " +
        (
          e.message ||
          e
        )
      );

    } finally {

      busy = false;
      render();
    }
  };


// ========================================
// 書き出し
// ========================================

$("#jd-export")
  .onclick =
  () => {

    details =
      loadDetails();

    downloadJson(
      details
    );

    log(
      `JSONを書き出しました：${details.length}件`
    );
  };


// ========================================
// 状況確認
// ========================================

$("#jd-show")
  .onclick =
  () => {

    details =
      loadDetails();

    const summary =
      details.map(
        x =>
          x.card_no +
          ":" +
          x.card_name +
          " skill=" +
          x.skills.length +
          " item=" +
          x.items.length
      );

    log(
      summary.length
        ? summary.join("\n")
        : "保存データなし"
    );
  };


// ========================================
// リセット
// ========================================

$("#jd-reset")
  .onclick =
  () => {

    if (
      !confirm(
        "カード詳細テスト結果を削除しますか？"
      )
    ) {
      return;
    }


    localStorage.removeItem(
      DETAIL_KEY
    );


    details = [];

    render();

    log(
      "テスト結果を削除しました"
    );
  };


$("#jd-close").onclick =
  () => root.remove();


$("#jd-close2").onclick =
  () => root.remove();


render();


// 固定ローダーのShortcuts処理だけ終了。
// パネルはSafariページ上に残る。
if (
  typeof completion ===
  "function"
) {

  completion(
    JSON.stringify({
      ok: true,
      panel: true,
      version: VERSION,
      catalog_count:
        catalog.length,
      detail_test_count:
        details.length
    })
  );
}

})();
