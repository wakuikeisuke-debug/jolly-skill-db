(function () {
    "use strict";

    const VERSION = "jolly-inventory-collector-1.0";
    const ORIGIN = location.origin;

    const STATE_KEY = "JOLLY_INVENTORY_COLLECTOR_STATE_V1";
    const RESULT_KEY = "JOLLY_INVENTORY_COLLECTOR_RESULT_V1";

    const URLS = {
        cards:
            ORIGIN +
            "/?M=Card&A=Default&deck=0&sort=0&property=0" +
            "&card_cost=0&card_skill=0&card_name=0&item=0" +
            "&card_rare=0&card_mark=",

        stock:
            ORIGIN +
            "/?M=CardPot&A=List",

        composition:
            ORIGIN +
            "/?M=Composition&A=Default&sort=17&property=0" +
            "&card_cost=0&card_skill=0&card_name=0&card_rare=0"
    };

    let stopRequested = false;

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

    function intValue(v, fallback = null) {
        if (v === null || v === undefined) return fallback;
        const m = String(v).replace(/,/g, "").match(/-?\d+/);
        return m ? Number(m[0]) : fallback;
    }

    function numberValue(v, fallback = null) {
        if (v === null || v === undefined) return fallback;
        const m = String(v).replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
        return m ? Number(m[0]) : fallback;
    }

    function absUrl(href) {
        try {
            return new URL(href, ORIGIN).href;
        } catch (_) {
            return String(href || "");
        }
    }

    function makePageUrl(baseUrl, pageIndex) {
        const u = new URL(baseUrl);
        u.searchParams.set("p", String(pageIndex));
        return u.href;
    }

    function parseHTML(html) {
        return new DOMParser().parseFromString(html, "text/html");
    }

    function isLoginPage(doc) {
        const text = cleanText(doc.body?.innerText || "");
        return (
            /ログイン/.test(text) &&
            !/カード|覚醒|海賊/.test(text)
        );
    }

    async function fetchDoc(url) {
        const res = await fetch(url, {
            credentials: "include",
            cache: "no-store"
        });

        if (!res.ok) {
            throw new Error(
                "HTTP " + res.status + " : " + url
            );
        }

        const html = await res.text();
        const doc = parseHTML(html);

        if (isLoginPage(doc)) {
            throw new Error(
                "ログイン画面へ遷移しました: " + url
            );
        }

        return doc;
    }

    function detectMaxPageIndex(doc, moduleName, actionName) {
        let max = 0;

        doc.querySelectorAll("a[href]").forEach(a => {
            try {
                const u = new URL(a.getAttribute("href"), ORIGIN);

                if (
                    u.searchParams.get("M") !== moduleName ||
                    u.searchParams.get("A") !== actionName
                ) {
                    return;
                }

                const p = intValue(
                    u.searchParams.get("p"),
                    null
                );

                if (p !== null && p > max) {
                    max = p;
                }
            } catch (_) {}
        });

        return max;
    }

    function imageCardId(container) {
        if (!container) return null;

        const imgs = container.querySelectorAll(
            'img[src*="/img/card/"]'
        );

        for (const img of imgs) {
            const src = img.getAttribute("src") || "";
            const m = src.match(
                /\/img\/card\/(?:70|120)\/(\d+)\.jpg/
            );

            if (m) {
                return m[1];
            }
        }

        return null;
    }

    function extractRarity(text) {
        const m = text.match(
            /\[(Legend|Ultra Rare|Super Rare|High Rare|Rare|Normal)\]/i
        );

        return m ? m[1] : "";
    }

    function extractLevel(text) {
        const m = text.match(
            /Lv\.\s*(\d+)\s*\/\s*(\d+)/
        );

        return {
            level: m ? Number(m[1]) : null,
            level_max: m ? Number(m[2]) : null
        };
    }

    function extractCost(text) {
        const m = text.match(
            /コスト\s*([0-9.]+)/
        );

        return m ? Number(m[1]) : null;
    }

    function extractGender(text) {
        const m = text.match(
            /性別\s*\[([^\]]+)\]/
        );

        return m ? m[1] : "";
    }

    function extractStats(text) {
        return {
            hp: intValue(
                (text.match(/体力\s*([0-9,]+)/) || [])[1],
                null
            ),

            attack: intValue(
                (text.match(/攻撃\s*([0-9,]+)/) || [])[1],
                null
            ),

            speed: intValue(
                (text.match(/速さ\s*([0-9,]+)/) || [])[1],
                null
            )
        };
    }

    function parseOwnedCards(doc, locationName) {
        const rows = [];
        const seen = new Set();

        doc.querySelectorAll("a[href]").forEach(a => {
            let u;

            try {
                u = new URL(
                    a.getAttribute("href"),
                    ORIGIN
                );
            } catch (_) {
                return;
            }

            if (
                u.searchParams.get("M") !== "Card" ||
                u.searchParams.get("A") !== "Detail"
            ) {
                return;
            }

            const instanceId =
                u.searchParams.get("card");

            if (!instanceId || seen.has(instanceId)) {
                return;
            }

            const li =
                a.closest("li") ||
                a.parentElement ||
                a;

            const text = cleanText(
                li.innerText || a.innerText || ""
            );

            const nameEl =
                li.querySelector(".cardcolor_name");

            const name = cleanText(
                nameEl?.textContent || ""
            );

            if (!name) return;

            const level = extractLevel(text);
            const stats = extractStats(text);

            rows.push({
                instance_id: String(instanceId),
                card_image_id: imageCardId(li),
                card_name: name,
                rarity_name: extractRarity(text),
                level: level.level,
                level_max: level.level_max,
                cost: extractCost(text),
                gender: extractGender(text),
                hp: stats.hp,
                attack: stats.attack,
                speed: stats.speed,
                protected:
                    text.includes("保護中"),
                location: locationName,
                detail_url: u.href
            });

            seen.add(instanceId);
        });

        return rows;
    }

    function parseCompositionCards(doc) {
        const rows = [];
        const seen = new Set();

        doc.querySelectorAll("a[href]").forEach(a => {
            let u;

            try {
                u = new URL(
                    a.getAttribute("href"),
                    ORIGIN
                );
            } catch (_) {
                return;
            }

            if (
                u.searchParams.get("M") !== "Composition" ||
                u.searchParams.get("A") !== "Check"
            ) {
                return;
            }

            const baseId =
                u.searchParams.get("base");

            if (!baseId || seen.has(baseId)) {
                return;
            }

            const li =
                a.closest("li") ||
                a.parentElement ||
                a;

            const text = cleanText(
                li.innerText || a.innerText || ""
            );

            const nameEl =
                li.querySelector(".cardcolor_name");

            const name = cleanText(
                nameEl?.textContent || ""
            );

            if (!name) return;

            const owned =
                intValue(
                    (
                        text.match(
                            /所持枚数[：:]\s*(\d+)枚/
                        ) || []
                    )[1],
                    null
                );

            const awakening =
                intValue(
                    (
                        text.match(
                            /覚醒合成[：:]\s*(\d+)回/
                        ) || []
                    )[1],
                    0
                );

            const remaining =
                intValue(
                    (
                        text.match(
                            /あと\s*(\d+)回できます/
                        ) || []
                    )[1],
                    0
                );

            const materialHint =
                (
                    text.match(
                        /「([^」]+)」で覚醒できます/
                    ) || []
                )[1] || "";

            const level = extractLevel(text);
            const stats = extractStats(text);

            rows.push({
                base_instance_id: String(baseId),
                card_image_id: imageCardId(li),
                card_name: name,
                rarity_name: extractRarity(text),

                level: level.level,
                level_max: level.level_max,

                cost: extractCost(text),
                gender: extractGender(text),

                hp: stats.hp,
                attack: stats.attack,
                speed: stats.speed,

                owned_count_site: owned,

                awakening_count: awakening,

                remaining_awakenings_site:
                    remaining,

                awakening_max_site:
                    awakening !== null &&
                    remaining !== null
                        ? awakening + remaining
                        : null,

                protected:
                    text.includes("保護中"),

                site_material_hint:
                    materialHint,

                site_allows_pre_reincarnation:
                    text.includes("転生前"),

                site_same_card_bonus:
                    intValue(
                        (
                            text.match(
                                /同カード\s*\+(\d+)UP/
                            ) || []
                        )[1],
                        null
                    ),

                site_pre_reincarnation_bonus:
                    intValue(
                        (
                            text.match(
                                /転生前\s*\+(\d+)UP/
                            ) || []
                        )[1],
                        null
                    ),

                check_url: u.href
            });

            seen.add(baseId);
        });

        return rows;
    }

    function parseCompositionMaterials(doc) {
        const result = [];
        const seen = new Set();

        const nodes = doc.querySelectorAll("div");

        for (const el of nodes) {
            const text = cleanText(
                el.innerText || ""
            );

            if (
                !/もっている数\s*[：:]\s*\d+/.test(text)
            ) {
                continue;
            }

            const matches =
                text.match(
                    /もっている数\s*[：:]\s*\d+/g
                ) || [];

            if (matches.length !== 1) {
                continue;
            }

            if (text.length > 250) {
                continue;
            }

            const lines = text
                .split("\n")
                .map(v => cleanText(v))
                .filter(Boolean);

            const countIndex =
                lines.findIndex(v =>
                    /もっている数\s*[：:]\s*\d+/.test(v)
                );

            if (countIndex <= 0) {
                continue;
            }

            const name = lines[0];

            const count =
                intValue(lines[countIndex], null);

            if (
                !name ||
                count === null ||
                seen.has(name)
            ) {
                continue;
            }

            const description = lines
                .slice(1, countIndex)
                .join(" ");

            const imgId =
                imageCardId(el);

            result.push({
                material_name: name,
                card_image_id: imgId,
                description: description,
                owned_count: count,

                universal:
                    /全.?カード対象/.test(description),

                target_star:
                    intValue(
                        (
                            description.match(
                                /★\s*(\d+)\s*専用/
                            ) || []
                        )[1],
                        null
                    ),

                reincarnation_only:
                    /転生後専用/.test(description),

                king_reincarnation:
                    /キング転生らいおん/.test(name)
            });

            seen.add(name);
        }

        return result;
    }

    function mergeByKey(array, keyName) {
        const map = new Map();

        for (const row of array) {
            const key = row[keyName];

            if (!key) continue;

            if (!map.has(key)) {
                map.set(key, row);
            }
        }

        return Array.from(map.values());
    }

    function blankState() {
        return {
            version: VERSION,

            started_at:
                new Date().toISOString(),

            phase: "idle",

            cards: [],
            stock: [],
            composition_cards: [],
            materials: [],

            progress: {
                cards_page: -1,
                cards_max_page: null,

                stock_page: -1,
                stock_max_page: null,

                composition_page: -1,
                composition_max_page: null
            },

            errors: []
        };
    }

    function loadState() {
        try {
            const raw =
                localStorage.getItem(STATE_KEY);

            if (!raw) return blankState();

            const obj = JSON.parse(raw);

            if (obj.version !== VERSION) {
                return blankState();
            }

            return obj;
        } catch (_) {
            return blankState();
        }
    }

    function saveState(state) {
        localStorage.setItem(
            STATE_KEY,
            JSON.stringify(state)
        );
    }

    function clearSavedState() {
        localStorage.removeItem(STATE_KEY);
        localStorage.removeItem(RESULT_KEY);
    }

    async function collectSection(
        state,
        sectionName,
        baseUrl,
        moduleName,
        actionName,
        parser,
        delayMs
    ) {
        const pageKey =
            sectionName + "_page";

        const maxKey =
            sectionName + "_max_page";

        let startPage =
            Number(state.progress[pageKey] ?? -1) + 1;

        let maxPage =
            state.progress[maxKey];

        if (maxPage === null) {
            const first = await fetchDoc(
                makePageUrl(baseUrl, 0)
            );

            maxPage = detectMaxPageIndex(
                first,
                moduleName,
                actionName
            );

            state.progress[maxKey] = maxPage;

            const rows = parser(first);

            state[sectionName].push(...rows);

            state.progress[pageKey] = 0;

            saveState(state);
            updatePanel(state);

            startPage = 1;

            await sleep(delayMs);
        }

        for (
            let page = startPage;
            page <= maxPage;
            page++
        ) {
            if (stopRequested) {
                state.phase = "stopped";
                saveState(state);
                updatePanel(state);
                return false;
            }

            try {
                const doc = await fetchDoc(
                    makePageUrl(baseUrl, page)
                );

                const rows = parser(doc);

                state[sectionName].push(...rows);

                state.progress[pageKey] = page;

                saveState(state);
                updatePanel(state);
            } catch (e) {
                state.errors.push({
                    phase: sectionName,
                    page: page,
                    url: makePageUrl(
                        baseUrl,
                        page
                    ),
                    message: String(
                        e?.message || e
                    )
                });

                saveState(state);

                throw e;
            }

            await sleep(delayMs);
        }

        return true;
    }

    async function collectComposition(state) {
        const sectionName = "composition_cards";
        const pageKey = "composition_page";
        const maxKey = "composition_max_page";

        let startPage =
            Number(state.progress[pageKey] ?? -1) + 1;

        let maxPage =
            state.progress[maxKey];

        if (maxPage === null) {
            const first = await fetchDoc(
                makePageUrl(
                    URLS.composition,
                    0
                )
            );

            maxPage = detectMaxPageIndex(
                first,
                "Composition",
                "Default"
            );

            state.progress[maxKey] =
                maxPage;

            state.composition_cards.push(
                ...parseCompositionCards(first)
            );

            state.materials =
                parseCompositionMaterials(first);

            state.progress[pageKey] = 0;

            saveState(state);
            updatePanel(state);

            startPage = 1;

            await sleep(250);
        }

        for (
            let page = startPage;
            page <= maxPage;
            page++
        ) {
            if (stopRequested) {
                state.phase = "stopped";
                saveState(state);
                updatePanel(state);
                return false;
            }

            try {
                const doc = await fetchDoc(
                    makePageUrl(
                        URLS.composition,
                        page
                    )
                );

                state.composition_cards.push(
                    ...parseCompositionCards(doc)
                );

                state.progress[pageKey] = page;

                saveState(state);
                updatePanel(state);
            } catch (e) {
                state.errors.push({
                    phase: "composition",
                    page: page,
                    url: makePageUrl(
                        URLS.composition,
                        page
                    ),
                    message: String(
                        e?.message || e
                    )
                });

                saveState(state);

                throw e;
            }

            await sleep(250);
        }

        return true;
    }

    function buildResult(state) {
        const cards =
            mergeByKey(
                state.cards,
                "instance_id"
            );

        const stock =
            mergeByKey(
                state.stock,
                "instance_id"
            );

        const compositionCards =
            mergeByKey(
                state.composition_cards,
                "base_instance_id"
            );

        const allOwned = mergeByKey(
            [...cards, ...stock],
            "instance_id"
        );

        const countsByImageId = {};

        for (const row of allOwned) {
            const key =
                row.card_image_id ||
                "name:" + row.card_name;

            if (!countsByImageId[key]) {
                countsByImageId[key] = {
                    card_image_id:
                        row.card_image_id,
                    card_name:
                        row.card_name,
                    rarity_name:
                        row.rarity_name,
                    total_owned: 0,
                    card_list_owned: 0,
                    stock_owned: 0,
                    instance_ids: []
                };
            }

            const x = countsByImageId[key];

            x.total_owned += 1;

            if (row.location === "card_list") {
                x.card_list_owned += 1;
            }

            if (row.location === "stock") {
                x.stock_owned += 1;
            }

            x.instance_ids.push(
                row.instance_id
            );
        }

        return {
            meta: {
                version: VERSION,

                collected_at:
                    new Date().toISOString(),

                source_origin: ORIGIN,

                card_list_count:
                    cards.length,

                stock_count:
                    stock.length,

                total_owned_instances:
                    allOwned.length,

                composition_card_count:
                    compositionCards.length,

                material_type_count:
                    state.materials.length,

                error_count:
                    state.errors.length,

                finished:
                    state.phase === "finished"
            },

            owned_instances: allOwned,

            owned_summary:
                Object.values(countsByImageId),

            awakening_cards:
                compositionCards,

            awakening_materials:
                state.materials,

            progress:
                state.progress,

            errors:
                state.errors
        };
    }

    function downloadJson(data) {
        const blob = new Blob(
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
            "jolly_user_inventory_raw.json";

        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(
            () =>
                URL.revokeObjectURL(url),
            2000
        );
    }

    async function runCollector() {
        stopRequested = false;

        const state = loadState();

        try {
            state.phase = "cards";
            saveState(state);
            updatePanel(state);

            const cardsOK =
                await collectSection(
                    state,
                    "cards",
                    URLS.cards,
                    "Card",
                    "Default",
                    doc =>
                        parseOwnedCards(
                            doc,
                            "card_list"
                        ),
                    250
                );

            if (!cardsOK) return;

            state.phase = "stock";
            saveState(state);
            updatePanel(state);

            const stockOK =
                await collectSection(
                    state,
                    "stock",
                    URLS.stock,
                    "CardPot",
                    "List",
                    doc =>
                        parseOwnedCards(
                            doc,
                            "stock"
                        ),
                    250
                );

            if (!stockOK) return;

            state.phase = "composition";
            saveState(state);
            updatePanel(state);

            const compositionOK =
                await collectComposition(
                    state
                );

            if (!compositionOK) return;

            state.phase = "finished";

            state.cards =
                mergeByKey(
                    state.cards,
                    "instance_id"
                );

            state.stock =
                mergeByKey(
                    state.stock,
                    "instance_id"
                );

            state.composition_cards =
                mergeByKey(
                    state.composition_cards,
                    "base_instance_id"
                );

            saveState(state);

            const result =
                buildResult(state);

            localStorage.setItem(
                RESULT_KEY,
                JSON.stringify(result)
            );

            updatePanel(state);

            alert(
                "収集完了\n\n" +
                "通常カード: " +
                result.meta.card_list_count +
                "\n" +
                "ストック: " +
                result.meta.stock_count +
                "\n" +
                "合計個体: " +
                result.meta.total_owned_instances +
                "\n" +
                "覚醒対象: " +
                result.meta.composition_card_count +
                "\n" +
                "素材種類: " +
                result.meta.material_type_count +
                "\n" +
                "エラー: " +
                result.meta.error_count
            );
        } catch (e) {
            state.phase = "error";

            state.errors.push({
                phase: state.phase,
                message:
                    String(
                        e?.message || e
                    )
            });

            saveState(state);
            updatePanel(state);

            alert(
                "収集中にエラーが発生しました。\n\n" +
                String(
                    e?.message || e
                ) +
                "\n\n再実行すると続きから再開します。"
            );
        }
    }

    function getCurrentResult() {
        try {
            const saved =
                localStorage.getItem(
                    RESULT_KEY
                );

            if (saved) {
                return JSON.parse(saved);
            }
        } catch (_) {}

        return buildResult(
            loadState()
        );
    }

    function button(text) {
        const b =
            document.createElement("button");

        b.textContent = text;

        b.style.cssText = [
            "display:block",
            "width:100%",
            "margin:7px 0",
            "padding:11px 8px",
            "border:0",
            "border-radius:9px",
            "font-size:14px",
            "font-weight:bold",
            "background:#fff",
            "color:#111"
        ].join(";");

        return b;
    }

    function removePanel() {
        document
            .getElementById(
                "jolly_inventory_collector_panel"
            )
            ?.remove();
    }

    function updatePanel(state) {
        const info =
            document.getElementById(
                "jolly_inventory_collector_info"
            );

        if (!info) return;

        const p = state.progress;

        info.innerHTML =
            "<b>JOLLY 育成データ収集</b><br>" +
            "状態: " +
            state.phase +
            "<br><br>" +

            "通常カード: " +
            state.cards.length +
            " / page " +
            (p.cards_page + 1) +
            "/" +
            (
                p.cards_max_page === null
                    ? "?"
                    : p.cards_max_page + 1
            ) +
            "<br>" +

            "ストック: " +
            state.stock.length +
            " / page " +
            (p.stock_page + 1) +
            "/" +
            (
                p.stock_max_page === null
                    ? "?"
                    : p.stock_max_page + 1
            ) +
            "<br>" +

            "覚醒対象: " +
            state.composition_cards.length +
            " / page " +
            (p.composition_page + 1) +
            "/" +
            (
                p.composition_max_page === null
                    ? "?"
                    : p.composition_max_page + 1
            ) +
            "<br>" +

            "素材種類: " +
            state.materials.length +
            "<br>" +

            "エラー: " +
            state.errors.length;
    }

    removePanel();

    const panel =
        document.createElement("div");

    panel.id =
        "jolly_inventory_collector_panel";

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
        "max-height:55vh",
        "overflow:auto"
    ].join(";");

    const info =
        document.createElement("div");

    info.id =
        "jolly_inventory_collector_info";

    panel.appendChild(info);

    const startButton =
        button("収集開始 / 続きから再開");

    startButton.onclick =
        runCollector;

    panel.appendChild(
        startButton
    );

    const stopButton =
        button("停止");

    stopButton.onclick =
        function () {
            stopRequested = true;
        };

    panel.appendChild(
        stopButton
    );

    const saveButton =
        button("JSONを保存");

    saveButton.onclick =
        function () {
            downloadJson(
                getCurrentResult()
            );
        };

    panel.appendChild(
        saveButton
    );

    const resetButton =
        button("収集データをリセット");

    resetButton.onclick =
        function () {
            if (
                !confirm(
                    "途中データを削除して最初からやり直しますか？"
                )
            ) {
                return;
            }

            clearSavedState();

            const state =
                blankState();

            saveState(state);
            updatePanel(state);

            alert(
                "リセットしました。"
            );
        };

    panel.appendChild(
        resetButton
    );

    const closeButton =
        button("閉じる");

    closeButton.onclick =
        removePanel;

    panel.appendChild(
        closeButton
    );

    document.body.appendChild(
        panel
    );

    updatePanel(
        loadState()
    );
})();
