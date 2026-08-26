(async () => {
"use strict";

const VERSION = "attribute-inspector-v1.0";
const PANEL_ID = "jolly-attribute-inspector";

const CATALOG_KEY =
  "jolly_card_catalog_panel_v1";

const STORAGE_KEY =
  "jolly_attribute_inspector_v1";

const WAIT_MS = 400;

const sleep = ms =>
  new Promise(r => setTimeout(r, ms));

function cleanText(v) {
  return String(v ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function loadCatalog() {
  try {
    const x = JSON.parse(
      localStorage.getItem(CATALOG_KEY) || "null"
    );

    if (x && Array.isArray(x.cards)) {
      return x.cards;
    }
  } catch (e) {}

  return [];
}

function loadResults() {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
  } catch (e) {
    return [];
  }
}

function saveResults(rows) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(rows)
  );
}

function mergeRows(oldRows, newRows) {
  const map = new Map();

  [...oldRows, ...newRows].forEach(x => {
    if (x?.card_no) {
      map.set(String(x.card_no), x);
    }
  });

  return [...map.values()];
}

const catalog = loadCatalog();


/* ========================================
   AlbumDetail取得
   ======================================== */

async function fetchDetail(cardNo) {

  const url =
    "/?M=Card&A=AlbumDetail&card=" +
    encodeURIComponent(cardNo);

  const res = await fetch(
    url,
    {
      credentials: "same-origin",
      cache: "no-store"
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
    html.includes("ログイン情報入力") ||
    html.includes("auth001") ||
    html.includes("module=auth")
  ) {
    throw new Error(
      "ログインセッション切れ"
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
      "AlbumDetail判定失敗"
    );
  }

  return {
    html,
    doc
  };
}


/* ========================================
   属性候補調査
   ======================================== */

function inspectAttribute(
  doc,
  cardNo,
  cardName
) {

  const keywords = [
    "戦",
    "飛",
    "魔",
    "獣",
    "属性",
    "property"
  ];


  /* ------------------------------
     画像要素
     ------------------------------ */

  const images = [];

  doc
    .querySelectorAll("img")
    .forEach(img => {

      const data = {
        src:
          img.getAttribute("src") || "",

        alt:
          img.getAttribute("alt") || "",

        title:
          img.getAttribute("title") || "",

        class:
          img.getAttribute("class") || "",

        id:
          img.id || ""
      };


      const joined =
        Object.values(data)
          .join(" ");

      if (
        keywords.some(
          k => joined.includes(k)
        ) ||
        /property|attribute|type|status|icon/i
          .test(joined)
      ) {

        images.push(data);
      }
    });


  /* ------------------------------
     属性候補になりそうな全要素
     ------------------------------ */

  const candidateElements = [];

  doc
    .querySelectorAll(
      "[class],[id],[title],[alt],[data-type],[data-property]"
    )
    .forEach(el => {

      const attrs = {
        tag:
          el.tagName,

        id:
          el.id || "",

        class:
          el.getAttribute("class") || "",

        title:
          el.getAttribute("title") || "",

        alt:
          el.getAttribute("alt") || "",

        data_type:
          el.getAttribute("data-type") || "",

        data_property:
          el.getAttribute("data-property") || ""
      };


      const text =
        cleanText(
          el.textContent
        ).slice(0, 250);


      const combined =
        [
          ...Object.values(attrs),
          text
        ].join(" ");


      if (
        keywords.some(
          k => combined.includes(k)
        ) ||
        /property|attribute|card_type|cardtype|element/i
          .test(combined)
      ) {

        candidateElements.push({
          ...attrs,
          text
        });
      }
    });


  /* ------------------------------
     「戦・飛・魔・獣」文字の周辺
     ------------------------------ */

  const bodyText =
    cleanText(
      doc.body.textContent
    );


  const textHits = [];

  ["戦", "飛", "魔", "獣"]
    .forEach(keyword => {

      let start = 0;

      while (true) {

        const index =
          bodyText.indexOf(
            keyword,
            start
          );

        if (index < 0) {
          break;
        }

        textHits.push({
          keyword,

          context:
            bodyText.slice(
              Math.max(
                0,
                index - 80
              ),
              Math.min(
                bodyText.length,
                index + 81
              )
            )
        });

        start =
          index + 1;

        if (
          textHits.filter(
            x =>
              x.keyword === keyword
          ).length >= 10
        ) {
          break;
        }
      }
    });


  /* ------------------------------
     カードステータス付近HTML
     ------------------------------ */

  const statusSelectors = [
    "#card_status",
    "#page_card_albumDetail",
    ".card_status",
    '[id*="status"]',
    '[class*="status"]',
    '[id*="property"]',
    '[class*="property"]'
  ];

  const statusHtml = [];

  statusSelectors.forEach(selector => {

    doc
      .querySelectorAll(selector)
      .forEach(el => {

        statusHtml.push({
          selector,
          tag:
            el.tagName,

          id:
            el.id || "",

          class:
            el.getAttribute("class") || "",

          text:
            cleanText(
              el.textContent
            ).slice(
              0,
              1000
            ),

          html:
            el.outerHTML.slice(
              0,
              4000
            )
        });
      });
  });


  /* ------------------------------
     input / hidden値
     ------------------------------ */

  const inputs = [];

  doc
    .querySelectorAll(
      "input,select,option"
    )
    .forEach(el => {

      const row = {
        tag:
          el.tagName,

        type:
          el.getAttribute("type") || "",

        name:
          el.getAttribute("name") || "",

        id:
          el.id || "",

        value:
          el.getAttribute("value") || "",

        text:
          cleanText(
            el.textContent
          )
      };


      const joined =
        Object.values(row)
          .join(" ");


      if (
        /property|attribute|type|card/i
          .test(joined) ||
        keywords.some(
          k => joined.includes(k)
        )
      ) {
        inputs.push(row);
      }
    });


  /* ------------------------------
     script内候補
     ------------------------------ */

  const scriptHits = [];

  doc
    .querySelectorAll("script")
    .forEach((script, i) => {

      const text =
        script.textContent || "";

      if (
        /property|attribute|card[_-]?type/i
          .test(text)
      ) {

        const matches =
          text.match(
            /.{0,150}(?:property|attribute|card[_-]?type).{0,250}/gi
          ) || [];

        scriptHits.push({
          script_index: i,
          contexts:
            matches.slice(0, 10)
        });
      }
    });


  /* ------------------------------
     srcから直接推測できそうな属性画像
     ------------------------------ */

  const probableAttributeImages =
    images.filter(x =>
      /property|attribute|type|zokusei|status/i
        .test(
          [
            x.src,
            x.class,
            x.id,
            x.alt,
            x.title
          ].join(" ")
        )
    );


  return {
    card_no:
      String(cardNo),

    card_name:
      cardName || "",

    images,

    probable_attribute_images:
      probableAttributeImages,

    candidate_elements:
      candidateElements.slice(0, 150),

    text_hits:
      textHits,

    inputs,

    script_hits:
      scriptHits,

    status_html:
      statusHtml.slice(0, 40)
  };
}


/* ========================================
   1枚解析
   ======================================== */

async function inspectCard(
  cardNo,
  cardName
) {

  const { doc } =
    await fetchDetail(
      cardNo
    );

  return inspectAttribute(
    doc,
    cardNo,
    cardName
  );
}


/* ========================================
   JSON出力
   ======================================== */

function exportJson(rows) {

  const payload = {
    meta: {
      type:
        "jolly_attribute_inspection",

      version:
        VERSION,

      count:
        rows.length,

      exported_at:
        new Date()
          .toISOString()
    },

    cards:
      rows
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
    URL.createObjectURL(blob);


  const a =
    document.createElement("a");

  a.href =
    url;

  a.download =
    "jolly_attribute_inspection_" +
    rows.length +
    ".json";


  document.body
    .appendChild(a);

  a.click();

  a.remove();


  setTimeout(
    () =>
      URL.revokeObjectURL(url),
    5000
  );
}


/* ========================================
   パネル
   ======================================== */

document
  .getElementById(PANEL_ID)
  ?.remove();


let busy = false;

let results =
  loadResults();


const root =
  document.createElement("div");

root.id =
  PANEL_ID;


root.innerHTML = `

<style>

#${PANEL_ID} {
  position:fixed;
  inset:0;
  z-index:2147483647;
  background:rgba(0,0,0,.58);
  display:flex;
  align-items:flex-end;
  justify-content:center;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  color:#111;
  text-shadow:none;
}

#${PANEL_ID} * {
  box-sizing:border-box;
}

#${PANEL_ID} .panel {
  width:100%;
  max-width:700px;
  max-height:90vh;
  overflow:auto;
  background:#f5f6f8;
  border-radius:20px 20px 0 0;
  padding:
    14px
    14px
    calc(
      16px +
      env(safe-area-inset-bottom)
    );
}

#${PANEL_ID} .head {
  display:flex;
  justify-content:space-between;
  align-items:center;
}

#${PANEL_ID} .title {
  font-size:18px;
  font-weight:800;
}

#${PANEL_ID} .small {
  font-size:12px;
  color:#666;
}

#${PANEL_ID} .box {
  background:#fff;
  border:1px solid #ddd;
  border-radius:14px;
  padding:12px;
  margin-top:10px;
}

#${PANEL_ID} .grid {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
  margin-top:10px;
}

#${PANEL_ID} button {
  border:1px solid #ccd0d5;
  border-radius:12px;
  background:#fff;
  color:#111;
  padding:11px 9px;
  font-size:14px;
  font-weight:700;
}

#${PANEL_ID} button.primary {
  background:#111827;
  color:#fff;
}

#${PANEL_ID} button.danger {
  color:#b42318;
}

#${PANEL_ID} button:disabled {
  opacity:.45;
}

#${PANEL_ID} input {
  width:100%;
  padding:11px;
  border:1px solid #ccd0d5;
  border-radius:10px;
  font-size:16px;
}

#${PANEL_ID} .close {
  width:36px;
  height:36px;
  padding:0;
  border-radius:999px;
}

#${PANEL_ID} .log {
  white-space:pre-wrap;
  background:#111827;
  color:#fff;
  padding:10px;
  border-radius:12px;
  min-height:100px;
  max-height:220px;
  overflow:auto;
  font:
    12px
    ui-monospace,
    Menlo,
    monospace;
}

</style>


<div class="panel">

  <div class="head">

    <div>

      <div class="title">
        JOLLY 属性構造検証
      </div>

      <div class="small">
        ${VERSION}
      </div>

    </div>

    <button
      class="close"
      id="ja-close">
      ×
    </button>

  </div>


  <div class="box">

    <div class="small">
      目録：
      ${catalog.length}件
    </div>

    <div class="small">
      保存済み検証：
      <b id="ja-count">
        ${results.length}
      </b>
      件
    </div>

  </div>


  <div class="box">

    <div class="small">
      任意card_no
    </div>

    <input
      id="ja-cardno"
      inputmode="numeric"
      placeholder="例：30"
    >

  </div>


  <div class="grid">

    <button
      class="primary"
      id="ja-first10">

      先頭10枚を検証

    </button>


    <button
      id="ja-single">

      指定カードを検証

    </button>


    <button
      id="ja-export">

      JSONを書き出す

    </button>


    <button
      class="danger"
      id="ja-reset">

      検証結果を削除

    </button>


    <button
      id="ja-close2">

      閉じる

    </button>

  </div>


  <div class="box">

    <div class="small">
      実行ログ
    </div>

    <div
      class="log"
      id="ja-log">

      準備完了

    </div>

  </div>

</div>
`;


document.body
  .appendChild(root);


const $ =
  q =>
    root.querySelector(q);


function log(message) {

  const t =
    new Date()
      .toLocaleTimeString();

  $("#ja-log")
    .textContent =
    "[" +
    t +
    "] " +
    message +
    "\n" +
    $("#ja-log")
      .textContent;
}


function render() {

  results =
    loadResults();

  $("#ja-count")
    .textContent =
    results.length;

  $("#ja-first10")
    .disabled =
    busy;

  $("#ja-single")
    .disabled =
    busy;

  $("#ja-export")
    .disabled =
    busy ||
    !results.length;

  $("#ja-reset")
    .disabled =
    busy;
}


/* ========================================
   先頭10枚
   ======================================== */

$("#ja-first10")
.onclick =
async () => {

  if (busy) return;

  if (
    catalog.length < 10
  ) {

    log(
      "目録を読み込めません"
    );

    return;
  }


  busy = true;
  render();


  const newRows = [];


  try {

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

      const card =
        targets[i];


      log(
        `${i + 1}/10 ` +
        `${card.card_no} ` +
        `${card.card_name}`
      );


      try {

        const row =
          await inspectCard(
            card.card_no,
            card.card_name
          );


        newRows.push(
          row
        );


        log(
          `OK ` +
          `images=${row.images.length} ` +
          `candidates=${row.candidate_elements.length}`
        );


      } catch(e) {

        log(
          "ERROR " +
          card.card_no +
          ": " +
          (
            e?.message ||
            String(e)
          )
        );
      }


      await sleep(
        WAIT_MS
      );
    }


    results =
      mergeRows(
        loadResults(),
        newRows
      );


    saveResults(
      results
    );


    log(
      "10枚検証完了"
    );


  } finally {

    busy = false;
    render();
  }
};


/* ========================================
   任意カード
   ======================================== */

$("#ja-single")
.onclick =
async () => {

  if (busy) return;


  const cardNo =
    cleanText(
      $("#ja-cardno").value
    );


  if (!cardNo) {

    log(
      "card_noを入力してください"
    );

    return;
  }


  const catalogRow =
    catalog.find(
      x =>
        String(x.card_no) ===
        String(cardNo)
    );


  busy = true;
  render();


  try {

    log(
      "取得中：" +
      cardNo
    );


    const row =
      await inspectCard(
        cardNo,
        catalogRow
          ?.card_name ||
        ""
      );


    results =
      mergeRows(
        loadResults(),
        [row]
      );


    saveResults(
      results
    );


    log(
      "OK " +
      cardNo +
      " / images=" +
      row.images.length +
      " / candidates=" +
      row.candidate_elements.length
    );


  } catch(e) {

    log(
      "ERROR " +
      (
        e?.message ||
        String(e)
      )
    );


  } finally {

    busy = false;
    render();
  }
};


/* ========================================
   Export
   ======================================== */

$("#ja-export")
.onclick =
() => {

  results =
    loadResults();

  exportJson(
    results
  );

  log(
    "JSONを書き出しました"
  );
};


/* ========================================
   Reset
   ======================================== */

$("#ja-reset")
.onclick =
() => {

  if (
    !confirm(
      "属性検証結果だけを削除しますか？"
    )
  ) {
    return;
  }


  localStorage.removeItem(
    STORAGE_KEY
  );


  results = [];

  render();

  log(
    "検証結果を削除しました"
  );
};


$("#ja-close")
.onclick =
() =>
  root.remove();


$("#ja-close2")
.onclick =
() =>
  root.remove();


render();


if (
  typeof completion ===
  "function"
) {

  completion(
    JSON.stringify({
      ok: true,
      panel: true,
      version:
        VERSION,
      catalog_count:
        catalog.length,
      inspection_count:
        results.length
    })
  );
}

})();
