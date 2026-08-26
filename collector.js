(() => {
  "use strict";

  const VERSION = "catalog-panel-v1.0";
  const STORAGE_KEY = "jolly_card_catalog_panel_v1";
  const PANEL_ID = "jolly-catalog-panel";

  // アルバムは p=0 ～ p=113 の114ページ
  const DEFAULT_TOTAL_PAGES = 114;

  // 「次の○ページ取得」の単位
  const BATCH_PAGES = 10;

  const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

  // ==============================
  // 保存データ
  // ==============================

  function loadState() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "null"
      );

      if (saved && Array.isArray(saved.cards)) {
        return saved;
      }
    } catch (e) {}

    return {
      version: VERSION,
      next_page: 0,
      total_pages: DEFAULT_TOTAL_PAGES,
      cards: [],
      updated_at: null,
      finished: false
    };
  }

  function saveState(state) {
    state.updated_at = new Date().toISOString();
    state.version = VERSION;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state)
    );
  }

  // ==============================
  // card_noで重複排除
  // ==============================

  function dedupeCards(cards) {
    const map = new Map();

    for (const card of cards) {
      if (!card || !card.card_no) {
        continue;
      }

      map.set(
        String(card.card_no),
        card
      );
    }

    return Array.from(map.values()).sort(
      (a, b) =>
        Number(a.card_no) - Number(b.card_no)
    );
  }

  // ==============================
  // アルバムURL
  // ==============================

  function albumUrl(page) {
    return (
      "/?M=Card&A=Album" +
      "&property=" +
      "&name_text=" +
      "&rare=" +
      "&gacha_style=0" +
      "&year=0" +
      "&skill_no=" +
      "&card_no=" +
      "&p=" + page
    );
  }

  // ==============================
  // 総ページ数検出
  // ==============================

  function detectTotalPages(doc) {
    let maxPage = -1;

    doc
      .querySelectorAll(
        'a[href*="A=Album"][href*="p="]'
      )
      .forEach(a => {
        try {
          const url = new URL(
            a.getAttribute("href"),
            location.href
          );

          const page = Number(
            url.searchParams.get("p")
          );

          if (Number.isFinite(page)) {
            maxPage = Math.max(
              maxPage,
              page
            );
          }
        } catch (e) {}
      });

    return maxPage >= 0
      ? maxPage + 1
      : DEFAULT_TOTAL_PAGES;
  }

  // ==============================
  // 1ページからカード抽出
  // ==============================

  function extractCards(doc, page) {
    const cards = [];

    doc
      .querySelectorAll(
        'a[href*="A=AlbumDetail"][href*="card="]'
      )
      .forEach(a => {
        try {
          const href =
            a.getAttribute("href");

          const url = new URL(
            href,
            location.href
          );

          const cardNo =
            url.searchParams.get("card");

          if (!cardNo) {
            return;
          }

          const box =
            a.closest(".ui-bar-c");

          const name =
            box
              ?.querySelector("font")
              ?.textContent
              ?.trim() ||
            a.parentElement
              ?.querySelector("font")
              ?.textContent
              ?.trim() ||
            "";

          const img =
            a
              .querySelector("img")
              ?.getAttribute("src") ||
            "";

          cards.push({
            card_no: String(cardNo),

            card_name: name,

            album_page: page,

            image_url:
              img
                ? new URL(
                    img,
                    location.href
                  ).href
                : "",

            detail_url:
              location.origin +
              "/?M=Card&A=AlbumDetail&card=" +
              encodeURIComponent(cardNo)
          });

        } catch (e) {}
      });

    return dedupeCards(cards);
  }

  // ==============================
  // アルバム1ページ取得
  // ==============================

  async function fetchAlbumPage(page) {

    const response =
      await fetch(
        albumUrl(page),
        {
          credentials: "same-origin",
          cache: "no-store"
        }
      );

    if (!response.ok) {
      throw new Error(
        "HTTP " +
        response.status +
        " / page " +
        (page + 1)
      );
    }

    const html =
      await response.text();

    // ログイン切れ検出
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

    return {
      cards:
        extractCards(
          doc,
          page
        ),

      total_pages:
        detectTotalPages(doc)
    };
  }

  // ==============================
  // JSON書き出し
  // ==============================

  function downloadJson(state) {

    const payload = {
      meta: {
        type:
          "jolly_card_catalog",

        version:
          VERSION,

        total_cards:
          state.cards.length,

        next_page:
          state.next_page,

        total_pages:
          state.total_pages,

        finished:
          state.finished,

        updated_at:
          state.updated_at,

        source:
          location.origin
      },

      cards:
        dedupeCards(
          state.cards
        )
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

    a.href = url;

    a.download =
      "jolly_card_catalog_" +
      state.cards.length +
      ".json";

    document.body.appendChild(a);

    a.click();

    a.remove();

    setTimeout(
      () =>
        URL.revokeObjectURL(url),
      5000
    );
  }

  // ==============================
  // パネル
  // ==============================

  function removePanel() {
    document
      .getElementById(PANEL_ID)
      ?.remove();
  }

  let busy = false;
  let state = loadState();

  removePanel();

  const root =
    document.createElement("div");

  root.id = PANEL_ID;

  root.innerHTML = `
<style>

#${PANEL_ID} {
  position: fixed;
  inset: 0;
  z-index: 2147483647;

  background:
    rgba(0,0,0,.55);

  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "Helvetica Neue",
    sans-serif;

  color: #111;

  text-shadow: none;

  display: flex;

  align-items: flex-end;

  justify-content: center;
}

#${PANEL_ID} * {
  box-sizing: border-box;
}

#${PANEL_ID} .jp-card {

  width: 100%;

  max-width: 680px;

  max-height: 88vh;

  overflow: auto;

  background: #f6f7f9;

  border-radius:
    20px 20px 0 0;

  padding:
    14px 14px
    calc(
      16px +
      env(safe-area-inset-bottom)
    );

  box-shadow:
    0 -8px 30px
    rgba(0,0,0,.35);
}

#${PANEL_ID} .jp-head {

  display: flex;

  align-items: center;

  justify-content:
    space-between;

  gap: 10px;

  margin-bottom: 12px;
}

#${PANEL_ID} .jp-title {

  font-size: 18px;

  font-weight: 800;
}

#${PANEL_ID} .jp-ver {

  font-size: 11px;

  color: #666;
}

#${PANEL_ID} button {

  appearance: none;

  border:
    1px solid #ccd0d5;

  background: #fff;

  color: #111;

  border-radius: 12px;

  padding: 11px 12px;

  font-size: 15px;

  font-weight: 700;
}

#${PANEL_ID} button.primary {

  background: #111827;

  color: #fff;

  border-color: #111827;
}

#${PANEL_ID} button.danger {

  color: #b42318;
}

#${PANEL_ID} button:disabled {

  opacity: .45;
}

#${PANEL_ID} .jp-close {

  width: 36px;

  height: 36px;

  border-radius: 999px;

  padding: 0;

  font-size: 20px;
}

#${PANEL_ID} .jp-box {

  background: #fff;

  border:
    1px solid #e2e5e9;

  border-radius: 14px;

  padding: 12px;

  margin: 10px 0;
}

#${PANEL_ID} .jp-big {

  font-size: 24px;

  font-weight: 800;
}

#${PANEL_ID} .jp-small {

  font-size: 12px;

  color: #666;

  line-height: 1.45;
}

#${PANEL_ID} .jp-grid {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 8px;

  margin-top: 10px;
}

#${PANEL_ID} .jp-progress {

  height: 10px;

  background: #e6e8ec;

  border-radius: 999px;

  overflow: hidden;

  margin: 10px 0 6px;
}

#${PANEL_ID} .jp-bar {

  height: 100%;

  background: #111827;

  width: 0%;
}

#${PANEL_ID} .jp-log {

  white-space: pre-wrap;

  font:
    12px
    ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;

  background: #111827;

  color: #f8fafc;

  border-radius: 12px;

  padding: 10px;

  min-height: 70px;

  max-height: 160px;

  overflow: auto;
}

</style>


<div class="jp-card">

  <div class="jp-head">

    <div>

      <div class="jp-title">
        JOLLY カード目録収集
      </div>

      <div class="jp-ver">
        ${VERSION}
      </div>

    </div>

    <button
      class="jp-close"
      id="jp-close">
      ×
    </button>

  </div>


  <div class="jp-box">

    <div class="jp-small">
      収集済みカード
    </div>

    <div class="jp-big">

      <span id="jp-count">
        0
      </span>

      / 1359

    </div>


    <div class="jp-progress">

      <div
        class="jp-bar"
        id="jp-bar">
      </div>

    </div>


    <div
      class="jp-small"
      id="jp-page-status">
    </div>

  </div>


  <div class="jp-grid">

    <button
      class="primary"
      id="jp-next">

      次の10ページ取得

    </button>


    <button
      id="jp-all">

      残りを連続取得

    </button>


    <button
      id="jp-export">

      JSONを書き出す

    </button>


    <button
      id="jp-check">

      状態を再読込

    </button>


    <button
      class="danger"
      id="jp-reset">

      進捗をリセット

    </button>


    <button
      id="jp-close2">

      閉じる

    </button>

  </div>


  <div class="jp-box">

    <div
      class="jp-small"
      style="margin-bottom:6px">

      実行ログ

    </div>

    <div
      class="jp-log"
      id="jp-log">

      準備完了

    </div>

  </div>

</div>
`;

  document.body.appendChild(root);

  const $ =
    selector =>
      root.querySelector(selector);


  // ==============================
  // ログ表示
  // ==============================

  function log(message) {

    const now =
      new Date()
        .toLocaleTimeString();

    const el =
      $("#jp-log");

    el.textContent =
      "[" +
      now +
      "] " +
      message +
      "\n" +
      el.textContent;
  }


  // ==============================
  // 表示更新
  // ==============================

  function render() {

    state = loadState();

    const expectedCards = 1359;

    const percent =
      Math.min(
        100,
        (
          state.cards.length /
          expectedCards
        ) * 100
      );


    $("#jp-count")
      .textContent =
      state.cards.length;


    $("#jp-bar")
      .style.width =
      percent.toFixed(1) +
      "%";


    const currentPage =
      Math.min(
        state.next_page + 1,
        state.total_pages
      );


    $("#jp-page-status")
      .textContent =
      state.finished

        ? (
          "完了：" +
          state.total_pages +
          "ページ取得済み"
        )

        : (
          "次回：" +
          currentPage +
          "ページ目 / 全" +
          state.total_pages +
          "ページ"
        );


    [
      "#jp-next",
      "#jp-all",
      "#jp-reset"
    ]
    .forEach(id => {

      $(id).disabled =
        busy;

    });


    $("#jp-export")
      .disabled =
      busy ||
      state.cards.length === 0;


    $("#jp-next")
      .disabled =
      busy ||
      state.finished;


    $("#jp-all")
      .disabled =
      busy ||
      state.finished;
  }


  // ==============================
  // 収集本体
  // ==============================

  async function collectPages(
    limitPages
  ) {

    if (busy) {
      return;
    }

    busy = true;

    render();


    try {

      state =
        loadState();


      if (state.finished) {

        log(
          "すでに全ページ取得済みです。"
        );

        return;
      }


      const start =
        state.next_page;


      const endExclusive =
        Math.min(

          state.total_pages,

          limitPages === Infinity

            ? state.total_pages

            : start +
              limitPages
        );


      for (
        let page = start;
        page < endExclusive;
        page++
      ) {

        log(
          (page + 1) +
          "ページ目を取得中…"
        );


        const result =
          await fetchAlbumPage(
            page
          );


        if (
          result.total_pages &&
          result.total_pages !==
            state.total_pages
        ) {

          state.total_pages =
            result.total_pages;
        }


        state.cards =
          dedupeCards([
            ...state.cards,
            ...result.cards
          ]);


        state.next_page =
          page + 1;


        state.finished =
          state.next_page >=
          state.total_pages;


        saveState(state);

        render();


        log(
          (page + 1) +
          "ページ目：" +
          result.cards.length +
          "件 / 累計" +
          state.cards.length +
          "件"
        );


        // サーバーへの連続アクセスを
        // 少し緩和する
        await sleep(350);
      }


      if (state.finished) {

        log(
          "全ページ取得完了：" +
          state.cards.length +
          "件"
        );

      } else {

        log(
          "今回の取得完了。次は" +
          (state.next_page + 1) +
          "ページ目から。"
        );
      }

    } catch (e) {

      log(
        "エラー：" +
        (
          e.message ||
          String(e)
        )
      );

    } finally {

      busy = false;

      render();
    }
  }


  // ==============================
  // ボタン
  // ==============================

  $("#jp-next").onclick =
    () =>
      collectPages(
        BATCH_PAGES
      );


  $("#jp-all").onclick =
    async () => {

      const ok =
        confirm(
          "残りページを連続取得します。\n\n" +
          "Safariをこの画面のままにしてください。\n\n" +
          "続行しますか？"
        );

      if (!ok) {
        return;
      }

      await collectPages(
        Infinity
      );
    };


  $("#jp-export").onclick =
    () => {

      state =
        loadState();

      downloadJson(state);

      log(
        "JSONを書き出しました：" +
        state.cards.length +
        "件"
      );
    };


  $("#jp-check").onclick =
    () => {

      state =
        loadState();

      render();

      log(
        "状態再読込：" +
        state.cards.length +
        "件、次は" +
        (
          state.finished
            ? "完了"
            : (
              state.next_page +
              1
            ) +
              "ページ目"
        )
      );
    };


  $("#jp-reset").onclick =
    () => {

      const ok =
        confirm(
          "保存済みの目録進捗を" +
          "すべて削除します。\n\n" +
          "よろしいですか？"
        );

      if (!ok) {
        return;
      }


      localStorage.removeItem(
        STORAGE_KEY
      );


      state =
        loadState();


      render();


      log(
        "進捗をリセットしました。"
      );
    };


  $("#jp-close").onclick =
    removePanel;


  $("#jp-close2").onclick =
    removePanel;


  // ==============================
  // 初期表示
  // ==============================

  render();


  // 固定ローダー側の
  // ショートカット処理を終了。
  //
  // パネル自体はWebページ上に
  // 残るので、そのまま操作できる。
  if (
    typeof completion ===
    "function"
  ) {

    completion(
      JSON.stringify({
        ok: true,
        panel: true,
        version: VERSION,
        collected_cards:
          state.cards.length,
        next_page:
          state.next_page + 1
      })
    );
  }

})();
