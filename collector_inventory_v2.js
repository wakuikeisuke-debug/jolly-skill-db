(function () {
    "use strict";

    const VERSION = "jolly-inventory-collector-2.0";
    const ORIGIN = location.origin;

    const DB_NAME = "JOLLY_INVENTORY_V2";
    const DB_VERSION = 1;

    const RETRY_LIMIT = 3;
    const PAGE_DELAY = 250;

    const URLS = {
        cards:
            ORIGIN +
            "/?M=Card&A=Default",

        stock:
            ORIGIN +
            "/?M=CardPot&A=List" +
            "&sort=13&property=0&card_cost=0" +
            "&card_skill=0&card_name=0&card=&card_rare=0",

        composition:
            ORIGIN +
            "/?M=Composition&A=Default" +
            "&sort=17&property=0&card_cost=0" +
            "&card_skill=0&card_name=0&card_rare=0"
    };

    let stopRequested = false;
    let running = false;

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

        const m = String(v)
            .replace(/,/g, "")
            .match(/-?\d+/);

        return m ? Number(m[0]) : fallback;
    }

    function makePageUrl(baseUrl, page) {
        const u = new URL(baseUrl);
        u.searchParams.set("p", String(page));
        return u.href;
    }

    function parseHTML(html) {
        return new DOMParser().parseFromString(
            html,
            "text/html"
        );
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

                const bodyText = cleanText(
                    doc.body?.innerText || ""
                );

                if (
                    /ログイン/.test(bodyText) &&
                    !/カード|海賊|覚醒/.test(bodyText)
                ) {
                    throw new Error(
                        "ログイン画面へ遷移"
                    );
                }

                return doc;

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

    function detectMaxPage(doc, moduleName, actionName) {
        let max = 0;

        doc.querySelectorAll("a[href]").forEach(a => {
            try {
                const u = new URL(
                    a.getAttribute("href"),
                    ORIGIN
                );

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
            const src =
                img.getAttribute("src") || "";

            const m = src.match(
                /\/img\/card\/(?:70|120)\/(\d+)\.jpg/
            );

            if (m) return m[1];
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

    function extractGrowth(text) {
        const m = text.match(
            /成長\s*([A-Z?]+)型/
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

    function extractNavbarCounts(doc) {
        const text = cleanText(
            doc.body?.innerText || ""
        );

        const cardMatch = text.match(
            /カードリスト\s*([0-9,]+)\s*\/\s*([0-9,]+)/
        );

        const stockMatch = text.match(
            /カードストック\s*([0-9,]+)\s*\/\s*([0-9,]+)/
        );

        return {
            card_list_current:
                cardMatch
                    ? Number(cardMatch[1].replace(/,/g, ""))
                    : null,

            card_list_capacity:
                cardMatch
                    ? Number(cardMatch[2].replace(/,/g, ""))
                    : null,

            stock_current:
                stockMatch
                    ? Number(stockMatch[1].replace(/,/g, ""))
                    : null,

            stock_capacity:
                stockMatch
                    ? Number(stockMatch[2].replace(/,/g, ""))
                    : null
        };
    }

    function buildCardObject(
        instanceId,
        container,
        locationName,
        detailUrl = ""
    ) {
        const text = cleanText(
            container?.innerText || ""
        );

        const name = cleanText(
            container
                ?.querySelector(".cardcolor_name")
                ?.textContent || ""
        );

        if (!name) return null;

        const level = extractLevel(text);
        const stats = extractStats(text);

        return {
            instance_id: String(instanceId),
            card_image_id: imageCardId(container),
            card_name: name,
            rarity_name: extractRarity(text),

            level: level.level,
            level_max: level.level_max,

            cost: extractCost(text),
            gender: extractGender(text),
            growth_type: extractGrowth(text),

            hp: stats.hp,
            attack: stats.attack,
            speed: stats.speed,

            protected:
                text.includes("保護中"),

            location: locationName,

            detail_url:
                detailUrl || null
        };
    }

    function parseCardList(doc) {
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

            const id =
                u.searchParams.get("card");

            if (!id || seen.has(id)) {
                return;
            }

            const li =
                a.closest("li") ||
                a.parentElement;

            if (!li) return;

            const row = buildCardObject(
                id,
                li,
                "card_list",
                u.href
            );

            if (!row) return;

            rows.push(row);
            seen.add(id);
        });

        return rows;
    }

    function parseStock(doc) {
        const rows = [];
        const seen = new Set();

        const inputs = doc.querySelectorAll(
            "input.design_cardpot_list_card_list_check"
        );

        inputs.forEach(input => {
            const name =
                input.getAttribute("name") || "";

            const m = name.match(
                /^card\[(\d+)\]$/
            );

            if (!m) return;

            const id = m[1];

            if (seen.has(id)) return;

            const li =
                input.closest("li") ||
                input.parentElement;

            if (!li) return;

            const row = buildCardObject(
                id,
                li,
                "stock",
                ""
            );

            if (!row) return;

            rows.push(row);
            seen.add(id);
        });

        return rows;
    }

    function parseComposition(doc) {
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
                a.parentElement;

            if (!li) return;

            const text = cleanText(
                li.innerText || ""
            );

            const cardName = cleanText(
                li.querySelector(".cardcolor_name")
                    ?.textContent || ""
            );

            if (!cardName) return;

            const level = extractLevel(text);

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

            const owned =
                intValue(
                    (
                        text.match(
                            /所持枚数[：:]\s*(\d+)枚/
                        ) || []
                    )[1],
                    null
                );

            const materialHint =
                (
                    text.match(
                        /「([^」]+)」で覚醒できます/
                    ) || []
                )[1] || "";

            rows.push({
                base_instance_id:
                    String(baseId),

                card_image_id:
                    imageCardId(li),

                card_name:
                    cardName,

                rarity_name:
                    extractRarity(text),

                level:
                    level.level,

                level_max:
                    level.level_max,

                cost:
                    extractCost(text),

                gender:
                    extractGender(text),

                growth_type:
                    extractGrowth(text),

                owned_count_site:
                    owned,

                awakening_count:
                    awakening,

                remaining_awakenings_site:
                    remaining,

                awakening_max_site:
                    awakening + remaining,

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

                check_url:
                    u.href
            });

            seen.add(baseId);
        });

        return rows;
    }

    function parseMaterials(doc) {
        const result = [];
        const seen = new Set();

        const body = cleanText(
            doc.body?.innerText || ""
        );

        const knownNames = [
            "キング転生らいおん",
            "転生らいおん",
            "とくぱん",
            "伝説のとくぱん",
            "船団長のとくぱん",
            "船長のとくぱん",
            "隊長のとくぱん",
            "下っ端のとくぱん",
            "したっぱのとくぱん",
            "酒のみのとくぱん",
            "旗もちのとくぱん"
        ];

        const anniversaryPattern =
            /[0-9０-９]+周年(?:記念)?とくぱん/g;

        const anniversaryNames =
            body.match(anniversaryPattern) || [];

        const names = Array.from(
            new Set([
                ...knownNames,
                ...anniversaryNames
            ])
        );

        for (const name of names) {
            if (seen.has(name)) continue;

            const escaped =
                name.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                );

            const patterns = [
                new RegExp(
                    escaped +
                    "[\\s\\S]{0,180}?もっている数\\s*[：:]\\s*([0-9,]+)"
                ),

                new RegExp(
                    escaped +
                    "[\\s\\S]{0,180}?所持(?:数|枚数)?\\s*[：:]?\\s*([0-9,]+)"
                )
            ];

            let count = null;

            for (const p of patterns) {
                const m = body.match(p);

                if (m) {
                    count = Number(
                        m[1].replace(/,/g, "")
                    );
                    break;
                }
            }

            if (count === null) continue;

            result.push({
                material_name: name,
                owned_count_site: count
            });

            seen.add(name);
        }

        return result;
    }

    function validatePage(section, page, items, doc) {
        if (section === "cards") {
            if (
                !doc.querySelector(
                    'a[href*="M=Card"][href*="A=Detail"]'
                )
            ) {
                return {
                    ok: false,
                    reason:
                        "Card Detailリンクなし"
                };
            }

            if (items.length === 0) {
                return {
                    ok: false,
                    reason:
                        "カード0件"
                };
            }
        }

        if (section === "stock") {
            if (
                !doc.querySelector(
                    "#page_cardpot_list_holderform_listview"
                )
            ) {
                return {
                    ok: false,
                    reason:
                        "ストック一覧DOMなし"
                };
            }

            if (items.length === 0) {
                return {
                    ok: false,
                    reason:
                        "ストック0件"
                };
            }
        }

        if (section === "composition") {
            if (items.length === 0) {
                return {
                    ok: false,
                    reason:
                        "覚醒対象0件"
                };
            }
        }

        return {
            ok: true,
            reason: ""
        };
    }

    function openDB() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(
                DB_NAME,
                DB_VERSION
            );

            req.onupgradeneeded = event => {
                const db =
                    event.target.result;

                if (
                    !db.objectStoreNames.contains(
                        "pages"
                    )
                ) {
                    db.createObjectStore(
                        "pages",
                        {
                            keyPath: "key"
                        }
                    );
                }

                if (
                    !db.objectStoreNames.contains(
                        "meta"
                    )
                ) {
                    db.createObjectStore(
                        "meta",
                        {
                            keyPath: "key"
                        }
                    );
                }
            };

            req.onsuccess = () =>
                resolve(req.result);

            req.onerror = () =>
                reject(req.error);
        });
    }

    async function dbPut(storeName, value) {
        const db = await openDB();

        return new Promise((resolve, reject) => {
            const tx =
                db.transaction(
                    storeName,
                    "readwrite"
                );

            tx.objectStore(storeName)
                .put(value);

            tx.oncomplete = () => {
                db.close();
                resolve();
            };

            tx.onerror = () => {
                const e = tx.error;
                db.close();
                reject(e);
            };
        });
    }

    async function dbGet(storeName, key) {
        const db = await openDB();

        return new Promise((resolve, reject) => {
            const tx =
                db.transaction(
                    storeName,
                    "readonly"
                );

            const req =
                tx.objectStore(storeName)
                    .get(key);

            req.onsuccess = () => {
                const value =
                    req.result || null;

                db.close();
                resolve(value);
            };

            req.onerror = () => {
                const e = req.error;
                db.close();
                reject(e);
            };
        });
    }

    async function dbGetAll(storeName) {
        const db = await openDB();

        return new Promise((resolve, reject) => {
            const tx =
                db.transaction(
                    storeName,
                    "readonly"
                );

            const req =
                tx.objectStore(storeName)
                    .getAll();

            req.onsuccess = () => {
                const value =
                    req.result || [];

                db.close();
                resolve(value);
            };

            req.onerror = () => {
                const e = req.error;
                db.close();
                reject(e);
            };
        });
    }

    function deleteDB() {
        return new Promise((resolve, reject) => {
            const req =
                indexedDB.deleteDatabase(
                    DB_NAME
                );

            req.onsuccess = () =>
                resolve();

            req.onerror = () =>
                reject(req.error);

            req.onblocked = () =>
                reject(
                    new Error(
                        "IndexedDB削除がブロックされました"
                    )
                );
        });
    }

    async function saveGlobalMeta(data) {
        await dbPut(
            "meta",
            {
                key: "global",
                ...data
            }
        );
    }

    async function loadGlobalMeta() {
        return (
            await dbGet(
                "meta",
                "global"
            )
        ) || {
            key: "global",
            version: VERSION,
            started_at:
                new Date().toISOString(),
            expected: {},
            max_pages: {},
            finished: false
        };
    }

    async function savePage(
        section,
        page,
        data
    ) {
        await dbPut(
            "pages",
            {
                key:
                    section + ":" + page,

                section:
                    section,

                page:
                    page,

                updated_at:
                    new Date().toISOString(),

                ...data
            }
        );
    }

    async function collectOnePage(
        section,
        page,
        baseUrl,
        parser
    ) {
        const url =
            makePageUrl(
                baseUrl,
                page
            );

        try {
            const doc =
                await fetchDoc(url);

            const items =
                parser(doc);

            const validation =
                validatePage(
                    section,
                    page,
                    items,
                    doc
                );

            const counts =
                extractNavbarCounts(doc);

            if (!validation.ok) {
                await savePage(
                    section,
                    page,
                    {
                        status: "failed",
                        url,
                        items: [],
                        item_count: 0,
                        error:
                            validation.reason,
                        navbar_counts:
                            counts
                    }
                );

                return false;
            }

            const extra = {};

            if (
                section === "composition" &&
                page === 0
            ) {
                extra.materials =
                    parseMaterials(doc);
            }

            await savePage(
                section,
                page,
                {
                    status: "ok",
                    url,
                    items,
                    item_count:
                        items.length,
                    error: null,
                    navbar_counts:
                        counts,
                    ...extra
                }
            );

            return true;

        } catch (e) {
            await savePage(
                section,
                page,
                {
                    status: "failed",
                    url,
                    items: [],
                    item_count: 0,
                    error:
                        String(
                            e?.message || e
                        )
                }
            );

            return false;
        }
    }

    async function prepareSection(
        section,
        baseUrl,
        moduleName,
        actionName
    ) {
        const doc =
            await fetchDoc(
                makePageUrl(baseUrl, 0)
            );

        const maxPage =
            detectMaxPage(
                doc,
                moduleName,
                actionName
            );

        const counts =
            extractNavbarCounts(doc);

        const meta =
            await loadGlobalMeta();

        meta.version =
            VERSION;

        meta.max_pages =
            meta.max_pages || {};

        meta.max_pages[section] =
            maxPage;

        meta.expected =
            meta.expected || {};

        if (
            counts.card_list_current !== null
        ) {
            meta.expected.card_list =
                counts.card_list_current;

            meta.expected.card_list_capacity =
                counts.card_list_capacity;
        }

        if (
            counts.stock_current !== null
        ) {
            meta.expected.stock =
                counts.stock_current;

            meta.expected.stock_capacity =
                counts.stock_capacity;
        }

        await saveGlobalMeta(meta);

        return {
            maxPage,
            firstDoc: doc
        };
    }

    async function collectSection(
        section,
        baseUrl,
        moduleName,
        actionName,
        parser,
        forceAll = false
    ) {
        const prep =
            await prepareSection(
                section,
                baseUrl,
                moduleName,
                actionName
            );

        const maxPage =
            prep.maxPage;

        for (
            let page = 0;
            page <= maxPage;
            page++
        ) {
            if (stopRequested) {
                return;
            }

            if (!forceAll) {
                const old =
                    await dbGet(
                        "pages",
                        section + ":" + page
                    );

                if (
                    old &&
                    old.status === "ok"
                ) {
                    await updatePanel();
                    continue;
                }
            }

            await collectOnePage(
                section,
                page,
                baseUrl,
                parser
            );

            await updatePanel();

            await sleep(PAGE_DELAY);
        }
    }

    function uniqueBy(
        rows,
        keyName
    ) {
        const map =
            new Map();

        for (const row of rows) {
            const key =
                row[keyName];

            if (!key) continue;

            if (!map.has(key)) {
                map.set(
                    key,
                    row
                );
            }
        }

        return Array.from(
            map.values()
        );
    }

    async function buildResult() {
        const pages =
            await dbGetAll("pages");

        const meta =
            await loadGlobalMeta();

        const cardPages =
            pages.filter(
                x =>
                    x.section === "cards" &&
                    x.status === "ok"
            );

        const stockPages =
            pages.filter(
                x =>
                    x.section === "stock" &&
                    x.status === "ok"
            );

        const compositionPages =
            pages.filter(
                x =>
                    x.section === "composition" &&
                    x.status === "ok"
            );

        const failedPages =
            pages
                .filter(
                    x =>
                        x.status === "failed"
                )
                .map(x => ({
                    section:
                        x.section,
                    page:
                        x.page,
                    url:
                        x.url,
                    error:
                        x.error
                }));

        const cards =
            uniqueBy(
                cardPages.flatMap(
                    x => x.items || []
                ),
                "instance_id"
            );

        const stock =
            uniqueBy(
                stockPages.flatMap(
                    x => x.items || []
                ),
                "instance_id"
            );

        const owned =
            uniqueBy(
                [
                    ...cards,
                    ...stock
                ],
                "instance_id"
            );

        const awakening =
            uniqueBy(
                compositionPages.flatMap(
                    x => x.items || []
                ),
                "base_instance_id"
            );

        let materials = [];

        for (const p of compositionPages) {
            if (
                Array.isArray(
                    p.materials
                ) &&
                p.materials.length
            ) {
                materials =
                    p.materials;
                break;
            }
        }

        const summaryMap =
            new Map();

        for (const row of owned) {
            const key =
                row.card_image_id
                    ? "img:" +
                      row.card_image_id
                    : "name:" +
                      row.card_name;

            if (!summaryMap.has(key)) {
                summaryMap.set(
                    key,
                    {
                        card_image_id:
                            row.card_image_id,

                        card_name:
                            row.card_name,

                        rarity_name:
                            row.rarity_name,

                        total_owned:
                            0,

                        card_list_owned:
                            0,

                        stock_owned:
                            0,

                        instance_ids:
                            []
                    }
                );
            }

            const x =
                summaryMap.get(key);

            x.total_owned++;

            if (
                row.location ===
                "card_list"
            ) {
                x.card_list_owned++;
            }

            if (
                row.location ===
                "stock"
            ) {
                x.stock_owned++;
            }

            x.instance_ids.push(
                row.instance_id
            );
        }

        const expectedCards =
            meta.expected?.card_list ??
            null;

        const expectedStock =
            meta.expected?.stock ??
            null;

        const cardCountMatch =
            expectedCards === null
                ? null
                : cards.length ===
                  expectedCards;

        const stockCountMatch =
            expectedStock === null
                ? null
                : stock.length ===
                  expectedStock;

        const maxPages =
            meta.max_pages || {};

        function countPageStatus(
            section
        ) {
            const rows =
                pages.filter(
                    x =>
                        x.section === section
                );

            return {
                ok:
                    rows.filter(
                        x =>
                            x.status === "ok"
                    ).length,

                failed:
                    rows.filter(
                        x =>
                            x.status === "failed"
                    ).length,

                expected_pages:
                    maxPages[section] ===
                    undefined
                        ? null
                        : maxPages[section] +
                          1
            };
        }

        const pageAudit = {
            cards:
                countPageStatus("cards"),

            stock:
                countPageStatus("stock"),

            composition:
                countPageStatus(
                    "composition"
                )
        };

        const allPageCountsComplete =
            ["cards", "stock", "composition"]
                .every(section => {
                    const x =
                        pageAudit[section];

                    return (
                        x.expected_pages !==
                            null &&
                        x.ok ===
                            x.expected_pages &&
                        x.failed === 0
                    );
                });

        const finished =
            failedPages.length === 0 &&
            cardCountMatch === true &&
            stockCountMatch === true &&
            allPageCountsComplete;

        return {
            meta: {
                version:
                    VERSION,

                exported_at:
                    new Date().toISOString(),

                source_origin:
                    ORIGIN,

                finished:
                    finished,

                card_list_count:
                    cards.length,

                card_list_expected:
                    expectedCards,

                card_list_count_match:
                    cardCountMatch,

                stock_count:
                    stock.length,

                stock_expected:
                    expectedStock,

                stock_count_match:
                    stockCountMatch,

                total_owned_instances:
                    owned.length,

                awakening_card_count:
                    awakening.length,

                material_type_count:
                    materials.length,

                failed_page_count:
                    failedPages.length
            },

            audit: {
                expected:
                    meta.expected || {},

                max_pages:
                    meta.max_pages || {},

                page_status:
                    pageAudit,

                failed_pages:
                    failedPages
            },

            owned_instances:
                owned,

            owned_summary:
                Array.from(
                    summaryMap.values()
                ),

            awakening_cards:
                awakening,

            awakening_materials:
                materials
        };
    }

    async function collectAll() {
        if (running) {
            alert(
                "すでに収集中です。"
            );
            return;
        }

        running = true;
        stopRequested = false;

        try {
            await collectSection(
                "cards",
                URLS.cards,
                "Card",
                "Default",
                parseCardList,
                false
            );

            if (!stopRequested) {
                await collectSection(
                    "stock",
                    URLS.stock,
                    "CardPot",
                    "List",
                    parseStock,
                    false
                );
            }

            if (!stopRequested) {
                await collectSection(
                    "composition",
                    URLS.composition,
                    "Composition",
                    "Default",
                    parseComposition,
                    false
                );
            }

            const result =
                await buildResult();

            if (stopRequested) {
                alert(
                    "停止しました。\n" +
                    "取得済みページは保存されています。"
                );
            } else if (result.meta.finished) {
                alert(
                    "収集完了\n\n" +
                    "カードリスト: " +
                    result.meta.card_list_count +
                    " / " +
                    result.meta.card_list_expected +
                    "\n" +
                    "ストック: " +
                    result.meta.stock_count +
                    " / " +
                    result.meta.stock_expected +
                    "\n" +
                    "合計: " +
                    result.meta.total_owned_instances +
                    "\n" +
                    "覚醒対象: " +
                    result.meta.awakening_card_count +
                    "\n" +
                    "失敗ページ: 0"
                );
            } else {
                alert(
                    "収集は一巡しましたが監査未完了です。\n\n" +
                    "カードリスト: " +
                    result.meta.card_list_count +
                    " / " +
                    result.meta.card_list_expected +
                    "\n" +
                    "ストック: " +
                    result.meta.stock_count +
                    " / " +
                    result.meta.stock_expected +
                    "\n" +
                    "失敗ページ: " +
                    result.meta.failed_page_count +
                    "\n\n" +
                    "「失敗・不一致を再取得」を実行してください。"
                );
            }

        } catch (e) {
            alert(
                "処理エラー\n\n" +
                String(
                    e?.message || e
                )
            );
        } finally {
            running = false;
            await updatePanel();
        }
    }

    async function retryFailedOrMismatch() {
        if (running) {
            alert(
                "すでに収集中です。"
            );
            return;
        }

        running = true;
        stopRequested = false;

        try {
            let result =
                await buildResult();

            const pages =
                await dbGetAll("pages");

            const failedSections =
                new Set(
                    pages
                        .filter(
                            x =>
                                x.status ===
                                "failed"
                        )
                        .map(
                            x =>
                                x.section
                        )
                );

            if (
                result.meta.card_list_count_match !==
                true
            ) {
                failedSections.add(
                    "cards"
                );
            }

            if (
                result.meta.stock_count_match !==
                true
            ) {
                failedSections.add(
                    "stock"
                );
            }

            if (
                result.audit.page_status
                    .composition.failed > 0
            ) {
                failedSections.add(
                    "composition"
                );
            }

            if (
                failedSections.size === 0
            ) {
                alert(
                    "再取得対象はありません。"
                );
                return;
            }

            if (
                failedSections.has(
                    "cards"
                )
            ) {
                await collectSection(
                    "cards",
                    URLS.cards,
                    "Card",
                    "Default",
                    parseCardList,
                    true
                );
            }

            if (
                !stopRequested &&
                failedSections.has(
                    "stock"
                )
            ) {
                await collectSection(
                    "stock",
                    URLS.stock,
                    "CardPot",
                    "List",
                    parseStock,
                    true
                );
            }

            if (
                !stopRequested &&
                failedSections.has(
                    "composition"
                )
            ) {
                await collectSection(
                    "composition",
                    URLS.composition,
                    "Composition",
                    "Default",
                    parseComposition,
                    true
                );
            }

            result =
                await buildResult();

            alert(
                "再取得完了\n\n" +
                "カードリスト: " +
                result.meta.card_list_count +
                " / " +
                result.meta.card_list_expected +
                "\n" +
                "ストック: " +
                result.meta.stock_count +
                " / " +
                result.meta.stock_expected +
                "\n" +
                "失敗ページ: " +
                result.meta.failed_page_count +
                "\n" +
                "finished: " +
                result.meta.finished
            );

        } catch (e) {
            alert(
                "再取得エラー\n\n" +
                String(
                    e?.message || e
                )
            );
        } finally {
            running = false;
            await updatePanel();
        }
    }

    function downloadJSON(
        data,
        filename
    ) {
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
            URL.createObjectURL(
                blob
            );

        const a =
            document.createElement(
                "a"
            );

        a.href = url;
        a.download = filename;

        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(
            () =>
                URL.revokeObjectURL(
                    url
                ),
            2000
        );
    }

    async function exportResult() {
        const result =
            await buildResult();

        downloadJSON(
            result,
            "jolly_user_inventory_raw_v2.json"
        );
    }

    async function resetAll() {
        if (
            !confirm(
                "v2の収集済みデータを全削除しますか？"
            )
        ) {
            return;
        }

        try {
            await deleteDB();

            alert(
                "v2データを削除しました。"
            );

            await updatePanel();

        } catch (e) {
            alert(
                "削除失敗\n" +
                String(
                    e?.message || e
                )
            );
        }
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

    function removePanel() {
        document
            .getElementById(
                "jolly_inventory_v2_panel"
            )
            ?.remove();
    }

    async function updatePanel() {
        const info =
            document.getElementById(
                "jolly_inventory_v2_info"
            );

        if (!info) return;

        try {
            const result =
                await buildResult();

            const a =
                result.audit.page_status;

            info.innerHTML =
                "<b>JOLLY 育成データ収集 v2</b><br><br>" +

                "カード: " +
                result.meta.card_list_count +
                " / " +
                (
                    result.meta.card_list_expected ??
                    "?"
                ) +
                "　pages " +
                a.cards.ok +
                "/" +
                (
                    a.cards.expected_pages ??
                    "?"
                ) +
                "<br>" +

                "ストック: " +
                result.meta.stock_count +
                " / " +
                (
                    result.meta.stock_expected ??
                    "?"
                ) +
                "　pages " +
                a.stock.ok +
                "/" +
                (
                    a.stock.expected_pages ??
                    "?"
                ) +
                "<br>" +

                "覚醒対象: " +
                result.meta.awakening_card_count +
                "　pages " +
                a.composition.ok +
                "/" +
                (
                    a.composition.expected_pages ??
                    "?"
                ) +
                "<br>" +

                "失敗ページ: " +
                result.meta.failed_page_count +
                "<br>" +

                "finished: " +
                result.meta.finished;

        } catch (_) {
            info.innerHTML =
                "<b>JOLLY 育成データ収集 v2</b><br>" +
                "未収集";
        }
    }

    removePanel();

    const panel =
        document.createElement(
            "div"
        );

    panel.id =
        "jolly_inventory_v2_panel";

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
        document.createElement(
            "div"
        );

    info.id =
        "jolly_inventory_v2_info";

    panel.appendChild(info);

    const start =
        makeButton(
            "全件収集 / 続きから"
        );

    start.onclick =
        collectAll;

    panel.appendChild(start);

    const retry =
        makeButton(
            "失敗・不一致を再取得"
        );

    retry.onclick =
        retryFailedOrMismatch;

    panel.appendChild(retry);

    const stop =
        makeButton(
            "停止"
        );

    stop.onclick =
        function () {
            stopRequested = true;
        };

    panel.appendChild(stop);

    const save =
        makeButton(
            "現在までのJSONを保存"
        );

    save.onclick =
        exportResult;

    panel.appendChild(save);

    const reset =
        makeButton(
            "v2データを全リセット"
        );

    reset.onclick =
        resetAll;

    panel.appendChild(reset);

    const close =
        makeButton(
            "閉じる"
        );

    close.onclick =
        removePanel;

    panel.appendChild(close);

    document.body.appendChild(
        panel
    );

    updatePanel();
})();
