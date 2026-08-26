(async () => {
"use strict";

/* =========================================================
   JOLLY CARD DETAIL COLLECTOR
   production-v1.0

   ・全1,359枚
   ・IndexedDBへカードごとに即時保存
   ・途中再開
   ・20枚 / 50枚バッチ
   ・エラー記録
   ・エラーだけ再取得
   ・中間JSON書き出し可
   ・SKILL SLOT除外
   ・アイテム重複除外
   ・目録から関連カード名を補完
   ========================================================= */

const VERSION = "detail-production-v1.0";

const PANEL_ID =
  "jolly-detail-production-panel";

const CATALOG_KEY =
  "jolly_card_catalog_panel_v1";

const DB_NAME =
  "jolly_card_database";

const DB_VERSION = 1;

const CARD_STORE =
  "cards";

const ERROR_STORE =
  "errors";

const META_STORE =
  "meta";

const WAIT_MS = 450;


/* =========================================================
   共通
   ========================================================= */

const sleep = ms =>
  new Promise(resolve =>
    setTimeout(resolve, ms)
  );


function cleanText(value) {

  return String(
    value ?? ""
  )
  .replace(/\s+/g, " ")
  .trim();
}


function absoluteUrl(url) {

  if (!url) {
    return "";
  }

  try {

    return new URL(
      url,
      location.href
    ).href;

  } catch(e) {

    return String(url);
  }
}


function splitRange(text) {

  const raw =
    cleanText(text);

  const match =
    raw.match(
      /([\d.]+)\s*[~～]\s*([\d.]+)/
    );

  if (!match) {

    return {
      min: null,
      max: null,
      raw
    };
  }

  return {
    min: Number(match[1]),
    max: Number(match[2]),
    raw
  };
}


/* =========================================================
   目録
   ========================================================= */

function loadCatalog() {

  try {

    const value =
      JSON.parse(
        localStorage.getItem(
          CATALOG_KEY
        ) || "null"
      );

    if (
      value &&
      Array.isArray(value.cards)
    ) {

      return value.cards
        .slice()
        .sort(
          (a,b) =>
            Number(a.card_no) -
            Number(b.card_no)
        );
    }

  } catch(e) {}

  return [];
}


const catalog =
  loadCatalog();


const catalogMap =
  new Map(
    catalog.map(card => [
      String(card.card_no),
      card
    ])
  );


/* =========================================================
   IndexedDB
   ========================================================= */

function openDatabase() {

  return new Promise(
    (resolve, reject) => {

      const request =
        indexedDB.open(
          DB_NAME,
          DB_VERSION
        );


      request.onupgradeneeded =
        event => {

          const db =
            event.target.result;


          if (
            !db.objectStoreNames
              .contains(CARD_STORE)
          ) {

            db.createObjectStore(
              CARD_STORE,
              {
                keyPath:
                  "card_no"
              }
            );
          }


          if (
            !db.objectStoreNames
              .contains(ERROR_STORE)
          ) {

            db.createObjectStore(
              ERROR_STORE,
              {
                keyPath:
                  "card_no"
              }
            );
          }


          if (
            !db.objectStoreNames
              .contains(META_STORE)
          ) {

            db.createObjectStore(
              META_STORE,
              {
                keyPath:
                  "key"
              }
            );
          }
        };


      request.onsuccess =
        () =>
          resolve(
            request.result
          );


      request.onerror =
        () =>
          reject(
            request.error
          );
    }
  );
}


const db =
  await openDatabase();


function idbPut(
  storeName,
  value
) {

  return new Promise(
    (resolve, reject) => {

      const tx =
        db.transaction(
          storeName,
          "readwrite"
        );

      const store =
        tx.objectStore(
          storeName
        );

      store.put(value);

      tx.oncomplete =
        () => resolve();

      tx.onerror =
        () =>
          reject(tx.error);
    }
  );
}


function idbDelete(
  storeName,
  key
) {

  return new Promise(
    (resolve, reject) => {

      const tx =
        db.transaction(
          storeName,
          "readwrite"
        );

      tx.objectStore(
        storeName
      ).delete(key);

      tx.oncomplete =
        () => resolve();

      tx.onerror =
        () =>
          reject(tx.error);
    }
  );
}


function idbGet(
  storeName,
  key
) {

  return new Promise(
    (resolve, reject) => {

      const tx =
        db.transaction(
          storeName,
          "readonly"
        );

      const req =
        tx.objectStore(
          storeName
        ).get(key);

      req.onsuccess =
        () =>
          resolve(
            req.result
          );

      req.onerror =
        () =>
          reject(
            req.error
          );
    }
  );
}


function idbGetAll(
  storeName
) {

  return new Promise(
    (resolve, reject) => {

      const tx =
        db.transaction(
          storeName,
          "readonly"
        );

      const req =
        tx.objectStore(
          storeName
        ).getAll();

      req.onsuccess =
        () =>
          resolve(
            req.result || []
          );

      req.onerror =
        () =>
          reject(
            req.error
          );
    }
  );
}


function idbCount(
  storeName
) {

  return new Promise(
    (resolve, reject) => {

      const tx =
        db.transaction(
          storeName,
          "readonly"
        );

      const req =
        tx.objectStore(
          storeName
        ).count();

      req.onsuccess =
        () =>
          resolve(
            req.result || 0
          );

      req.onerror =
        () =>
          reject(
            req.error
          );
    }
  );
}


function idbClear(
  storeName
) {

  return new Promise(
    (resolve, reject) => {

      const tx =
        db.transaction(
          storeName,
          "readwrite"
        );

      tx.objectStore(
        storeName
      ).clear();

      tx.oncomplete =
        () => resolve();

      tx.onerror =
        () =>
          reject(tx.error);
    }
  );
}


/* =========================================================
   進捗
   ========================================================= */

async function getNextIndex() {

  const row =
    await idbGet(
      META_STORE,
      "next_index"
    );

  return Number(
    row?.value || 0
  );
}


async function setNextIndex(
  value
) {

  await idbPut(
    META_STORE,
    {
      key:
        "next_index",

      value:
        Number(value),

      updated_at:
        new Date()
          .toISOString()
    }
  );
}


/* =========================================================
   カード名
   ========================================================= */

function getCardName(
  doc,
  fallback
) {

  const spans =
    [
      ...doc.querySelectorAll(
        "#page_card_albumDetail span"
      )
    ];


  for (
    const span of spans
  ) {

    const style =
      (
        span.getAttribute(
          "style"
        ) || ""
      )
      .replace(/\s/g, "")
      .toLowerCase();


    if (
      style.includes(
        "color:#ffff00"
      ) ||
      style.includes(
        "color:rgb(255,255,0)"
      )
    ) {

      const text =
        cleanText(
          span.textContent
        );


      if (
        text &&
        !text.includes(
          "タップ"
        ) &&
        text.length < 100
      ) {

        return text;
      }
    }
  }


  return (
    fallback || ""
  );
}


/* =========================================================
   レア度
   ========================================================= */

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

  let node =
    rare.nextSibling;


  for (
    let i = 0;
    i < 6 && node;
    i++,
    node = node.nextSibling
  ) {

    const text =
      cleanText(
        node.textContent || ""
      );


    const match =
      text.match(
        /\[([^\]]+)\]/
      );


    if (match) {

      rareName =
        match[1];

      break;
    }
  }


  return {
    stars,
    name: rareName
  };
}


/* =========================================================
   性別
   ========================================================= */

function getGender(doc) {

  const status =
    doc.querySelector(
      "#card_status"
    );


  if (!status) {
    return "";
  }


  const text =
    cleanText(
      status.textContent
    );


  const match =
    text.match(
      /性別\s*([^\s]+)/
    );


  return match
    ? match[1]
        .replace(
          /[\[\]]/g,
          ""
        )
    : "";
}


/* =========================================================
   保有数
   ========================================================= */

function getOwnedCounts(doc) {

  let list = 0;
  let stock = 0;


  doc
    .querySelectorAll(
      "img.card_storage_icon"
    )
    .forEach(img => {

      const src =
        img.getAttribute(
          "src"
        ) || "";


      const parent =
        img.parentElement;


      if (!parent) {
        return;
      }


      const html =
        parent.innerHTML;


      const index =
        html.indexOf(
          img.outerHTML
        );


      const after =
        index >= 0
          ? html.slice(
              index +
              img.outerHTML.length
            )
          : "";


      const match =
        after.match(
          /×\s*(\d+)/
        );


      if (!match) {
        return;
      }


      const count =
        Number(
          match[1]
        );


      if (
        src.includes(
          "icon_list.png"
        )
      ) {

        list =
          count;
      }


      if (
        src.includes(
          "icon_stock.png"
        )
      ) {

        stock =
          count;
      }
    });


  return {

    list,

    stock,

    owned:
      list + stock > 0
  };
}


/* =========================================================
   スキル
   ========================================================= */

function getSkills(doc) {

  const skills = [];

  let slot = 0;


  doc
    .querySelectorAll(
      ".skill_border02"
    )
    .forEach(box => {

      slot++;


      const spans =
        [
          ...box.querySelectorAll(
            "span"
          )
        ];


      let name = "";


      for (
        const span of spans
      ) {

        const style =
          (
            span.getAttribute(
              "style"
            ) || ""
          )
          .replace(/\s/g, "")
          .toLowerCase();


        if (
          style.includes(
            "color:#fff280"
          ) ||
          style.includes(
            "color:rgb(255,242,128)"
          )
        ) {

          name =
            cleanText(
              span.textContent
            );

          break;
        }
      }


      /* 空きスキル枠を除外 */

      if (
        !name ||
        name === "-" ||
        name === "－" ||
        name ===
          "SKILL SLOT"
      ) {

        return;
      }


      const detail =
        box.querySelector(
          ".skillDetail"
        );


      const effect =
        cleanText(
          detail
            ?.textContent ||
          ""
        );


      let iconType = "";


      const icon =
        box.querySelector(
          ".page_card_albumDetail_status_skill_icon"
        );


      if (icon) {

        const src =
          icon.getAttribute(
            "src"
          ) || "";


        const match =
          src.match(
            /\/icon\/([^/.]+)\.png/i
          );


        if (match) {

          iconType =
            match[1];
        }
      }


      skills.push({

        slot,

        skill_name:
          name,

        effect,

        icon_type:
          iconType,

        acquire_type:
          "base"
      });
    });


  return skills;
}


/* =========================================================
   アイテム
   ========================================================= */

function getItems(doc) {

  const map =
    new Map();


  doc
    .querySelectorAll(
      ".item_description_toolTip"
    )
    .forEach(el => {

      const matchId =
        (
          el.id || ""
        ).match(
          /item_description_(\d+)/
        );


      if (!matchId) {
        return;
      }


      const itemId =
        matchId[1];


      const description =
        cleanText(
          el.textContent
        );


      const nameMatch =
        description.match(
          /【([^】]+)】/
        );


      const itemName =
        nameMatch
          ? nameMatch[1]
          : "";


      const unlockMatch =
        description.match(
          /スキル[「『"]([^」』"]+)[」』"]を覚える/
        );


      const changeMatch =
        description.match(
          /スキル[「『"]([^」』"]+)[」』"]が[「『"]([^」』"]+)[」』"]に変化/
        );


      let effectType =
        "other";

      let unlockSkill =
        null;

      let changeFrom =
        null;

      let changeTo =
        null;


      if (unlockMatch) {

        effectType =
          "skill_unlock";

        unlockSkill =
          unlockMatch[1];

      } else if (
        changeMatch
      ) {

        effectType =
          "skill_change";

        changeFrom =
          changeMatch[1];

        changeTo =
          changeMatch[2];
      }


      const key =
        itemId +
        "|" +
        description;


      /* 同一アイテム重複除去 */

      if (
        map.has(key)
      ) {

        return;
      }


      map.set(
        key,
        {

          item_id:
            itemId,

          item_name:
            itemName,

          description,

          effect_type:
            effectType,

          unlock_skill:
            unlockSkill,

          change_from:
            changeFrom,

          change_to:
            changeTo,

          required_count:
            null
        }
      );
    });


  return [
    ...map.values()
  ];
}


/* =========================================================
   関連カード
   ========================================================= */

function getRelatedCards(
  doc,
  ownCardNo
) {

  const output = [];

  const seen =
    new Set();


  const area =
    doc.querySelector(
      "#after_card"
    );


  if (!area) {
    return output;
  }


  area
    .querySelectorAll(
      'a[href*="A=AlbumDetail"][href*="card="]'
    )
    .forEach(a => {

      try {

        const url =
          new URL(
            a.getAttribute(
              "href"
            ),
            location.href
          );


        const cardNo =
          url.searchParams
            .get("card");


        if (
          !cardNo ||
          cardNo ===
            String(
              ownCardNo
            ) ||
          seen.has(
            cardNo
          )
        ) {

          return;
        }


        seen.add(
          cardNo
        );


        const catalogRow =
          catalogMap.get(
            String(cardNo)
          );


        output.push({

          card_no:
            String(cardNo),

          card_name:
            catalogRow
              ?.card_name ||
            cleanText(
              a.textContent
            ) ||
            "",

          url:
            url.href
        });


      } catch(e) {}
    });


  return output;
}


/* =========================================================
   説明
   ========================================================= */

function getDescription(doc) {

  const blocks =
    [
      ...doc.querySelectorAll(
        ".lineheight1_1_brown2"
      )
    ];


  for (
    const block of blocks
  ) {

    if (
      block.closest(
        "#after_card"
      )
    ) {

      continue;
    }


    const text =
      cleanText(
        block.textContent
      );


    if (
      text.length >= 20
    ) {

      return text;
    }
  }


  return "";
}


/* =========================================================
   画像
   ========================================================= */

function getImage(
  doc,
  cardNo
) {

  const sizes =
    [640,320,120];


  for (
    const size of sizes
  ) {

    const img =
      doc.querySelector(
        `img[src*="/card/${size}/${cardNo}.jpg"]`
      );


    if (img) {

      return absoluteUrl(
        img.getAttribute(
          "src"
        )
      );
    }
  }


  return "";
}


/* =========================================================
   HTML解析
   ========================================================= */

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
      )
      ?.textContent
    );


  const attack =
    splitRange(
      doc.querySelector(
        "#page_deck_select_master_attack"
      )
      ?.textContent
    );


  const speed =
    splitRange(
      doc.querySelector(
        "#page_deck_select_master_speed"
      )
      ?.textContent
    );


  const costText =
    cleanText(
      doc.querySelector(
        "#page_deck_select_master_cost"
      )
      ?.textContent
    );


  const cost =
    costText !== ""
      ? Number(costText)
      : null;


  const owned =
    getOwnedCounts(
      doc
    );


  const items =
    getItems(
      doc
    );


  const unlockMap =
    new Map();


  items
    .filter(
      item =>
        item.effect_type ===
        "skill_unlock"
    )
    .forEach(item => {

      const key =
        item.item_id +
        "|" +
        item.unlock_skill;


      if (
        unlockMap.has(
          key
        )
      ) {

        return;
      }


      unlockMap.set(
        key,
        {

          skill_name:
            item.unlock_skill,

          acquire_type:
            "item_unlock",

          required_item_id:
            item.item_id,

          required_item_name:
            item.item_name,

          required_count:
            item.required_count
        }
      );
    });


  const skillChanges =
    items
      .filter(
        item =>
          item.effect_type ===
          "skill_change"
      )
      .map(
        item => ({

          acquire_type:
            "item_change",

          from_skill:
            item.change_from,

          to_skill:
            item.change_to,

          required_item_id:
            item.item_id,

          required_item_name:
            item.item_name,

          required_count:
            item.required_count
        })
      );


  return {

    card_no:
      String(
        cardNo
      ),

    card_name:
      getCardName(
        doc,
        catalogName
      ),

    catalog_name:
      catalogName ||
      "",


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
      encodeURIComponent(
        cardNo
      ),


    description:
      getDescription(
        doc
      ),


    skills:
      getSkills(
        doc
      ),


    items,

    unlock_skills:
      [
        ...unlockMap.values()
      ],

    skill_changes:
      skillChanges,


    related_cards:
      getRelatedCards(
        doc,
        cardNo
      ),


    collected_at:
      new Date()
        .toISOString()
  };
}


/* =========================================================
   AlbumDetail取得
   ========================================================= */

async function fetchDetail(
  cardNo,
  catalogName
) {

  const url =
    "/?M=Card&A=AlbumDetail&card=" +
    encodeURIComponent(
      cardNo
    );


  const response =
    await fetch(
      url,
      {

        credentials:
          "same-origin",

        cache:
          "no-store"
      }
    );


  if (
    !response.ok
  ) {

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


  if (
    !doc.querySelector(
      "#page_card_albumDetail"
    )
  ) {

    throw new Error(
      "AlbumDetail判定失敗"
    );
  }


  return parseDetail(
    doc,
    cardNo,
    catalogName
  );
}


/* =========================================================
   JSON書き出し
   ========================================================= */

async function exportJson() {

  let cards =
    await idbGetAll(
      CARD_STORE
    );


  let errors =
    await idbGetAll(
      ERROR_STORE
    );


  cards.sort(
    (a,b) =>
      Number(a.card_no) -
      Number(b.card_no)
  );


  errors.sort(
    (a,b) =>
      Number(a.card_no) -
      Number(b.card_no)
  );


  const nextIndex =
    await getNextIndex();


  const payload = {

    meta: {

      type:
        "jolly_card_details",

      version:
        VERSION,

      catalog_count:
        catalog.length,

      detail_count:
        cards.length,

      error_count:
        errors.length,

      next_index:
        nextIndex,

      finished:
        cards.length +
        errors.length >=
        catalog.length,

      exported_at:
        new Date()
          .toISOString(),

      source:
        location.origin
    },


    cards,

    errors
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
    "jolly_card_details_" +
    cards.length +
    "_errors_" +
    errors.length +
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


/* =========================================================
   パネル
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

  position: fixed;

  inset: 0;

  z-index:
    2147483647;

  background:
    rgba(0,0,0,.58);

  display: flex;

  justify-content:
    center;

  align-items:
    flex-end;

  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "Helvetica Neue",
    sans-serif;

  color: #111;

  text-shadow: none;
}


#${PANEL_ID} * {

  box-sizing:
    border-box;
}


#${PANEL_ID} .panel {

  width: 100%;

  max-width:
    700px;

  max-height:
    90vh;

  overflow: auto;

  background:
    #f5f6f8;

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

  display: flex;

  justify-content:
    space-between;

  align-items:
    center;

  gap: 10px;
}


#${PANEL_ID} .title {

  font-size: 18px;

  font-weight: 800;
}


#${PANEL_ID} .version {

  font-size: 11px;

  color: #666;
}


#${PANEL_ID} .box {

  background: #fff;

  border:
    1px solid #ddd;

  border-radius:
    14px;

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

  line-height: 1.5;
}


#${PANEL_ID} .progress {

  height: 10px;

  background:
    #e5e7eb;

  border-radius:
    999px;

  overflow: hidden;

  margin-top: 9px;
}


#${PANEL_ID} .bar {

  height: 100%;

  width: 0%;

  background:
    #111827;
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

  border-radius:
    12px;

  background: #fff;

  color: #111;

  padding:
    11px 9px;

  font-size: 14px;

  font-weight: 700;
}


#${PANEL_ID}
button.primary {

  background:
    #111827;

  color: #fff;

  border-color:
    #111827;
}


#${PANEL_ID}
button.retry {

  color:
    #b45309;
}


#${PANEL_ID}
button.danger {

  color:
    #b42318;
}


#${PANEL_ID}
button:disabled {

  opacity:
    .45;
}


#${PANEL_ID}
.close {

  width: 36px;

  height: 36px;

  border-radius:
    999px;

  padding: 0;

  font-size: 20px;
}


#${PANEL_ID}
.log {

  white-space:
    pre-wrap;

  background:
    #111827;

  color: #fff;

  border-radius:
    12px;

  padding: 10px;

  min-height:
    100px;

  max-height:
    220px;

  overflow: auto;

  font:
    12px
    ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
}

</style>


<div class="panel">


  <div class="head">

    <div>

      <div class="title">
        JOLLY カード詳細収集
      </div>

      <div class="version">
        ${VERSION}
      </div>

    </div>


    <button
      class="close"
      id="jp-close">

      ×

    </button>

  </div>


  <div class="box">

    <div class="small">
      カード詳細
    </div>


    <div class="big">

      <span
        id="jp-card-count">
        0
      </span>

      /

      ${catalog.length || 1359}

    </div>


    <div class="progress">

      <div
        class="bar"
        id="jp-progress-bar">
      </div>

    </div>


    <div
      class="small"
      id="jp-status">

      読み込み中…

    </div>

  </div>


  <div class="box">

    <div class="small">

      エラー：
      <b id="jp-error-count">
        0
      </b>
      件

      ／

      次回位置：
      <b id="jp-next-index">
        1
      </b>

    </div>

  </div>


  <div class="grid">


    <button
      class="primary"
      id="jp-next20">

      次の20枚取得

    </button>


    <button
      class="primary"
      id="jp-next50">

      次の50枚取得

    </button>


    <button
      class="retry"
      id="jp-retry">

      エラーだけ再取得

    </button>


    <button
      id="jp-export">

      JSONを書き出す

    </button>


    <button
      id="jp-refresh">

      状態を再読込

    </button>


    <button
      class="danger"
      id="jp-reset">

      詳細進捗をリセット

    </button>


    <button
      id="jp-close2">

      閉じる

    </button>

  </div>


  <div class="box">

    <div class="small">
      実行ログ
    </div>


    <div
      class="log"
      id="jp-log">

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
  selector =>
    root.querySelector(
      selector
    );


function log(message) {

  const time =
    new Date()
      .toLocaleTimeString();


  $("#jp-log")
    .textContent =
    "[" +
    time +
    "] " +
    message +
    "\n" +
    $("#jp-log")
      .textContent;
}


/* =========================================================
   画面更新
   ========================================================= */

async function render() {

  const count =
    await idbCount(
      CARD_STORE
    );


  const errorCount =
    await idbCount(
      ERROR_STORE
    );


  const nextIndex =
    await getNextIndex();


  const total =
    catalog.length ||
    1359;


  const percent =
    total
      ? Math.min(
          100,
          count /
          total *
          100
        )
      : 0;


  $("#jp-card-count")
    .textContent =
    count;


  $("#jp-error-count")
    .textContent =
    errorCount;


  $("#jp-next-index")
    .textContent =
    Math.min(
      nextIndex + 1,
      total
    );


  $("#jp-progress-bar")
    .style.width =
    percent.toFixed(1) +
    "%";


  let status =
    "";


  if (
    catalog.length !==
    1359
  ) {

    status =
      "目録が1,359件ではありません：" +
      catalog.length;

  } else if (
    nextIndex >=
      catalog.length
  ) {

    status =
      errorCount
        ? "通常取得完了。エラー再取得が必要です。"
        : "全カード取得完了";

  } else {

    const next =
      catalog[
        nextIndex
      ];


    status =
      "次回：" +
      next.card_no +
      " " +
      next.card_name;
  }


  $("#jp-status")
    .textContent =
    status;


  const mainDisabled =
    busy ||
    !catalog.length ||
    nextIndex >=
      catalog.length;


  $("#jp-next20")
    .disabled =
    mainDisabled;


  $("#jp-next50")
    .disabled =
    mainDisabled;


  $("#jp-retry")
    .disabled =
    busy ||
    errorCount === 0;


  $("#jp-export")
    .disabled =
    busy ||
    (
      count === 0 &&
      errorCount === 0
    );


  $("#jp-reset")
    .disabled =
    busy;
}


/* =========================================================
   通常バッチ収集
   ========================================================= */

async function collectBatch(
  numberToCollect
) {

  if (busy) {
    return;
  }


  if (
    catalog.length !==
    1359
  ) {

    log(
      "目録件数が1,359件ではありません。処理停止。"
    );

    return;
  }


  busy = true;

  await render();


  try {

    let index =
      await getNextIndex();


    const end =
      Math.min(
        catalog.length,
        index +
        numberToCollect
      );


    const startHuman =
      index + 1;


    const endHuman =
      end;


    log(
      `${startHuman}～${endHuman}件目を開始`
    );


    for (
      ;
      index < end;
      index++
    ) {

      const target =
        catalog[index];


      const progress =
        `${index + 1}/${catalog.length}`;


      log(
        `${progress} ${target.card_no} ${target.card_name} 取得中…`
      );


      try {

        const row =
          await fetchDetail(
            target.card_no,
            target.card_name
          );


        await idbPut(
          CARD_STORE,
          row
        );


        /* 過去エラーがあれば消す */

        await idbDelete(
          ERROR_STORE,
          String(
            target.card_no
          )
        );


        log(
          `OK ${target.card_no}` +
          ` skill=${row.skills.length}` +
          ` item=${row.items.length}` +
          ` owned=${row.owned}`
        );


      } catch(e) {

        const message =
          e?.message ||
          String(e);


        await idbPut(
          ERROR_STORE,
          {

            card_no:
              String(
                target.card_no
              ),

            card_name:
              target.card_name,

            catalog_index:
              index,

            error:
              message,

            failed_at:
              new Date()
                .toISOString(),

            retry_count:
              0
          }
        );


        log(
          `ERROR ${target.card_no}: ${message}`
        );
      }


      /*
       * 成功でも失敗でも、このカードは
       * 一度処理済みとして次へ進める。
       * エラーは別途「エラーだけ再取得」。
       */

      await setNextIndex(
        index + 1
      );


      await render();


      await sleep(
        WAIT_MS
      );
    }


    log(
      "今回のバッチ完了"
    );


  } catch(e) {

    log(
      "処理全体エラー：" +
      (
        e?.message ||
        String(e)
      )
    );


  } finally {

    busy = false;

    await render();
  }
}


/* =========================================================
   エラー再取得
   ========================================================= */

async function retryErrors() {

  if (busy) {
    return;
  }


  busy = true;

  await render();


  try {

    let errors =
      await idbGetAll(
        ERROR_STORE
      );


    errors.sort(
      (a,b) =>
        Number(a.catalog_index) -
        Number(b.catalog_index)
    );


    if (!errors.length) {

      log(
        "再取得対象エラーはありません。"
      );

      return;
    }


    log(
      `エラー再取得開始：${errors.length}件`
    );


    for (
      let i = 0;
      i < errors.length;
      i++
    ) {

      const errorRow =
        errors[i];


      const catalogRow =
        catalogMap.get(
          String(
            errorRow.card_no
          )
        );


      const cardName =
        catalogRow
          ?.card_name ||
        errorRow.card_name ||
        "";


      log(
        `RETRY ${i + 1}/${errors.length} ` +
        `${errorRow.card_no} ${cardName}`
      );


      try {

        const row =
          await fetchDetail(
            errorRow.card_no,
            cardName
          );


        await idbPut(
          CARD_STORE,
          row
        );


        await idbDelete(
          ERROR_STORE,
          String(
            errorRow.card_no
          )
        );


        log(
          `RETRY OK ${errorRow.card_no}`
        );


      } catch(e) {

        const message =
          e?.message ||
          String(e);


        await idbPut(
          ERROR_STORE,
          {

            ...errorRow,

            error:
              message,

            failed_at:
              new Date()
                .toISOString(),

            retry_count:
              Number(
                errorRow.retry_count ||
                0
              ) + 1
          }
        );


        log(
          `RETRY ERROR ${errorRow.card_no}: ${message}`
        );
      }


      await render();

      await sleep(
        WAIT_MS
      );
    }


    log(
      "エラー再取得終了"
    );


  } finally {

    busy = false;

    await render();
  }
}


/* =========================================================
   ボタン
   ========================================================= */

$("#jp-next20")
  .onclick =
  () =>
    collectBatch(
      20
    );


$("#jp-next50")
  .onclick =
  () =>
    collectBatch(
      50
    );


$("#jp-retry")
  .onclick =
  retryErrors;


$("#jp-export")
  .onclick =
  async () => {

    log(
      "JSONを生成中…"
    );


    await exportJson();


    log(
      "JSONを書き出しました"
    );
  };


$("#jp-refresh")
  .onclick =
  async () => {

    await render();

    const count =
      await idbCount(
        CARD_STORE
      );


    const errors =
      await idbCount(
        ERROR_STORE
      );


    log(
      `保存済み=${count}件 / エラー=${errors}件`
    );
  };


$("#jp-reset")
  .onclick =
  async () => {

    const ok =
      confirm(
        "カード詳細の収集結果・エラー・進捗をすべて削除します。\n\n目録1,359件は削除しません。\n\nよろしいですか？"
      );


    if (!ok) {
      return;
    }


    busy = true;

    await render();


    try {

      await idbClear(
        CARD_STORE
      );


      await idbClear(
        ERROR_STORE
      );


      await idbClear(
        META_STORE
      );


      log(
        "詳細収集データをリセットしました"
      );


    } finally {

      busy = false;

      await render();
    }
  };


$("#jp-close")
  .onclick =
  () =>
    root.remove();


$("#jp-close2")
  .onclick =
  () =>
    root.remove();


/* =========================================================
   初期表示
   ========================================================= */

await render();


const initialCount =
  await idbCount(
    CARD_STORE
  );


const initialErrors =
  await idbCount(
    ERROR_STORE
  );


const initialIndex =
  await getNextIndex();


log(
  `目録=${catalog.length} / 詳細=${initialCount} / エラー=${initialErrors}`
);


/*
 * Shortcuts側の処理のみ終了。
 * パネルのイベントはSafari上に残る。
 */

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

      detail_count:
        initialCount,

      error_count:
        initialErrors,

      next_index:
        initialIndex
    })
  );
}

})();
