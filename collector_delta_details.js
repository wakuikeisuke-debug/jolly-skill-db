
(() => {
  'use strict';

  const VERSION =
    'jolly-delta-details-1.0';

  const STATE_KEY =
    'JOLLY_DELTA_DETAILS_STATE_V1';

  const RESULT_KEY =
    'JOLLY_DELTA_DETAILS_RESULTS_V1';

  const TARGETS =
[{"card_no":"1573","card_name":"紅闇の針エクテレシィ","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=AlbumDetail&card=1573"},{"card_no":"1574","card_name":"月夜のスナイパー・ショコラ","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=AlbumDetail&card=1574"},{"card_no":"1575","card_name":"糖月のスナイパー・ショコラ","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=AlbumDetail&card=1575"},{"card_no":"1576","card_name":"霊冥の聖女ユスフェミア","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=AlbumDetail&card=1576"},{"card_no":"1577","card_name":"亡竜乗りのシズク","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=AlbumDetail&card=1577"},{"card_no":"1578","card_name":"夜咆竜乗りのシズク","detail_url":"https://yamada.kaizoku-jolly.com/?M=Card&A=AlbumDetail&card=1578"}]
  ;


  const sleep =
    ms =>
      new Promise(
        resolve =>
          setTimeout(
            resolve,
            ms
          )
      );


  function clean(value) {

    return String(
      value || ''
    )
      .replace(
        /\s+/g,
        ' '
      )
      .trim();
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
          next_index: 0,
          running: false,
          stopped: false,
          errors: []
        }
      );

    } catch (_) {

      return {
        next_index: 0,
        running: false,
        stopped: false,
        errors: []
      };
    }
  }


  function saveState(state) {

    localStorage.setItem(
      STATE_KEY,
      JSON.stringify(
        state
      )
    );
  }


  function loadResults() {

    try {

      return (
        JSON.parse(
          localStorage.getItem(
            RESULT_KEY
          )
        )
        ||
        {}
      );

    } catch (_) {

      return {};
    }
  }


  function saveResults(results) {

    localStorage.setItem(
      RESULT_KEY,
      JSON.stringify(
        results
      )
    );
  }


  let state =
    loadState();

  let results =
    loadResults();


  function detailUrl(
    cardNo
  ) {

    const url =
      new URL(
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
      cardNo
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


  function firstText(
    doc,
    selectors
  ) {

    for (
      const selector
      of selectors
    ) {

      const el =
        doc.querySelector(
          selector
        );

      const text =
        clean(
          el?.textContent
        );

      if (text) {
        return text;
      }
    }

    return '';
  }


  function extractCardName(doc) {

    const spans =
      Array.from(
        doc.querySelectorAll(
          '#content span'
        )
      );

    const evolved =
      spans.find(
        el => {
          const t =
            clean(
              el.textContent
            );

          return (
            t.startsWith(
              '【神格】'
            )
            ||
            t.startsWith(
              '【魔格】'
            )
          );
        }
      );

    if (evolved) {

      return clean(
        evolved.textContent
      );
    }


    const candidates = [
      '#content h1',
      '#content h2',
      '.card_name',
      '.name',
      '.title'
    ];


    for (
      const selector
      of candidates
    ) {

      const text =
        firstText(
          doc,
          [selector]
        );

      if (text) {
        return text;
      }
    }


    return '';
  }


  function extractEvolutionType(
    cardName
  ) {

    if (
      cardName.startsWith(
        '【神格】'
      )
    ) {

      return 'divine';
    }

    if (
      cardName.startsWith(
        '【魔格】'
      )
    ) {

      return 'demonic';
    }

    return null;
  }


  function extractSpecialSkills(doc) {

    return Array.from(
      doc.querySelectorAll(
        '.special_skill_bg'
      )
    )
      .map(
        (block, index) => {

          const name =
            clean(
              block.querySelector(
                '.textcolor_special_skill_name'
              )?.textContent
            );

          const effect =
            clean(
              block.querySelector(
                '.textcolor_special_skill_text'
              )?.textContent
            );

          const icon =
            block.querySelector(
              '.page_card_albumDetail_status_skill_icon'
            )
              ?.getAttribute(
                'src'
              )
            ||
            null;


          return {
            slot:
              index + 1,

            skill_name:
              name
              || null,

            effect:
              effect
              || null,

            icon_url:
              icon,

            source:
              'special_skill_bg'
          };
        }
      )
      .filter(
        x =>
          x.skill_name
          ||
          x.effect
      );
  }


  function extractImage(
    doc,
    cardNo
  ) {

    const exact =
      doc.querySelector(
        `img[src*="/card/640/${cardNo}.jpg"]`
      );

    if (exact) {

      return new URL(
        exact.getAttribute(
          'src'
        ),
        location.href
      ).href;
    }


    const fallback =
      Array.from(
        doc.images
      ).find(
        img =>
          String(
            img.getAttribute(
              'src'
            )
            || ''
          ).includes(
            '/card/'
          )
      );


    return fallback
      ?
        new URL(
          fallback.getAttribute(
            'src'
          ),
          location.href
        ).href
      :
        null;
  }


  function extractNumber(
    doc,
    selector
  ) {

    const text =
      clean(
        doc.querySelector(
          selector
        )?.textContent
      );


    if (!text) {
      return null;
    }


    const m =
      text.match(
        /-?\d+(?:\.\d+)?/
      );


    if (!m) {
      return null;
    }


    const n =
      Number(
        m[0]
      );


    return Number.isFinite(
      n
    )
      ? n
      : null;
  }


  function extractStats(doc) {

    return {

      hp:
        extractNumber(
          doc,
          '#page_deck_select_master_hp'
        ),

      attack:
        extractNumber(
          doc,
          '#page_deck_select_master_attack'
        ),

      speed:
        extractNumber(
          doc,
          '#page_deck_select_master_speed'
        ),

      cost:
        extractNumber(
          doc,
          '#page_deck_select_master_cost'
        )
    };
  }


  function extractAllTables(doc) {

    return Array.from(
      doc.querySelectorAll(
        'table'
      )
    )
      .map(
        (
          table,
          index
        ) => ({
          index:

            index,

          text:
            clean(
              table.textContent
            )
        })
      )
      .filter(
        x =>
          x.text
      );
  }


  function extractSkillLikeBlocks(
    doc
  ) {

    const selectors = [
      '.skill_border01',
      '.skill_border02',
      '.page_card_albumDetail_status_skill',
      '[class*="skill_border"]'
    ];


    const found =
      [];


    for (
      const selector
      of selectors
    ) {

      for (
        const el
        of doc.querySelectorAll(
          selector
        )
      ) {

        const text =
          clean(
            el.textContent
          );

        if (!text) {
          continue;
        }


        found.push({
          selector:
            selector,

          text:
            text,

          html:
            el.outerHTML
              .slice(
                0,
                10000
              )
        });
      }
    }


    const seen =
      new Set();

    return found.filter(
      row => {

        const key =
          row.text;

        if (
          seen.has(
            key
          )
        ) {
          return false;
        }

        seen.add(
          key
        );

        return true;
      }
    );
  }


  function extractRawMetadata(doc) {

    const bodyText =
      clean(
        doc.body
          ?.innerText
        ||
        doc.body
          ?.textContent
        ||
        ''
      );


    return {

      title:
        doc.title
        || '',

      body_text:
        bodyText
          .slice(
            0,
            50000
          ),

      tables:
        extractAllTables(
          doc
        ),

      skill_blocks:
        extractSkillLikeBlocks(
          doc
        )
    };
  }


  async function fetchTarget(
    target
  ) {

    const url =
      detailUrl(
        target.card_no
      );


    const response =
      await fetch(
        url,
        {
          credentials:
            'include',

          cache:
            'no-store',

          redirect:
            'follow'
        }
      );


    const html =
      await response.text();


    if (!response.ok) {

      throw new Error(
        'HTTP '
        +
        response.status
      );
    }


    if (
      /ログイン情報入力/
        .test(html)
      ||
      /module=auth/
        .test(html)
      ||
      /auth001/
        .test(html)
    ) {

      throw new Error(
        'LOGIN_REQUIRED'
      );
    }


    const doc =
      new DOMParser()
        .parseFromString(
          html,
          'text/html'
        );


    const cardName =
      extractCardName(
        doc
      );


    const evolutionType =
      extractEvolutionType(
        cardName
      );


    return {

      card_no:
        String(
          target.card_no
        ),

      manifest_card_name:
        target.card_name
        || '',

      card_name:
        cardName,

      evolution_type:
        evolutionType,

      image_url:
        extractImage(
          doc,
          target.card_no
        ),

      stats:
        extractStats(
          doc
        ),

      special_skills:
        extractSpecialSkills(
          doc
        ),

      raw:
        extractRawMetadata(
          doc
        ),

      detail_url:
        url,

      collected_at:
        new Date()
          .toISOString()
    };
  }


  function setStatus(
    message
  ) {

    const el =
      document.getElementById(
        'jdd_status'
      );

    if (el) {

      el.textContent =
        message;
    }
  }


  function refreshSummary() {

    const rows =
      Object.values(
        results
      );


    const evolved =
      rows.filter(
        x =>
          x.evolution_type
      );


    const special =
      rows.filter(
        x =>
          (
            x.special_skills
            || []
          ).length
          > 0
      );


    setStatus(
      '対象 '
      +
      TARGETS.length
      +
      '件'
      +
      ' ／ 保存 '
      +
      rows.length
      +
      '件'
      +
      ' ／ 神格・魔格 '
      +
      evolved.length
      +
      '件'
      +
      ' ／ 特殊スキル '
      +
      special.length
      +
      '件'
      +
      ' ／ エラー '
      +
      state.errors.length
      +
      '件'
    );
  }


  async function run() {

    if (
      TARGETS.length
      === 0
    ) {

      alert(
        '今回のmanifestには新規カードがありません。'
      );

      refreshSummary();

      return;
    }


    if (
      state.running
    ) {
      return;
    }


    state.running =
      true;

    state.stopped =
      false;

    saveState(
      state
    );


    for (
      let i =
        state.next_index;

      i <
        TARGETS.length;

      i++
    ) {

      if (
        state.stopped
      ) {
        break;
      }


      const target =
        TARGETS[i];


      setStatus(
        '収集中 '
        +
        (
          i + 1
        )
        +
        '/'
        +
        TARGETS.length
        +
        ' No.'
        +
        target.card_no
      );


      try {

        const row =
          await fetchTarget(
            target
          );


        results[
          String(
            target.card_no
          )
        ] =
          row;


        saveResults(
          results
        );


        state.errors =
          state.errors.filter(
            x =>
              String(
                x.card_no
              )
              !==
              String(
                target.card_no
              )
          );


      } catch (
        error
      ) {

        state.errors =
          state.errors.filter(
            x =>
              String(
                x.card_no
              )
              !==
              String(
                target.card_no
              )
          );


        state.errors.push({

          card_no:
            String(
              target.card_no
            ),

          card_name:
            target.card_name
            || '',

          message:
            String(
              error
                ?.message
              ||
              error
            ),

          at:
            new Date()
              .toISOString()
        });


        if (
          String(
            error
              ?.message
            ||
            error
          ).includes(
            'LOGIN_REQUIRED'
          )
        ) {

          state.stopped =
            true;

          setStatus(
            'ログイン切れを検出。停止しました。'
          );

          break;
        }
      }


      state.next_index =
        i + 1;


      saveState(
        state
      );


      await sleep(
        600
      );
    }


    state.running =
      false;


    saveState(
      state
    );


    refreshSummary();
  }


  function stop() {

    state.stopped =
      true;


    saveState(
      state
    );


    setStatus(
      '停止要求を受け付けました'
    );
  }


  async function retryErrors() {

    const ids =
      [
        ...new Set(
          state.errors.map(
            x =>
              String(
                x.card_no
              )
          )
        )
      ];


    if (
      ids.length
      === 0
    ) {

      alert(
        'エラーはありません'
      );

      return;
    }


    state.errors =
      [];


    for (
      let i = 0;

      i <
        ids.length;

      i++
    ) {

      const cardNo =
        ids[i];


      const target =
        TARGETS.find(
          x =>
            String(
              x.card_no
            )
            ===
            cardNo
        );


      if (!target) {
        continue;
      }


      setStatus(
        '再取得 '
        +
        (
          i + 1
        )
        +
        '/'
        +
        ids.length
        +
        ' No.'
        +
        cardNo
      );


      try {

        const row =
          await fetchTarget(
            target
          );


        results[
          cardNo
        ] =
          row;


        saveResults(
          results
        );


      } catch (
        error
      ) {

        state.errors.push({

          card_no:
            cardNo,

          card_name:
            target.card_name
            || '',

          message:
            String(
              error
                ?.message
              ||
              error
            ),

          at:
            new Date()
              .toISOString()
        });
      }


      await sleep(
        700
      );
    }


    saveState(
      state
    );


    refreshSummary();
  }


  function buildExport() {

    const cards =
      Object.values(
        results
      )
      .sort(
        (
          a,
          b
        ) =>
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
          TARGETS.length,

        saved_count:
          cards.length,

        error_count:
          state.errors.length,

        evolved_count:
          cards.filter(
            x =>
              x.evolution_type
          ).length,

        special_skill_card_count:
          cards.filter(
            x =>
              (
                x.special_skills
                || []
              ).length
              > 0
          ).length
      },


      errors:
        state.errors,

      cards:
        cards
    };
  }


  async function shareJson() {

    const text =
      JSON.stringify(
        buildExport(),
        null,
        2
      );


    const file =
      new File(
        [text],
        'jolly_delta_card_details.json',
        {
          type:
            'application/json'
        }
      );


    if (
      navigator.canShare
      &&
      navigator.canShare({
        files:
          [file]
      })
    ) {

      try {

        await navigator.share({
          files:
            [file]
        });

        return;

      } catch (_) {
      }
    }


    await navigator
      .clipboard
      .writeText(
        text
      );


    alert(
      'JSON共有に失敗したため全文をコピーしました'
    );
  }


  async function copyJson() {

    const text =
      JSON.stringify(
        buildExport(),
        null,
        2
      );


    await navigator
      .clipboard
      .writeText(
        text
      );


    alert(
      'JSON全文をコピーしました'
    );
  }


  function resetAll() {

    if (
      !confirm(
        '今回の差分詳細収集結果と進捗を削除しますか？'
      )
    ) {

      return;
    }


    localStorage
      .removeItem(
        STATE_KEY
      );


    localStorage
      .removeItem(
        RESULT_KEY
      );


    state = {
      next_index: 0,
      running: false,
      stopped: false,
      errors: []
    };


    results = {};


    refreshSummary();
  }


  function makePanel() {

    document
      .getElementById(
        'jolly_delta_details_panel'
      )
      ?.remove();


    const panel =
      document.createElement(
        'div'
      );


    panel.id =
      'jolly_delta_details_panel';


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
      'box-shadow:0 8px 30px #0008'
    ].join(
      ';'
    );


    panel.innerHTML = `
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:8px;
      ">
        <b>
          JOLLY 差分カード詳細
        </b>

        <button id="jdd_close">
          ×
        </button>
      </div>

      <div
        id="jdd_status"
        style="
          background:#1f2937;
          padding:8px;
          border-radius:10px;
          margin-bottom:8px;
          line-height:1.5
        "
      >
        読み込み中…
      </div>

      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:7px;
      ">

        <button id="jdd_start">
          ① 新規カード収集
        </button>

        <button id="jdd_stop">
          停止
        </button>

        <button id="jdd_retry">
          エラー再取得
        </button>

        <button id="jdd_share">
          JSON保存
        </button>

        <button id="jdd_copy">
          JSON全文コピー
        </button>

        <button id="jdd_reset">
          今回分リセット
        </button>

      </div>
    `;


    const style =
      document.createElement(
        'style'
      );


    style.textContent = `
      #jolly_delta_details_panel button {
        border:0;
        border-radius:10px;
        padding:9px 7px;
        background:#fff;
        color:#111827;
        font:inherit;
        font-weight:700;
      }
    `;


    document
      .documentElement
      .appendChild(
        style
      );


    document.body
      .appendChild(
        panel
      );


    document
      .getElementById(
        'jdd_close'
      )
      .onclick =
        () =>
          panel.remove();


    document
      .getElementById(
        'jdd_start'
      )
      .onclick =
        () =>
          run()
            .catch(
              e =>
                alert(
                  e.message
                )
            );


    document
      .getElementById(
        'jdd_stop'
      )
      .onclick =
        stop;


    document
      .getElementById(
        'jdd_retry'
      )
      .onclick =
        () =>
          retryErrors()
            .catch(
              e =>
                alert(
                  e.message
                )
            );


    document
      .getElementById(
        'jdd_share'
      )
      .onclick =
        () =>
          shareJson()
            .catch(
              e =>
                alert(
                  e.message
                )
            );


    document
      .getElementById(
        'jdd_copy'
      )
      .onclick =
        () =>
          copyJson()
            .catch(
              e =>
                alert(
                  e.message
                )
            );


    document
      .getElementById(
        'jdd_reset'
      )
      .onclick =
        resetAll;


    refreshSummary();
  }


  makePanel();

})();
