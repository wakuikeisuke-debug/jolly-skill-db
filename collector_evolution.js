(() => {
  'use strict';

  const VERSION = 'evolution-collector-1.0';
  const DB_NAME = 'JOLLY_EVOLUTION_COLLECTOR';
  const STORE = 'cards';
  const STATE_KEY = 'JOLLY_EVOLUTION_STATE_V1';

  const CARD_IDS = [
    "1122","1123","1124","1125","1126","1127","1128","1129",
    "1146","1147","1148","1149","1159","1160","1161","1162",
    "1179","1180","1181","1182","1190","1191","1192","1193",
    "1209","1210","1213","1214","1215","1216","1227","1228",
    "1229","1230","1231","1232","1233","1234","1235","1236",
    "1237","1238","1239","1240","1241","1242","1243","1244",
    "1245","1246","1247","1248","1249","1250","1251","1252",
    "1253","1254","1255","1256","1257","1258","1259","1260",
    "1261","1262","1263","1264","1265","1266","1267","1268",
    "1269","1270","1271","1272","1273","1274","1275","1276",
    "1277","1278","1279","1280","1281","1282","1283","1284",
    "1285","1286","1287","1288","1289","1290","1291","1292",
    "1293","1294","1295","1296","1297","1298","1299","1300",
    "1301","1302","1303","1304","1305","1306","1307","1308",
    "1309","1310","1311","1312","1313","1314","1315","1316",
    "1317","1318","1319","1320","1321","1322","1323","1324",
    "1325","1326","1327","1328","1329","1330","1331","1332",
    "1333","1334","1335","1336","1337","1338","1339","1340",
    "1341","1342","1343","1344","1345","1346","1347","1348",
    "1349","1350","1351","1352","1353","1354","1355","1356",
    "1679","1680"
  ];

  const KEYWORDS = [
    '神徳',
    '魔徳',
    '神格',
    '魔格',
    '潜在',
    '能力',
    'スキル',
    'skill',
    'slot',
    'icon',
    '効果',
    '追加',
    '付与',
    '覚える',
    '進化',
    '転生'
  ];

  const sleep = ms =>
    new Promise(resolve =>
      setTimeout(resolve, ms)
    );

  function detailUrl(id) {
    const url = new URL(
      location.origin + '/'
    );

    url.searchParams.set(
      'M',
      'Card'
    );

    url.searchParams.set(
      'A',
      'AlbumDetail'
    );

    url.searchParams.set(
      'card',
      id
    );

    url.searchParams.set(
      'property',
      ''
    );

    url.searchParams.set(
      'p',
      ''
    );

    url.searchParams.set(
      'name_text',
      ''
    );

    url.searchParams.set(
      'rare',
      ''
    );

    url.searchParams.set(
      'gacha_style',
      '0'
    );

    url.searchParams.set(
      'year',
      '0'
    );

    return url.toString();
  }

  function loadState() {
    try {
      return (
        JSON.parse(
          localStorage.getItem(
            STATE_KEY
          )
        )
        ||
        {
          nextIndex: 0,
          running: false,
          stopped: false,
          errors: []
        }
      );
    } catch (_) {
      return {
        nextIndex: 0,
        running: false,
        stopped: false,
        errors: []
      };
    }
  }

  function saveState(state) {
    localStorage.setItem(
      STATE_KEY,
      JSON.stringify(state)
    );
  }

  function openDB() {
    return new Promise(
      (resolve, reject) => {
        const request =
          indexedDB.open(
            DB_NAME,
            1
          );

        request.onupgradeneeded =
          () => {
            const db =
              request.result;

            if (
              !db.objectStoreNames
                .contains(STORE)
            ) {
              db.createObjectStore(
                STORE,
                {
                  keyPath:
                    'card_no'
                }
              );
            }
          };

        request.onsuccess =
          () => resolve(
            request.result
          );

        request.onerror =
          () => reject(
            request.error
          );
      }
    );
  }

  async function putRow(row) {
    const db =
      await openDB();

    return new Promise(
      (resolve, reject) => {
        const tx =
          db.transaction(
            STORE,
            'readwrite'
          );

        tx
          .objectStore(STORE)
          .put(row);

        tx.oncomplete =
          () => resolve();

        tx.onerror =
          () => reject(
            tx.error
          );
      }
    );
  }

  async function getAllRows() {
    const db =
      await openDB();

    return new Promise(
      (resolve, reject) => {
        const tx =
          db.transaction(
            STORE,
            'readonly'
          );

        const request =
          tx
            .objectStore(STORE)
            .getAll();

        request.onsuccess =
          () => resolve(
            request.result || []
          );

        request.onerror =
          () => reject(
            request.error
          );
      }
    );
  }

  async function clearRows() {
    const db =
      await openDB();

    return new Promise(
      (resolve, reject) => {
        const tx =
          db.transaction(
            STORE,
            'readwrite'
          );

        tx
          .objectStore(STORE)
          .clear();

        tx.oncomplete =
          () => resolve();

        tx.onerror =
          () => reject(
            tx.error
          );
      }
    );
  }

  function textClean(value) {
    return String(
      value || ''
    )
      .replace(
        /\s+/g,
        ' '
      )
      .trim();
  }

  function attrsOf(element) {
    const result = {};

    for (
      const attribute
      of Array.from(
        element.attributes || []
      )
    ) {
      result[
        attribute.name
      ] =
        attribute.value;
    }

    return result;
  }

  function elementDescriptor(
    element
  ) {
    return {
      tag:
        element.tagName
          ?.toLowerCase()
        || '',

      text:
        textClean(
          element.textContent
        ).slice(
          0,
          1200
        ),

      id:
        element.id
        || null,

      class:
        element.className
        || null,

      attrs:
        attrsOf(
          element
        )
    };
  }

  function uniqueByJson(
    rows,
    max = 400
  ) {
    const output = [];
    const seen = new Set();

    for (const row of rows) {
      const key =
        JSON.stringify(
          row
        );

      if (
        seen.has(key)
      ) {
        continue;
      }

      seen.add(key);
      output.push(row);

      if (
        output.length
        >= max
      ) {
        break;
      }
    }

    return output;
  }

  function collectKeywordContexts(
    doc
  ) {
    const rows = [];

    const walker =
      doc.createTreeWalker(
        doc.body || doc,
        NodeFilter.SHOW_ELEMENT
      );

    let element;

    while (
      (
        element =
          walker.nextNode()
      )
    ) {
      const text =
        textClean(
          element.textContent
        );

      const attrs =
        JSON.stringify(
          attrsOf(
            element
          )
        );

      const haystack =
        (
          text
          + ' '
          + attrs
        ).toLowerCase();

      const hits =
        KEYWORDS.filter(
          keyword =>
            haystack.includes(
              keyword
                .toLowerCase()
            )
        );

      if (
        hits.length === 0
      ) {
        continue;
      }

      if (
        element.children.length
          > 12
        &&
        text.length
          > 2500
      ) {
        continue;
      }

      rows.push({
        ...elementDescriptor(
          element
        ),

        keywords:
          hits
      });
    }

    return uniqueByJson(
      rows,
      500
    );
  }

  function collectTables(doc) {
    return Array.from(
      doc.querySelectorAll(
        'table'
      )
    )
      .slice(
        0,
        80
      )
      .map(
        (table, index) => ({
          index,

          text:
            textClean(
              table.innerText
              ||
              table.textContent
            ).slice(
              0,
              8000
            ),

          html:
            table.outerHTML
              .slice(
                0,
                16000
              )
        })
      );
  }

  function collectImages(doc) {
    return Array.from(
      doc.images
    ).map(
      (image, index) => ({
        index,

        src:
          image.getAttribute(
            'src'
          ),

        alt:
          image.getAttribute(
            'alt'
          ),

        title:
          image.getAttribute(
            'title'
          ),

        class:
          image.className
          || null,

        id:
          image.id
          || null,

        parent_text:
          textClean(
            image
              .parentElement
              ?.textContent
          ).slice(
            0,
            700
          ),

        parent_html:
          (
            image
              .parentElement
              ?.outerHTML
            || ''
          ).slice(
            0,
            5000
          )
      })
    );
  }

  function collectLinks(doc) {
    return Array.from(
      doc.querySelectorAll(
        'a'
      )
    )
      .map(
        (link, index) => ({
          index,

          text:
            textClean(
              link.textContent
            ).slice(
              0,
              500
            ),

          href:
            link.getAttribute(
              'href'
            ),

          title:
            link.getAttribute(
              'title'
            ),

          onclick:
            link.getAttribute(
              'onclick'
            ),

          class:
            link.className
            || null
        })
      )
      .filter(
        item => {
          const haystack =
            (
              item.text
              + ' '
              + item.href
              + ' '
              + item.title
              + ' '
              + item.onclick
              + ' '
              + item.class
            ).toLowerCase();

          return KEYWORDS.some(
            keyword =>
              haystack.includes(
                keyword
                  .toLowerCase()
              )
          );
        }
      )
      .slice(
        0,
        300
      );
  }

  function collectInputs(doc) {
    return Array.from(
      doc.querySelectorAll(
        'input,select,option,button'
      )
    )
      .map(
        (element, index) => ({
          index,

          tag:
            element.tagName
              .toLowerCase(),

          type:
            element.getAttribute(
              'type'
            ),

          name:
            element.getAttribute(
              'name'
            ),

          value:
            element.getAttribute(
              'value'
            ),

          text:
            textClean(
              element.textContent
            ).slice(
              0,
              500
            ),

          id:
            element.id
            || null,

          class:
            element.className
            || null,

          onclick:
            element.getAttribute(
              'onclick'
            )
        })
      )
      .filter(
        item => {
          const haystack =
            JSON.stringify(
              item
            ).toLowerCase();

          return KEYWORDS.some(
            keyword =>
              haystack.includes(
                keyword
                  .toLowerCase()
              )
          );
        }
      )
      .slice(
        0,
        300
      );
  }

  function collectScripts(doc) {
    return Array.from(
      doc.scripts
    )
      .map(
        (script, index) => ({
          index,

          src:
            script.getAttribute(
              'src'
            ),

          text:
            (
              script.textContent
              || ''
            ).slice(
              0,
              25000
            )
        })
      )
      .filter(
        item => {
          const haystack =
            (
              item.src
              + ' '
              + item.text
            ).toLowerCase();

          return KEYWORDS.some(
            keyword =>
              haystack.includes(
                keyword
                  .toLowerCase()
              )
          );
        }
      )
      .slice(
        0,
        80
      );
  }

  function collectComments(doc) {
    const rows = [];

    const walker =
      doc.createTreeWalker(
        doc,
        NodeFilter.SHOW_COMMENT
      );

    let node;

    while (
      (
        node =
          walker.nextNode()
      )
    ) {
      const value =
        textClean(
          node.nodeValue
        );

      if (
        KEYWORDS.some(
          keyword =>
            value
              .toLowerCase()
              .includes(
                keyword
                  .toLowerCase()
              )
        )
      ) {
        rows.push(
          value.slice(
            0,
            4000
          )
        );
      }

      if (
        rows.length
        >= 100
      ) {
        break;
      }
    }

    return rows;
  }

  function titleFromDoc(doc) {
    const text =
      textClean(
        doc.body?.innerText
        ||
        ''
      );

    const candidates = [
      ...Array.from(
        doc.querySelectorAll(
          'h1,h2,h3,.title,.card_name,.name'
        )
      ).map(
        element =>
          textClean(
            element.textContent
          )
      )
    ].filter(Boolean);

    return (
      candidates.find(
        value =>
          value.includes(
            '神格'
          )
          ||
          value.includes(
            '魔格'
          )
      )
      ||
      candidates[0]
      ||
      text.slice(
        0,
        120
      )
    );
  }

  function inspectHtml(
    html,
    id,
    url
  ) {
    const doc =
      new DOMParser()
        .parseFromString(
          html,
          'text/html'
        );

    const bodyText =
      textClean(
        doc.body?.innerText
        ||
        doc.body?.textContent
        ||
        ''
      );

    const directHits =
      KEYWORDS.filter(
        keyword =>
          bodyText.includes(
            keyword
          )
      );

    return {
      card_no:
        String(id),

      url,

      fetched_at:
        new Date()
          .toISOString(),

      title:
        doc.title
        || '',

      detected_name:
        titleFromDoc(doc),

      html_bytes:
        new Blob(
          [html]
        ).size,

      body_text:
        bodyText.slice(
          0,
          60000
        ),

      keyword_direct_hits:
        directHits,

      keyword_contexts:
        collectKeywordContexts(
          doc
        ),

      tables:
        collectTables(
          doc
        ),

      images:
        collectImages(
          doc
        ),

      links:
        collectLinks(
          doc
        ),

      form_controls:
        collectInputs(
          doc
        ),

      scripts:
        collectScripts(
          doc
        ),

      comments:
        collectComments(
          doc
        )
    };
  }

  async function fetchCard(id) {
    const url =
      detailUrl(id);

    const response =
      await fetch(
        url,
        {
          credentials:
            'include',

          cache:
            'no-store',

          redirect:
            'follow',

          headers: {
            Accept:
              'text/html,application/xhtml+xml'
          }
        }
      );

    const html =
      await response.text();

    if (
      !response.ok
    ) {
      throw new Error(
        'HTTP '
        + response.status
      );
    }

    if (
      /ログイン情報入力|name=["']?input_form/i
        .test(html)
    ) {
      throw new Error(
        'LOGIN_REQUIRED'
      );
    }

    return inspectHtml(
      html,
      id,
      url
    );
  }

  let state =
    loadState();

  function setStatus(message) {
    const element =
      document.getElementById(
        'jec_status'
      );

    if (element) {
      element.textContent =
        message;
    }
  }

  async function run(
    ids = null
  ) {
    if (
      state.running
    ) {
      return;
    }

    state.running = true;
    state.stopped = false;

    saveState(state);
    updateButtons();

    const targetIds =
      ids
      ||
      CARD_IDS.slice(
        state.nextIndex
      );

    for (
      let j = 0;
      j < targetIds.length;
      j++
    ) {
      if (
        state.stopped
      ) {
        break;
      }

      const id =
        targetIds[j];

      const originalIndex =
        CARD_IDS.indexOf(
          String(id)
        );

      setStatus(
        '収集中 '
        + id
        + ' / '
        + (
          originalIndex + 1
        )
        + ' of '
        + CARD_IDS.length
      );

      try {
        const row =
          await fetchCard(
            id
          );

        await putRow(
          row
        );

        state.errors =
          state.errors.filter(
            item =>
              String(
                item.card_no
              )
              !==
              String(id)
          );

        if (
          originalIndex
          >= 0
        ) {
          state.nextIndex =
            Math.max(
              state.nextIndex,
              originalIndex + 1
            );
        }

        saveState(state);

      } catch (error) {
        state.errors =
          state.errors.filter(
            item =>
              String(
                item.card_no
              )
              !==
              String(id)
          );

        state.errors.push({
          card_no:
            String(id),

          message:
            String(
              error?.message
              ||
              error
            ),

          at:
            new Date()
              .toISOString()
        });

        if (
          originalIndex
          >= 0
        ) {
          state.nextIndex =
            Math.max(
              state.nextIndex,
              originalIndex + 1
            );
        }

        saveState(state);

        if (
          String(
            error?.message
            ||
            error
          ).includes(
            'LOGIN_REQUIRED'
          )
        ) {
          state.stopped = true;

          setStatus(
            'ログイン画面を検出。収集を停止しました。'
          );

          break;
        }
      }

      await sleep(
        550
      );
    }

    state.running = false;

    saveState(state);
    updateButtons();

    const rows =
      await getAllRows();

    setStatus(
      '完了/停止: 保存 '
      + rows.length
      + '件・エラー '
      + state.errors.length
      + '件・次 '
      + (
        state.nextIndex + 1
      )
    );
  }

  function stop() {
    state.stopped = true;

    saveState(state);

    setStatus(
      '停止要求を受け付けました'
    );
  }

  async function retryErrors() {
    const ids = [
      ...new Set(
        state.errors.map(
          item =>
            String(
              item.card_no
            )
        )
      )
    ];

    if (
      ids.length === 0
    ) {
      setStatus(
        '再取得対象エラーなし'
      );

      return;
    }

    state.errors = [];

    saveState(state);

    await run(ids);
  }

  async function makeExportObject() {
    const rows =
      await getAllRows();

    rows.sort(
      (a, b) =>
        Number(
          a.card_no
        )
        -
        Number(
          b.card_no
        )
    );

    return {
      meta: {
        version:
          VERSION,

        exported_at:
          new Date()
            .toISOString(),

        target_count:
          CARD_IDS.length,

        saved_count:
          rows.length,

        error_count:
          state.errors.length,

        next_index:
          state.nextIndex
      },

      errors:
        state.errors,

      cards:
        rows
    };
  }

  async function shareJson() {
    const object =
      await makeExportObject();

    const text =
      JSON.stringify(
        object,
        null,
        2
      );

    const file =
      new File(
        [text],
        'jolly_evolution_forensic_152.json',
        {
          type:
            'application/json'
        }
      );

    if (
      navigator.canShare
      &&
      navigator.canShare({
        files: [file]
      })
    ) {
      await navigator.share({
        files:
          [file],

        title:
          'JOLLY 神格・魔格152枚調査JSON'
      });

      return;
    }

    await navigator.clipboard
      .writeText(text);

    setStatus(
      '共有非対応のためJSONをクリップボードへコピーしました'
    );
  }

  async function inspectEchidna() {
    const row =
      await fetchCard(
        '1679'
      );

    await putRow(
      row
    );

    const hit =
      row.body_text
        .includes(
          '神徳'
        )
      ||
      JSON.stringify(
        row.keyword_contexts
      ).includes(
        '神徳'
      )
      ||
      JSON.stringify(
        row.images
      ).includes(
        '神徳'
      )
      ||
      JSON.stringify(
        row.scripts
      ).includes(
        '神徳'
      );

    setStatus(
      '1679取得成功。神徳 '
      + (
        hit
          ? '検出'
          : '未検出'
      )
    );

    alert(
      '神格エキドナ No.1679\n'
      +
      '神徳: '
      +
      (
        hit
          ? '検出'
          : '未検出'
      )
      +
      '\n'
      +
      '本文文字数: '
      +
      row.body_text.length
      +
      '\n'
      +
      '候補要素: '
      +
      row.keyword_contexts.length
      +
      '\n'
      +
      '画像: '
      +
      row.images.length
    );
  }

  async function resetAll() {
    if (
      !confirm(
        '進捗と保存済み152枚データをすべて消去しますか？'
      )
    ) {
      return;
    }

    stop();

    await clearRows();

    state = {
      nextIndex: 0,
      running: false,
      stopped: false,
      errors: []
    };

    saveState(state);

    setStatus(
      'リセット完了'
    );

    updateButtons();
  }

  async function refreshStatus() {
    const rows =
      await getAllRows();

    state =
      loadState();

    setStatus(
      '保存 '
      + rows.length
      + '/'
      + CARD_IDS.length
      + '件・エラー '
      + state.errors.length
      + '件・次 '
      + Math.min(
        state.nextIndex + 1,
        CARD_IDS.length
      )
    );
  }

  function updateButtons() {
    const start =
      document.getElementById(
        'jec_start'
      );

    if (start) {
      start.disabled =
        !!state.running;
    }
  }

  function makePanel() {
    document
      .getElementById(
        'jolly_evolution_collector_panel'
      )
      ?.remove();

    const panel =
      document.createElement(
        'div'
      );

    panel.id =
      'jolly_evolution_collector_panel';

    panel.style.cssText = [
      'position:fixed',
      'z-index:2147483647',
      'left:8px',
      'right:8px',
      'bottom:8px',
      'background:#111827',
      'color:white',
      'padding:12px',
      'border-radius:16px',
      'box-shadow:0 8px 30px #0008',
      'font-family:-apple-system,BlinkMacSystemFont,sans-serif',
      'font-size:13px',
      'max-height:72vh',
      'overflow:auto'
    ].join(';');

    panel.innerHTML = `
      <div
        style="
          display:flex;
          justify-content:space-between;
          gap:8px;
          align-items:center;
          margin-bottom:8px
        "
      >
        <b>
          神格・魔格 152枚 再調査
        </b>

        <button id="jec_close">
          ×
        </button>
      </div>

      <div
        id="jec_status"
        style="
          background:#1f2937;
          padding:8px;
          border-radius:10px;
          margin-bottom:8px
        "
      >
        状態確認中…
      </div>

      <div
        style="
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:7px
        "
      >
        <button id="jec_echidna">
          ① 1679だけ検証
        </button>

        <button id="jec_start">
          ② 収集開始/再開
        </button>

        <button id="jec_stop">
          停止
        </button>

        <button id="jec_retry">
          エラー再取得
        </button>

        <button id="jec_share">
          JSON共有/保存
        </button>

        <button id="jec_reset">
          全リセット
        </button>
      </div>

      <div
        style="
          font-size:11px;
          color:#cbd5e1;
          margin-top:8px;
          line-height:1.5
        "
      >
        最初に「1679だけ検証」を実行してください。
        ログイン画面を検出した場合は自動停止します。
        本番結果はIndexedDBへ保存されるため、
        途中でSafariを閉じても再開できます。
      </div>
    `;

    const css = `
      #jolly_evolution_collector_panel button {
        font: inherit;
        border: 0;
        border-radius: 10px;
        padding: 9px 8px;
        background: white;
        color: #111827;
        font-weight: 700;
      }

      #jolly_evolution_collector_panel button:disabled {
        opacity: .45;
      }
    `;

    const style =
      document.createElement(
        'style'
      );

    style.textContent =
      css;

    document
      .documentElement
      .appendChild(style);

    document.body
      .appendChild(panel);

    document
      .getElementById(
        'jec_close'
      )
      .onclick =
      () =>
        panel.remove();

    document
      .getElementById(
        'jec_echidna'
      )
      .onclick =
      () =>
        inspectEchidna()
          .catch(
            error =>
              setStatus(
                '1679検証失敗: '
                + error.message
              )
          );

    document
      .getElementById(
        'jec_start'
      )
      .onclick =
      () =>
        run()
          .catch(
            error =>
              setStatus(
                '実行失敗: '
                + error.message
              )
          );

    document
      .getElementById(
        'jec_stop'
      )
      .onclick =
      stop;

    document
      .getElementById(
        'jec_retry'
      )
      .onclick =
      () =>
        retryErrors()
          .catch(
            error =>
              setStatus(
                '再取得失敗: '
                + error.message
              )
          );

    document
      .getElementById(
        'jec_share'
      )
      .onclick =
      () =>
        shareJson()
          .catch(
            error =>
              setStatus(
                '書き出し失敗: '
                + error.message
              )
          );

    document
      .getElementById(
        'jec_reset'
      )
      .onclick =
      () =>
        resetAll()
          .catch(
            error =>
              setStatus(
                'リセット失敗: '
                + error.message
              )
          );

    refreshStatus();
    updateButtons();
  }

  makePanel();

})();
