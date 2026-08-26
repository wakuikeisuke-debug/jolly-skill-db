(async () => {
"use strict";

const VERSION = "property-filter-inspector-v1.0";
const PANEL_ID = "jolly-property-filter-inspector";
const STORAGE_KEY = "jolly_property_filter_inspector_v1";

function cleanText(v) {
  return String(v ?? "")
    .replace(/\s+/g, " ")
    .trim();
}


/* ========================================
   保存
   ======================================== */

function saveResult(data) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}


function loadResult() {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "null"
    );
  } catch (e) {
    return null;
  }
}


/* ========================================
   Album取得
   ======================================== */

async function fetchAlbum(url = null) {

  const target =
    url ||
    "/?M=Card&A=Album" +
    "&property=" +
    "&name_text=" +
    "&rare=" +
    "&gacha_style=0" +
    "&year=0" +
    "&skill_no=" +
    "&card_no=" +
    "&p=0";


  const response =
    await fetch(
      target,
      {
        credentials: "same-origin",
        cache: "no-store"
      }
    );


  if (!response.ok) {
    throw new Error(
      "HTTP " + response.status
    );
  }


  const html =
    await response.text();


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


  return {
    html,
    doc,
    url:
      new URL(
        target,
        location.href
      ).href
  };
}


/* ========================================
   property関連リンク
   ======================================== */

function inspectLinks(doc) {

  const rows = [];


  doc
    .querySelectorAll("a[href]")
    .forEach(a => {

      const href =
        a.getAttribute("href") || "";


      if (
        !href.includes("property")
      ) {
        return;
      }


      try {

        const u =
          new URL(
            href,
            location.href
          );


        rows.push({
          text:
            cleanText(
              a.textContent
            ),

          href:
            u.href,

          property:
            u.searchParams.get(
              "property"
            ),

          M:
            u.searchParams.get("M"),

          A:
            u.searchParams.get("A"),

          page:
            u.searchParams.get("p")
        });

      } catch (e) {

        rows.push({
          text:
            cleanText(
              a.textContent
            ),

          href,

          property:
            null
        });
      }
    });


  return rows;
}


/* ========================================
   select / option
   ======================================== */

function inspectSelects(doc) {

  return [
    ...doc.querySelectorAll(
      "select"
    )
  ]
  .map(select => ({

    name:
      select.getAttribute(
        "name"
      ) || "",

    id:
      select.id || "",

    class:
      select.getAttribute(
        "class"
      ) || "",

    value:
      select.value || "",

    options:
      [
        ...select.querySelectorAll(
          "option"
        )
      ]
      .map(option => ({

        text:
          cleanText(
            option.textContent
          ),

        value:
          option.getAttribute(
            "value"
          ),

        selected:
          option.hasAttribute(
            "selected"
          )
      }))
  }));
}


/* ========================================
   radio / checkbox / hidden
   ======================================== */

function inspectInputs(doc) {

  return [
    ...doc.querySelectorAll(
      "input"
    )
  ]
  .map(input => ({

    type:
      input.getAttribute(
        "type"
      ) || "",

    name:
      input.getAttribute(
        "name"
      ) || "",

    id:
      input.id || "",

    value:
      input.getAttribute(
        "value"
      ) || "",

    checked:
      input.checked || false
  }))
  .filter(row => {

    const joined =
      Object.values(row)
        .join(" ");

    return (
      /property/i.test(joined) ||
      [
        "radio",
        "checkbox",
        "hidden"
      ].includes(row.type)
    );
  });
}


/* ========================================
   form
   ======================================== */

function inspectForms(doc) {

  return [
    ...doc.querySelectorAll(
      "form"
    )
  ]
  .map(form => ({

    action:
      form.getAttribute(
        "action"
      ) || "",

    method:
      form.getAttribute(
        "method"
      ) || "",

    id:
      form.id || "",

    name:
      form.getAttribute(
        "name"
      ) || "",

    text:
      cleanText(
        form.textContent
      ).slice(0, 1000),

    controls:
      [
        ...form.querySelectorAll(
          "input,select,button"
        )
      ]
      .map(el => ({
        tag:
          el.tagName,

        type:
          el.getAttribute(
            "type"
          ) || "",

        name:
          el.getAttribute(
            "name"
          ) || "",

        id:
          el.id || "",

        value:
          el.getAttribute(
            "value"
          ) || "",

        text:
          cleanText(
            el.textContent
          ).slice(0, 200)
      }))
  }));
}


/* ========================================
   propertyという文字があるHTML周辺
   ======================================== */

function inspectPropertyHtml(html) {

  const hits = [];

  const lower =
    html.toLowerCase();

  let start = 0;


  while (true) {

    const index =
      lower.indexOf(
        "property",
        start
      );


    if (index < 0) {
      break;
    }


    hits.push(
      html.slice(
        Math.max(
          0,
          index - 300
        ),
        Math.min(
          html.length,
          index + 700
        )
      )
    );


    start =
      index + 8;


    if (
      hits.length >= 40
    ) {
      break;
    }
  }


  return hits;
}


/* ========================================
   スクリプト内property
   ======================================== */

function inspectScripts(doc) {

  const rows = [];


  doc
    .querySelectorAll(
      "script"
    )
    .forEach(
      (script, index) => {

        const text =
          script.textContent || "";


        if (
          !/property/i.test(text)
        ) {
          return;
        }


        const contexts =
          text.match(
            /.{0,250}property.{0,500}/gi
          ) || [];


        rows.push({
          script_index:
            index,

          contexts:
            contexts.slice(
              0,
              20
            )
        });
      }
    );


  return rows;
}


/* ========================================
   属性文字そのもの
   ======================================== */

function inspectAttributeTexts(doc) {

  const results = [];

  const keywords = [
    "戦",
    "飛",
    "魔",
    "獣",
    "属性"
  ];


  doc
    .querySelectorAll(
      "option,label,a,span,div,td,th"
    )
    .forEach(el => {

      const text =
        cleanText(
          el.textContent
        );


      if (
        !text ||
        text.length > 100
      ) {
        return;
      }


      if (
        keywords.some(
          k =>
            text === k ||
            text.includes(
              k + "属性"
            ) ||
            text.includes(
              "属性" + k
            )
        )
      ) {

        results.push({
          tag:
            el.tagName,

          text,

          id:
            el.id || "",

          class:
            el.getAttribute(
              "class"
            ) || "",

          href:
            el.getAttribute(
              "href"
            ) || "",

          value:
            el.getAttribute(
              "value"
            ) || "",

          name:
            el.getAttribute(
              "name"
            ) || "",

          html:
            el.outerHTML.slice(
              0,
              1000
            )
        });
      }
    });


  return results;
}


/* ========================================
   既知候補値の自動テスト
   ======================================== */

async function testPropertyValues(
  values
) {

  const results = [];


  for (
    const value of values
  ) {

    const url =
      "/?M=Card&A=Album" +
      "&property=" +
      encodeURIComponent(value) +
      "&name_text=" +
      "&rare=" +
      "&gacha_style=0" +
      "&year=0" +
      "&skill_no=" +
      "&card_no=" +
      "&p=0";


    try {

      const {
        doc,
        url: resolvedUrl
      } =
        await fetchAlbum(url);


      const cards = [];


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


            if (
              !cardNo
            ) {
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


            cards.push({
              card_no:
                cardNo,

              card_name:
                name
            });

          } catch (e) {}
        });


      const uniqueCards =
        Array.from(
          new Map(
            cards.map(
              x => [
                x.card_no,
                x
              ]
            )
          ).values()
        );


      const bodyText =
        cleanText(
          doc.body.textContent
        );


      results.push({

        property_value:
          String(value),

        resolved_url:
          resolvedUrl,

        card_count_page1:
          uniqueCards.length,

        first_cards:
          uniqueCards.slice(
            0,
            12
          ),

        page_title:
          cleanText(
            doc.querySelector(
              "title"
            )?.textContent
          ),

        likely_heading:
          bodyText.slice(
            0,
            700
          )
      });


    } catch (e) {

      results.push({
        property_value:
          String(value),

        error:
          e?.message ||
          String(e)
      });
    }


    await new Promise(
      r =>
        setTimeout(
          r,
          350
        )
    );
  }


  return results;
}


/* ========================================
   全診断
   ======================================== */

async function runInspection() {

  const {
    html,
    doc,
    url
  } =
    await fetchAlbum();


  const result = {

    meta: {
      type:
        "jolly_property_filter_inspection",

      version:
        VERSION,

      inspected_at:
        new Date()
          .toISOString(),

      source_url:
        url
    },


    links:
      inspectLinks(
        doc
      ),


    selects:
      inspectSelects(
        doc
      ),


    inputs:
      inspectInputs(
        doc
      ),


    forms:
      inspectForms(
        doc
      ),


    attribute_text_elements:
      inspectAttributeTexts(
        doc
      ),


    property_html_contexts:
      inspectPropertyHtml(
        html
      ),


    script_hits:
      inspectScripts(
        doc
      ),


    /* 値が小さい整数である可能性を調査 */
    property_value_tests:
      await testPropertyValues([
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12
      ])
  };


  saveResult(
    result
  );


  return result;
}


/* ========================================
   JSON Export
   ======================================== */

function exportJson(result) {

  const blob =
    new Blob(
      [
        JSON.stringify(
          result,
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
    "jolly_property_filter_inspection.json";


  document.body
    .appendChild(a);


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


/* ========================================
   UI
   ======================================== */

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
  line-height:1.5;
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
  grid-template-columns:
    1fr 1fr;
  gap:8px;
  margin-top:10px;
}

#${PANEL_ID} button {
  border:1px solid #ccd0d5;
  border-radius:12px;
  background:#fff;
  color:#111;
  padding:11px;
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
  min-height:110px;
  max-height:230px;
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
        JOLLY 属性フィルタ値特定
      </div>

      <div class="small">
        ${VERSION}
      </div>

    </div>


    <button
      class="close"
      id="jpf-close">
      ×
    </button>

  </div>


  <div class="box">

    <div class="small">

      Album一覧ページから
      property= の値、
      select / option / radio /
      form / link を調査します。

      <br><br>

      さらに
      property=0〜12を自動テストします。

    </div>

  </div>


  <div class="grid">

    <button
      class="primary"
      id="jpf-run">

      属性フィルタを解析

    </button>


    <button
      id="jpf-export">

      JSONを書き出す

    </button>


    <button
      class="danger"
      id="jpf-reset">

      結果を削除

    </button>


    <button
      id="jpf-close2">

      閉じる

    </button>

  </div>


  <div class="box">

    <div class="small">
      実行ログ
    </div>

    <div
      class="log"
      id="jpf-log">

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


  $("#jpf-log")
    .textContent =
    "[" +
    time +
    "] " +
    message +
    "\n" +
    $("#jpf-log")
      .textContent;
}


function render() {

  const saved =
    loadResult();


  $("#jpf-run")
    .disabled =
    busy;


  $("#jpf-export")
    .disabled =
    busy ||
    !saved;


  $("#jpf-reset")
    .disabled =
    busy;
}


/* ========================================
   解析ボタン
   ======================================== */

$("#jpf-run")
.onclick =
async () => {

  if (busy) {
    return;
  }


  busy = true;

  render();


  try {

    log(
      "Album一覧を解析中…"
    );


    const result =
      await runInspection();


    log(
      "propertyリンク：" +
      result.links.length +
      "件"
    );


    log(
      "select：" +
      result.selects.length +
      "件"
    );


    log(
      "input：" +
      result.inputs.length +
      "件"
    );


    log(
      "属性文字候補：" +
      result.attribute_text_elements.length +
      "件"
    );


    const summary =
      result.property_value_tests
        .map(x =>
          "property=" +
          x.property_value +
          " → " +
          (
            x.error
              ? "ERROR"
              : x.card_count_page1 +
                "件"
          )
        )
        .join("\n");


    log(summary);


    log(
      "解析完了。JSONを書き出してください。"
    );


  } catch (e) {

    log(
      "ERROR: " +
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
   export
   ======================================== */

$("#jpf-export")
.onclick =
() => {

  const saved =
    loadResult();


  if (!saved) {

    log(
      "解析結果がありません"
    );

    return;
  }


  exportJson(
    saved
  );


  log(
    "JSONを書き出しました"
  );
};


/* ========================================
   reset
   ======================================== */

$("#jpf-reset")
.onclick =
() => {

  if (
    !confirm(
      "属性フィルタ検証結果を削除しますか？"
    )
  ) {
    return;
  }


  localStorage.removeItem(
    STORAGE_KEY
  );


  render();


  log(
    "結果を削除しました"
  );
};


$("#jpf-close")
.onclick =
() =>
  root.remove();


$("#jpf-close2")
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
      saved:
        !!loadResult()
    })
  );
}

})();
