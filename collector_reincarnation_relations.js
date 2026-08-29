(function () {
"use strict";

const VERSION = "jolly-reincarnation-relations-1.0";
const BASE_URL = "/?M=LimitBreak&A=List&sort=13&property=0";
const DELAY_MS = 350;
const RETRY_LIMIT = 3;

let running = false;
let stopRequested = false;

let pageResults = [];
let errors = [];
let relations = [];

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

function parseHTML(html) {
    return new DOMParser().parseFromString(
        html,
        "text/html"
    );
}

function absoluteURL(path) {
    return new URL(path, location.origin).href;
}

async function fetchDoc(url) {
    let lastError = null;

    for (let attempt = 1; attempt <= RETRY_LIMIT; attempt++) {
        try {
            const res = await fetch(url, {
                credentials: "include",
                cache: "no-store"
            });

            if (!res.ok) {
                throw new Error("HTTP " + res.status);
            }

            const html = await res.text();

            if (!html || html.length < 1000) {
                throw new Error("HTML too short");
            }

            const doc = parseHTML(html);
            const text = cleanText(doc.body?.innerText || "");

            if (!text.includes("転生カード一覧")) {
                throw new Error("転生カード一覧ページではありません");
            }

            return {
                doc,
                html,
                text
            };

        } catch (e) {
            lastError = e;

            if (attempt < RETRY_LIMIT) {
                await sleep(500 * attempt);
            }
        }
    }

    throw lastError || new Error("fetch failed");
}

function getCardIdFromImage(src) {
    const m = String(src || "").match(
        /\/img\/card\/(?:120|320|640)\/(\d+)\.(?:jpg|png|gif)/i
    );

    return m ? m[1] : null;
}

function getImageSizeType(src) {
    const m = String(src || "").match(
        /\/img\/card\/(\d+)\//
    );

    return m ? m[1] : null;
}

function isTargetImage(img) {
    return /\/img\/card\/320\/\d+\./i.test(
        img.src || ""
    );
}

function isSourceImage(img) {
    return /\/img\/card\/120\/\d+\./i.test(
        img.src || ""
    );
}

function findRelationContainer(targetImg) {
    let el = targetImg.parentElement;
    let best = null;

    for (let depth = 0; el && depth < 12; depth++, el = el.parentElement) {
        const imgs = Array.from(
            el.querySelectorAll("img")
        );

        const targets = imgs.filter(isTargetImage);
        const sources = imgs.filter(isSourceImage);

        const text = cleanText(
            el.innerText || ""
        );

        if (
            targets.length === 1 &&
            sources.length >= 1 &&
            text.includes("転生前カード")
        ) {
            best = el;
            break;
        }
    }

    return best;
}

function extractNameAroundImage(img, container, mode) {
    const containerText = cleanText(
        container.innerText || ""
    );

    const lines = containerText
        .split("\n")
        .map(x => x.trim())
        .filter(Boolean);

    const targetId = getCardIdFromImage(img.src);

    if (!targetId) {
        return null;
    }

    /*
      DOMの画像周辺から名前候補を探す。
      まず親要素を少しずつ上がり、
      カード名らしい短い行を抽出する。
    */
    let el = img.parentElement;

    for (let depth = 0; el && depth < 6; depth++, el = el.parentElement) {
        const text = cleanText(
            el.innerText || ""
        );

        if (!text) continue;

        const localLines = text
            .split("\n")
            .map(x => x.trim())
            .filter(Boolean);

        for (const line of localLines) {
            if (
                line.length >= 2 &&
                line.length <= 40 &&
                !/^\[.*\]$/.test(line) &&
                !/^コスト/.test(line) &&
                !/^体力[:：]/.test(line) &&
                !/^攻撃[:：]/.test(line) &&
                !/^速さ[:：]/.test(line) &&
                !/^MAX値/.test(line) &&
                !/^必要なアイテム/.test(line) &&
                !/^転生前カード$/.test(line) &&
                !/^転生後カード/.test(line) &&
                !/^SKILL SLOT/.test(line) &&
                !/^[-－×\d\s]+$/.test(line)
            ) {
                return line;
            }
        }
    }

    /*
      fallback:
      転生前カードラベルを境に、
      modeごとに候補を探す。
    */
    const idx = lines.indexOf("転生前カード");

    if (idx >= 0) {
        if (mode === "source") {
            for (let i = idx + 1; i < Math.min(lines.length, idx + 8); i++) {
                const line = lines[i];

                if (
                    line.length >= 2 &&
                    line.length <= 40 &&
                    !/^\[.*\]$/.test(line) &&
                    !/^コスト/.test(line) &&
                    !/^体力[:：]/.test(line)
                ) {
                    return line;
                }
            }
        }

        if (mode === "target") {
            for (let i = 0; i < idx; i++) {
                const line = lines[i];

                if (
                    line.length >= 2 &&
                    line.length <= 40 &&
                    !/^\[.*\]$/.test(line) &&
                    !/^コスト/.test(line) &&
                    !/^体力[:：]/.test(line) &&
                    !/^攻撃[:：]/.test(line) &&
                    !/^速さ[:：]/.test(line) &&
                    !/^MAX値/.test(line)
                ) {
                    return line;
                }
            }
        }
    }

    return null;
}

function extractRarityFromText(text, mode) {
    const lines = cleanText(text)
        .split("\n")
        .map(x => x.trim())
        .filter(Boolean);

    const idx = lines.indexOf("転生前カード");

    let subset;

    if (idx >= 0) {
        subset =
            mode === "source"
                ? lines.slice(idx + 1)
                : lines.slice(0, idx);
    } else {
        subset = lines;
    }

    for (const line of subset) {
        const m = line.match(
            /^\[(Legend|Ultra Rare|Super Rare|High Rare|Rare|Normal)\]$/i
        );

        if (m) {
            return m[1];
        }
    }

    return null;
}

function rarityStars(name) {
    const map = {
        "Legend": 7,
        "Ultra Rare": 6,
        "Super Rare": 5,
        "High Rare": 4,
        "Rare": 3,
        "Normal": 1
    };

    return map[name] ?? null;
}

function parsePage(doc, pageNo) {
    const targetImages = Array.from(
        doc.querySelectorAll(
            'img[src*="/img/card/320/"]'
        )
    );

    const rows = [];
    const seenTargets = new Set();

    for (const targetImg of targetImages) {
        const targetId =
            getCardIdFromImage(targetImg.src);

        if (!targetId) continue;

        if (seenTargets.has(targetId)) {
            continue;
        }

        const container =
            findRelationContainer(targetImg);

        if (!container) {
            continue;
        }

        const sourceImgs = Array.from(
            container.querySelectorAll(
                'img[src*="/img/card/120/"]'
            )
        );

        if (!sourceImgs.length) {
            continue;
        }

        /*
          転生後画像より後ろにある最初の120画像を優先
        */
        let sourceImg = null;

        const allImgs = Array.from(
            container.querySelectorAll("img")
        );

        const targetIndex =
            allImgs.indexOf(targetImg);

        for (
            let i = targetIndex + 1;
            i < allImgs.length;
            i++
        ) {
            if (isSourceImage(allImgs[i])) {
                sourceImg = allImgs[i];
                break;
            }
        }

        if (!sourceImg) {
            sourceImg = sourceImgs[0];
        }

        const sourceId =
            getCardIdFromImage(sourceImg.src);

        if (!sourceId) {
            continue;
        }

        const blockText = cleanText(
            container.innerText || ""
        );

        const targetName =
            extractNameAroundImage(
                targetImg,
                container,
                "target"
            );

        const sourceName =
            extractNameAroundImage(
                sourceImg,
                container,
                "source"
            );

        const targetRarity =
            extractRarityFromText(
                blockText,
                "target"
            );

        const sourceRarity =
            extractRarityFromText(
                blockText,
                "source"
            );

        rows.push({
            page: pageNo,

            source_card_no: sourceId,
            source_card_name: sourceName,
            source_rarity_name: sourceRarity,
            source_rarity_stars:
                rarityStars(sourceRarity),
            source_image_url: sourceImg.src,

            target_card_no: targetId,
            target_card_name: targetName,
            target_rarity_name: targetRarity,
            target_rarity_stars:
                rarityStars(targetRarity),
            target_image_url: targetImg.src,

            evidence: {
                source: "official_limit_break_list",
                has_tensei_before_label:
                    blockText.includes("転生前カード"),
                target_image_size: "320",
                source_image_size: "120"
            }
        });

        seenTargets.add(targetId);
    }

    return rows;
}

function detectMaxPage(doc) {
    let max = 0;

    for (const a of doc.querySelectorAll("a[href]")) {
        try {
            const u = new URL(
                a.href,
                location.origin
            );

            if (
                u.searchParams.get("M") === "LimitBreak" &&
                u.searchParams.get("A") === "List"
            ) {
                const p =
                    Number(
                        u.searchParams.get("p")
                    );

                if (
                    Number.isInteger(p) &&
                    p >= 0
                ) {
                    max = Math.max(max, p);
                }
            }
        } catch (_) {
        }
    }

    return max;
}

function auditRelations(list) {
    const targetMap = new Map();
    const sourceMap = new Map();

    const duplicateTargets = [];
    const duplicateSources = [];
    const invalidRows = [];
    const rarityMismatches = [];

    for (const r of list) {
        if (
            !r.source_card_no ||
            !r.target_card_no ||
            !r.source_card_name ||
            !r.target_card_name
        ) {
            invalidRows.push(r);
        }

        if (targetMap.has(r.target_card_no)) {
            duplicateTargets.push({
                card_no: r.target_card_no,
                first: targetMap.get(r.target_card_no),
                second: r
            });
        } else {
            targetMap.set(
                r.target_card_no,
                r
            );
        }

        if (sourceMap.has(r.source_card_no)) {
            duplicateSources.push({
                card_no: r.source_card_no,
                first: sourceMap.get(r.source_card_no),
                second: r
            });
        } else {
            sourceMap.set(
                r.source_card_no,
                r
            );
        }

        if (
            r.source_rarity_stars &&
            r.target_rarity_stars &&
            r.target_rarity_stars !==
                r.source_rarity_stars + 1
        ) {
            rarityMismatches.push(r);
        }
    }

    return {
        relation_count: list.length,
        unique_source_count:
            sourceMap.size,
        unique_target_count:
            targetMap.size,
        duplicate_source_count:
            duplicateSources.length,
        duplicate_target_count:
            duplicateTargets.length,
        invalid_row_count:
            invalidRows.length,
        rarity_step_mismatch_count:
            rarityMismatches.length,

        duplicate_sources:
            duplicateSources,

        duplicate_targets:
            duplicateTargets,

        invalid_rows:
            invalidRows,

        rarity_step_mismatches:
            rarityMismatches
    };
}

function buildOutput() {
    const audit =
        auditRelations(relations);

    return {
        meta: {
            type:
                "jolly_reincarnation_relations",

            version:
                VERSION,

            collected_at:
                new Date().toISOString(),

            source_origin:
                location.origin,

            source_url:
                absoluteURL(BASE_URL),

            page_count:
                pageResults.length,

            relation_count:
                relations.length,

            failed_page_count:
                errors.length,

            finished:
                !stopRequested &&
                errors.length === 0
        },

        audit:
            audit,

        relations:
            relations,

        pages:
            pageResults,

        errors:
            errors
    };
}

function saveJSON() {
    const output =
        buildOutput();

    const blob =
        new Blob(
            [
                JSON.stringify(
                    output,
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
        "jolly_reincarnation_relations.json";

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(
        () => URL.revokeObjectURL(url),
        2000
    );
}

function makeButton(text) {
    const b =
        document.createElement("button");

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

function updatePanel() {
    const info =
        document.getElementById(
            "jolly_reincarnation_info"
        );

    if (!info) return;

    const audit =
        auditRelations(relations);

    info.innerHTML =
        "<b>公式転生関係Collector</b><br><br>" +

        "取得ページ: " +
        pageResults.length +
        "<br>" +

        "転生関係: " +
        relations.length +
        "<br>" +

        "エラー: " +
        errors.length +
        "<br>" +

        "重複 target: " +
        audit.duplicate_target_count +
        "<br>" +

        "不完全行: " +
        audit.invalid_row_count +
        "<br>" +

        "レア度差異: " +
        audit.rarity_step_mismatch_count;
}

async function run() {
    if (running) {
        alert("すでに実行中です。");
        return;
    }

    running = true;
    stopRequested = false;

    pageResults = [];
    errors = [];
    relations = [];

    updatePanel();

    try {
        setStatus("1ページ目を確認中");

        const first =
            await fetchDoc(
                absoluteURL(BASE_URL)
            );

        const maxPage =
            detectMaxPage(first.doc);

        const totalPages =
            maxPage + 1;

        for (
            let p = 0;
            p < totalPages;
            p++
        ) {
            if (stopRequested) {
                break;
            }

            setStatus(
                "ページ " +
                (p + 1) +
                "/" +
                totalPages
            );

            try {
                let fetched;

                if (p === 0) {
                    fetched = first;
                } else {
                    fetched =
                        await fetchDoc(
                            absoluteURL(
                                BASE_URL +
                                "&p=" +
                                p
                            )
                        );
                }

                const rows =
                    parsePage(
                        fetched.doc,
                        p
                    );

                pageResults.push({
                    page: p,
                    url:
                        p === 0
                            ? absoluteURL(BASE_URL)
                            : absoluteURL(
                                BASE_URL +
                                "&p=" +
                                p
                            ),
                    relation_count:
                        rows.length
                });

                relations.push(
                    ...rows
                );

            } catch (e) {
                errors.push({
                    page: p,
                    message:
                        String(
                            e?.message || e
                        )
                });
            }

            updatePanel();
            await sleep(DELAY_MS);
        }

        /*
          target_card_no単位で完全重複だけ除外
        */
        const unique = [];
        const seen = new Set();

        for (const r of relations) {
            const key =
                r.source_card_no +
                ">" +
                r.target_card_no;

            if (!seen.has(key)) {
                seen.add(key);
                unique.push(r);
            }
        }

        relations = unique;

        updatePanel();

        const output =
            buildOutput();

        if (!stopRequested) {
            alert(
                "転生カード一覧の収集完了\n\n" +
                "ページ: " +
                output.meta.page_count +
                "\n" +
                "転生関係: " +
                output.meta.relation_count +
                "\n" +
                "エラー: " +
                output.meta.failed_page_count +
                "\n" +
                "不完全行: " +
                output.audit.invalid_row_count
            );
        }

    } catch (e) {
        alert(
            "開始できませんでした\n" +
            String(
                e?.message || e
            )
        );

    } finally {
        running = false;
        updatePanel();
    }
}

document
    .getElementById(
        "jolly_reincarnation_collector_panel"
    )
    ?.remove();

const panel =
    document.createElement("div");

panel.id =
    "jolly_reincarnation_collector_panel";

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
    "max-height:62vh",
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
        "転生カード一覧を全収集"
    );

start.onclick = run;

panel.appendChild(start);

const stop =
    makeButton("停止");

stop.onclick = () => {
    stopRequested = true;
};

panel.appendChild(stop);

const save =
    makeButton("JSON保存");

save.onclick = saveJSON;

panel.appendChild(save);

const close =
    makeButton("閉じる");

close.onclick = () =>
    panel.remove();

panel.appendChild(close);

document.body.appendChild(panel);

updatePanel();

})();
