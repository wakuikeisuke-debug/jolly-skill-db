(function () {
    "use strict";

    const VERSION = "jolly-inventory-probe-1.0";

    const KEYWORDS = [
        "覚醒",
        "覚醒合成",
        "合成",
        "強化",
        "所持",
        "所持カード",
        "カード一覧",
        "カード",
        "デッキ",
        "アルバム",
        "とくぱん",
        "周年とくぱん",
        "伝説のとくぱん",
        "下っ端のとくぱん",
        "レア",
        "レアリティ",
        "素材"
    ];

    function cleanText(value) {
        return String(value || "")
            .replace(/\u00a0/g, " ")
            .replace(/[ \t]+/g, " ")
            .replace(/\n\s*\n+/g, "\n")
            .trim();
    }

    function shortText(value, maxLength) {
        const t = cleanText(value);
        if (t.length <= maxLength) return t;
        return t.slice(0, maxLength) + "…";
    }

    function absoluteUrl(value) {
        if (!value) return "";
        try {
            return new URL(value, location.href).href;
        } catch (e) {
            return String(value);
        }
    }

    function dataAttributes(el) {
        const out = {};

        if (!el || !el.attributes) {
            return out;
        }

        for (const attr of el.attributes) {
            if (attr.name.indexOf("data-") === 0) {
                out[attr.name] = attr.value;
            }
        }

        return out;
    }

    function elementInfo(el) {
        if (!el) return null;

        const info = {
            tag: el.tagName || "",
            id: el.id || "",
            class_name:
                typeof el.className === "string"
                    ? el.className
                    : "",
            text: shortText(el.innerText || el.textContent || "", 500),
            data: dataAttributes(el)
        };

        if (el.href) {
            info.href = absoluteUrl(el.href);
        }

        if (el.src) {
            info.src = absoluteUrl(el.src);
        }

        if (el.name) {
            info.name = el.name;
        }

        if (el.value !== undefined &&
            ["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName)) {
            info.value = String(el.value || "");
        }

        return info;
    }

    function keywordScore(text) {
        const t = cleanText(text);
        let score = 0;
        const hits = [];

        for (const word of KEYWORDS) {
            if (t.indexOf(word) !== -1) {
                score++;
                hits.push(word);
            }
        }

        return {
            score: score,
            hits: hits
        };
    }

    function collectLinks() {
        const rows = [];

        document.querySelectorAll("a[href]").forEach(function (a) {
            const href = absoluteUrl(a.getAttribute("href"));
            const text = cleanText(a.innerText || a.textContent || "");

            const k = keywordScore(text + " " + href);

            let urlInfo = {};

            try {
                const u = new URL(href);

                const params = {};

                for (const pair of u.searchParams.entries()) {
                    params[pair[0]] = pair[1];
                }

                urlInfo = {
                    pathname: u.pathname,
                    search: u.search,
                    params: params
                };
            } catch (e) {
                urlInfo = {};
            }

            if (
                k.score > 0 ||
                /Card|Deck|Awake|Evolution|Combine|Fusion|Material|Album/i.test(href)
            ) {
                rows.push({
                    text: shortText(text, 200),
                    href: href,
                    keyword_score: k.score,
                    keyword_hits: k.hits,
                    url_info: urlInfo
                });
            }
        });

        const seen = new Set();

        return rows
            .filter(function (row) {
                const key = row.href + "|" + row.text;

                if (seen.has(key)) {
                    return false;
                }

                seen.add(key);
                return true;
            })
            .sort(function (a, b) {
                return b.keyword_score - a.keyword_score;
            })
            .slice(0, 500);
    }

    function collectForms() {
        return Array.from(document.forms).map(function (form, index) {
            const controls = [];

            form.querySelectorAll("input,select,textarea,button").forEach(function (el) {
                const row = {
                    tag: el.tagName,
                    type: el.type || "",
                    name: el.name || "",
                    id: el.id || "",
                    class_name:
                        typeof el.className === "string"
                            ? el.className
                            : "",
                    value:
                        el.value !== undefined
                            ? shortText(String(el.value), 300)
                            : "",
                    text: shortText(el.innerText || "", 200),
                    checked:
                        el.type === "checkbox" || el.type === "radio"
                            ? !!el.checked
                            : undefined,
                    data: dataAttributes(el)
                };

                controls.push(row);
            });

            return {
                index: index,
                action: absoluteUrl(form.getAttribute("action") || location.href),
                method: (form.method || "GET").toUpperCase(),
                id: form.id || "",
                class_name:
                    typeof form.className === "string"
                        ? form.className
                        : "",
                controls: controls
            };
        });
    }

    function collectTables() {
        const tables = [];

        document.querySelectorAll("table").forEach(function (table, tableIndex) {
            const rows = [];

            table.querySelectorAll("tr").forEach(function (tr, rowIndex) {
                if (rowIndex >= 100) return;

                const cells = [];

                tr.querySelectorAll("th,td").forEach(function (cell) {
                    cells.push(
                        shortText(cell.innerText || cell.textContent || "", 500)
                    );
                });

                const links = Array.from(tr.querySelectorAll("a[href]"))
                    .map(function (a) {
                        return {
                            text: shortText(a.innerText || "", 100),
                            href: absoluteUrl(a.href)
                        };
                    })
                    .slice(0, 20);

                if (cells.length || links.length) {
                    rows.push({
                        row_index: rowIndex,
                        cells: cells,
                        links: links
                    });
                }
            });

            tables.push({
                table_index: tableIndex,
                id: table.id || "",
                class_name:
                    typeof table.className === "string"
                        ? table.className
                        : "",
                rows: rows
            });
        });

        return tables;
    }

    function collectRelevantElements() {
        const selectors = [
            '[class*="card" i]',
            '[id*="card" i]',
            '[class*="awake" i]',
            '[id*="awake" i]',
            '[class*="evol" i]',
            '[id*="evol" i]',
            '[class*="fusion" i]',
            '[id*="fusion" i]',
            '[class*="combine" i]',
            '[id*="combine" i]',
            '[class*="material" i]',
            '[id*="material" i]',
            '[class*="stock" i]',
            '[id*="stock" i]',
            '[class*="owned" i]',
            '[id*="owned" i]',
            '[class*="rare" i]',
            '[id*="rare" i]'
        ];

        const found = new Set();
        const out = [];

        for (const selector of selectors) {
            let elements = [];

            try {
                elements = document.querySelectorAll(selector);
            } catch (e) {
                continue;
            }

            elements.forEach(function (el) {
                if (found.has(el)) return;
                found.add(el);

                out.push(elementInfo(el));
            });
        }

        return out.slice(0, 1000);
    }

    function collectKeywordElements() {
        const out = [];
        const seen = new Set();

        const elements = document.querySelectorAll(
            "body *"
        );

        for (const el of elements) {
            if (out.length >= 500) {
                break;
            }

            if (
                ["SCRIPT", "STYLE", "NOSCRIPT", "SVG"].includes(el.tagName)
            ) {
                continue;
            }

            const text = cleanText(
                el.innerText || el.textContent || ""
            );

            if (!text || text.length > 1500) {
                continue;
            }

            const k = keywordScore(text);

            if (!k.score) {
                continue;
            }

            const key =
                el.tagName +
                "|" +
                el.id +
                "|" +
                el.className +
                "|" +
                text;

            if (seen.has(key)) {
                continue;
            }

            seen.add(key);

            const info = elementInfo(el);
            info.keyword_hits = k.hits;
            info.keyword_score = k.score;

            out.push(info);
        }

        out.sort(function (a, b) {
            return b.keyword_score - a.keyword_score;
        });

        return out;
    }

    function collectImages() {
        return Array.from(
            document.querySelectorAll("img")
        )
            .map(function (img) {
                const parentText =
                    img.parentElement
                        ? img.parentElement.innerText || ""
                        : "";

                return {
                    src: absoluteUrl(
                        img.currentSrc ||
                        img.src ||
                        img.getAttribute("src")
                    ),
                    alt: img.alt || "",
                    title: img.title || "",
                    class_name:
                        typeof img.className === "string"
                            ? img.className
                            : "",
                    parent_text: shortText(parentText, 300),
                    data: dataAttributes(img)
                };
            })
            .slice(0, 1000);
    }

    function collectHiddenInputs() {
        return Array.from(
            document.querySelectorAll('input[type="hidden"]')
        ).map(function (input) {
            return {
                name: input.name || "",
                id: input.id || "",
                value: shortText(input.value || "", 500)
            };
        });
    }

    function buildProbe() {
        return {
            meta: {
                version: VERSION,
                collected_at: new Date().toISOString(),
                url: location.href,
                title: document.title,
                origin: location.origin
            },

            page: {
                body_text: shortText(
                    document.body ? document.body.innerText : "",
                    50000
                ),
                body_class:
                    document.body &&
                    typeof document.body.className === "string"
                        ? document.body.className
                        : ""
            },

            candidate_links: collectLinks(),
            forms: collectForms(),
            tables: collectTables(),
            relevant_elements: collectRelevantElements(),
            keyword_elements: collectKeywordElements(),
            hidden_inputs: collectHiddenInputs(),
            images: collectImages()
        };
    }

    function jsonText(data) {
        return JSON.stringify(data, null, 2);
    }

    function saveJson(data) {
        const blob = new Blob(
            [jsonText(data)],
            {
                type: "application/json;charset=utf-8"
            }
        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "jolly_inventory_probe.json";

        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(function () {
            URL.revokeObjectURL(url);
        }, 2000);
    }

    async function copyJson(data) {
        const text = jsonText(data);

        try {
            await navigator.clipboard.writeText(text);
            alert("調査JSONをコピーしました。");
        } catch (e) {
            prompt(
                "コピーできなかったため、下記をコピーしてください。",
                text
            );
        }
    }

    function removeOldPanel() {
        const old = document.getElementById(
            "jolly_inventory_probe_panel"
        );

        if (old) {
            old.remove();
        }
    }

    function makeButton(text) {
        const button = document.createElement("button");

        button.textContent = text;

        button.style.cssText = [
            "display:block",
            "width:100%",
            "box-sizing:border-box",
            "margin:6px 0",
            "padding:11px 8px",
            "border:0",
            "border-radius:8px",
            "font-size:14px",
            "font-weight:bold",
            "background:#fff",
            "color:#111"
        ].join(";");

        return button;
    }

    removeOldPanel();

    const data = buildProbe();

    window.JOLLY_INVENTORY_PROBE = data;

    const panel = document.createElement("div");

    panel.id = "jolly_inventory_probe_panel";

    panel.style.cssText = [
        "position:fixed",
        "left:8px",
        "right:8px",
        "bottom:8px",
        "z-index:2147483647",
        "background:rgba(20,20,20,.96)",
        "color:#fff",
        "padding:12px",
        "border-radius:12px",
        "box-shadow:0 2px 12px rgba(0,0,0,.5)",
        "font-family:-apple-system,BlinkMacSystemFont,sans-serif",
        "font-size:13px",
        "max-height:45vh",
        "overflow:auto"
    ].join(";");

    const title = document.createElement("div");

    title.innerHTML =
        "<b>JOLLY 所持・覚醒 調査</b><br>" +
        "候補リンク: " +
        data.candidate_links.length +
        " / form: " +
        data.forms.length +
        " / table: " +
        data.tables.length +
        " / keyword: " +
        data.keyword_elements.length;

    panel.appendChild(title);

    const saveButton = makeButton(
        "調査JSONを保存"
    );

    saveButton.onclick = function () {
        saveJson(data);
    };

    panel.appendChild(saveButton);

    const copyButton = makeButton(
        "調査JSONをコピー"
    );

    copyButton.onclick = function () {
        copyJson(data);
    };

    panel.appendChild(copyButton);

    const linksButton = makeButton(
        "候補リンクを表示"
    );

    linksButton.onclick = function () {
        const text = data.candidate_links
            .slice(0, 100)
            .map(function (row, i) {
                return (
                    (i + 1) +
                    ". " +
                    row.text +
                    "\n" +
                    row.href
                );
            })
            .join("\n\n");

        alert(
            text ||
            "関連候補リンクは検出されませんでした。"
        );
    };

    panel.appendChild(linksButton);

    const closeButton = makeButton(
        "閉じる"
    );

    closeButton.onclick = function () {
        panel.remove();
    };

    panel.appendChild(closeButton);

    document.body.appendChild(panel);
})();
