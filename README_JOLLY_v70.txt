JOLLY DB v7.0 所有・技玉・アイテム統合版

【配置】
同じフォルダに次の構成で置いてください。

index.html
jolly_card_db_latest.json
training/
  jolly_user_inventory_raw_v2.json
  jolly_owned_current_skills.json
  jolly_user_skillballs.json
  jolly_user_items.json

既存の training/user_inventory.json がある場合は、そのまま残して構いません。
なくてもv7.0は動作し、所有個体・覚醒・現在技・技玉・アイテムを表示します。

【追加機能】
・所有個体タブ：716個体を個体ID、配置、保護、覚醒、現在技で検索・絞り込み
・カード詳細：該当カードの所有個体と現在技を表示
・技玉タブ：203種類・420個の所持技玉と装着条件を検索
・アイテムタブ：149種類・4421個をカテゴリ検索し、専用対象カードへ移動
・現在技：カード一覧674個体は取得済み。倉庫42個体は「取得元未確立」と明示
・技玉装着：確定分類だけを表示し、未分類の追加技を技玉と推定しない

【a-Shell】
file:// で直接開かず、これまでと同じローカルHTTPサーバー経由で index.html を開いてください。
JSONの一部が欠けても、カードDB本体があれば既存タブは動作します。

【更新日】
2026-09-16
