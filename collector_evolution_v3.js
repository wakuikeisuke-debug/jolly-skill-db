
(() => {
  'use strict';

  const VERSION =
    'evolution-special-skill-3.0';

  const RESULT_KEY =
    'JOLLY_EVOLUTION_SPECIAL_RESULTS_V3';

  const STATE_KEY =
    'JOLLY_EVOLUTION_SPECIAL_STATE_V3';

  const TARGETS =
[{"card_no": "1122", "type": "divine", "card_name": "【神格】氷眼のロロノア"}, {"card_no": "1123", "type": "demonic", "card_name": "【魔格】氷眼のロロノア"}, {"card_no": "1124", "type": "divine", "card_name": "【神格】純心のシンシア"}, {"card_no": "1125", "type": "demonic", "card_name": "【魔格】純心のシンシア"}, {"card_no": "1126", "type": "divine", "card_name": "【神格】砲撃のモーガン"}, {"card_no": "1127", "type": "demonic", "card_name": "【魔格】砲撃のモーガン"}, {"card_no": "1128", "type": "divine", "card_name": "【神格】騎龍のショウ"}, {"card_no": "1129", "type": "demonic", "card_name": "【魔格】騎龍のショウ"}, {"card_no": "1146", "type": "divine", "card_name": "【神格】ドラゴンスレイヤー・ジーク"}, {"card_no": "1147", "type": "demonic", "card_name": "【魔格】ドラゴンスレイヤー・ジーク"}, {"card_no": "1148", "type": "divine", "card_name": "【神格】剣舞のユノ"}, {"card_no": "1149", "type": "demonic", "card_name": "【魔格】剣舞のユノ"}, {"card_no": "1159", "type": "divine", "card_name": "【神格】祟る逆賊・ギィ"}, {"card_no": "1160", "type": "demonic", "card_name": "【魔格】祟る逆賊・ギィ"}, {"card_no": "1161", "type": "divine", "card_name": "【神格】博打のザッケローヌ"}, {"card_no": "1162", "type": "demonic", "card_name": "【魔格】博打のザッケローヌ"}, {"card_no": "1179", "type": "divine", "card_name": "【神格】英知の探求者ダンピアー"}, {"card_no": "1180", "type": "demonic", "card_name": "【魔格】英知の探求者ダンピアー"}, {"card_no": "1181", "type": "divine", "card_name": "【神格】秘宝隠しのキャプテンキッド"}, {"card_no": "1182", "type": "demonic", "card_name": "【魔格】秘宝隠しのキャプテンキッド"}, {"card_no": "1190", "type": "divine", "card_name": "【神格】剣姫ヨキル"}, {"card_no": "1191", "type": "demonic", "card_name": "【魔格】剣姫ヨキル"}, {"card_no": "1192", "type": "divine", "card_name": "【神格】紅焔の魔剣士サディアス"}, {"card_no": "1193", "type": "demonic", "card_name": "【魔格】紅焔の魔剣士サディアス"}, {"card_no": "1209", "type": "divine", "card_name": "【神格】ヤマタノオロチ"}, {"card_no": "1210", "type": "demonic", "card_name": "【魔格】ヤマタノオロチ"}, {"card_no": "1213", "type": "divine", "card_name": "【神格】素戔嗚尊"}, {"card_no": "1214", "type": "demonic", "card_name": "【魔格】素戔嗚尊"}, {"card_no": "1215", "type": "divine", "card_name": "【神格】雨雲の草薙ひばり"}, {"card_no": "1216", "type": "demonic", "card_name": "【魔格】雨雲の草薙ひばり"}, {"card_no": "1227", "type": "divine", "card_name": "【神格】智謀の赤髭ハイレッディン"}, {"card_no": "1228", "type": "demonic", "card_name": "【魔格】智謀の赤髭ハイレッディン"}, {"card_no": "1229", "type": "divine", "card_name": "【神格】猛勇の赤髭ウルージ"}, {"card_no": "1230", "type": "demonic", "card_name": "【魔格】猛勇の赤髭ウルージ"}, {"card_no": "1239", "type": "divine", "card_name": "【神格】緋色の閃剣イメルダ"}, {"card_no": "1240", "type": "demonic", "card_name": "【魔格】緋色の閃剣イメルダ"}, {"card_no": "1247", "type": "divine", "card_name": "【神格】散弾のヒメカ"}, {"card_no": "1248", "type": "demonic", "card_name": "【魔格】散弾のヒメカ"}, {"card_no": "1249", "type": "divine", "card_name": "【神格】鬼国の酔剣ジュン"}, {"card_no": "1250", "type": "demonic", "card_name": "【魔格】鬼国の酔剣ジュン"}, {"card_no": "1258", "type": "divine", "card_name": "【神格】純白の太刀イーリン"}, {"card_no": "1259", "type": "demonic", "card_name": "【魔格】純白の太刀イーリン"}, {"card_no": "1260", "type": "divine", "card_name": "【神格】閃光斬のアラド"}, {"card_no": "1261", "type": "demonic", "card_name": "【魔格】閃光斬のアラド"}, {"card_no": "1284", "type": "divine", "card_name": "【神格】漆黒の翼アヴィル"}, {"card_no": "1285", "type": "demonic", "card_name": "【魔格】漆黒の翼アヴィル"}, {"card_no": "1286", "type": "divine", "card_name": "【神格】竜殺しのスライン"}, {"card_no": "1287", "type": "demonic", "card_name": "【魔格】竜殺しのスライン"}, {"card_no": "1293", "type": "divine", "card_name": "【神格】竜血のドレイク"}, {"card_no": "1294", "type": "demonic", "card_name": "【魔格】竜血のドレイク"}, {"card_no": "1297", "type": "divine", "card_name": "【神格】白冷の薔薇イヴ"}, {"card_no": "1298", "type": "demonic", "card_name": "【魔格】白冷の薔薇イヴ"}, {"card_no": "1299", "type": "divine", "card_name": "【神格】紫炎の魔女ヴィルナ"}, {"card_no": "1300", "type": "demonic", "card_name": "【魔格】紫炎の魔女ヴィルナ"}, {"card_no": "1305", "type": "divine", "card_name": "【神格】快俊のチッタ"}, {"card_no": "1306", "type": "demonic", "card_name": "【魔格】快俊のチッタ"}, {"card_no": "1307", "type": "divine", "card_name": "【神格】海賊騎士団長カイム"}, {"card_no": "1308", "type": "demonic", "card_name": "【魔格】海賊騎士団長カイム"}, {"card_no": "1309", "type": "divine", "card_name": "【神格】激雷の剣士エレン"}, {"card_no": "1310", "type": "demonic", "card_name": "【魔格】激雷の剣士エレン"}, {"card_no": "1319", "type": "divine", "card_name": "【神格】疾風のラカム"}, {"card_no": "1320", "type": "demonic", "card_name": "【魔格】疾風のラカム"}, {"card_no": "1321", "type": "divine", "card_name": "【神格】女傑アルビダ"}, {"card_no": "1322", "type": "demonic", "card_name": "【魔格】女傑アルビダ"}, {"card_no": "1337", "type": "divine", "card_name": "【神格】ガトリング・ガウロ"}, {"card_no": "1338", "type": "demonic", "card_name": "【魔格】ガトリング・ガウロ"}, {"card_no": "1344", "type": "divine", "card_name": "【神格】発明のエティリカ"}, {"card_no": "1345", "type": "demonic", "card_name": "【魔格】発明のエティリカ"}, {"card_no": "1346", "type": "divine", "card_name": "【神格】緋翼のヴァハドゥール"}, {"card_no": "1347", "type": "demonic", "card_name": "【魔格】緋翼のヴァハドゥール"}, {"card_no": "1352", "type": "divine", "card_name": "【神格】闇の貴族ノエイン"}, {"card_no": "1353", "type": "demonic", "card_name": "【魔格】闇の貴族ノエイン"}, {"card_no": "1354", "type": "divine", "card_name": "【神格】闇の従者ベル・フォル"}, {"card_no": "1355", "type": "demonic", "card_name": "【魔格】闇の従者ベル・フォル"}, {"card_no": "1366", "type": "divine", "card_name": "【神格】姉妹海賊ギュリとテラ"}, {"card_no": "1367", "type": "demonic", "card_name": "【魔格】姉妹海賊ギュリとテラ"}, {"card_no": "1368", "type": "divine", "card_name": "【神格】モーニングスターのコーネリア"}, {"card_no": "1369", "type": "demonic", "card_name": "【魔格】モーニングスターのコーネリア"}, {"card_no": "1382", "type": "divine", "card_name": "【神格】海賊兵隊長アルド"}, {"card_no": "1383", "type": "demonic", "card_name": "【魔格】海賊兵隊長アルド"}, {"card_no": "1389", "type": "divine", "card_name": "【神格】怒りの黒髭ティーチ"}, {"card_no": "1390", "type": "demonic", "card_name": "【魔格】怒りの黒髭ティーチ"}, {"card_no": "1392", "type": "divine", "card_name": "【神格】鋼心のブレンダン"}, {"card_no": "1393", "type": "demonic", "card_name": "【魔格】鋼心のブレンダン"}, {"card_no": "1415", "type": "divine", "card_name": "【神格】月下のヴァンピール"}, {"card_no": "1416", "type": "demonic", "card_name": "【魔格】月下のヴァンピール"}, {"card_no": "1417", "type": "divine", "card_name": "【神格】冥紅の斬剣エクテレシィ"}, {"card_no": "1418", "type": "demonic", "card_name": "【魔格】冥紅の斬剣エクテレシィ"}, {"card_no": "1439", "type": "divine", "card_name": "【神格】剣竜キングドラゴニュート"}, {"card_no": "1440", "type": "demonic", "card_name": "【魔格】剣竜キングドラゴニュート"}, {"card_no": "1449", "type": "divine", "card_name": "【神格】豪傑の獅子ネルソン"}, {"card_no": "1450", "type": "demonic", "card_name": "【魔格】豪傑の獅子ネルソン"}, {"card_no": "1451", "type": "divine", "card_name": "【神格】麗刃のヴィヴィアン"}, {"card_no": "1452", "type": "demonic", "card_name": "【魔格】麗刃のヴィヴィアン"}, {"card_no": "1457", "type": "divine", "card_name": "【神格】魅了する瞳リヴィア"}, {"card_no": "1458", "type": "demonic", "card_name": "【魔格】魅了する瞳リヴィア"}, {"card_no": "1459", "type": "divine", "card_name": "【神格】繚乱の飛鳥"}, {"card_no": "1460", "type": "demonic", "card_name": "【魔格】繚乱の飛鳥"}, {"card_no": "1461", "type": "divine", "card_name": "【神格】幸福犬ワドル"}, {"card_no": "1462", "type": "demonic", "card_name": "【魔格】幸福犬ワドル"}, {"card_no": "1463", "type": "divine", "card_name": "【神格】闇討ち散華・楓"}, {"card_no": "1464", "type": "demonic", "card_name": "【魔格】闇討ち散華・楓"}, {"card_no": "1465", "type": "divine", "card_name": "【神格】蒼竜マスター･シズク"}, {"card_no": "1466", "type": "demonic", "card_name": "【魔格】蒼竜マスター･シズク"}, {"card_no": "1472", "type": "divine", "card_name": "【神格】銀のウルフ・ルッズマン"}, {"card_no": "1473", "type": "demonic", "card_name": "【魔格】銀のウルフ・ルッズマン"}, {"card_no": "1474", "type": "divine", "card_name": "【神格】黒のキャット・ザザ"}, {"card_no": "1475", "type": "demonic", "card_name": "【魔格】黒のキャット・ザザ"}, {"card_no": "1482", "type": "divine", "card_name": "【神格】隻眼の軍師・ラインハルト"}, {"card_no": "1483", "type": "demonic", "card_name": "【魔格】隻眼の軍師・ラインハルト"}, {"card_no": "1502", "type": "divine", "card_name": "【神格】学究のディケンズ"}, {"card_no": "1503", "type": "demonic", "card_name": "【魔格】学究のディケンズ"}, {"card_no": "1504", "type": "divine", "card_name": "【神格】桜嵐のシンドバッド"}, {"card_no": "1505", "type": "demonic", "card_name": "【魔格】桜嵐のシンドバッド"}, {"card_no": "1506", "type": "divine", "card_name": "【神格】探春のマジカ・アイリス"}, {"card_no": "1507", "type": "demonic", "card_name": "【魔格】探春のマジカ・アイリス"}, {"card_no": "1508", "type": "divine", "card_name": "【神格】桜花のボニー"}, {"card_no": "1509", "type": "demonic", "card_name": "【魔格】桜花のボニー"}, {"card_no": "1510", "type": "divine", "card_name": "【神格】桜吹雪のゴルゴン"}, {"card_no": "1511", "type": "demonic", "card_name": "【魔格】桜吹雪のゴルゴン"}, {"card_no": "1522", "type": "divine", "card_name": "【神格】真紅の薔薇リジェネ"}, {"card_no": "1523", "type": "demonic", "card_name": "【魔格】真紅の薔薇リジェネ"}, {"card_no": "1524", "type": "divine", "card_name": "【神格】閃光のレティー・アルバ"}, {"card_no": "1525", "type": "demonic", "card_name": "【魔格】閃光のレティー・アルバ"}, {"card_no": "1546", "type": "divine", "card_name": "【神格】烈風剣のエルハルト"}, {"card_no": "1547", "type": "demonic", "card_name": "【魔格】烈風剣のエルハルト"}, {"card_no": "1548", "type": "divine", "card_name": "【神格】信義の剣ヒルダ"}, {"card_no": "1549", "type": "demonic", "card_name": "【魔格】信義の剣ヒルダ"}, {"card_no": "1564", "type": "divine", "card_name": "【神格】海の舞姫メアリー"}, {"card_no": "1565", "type": "demonic", "card_name": "【魔格】海の舞姫メアリー"}, {"card_no": "1566", "type": "divine", "card_name": "【神格】常夏の乙女リアンネ"}, {"card_no": "1567", "type": "demonic", "card_name": "【魔格】常夏の乙女リアンネ"}, {"card_no": "1568", "type": "divine", "card_name": "【神格】渚の小悪魔ハジン"}, {"card_no": "1569", "type": "demonic", "card_name": "【魔格】渚の小悪魔ハジン"}, {"card_no": "1570", "type": "divine", "card_name": "【神格】シャイニングハーピー"}, {"card_no": "1571", "type": "demonic", "card_name": "【魔格】シャイニングハーピー"}, {"card_no": "1593", "type": "divine", "card_name": "【神格】古代魔砲のアリッサ"}, {"card_no": "1594", "type": "demonic", "card_name": "【魔格】古代魔砲のアリッサ"}, {"card_no": "1595", "type": "divine", "card_name": "【神格】奈落の妖美ミゼリア"}, {"card_no": "1596", "type": "demonic", "card_name": "【魔格】奈落の妖美ミゼリア"}, {"card_no": "1618", "type": "divine", "card_name": "【神格】鉄棍の闘士ユリウス"}, {"card_no": "1619", "type": "demonic", "card_name": "【魔格】鉄棍の闘士ユリウス"}, {"card_no": "1627", "type": "divine", "card_name": "【神格】操剣のウィスタリア"}, {"card_no": "1628", "type": "demonic", "card_name": "【魔格】操剣のウィスタリア"}, {"card_no": "1629", "type": "divine", "card_name": "【神格】光撃のジェラルト"}, {"card_no": "1630", "type": "demonic", "card_name": "【魔格】光撃のジェラルト"}, {"card_no": "1640", "type": "divine", "card_name": "【神格】曲芸妃ロゼッタ"}, {"card_no": "1641", "type": "demonic", "card_name": "【魔格】曲芸妃ロゼッタ"}, {"card_no": "1642", "type": "divine", "card_name": "【神格】猛攻の獅子グリガル"}, {"card_no": "1643", "type": "demonic", "card_name": "【魔格】猛攻の獅子グリガル"}, {"card_no": "1679", "type": "divine", "card_name": "【神格】妖美なる怪女エキドナ"}, {"card_no": "1680", "type": "demonic", "card_name": "【魔格】妖美なる怪女エキドナ"}]
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


  function detailUrl(cardNo) {

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


  let results =
    loadResults();

  let state =
    loadState();


  function getCardName(doc) {

    const spans =
      Array.from(
        doc.querySelectorAll(
          '#content span'
        )
      );

    const found =
      spans.find(
        el => {

          const text =
            clean(
              el.textContent
            );

          return (
            text.startsWith(
              '【神格】'
            )
            ||
            text.startsWith(
              '【魔格】'
            )
          );
        }
      );

    return found
      ? clean(
          found.textContent
        )
      : null;
  }


  function extractSpecialSkills(doc) {

    const blocks =
      Array.from(
        doc.querySelectorAll(
          '.special_skill_bg'
        )
      );

    return blocks
      .map(
        (block, index) => {

          const name =
            clean(
              block
                .querySelector(
                  '.textcolor_special_skill_name'
                )
                ?.textContent
            );

          const effect =
            clean(
              block
                .querySelector(
                  '.textcolor_special_skill_text'
                )
                ?.textContent
            );

          const icon =
            block
              .querySelector(
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

    return (
      doc.querySelector(
        `img[src*="/card/640/${cardNo}.jpg"]`
      )
      ?.getAttribute(
        'src'
      )
      ||
      null
    );
  }


  function extractCost(doc) {

    const text =
      clean(
        doc.querySelector(
          '#page_deck_select_master_cost'
        )
        ?.textContent
      );

    if (!text) {
      return null;
    }

    const value =
      Number(text);

    return Number.isFinite(
      value
    )
      ? value
      : null;
  }


  async function fetchTarget(target) {

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
        + response.status
      );
    }

    if (
      /ログイン情報入力/
        .test(html)
      ||
      /name=["']?input_form/i
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

    const actualName =
      getCardName(doc);

    const specialSkills =
      extractSpecialSkills(
        doc
      );

    return {
      card_no:
        String(
          target.card_no
        ),

      expected_card_name:
        target.card_name,

      card_name:
        actualName,

      evolution_type:
        target.type,

      name_match:
        actualName
        === target.card_name,

      cost:
        extractCost(
          doc
        ),

      image_url:
        extractImage(
          doc,
          target.card_no
        ),

      special_skill_count:
        specialSkills.length,

      special_skills:
        specialSkills,

      detail_url:
        url,

      collected_at:
        new Date()
          .toISOString()
    };
  }


  function setStatus(message) {

    const el =
      document.getElementById(
        'jess3_status'
      );

    if (el) {

      el.textContent =
        message;
    }
  }


  function summary() {

    const rows =
      Object.values(
        results
      );

    const skillCards =
      rows.filter(
        x =>
          (
            x.special_skills
            || []
          ).length
          > 0
      );

    const nameErrors =
      rows.filter(
        x =>
          x.name_match
          === false
      );

    setStatus(
      '保存 '
      + rows.length
      + '/'
      + TARGETS.length
      + '件'
      + ' ／ 特殊スキルあり '
      + skillCards.length
      + '件'
      + ' ／ 名前不一致 '
      + nameErrors.length
      + '件'
      + ' ／ エラー '
      + state.errors.length
      + '件'
    );
  }


  async function testEchidna() {

    const target =
      TARGETS.find(
        x =>
          x.card_no
          === '1679'
      );

    if (!target) {

      throw new Error(
        '1679が対象一覧にありません'
      );
    }

    setStatus(
      '1679検証中…'
    );

    const row =
      await fetchTarget(
        target
      );

    results[
      target.card_no
    ] =
      row;

    saveResults(
      results
    );

    summary();

    alert(
      JSON.stringify(
        row,
        null,
        2
      )
    );
  }


  async function run() {

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
        + (
          i + 1
        )
        + '/'
        + TARGETS.length
        + ' No.'
        + target.card_no
        + ' '
        + target.card_name
      );

      try {

        const row =
          await fetchTarget(
            target
          );

        results[
          target.card_no
        ] =
          row;

        saveResults(
          results
        );

        state.errors =
          state.errors
            .filter(
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
          state.errors
            .filter(
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
            target.card_no,

          card_name:
            target.card_name,

          message:
            String(
              error
                ?.message
              || error
            ),

          at:
            new Date()
              .toISOString()
        });

        if (
          String(
            error
              ?.message
            || error
          )
          .includes(
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

    summary();
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

    const oldErrors =
      [...state.errors];

    state.errors =
      [];

    saveState(
      state
    );

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
            x.card_no
            === cardNo
        );

      if (!target) {
        continue;
      }

      setStatus(
        '再取得 '
        + (
          i + 1
        )
        + '/'
        + ids.length
        + ' No.'
        + cardNo
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
            target.card_name,

          message:
            String(
              error
                ?.message
              || error
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

    summary();
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

        special_skill_card_count:
          cards.filter(
            x =>
              (
                x.special_skills
                || []
              ).length
              > 0
          ).length,

        no_special_skill_count:
          cards.filter(
            x =>
              (
                x.special_skills
                || []
              ).length
              === 0
          ).length,

        name_mismatch_count:
          cards.filter(
            x =>
              x.name_match
              === false
          ).length,

        error_count:
          state.errors.length
      },

      errors:
        state.errors,

      cards
    };
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


  async function shareJson() {

    const output =
      buildExport();

    const text =
      JSON.stringify(
        output,
        null,
        2
      );

    const file =
      new File(
        [text],
        'jolly_evolution_special_skills.json',
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


  function resetAll() {

    if (
      !confirm(
        '進捗と収集結果をすべて削除しますか？'
      )
    ) {
      return;
    }

    localStorage
      .removeItem(
        RESULT_KEY
      );

    localStorage
      .removeItem(
        STATE_KEY
      );

    results = {};

    state = {
      next_index: 0,
      running: false,
      stopped: false,
      errors: []
    };

    summary();
  }


  function makePanel() {

    document
      .getElementById(
        'jolly_evolution_special_v3'
      )
      ?.remove();

    const panel =
      document.createElement(
        'div'
      );

    panel.id =
      'jolly_evolution_special_v3';

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
          神格・魔格 特殊スキル
          ${TARGETS.length}枚
        </b>

        <button id="jess3_close">
          ×
        </button>
      </div>

      <div
        id="jess3_status"
        style="
          background:#1f2937;
          padding:8px;
          border-radius:10px;
          margin-bottom:8px;
        "
      >
        読み込み中…
      </div>

      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:7px;
      ">

        <button id="jess3_test">
          ① 1679検証
        </button>

        <button id="jess3_start">
          ② 全件収集
        </button>

        <button id="jess3_stop">
          停止
        </button>

        <button id="jess3_retry">
          エラー再取得
        </button>

        <button id="jess3_share">
          JSON共有/保存
        </button>

        <button id="jess3_copy">
          JSON全文コピー
        </button>

        <button id="jess3_reset">
          全リセット
        </button>

      </div>
    `;

    const style =
      document.createElement(
        'style'
      );

    style.textContent = `
      #jolly_evolution_special_v3 button {
        border:0;
        border-radius:10px;
        padding:9px 7px;
        background:#fff;
        color:#111827;
        font-weight:700;
        font:inherit;
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
        'jess3_close'
      )
      .onclick =
        () =>
          panel.remove();

    document
      .getElementById(
        'jess3_test'
      )
      .onclick =
        () =>
          testEchidna()
            .catch(
              e =>
                alert(
                  e.message
                )
            );

    document
      .getElementById(
        'jess3_start'
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
        'jess3_stop'
      )
      .onclick =
        stop;

    document
      .getElementById(
        'jess3_retry'
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
        'jess3_share'
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
        'jess3_copy'
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
        'jess3_reset'
      )
      .onclick =
        resetAll;

    summary();
  }


  makePanel();

})();
