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
        "jolly_attribute_inspection
