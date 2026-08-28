(function () {
"use strict";

const VERSION = "jolly-reincarnation-verify-1.0";

const TARGETS = [
  {
    "source_card_no": "1752",
    "source_card_name": "冷徹な監守シェルヴィ",
    "source_rarity_stars": 5,
    "target_card_no": "1753",
    "target_card_name": "厳格なる監守シェルヴィ",
    "target_rarity_stars": 6,
    "base_instance_id": "45530855",
    "source_owned": true,
    "source_owned_count": 1,
    "target_owned_count": 1,
    "target_training": true,
    "target_awakening_count": 17
  },
  {
    "source_card_no": "56",
    "source_card_name": "ニャッカ",
    "source_rarity_stars": 6,
    "target_card_no": "671",
    "target_card_name": "ニャッカ船長",
    "target_rarity_stars": 7,
    "base_instance_id": "46394209",
    "source_owned": true,
    "source_owned_count": 14,
    "target_owned_count": 1,
    "target_training": true,
    "target_awakening_count": 5
  },
  {
    "source_card_no": "26",
    "source_card_name": "舞刀のメアリー",
    "source_rarity_stars": 5,
    "target_card_no": "159",
    "target_card_name": "華麗なる剣舞の花メアリー",
    "target_rarity_stars": 6,
    "base_instance_id": "27549917",
    "source_owned": true,
    "source_owned_count": 1,
    "target_owned_count": 1,
    "target_training": true,
    "target_awakening_count": 3
  },
  {
    "source_card_no": "838",
    "source_card_name": "業火のフラムナール",
    "source_rarity_stars": 6,
    "target_card_no": "1041",
    "target_card_name": "業炎のフラムナール",
    "target_rarity_stars": 7,
    "base_instance_id": "24121817",
    "source_owned": true,
    "source_owned_count": 8,
    "target_owned_count": 1,
    "target_training": false,
    "target_awakening_count": 0
  },
  {
    "source_card_no": "1206",
    "source_card_name": "毒胞子のフニュ",
    "source_rarity_stars": 4,
    "target_card_no": "1207",
    "target_card_name": "舞胞子のフニュ",
    "target_rarity_stars": 5,
    "base_instance_id": "34103759",
    "source_owned": true,
    "source_owned_count": 1,
    "target_owned_count": 1,
    "target_training": false,
    "target_awakening_count": 0
  },
  {
    "source_card_no": "1225",
    "source_card_name": "雪原の銃士イヴェット",
    "source_rarity_stars": 5,
    "target_card_no": "1303",
    "target_card_name": "雪狼の双銃イヴェット",
    "target_rarity_stars": 6,
    "base_instance_id": "39318337",
    "source_owned": true,
    "source_owned_count": 2,
    "target_owned_count": 1,
    "target_training": false,
    "target_awakening_count": 0
  },
  {
    "source_card_no": "1362",
    "source_card_name": "祝星のサンドラ",
    "source_rarity_stars": 6,
    "target_card_no": "1363",
    "target_card_name": "金緑の祝星サンドラ",
    "target_rarity_stars": 7,
    "base_instance_id": "38665544",
    "source_owned": true,
    "source_owned_count": 2,
    "target_owned_count": 1,
    "target_training": false,
    "target_awakening_count": 0
  },
  {
    "source_card_no": "1364",
    "source_card_name": "砂海の蛇使いマルタ",
    "source_rarity_stars": 6,
    "target_card_no": "1365",
    "target_card_name": "砂璃の乙女マルタ",
    "target_rarity_stars": 7,
    "base_instance_id": "38893209",
    "source_owned": true,
    "source_owned_count": 2,
    "target_owned_count": 1,
    "target_training": false,
    "target_awakening_count": 0
  },
  {
    "source_card_no": "1531",
    "source_card_name": "風魔のレラ",
    "source_rarity_stars": 6,
    "target_card_no": "1579",
    "target_card_name": "爽嵐のレラ",
    "target_rarity_stars": 7,
    "base_instance_id": "49563951",
    "source_owned": true,
    "source_owned_count": 8,
    "target_owned_count": 1,
    "target_training": false,
    "target_awakening_count": 0
  },
  {
    "source_card_no": "839",
    "source_card_name": "武装商人グレゴール",
    "source_rarity_stars": 5,
    "target_card_no": "1155",
    "target_card_name": "鉄火の商人グレゴール",
    "target_rarity_stars": 6,
    "base_instance_id": "31138888",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": true,
    "target_awakening_count": 20
  },
  {
    "source_card_no": "1133",
    "source_card_name": "北風のサンタ・ヘクセ",
    "source_rarity_stars": 6,
    "target_card_no": "1134",
    "target_card_name": "銀風のサンタ・ヘクセ",
    "target_rarity_stars": 7,
    "base_instance_id": "33576761",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": true,
    "target_awakening_count": 18
  },
  {
    "source_card_no": "843",
    "source_card_name": "真眼の盾シュネー",
    "source_rarity_stars": 4,
    "target_card_no": "1235",
    "target_card_name": "聖眼の大盾シュネー",
    "target_rarity_stars": 5,
    "base_instance_id": "33843333",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": true,
    "target_awakening_count": 18
  },
  {
    "source_card_no": "1006",
    "source_card_name": "頑健の魔術師エドアルド",
    "source_rarity_stars": 6,
    "target_card_no": "1029",
    "target_card_name": "剛健の魔術師エドアルド",
    "target_rarity_stars": 7,
    "base_instance_id": "24573706",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": true,
    "target_awakening_count": 17
  },
  {
    "source_card_no": "914",
    "source_card_name": "小さな妖精フルル",
    "source_rarity_stars": 4,
    "target_card_no": "973",
    "target_card_name": "紫光の妖精フルル",
    "target_rarity_stars": 5,
    "base_instance_id": "23431879",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": true,
    "target_awakening_count": 14
  },
  {
    "source_card_no": "954",
    "source_card_name": "薬師のアルカナ",
    "source_rarity_stars": 6,
    "target_card_no": "1093",
    "target_card_name": "神秘の薬師アルカナ",
    "target_rarity_stars": 7,
    "base_instance_id": "28771348",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": true,
    "target_awakening_count": 13
  },
  {
    "source_card_no": "436",
    "source_card_name": "ラタトスク",
    "source_rarity_stars": 5,
    "target_card_no": "1620",
    "target_card_name": "樹氷の幻獣ラタトスク",
    "target_rarity_stars": 6,
    "base_instance_id": "47053284",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": true,
    "target_awakening_count": 12
  },
  {
    "source_card_no": "942",
    "source_card_name": "電撃のコウリン",
    "source_rarity_stars": 5,
    "target_card_no": "1205",
    "target_card_name": "雷轟のコウリン",
    "target_rarity_stars": 6,
    "base_instance_id": "35341648",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": true,
    "target_awakening_count": 10
  },
  {
    "source_card_no": "1291",
    "source_card_name": "電槍のシュラウド",
    "source_rarity_stars": 5,
    "target_card_no": "1292",
    "target_card_name": "轟雷槍のシュラウド",
    "target_rarity_stars": 6,
    "base_instance_id": "35527056",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": true,
    "target_awakening_count": 8
  },
  {
    "source_card_no": "826",
    "source_card_name": "招来のミアテンシャ",
    "source_rarity_stars": 5,
    "target_card_no": "1008",
    "target_card_name": "満来のミアテンシャ",
    "target_rarity_stars": 6,
    "base_instance_id": "34519704",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": true,
    "target_awakening_count": 2
  },
  {
    "source_card_no": "604",
    "source_card_name": "ティターニア",
    "source_rarity_stars": 5,
    "target_card_no": "718",
    "target_card_name": "薄明の女王ティターニア",
    "target_rarity_stars": 6,
    "base_instance_id": "25443599",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": false,
    "target_awakening_count": 0
  },
  {
    "source_card_no": "842",
    "source_card_name": "白の連弾シャーリー",
    "source_rarity_stars": 4,
    "target_card_no": "1076",
    "target_card_name": "白百合の連弾シャーリー",
    "target_rarity_stars": 5,
    "base_instance_id": "24889847",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": false,
    "target_awakening_count": 0
  },
  {
    "source_card_no": "995",
    "source_card_name": "平癒のシャルル",
    "source_rarity_stars": 4,
    "target_card_no": "1173",
    "target_card_name": "廻天のシャルル",
    "target_rarity_stars": 5,
    "base_instance_id": "28015542",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": false,
    "target_awakening_count": 0
  },
  {
    "source_card_no": "1274",
    "source_card_name": "初扇のクラリス",
    "source_rarity_stars": 6,
    "target_card_no": "1275",
    "target_card_name": "胡蝶扇舞のクラリス",
    "target_rarity_stars": 7,
    "base_instance_id": "35007162",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": false,
    "target_awakening_count": 0
  },
  {
    "source_card_no": "1277",
    "source_card_name": "初空の翼シェリエス",
    "source_rarity_stars": 6,
    "target_card_no": "1278",
    "target_card_name": "初晴の鳳凰シェリエス",
    "target_rarity_stars": 7,
    "base_instance_id": "39411316",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": false,
    "target_awakening_count": 0
  },
  {
    "source_card_no": "1467",
    "source_card_name": "刹那の刀ハルバティ",
    "source_rarity_stars": 4,
    "target_card_no": "1468",
    "target_card_name": "刻命一刀ハルバティ",
    "target_rarity_stars": 5,
    "base_instance_id": "38073051",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": false,
    "target_awakening_count": 0
  },
  {
    "source_card_no": "1469",
    "source_card_name": "煙霧のニルヴァ",
    "source_rarity_stars": 6,
    "target_card_no": "1470",
    "target_card_name": "幻霧のニルヴァ",
    "target_rarity_stars": 7,
    "base_instance_id": "42971333",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": false,
    "target_awakening_count": 0
  },
  {
    "source_card_no": "364",
    "source_card_name": "有望のジョージーナ",
    "source_rarity_stars": 4,
    "target_card_no": "1580",
    "target_card_name": "希望のジョージーナ",
    "target_rarity_stars": 5,
    "base_instance_id": "40269371",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": false,
    "target_awakening_count": 0
  },
  {
    "source_card_no": "1652",
    "source_card_name": "暗剣のキアラ",
    "source_rarity_stars": 5,
    "target_card_no": "1653",
    "target_card_name": "音無の暗剣キアラ",
    "target_rarity_stars": 6,
    "base_instance_id": "41625246",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": false,
    "target_awakening_count": 0
  },
  {
    "source_card_no": "1824",
    "source_card_name": "快刀のレオポルド",
    "source_rarity_stars": 5,
    "target_card_no": "1825",
    "target_card_name": "傑刀のレオポルド",
    "target_rarity_stars": 6,
    "base_instance_id": "44781330",
    "source_owned": false,
    "source_owned_count": 0,
    "target_owned_count": 1,
    "target_training": false,
    "target_awakening_count": 0
  }
];

const ORIGIN = location.origin;
const DELAY = 350;
const RETRY_LIMIT = 3;

let running = false;
let stopRequested = false;
let results = [];
let errors = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanText(v) {
    return String(v || "")
        .replace(/\u00a0/g, " ")
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n[ \t]+/g, "\n")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function normalize(v) {
    return cleanText(v)
        .replace(/[・･\s　]/g, "")
        .replace(/[【】「」『』]/g, "");
}

function escapeRegExp(v) {
    return String(v)
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseHTML(html) {
    return new DOMParser().parseFromString(
        html,
        "text/html"
    );
}

async function fetchDoc(url) {
    let lastError = null;

    for (
        let attempt = 1;
        attempt <= RETRY_LIMIT;
        attempt++
    ) {
        try {
            const res = await fetch(url, {
                credentials: "include",
                cache: "no-store"
            });

            if (!res.ok) {
                throw new Error(
                    "HTTP " + res.status
                );
            }

            const html = await res.text();

            if (!html || html.length < 500) {
                throw new Error(
                    "HTMLが短すぎます"
                );
            }

            const doc = parseHTML(html);

            const text = cleanText(
                doc.body?.innerText || ""
            );

            if (
                /ログイン/.test(text) &&
                !/覚醒|合成|カード/.test(text)
            ) {
                throw new Error(
                    "ログイン画面へ遷移"
                );
            }

            return {
                doc,
                html,
                text
            };

        } catch (e) {
            lastError = e;

            if (attempt < RETRY_LIMIT) {
                await sleep(
                    500 * attempt
                );
            }
        }
    }

    throw lastError || new Error(
        "取得失敗"
    );
}

function getRelevantText(doc, target) {
    const bodyText = cleanText(
        doc.body?.innerText || ""
    );

    const pieces = [];

    // 転生を含む要素を集める
    const all = Array.from(
        doc.querySelectorAll(
            "div,li,p,span,td,tr"
        )
    );

    for (const el of all) {
        const text = cleanText(
            el.innerText || ""
        );

        if (!text) continue;

        if (
            text.includes("転生前") ||
            text.includes("転生後") ||
            text.includes("転生らいおん") ||
            text.includes("キング転生らいおん") ||
            text.includes(target.source_card_name)
        ) {
            // 巨大bodyそのものは除く
            if (text.length <= 1200) {
                pieces.push(text);
            }
        }
    }

    return {
        body_text: bodyText,
        relevant_blocks: Array.from(
            new Set(pieces)
        )
    };
}

function analyze(target, bodyText, relevantBlocks) {
    const sourceName =
        target.source_card_name;

    const normalizedBody =
        normalize(bodyText);

    const normalizedSource =
        normalize(sourceName);

    const sourceNameExact =
        bodyText.includes(sourceName);

    const sourceNameNormalized =
        normalizedSource &&
        normalizedBody.includes(
            normalizedSource
        );

    const hasTenseiBefore =
        bodyText.includes("転生前");

    const hasTenseiAfter =
        bodyText.includes("転生後");

    const hasLion =
        bodyText.includes("転生らいおん");

    const hasKingLion =
        bodyText.includes(
            "キング転生らいおん"
        );

    const sourceNearTenseiBefore = (() => {
        if (!sourceName) return false;

        const re1 = new RegExp(
            "転生前[\\s\\S]{0,160}" +
            escapeRegExp(sourceName)
        );

        const re2 = new RegExp(
            escapeRegExp(sourceName) +
            "[\\s\\S]{0,160}転生前"
        );

        return (
            re1.test(bodyText) ||
            re2.test(bodyText)
        );
    })();

    const matchingBlocks =
        relevantBlocks.filter(x =>
            x.includes(sourceName) ||
            x.includes("転生前")
        );

    let verdict = "unconfirmed";

    if (
        sourceNearTenseiBefore
    ) {
        verdict =
            "confirmed_source_near_tensei_before";

    } else if (
        sourceNameExact &&
        hasTenseiBefore
    ) {
        verdict =
            "strong_candidate";

    } else if (
        sourceNameNormalized &&
        hasTenseiBefore
    ) {
        verdict =
            "possible_normalized_match";

    } else if (
        sourceNameExact
    ) {
        verdict =
            "source_name_only";

    } else if (
        hasTenseiBefore
    ) {
        verdict =
            "tensei_before_text_only";
    }

    return {
        source_name_exact:
            sourceNameExact,

        source_name_normalized:
            sourceNameNormalized,

        has_tensei_before:
            hasTenseiBefore,

        has_tensei_after:
            hasTenseiAfter,

        source_near_tensei_before:
            sourceNearTenseiBefore,

        has_reincarnation_lion:
            hasLion,

        has_king_reincarnation_lion:
            hasKingLion,

        matching_blocks:
            matchingBlocks,

        verdict:
            verdict
    };
}

async function collectOne(target) {
    const url =
        ORIGIN +
        "/?M=Composition&A=Check&base=" +
        encodeURIComponent(
            target.base_instance_id
        );

    const fetched =
        await fetchDoc(url);

    const info =
        getRelevantText(
            fetched.doc,
            target
        );

    const analysis =
        analyze(
            target,
            info.body_text,
            info.relevant_blocks
        );

    return {
        ...target,

        verify_url: url,

        analysis:
            analysis,

        relevant_blocks:
            info.relevant_blocks,

        body_text:
            info.body_text
    };
}

async function run() {
    if (running) {
        alert("すでに実行中です。");
        return;
    }

    running = true;
    stopRequested = false;
    results = [];
    errors = [];

    await updatePanel();

    try {
        for (
            let i = 0;
            i < TARGETS.length;
            i++
        ) {
            if (stopRequested) {
                break;
            }

            const target =
                TARGETS[i];

            setStatus(
                (i + 1) +
                "/" +
                TARGETS.length +
                " " +
                target.target_card_name
            );

            try {
                const row =
                    await collectOne(
                        target
                    );

                results.push(row);

            } catch (e) {
                errors.push({
                    source_card_no:
                        target.source_card_no,

                    source_card_name:
                        target.source_card_name,

                    target_card_no:
                        target.target_card_no,

                    target_card_name:
                        target.target_card_name,

                    base_instance_id:
                        target.base_instance_id,

                    message:
                        String(
                            e?.message || e
                        )
                });
            }

            await updatePanel();
            await sleep(DELAY);
        }

        const summary =
            makeSummary();

        if (stopRequested) {
            alert(
                "停止しました。\n" +
                "現在までのJSONは保存できます。"
            );

        } else {
            alert(
                "検証完了\n\n" +
                "対象: " +
                TARGETS.length +
                "\n" +
                "成功: " +
                results.length +
                "\n" +
                "エラー: " +
                errors.length +
                "\n" +
                "confirmed: " +
                summary.confirmed +
                "\n" +
                "strong: " +
                summary.strong_candidate
            );
        }

    } finally {
        running = false;
        await updatePanel();
    }
}

function makeSummary() {
    const counts = {
        confirmed: 0,
        strong_candidate: 0,
        possible_normalized_match: 0,
        source_name_only: 0,
        tensei_before_text_only: 0,
        unconfirmed: 0
    };

    for (const r of results) {
        const v =
            r.analysis?.verdict ||
            "unconfirmed";

        if (
            v ===
            "confirmed_source_near_tensei_before"
        ) {
            counts.confirmed++;

        } else if (
            Object.prototype
                .hasOwnProperty.call(
                    counts,
                    v
                )
        ) {
            counts[v]++;
        }
    }

    return counts;
}

function buildOutput() {
    const summary =
        makeSummary();

    return {
        meta: {
            version:
                VERSION,

            collected_at:
                new Date().toISOString(),

            source_origin:
                ORIGIN,

            target_count:
                TARGETS.length,

            success_count:
                results.length,

            error_count:
                errors.length,

            finished:
                !stopRequested &&
                results.length +
                errors.length ===
                TARGETS.length
        },

        summary:
            summary,

        results:
            results,

        errors:
            errors
    };
}

function saveJSON() {
    const data =
        buildOutput();

    const blob =
        new Blob(
            [
                JSON.stringify(
                    data,
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
        "jolly_reincarnation_verify.json";

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(
        () =>
            URL.revokeObjectURL(url),
        2000
    );
}

function makeButton(text) {
    const b =
        document.createElement(
            "button"
        );

    b.textContent = text;

    b.style.cssText = [
        "display:block",
        "width:100%",
        "margin:7px 0",
        "padding:11px",
        "border:0",
        "border-radius:9px",
        "font-size:14px",
        "font-weight:bold",
        "background:#fff",
        "color:#111"
    ].join(";");

    return b;
}

function setStatus(text) {
    const el =
        document.getElementById(
            "jolly_reincarnation_status"
        );

    if (el) {
        el.textContent = text;
    }
}

async function updatePanel() {
    const info =
        document.getElementById(
            "jolly_reincarnation_info"
        );

    if (!info) return;

    const summary =
        makeSummary();

    info.innerHTML =
        "<b>転生関係検証</b><br><br>" +

        "対象: " +
        TARGETS.length +
        "<br>" +

        "取得済み: " +
        results.length +
        "<br>" +

        "エラー: " +
        errors.length +
        "<br>" +

        "confirmed: " +
        summary.confirmed +
        "<br>" +

        "strong: " +
        summary.strong_candidate +
        "<br>" +

        "unconfirmed: " +
        summary.unconfirmed;
}

document
    .getElementById(
        "jolly_reincarnation_verify_panel"
    )
    ?.remove();

const panel =
    document.createElement("div");

panel.id =
    "jolly_reincarnation_verify_panel";

panel.style.cssText = [
    "position:fixed",
    "left:8px",
    "right:8px",
    "bottom:8px",
    "z-index:2147483647",
    "background:rgba(20,20,20,.97)",
    "color:#fff",
    "padding:12px",
    "border-radius:12px",
    "box-shadow:0 2px 14px rgba(0,0,0,.5)",
    "font-family:-apple-system,BlinkMacSystemFont,sans-serif",
    "font-size:13px",
    "max-height:60vh",
    "overflow:auto"
].join(";");

const info =
    document.createElement("div");

info.id =
    "jolly_reincarnation_info";

panel.appendChild(info);

const status =
    document.createElement("div");

status.id =
    "jolly_reincarnation_status";

status.style.cssText =
    "margin:8px 0;color:#ddd;";

status.textContent =
    "待機中";

panel.appendChild(status);

const start =
    makeButton(
        "29候補を検証"
    );

start.onclick = run;

panel.appendChild(start);

const stop =
    makeButton(
        "停止"
    );

stop.onclick = () => {
    stopRequested = true;
};

panel.appendChild(stop);

const save =
    makeButton(
        "JSON保存"
    );

save.onclick = saveJSON;

panel.appendChild(save);

const close =
    makeButton(
        "閉じる"
    );

close.onclick = () =>
    panel.remove();

panel.appendChild(close);

document.body.appendChild(panel);

updatePanel();

})();
