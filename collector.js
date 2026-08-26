(async () => {
"use strict";

/* =========================================================
   JOLLY CARD PROPERTY COLLECTOR
   property-collector-v1.0

   属性対応
   1 = 戦
   2 = 魔
   3 = 飛
   4 = 獣
   9 = 船

   ・各属性のAlbum一覧を巡回
   ・card_noだけ取得
   ・進捗保存
   ・途中再開
   ・エラー記録
   ・JSON書き出し
   ========================================================= */

const VERSION = "property-collector-v1.0";

const PANEL_ID =
  "jolly-property-collector";

const STORAGE_KEY =
  "jolly_card_properties_v1";

const WAIT_MS = 350;


/* =========================================================
   属性定義
   ========================================================= */

const PROPERTIES = [
  {
    id: 1,
    name: "戦"
  },
  {
    id: 2,
    name: "魔"
  },
  {
    id: 3,
    name: "飛"
  },
  {
    id: 4,
    name: "獣"
  },
  {
    id: 9,
    name: "船"
  }
];


/* =========================================================
   共通
   ========================================================= */

const sleep = ms =>
  new Promise(resolve =>
    setTimeout(resolve, ms)
  );


function cleanText(v) {

  return String(v ?? "")
    .replace(/\s+/g, " ")
    .trim();
}


/* =========================================================
   保存状態
   ========================================================= */

function emptyState() {

  return {
    version:
      VERSION,

    current_property_index:
      0,

    current_page:
      0,

    finished:
      false,

    cards: [],

    property_summary: {},

    errors: [],

    updated_at:
      null
  };
}


function loadState() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(
          STORAGE_KEY
        ) || "null"
      );


    if (
      saved &&
      Array.isArray(saved.cards)
    ) {

      return saved;
    }

  } catch(e) {}


  return emptyState();
}


function saveState(state) {

  state.version =
    VERSION;

  state.updated_at =
    new Date()
      .toISOString();


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );
}


/* =========================================================
   card_no重複排除
   ========================================================= */

function mergeCards(cards) {

  const map =
    new Map();


  for (
    const card of cards
  ) {

    if (
      !card ||
      !card.card_no
    ) {
      continue;
    }


    const key =
      String(
        card.card_no
      );


    /*
     * 原則1カード=1属性。
     *
     * 万一複数属性に出た場合でも
     * データを捨てずpropertiesとして残す。
     */

    if (
      !map.has(key)
    ) {

      map.set(
        key,
        {
          card_no:
            key,

          card_name:
            card.card_name || "",

          property_id:
            card.property_id,

          property:
            card.property,

          properties: [
            {
              property_id:
                card.property_id,

              property:
                card.property
            }
          ]
        }
      );

    } else {

      const existing =
        map.get(key);


      const already =
        existing.properties
          .some(
            x =>
              Number(
                x.property_id
              ) ===
              Number(
                card.property_id
              )
          );


      if (!already) {

        existing.properties.push({
          property_id:
            card.property_id,

          property:
            card.property
        });
      }
    }
  }


  return [
    ...map.values()
  ]
  .sort(
    (a,b) =>
      Number(a.card_no) -
      Number(b.card_no)
  );
}


/* =========================================================
   Album URL
   ========================================================= */

function buildUrl(
  propertyId,
  page
) {

  return (
    "/?M=Card&A=Album" +
    "&property=" +
    encodeURIComponent(
      propertyId
    ) +
    "&name_text=" +
    "&rare=" +
    "&gacha_style=0" +
    "&year=0" +
    "&skill_no=" +
    "&card_no=" +
    "&p=" +
    encodeURIComponent(
      page
    )
  );
}


/* =========================================================
   Album取得
   ========================================================= */

async function fetchAlbum(
  propertyId,
  page
) {

  const response =
    await fetch(
      buildUrl(
        propertyId,
        page
      ),
      {
        credentials:
          "same-origin",

        cache:
          "no-store"
      }
    );


  if (!response.ok) {

    throw new Error(
      "HTTP " +
      response.status
    );
  }


  const html =
    await response.text();


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
      "ログインセッション切れ"
    );
  }


  const doc =
    new DOMParser()
      .parseFromString(
        html,
        "text/html"
      );


  return {
    html,
    doc
  };
}


/* =========================================================
   最大ページ検出
   ========================================================= */

function detectTotalPages(
  doc,
  propertyId
) {

  let maxPage = 0;


  doc
    .querySelectorAll(
      'a[href*="A=Album"][href*="p="]'
    )
    .forEach(a => {

      try {

        const u =
          new URL(
            a.getAttribute(
              "href"
            ),
            location.href
          );


        const property =
          u.searchParams.get(
            "property"
          );


        if (
          String(property) !==
          String(propertyId)
        ) {
          return;
        }


        const page =
          Number(
            u.searchParams.get(
              "p"
            )
          );


        if (
          Number.isFinite(page)
        ) {

          maxPage =
            Math.max(
              maxPage,
              page
            );
        }

      } catch(e) {}
    });


  return maxPage + 1;
}


/* =========================================================
   カード抽出
   ========================================================= */

function extractCards(
  doc,
  property
) {

  const rows = [];


  doc
    .querySelectorAll(
      'a[href*="A=AlbumDetail"][href*="card="]'
    )
    .forEach(a => {

      try {

        const u =
          new URL(
            a.getAttribute(
              "href"
            ),
            location.href
          );


        const cardNo =
          u.searchParams.get(
            "card"
          );


        if (!cardNo) {
          return;
        }


        const box =
          a.closest(
            ".ui-bar-c"
          );


        const name =
          cleanText(
            box
              ?.querySelector(
                "font"
              )
              ?.textContent ||
            ""
          );


        rows.push({
          card_no:
            String(
              cardNo
            ),

          card_name:
            name,

          property_id:
            property.id,

          property:
            property.name
        });

      } catch(e) {}
    });


  return [
    ...new Map(
      rows.map(
        x => [
          x.card_no,
          x
        ]
      )
    ).values()
  ];
}


/* =========================================================
   属性1種類の全ページ取得
   ========================================================= */

async function collectCurrentProperty(
  log,
  render
) {

  let state =
    loadState();


  const property =
    PROPERTIES[
      state.current_property_index
    ];


  if (!property) {

    state.finished =
      true;

    saveState(
      state
    );

    return;
  }


  /*
   * 最初のページを取得して
   * 総ページ数を把握
   */

  let firstResult =
    null;


  if (
    state.current_page === 0
  ) {

    log(
      `${property.name}属性のページ数確認中…`
    );


    firstResult =
      await fetchAlbum(
        property.id,
        0
      );


    const totalPages =
      detectTotalPages(
        firstResult.doc,
        property.id
      );


    state.property_summary[
      property.name
    ] = {
      property_id:
        property.id,

      total_pages:
        totalPages,

      collected_pages:
        0,

      card_count:
        0
    };


    saveState(
      state
    );
  }


  const summary =
    state.property_summary[
      property.name
    ];


  const totalPages =
    summary.total_pages;


  for (
    let page =
      state.current_page;

    page <
      totalPages;

    page++
  ) {

    try {

      log(
        `${property.name} ` +
        `${page + 1}/${totalPages}ページ取得中…`
      );


      let result;


      if (
        page === 0 &&
        firstResult
      ) {

        result =
          firstResult;

      } else {

        result =
          await fetchAlbum(
            property.id,
            page
          );
      }


      const cards =
        extractCards(
          result.doc,
          property
        );


      state.cards =
        mergeCards([
          ...state.cards,
          ...cards
        ]);


      summary.collected_pages =
        page + 1;


      const countForProperty =
        state.cards
          .filter(
            x =>
              x.properties
                .some(
                  p =>
                    Number(
                      p.property_id
                    ) ===
                    Number(
                      property.id
                    )
                )
          )
          .length;


      summary.card_count =
        countForProperty;


      state.current_page =
        page + 1;


      saveState(
        state
      );


      await render();


      log(
        `${property.name} ` +
        `${cards.length}件 / ` +
        `属性累計${countForProperty}件`
      );


      await sleep(
        WAIT_MS
      );


    } catch(e) {

      state.errors.push({

        property_id:
          property.id,

        property:
          property.name,

        page,

        error:
          e?.message ||
          String(e),

        failed_at:
          new Date()
            .toISOString()
      });


      saveState(
        state
      );


      throw e;
    }
  }


  /*
   * この属性完了
   */

  log(
    `${property.name}属性完了：` +
    `${summary.card_count}件`
  );


  state.current_property_index++;

  state.current_page = 0;


  if (
    state.current_property_index >=
    PROPERTIES.length
  ) {

    state.finished =
      true;
  }


  saveState(
    state
  );


  await render();
}


/* =========================================================
   全属性を続けて取得
   ========================================================= */

async function collectAll(
  log,
  render
) {

  let state =
    loadState();


  while (
    !state.finished
  ) {

    await collectCurrentProperty(
      log,
      render
    );


    state =
      loadState();


    await sleep(
      500
    );
  }
}


/* =========================================================
   JSON Export
   ========================================================= */

function exportJson(
  state
) {

  const payload = {

    meta: {

      type:
        "jolly_card_properties",

      version:
        VERSION,

      total_cards:
        state.cards.length,

      finished:
        state.finished,

      property_summary:
        state.property_summary,

      error_count:
        state.errors.length,

      exported_at:
        new Date()
          .toISOString(),

      source:
        location.origin
    },


    properties:
      PROPERTIES,


    cards:
      state.cards,


    errors:
      state.errors
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


  a.href =
    url;


  a.download =
    "jolly_card_properties_" +
    state.cards.length +
    ".json";


  document.body
    .appendChild(
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


/* =========================================================
   UI
   ========================================================= */

document
  .getElementById(
    PANEL_ID
  )
  ?.remove();


let busy =
  false;


const root =
  document.createElement(
    "div"
  );


root.id =
  PANEL_ID;


root.innerHTML = `

<style>

#${PANEL_ID} {

  position:fixed;

  inset:0;

  z-index:2147483647;

  background:
    rgba(0,0,0,.58);

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

  box-sizing:
    border-box;
}


#${PANEL_ID} .panel {

  width:100%;

  max-width:700px;

  max-height:90vh;

  overflow:auto;

  background:#f5f6f8;

  border-radius:
    20px 20px 0 0;

  padding:
    14px
    14px
    calc(
      16px +
      env(
        safe-area-inset-bottom
      )
    );
}


#${PANEL_ID} .head {

  display:flex;

  justify-content:
    space-between;

  align-items:center;
}


#${PANEL_ID} .title {

  font-size:18px;

  font-weight:800;
}


#${PANEL_ID} .small {

  font-size:12px;

  color:#666;

  line-height:1.5;
}


#${PANEL_ID} .big {

  font-size:24px;

  font-weight:800;
}


#${PANEL_ID} .box {

  background:#fff;

  border:
    1px solid #ddd;

  border-radius:14px;

  padding:12px;

  margin-top:10px;
}


#${PANEL_ID} .grid {

  display:grid;

  grid-template-columns:
    1fr 1fr;

  gap:8px;

  margin-top:10px;
}


#${PANEL_ID} button {

  border:
    1px solid #ccd0d5;

  border-radius:12px;

  background:#fff;

  color:#111;

  padding:11px;

  font-size:14px;

  font-weight:700;
}


#${PANEL_ID} button.primary {

  background:
    #111827;

  color:#fff;
}


#${PANEL_ID} button.danger {

  color:#b42318;
}


#${PANEL_ID} button:disabled {

  opacity:.45;
}


#${PANEL_ID} .close {

  width:36px;

  height:36px;

  padding:0;

  border-radius:
    999px;
}


#${PANEL_ID} .log {

  white-space:
    pre-wrap;

  background:
    #111827;

  color:#fff;

  padding:10px;

  border-radius:12px;

  min-height:120px;

  max-height:240px;

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
        JOLLY カード属性収集
      </div>

      <div class="small">
        ${VERSION}
      </div>

    </div>


    <button
      class="close"
      id="jpc-close">
      ×
    </button>

  </div>


  <div class="box">

    <div class="small">
      属性付与済みカード
    </div>


    <div class="big">

      <span
        id="jpc-count">
        0
      </span>

      / 1359

    </div>


    <div
      class="small"
      id="jpc-status">

      状態確認中…

    </div>

  </div>


  <div class="box">

    <div
      class="small"
      id="jpc-summary">

      戦：未取得<br>
      魔：未取得<br>
      飛：未取得<br>
      獣：未取得<br>
      船：未取得

    </div>

  </div>


  <div class="grid">


    <button
      class="primary"
      id="jpc-current">

      現在の属性を取得

    </button>


    <button
      class="primary"
      id="jpc-all">

      全属性を連続取得

    </button>


    <button
      id="jpc-export">

      JSONを書き出す

    </button>


    <button
      id="jpc-refresh">

      状態を再読込

    </button>


    <button
      class="danger"
      id="jpc-reset">

      属性進捗をリセット

    </button>


    <button
      id="jpc-close2">

      閉じる

    </button>

  </div>


  <div class="box">

    <div class="small">
      実行ログ
    </div>


    <div
      class="log"
      id="jpc-log">

      準備完了

    </div>

  </div>

</div>
`;


document.body
  .appendChild(
    root
  );


const $ =
  q =>
    root.querySelector(
      q
    );


function log(message) {

  const time =
    new Date()
      .toLocaleTimeString();


  $("#jpc-log")
    .textContent =
    "[" +
    time +
    "] " +
    message +
    "\n" +
    $("#jpc-log")
      .textContent;
}


/* =========================================================
   表示
   ========================================================= */

async function render() {

  const state =
    loadState();


  $("#jpc-count")
    .textContent =
    state.cards.length;


  let status;


  if (
    state.finished
  ) {

    status =
      state.errors.length
        ? "全属性取得済み / エラーあり"
        : "全属性取得完了";

  } else {

    const property =
      PROPERTIES[
        state.current_property_index
      ];


    status =
      property
        ? (
          "次：" +
          property.name +
          "属性 / " +
          (
            state.current_page +
            1
          ) +
          "ページ目"
        )
        : "完了";
  }


  $("#jpc-status")
    .textContent =
    status;


  const summaryLines =
    PROPERTIES.map(p => {

      const s =
        state.property_summary[
          p.name
        ];


      if (!s) {

        return (
          p.name +
          "：未取得"
        );
      }


      return (
        p.name +
        "：" +
        s.card_count +
        "件 / " +
        s.collected_pages +
        "/" +
        s.total_pages +
        "ページ"
      );
    });


  $("#jpc-summary")
    .innerHTML =
    summaryLines.join(
      "<br>"
    );


  $("#jpc-current")
    .disabled =
    busy ||
    state.finished;


  $("#jpc-all")
    .disabled =
    busy ||
    state.finished;


  $("#jpc-export")
    .disabled =
    busy ||
    state.cards.length === 0;


  $("#jpc-reset")
    .disabled =
    busy;
}


/* =========================================================
   ボタン
   ========================================================= */

$("#jpc-current")
.onclick =
async () => {

  if (busy) {
    return;
  }


  busy = true;

  await render();


  try {

    await collectCurrentProperty(
      log,
      render
    );

  } catch(e) {

    log(
      "ERROR: " +
      (
        e?.message ||
        String(e)
      )
    );

  } finally {

    busy = false;

    await render();
  }
};


$("#jpc-all")
.onclick =
async () => {

  if (busy) {
    return;
  }


  if (
    !confirm(
      "戦・魔・飛・獣・船を連続取得します。\n\nSafariをこの画面のままにしてください。\n\n続行しますか？"
    )
  ) {

    return;
  }


  busy = true;

  await render();


  try {

    await collectAll(
      log,
      render
    );


    log(
      "全属性の収集が終了しました"
    );


  } catch(e) {

    log(
      "ERROR: " +
      (
        e?.message ||
        String(e)
      )
    );


  } finally {

    busy = false;

    await render();
  }
};


$("#jpc-export")
.onclick =
() => {

  const state =
    loadState();


  exportJson(
    state
  );


  log(
    "JSONを書き出しました"
  );
};


$("#jpc-refresh")
.onclick =
async () => {

  await render();


  const state =
    loadState();


  log(
    "保存済み：" +
    state.cards.length +
    "件 / エラー=" +
    state.errors.length
  );
};


$("#jpc-reset")
.onclick =
async () => {

  if (
    !confirm(
      "属性収集の進捗をすべて削除しますか？\n\nカード詳細1,359件のデータには影響しません。"
    )
  ) {

    return;
  }


  localStorage.removeItem(
    STORAGE_KEY
  );


  await render();


  log(
    "属性収集をリセットしました"
  );
};


$("#jpc-close")
.onclick =
() =>
  root.remove();


$("#jpc-close2")
.onclick =
() =>
  root.remove();


/* =========================================================
   初期表示
   ========================================================= */

await render();


const initial =
  loadState();


log(
  "保存済み属性カード=" +
  initial.cards.length
);


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

      card_count:
        initial.cards.length,

      finished:
        initial.finished
    })
  );
}

})();
