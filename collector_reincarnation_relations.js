(function () {
"use strict";

const VERSION = "jolly-reincarnation-relations-1.1";
const BASE_URL = "/?M=LimitBreak&A=List&sort=13&property=0";
const DELAY_MS = 300;
const RETRY_LIMIT = 3;

let running = false;
let stopRequested = false;
let relations = [];
let pages = [];
let errors = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function abs(url) {
    return new URL(url, location.origin).href;
}

function cleanText(v) {
    return String(v || "")
        .replace(/\u00a0/g, " ")
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function parseHTML(html) {
    return new DOMParser().parseFromString(html, "text/html");
}

async function fetchPage(url) {
    let lastError;

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
                throw new Error("転生カード一覧ではありません");
            }

            return { doc, html, text };

        } catch (e) {
            lastError = e;
            if (attempt < RETRY_LIMIT) {
                await sleep(500 * attempt);
            }
        }
    }

    throw lastError || new Error("fetch failed");
}

function cardInfoFromImg(img) {
    const src = img.src || "";

    const m = src.match(
        /\/img\/card\/(120|320|640)\/(\d+)\.(?:jpg|jpeg|png|gif)/i
    );

    if (!m) return null;

    return {
        size: m[1],
        card_no: m[2],
        src
    };
}

function detectMaxPage(doc) {
    let maxPage = 0;

    for (const a of doc.querySelectorAll("a[href]")) {
        try {
            const u = new URL(a.href, location.origin);

            if (
                u.searchParams.get("M") === "LimitBreak" &&
                u.searchParams.get("A") === "List"
            ) {
                const p = Number(u.searchParams.get("p"));

                if (Number.isInteger(p) && p >= 0) {
                    maxPage = Math.max(maxPage, p);
                }
            }
        } catch (_) {}
    }

    return maxPage;
}

function findNearestTextBefore(img, stopWords = []) {
    let el = img;
    let collected = [];

    for (let depth = 0; el && depth < 7; depth++, el = el.parentElement) {
        const text = cleanText(el.innerText || "");

        if (!text) continue;

        const lines = text
            .split("\n")
            .map(x => x.trim())
            .filter(Boolean);

        for (const line of lines) {
            if (stopWords.includes(line)) continue;

            if (
                line.length >= 2 &&
                line.length <= 50 &&
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
                collected.push(line);
            }
        }

        if (collected.length) {
            return collected[0];
        }
    }

    return null;
}

function extractNameFromSegment(segmentText, mode) {
    const lines = cleanText(segmentText)
        .split("\n")
        .map(x => x.trim())
        .filter(Boolean);

    const idx = lines.indexOf("転生前カード");

    if (mode === "source" && idx >= 0) {
        for (let i = idx + 1; i < Math.min(lines.length, idx + 8); i++) {
            const line = lines[i];

            if (
                line.length >= 2 &&
                line.length <= 50 &&
                !/^\[.*\]$/.test(line) &&
                !/^コスト/.test(line) &&
                !/^体力[:：]/.test(line) &&
                !/^攻撃[:：]/.test(line) &&
                !/^速さ[:：]/.test(line) &&
                !/^転生前カード/.test(line)
            ) {
                return line;
            }
        }
    }

    if (mode === "target") {
        const end = idx >= 0 ? idx : Math.min(lines.length, 15);

        for (let i = 0; i < end; i++) {
            const line = lines[i];

            if (
                line.length >= 2 &&
                line.length <= 50 &&
                !/^\[.*\]$/.test(line) &&
                !/^コスト/.test(line) &&
                !/^体力[:：]/.test(line) &&
                !/^攻撃[:：]/.test(line) &&
                !/^速さ[:：]/.test(line) &&
                !/^MAX値/.test(line) &&
                !/^転生カード一覧/.test(line)
            ) {
                return line;
            }
        }
    }

    return null;
}

function getTextBetweenNodes(startImg, endImg) {
    const bodyText = cleanText(
        startImg.parentElement?.parentElement?.innerText || ""
    );

    if (bodyText.includes("転生前カード")) {
        return bodyText;
    }

    let el = startImg.parentElement;

    for (let depth = 0; el && depth < 8; depth++, el = el.parentElement) {
        const text = cleanText(el.innerText || "");

        if (text.includes("転生前カード")) {
            const imgs = Array.from(el.querySelectorAll("img"));

            if (imgs.includes(startImg) && imgs.includes(endImg)) {
                return text;
            }
        }
    }

    return "";
}

function parsePage(doc, pageNo) {
    const images = Array.from(doc.querySelectorAll("img"))
        .map(img => ({
            img,
            info: cardInfoFromImg(img)
        }))
        .filter(x => x.info);

    const rows = [];

    for (let i = 0; i < images.length; i++) {
        const current = images[i];

        if (current.info.size !== "320") {
            continue;
        }

        let source = null;

        for (let j = i + 1; j < images.length; j++) {
            const next = images[j];

            if (next.info.size === "320") {
                break;
            }

            if (next.info.size === "120") {
                source = next;
                break;
            }
        }

        if (!source) {
            continue;
        }

        const segmentText = getTextBetweenNodes(
            current.img,
            source.img
        );

        let targetName = extractNameFromSegment(
            segmentText,
            "target"
        );

        let sourceName = extractNameFromSegment(
            segmentText,
            "source"
        );

        if (!targetName) {
            targetName = findNearestTextBefore(
                current.img,
                ["転生前カード"]
            );
        }

        if (!sourceName) {
            sourceName = findNearestTextBefore(
                source.img,
                ["転生前カード"]
            );
        }

        rows.push({
            page: pageNo,

            source_card_no: source.info.card_no,
            source_card_name: sourceName,
            source_image_url: source.info.src,

            target_card_no: current.info.card_no,
            target_card_name: targetName,
            target_image_url: current.info.src,

            evidence: {
                source: "official_limit_break_list",
                pairing_method: "320_then_next_120_before_next_320",
                has_tensei_before_label:
                    segmentText.includes("転生前カード")
            }
        });
    }

    return rows;
}

function audit(list) {
    const seenPair = new Set();
    const seenTarget = new Map();

    const exactDuplicates = [];
    const duplicateTargets = [];
    const invalidRows = [];

    for (const r of list) {
        const pairKey =
            r.source_card_no + ">" + r.target_card_no;

        if (seenPair.has(pairKey)) {
            exactDuplicates.push(r);
        } else {
            seenPair.add(pairKey);
        }

        if (seenTarget.has(r.target_card_no)) {
            const prev = seenTarget.get(r.target_card_no);

            if (prev.source_card_no !== r.source_card_no) {
                duplicateTargets.push({
                    target_card_no: r.target_card_no,
                    first_source_card_no: prev.source_card_no,
                    second_source_card_no: r.source_card_no
                });
            }
        } else {
            seenTarget.set(r.target_card_no, r);
        }

        if (
            !r.source_card_no ||
            !r.target_card_no
        ) {
            invalidRows.push(r);
        }
    }

    return {
        relation_count: list.length,
        unique_pair_count: seenPair.size,
        unique_target_count: seenTarget.size,
        exact_duplicate_count: exactDuplicates.length,
        conflicting_target_count: duplicateTargets.length,
        invalid_row_count: invalidRows.length,
        exact_duplicates: exactDuplicates,
        conflicting_targets: duplicateTargets,
        invalid_rows: invalidRows
    };
}

function dedupe(list) {
    const seen = new Set();
    const out = [];

    for (const r of list) {
        const key =
            r.source_card_no + ">" + r.target_card_no;

        if (!seen.has(key)) {
            seen.add(key);
            out.push(r);
        }
    }

    return out;
}

function buildOutput() {
    const cleaned = dedupe(relations);
    const a = audit(cleaned);

    return {
        meta: {
            type: "jolly_reincarnation_relations",
            version: VERSION,
            collected_at: new Date().toISOString(),
            source_origin: location.origin,
            source_url: abs(BASE_URL),
            page_count: pages.length,
            relation_count: cleaned.length,
            failed_page_count: errors.length,
            finished:
                !stopRequested &&
                errors.length === 0
        },

        audit: a,

        relations: cleaned,

        pages,

        errors
    };
}

function saveJSON() {
    const output = buildOutput();

    const blob = new Blob(
        [JSON.stringify(output, null, 2)],
        { type: "application/json;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "jolly_reincarnation_relations.json";

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(
        () => URL.revokeObjectURL(url),
        2000
    );
}

function makeButton(label) {
    const b = document.createElement("button");
    b.textContent = label;

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
        document.getElementById("jrr_status");

    if (el) {
        el.textContent = text;
    }
}

function updatePanel() {
    const el =
        document.getElementById("jrr_info");

    if (!el) return;

    const output = buildOutput();

    el.innerHTML =
        "<b>転生カード公式関係Collector v1.1</b><br><br>" +
        "ページ: " +
        output.meta.page_count +
        "<br>" +
        "関係: " +
        output.meta.relation_count +
        "<br>" +
        "エラー: " +
        output.meta.failed_page_count +
        "<br>" +
        "target競合: " +
        output.audit.conflicting_target_count +
        "<br>" +
        "不完全行: " +
        output.audit.invalid_row_count;
}

async function run() {
    if (running) {
        alert("実行中です。");
        return;
    }

    running = true;
    stopRequested = false;
    relations = [];
    pages = [];
    errors = [];

    updatePanel();

    try {
        setStatus("1ページ目を確認中");

        const first = await fetchPage(
            abs(BASE_URL)
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
                const fetched =
                    p === 0
                        ? first
                        : await fetchPage(
                            abs(
                                BASE_URL +
                                "&p=" +
                                p
                            )
                        );

                const rows =
                    parsePage(
                        fetched.doc,
                        p
                    );

                pages.push({
                    page: p,
                    relation_count: rows.length
                });

                relations.push(...rows);

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

        relations = dedupe(relations);

        updatePanel();

        const output = buildOutput();

        alert(
            "収集完了\n\n" +
            "ページ: " +
            output.meta.page_count +
            "\n" +
            "転生関係: " +
            output.meta.relation_count +
            "\n" +
            "エラー: " +
            output.meta.failed_page_count +
            "\n" +
            "target競合: " +
            output.audit.conflicting_target_count
        );

    } catch (e) {
        alert(
            "開始エラー\n" +
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
    .getElementById("jrr_panel")
    ?.remove();

const panel =
    document.createElement("div");

panel.id = "jrr_panel";

panel.style.cssText = [
    "position:fixed",
    "left:8px",
    "right:8px",
    "bottom:8px",
    "z-index:2147483647",
    "background:rgba(20,20,20,.97)",
    "color:white",
    "padding:12px",
    "border-radius:12px",
    "font-family:-apple-system,BlinkMacSystemFont,sans-serif",
    "font-size:13px",
    "max-height:62vh",
    "overflow:auto",
    "box-shadow:0 2px 14px rgba(0,0,0,.5)"
].join(";");

const info =
    document.createElement("div");

info.id = "jrr_info";
panel.appendChild(info);

const status =
    document.createElement("div");

status.id = "jrr_status";
status.style.cssText =
    "margin:8px 0;color:#ddd;";
status.textContent = "待機中";

panel.appendChild(status);

const start =
    makeButton("転生カード一覧を全収集");

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

close.onclick = () => panel.remove();
panel.appendChild(close);

document.body.appendChild(panel);

updatePanel();

})();
