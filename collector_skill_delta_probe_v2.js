
(() => {
  'use strict';

  const VERSION =
    'jolly-skill-delta-probe-2.1';

  const STATE_KEY =
    'JOLLY_SKILL_DELTA_STATE_V2';

  const SKILL_BASELINE =
{"1440":{"skill_id":"1440","skill_name":"【戦】ソウルテリトリー"},"1436":{"skill_id":"1436","skill_name":"【獣】ソウルテリトリー"},"1429":{"skill_id":"1429","skill_name":"【飛】ソウルテリトリー"},"1443":{"skill_id":"1443","skill_name":"【魔】ソウルテリトリー"},"1428":{"skill_id":"1428","skill_name":"お花見だんご"},"1458":{"skill_id":"1458","skill_name":"もてなしの魔法"},"1417":{"skill_id":"1417","skill_name":"アナラプティック"},"1442":{"skill_id":"1442","skill_name":"インプルーブ"},"1414":{"skill_id":"1414","skill_name":"エナジーギフト"},"1376":{"skill_id":"1376","skill_name":"エースパイロット"},"1425":{"skill_id":"1425","skill_name":"カーポ・リンフォルツォ"},"1431":{"skill_id":"1431","skill_name":"ガン・サルート"},"1541":{"skill_id":"1541","skill_name":"クイックサービス"},"1342":{"skill_id":"1342","skill_name":"クオリティアップ"},"1324":{"skill_id":"1324","skill_name":"クラフトブースター"},"1336":{"skill_id":"1336","skill_name":"クリエイトブースター"},"1319":{"skill_id":"1319","skill_name":"グルディン式訓練"},"1453":{"skill_id":"1453","skill_name":"グレイスドロップ"},"1432":{"skill_id":"1432","skill_name":"サプライシップ"},"1512":{"skill_id":"1512","skill_name":"サマークイーン"},"1545":{"skill_id":"1545","skill_name":"スカイハイ"},"101503":{"skill_id":"101503","skill_name":"スピードウィンド"},"1536":{"skill_id":"1536","skill_name":"スピードブースト"},"1542":{"skill_id":"1542","skill_name":"スピードロック"},"1544":{"skill_id":"1544","skill_name":"スプリングウィンズ"},"1532":{"skill_id":"1532","skill_name":"スプリングブリーズ"},"1415":{"skill_id":"1415","skill_name":"ソウルディバイド"},"1422":{"skill_id":"1422","skill_name":"チアフルトーン"},"7559":{"skill_id":"7559","skill_name":"チアーアシスト"},"7558":{"skill_id":"7558","skill_name":"チアーアップ"},"7561":{"skill_id":"7561","skill_name":"チアーパッション"},"7560":{"skill_id":"7560","skill_name":"チアーブースター"},"1331":{"skill_id":"1331","skill_name":"ハイテンション"},"1423":{"skill_id":"1423","skill_name":"ハッピーハロウィン"},"1464":{"skill_id":"1464","skill_name":"バイタルデュー"},"1465":{"skill_id":"1465","skill_name":"バイタルドロップ"},"1457":{"skill_id":"1457","skill_name":"バイタルブースト"},"1310":{"skill_id":"1310","skill_name":"パワーアシスト"},"1346":{"skill_id":"1346","skill_name":"パワーブースト"},"1466":{"skill_id":"1466","skill_name":"パーティナイト"},"101504":{"skill_id":"101504","skill_name":"ビッグウェーブ"},"1460":{"skill_id":"1460","skill_name":"ビビッドサマー"},"1459":{"skill_id":"1459","skill_name":"ファイア・サルート"},"101502":{"skill_id":"101502","skill_name":"ファストウィンド"},"1538":{"skill_id":"1538","skill_name":"ファストサービス"},"1508":{"skill_id":"1508","skill_name":"ファストハッピー"},"1540":{"skill_id":"1540","skill_name":"ファストペイント"},"1448":{"skill_id":"1448","skill_name":"ファティリティ"},"1477":{"skill_id":"1477","skill_name":"ファータイルネス"},"1470":{"skill_id":"1470","skill_name":"フレッシュサマー"},"1469":{"skill_id":"1469","skill_name":"ブライダルギフト"},"1318":{"skill_id":"1318","skill_name":"ブラッシュアップ"},"1424":{"skill_id":"1424","skill_name":"プシュケディバイド"},"1523":{"skill_id":"1523","skill_name":"ペースアップ"},"1327":{"skill_id":"1327","skill_name":"マリンアシスト"},"1473":{"skill_id":"1473","skill_name":"メディカルレシピ"},"1439":{"skill_id":"1439","skill_name":"ラブリーハロウィン"},"101402":{"skill_id":"101402","skill_name":"リーインフォース"},"1520":{"skill_id":"1520","skill_name":"ワンダフルダッシュ"},"1519":{"skill_id":"1519","skill_name":"ワンダフルラン"},"1445":{"skill_id":"1445","skill_name":"ヴィータ・リンフォルツォ"},"1401":{"skill_id":"1401","skill_name":"体+10"},"1420":{"skill_id":"1420","skill_name":"体+1000"},"1402":{"skill_id":"1402","skill_name":"体+20"},"1444":{"skill_id":"1444","skill_name":"体+2000"},"1403":{"skill_id":"1403","skill_name":"体+30"},"1404":{"skill_id":"1404","skill_name":"体+40"},"1405":{"skill_id":"1405","skill_name":"体+50"},"1406":{"skill_id":"1406","skill_name":"体+60"},"1407":{"skill_id":"1407","skill_name":"体+70"},"1449":{"skill_id":"1449","skill_name":"健剛"},"101501":{"skill_id":"101501","skill_name":"光翼の加護"},"1472":{"skill_id":"1472","skill_name":"勇健の恩恵"},"1430":{"skill_id":"1430","skill_name":"勇健の祝福"},"1320":{"skill_id":"1320","skill_name":"勇壮なる行進曲"},"1516":{"skill_id":"1516","skill_name":"勝戦舞踊"},"1364":{"skill_id":"1364","skill_name":"勝鬨"},"1433":{"skill_id":"1433","skill_name":"命の薬"},"101302":{"skill_id":"101302","skill_name":"喊声"},"1511":{"skill_id":"1511","skill_name":"夏風の瞬攻"},"1539":{"skill_id":"1539","skill_name":"天翔之唄"},"101304":{"skill_id":"101304","skill_name":"奮戦の地鳴き"},"1525":{"skill_id":"1525","skill_name":"妖精の加護"},"1456":{"skill_id":"1456","skill_name":"寵愛のアソート"},"1447":{"skill_id":"1447","skill_name":"強壮の湯"},"1427":{"skill_id":"1427","skill_name":"強壮の狂詩曲"},"1462":{"skill_id":"1462","skill_name":"強壮の魔薬"},"1408":{"skill_id":"1408","skill_name":"応援"},"1546":{"skill_id":"1546","skill_name":"快進の粉"},"1421":{"skill_id":"1421","skill_name":"恵命の心"},"1329":{"skill_id":"1329","skill_name":"戦人の猛り"},"1515":{"skill_id":"1515","skill_name":"戦舞踊"},"1518":{"skill_id":"1518","skill_name":"持久戦"},"101303":{"skill_id":"101303","skill_name":"攀竜附驥"},"1301":{"skill_id":"1301","skill_name":"攻+10"},"1325":{"skill_id":"1325","skill_name":"攻+1000"},"1302":{"skill_id":"1302","skill_name":"攻+20"},"1341":{"skill_id":"1341","skill_name":"攻+2000"},"1303":{"skill_id":"1303","skill_name":"攻+30"},"1304":{"skill_id":"1304","skill_name":"攻+40"},"1305":{"skill_id":"1305","skill_name":"攻+50"},"1306":{"skill_id":"1306","skill_name":"攻+60"},"1307":{"skill_id":"1307","skill_name":"攻+70"},"101401":{"skill_id":"101401","skill_name":"星廻の微光"},"1467":{"skill_id":"1467","skill_name":"星廻の恩恵"},"1435":{"skill_id":"1435","skill_name":"晩夏の候"},"1461":{"skill_id":"1461","skill_name":"活命の妙薬"},"1418":{"skill_id":"1418","skill_name":"活命の狂詩曲"},"1455":{"skill_id":"1455","skill_name":"深愛のアソート"},"1446":{"skill_id":"1446","skill_name":"滋養の湯"},"101305":{"skill_id":"101305","skill_name":"激戦の地鳴き"},"7662":{"skill_id":"7662","skill_name":"王選候補者"},"101306":{"skill_id":"101306","skill_name":"瑞春の舞い"},"1441":{"skill_id":"1441","skill_name":"生命の抗導"},"1434":{"skill_id":"1434","skill_name":"生命の霊薬"},"1381":{"skill_id":"1381","skill_name":"相愛パラダイス"},"1527":{"skill_id":"1527","skill_name":"瞬光"},"1524":{"skill_id":"1524","skill_name":"瞬神の祈り"},"1308":{"skill_id":"1308","skill_name":"砲撃手"},"101301":{"skill_id":"101301","skill_name":"砲術神"},"1543":{"skill_id":"1543","skill_name":"節振舞"},"1534":{"skill_id":"1534","skill_name":"耐久戦"},"1548":{"skill_id":"1548","skill_name":"輝翼の加護"},"101505":{"skill_id":"101505","skill_name":"迅足"},"1533":{"skill_id":"1533","skill_name":"追い風"},"1501":{"skill_id":"1501","skill_name":"速+10"},"1509":{"skill_id":"1509","skill_name":"速+1000"},"1502":{"skill_id":"1502","skill_name":"速+20"},"1531":{"skill_id":"1531","skill_name":"速+2000"},"1503":{"skill_id":"1503","skill_name":"速+30"},"1513":{"skill_id":"1513","skill_name":"速+3000"},"1504":{"skill_id":"1504","skill_name":"速+40"},"1505":{"skill_id":"1505","skill_name":"速+50"},"1506":{"skill_id":"1506","skill_name":"速+60"},"1507":{"skill_id":"1507","skill_name":"速+70"},"1338":{"skill_id":"1338","skill_name":"闇への行進"},"1526":{"skill_id":"1526","skill_name":"順風満帆"},"307":{"skill_id":"307","skill_name":"うずしお"},"332":{"skill_id":"332","skill_name":"アル・シャマク"},"315":{"skill_id":"315","skill_name":"ウォーク・ダウン"},"306":{"skill_id":"306","skill_name":"シャッターチャンス"},"309":{"skill_id":"309","skill_name":"シュロスアングリフ"},"317":{"skill_id":"317","skill_name":"バックアタック"},"313":{"skill_id":"313","skill_name":"ヘヴィーボックス"},"305":{"skill_id":"305","skill_name":"ミッシングブラー"},"304":{"skill_id":"304","skill_name":"モーションロック"},"308":{"skill_id":"308","skill_name":"ロアリングロック"},"310":{"skill_id":"310","skill_name":"ロック・ドール"},"318":{"skill_id":"318","skill_name":"ロングトレーン"},"100302":{"skill_id":"100302","skill_name":"契約成立"},"314":{"skill_id":"314","skill_name":"拘繋"},"319":{"skill_id":"319","skill_name":"揺船"},"302":{"skill_id":"302","skill_name":"束縛"},"316":{"skill_id":"316","skill_name":"狂騒のギャロップ"},"301":{"skill_id":"301","skill_name":"突撃"},"100301":{"skill_id":"100301","skill_name":"逃がさない取引"},"303":{"skill_id":"303","skill_name":"連戦"},"1311":{"skill_id":"1311","skill_name":"【ボニー&メアリー】加勢"},"1309":{"skill_id":"1309","skill_name":"【名前】加勢"},"1903":{"skill_id":"1903","skill_name":"【名前】守護"},"1911":{"skill_id":"1911","skill_name":"【名前】護衛"},"750":{"skill_id":"750","skill_name":"【名前】陣頭指揮"},"1363":{"skill_id":"1363","skill_name":"ごほうびプリン【名前】"},"917":{"skill_id":"917","skill_name":"キャットクロー【大海賊ワドル】"},"796":{"skill_id":"796","skill_name":"サマーカーニバル【名前】"},"1535":{"skill_id":"1535","skill_name":"シー・ウィンズ【名前】"},"1521":{"skill_id":"1521","skill_name":"シー・ブリーズ【名前】"},"1917":{"skill_id":"1917","skill_name":"ジャックポット【名前】"},"916":{"skill_id":"916","skill_name":"スイート・トリート【名前】"},"1529":{"skill_id":"1529","skill_name":"スウィング・キャロル【名前】"},"1528":{"skill_id":"1528","skill_name":"スウィング・ノエル【名前】"},"794":{"skill_id":"794","skill_name":"スプラッシュフィーバー【疾風のラカム】"},"959":{"skill_id":"959","skill_name":"スプラッシュフェスタ【疾風のラカム】"},"918":{"skill_id":"918","skill_name":"ドッグファング【ニャッカ船長】"},"935":{"skill_id":"935","skill_name":"ハニー・トリート【名前】"},"2585":{"skill_id":"2585","skill_name":"バーンズウィップ"},"1921":{"skill_id":"1921","skill_name":"フォトンチャージ【名前】"},"905":{"skill_id":"905","skill_name":"フラッペレーザー【名前】"},"1416":{"skill_id":"1416","skill_name":"ブラッディギフト【名前】"},"1463":{"skill_id":"1463","skill_name":"ブラッディシナジー【名前】"},"915":{"skill_id":"915","skill_name":"ブラッディナース【名前】"},"7664":{"skill_id":"7664","skill_name":"マナの供給【ナツキ・スバル】"},"1918":{"skill_id":"1918","skill_name":"ムーンエナジー【名前】"},"1906":{"skill_id":"1906","skill_name":"モード・プリムラ【古代魔砲のアリッサ】"},"702":{"skill_id":"702","skill_name":"一心【名前】"},"703":{"skill_id":"703","skill_name":"不仲【名前】"},"1323":{"skill_id":"1323","skill_name":"伝授アンチブロッカー【名前】"},"1362":{"skill_id":"1362","skill_name":"伝授グローアップ【名前】"},"1328":{"skill_id":"1328","skill_name":"伝授シャイニーアイ【名前】"},"1332":{"skill_id":"1332","skill_name":"伝授デモンズコーラス【名前】"},"1904":{"skill_id":"1904","skill_name":"伝授フレイムアーマー【名前】"},"1908":{"skill_id":"1908","skill_name":"伝授フレイムドレス【名前】"},"1356":{"skill_id":"1356","skill_name":"伝授ブルズアイショットガン【名前】"},"1322":{"skill_id":"1322","skill_name":"伝授ヘヴィクルーエル【名前】"},"1313":{"skill_id":"1313","skill_name":"伝授ヘヴィショット【名前】"},"1321":{"skill_id":"1321","skill_name":"伝授ベリーダンス【名前】"},"1355":{"skill_id":"1355","skill_name":"伝授ランページ【名前】"},"1317":{"skill_id":"1317","skill_name":"伝授レーザーショット【名前】"},"1312":{"skill_id":"1312","skill_name":"伝授一刀両断【名前】"},"1330":{"skill_id":"1330","skill_name":"伝授一閃【弐式】【名前】"},"100703":{"skill_id":"100703","skill_name":"伝授二刀両断【名前】"},"1905":{"skill_id":"1905","skill_name":"伝授力転の舞【名前】"},"1315":{"skill_id":"1315","skill_name":"伝授治療【名前】"},"1314":{"skill_id":"1314","skill_name":"伝授活眼【名前】"},"1334":{"skill_id":"1334","skill_name":"伝授竜海の薬【名前】"},"1902":{"skill_id":"1902","skill_name":"伝授聖獣の加護【名前】"},"1335":{"skill_id":"1335","skill_name":"伝授黒真珠BOMB【名前】"},"1316":{"skill_id":"1316","skill_name":"伝授３乱射【名前】"},"100705":{"skill_id":"100705","skill_name":"伝授３乱殲【名前】"},"1361":{"skill_id":"1361","skill_name":"伝授５乱射【名前】"},"701":{"skill_id":"701","skill_name":"信頼【名前】"},"1913":{"skill_id":"1913","skill_name":"兄のグランドディナー【剣姫ヨキル】"},"787":{"skill_id":"787","skill_name":"兄のフルコース【剣姫ヨキル】"},"1409":{"skill_id":"1409","skill_name":"入魂【名前】"},"1344":{"skill_id":"1344","skill_name":"共闘【名前】"},"10040":{"skill_id":"10040","skill_name":"共鳴【戦】回避【名前】"},"10026":{"skill_id":"10026","skill_name":"共鳴【獣】回避【名前】"},"10025":{"skill_id":"10025","skill_name":"共鳴【魔】回避【名前】"},"766":{"skill_id":"766","skill_name":"共鳴アトミックブラスト【名前】"},"790":{"skill_id":"790","skill_name":"共鳴インパクトブロー【名前】"},"789":{"skill_id":"789","skill_name":"共鳴グレートキャノン【名前】"},"779":{"skill_id":"779","skill_name":"共鳴サンドストーム【名前】"},"795":{"skill_id":"795","skill_name":"共鳴サーチレーザー【名前】"},"920":{"skill_id":"920","skill_name":"共鳴ダブルインパクト【名前】"},"919":{"skill_id":"919","skill_name":"共鳴ダブルゲイズ【名前】"},"960":{"skill_id":"960","skill_name":"共鳴デュアルレーザー【名前】"},"770":{"skill_id":"770","skill_name":"共鳴ハウリング【名前】"},"780":{"skill_id":"780","skill_name":"共鳴バスターランス【名前】"},"904":{"skill_id":"904","skill_name":"共鳴バックディフェンス【名前】"},"782":{"skill_id":"782","skill_name":"共鳴バーサーカー【名前】"},"768":{"skill_id":"768","skill_name":"共鳴バーニングウィップ【名前】"},"984":{"skill_id":"984","skill_name":"共鳴バーンズウィップ【名前】"},"754":{"skill_id":"754","skill_name":"共鳴パニック【名前】"},"769":{"skill_id":"769","skill_name":"共鳴ヒートソウル【名前】"},"903":{"skill_id":"903","skill_name":"共鳴フロントウォール【名前】"},"948":{"skill_id":"948","skill_name":"共鳴ブレイズウィップ【名前】"},"761":{"skill_id":"761","skill_name":"共鳴ヘヴィスタンプ【名前】"},"781":{"skill_id":"781","skill_name":"共鳴ヘヴィスタンプ【名前】"},"765":{"skill_id":"765","skill_name":"共鳴マジックレイ【名前】"},"22028":{"skill_id":"22028","skill_name":"共鳴ミーニャ【ベアトリス】"},"928":{"skill_id":"928","skill_name":"共鳴リーンフォース【名前】"},"926":{"skill_id":"926","skill_name":"共鳴レイジインパクト【名前】"},"762":{"skill_id":"762","skill_name":"共鳴一刀両断【名前】"},"785":{"skill_id":"785","skill_name":"共鳴一閃【名前】"},"799":{"skill_id":"799","skill_name":"共鳴一閃【名前】"},"759":{"skill_id":"759","skill_name":"共鳴乱射【名前】"},"751":{"skill_id":"751","skill_name":"共鳴乱戦【名前】"},"927":{"skill_id":"927","skill_name":"共鳴二刀両断【名前】"},"755":{"skill_id":"755","skill_name":"共鳴凍結【名前】"},"902":{"skill_id":"902","skill_name":"共鳴凱歌【名前】"},"908":{"skill_id":"908","skill_name":"共鳴双斬【名前】"},"932":{"skill_id":"932","skill_name":"共鳴堕々葬刀【名前】"},"776":{"skill_id":"776","skill_name":"共鳴天叢雲剣【名前】"},"100707":{"skill_id":"100707","skill_name":"共鳴威風【名前】"},"784":{"skill_id":"784","skill_name":"共鳴心眼【名前】"},"756":{"skill_id":"756","skill_name":"共鳴急所【名前】"},"10042":{"skill_id":"10042","skill_name":"共鳴悪魔の守護【名前】"},"10033":{"skill_id":"10033","skill_name":"共鳴悪魔の背中【怒りの黒髭ティーチ】"},"947":{"skill_id":"947","skill_name":"共鳴想斬【名前】"},"962":{"skill_id":"962","skill_name":"共鳴想輝迅【名前】"},"1326":{"skill_id":"1326","skill_name":"共鳴攻+1000【名前】"},"933":{"skill_id":"933","skill_name":"共鳴断命【名前】"},"758":{"skill_id":"758","skill_name":"共鳴正鵠【名前】"},"10027":{"skill_id":"10027","skill_name":"共鳴残光【名前】"},"10030":{"skill_id":"10030","skill_name":"共鳴残影【名前】"},"771":{"skill_id":"771","skill_name":"共鳴活眼【名前】"},"10034":{"skill_id":"10034","skill_name":"共鳴獅子の守護【豪傑の獅子ネルソン】"},"939":{"skill_id":"939","skill_name":"共鳴紫電一閃【名前】"},"10035":{"skill_id":"10035","skill_name":"共鳴見切り【名前】"},"757":{"skill_id":"757","skill_name":"共鳴貫通【名前】"},"100701":{"skill_id":"100701","skill_name":"共鳴重撃【マリー】"},"791":{"skill_id":"791","skill_name":"共鳴雷光戦【名前】"},"798":{"skill_id":"798","skill_name":"共鳴電撃戦【名前】"},"775":{"skill_id":"775","skill_name":"共鳴２乱射【名前】"},"752":{"skill_id":"752","skill_name":"共鳴２乱戦【名前】"},"943":{"skill_id":"943","skill_name":"共鳴２暴射【名前】"},"909":{"skill_id":"909","skill_name":"共鳴２貫船【名前】"},"777":{"skill_id":"777","skill_name":"共鳴２連撃【名前】"},"778":{"skill_id":"778","skill_name":"共鳴２連突【名前】"},"901":{"skill_id":"901","skill_name":"共鳴３乱射【名前】"},"1339":{"skill_id":"1339","skill_name":"初弓【名前】"},"708":{"skill_id":"708","skill_name":"剛毅【名前】"},"710":{"skill_id":"710","skill_name":"勇猛【名前】"},"100708":{"skill_id":"100708","skill_name":"千鳥【名前】"},"1438":{"skill_id":"1438","skill_name":"吸血符【名前】"},"1366":{"skill_id":"1366","skill_name":"呼応【名前】"},"934":{"skill_id":"934","skill_name":"壊船の一撃【名前】"},"1410":{"skill_id":"1410","skill_name":"奮起【名前】"},"1419":{"skill_id":"1419","skill_name":"奮迅【名前】"},"1912":{"skill_id":"1912","skill_name":"妖惑のパーティ【名前】"},"7663":{"skill_id":"7663","skill_name":"姉の矜持【レム】"},"1915":{"skill_id":"1915","skill_name":"富祐の援射【名前】"},"1340":{"skill_id":"1340","skill_name":"射初め【名前】"},"705":{"skill_id":"705","skill_name":"尊心【名前】"},"1471":{"skill_id":"1471","skill_name":"志気【名前】"},"1916":{"skill_id":"1916","skill_name":"悪魔の睥睨【名前】"},"1468":{"skill_id":"1468","skill_name":"愛の記憶【古代進】"},"709":{"skill_id":"709","skill_name":"憤激のアロマテラピー【名前】"},"713":{"skill_id":"713","skill_name":"春かすみ【名前】"},"1522":{"skill_id":"1522","skill_name":"月光のジルバ【名前】"},"1537":{"skill_id":"1537","skill_name":"月華のジルバ【名前】"},"1437":{"skill_id":"1437","skill_name":"正義の御旗【名前】"},"1450":{"skill_id":"1450","skill_name":"活気【名前】"},"1547":{"skill_id":"1547","skill_name":"浜駆ける従者【シャルロッテ姫】"},"1337":{"skill_id":"1337","skill_name":"潮風の猛攻【名前】"},"1919":{"skill_id":"1919","skill_name":"獅子の威光【豪傑の獅子ネルソン】"},"100715":{"skill_id":"100715","skill_name":"白菫の癒光【名前】"},"100717":{"skill_id":"100717","skill_name":"白菫の聖癒光【名前】"},"1451":{"skill_id":"1451","skill_name":"英気【名前】"},"1530":{"skill_id":"1530","skill_name":"蒼風【名前】"},"1510":{"skill_id":"1510","skill_name":"迅速【名前】"},"1343":{"skill_id":"1343","skill_name":"連携【名前】"},"1348":{"skill_id":"1348","skill_name":"鉄の結束【ニャッカ船長】"},"1358":{"skill_id":"1358","skill_name":"鉄の結束【夏色彩画のマチカ】"},"1359":{"skill_id":"1359","skill_name":"鉄の結束【宵浜の花火レターナ】"},"1351":{"skill_id":"1351","skill_name":"鉄の結束【快晴桜嵐のリリカ】"},"1349":{"skill_id":"1349","skill_name":"鉄の結束【春宵のアヴィル】"},"1350":{"skill_id":"1350","skill_name":"鉄の結束【春麗の楽想アイリーン】"},"1360":{"skill_id":"1360","skill_name":"鉄の結束【極彩の森精ドライアド】"},"1357":{"skill_id":"1357","skill_name":"鉄の結束【洸炎波のアヤメ】"},"1352":{"skill_id":"1352","skill_name":"鉄の結束【花時雨のエインセル】"},"1354":{"skill_id":"1354","skill_name":"鉄の結束【闇の従者ベル・フォル】"},"1353":{"skill_id":"1353","skill_name":"鉄の結束【闇の貴族ノエイン】"},"100716":{"skill_id":"100716","skill_name":"閃花の双刃【名前】"},"100718":{"skill_id":"100718","skill_name":"閃華の双煌刃【名前】"},"704":{"skill_id":"704","skill_name":"険悪【名前】"},"1914":{"skill_id":"1914","skill_name":"風縛印【名前】"},"1907":{"skill_id":"1907","skill_name":"魅惑のパーティ【名前】"},"1910":{"skill_id":"1910","skill_name":"黒狼の悪血【クラウリー4姉妹】"},"1909":{"skill_id":"1909","skill_name":"黒狼の血族【クラウリー4姉妹】"},"207":{"skill_id":"207","skill_name":"10%手当"},"206":{"skill_id":"206","skill_name":"5%手当"},"223":{"skill_id":"223","skill_name":"【女】士気"},"1257":{"skill_id":"1257","skill_name":"【戦】勝機"},"1231":{"skill_id":"1231","skill_name":"【男】勇躍"},"217":{"skill_id":"217","skill_name":"【男】士気"},"254":{"skill_id":"254","skill_name":"【男】士魂"},"1209":{"skill_id":"1209","skill_name":"がんばってー！"},"1612":{"skill_id":"1612","skill_name":"ふわふわ"},"248":{"skill_id":"248","skill_name":"もっともっと♪"},"1208":{"skill_id":"1208","skill_name":"アシストショット"},"1212":{"skill_id":"1212","skill_name":"アテニアンエール"},"1241":{"skill_id":"1241","skill_name":"イミュニタス"},"1206":{"skill_id":"1206","skill_name":"イミュニティ"},"7353":{"skill_id":"7353","skill_name":"インクリース"},"272":{"skill_id":"272","skill_name":"インストラクション"},"1258":{"skill_id":"1258","skill_name":"ウィッチクラフト"},"274":{"skill_id":"274","skill_name":"エリクシア"},"9027":{"skill_id":"9027","skill_name":"エール＆スマイル"},"285":{"skill_id":"285","skill_name":"オートリペア"},"1263":{"skill_id":"1263","skill_name":"オーラドライブ"},"1250":{"skill_id":"1250","skill_name":"オーラブースト"},"214":{"skill_id":"214","skill_name":"クイーンチャーム"},"278":{"skill_id":"278","skill_name":"クリア・トランス"},"1233":{"skill_id":"1233","skill_name":"グランドヒール"},"228":{"skill_id":"228","skill_name":"グレートキャノン"},"1253":{"skill_id":"1253","skill_name":"グロウイングケア"},"9020":{"skill_id":"9020","skill_name":"グローアップ"},"9001":{"skill_id":"9001","skill_name":"グロースピリット"},"238":{"skill_id":"238","skill_name":"サークレットキュアー"},"1220":{"skill_id":"1220","skill_name":"シップ・アタッカー"},"1275":{"skill_id":"1275","skill_name":"スケッチトレース"},"1267":{"skill_id":"1267","skill_name":"スパヒーリング"},"262":{"skill_id":"262","skill_name":"スパークルキュアー"},"1251":{"skill_id":"1251","skill_name":"スピリットブレス"},"1203":{"skill_id":"1203","skill_name":"スプラッシュヒール"},"255":{"skill_id":"255","skill_name":"スマッシングキャノン"},"9002":{"skill_id":"9002","skill_name":"セイクリッドソング"},"1264":{"skill_id":"1264","skill_name":"ソウルドライブ"},"1285":{"skill_id":"1285","skill_name":"ターゲッティング"},"1201":{"skill_id":"1201","skill_name":"ダンプ・ザ・シップ"},"1256":{"skill_id":"1256","skill_name":"チアーアニマル"},"236":{"skill_id":"236","skill_name":"チアーズ＆スマイル"},"1236":{"skill_id":"1236","skill_name":"テイルウィンド"},"1240":{"skill_id":"1240","skill_name":"ディアレストウィッシュ"},"1217":{"skill_id":"1217","skill_name":"トランスオーラ"},"1277":{"skill_id":"1277","skill_name":"トリニティパワー"},"9028":{"skill_id":"9028","skill_name":"トロピカリキュール"},"221":{"skill_id":"221","skill_name":"トロピカルメディスン"},"1295":{"skill_id":"1295","skill_name":"ドラゴライズ"},"1238":{"skill_id":"1238","skill_name":"ドラゴンズグローリー"},"259":{"skill_id":"259","skill_name":"ドリームクイーン"},"9003":{"skill_id":"9003","skill_name":"ハッピープレゼント"},"261":{"skill_id":"261","skill_name":"バスターキャノン"},"284":{"skill_id":"284","skill_name":"バスターバースト"},"269":{"skill_id":"269","skill_name":"バッカスの酒樽"},"247":{"skill_id":"247","skill_name":"バッカスの酒瓶"},"292":{"skill_id":"292","skill_name":"バルクアップ"},"1270":{"skill_id":"1270","skill_name":"バルーンリリース"},"235":{"skill_id":"235","skill_name":"バンプアップ"},"1219":{"skill_id":"1219","skill_name":"バーティカルヒール"},"1230":{"skill_id":"1230","skill_name":"バーティカルリカバー"},"1227":{"skill_id":"1227","skill_name":"パワフルギフト"},"1239":{"skill_id":"1239","skill_name":"ヒーリングギフト"},"9026":{"skill_id":"9026","skill_name":"ヒーリングクルー"},"100205":{"skill_id":"100205","skill_name":"ヒールウィンド"},"9022":{"skill_id":"9022","skill_name":"ヒールウォーター"},"265":{"skill_id":"265","skill_name":"ヒールエリア"},"9024":{"skill_id":"9024","skill_name":"ヒールグロウ"},"100202":{"skill_id":"100202","skill_name":"ヒールシャイン"},"1288":{"skill_id":"1288","skill_name":"ヒールライト"},"1291":{"skill_id":"1291","skill_name":"ヒール＆トランス"},"9013":{"skill_id":"9013","skill_name":"ファストケア"},"1278":{"skill_id":"1278","skill_name":"ファストドロウ"},"9012":{"skill_id":"9012","skill_name":"ファストヒール"},"224":{"skill_id":"224","skill_name":"フェアリーパウダー"},"9007":{"skill_id":"9007","skill_name":"フラワーキュアー"},"1287":{"skill_id":"1287","skill_name":"フラワーナイト"},"1252":{"skill_id":"1252","skill_name":"フルケア"},"1214":{"skill_id":"1214","skill_name":"ブライトナイト"},"231":{"skill_id":"231","skill_name":"ブラックバート"},"249":{"skill_id":"249","skill_name":"ブレイブアップ"},"1237":{"skill_id":"1237","skill_name":"ブレイブヒート"},"1271":{"skill_id":"1271","skill_name":"ブーケトス"},"1292":{"skill_id":"1292","skill_name":"ブーケプルズ"},"1249":{"skill_id":"1249","skill_name":"ブーストエリア"},"7355":{"skill_id":"7355","skill_name":"ブーストコネクト"},"7305":{"skill_id":"7305","skill_name":"ブーストリンク"},"1272":{"skill_id":"1272","skill_name":"ヘナの祈り"},"291":{"skill_id":"291","skill_name":"ヘルスケア"},"225":{"skill_id":"225","skill_name":"ホーリークッキング"},"256":{"skill_id":"256","skill_name":"ホーリーソング"},"100204":{"skill_id":"100204","skill_name":"ボルトシューティング"},"1205":{"skill_id":"1205","skill_name":"ボンフェスティバル"},"1276":{"skill_id":"1276","skill_name":"マイティソルジャー"},"7317":{"skill_id":"7317","skill_name":"マイティパワード"},"263":{"skill_id":"263","skill_name":"マジカルメディスン"},"280":{"skill_id":"280","skill_name":"ミスティックキュアー"},"1207":{"skill_id":"1207","skill_name":"ミネルヴァコール"},"252":{"skill_id":"252","skill_name":"ムーンパヴァーヌ"},"219":{"skill_id":"219","skill_name":"ムーンワルツ"},"240":{"skill_id":"240","skill_name":"メリーメロディ"},"201":{"skill_id":"201","skill_name":"メンテナンス"},"239":{"skill_id":"239","skill_name":"ヨウルラフヤ"},"1274":{"skill_id":"1274","skill_name":"ラフトレース"},"287":{"skill_id":"287","skill_name":"ランチボックス"},"100207":{"skill_id":"100207","skill_name":"リカバリーウィンド"},"271":{"skill_id":"271","skill_name":"リカバースピリット"},"210":{"skill_id":"210","skill_name":"リストア"},"277":{"skill_id":"277","skill_name":"リフィット"},"1259":{"skill_id":"1259","skill_name":"リフレッシュ"},"260":{"skill_id":"260","skill_name":"リペアキット"},"100213":{"skill_id":"100213","skill_name":"リペアドライブ"},"1223":{"skill_id":"1223","skill_name":"レインボーヒール"},"279":{"skill_id":"279","skill_name":"ヴァリアブルキャノン"},"100211":{"skill_id":"100211","skill_name":"ヴァルキリーの強襲"},"1283":{"skill_id":"1283","skill_name":"ヴァルキリーの騎行"},"1232":{"skill_id":"1232","skill_name":"一斉砲火"},"30023":{"skill_id":"30023","skill_name":"仲間への檄"},"30022":{"skill_id":"30022","skill_name":"仲間への鼓舞"},"1215":{"skill_id":"1215","skill_name":"健勝祈願"},"1211":{"skill_id":"1211","skill_name":"僕たち獣海賊団"},"1221":{"skill_id":"1221","skill_name":"僕らは獣大海賊"},"1222":{"skill_id":"1222","skill_name":"元気だして♪"},"294":{"skill_id":"294","skill_name":"全癒"},"1294":{"skill_id":"1294","skill_name":"六剣兄の最愛"},"222":{"skill_id":"222","skill_name":"再生"},"266":{"skill_id":"266","skill_name":"凱歌"},"1284":{"skill_id":"1284","skill_name":"刀舞"},"1293":{"skill_id":"1293","skill_name":"剣兄の親愛"},"242":{"skill_id":"242","skill_name":"勇気のオーラ"},"1213":{"skill_id":"1213","skill_name":"医神の加護"},"270":{"skill_id":"270","skill_name":"協奏歌"},"226":{"skill_id":"226","skill_name":"厄祓い"},"1224":{"skill_id":"1224","skill_name":"召喚・応援蛙"},"1225":{"skill_id":"1225","skill_name":"召喚・援護蛙"},"1226":{"skill_id":"1226","skill_name":"召喚・蛙大合唱"},"1216":{"skill_id":"1216","skill_name":"号砲"},"202":{"skill_id":"202","skill_name":"回復"},"1218":{"skill_id":"1218","skill_name":"士気昂揚"},"9901":{"skill_id":"9901","skill_name":"天女の舞"},"100210":{"skill_id":"100210","skill_name":"奮起の神楽"},"1202":{"skill_id":"1202","skill_name":"女神の加護"},"100212":{"skill_id":"100212","skill_name":"嵐導の御手"},"289":{"skill_id":"289","skill_name":"快復"},"273":{"skill_id":"273","skill_name":"快癒"},"212":{"skill_id":"212","skill_name":"怒号"},"218":{"skill_id":"218","skill_name":"怒髪天"},"1210":{"skill_id":"1210","skill_name":"恵みの雨"},"1280":{"skill_id":"1280","skill_name":"戦士の祝宴"},"1204":{"skill_id":"1204","skill_name":"援護射撃"},"1298":{"skill_id":"1298","skill_name":"星旄電戟"},"281":{"skill_id":"281","skill_name":"春思の情"},"244":{"skill_id":"244","skill_name":"来福"},"1248":{"skill_id":"1248","skill_name":"桜花の祝福"},"1620":{"skill_id":"1620","skill_name":"楽園のエステ"},"7315":{"skill_id":"7315","skill_name":"武刀演舞"},"1262":{"skill_id":"1262","skill_name":"氷海戦術"},"1279":{"skill_id":"1279","skill_name":"氷雪の先導"},"203":{"skill_id":"203","skill_name":"治療"},"9023":{"skill_id":"9023","skill_name":"治癒の浄泉"},"299":{"skill_id":"299","skill_name":"海飲み"},"204":{"skill_id":"204","skill_name":"激励"},"1246":{"skill_id":"1246","skill_name":"炎蜥蜴の加護"},"1282":{"skill_id":"1282","skill_name":"熱風"},"30024":{"skill_id":"30024","skill_name":"献身の治療"},"7321":{"skill_id":"7321","skill_name":"王者の進攻"},"100209":{"skill_id":"100209","skill_name":"王者の驀進"},"1619":{"skill_id":"1619","skill_name":"瑞光の癒"},"1242":{"skill_id":"1242","skill_name":"痛みの救済"},"251":{"skill_id":"251","skill_name":"癒しの型・療火"},"9004":{"skill_id":"9004","skill_name":"癒しの型・療焔"},"253":{"skill_id":"253","skill_name":"癒しの小夜曲"},"1266":{"skill_id":"1266","skill_name":"癒光賛歌"},"1261":{"skill_id":"1261","skill_name":"白雪の導き"},"227":{"skill_id":"227","skill_name":"研摩"},"1289":{"skill_id":"1289","skill_name":"砲撃命令"},"1281":{"skill_id":"1281","skill_name":"砲火集陣"},"9008":{"skill_id":"9008","skill_name":"祝文"},"288":{"skill_id":"288","skill_name":"祝詞"},"230":{"skill_id":"230","skill_name":"神域"},"208":{"skill_id":"208","skill_name":"神楽"},"9902":{"skill_id":"9902","skill_name":"神酒振舞"},"7311":{"skill_id":"7311","skill_name":"絆の剣速"},"100201":{"skill_id":"100201","skill_name":"聖なる夜の唄"},"205":{"skill_id":"205","skill_name":"聖域"},"232":{"skill_id":"232","skill_name":"聖歌"},"1244":{"skill_id":"1244","skill_name":"背水の陣"},"1245":{"skill_id":"1245","skill_name":"花湯の雪見酒"},"1247":{"skill_id":"1247","skill_name":"花見美酒"},"1229":{"skill_id":"1229","skill_name":"花見酒"},"267":{"skill_id":"267","skill_name":"賛美歌"},"213":{"skill_id":"213","skill_name":"軍神"},"1286":{"skill_id":"1286","skill_name":"野天の功効"},"258":{"skill_id":"258","skill_name":"鍛錬"},"1260":{"skill_id":"1260","skill_name":"雄飛"},"268":{"skill_id":"268","skill_name":"集気"},"9005":{"skill_id":"9005","skill_name":"集結集気"},"298":{"skill_id":"298","skill_name":"雨降る晩夏"},"100217":{"skill_id":"100217","skill_name":"雲雀の天祝音"},"100215":{"skill_id":"100215","skill_name":"雲雀の祝音"},"1255":{"skill_id":"1255","skill_name":"風々夏花"},"1254":{"skill_id":"1254","skill_name":"風々夏芽"},"1273":{"skill_id":"1273","skill_name":"飛檄"},"1269":{"skill_id":"1269","skill_name":"魔性のオーラ"},"1297":{"skill_id":"1297","skill_name":"黄金の夏夜"},"209":{"skill_id":"209","skill_name":"鼓舞"},"4091":{"skill_id":"4091","skill_name":"10%ガード"},"4092":{"skill_id":"4092","skill_name":"20%ガード"},"4093":{"skill_id":"4093","skill_name":"30%ガード"},"4094":{"skill_id":"4094","skill_name":"40%ガード"},"4095":{"skill_id":"4095","skill_name":"50%ガード"},"4096":{"skill_id":"4096","skill_name":"60%ガード"},"453":{"skill_id":"453","skill_name":"【女】魅了"},"4206":{"skill_id":"4206","skill_name":"【戦】七星点倒"},"100412":{"skill_id":"100412","skill_name":"【戦】減衰"},"3005":{"skill_id":"3005","skill_name":"【男】放心"},"3109":{"skill_id":"3109","skill_name":"【男】蠱惑"},"414":{"skill_id":"414","skill_name":"【男】魅了"},"4146":{"skill_id":"4146","skill_name":"【魔】スタントラップ"},"1656":{"skill_id":"1656","skill_name":"おすしアタック"},"4016":{"skill_id":"4016","skill_name":"おすしラッシュ"},"3089":{"skill_id":"3089","skill_name":"おばけスクリーム"},"1626":{"skill_id":"1626","skill_name":"お守りごーれむ"},"488":{"skill_id":"488","skill_name":"お買い上げ♪"},"1624":{"skill_id":"1624","skill_name":"かまいたち"},"4220":{"skill_id":"4220","skill_name":"さざ波の子守唄"},"100413":{"skill_id":"100413","skill_name":"ちょい押し営業"},"1695":{"skill_id":"1695","skill_name":"どんどんいこー！"},"1668":{"skill_id":"1668","skill_name":"ほわほわ"},"4100":{"skill_id":"4100","skill_name":"ほわんほわん"},"3039":{"skill_id":"3039","skill_name":"ぽっむぽむ"},"475":{"skill_id":"475","skill_name":"ぽむぽむ"},"4149":{"skill_id":"4149","skill_name":"まごころの応接"},"3035":{"skill_id":"3035","skill_name":"みんなお買い上げ♪"},"4054":{"skill_id":"4054","skill_name":"アイスシェル"},"456":{"skill_id":"456","skill_name":"アイスバインド"},"4184":{"skill_id":"4184","skill_name":"アイスロック"},"4181":{"skill_id":"4181","skill_name":"アクアガード"},"4041":{"skill_id":"4041","skill_name":"アサルトギフト"},"4165":{"skill_id":"4165","skill_name":"アサルトシンカー"},"4032":{"skill_id":"4032","skill_name":"アシストラッシュ"},"4180":{"skill_id":"4180","skill_name":"アシッドレイン"},"1662":{"skill_id":"1662","skill_name":"アタックダウン"},"4103":{"skill_id":"4103","skill_name":"アタックフォール"},"4186":{"skill_id":"4186","skill_name":"アドベントボックス"},"4210":{"skill_id":"4210","skill_name":"アビス"},"1638":{"skill_id":"1638","skill_name":"アンブレラリジッド"},"1609":{"skill_id":"1609","skill_name":"アースシールド"},"3003":{"skill_id":"3003","skill_name":"アームスティール"},"3103":{"skill_id":"3103","skill_name":"アームズデスロック"},"3004":{"skill_id":"3004","skill_name":"アームブレイク"},"1640":{"skill_id":"1640","skill_name":"イマジンスタッフ"},"1685":{"skill_id":"1685","skill_name":"イマジンワンド"},"3017":{"skill_id":"3017","skill_name":"イリュージョナルブロッサム"},"4197":{"skill_id":"4197","skill_name":"インファントフォッグ"},"4237":{"skill_id":"4237","skill_name":"インフェルノ"},"463":{"skill_id":"463","skill_name":"インペリアルオーダー"},"3084":{"skill_id":"3084","skill_name":"ウィングブーツ"},"4240":{"skill_id":"4240","skill_name":"ウィンドブリード"},"1605":{"skill_id":"1605","skill_name":"ウェアガード"},"4003":{"skill_id":"4003","skill_name":"ウェアディフェンス"},"1641":{"skill_id":"1641","skill_name":"ウェアプロテクト"},"1621":{"skill_id":"1621","skill_name":"ウェポンギフト"},"4069":{"skill_id":"4069","skill_name":"ウェポンクラフト"},"1657":{"skill_id":"1657","skill_name":"ウェポンスロー"},"1625":{"skill_id":"1625","skill_name":"エアロウォール"},"4040":{"skill_id":"4040","skill_name":"エアロバリアー"},"430":{"skill_id":"430","skill_name":"エレメントトラップ"},"4170":{"skill_id":"4170","skill_name":"エンチャントレス"},"3072":{"skill_id":"3072","skill_name":"エーテル薬"},"4163":{"skill_id":"4163","skill_name":"オフィウクスの守護"},"4199":{"skill_id":"4199","skill_name":"オーヴァーカット"},"1686":{"skill_id":"1686","skill_name":"カタストロフィ"},"4278":{"skill_id":"4278","skill_name":"カバーグラス"},"100406":{"skill_id":"100406","skill_name":"カーススペル"},"4275":{"skill_id":"4275","skill_name":"カーズドレター"},"4044":{"skill_id":"4044","skill_name":"カームダウン"},"4083":{"skill_id":"4083","skill_name":"カーム・シー"},"479":{"skill_id":"479","skill_name":"ガンパウダー"},"4015":{"skill_id":"4015","skill_name":"ガードアシスト"},"426":{"skill_id":"426","skill_name":"ギャンブルスナッチ"},"3044":{"skill_id":"3044","skill_name":"グランデ・スペッキオ"},"1688":{"skill_id":"1688","skill_name":"グランドフレア"},"3012":{"skill_id":"3012","skill_name":"グロリアスベル"},"3033":{"skill_id":"3033","skill_name":"コロージョン"},"477":{"skill_id":"477","skill_name":"コンフューズパイプ"},"3045":{"skill_id":"3045","skill_name":"コーピア・スペッキオ"},"4122":{"skill_id":"4122","skill_name":"コールドグレア"},"3047":{"skill_id":"3047","skill_name":"コールドプリズン"},"1669":{"skill_id":"1669","skill_name":"ゴーストグリーフ"},"3058":{"skill_id":"3058","skill_name":"ゴールデングラバー"},"4205":{"skill_id":"4205","skill_name":"サボタージュ"},"4036":{"skill_id":"4036","skill_name":"サマーバケーション"},"4200":{"skill_id":"4200","skill_name":"サンダリングハウル"},"1637":{"skill_id":"1637","skill_name":"サン・コケッコ"},"415":{"skill_id":"415","skill_name":"シェルコーティング"},"3113":{"skill_id":"3113","skill_name":"シザークラック"},"3010":{"skill_id":"3010","skill_name":"シザートラップ"},"1661":{"skill_id":"1661","skill_name":"シザーホールド"},"3064":{"skill_id":"3064","skill_name":"シャウトダウン"},"4187":{"skill_id":"4187","skill_name":"シュガースノウ"},"1678":{"skill_id":"1678","skill_name":"ショートハミング"},"481":{"skill_id":"481","skill_name":"シルバーブリザード"},"4176":{"skill_id":"4176","skill_name":"シンクロニシティ"},"3062":{"skill_id":"3062","skill_name":"シンパシー"},"1689":{"skill_id":"1689","skill_name":"シーズファイア"},"4067":{"skill_id":"4067","skill_name":"スキルクラック"},"3087":{"skill_id":"3087","skill_name":"スキルハイド"},"425":{"skill_id":"425","skill_name":"スタンプシール"},"4135":{"skill_id":"4135","skill_name":"ステディシールド"},"428":{"skill_id":"428","skill_name":"ストーンテラー"},"4130":{"skill_id":"4130","skill_name":"スナッチダウン"},"469":{"skill_id":"469","skill_name":"スナッチリフト"},"455":{"skill_id":"455","skill_name":"スノー・トリック"},"1632":{"skill_id":"1632","skill_name":"スプーキーウィンド"},"4196":{"skill_id":"4196","skill_name":"スリープミスト"},"3066":{"skill_id":"3066","skill_name":"セイクリッドダウン"},"4265":{"skill_id":"4265","skill_name":"セイバーズロック"},"1679":{"skill_id":"1679","skill_name":"セイントコーラス"},"454":{"skill_id":"454","skill_name":"セントディナー"},"4182":{"skill_id":"4182","skill_name":"セーフティゾーン"},"4058":{"skill_id":"4058","skill_name":"ソウルドレイン"},"4053":{"skill_id":"4053","skill_name":"ソウルリターナー"},"4104":{"skill_id":"4104","skill_name":"ソフトシップ"},"447":{"skill_id":"447","skill_name":"ソング・デスペアー"},"1651":{"skill_id":"1651","skill_name":"ソードロック"},"3074":{"skill_id":"3074","skill_name":"ソーンヘッジ"},"1649":{"skill_id":"1649","skill_name":"タイタンウォール"},"409":{"skill_id":"409","skill_name":"タイムスロック"},"4259":{"skill_id":"4259","skill_name":"タクティクスエンド"},"1623":{"skill_id":"1623","skill_name":"タクティクスブレイク"},"4002":{"skill_id":"4002","skill_name":"ダウンストリーム"},"4004":{"skill_id":"4004","skill_name":"ダブルキャノン"},"100411":{"skill_id":"100411","skill_name":"ダメージリダクション"},"4029":{"skill_id":"4029","skill_name":"ダークシュラウド"},"4174":{"skill_id":"4174","skill_name":"ダークブリンガー"},"1604":{"skill_id":"1604","skill_name":"ダークミスト"},"4189":{"skill_id":"4189","skill_name":"ダークレイド"},"443":{"skill_id":"443","skill_name":"テラースクリーム"},"3013":{"skill_id":"3013","skill_name":"テンプテーション"},"4190":{"skill_id":"4190","skill_name":"テンポラリガード"},"3028":{"skill_id":"3028","skill_name":"テーブルリミット"},"4060":{"skill_id":"4060","skill_name":"ディザスター"},"1652":{"skill_id":"1652","skill_name":"ディフェンスシフト"},"1681":{"skill_id":"1681","skill_name":"デモンズコーラス"},"440":{"skill_id":"440","skill_name":"デュアルショック"},"3063":{"skill_id":"3063","skill_name":"デヴァステーション"},"4188":{"skill_id":"4188","skill_name":"トラジェディ"},"4167":{"skill_id":"4167","skill_name":"トラップロック"},"4117":{"skill_id":"4117","skill_name":"トラブルプレゼンター"},"4035":{"skill_id":"4035","skill_name":"トラブルメーカー"},"498":{"skill_id":"498","skill_name":"トリック・アンド・トリート"},"4252":{"skill_id":"4252","skill_name":"トリプルアサルト"},"4153":{"skill_id":"4153","skill_name":"トリプルシェル"},"482":{"skill_id":"482","skill_name":"ナイヴスデスロック"},"3007":{"skill_id":"3007","skill_name":"ネイヴィアソング"},"3016":{"skill_id":"3016","skill_name":"ネットアブストラクション"},"461":{"skill_id":"461","skill_name":"ネットウォール"},"4005":{"skill_id":"4005","skill_name":"ネットパラライズ"},"433":{"skill_id":"433","skill_name":"ノーブルロック"},"3073":{"skill_id":"3073","skill_name":"ハイエーテル薬"},"432":{"skill_id":"432","skill_name":"ハウリング"},"4144":{"skill_id":"4144","skill_name":"ハザードミスト"},"4108":{"skill_id":"4108","skill_name":"ハネムーン"},"4225":{"skill_id":"4225","skill_name":"ハートドロップス"},"4025":{"skill_id":"4025","skill_name":"ハードシェル"},"412":{"skill_id":"412","skill_name":"バタフライローズ"},"3030":{"skill_id":"3030","skill_name":"バックディフェンス"},"4178":{"skill_id":"4178","skill_name":"バレットフォール"},"496":{"skill_id":"496","skill_name":"バンスケアード"},"4085":{"skill_id":"4085","skill_name":"バーニングデッキ"},"437":{"skill_id":"437","skill_name":"バーンナップ"},"3038":{"skill_id":"3038","skill_name":"バーンハザード"},"3024":{"skill_id":"3024","skill_name":"バーンフラッド"},"1684":{"skill_id":"1684","skill_name":"パペットブロック"},"4131":{"skill_id":"4131","skill_name":"パラソルソリッド"},"4034":{"skill_id":"4034","skill_name":"パラダイスパニック"},"424":{"skill_id":"424","skill_name":"パラノイア"},"4183":{"skill_id":"4183","skill_name":"パワースナッチ"},"413":{"skill_id":"413","skill_name":"パワーダウン"},"4233":{"skill_id":"4233","skill_name":"パワーテイカー"},"411":{"skill_id":"411","skill_name":"パワードレイン"},"1680":{"skill_id":"1680","skill_name":"ヒイラギの檻"},"441":{"skill_id":"441","skill_name":"ヒーリングウォール"},"1690":{"skill_id":"1690","skill_name":"ヒールコーティング"},"4033":{"skill_id":"4033","skill_name":"ビーチパニック"},"4216":{"skill_id":"4216","skill_name":"ファイアウォール"},"3008":{"skill_id":"3008","skill_name":"ファウルスナッチ"},"1601":{"skill_id":"1601","skill_name":"ファストシールド"},"4030":{"skill_id":"4030","skill_name":"ファストトラップ"},"3027":{"skill_id":"3027","skill_name":"フィアフルクライ"},"4089":{"skill_id":"4089","skill_name":"フェアリーガーデン"},"434":{"skill_id":"434","skill_name":"フェアリートリック"},"4087":{"skill_id":"4087","skill_name":"フェアリーフィールド"},"3902":{"skill_id":"3902","skill_name":"フェアリーマジック"},"445":{"skill_id":"445","skill_name":"フェアリーローズ"},"3081":{"skill_id":"3081","skill_name":"フェザーブーツ"},"4179":{"skill_id":"4179","skill_name":"フォースサッカー"},"1698":{"skill_id":"1698","skill_name":"フォーリンダガー"},"3049":{"skill_id":"3049","skill_name":"フリーズプリズン"},"1629":{"skill_id":"1629","skill_name":"フルヒトテラー"},"1654":{"skill_id":"1654","skill_name":"フルヒトテンペスト"},"1687":{"skill_id":"1687","skill_name":"フレア"},"3079":{"skill_id":"3079","skill_name":"フロストウィンド"},"451":{"skill_id":"451","skill_name":"フロストエッジ"},"4185":{"skill_id":"4185","skill_name":"フロストロック"},"459":{"skill_id":"459","skill_name":"フロントウォール"},"436":{"skill_id":"436","skill_name":"フロントガード"},"4090":{"skill_id":"4090","skill_name":"フローラルセント"},"4088":{"skill_id":"4088","skill_name":"フローラルトリック"},"1642":{"skill_id":"1642","skill_name":"ブラインドフォッグ"},"4241":{"skill_id":"4241","skill_name":"ブラストブリード"},"100407":{"skill_id":"100407","skill_name":"ブリリアントダーク"},"4062":{"skill_id":"4062","skill_name":"ブリーチング"},"4126":{"skill_id":"4126","skill_name":"ブリードライフ"},"4011":{"skill_id":"4011","skill_name":"ブルワーク"},"4156":{"skill_id":"4156","skill_name":"ブルームショット"},"4157":{"skill_id":"4157","skill_name":"ブルームバレット"},"4059":{"skill_id":"4059","skill_name":"ブレッシングライト"},"4014":{"skill_id":"4014","skill_name":"ブロウビート"},"1672":{"skill_id":"1672","skill_name":"プラスキャノン"},"1643":{"skill_id":"1643","skill_name":"プラスボム"},"1616":{"skill_id":"1616","skill_name":"プリエールメロディ"},"3026":{"skill_id":"3026","skill_name":"プリズムロック"},"4171":{"skill_id":"4171","skill_name":"プレイ・パペット"},"4147":{"skill_id":"4147","skill_name":"プレシャスライト"},"4070":{"skill_id":"4070","skill_name":"ヘヴィスナイプ"},"4006":{"skill_id":"4006","skill_name":"ヘヴィーガスト"},"427":{"skill_id":"427","skill_name":"ベノムミスト"},"1633":{"skill_id":"1633","skill_name":"ベリーダンス"},"4013":{"skill_id":"4013","skill_name":"ペナルティチェック"},"4150":{"skill_id":"4150","skill_name":"ホットセラピー"},"4052":{"skill_id":"4052","skill_name":"ホワイトムーン"},"4073":{"skill_id":"4073","skill_name":"ホークアイ"},"4136":{"skill_id":"4136","skill_name":"ホールドダウナー"},"3076":{"skill_id":"3076","skill_name":"ポルターガイスト"},"4145":{"skill_id":"4145","skill_name":"マイティウェポン"},"4213":{"skill_id":"4213","skill_name":"マジックタイド"},"468":{"skill_id":"468","skill_name":"マジックバンカー"},"4115":{"skill_id":"4115","skill_name":"マナギフト"},"4057":{"skill_id":"4057","skill_name":"マナドレイン"},"476":{"skill_id":"476","skill_name":"ミザリーパイプ"},"4078":{"skill_id":"4078","skill_name":"ミスティシェイド"},"4107":{"skill_id":"4107","skill_name":"ミスティックスモーク"},"1644":{"skill_id":"1644","skill_name":"ミストアウト"},"4012":{"skill_id":"4012","skill_name":"ミストフォール"},"1683":{"skill_id":"1683","skill_name":"ムクロジの守り"},"3001":{"skill_id":"3001","skill_name":"メナトの儀"},"4166":{"skill_id":"4166","skill_name":"メナトの祭儀"},"484":{"skill_id":"484","skill_name":"ヤル気ゲン気"},"3052":{"skill_id":"3052","skill_name":"ライオンダンス"},"4082":{"skill_id":"4082","skill_name":"ライフクライシス"},"4215":{"skill_id":"4215","skill_name":"ライフデンジャー"},"100401":{"skill_id":"100401","skill_name":"ラグナルの威勢"},"4204":{"skill_id":"4204","skill_name":"ラグナルの暴威"},"4133":{"skill_id":"4133","skill_name":"ラムアタック"},"4211":{"skill_id":"4211","skill_name":"ララバイ"},"3036":{"skill_id":"3036","skill_name":"リバイバル"},"1639":{"skill_id":"1639","skill_name":"リバイブヒール"},"1677":{"skill_id":"1677","skill_name":"リポップサークル"},"1613":{"skill_id":"1613","skill_name":"リポップリンク"},"4132":{"skill_id":"4132","skill_name":"リリーフガード"},"1636":{"skill_id":"1636","skill_name":"リースプロテクト"},"452":{"skill_id":"452","skill_name":"ルナティックビート"},"435":{"skill_id":"435","skill_name":"ルナティックロンド"},"4140":{"skill_id":"4140","skill_name":"ルフトフリーレン"},"4071":{"skill_id":"4071","skill_name":"レイジスナイプ"},"3065":{"skill_id":"3065","skill_name":"レトリビューション"},"4022":{"skill_id":"4022","skill_name":"レメディシールド"},"4128":{"skill_id":"4128","skill_name":"レースウォール"},"1666":{"skill_id":"1666","skill_name":"レースガード"},"480":{"skill_id":"480","skill_name":"ロックダウン"},"4113":{"skill_id":"4113","skill_name":"ワイドガード"},"4114":{"skill_id":"4114","skill_name":"ワイドシールド"},"4125":{"skill_id":"4125","skill_name":"ワイルドハント"},"4177":{"skill_id":"4177","skill_name":"ワイルドラッシュ"},"1635":{"skill_id":"1635","skill_name":"ワンスダウナー"},"4001":{"skill_id":"4001","skill_name":"ワンダーサークル"},"1699":{"skill_id":"1699","skill_name":"ワンダーリング"},"4048":{"skill_id":"4048","skill_name":"一点特化"},"4139":{"skill_id":"4139","skill_name":"三段砲華"},"4110":{"skill_id":"4110","skill_name":"三重防壁"},"492":{"skill_id":"492","skill_name":"不知火"},"4017":{"skill_id":"4017","skill_name":"中衛指令【男】"},"3114":{"skill_id":"3114","skill_name":"主導制圧戦術"},"3060":{"skill_id":"3060","skill_name":"主導掌握戦術"},"3040":{"skill_id":"3040","skill_name":"乗船"},"4287":{"skill_id":"4287","skill_name":"乱流の檻"},"495":{"skill_id":"495","skill_name":"予見の識"},"100410":{"skill_id":"100410","skill_name":"争鳴のラプソディ"},"1622":{"skill_id":"1622","skill_name":"仁慈の光"},"4019":{"skill_id":"4019","skill_name":"修祓の儀"},"3006":{"skill_id":"3006","skill_name":"偏愛の誘い"},"3071":{"skill_id":"3071","skill_name":"元気ハツラツ"},"464":{"skill_id":"464","skill_name":"先見の識"},"4068":{"skill_id":"4068","skill_name":"光折"},"4258":{"skill_id":"4258","skill_name":"光折乱制"},"1663":{"skill_id":"1663","skill_name":"光矢の守り"},"4101":{"skill_id":"4101","skill_name":"光蛇"},"1646":{"skill_id":"1646","skill_name":"八重の盾"},"4116":{"skill_id":"4116","skill_name":"再起の光"},"4169":{"skill_id":"4169","skill_name":"凛魔晴嵐"},"4121":{"skill_id":"4121","skill_name":"凛魔涼風"},"470":{"skill_id":"470","skill_name":"凱風"},"1664":{"skill_id":"1664","skill_name":"凶星の巡り"},"4195":{"skill_id":"4195","skill_name":"凶相パラノイア"},"1647":{"skill_id":"1647","skill_name":"刃桜の矛"},"100415":{"skill_id":"100415","skill_name":"利益誘導"},"1658":{"skill_id":"1658","skill_name":"制縛の布"},"458":{"skill_id":"458","skill_name":"刻印の符陣"},"3077":{"skill_id":"3077","skill_name":"刻呪の符陣"},"1694":{"skill_id":"1694","skill_name":"剛なる収奪者"},"494":{"skill_id":"494","skill_name":"叡智の教え"},"1660":{"skill_id":"1660","skill_name":"召喚・盾亀"},"4077":{"skill_id":"4077","skill_name":"召喚・砲炎狼"},"3018":{"skill_id":"3018","skill_name":"吉祥"},"4198":{"skill_id":"4198","skill_name":"呪種の方陣"},"1645":{"skill_id":"1645","skill_name":"呪詛"},"4026":{"skill_id":"4026","skill_name":"呪闇の枷"},"3009":{"skill_id":"3009","skill_name":"咆号"},"417":{"skill_id":"417","skill_name":"咆哮"},"4208":{"skill_id":"4208","skill_name":"嘆きの桜"},"3116":{"skill_id":"3116","skill_name":"圧延の歩"},"1692":{"skill_id":"1692","skill_name":"地を喰らう"},"4201":{"skill_id":"4201","skill_name":"地獄湯"},"4209":{"skill_id":"4209","skill_name":"夜哭き桜"},"465":{"skill_id":"465","skill_name":"夢喰い"},"3021":{"skill_id":"3021","skill_name":"大号令"},"3055":{"skill_id":"3055","skill_name":"天を喰らう"},"3042":{"skill_id":"3042","skill_name":"天命操作"},"3078":{"skill_id":"3078","skill_name":"天界への門"},"3075":{"skill_id":"3075","skill_name":"天空への道"},"474":{"skill_id":"474","skill_name":"天網恢恢"},"4141":{"skill_id":"4141","skill_name":"天羅地網"},"4080":{"skill_id":"4080","skill_name":"妖しの赤椿"},"4192":{"skill_id":"4192","skill_name":"始終の縁"},"403":{"skill_id":"403","skill_name":"威嚇"},"4072":{"skill_id":"4072","skill_name":"威嚇射撃"},"467":{"skill_id":"467","skill_name":"威圧"},"3043":{"skill_id":"3043","skill_name":"威武"},"3011":{"skill_id":"3011","skill_name":"威迫"},"3092":{"skill_id":"3092","skill_name":"威風"},"1648":{"skill_id":"1648","skill_name":"守りの花園"},"466":{"skill_id":"466","skill_name":"安眠への誘い"},"4007":{"skill_id":"4007","skill_name":"宝桜"},"4640":{"skill_id":"4640","skill_name":"容赦なき毒舌"},"4112":{"skill_id":"4112","skill_name":"対空戦術"},"462":{"skill_id":"462","skill_name":"対防御戦術"},"457":{"skill_id":"457","skill_name":"封技の魔符"},"450":{"skill_id":"450","skill_name":"封武の陣"},"1659":{"skill_id":"1659","skill_name":"封縛の呪布"},"4127":{"skill_id":"4127","skill_name":"封防の層呪布"},"1607":{"skill_id":"1607","skill_name":"封魔の盾"},"4221":{"skill_id":"4221","skill_name":"嵐の旋律"},"4105":{"skill_id":"4105","skill_name":"帝国式戦術"},"4106":{"skill_id":"4106","skill_name":"帝国式戦術・二式"},"3025":{"skill_id":"3025","skill_name":"幻惑の舞踏"},"3053":{"skill_id":"3053","skill_name":"幻月の術"},"4175":{"skill_id":"4175","skill_name":"幻硬の秘法"},"4028":{"skill_id":"4028","skill_name":"庇護の精霊リィ"},"4160":{"skill_id":"4160","skill_name":"影縫い"},"4018":{"skill_id":"4018","skill_name":"後衛指令【女】"},"4217":{"skill_id":"4217","skill_name":"後陣崩し"},"4191":{"skill_id":"4191","skill_name":"御歓楽"},"3096":{"skill_id":"3096","skill_name":"循環の効能"},"4050":{"skill_id":"4050","skill_name":"心身後退"},"4086":{"skill_id":"4086","skill_name":"怨鎖の刻印"},"472":{"skill_id":"472","skill_name":"怪鳥の呪詛"},"4043":{"skill_id":"4043","skill_name":"恐怖のお茶会"},"4118":{"skill_id":"4118","skill_name":"恐慌"},"3068":{"skill_id":"3068","skill_name":"情愛の誘い"},"4152":{"skill_id":"4152","skill_name":"感応障壁"},"486":{"skill_id":"486","skill_name":"感染"},"1602":{"skill_id":"1602","skill_name":"慈愛の光"},"4194":{"skill_id":"4194","skill_name":"慈愛の輪光"},"4109":{"skill_id":"4109","skill_name":"憤激"},"4119":{"skill_id":"4119","skill_name":"戦々恐々"},"3467":{"skill_id":"3467","skill_name":"抑圧"},"3023":{"skill_id":"3023","skill_name":"抹殺依頼"},"4056":{"skill_id":"4056","skill_name":"招福の神弓"},"431":{"skill_id":"431","skill_name":"挑発"},"4051":{"skill_id":"4051","skill_name":"断空"},"429":{"skill_id":"429","skill_name":"明察"},"100402":{"skill_id":"100402","skill_name":"星守の息吹"},"4214":{"skill_id":"4214","skill_name":"星守の領域"},"4158":{"skill_id":"4158","skill_name":"春凪の蕾"},"3051":{"skill_id":"3051","skill_name":"春節の祝い"},"439":{"skill_id":"439","skill_name":"暗殺依頼"},"3105":{"skill_id":"3105","skill_name":"梳初め"},"1634":{"skill_id":"1634","skill_name":"横槍禁止"},"487":{"skill_id":"487","skill_name":"武の強奪者"},"4276":{"skill_id":"4276","skill_name":"武功の英知"},"4277":{"skill_id":"4277","skill_name":"武勲の英知"},"4081":{"skill_id":"4081","skill_name":"殲滅指示【女】"},"4049":{"skill_id":"4049","skill_name":"殺意の先行"},"1676":{"skill_id":"1676","skill_name":"水の枷"},"1627":{"skill_id":"1627","skill_name":"水底への誘い"},"473":{"skill_id":"473","skill_name":"水星逆行"},"3031":{"skill_id":"3031","skill_name":"水煙"},"1618":{"skill_id":"1618","skill_name":"氷結の盾"},"4267":{"skill_id":"4267","skill_name":"永代の御縁"},"401":{"skill_id":"401","skill_name":"沈黙"},"4027":{"skill_id":"4027","skill_name":"治癒の精霊ルゥ"},"4236":{"skill_id":"4236","skill_name":"流水の枷鎖"},"1697":{"skill_id":"1697","skill_name":"流水の檻"},"490":{"skill_id":"490","skill_name":"浜辺の誘惑"},"4151":{"skill_id":"4151","skill_name":"海上の楽園"},"4039":{"skill_id":"4039","skill_name":"海上掌握"},"1655":{"skill_id":"1655","skill_name":"海底への誘い"},"1631":{"skill_id":"1631","skill_name":"海神の守護"},"1603":{"skill_id":"1603","skill_name":"海神の盾"},"4168":{"skill_id":"4168","skill_name":"海難警砲"},"4212":{"skill_id":"4212","skill_name":"海鳥のララバイ"},"4074":{"skill_id":"4074","skill_name":"消耗戦"},"4161":{"skill_id":"4161","skill_name":"深淵への誘い"},"4123":{"skill_id":"4123","skill_name":"渚の秩序"},"4202":{"skill_id":"4202","skill_name":"湯入りの番"},"4203":{"skill_id":"4203","skill_name":"湯浴の番人"},"4047":{"skill_id":"4047","skill_name":"滅びの願い"},"438":{"skill_id":"438","skill_name":"潜入"},"4075":{"skill_id":"4075","skill_name":"災厄の始まり"},"3041":{"skill_id":"3041","skill_name":"炎檻"},"499":{"skill_id":"499","skill_name":"無月の術"},"4231":{"skill_id":"4231","skill_name":"煌めく日射"},"404":{"skill_id":"404","skill_name":"煙幕"},"3054":{"skill_id":"3054","skill_name":"煽動"},"4229":{"skill_id":"4229","skill_name":"熱中ビーチ"},"4230":{"skill_id":"4230","skill_name":"熱狂ビーチ"},"4232":{"skill_id":"4232","skill_name":"燦然たる陽射"},"3057":{"skill_id":"3057","skill_name":"狂愛の花"},"4021":{"skill_id":"4021","skill_name":"狐の嫁入り"},"4020":{"skill_id":"4020","skill_name":"狐雨"},"4239":{"skill_id":"4239","skill_name":"猛る収奪者"},"408":{"skill_id":"408","skill_name":"獣心"},"100408":{"skill_id":"100408","skill_name":"獣魂の怒り"},"4066":{"skill_id":"4066","skill_name":"王命"},"100414":{"skill_id":"100414","skill_name":"甘言交渉"},"3097":{"skill_id":"3097","skill_name":"異の略奪者"},"4164":{"skill_id":"4164","skill_name":"瘴気"},"3029":{"skill_id":"3029","skill_name":"療治の教え"},"1610":{"skill_id":"1610","skill_name":"癒しの精霊ルゥ"},"4010":{"skill_id":"4010","skill_name":"白い闇"},"448":{"skill_id":"448","skill_name":"白銀の疾風"},"491":{"skill_id":"491","skill_name":"百物語"},"4242":{"skill_id":"4242","skill_name":"盛夏の大熱戦"},"3037":{"skill_id":"3037","skill_name":"看破"},"446":{"skill_id":"446","skill_name":"真夏の大攻勢"},"449":{"skill_id":"449","skill_name":"瞬歩"},"407":{"skill_id":"407","skill_name":"矢盾"},"1682":{"skill_id":"1682","skill_name":"短期決戦"},"1691":{"skill_id":"1691","skill_name":"石呪の双眸"},"1608":{"skill_id":"1608","skill_name":"石呪の瞳"},"4154":{"skill_id":"4154","skill_name":"砲門解放"},"4124":{"skill_id":"4124","skill_name":"破断の気"},"4111":{"skill_id":"4111","skill_name":"破滅への渇望"},"4162":{"skill_id":"4162","skill_name":"破邪の円舞"},"4055":{"skill_id":"4055","skill_name":"破魔の一矢"},"405":{"skill_id":"405","skill_name":"硬化"},"1630":{"skill_id":"1630","skill_name":"硬鉄の盾"},"4224":{"skill_id":"4224","skill_name":"祝宴の舞踊"},"4223":{"skill_id":"4223","skill_name":"祝縁の舞"},"3901":{"skill_id":"3901","skill_name":"神匠の耀き"},"100403":{"skill_id":"100403","skill_name":"神撃の戦斧"},"4227":{"skill_id":"4227","skill_name":"神狩の戦斧"},"3101":{"skill_id":"3101","skill_name":"禍福の果実"},"1665":{"skill_id":"1665","skill_name":"空梅雨"},"3022":{"skill_id":"3022","skill_name":"突破の啓示"},"4134":{"skill_id":"4134","skill_name":"竜滅"},"3099":{"skill_id":"3099","skill_name":"精彩の森"},"3100":{"skill_id":"3100","skill_name":"精彩の樹海"},"460":{"skill_id":"460","skill_name":"紫炎"},"406":{"skill_id":"406","skill_name":"結界"},"3085":{"skill_id":"3085","skill_name":"絶望への追及"},"4084":{"skill_id":"4084","skill_name":"羊毛の盾"},"1615":{"skill_id":"1615","skill_name":"耐陣【戦】"},"1614":{"skill_id":"1614","skill_name":"耐陣【飛】"},"1617":{"skill_id":"1617","skill_name":"耐陣【魔】"},"1650":{"skill_id":"1650","skill_name":"聖哲の領域"},"1628":{"skill_id":"1628","skill_name":"聖賢の領域"},"3015":{"skill_id":"3015","skill_name":"脅嚇"},"4076":{"skill_id":"4076","skill_name":"船隠し"},"4079":{"skill_id":"4079","skill_name":"艶紫のチャーム"},"3088":{"skill_id":"3088","skill_name":"花守の封印"},"4159":{"skill_id":"4159","skill_name":"花精の雫"},"416":{"skill_id":"416","skill_name":"英雄の歌"},"4137":{"skill_id":"4137","skill_name":"荒天"},"4046":{"skill_id":"4046","skill_name":"落鳥"},"1674":{"skill_id":"1674","skill_name":"薙ぎの剣閃"},"100409":{"skill_id":"100409","skill_name":"蠢動"},"493":{"skill_id":"493","skill_name":"裏切りの代償"},"4639":{"skill_id":"4639","skill_name":"記憶の継承"},"4218":{"skill_id":"4218","skill_name":"警告射撃"},"4120":{"skill_id":"4120","skill_name":"警砲"},"4061":{"skill_id":"4061","skill_name":"護りの剣"},"1611":{"skill_id":"1611","skill_name":"護りの精霊メェ"},"3086":{"skill_id":"3086","skill_name":"財宝の誘惑"},"100404":{"skill_id":"100404","skill_name":"赫気"},"4222":{"skill_id":"4222","skill_name":"轟嵐の旋律"},"1675":{"skill_id":"1675","skill_name":"退魔の祈り"},"1653":{"skill_id":"1653","skill_name":"進撃作戦"},"3106":{"skill_id":"3106","skill_name":"遊興の誘惑"},"485":{"skill_id":"485","skill_name":"邪気の呪"},"4247":{"skill_id":"4247","skill_name":"邪視の石眼"},"4207":{"skill_id":"4207","skill_name":"酩酊の火酒"},"4138":{"skill_id":"4138","skill_name":"銃華"},"1606":{"skill_id":"1606","skill_name":"鋼鉄の盾"},"1673":{"skill_id":"1673","skill_name":"鋼鉄の砦"},"3019":{"skill_id":"3019","skill_name":"鎮静の花束"},"4063":{"skill_id":"4063","skill_name":"闇の浸食"},"1667":{"skill_id":"1667","skill_name":"闇の鎖"},"1670":{"skill_id":"1670","skill_name":"闇夜の暗躍"},"4234":{"skill_id":"4234","skill_name":"闇夜猛襲"},"4102":{"skill_id":"4102","skill_name":"闇蛇"},"4037":{"skill_id":"4037","skill_name":"陣頭心滅"},"3067":{"skill_id":"3067","skill_name":"陶酔"},"489":{"skill_id":"489","skill_name":"隠密行動"},"4008":{"skill_id":"4008","skill_name":"隷気"},"3014":{"skill_id":"3014","skill_name":"雄叫び"},"4148":{"skill_id":"4148","skill_name":"集中突撃"},"4173":{"skill_id":"4173","skill_name":"難治の儀"},"3110":{"skill_id":"3110","skill_name":"霜土"},"4143":{"skill_id":"4143","skill_name":"風のエレメント"},"4142":{"skill_id":"4142","skill_name":"風のサイン"},"1696":{"skill_id":"1696","skill_name":"魔宵の紅桜"},"3032":{"skill_id":"3032","skill_name":"魔封帯"},"4009":{"skill_id":"4009","skill_name":"魔防の吹雪"},"1671":{"skill_id":"1671","skill_name":"魔防の嵐"},"3107":{"skill_id":"3107","skill_name":"魔除けの投刃"},"3059":{"skill_id":"3059","skill_name":"黒煙幕"},"402":{"skill_id":"402","skill_name":"黒鉄"},"4031":{"skill_id":"4031","skill_name":"龍の領域"},"4226":{"skill_id":"4226","skill_name":"龍妃の宣誓"},"4065":{"skill_id":"4065","skill_name":"龍王の領域"},"145":{"skill_id":"145","skill_name":"2ndインパルス"},"146":{"skill_id":"146","skill_name":"3rdインパルス"},"147":{"skill_id":"147","skill_name":"4thインパルス"},"66":{"skill_id":"66","skill_name":"【戦】殲滅"},"157":{"skill_id":"157","skill_name":"【戦】追撃"},"68":{"skill_id":"68","skill_name":"【獣】殲滅"},"160":{"skill_id":"160","skill_name":"【獣】追撃"},"67":{"skill_id":"67","skill_name":"【飛】殲滅"},"159":{"skill_id":"159","skill_name":"【飛】追撃"},"115":{"skill_id":"115","skill_name":"【魔】殲滅"},"158":{"skill_id":"158","skill_name":"【魔】追撃"},"15":{"skill_id":"15","skill_name":"からす"},"2011":{"skill_id":"2011","skill_name":"ごーれむの兵隊さん"},"2014":{"skill_id":"2014","skill_name":"ずばっといくわさ"},"16":{"skill_id":"16","skill_name":"そらきり"},"2038":{"skill_id":"2038","skill_name":"でたらめサンダー"},"37":{"skill_id":"37","skill_name":"どッかーーん"},"2118":{"skill_id":"2118","skill_name":"ばっさりいくわさ"},"2018":{"skill_id":"2018","skill_name":"ぶんまわし"},"2027":{"skill_id":"2027","skill_name":"アイアンボール"},"2248":{"skill_id":"2248","skill_name":"アイシクルストーム"},"1186":{"skill_id":"1186","skill_name":"アイスブランド・アーツ"},"88":{"skill_id":"88","skill_name":"アクアブラスト"},"2105":{"skill_id":"2105","skill_name":"アサルトラプター"},"2124":{"skill_id":"2124","skill_name":"アトミックバスター"},"77":{"skill_id":"77","skill_name":"アトミックブラスト"},"2415":{"skill_id":"2415","skill_name":"アルタートゥム・セス"},"2073":{"skill_id":"2073","skill_name":"アルタートゥム・フォース"},"21008":{"skill_id":"21008","skill_name":"アル・ヒューマ"},"1129":{"skill_id":"1129","skill_name":"アローレイン"},"62":{"skill_id":"62","skill_name":"アンデッド・ウォーリアー"},"121":{"skill_id":"121","skill_name":"イラプション"},"2049":{"skill_id":"2049","skill_name":"インパクトスクラッチ"},"86":{"skill_id":"86","skill_name":"インパクトブロー"},"21006":{"skill_id":"21006","skill_name":"インビジブル・プロヴィデンス"},"10596":{"skill_id":"10596","skill_name":"イートカウンター"},"6":{"skill_id":"6","skill_name":"ウィリーウィリー"},"56":{"skill_id":"56","skill_name":"ウインドスラスト"},"2120":{"skill_id":"2120","skill_name":"ウォーターショット"},"2139":{"skill_id":"2139","skill_name":"ウルヴスラッシュ"},"2091":{"skill_id":"2091","skill_name":"エアシュート"},"2059":{"skill_id":"2059","skill_name":"エアトリック"},"2009":{"skill_id":"2009","skill_name":"エアリアルグレイブ"},"2060":{"skill_id":"2060","skill_name":"エアレイド"},"2402":{"skill_id":"2402","skill_name":"エイトペネトレイト"},"21010":{"skill_id":"21010","skill_name":"エル・フーラ"},"21014":{"skill_id":"21014","skill_name":"エル・ミーニャ"},"2323":{"skill_id":"2323","skill_name":"エンシェントノヴァ"},"176":{"skill_id":"176","skill_name":"オーヴァークリティカル"},"4":{"skill_id":"4","skill_name":"オーヴァーターンド"},"10501":{"skill_id":"10501","skill_name":"カウンター"},"10577":{"skill_id":"10577","skill_name":"カウンターショット"},"10732":{"skill_id":"10732","skill_name":"カウンターバイト"},"10739":{"skill_id":"10739","skill_name":"カウンターバレット"},"10746":{"skill_id":"10746","skill_name":"カウンターロック"},"33":{"skill_id":"33","skill_name":"カジェルインパクト"},"2229":{"skill_id":"2229","skill_name":"カジェルクラッシュ"},"2429":{"skill_id":"2429","skill_name":"カプサイズ"},"2235":{"skill_id":"2235","skill_name":"カラミティスラッシャー"},"48":{"skill_id":"48","skill_name":"カースバイパー"},"2026":{"skill_id":"2026","skill_name":"カースリッパー"},"2607":{"skill_id":"2607","skill_name":"カーズウェーブ"},"2082":{"skill_id":"2082","skill_name":"カーズストーム"},"2219":{"skill_id":"2219","skill_name":"ガルーダダイブ"},"10733":{"skill_id":"10733","skill_name":"ガードカウンター"},"2035":{"skill_id":"2035","skill_name":"キャンディボム"},"2067":{"skill_id":"2067","skill_name":"ギフトランチャー"},"1111":{"skill_id":"1111","skill_name":"クラック・ショット"},"2121":{"skill_id":"2121","skill_name":"クラッシュヒール"},"142":{"skill_id":"142","skill_name":"クリティカル"},"10568":{"skill_id":"10568","skill_name":"クリティカルカウンター"},"2215":{"skill_id":"2215","skill_name":"クルーエルリッパー"},"2366":{"skill_id":"2366","skill_name":"クレイモア"},"10598":{"skill_id":"10598","skill_name":"クロスカウンター"},"2080":{"skill_id":"2080","skill_name":"グリルトルチュール"},"36":{"skill_id":"36","skill_name":"グレートソード"},"2095":{"skill_id":"2095","skill_name":"ケイオスフラッド"},"2158":{"skill_id":"2158","skill_name":"コンフューズボンバー"},"2206":{"skill_id":"2206","skill_name":"サイコキネシス"},"2347":{"skill_id":"2347","skill_name":"サニーフィーバー"},"1105":{"skill_id":"1105","skill_name":"サプライズキャノン"},"2148":{"skill_id":"2148","skill_name":"サンダースパーク"},"134":{"skill_id":"134","skill_name":"サンダーボルト"},"39":{"skill_id":"39","skill_name":"サンドストーム"},"32":{"skill_id":"32","skill_name":"サンド・オブ・ナイトメア"},"89":{"skill_id":"89","skill_name":"サンフォースフライト"},"2348":{"skill_id":"2348","skill_name":"サンライトフィーバー"},"178":{"skill_id":"178","skill_name":"サーチレーザー"},"20":{"skill_id":"20","skill_name":"ザクロ弾"},"2047":{"skill_id":"2047","skill_name":"シストラムの奏"},"2046":{"skill_id":"2046","skill_name":"シストラムの音"},"2272":{"skill_id":"2272","skill_name":"シックスペネトレイト"},"2409":{"skill_id":"2409","skill_name":"シャイニーフライト"},"2100":{"skill_id":"2100","skill_name":"ショックスライサー"},"2099":{"skill_id":"2099","skill_name":"ショックナイフ"},"2268":{"skill_id":"2268","skill_name":"シールドスマッシュ"},"2154":{"skill_id":"2154","skill_name":"シールドバッシュ"},"10743":{"skill_id":"10743","skill_name":"ジャストカウンター"},"2078":{"skill_id":"2078","skill_name":"ジャベリンレイン"},"124":{"skill_id":"124","skill_name":"スイーツシュート"},"1115":{"skill_id":"1115","skill_name":"スティールトラップ"},"2187":{"skill_id":"2187","skill_name":"ストライクハント"},"2256":{"skill_id":"2256","skill_name":"スノウシューティング"},"128":{"skill_id":"128","skill_name":"スパークショット"},"34":{"skill_id":"34","skill_name":"スピットファイア"},"2093":{"skill_id":"2093","skill_name":"スピットブレイズ"},"2285":{"skill_id":"2285","skill_name":"スプラッシュショット"},"100118":{"skill_id":"100118","skill_name":"スプラッシュビームⅠ"},"100119":{"skill_id":"100119","skill_name":"スプラッシュビームⅡ"},"100120":{"skill_id":"100120","skill_name":"スプラッシュビームⅢ"},"100121":{"skill_id":"100121","skill_name":"スプラッシュビームⅣ"},"1107":{"skill_id":"1107","skill_name":"スプリングレイン"},"2086":{"skill_id":"2086","skill_name":"スプレッドボンバー"},"2318":{"skill_id":"2318","skill_name":"スペルブロー"},"2110":{"skill_id":"2110","skill_name":"スライサードレイン"},"175":{"skill_id":"175","skill_name":"スラッシュクッキング"},"12":{"skill_id":"12","skill_name":"スリーショット"},"2064":{"skill_id":"2064","skill_name":"スリースラッシュ"},"2115":{"skill_id":"2115","skill_name":"スリープヒット"},"2070":{"skill_id":"2070","skill_name":"スリーペネトレイト"},"2199":{"skill_id":"2199","skill_name":"スリー・ヒート・ウェーブ"},"81":{"skill_id":"81","skill_name":"スリー・ラウンド・バースト"},"2224":{"skill_id":"2224","skill_name":"スロータードラゴン"},"42":{"skill_id":"42","skill_name":"スローボム"},"2306":{"skill_id":"2306","skill_name":"セブンスショット"},"93":{"skill_id":"93","skill_name":"ソウルイーター"},"161":{"skill_id":"161","skill_name":"ソウルスティール"},"2181":{"skill_id":"2181","skill_name":"ソードカルテット"},"2233":{"skill_id":"2233","skill_name":"タイダルウェーブ"},"2317":{"skill_id":"2317","skill_name":"ダウンサイクロン"},"2096":{"skill_id":"2096","skill_name":"ダウンストーム"},"2043":{"skill_id":"2043","skill_name":"ダブルインパクト"},"162":{"skill_id":"162","skill_name":"ダブルクラッチ"},"187":{"skill_id":"187","skill_name":"ダブルシャフト"},"2065":{"skill_id":"2065","skill_name":"ダブルバレット"},"2112":{"skill_id":"2112","skill_name":"ダブルブラスト"},"2338":{"skill_id":"2338","skill_name":"ダブルボム"},"2032":{"skill_id":"2032","skill_name":"ダマスカスの一太刀"},"1117":{"skill_id":"1117","skill_name":"チェインカース"},"2330":{"skill_id":"2330","skill_name":"チャーミーヴァンプ"},"2098":{"skill_id":"2098","skill_name":"ツインステップ"},"2134":{"skill_id":"2134","skill_name":"ツヴァイヘンダー"},"2341":{"skill_id":"2341","skill_name":"テリングショットガン"},"27":{"skill_id":"27","skill_name":"テレキネシス"},"2039":{"skill_id":"2039","skill_name":"ディアボリックエッジ"},"2416":{"skill_id":"2416","skill_name":"ディープ・シー"},"2085":{"skill_id":"2085","skill_name":"ディープ・ブルー"},"14":{"skill_id":"14","skill_name":"デビルズウィスパー"},"70":{"skill_id":"70","skill_name":"デモンズラッシュ"},"171":{"skill_id":"171","skill_name":"デュアルスラッシュ"},"2180":{"skill_id":"2180","skill_name":"デュアルブロー"},"2204":{"skill_id":"2204","skill_name":"デュアルレーザー"},"2114":{"skill_id":"2114","skill_name":"デューズ・ワイルズ"},"2297":{"skill_id":"2297","skill_name":"デンジャービーチ"},"1108":{"skill_id":"1108","skill_name":"トラップショット"},"1118":{"skill_id":"1118","skill_name":"トラップブリッツ"},"163":{"skill_id":"163","skill_name":"トリプルアクセル"},"2310":{"skill_id":"2310","skill_name":"トリプルインパクト"},"2196":{"skill_id":"2196","skill_name":"トリプルエッジ"},"2092":{"skill_id":"2092","skill_name":"トリプルシャフト"},"1119":{"skill_id":"1119","skill_name":"トリプルショット"},"2414":{"skill_id":"2414","skill_name":"トリプルブレイズ"},"2220":{"skill_id":"2220","skill_name":"トリプルブロー"},"2337":{"skill_id":"2337","skill_name":"トリプルレーザー"},"2430":{"skill_id":"2430","skill_name":"トルベジーノ"},"2291":{"skill_id":"2291","skill_name":"ドリームエアー"},"10562":{"skill_id":"10562","skill_name":"ドレインカウンター"},"73":{"skill_id":"73","skill_name":"ドレインブースト"},"74":{"skill_id":"74","skill_name":"ドレインリカバー"},"2081":{"skill_id":"2081","skill_name":"ドレインレーザー"},"2386":{"skill_id":"2386","skill_name":"ドレッドバーサーカー"},"2030":{"skill_id":"2030","skill_name":"ドレッドファイアー"},"2214":{"skill_id":"2214","skill_name":"ドレッドリッパー"},"76":{"skill_id":"76","skill_name":"ドローブラッド"},"2188":{"skill_id":"2188","skill_name":"ナイヴスシューター"},"2246":{"skill_id":"2246","skill_name":"ナイヴスバンカー"},"2269":{"skill_id":"2269","skill_name":"ハイビロウ"},"2334":{"skill_id":"2334","skill_name":"ハッピーランチャー"},"2302":{"skill_id":"2302","skill_name":"ハリケーン"},"10724":{"skill_id":"10724","skill_name":"ハードカウンター"},"2382":{"skill_id":"2382","skill_name":"ハードスタンプ"},"2090":{"skill_id":"2090","skill_name":"ハーフレーザー"},"2094":{"skill_id":"2094","skill_name":"バイタルラッシュ"},"2301":{"skill_id":"2301","skill_name":"バスタークロー"},"2165":{"skill_id":"2165","skill_name":"バスターショット"},"87":{"skill_id":"87","skill_name":"バスターランス"},"2371":{"skill_id":"2371","skill_name":"バッククラッシュ"},"2102":{"skill_id":"2102","skill_name":"バッククリティカル"},"122":{"skill_id":"122","skill_name":"バルムンク"},"1103":{"skill_id":"1103","skill_name":"バレットストーム"},"1113":{"skill_id":"1113","skill_name":"バレットパレード"},"2265":{"skill_id":"2265","skill_name":"バレットラッシュ"},"1101":{"skill_id":"1101","skill_name":"バレットレイン"},"131":{"skill_id":"131","skill_name":"バーサーカー"},"45":{"skill_id":"45","skill_name":"バーニングウィップ"},"133":{"skill_id":"133","skill_name":"バーニングクロウ"},"2267":{"skill_id":"2267","skill_name":"バーンアウト"},"1123":{"skill_id":"1123","skill_name":"バーンブラック"},"1122":{"skill_id":"1122","skill_name":"バーンレッド"},"92":{"skill_id":"92","skill_name":"パラライシス"},"100102":{"skill_id":"100102","skill_name":"パラリィジィボム"},"2116":{"skill_id":"2116","skill_name":"パワーショット"},"1106":{"skill_id":"1106","skill_name":"ヒドゥンイーター"},"21007":{"skill_id":"21007","skill_name":"ヒューマ"},"2077":{"skill_id":"2077","skill_name":"ファイアウェーブ"},"1133":{"skill_id":"1133","skill_name":"ファイアフラワー"},"91":{"skill_id":"91","skill_name":"ファイアブレス"},"2051":{"skill_id":"2051","skill_name":"ファイアブロー"},"2195":{"skill_id":"2195","skill_name":"ファイアレイン"},"1116":{"skill_id":"1116","skill_name":"ファイアワークス"},"2217":{"skill_id":"2217","skill_name":"ファイアーダンス"},"2432":{"skill_id":"2432","skill_name":"ファイブショット"},"2307":{"skill_id":"2307","skill_name":"ファントムブラスト"},"2324":{"skill_id":"2324","skill_name":"フィアースグライド"},"94":{"skill_id":"94","skill_name":"フィアースラッシュ"},"18":{"skill_id":"18","skill_name":"フィアーパニッシャー"},"2501":{"skill_id":"2501","skill_name":"フィアーブレイズ"},"10591":{"skill_id":"10591","skill_name":"フェイタルカウンター"},"2315":{"skill_id":"2315","skill_name":"フォーリンギフト"},"2200":{"skill_id":"2200","skill_name":"フォー・ヒート・ウェーブ"},"2140":{"skill_id":"2140","skill_name":"フォー・ラウンド・バースト"},"164":{"skill_id":"164","skill_name":"フックブロー"},"2020":{"skill_id":"2020","skill_name":"フューリアスストーム"},"17":{"skill_id":"17","skill_name":"フラッシュショット"},"2259":{"skill_id":"2259","skill_name":"フラッシュトリガー"},"2177":{"skill_id":"2177","skill_name":"フラワーバレット"},"2190":{"skill_id":"2190","skill_name":"フラワー・シャワー"},"103":{"skill_id":"103","skill_name":"フリークウェーブ"},"127":{"skill_id":"127","skill_name":"フレイム"},"2136":{"skill_id":"2136","skill_name":"フレイムアクス"},"2250":{"skill_id":"2250","skill_name":"フレイムアロー"},"46":{"skill_id":"46","skill_name":"フレイムウィップ"},"2352":{"skill_id":"2352","skill_name":"フレイムダンプ"},"151":{"skill_id":"151","skill_name":"フレンジー"},"2088":{"skill_id":"2088","skill_name":"フロラ・バースト"},"2097":{"skill_id":"2097","skill_name":"フローズンシューター"},"21009":{"skill_id":"21009","skill_name":"フーラ"},"2208":{"skill_id":"2208","skill_name":"ブラストグレイブ"},"51":{"skill_id":"51","skill_name":"ブラッディスラッシャー"},"2243":{"skill_id":"2243","skill_name":"ブラッディブレード"},"2242":{"skill_id":"2242","skill_name":"ブラッディレイ"},"132":{"skill_id":"132","skill_name":"ブラッドサッカー"},"2045":{"skill_id":"2045","skill_name":"ブラッドスマッシュ"},"2034":{"skill_id":"2034","skill_name":"ブラッドソード"},"143":{"skill_id":"143","skill_name":"ブラッドハンマー"},"2175":{"skill_id":"2175","skill_name":"ブラッドブレイド"},"2066":{"skill_id":"2066","skill_name":"ブラッドラッシュ"},"2160":{"skill_id":"2160","skill_name":"ブリザードダンス"},"2245":{"skill_id":"2245","skill_name":"ブリザードワルツ"},"9":{"skill_id":"9","skill_name":"ブルズアイショットガン"},"13":{"skill_id":"13","skill_name":"ブルーインパルス"},"2351":{"skill_id":"2351","skill_name":"ブルークラッシュ"},"2019":{"skill_id":"2019","skill_name":"ブルータルエッジ"},"2226":{"skill_id":"2226","skill_name":"ブルータルブリザード"},"2350":{"skill_id":"2350","skill_name":"ブレイズウィップ"},"100114":{"skill_id":"100114","skill_name":"ブレイズピアース"},"2083":{"skill_id":"2083","skill_name":"プラズマボール"},"60":{"skill_id":"60","skill_name":"プレゼントばくだん"},"61":{"skill_id":"61","skill_name":"ヘイルストーム"},"2056":{"skill_id":"2056","skill_name":"ヘルファイア"},"2263":{"skill_id":"2263","skill_name":"ヘルフレイム"},"2162":{"skill_id":"2162","skill_name":"ヘルラッシュ"},"2048":{"skill_id":"2048","skill_name":"ヘヴィクルーエル"},"2192":{"skill_id":"2192","skill_name":"ヘヴィシューター"},"174":{"skill_id":"174","skill_name":"ヘヴィショット"},"129":{"skill_id":"129","skill_name":"ヘヴィスタンプ"},"156":{"skill_id":"156","skill_name":"ヘヴィストライク"},"2028":{"skill_id":"2028","skill_name":"ヘヴィパラライシス"},"190":{"skill_id":"190","skill_name":"ベノムファング"},"2300":{"skill_id":"2300","skill_name":"ベノムブラスト"},"2260":{"skill_id":"2260","skill_name":"ペインストーム"},"2152":{"skill_id":"2152","skill_name":"ペインブラスター"},"8":{"skill_id":"8","skill_name":"ホーリーナイトスター"},"1120":{"skill_id":"1120","skill_name":"ホーリーレイン"},"189":{"skill_id":"189","skill_name":"ポイズンバイト"},"10730":{"skill_id":"10730","skill_name":"マイティカウンター"},"53":{"skill_id":"53","skill_name":"マグマドライブ"},"2383":{"skill_id":"2383","skill_name":"マジカルボンバー"},"2606":{"skill_id":"2606","skill_name":"マジックウェーブ"},"150":{"skill_id":"150","skill_name":"マジックストーム"},"2040":{"skill_id":"2040","skill_name":"マジックスラスト"},"65":{"skill_id":"65","skill_name":"マジックレイ"},"55":{"skill_id":"55","skill_name":"マナスプラッシュ"},"100109":{"skill_id":"100109","skill_name":"マルチショット"},"2474":{"skill_id":"2474","skill_name":"ミストラルカット"},"10567":{"skill_id":"10567","skill_name":"ミドルカウンター"},"21013":{"skill_id":"21013","skill_name":"ミーニャ"},"2210":{"skill_id":"2210","skill_name":"ムーンフォール"},"2062":{"skill_id":"2062","skill_name":"ムーンレイ"},"97":{"skill_id":"97","skill_name":"メテオシャワー"},"2372":{"skill_id":"2372","skill_name":"メテオストーム"},"40":{"skill_id":"40","skill_name":"メテオレイン"},"2408":{"skill_id":"2408","skill_name":"モータルバースト"},"10713":{"skill_id":"10713","skill_name":"モード・プリムラ"},"2391":{"skill_id":"2391","skill_name":"ライジングショット"},"148":{"skill_id":"148","skill_name":"ライトニング"},"2068":{"skill_id":"2068","skill_name":"ラインブリザード"},"2052":{"skill_id":"2052","skill_name":"ラジカルスタンプ"},"165":{"skill_id":"165","skill_name":"ラッシュ＋１"},"166":{"skill_id":"166","skill_name":"ラッシュ＋２"},"1102":{"skill_id":"1102","skill_name":"ラピッドショット"},"2087":{"skill_id":"2087","skill_name":"ランスパラライズ"},"2017":{"skill_id":"2017","skill_name":"ランスマッシャー"},"2289":{"skill_id":"2289","skill_name":"ランページ"},"2947":{"skill_id":"2947","skill_name":"リーサルショット"},"2109":{"skill_id":"2109","skill_name":"ルミナスビーム"},"172":{"skill_id":"172","skill_name":"ルミナスレーザー"},"95":{"skill_id":"95","skill_name":"レイジインパクト"},"10710":{"skill_id":"10710","skill_name":"レイジカウンター"},"59":{"skill_id":"59","skill_name":"レイジブラスト"},"2270":{"skill_id":"2270","skill_name":"レイジングビロウ"},"80":{"skill_id":"80","skill_name":"レイジーヴァンプ"},"139":{"skill_id":"139","skill_name":"レーザーショット"},"2388":{"skill_id":"2388","skill_name":"ロックオンバースト"},"75":{"skill_id":"75","skill_name":"ロングエイムピアース"},"2399":{"skill_id":"2399","skill_name":"ローグウェーブ"},"2400":{"skill_id":"2400","skill_name":"ローグストリーム"},"35":{"skill_id":"35","skill_name":"ワイドレンジショット"},"2108":{"skill_id":"2108","skill_name":"ワイルドカード"},"1":{"skill_id":"1","skill_name":"ヴァイオレンスタックル"},"2075":{"skill_id":"2075","skill_name":"ヴァイオレントバーサーカー"},"100129":{"skill_id":"100129","skill_name":"ヴァイスフィアースラッシュ"},"2058":{"skill_id":"2058","skill_name":"ヴァイスラッシュ"},"2387":{"skill_id":"2387","skill_name":"ヴェノムバイパー"},"144":{"skill_id":"144","skill_name":"一刀両断"},"2367":{"skill_id":"2367","skill_name":"一点突破"},"104":{"skill_id":"104","skill_name":"一閃"},"69":{"skill_id":"69","skill_name":"一閃【参式】"},"188":{"skill_id":"188","skill_name":"一閃【弐式】"},"2194":{"skill_id":"2194","skill_name":"七凶乱"},"2373":{"skill_id":"2373","skill_name":"七凶破"},"2368":{"skill_id":"2368","skill_name":"万花興乱"},"111":{"skill_id":"111","skill_name":"三乱撃"},"136":{"skill_id":"136","skill_name":"三凶撃"},"2325":{"skill_id":"2325","skill_name":"三刀両断"},"169":{"skill_id":"169","skill_name":"三尺牡丹"},"2902":{"skill_id":"2902","skill_name":"三弓撃"},"2076":{"skill_id":"2076","skill_name":"三斬華"},"2213":{"skill_id":"2213","skill_name":"三日月シャッセ"},"2212":{"skill_id":"2212","skill_name":"三日月ステップ"},"2111":{"skill_id":"2111","skill_name":"三禍斬"},"2123":{"skill_id":"2123","skill_name":"三連乱槍"},"2041":{"skill_id":"2041","skill_name":"不吉な泣き声"},"106":{"skill_id":"106","skill_name":"乱射"},"107":{"skill_id":"107","skill_name":"乱戦"},"2211":{"skill_id":"2211","skill_name":"乱撃"},"2444":{"skill_id":"2444","skill_name":"乱気流"},"83":{"skill_id":"83","skill_name":"乱闘"},"2155":{"skill_id":"2155","skill_name":"乾坤一擲"},"109":{"skill_id":"109","skill_name":"二乱撃"},"135":{"skill_id":"135","skill_name":"二凶撃"},"25":{"skill_id":"25","skill_name":"二刀両断"},"2016":{"skill_id":"2016","skill_name":"五乱撃"},"2209":{"skill_id":"2209","skill_name":"五凶乱"},"2":{"skill_id":"2","skill_name":"五凶撃"},"2071":{"skill_id":"2071","skill_name":"五凶破"},"10":{"skill_id":"10","skill_name":"五月雨"},"2230":{"skill_id":"2230","skill_name":"休息のトリオ"},"10742":{"skill_id":"10742","skill_name":"儚恋カウンター"},"2314":{"skill_id":"2314","skill_name":"光輝なる霜刃"},"2446":{"skill_id":"2446","skill_name":"八凶撃"},"119":{"skill_id":"119","skill_name":"八雲"},"47":{"skill_id":"47","skill_name":"六凶撃"},"2084":{"skill_id":"2084","skill_name":"六剣舞"},"2392":{"skill_id":"2392","skill_name":"六矛断ち"},"2261":{"skill_id":"2261","skill_name":"冥府流し"},"2159":{"skill_id":"2159","skill_name":"凍海の鐘"},"105":{"skill_id":"105","skill_name":"凶撃"},"1121":{"skill_id":"1121","skill_name":"刻死の瞬き"},"2101":{"skill_id":"2101","skill_name":"剛射"},"126":{"skill_id":"126","skill_name":"剣舞"},"100123":{"skill_id":"100123","skill_name":"厄斬祓"},"100106":{"skill_id":"100106","skill_name":"参魂両断"},"2413":{"skill_id":"2413","skill_name":"双蛇影刻"},"2183":{"skill_id":"2183","skill_name":"双陣・滅殺剣"},"100103":{"skill_id":"100103","skill_name":"叩きつける"},"2129":{"skill_id":"2129","skill_name":"召喚・三叉剣龍"},"2127":{"skill_id":"2127","skill_name":"召喚・剣龍"},"2128":{"skill_id":"2128","skill_name":"召喚・双剣龍"},"2328":{"skill_id":"2328","skill_name":"呪怨の嵐"},"2033":{"skill_id":"2033","skill_name":"呪毒の霧"},"2135":{"skill_id":"2135","skill_name":"呪穢の霧"},"2255":{"skill_id":"2255","skill_name":"命を喰らう"},"2042":{"skill_id":"2042","skill_name":"嘆きの泣き声"},"113":{"skill_id":"113","skill_name":"四乱撃"},"137":{"skill_id":"137","skill_name":"四凶撃"},"2053":{"skill_id":"2053","skill_name":"四尺牡丹"},"2298":{"skill_id":"2298","skill_name":"回旋槍舞"},"177":{"skill_id":"177","skill_name":"地獄送り"},"2533":{"skill_id":"2533","skill_name":"地鳴り"},"2223":{"skill_id":"2223","skill_name":"堕々葬刀"},"2359":{"skill_id":"2359","skill_name":"堕剣アブディエル"},"2138":{"skill_id":"2138","skill_name":"堕獄のメッサー"},"100130":{"skill_id":"100130","skill_name":"夏の型・龍の太刀"},"100131":{"skill_id":"100131","skill_name":"夏の型・龍焔の大太刀"},"2312":{"skill_id":"2312","skill_name":"大廻風"},"85":{"skill_id":"85","skill_name":"大旋風"},"38":{"skill_id":"38","skill_name":"天叢雲剣"},"2534":{"skill_id":"2534","skill_name":"天地無情"},"2356":{"skill_id":"2356","skill_name":"天真闘斧"},"2364":{"skill_id":"2364","skill_name":"天翼のフリート"},"2332":{"skill_id":"2332","skill_name":"天轟万雷"},"2331":{"skill_id":"2331","skill_name":"天鳴百雷"},"2342":{"skill_id":"2342","skill_name":"奪命刃"},"2164":{"skill_id":"2164","skill_name":"奮攻一迅"},"2153":{"skill_id":"2153","skill_name":"妖力解放"},"2137":{"skill_id":"2137","skill_name":"妖星豪嵐"},"2231":{"skill_id":"2231","skill_name":"安寧のクインテット"},"2353":{"skill_id":"2353","skill_name":"密林の豪雨"},"2015":{"skill_id":"2015","skill_name":"封縛の邪眼"},"2357":{"skill_id":"2357","skill_name":"小悪魔閃斧"},"130":{"skill_id":"130","skill_name":"居合い"},"2370":{"skill_id":"2370","skill_name":"居相一閃"},"24":{"skill_id":"24","skill_name":"巳酒乱"},"2119":{"skill_id":"2119","skill_name":"巳酒濫"},"2251":{"skill_id":"2251","skill_name":"平癒の双撃"},"2333":{"skill_id":"2333","skill_name":"幸輝剣・６刃"},"2335":{"skill_id":"2335","skill_name":"幸輝剣・８刃"},"2282":{"skill_id":"2282","skill_name":"幻夢妖演武"},"2169":{"skill_id":"2169","skill_name":"幻惑演武"},"2168":{"skill_id":"2168","skill_name":"幻演武"},"2252":{"skill_id":"2252","skill_name":"廻天の転撃"},"1114":{"skill_id":"1114","skill_name":"弾嵐"},"2189":{"skill_id":"2189","skill_name":"心魂狩り"},"2327":{"skill_id":"2327","skill_name":"怨念の風"},"100112":{"skill_id":"100112","skill_name":"恐心の光弾"},"2216":{"skill_id":"2216","skill_name":"悪夢送り"},"2294":{"skill_id":"2294","skill_name":"慄然の水撃"},"2296":{"skill_id":"2296","skill_name":"戦慄の水弾"},"153":{"skill_id":"153","skill_name":"打ち出の小槌"},"2407":{"skill_id":"2407","skill_name":"捌魂両断"},"2151":{"skill_id":"2151","skill_name":"捲土重来"},"101":{"skill_id":"101","skill_name":"撃沈"},"2193":{"skill_id":"2193","skill_name":"撃砲"},"2234":{"skill_id":"2234","skill_name":"攻の型・大連火"},"2029":{"skill_id":"2029","skill_name":"攻の型・火連"},"2344":{"skill_id":"2344","skill_name":"攻の型・熱波"},"138":{"skill_id":"138","skill_name":"斬鉄"},"1110":{"skill_id":"1110","skill_name":"斬雨"},"2228":{"skill_id":"2228","skill_name":"断命"},"2178":{"skill_id":"2178","skill_name":"新緑の風"},"2381":{"skill_id":"2381","skill_name":"春嵐の激攻"},"49":{"skill_id":"49","skill_name":"春風の猛攻"},"2271":{"skill_id":"2271","skill_name":"暴射"},"2422":{"skill_id":"2422","skill_name":"来光三閃"},"2069":{"skill_id":"2069","skill_name":"来光二閃"},"2176":{"skill_id":"2176","skill_name":"栄光の一振り"},"2089":{"skill_id":"2089","skill_name":"桜ふぶき"},"1109":{"skill_id":"1109","skill_name":"桜流"},"2205":{"skill_id":"2205","skill_name":"業火一閃"},"10561":{"skill_id":"10561","skill_name":"構えの型・火血刀"},"44":{"skill_id":"44","skill_name":"正義の大剣"},"2384":{"skill_id":"2384","skill_name":"波動砲"},"30":{"skill_id":"30","skill_name":"波斬"},"2012":{"skill_id":"2012","skill_name":"波間の暗殺"},"2025":{"skill_id":"2025","skill_name":"流星"},"2044":{"skill_id":"2044","skill_name":"滅殺剣"},"2358":{"skill_id":"2358","skill_name":"滅界"},"120":{"skill_id":"120","skill_name":"滅陣剣"},"2225":{"skill_id":"2225","skill_name":"滅震"},"28":{"skill_id":"28","skill_name":"激震"},"19":{"skill_id":"19","skill_name":"灼熱の吐息"},"2393":{"skill_id":"2393","skill_name":"炎天"},"2295":{"skill_id":"2295","skill_name":"炎天の瞬刃"},"2198":{"skill_id":"2198","skill_name":"烈日の瞬刃"},"2031":{"skill_id":"2031","skill_name":"烈火"},"29":{"skill_id":"29","skill_name":"煉獄のメッサー"},"100127":{"skill_id":"100127","skill_name":"煉獄の咆哮"},"2290":{"skill_id":"2290","skill_name":"煌星奏乱"},"1104":{"skill_id":"1104","skill_name":"煌春"},"100117":{"skill_id":"100117","skill_name":"煌翼のレギオン"},"100115":{"skill_id":"100115","skill_name":"爆滅の一撃"},"100125":{"skill_id":"100125","skill_name":"独占の愛"},"100126":{"skill_id":"100126","skill_name":"独愛支配"},"2197":{"skill_id":"2197","skill_name":"猛攻一迅"},"173":{"skill_id":"173","skill_name":"猛毒の霧"},"2305":{"skill_id":"2305","skill_name":"猛炎"},"2186":{"skill_id":"2186","skill_name":"猛爆"},"2262":{"skill_id":"2262","skill_name":"獄炎剣舞"},"100116":{"skill_id":"100116","skill_name":"獄界"},"100128":{"skill_id":"100128","skill_name":"獣王の激震"},"2166":{"skill_id":"2166","skill_name":"生を喰らう"},"2054":{"skill_id":"2054","skill_name":"疾雷"},"2126":{"skill_id":"2126","skill_name":"疾風怒濤"},"57":{"skill_id":"57","skill_name":"疾駆"},"2398":{"skill_id":"2398","skill_name":"疾駆連蹴"},"50":{"skill_id":"50","skill_name":"発勁"},"2010":{"skill_id":"2010","skill_name":"百獣の行進"},"154":{"skill_id":"154","skill_name":"百花終乱"},"22":{"skill_id":"22","skill_name":"百鬼夜行"},"2303":{"skill_id":"2303","skill_name":"皐月雨"},"2346":{"skill_id":"2346","skill_name":"破の型・大焦滅"},"2345":{"skill_id":"2345","skill_name":"破の型・焦船"},"2167":{"skill_id":"2167","skill_name":"破滅の一撃"},"100104":{"skill_id":"100104","skill_name":"破界"},"2395":{"skill_id":"2395","skill_name":"神殺の一撃"},"100124":{"skill_id":"100124","skill_name":"祥馬開弓"},"2161":{"skill_id":"2161","skill_name":"突き羽根"},"43":{"skill_id":"43","skill_name":"竜神の怒り"},"2264":{"skill_id":"2264","skill_name":"紅の明星"},"2074":{"skill_id":"2074","skill_name":"紅風刃"},"2316":{"skill_id":"2316","skill_name":"紫炎の波濤"},"54":{"skill_id":"54","skill_name":"紫電"},"2240":{"skill_id":"2240","skill_name":"紫電一閃"},"2288":{"skill_id":"2288","skill_name":"緋色のマリアージュ"},"2232":{"skill_id":"2232","skill_name":"聖夜のジングル"},"2361":{"skill_id":"2361","skill_name":"聖天の極剣"},"3":{"skill_id":"3","skill_name":"聖拳ロックアース"},"1112":{"skill_id":"1112","skill_name":"臆せば死"},"79":{"skill_id":"79","skill_name":"船壊の波浪"},"2037":{"skill_id":"2037","skill_name":"船壊の激砲"},"84":{"skill_id":"84","skill_name":"船撃の凶歌"},"2207":{"skill_id":"2207","skill_name":"船滅の波浪"},"2336":{"skill_id":"2336","skill_name":"船砕の猛攻"},"170":{"skill_id":"170","skill_name":"船破"},"2061":{"skill_id":"2061","skill_name":"船穴"},"2385":{"skill_id":"2385","skill_name":"艦砲射撃"},"2266":{"skill_id":"2266","skill_name":"艶緑の春嵐"},"2379":{"skill_id":"2379","skill_name":"花散る風炎"},"2380":{"skill_id":"2380","skill_name":"華火咲裂"},"100113":{"skill_id":"100113","skill_name":"蛇吞三宝"},"2412":{"skill_id":"2412","skill_name":"蛇影刻"},"5":{"skill_id":"5","skill_name":"蛇石のサクリファイス"},"2901":{"skill_id":"2901","skill_name":"衝撃貫通"},"2365":{"skill_id":"2365","skill_name":"覇断の連撃"},"10740":{"skill_id":"10740","skill_name":"誓約の白刃"},"41":{"skill_id":"41","skill_name":"誘眠の矢"},"168":{"skill_id":"168","skill_name":"貫船"},"102":{"skill_id":"102","skill_name":"貫通"},"58":{"skill_id":"58","skill_name":"起死回生"},"140":{"skill_id":"140","skill_name":"轟沈"},"100108":{"skill_id":"100108","skill_name":"轟雷球"},"96":{"skill_id":"96","skill_name":"逆境"},"10737":{"skill_id":"10737","skill_name":"逆鱗"},"155":{"skill_id":"155","skill_name":"運否天賦"},"10738":{"skill_id":"10738","skill_name":"道連れ"},"2293":{"skill_id":"2293","skill_name":"邪石のサクリファイス"},"100101":{"skill_id":"100101","skill_name":"重撃"},"21011":{"skill_id":"21011","skill_name":"鉄球砕"},"21012":{"skill_id":"21012","skill_name":"鉄球轟砕"},"2369":{"skill_id":"2369","skill_name":"長者の宝槌"},"2145":{"skill_id":"2145","skill_name":"閃耀"},"2249":{"skill_id":"2249","skill_name":"闇眠の矢"},"2273":{"skill_id":"2273","skill_name":"闘波斬"},"2144":{"skill_id":"2144","skill_name":"集命剣"},"2239":{"skill_id":"2239","skill_name":"雷光一閃"},"2423":{"skill_id":"2423","skill_name":"雷奔掌"},"2150":{"skill_id":"2150","skill_name":"雷嵐の銛"},"2394":{"skill_id":"2394","skill_name":"雷轟"},"2079":{"skill_id":"2079","skill_name":"雷閃"},"72":{"skill_id":"72","skill_name":"雷電"},"2149":{"skill_id":"2149","skill_name":"雷風刃"},"2013":{"skill_id":"2013","skill_name":"青嵐"},"2117":{"skill_id":"2117","skill_name":"青嵐颯々"},"100111":{"skill_id":"100111","skill_name":"風切"},"2378":{"skill_id":"2378","skill_name":"風炎"},"152":{"skill_id":"152","skill_name":"飛鷹"},"64":{"skill_id":"64","skill_name":"鬼流斬鉄"},"2146":{"skill_id":"2146","skill_name":"魂喰らい"},"11":{"skill_id":"11","skill_name":"魔剣アブディエル"},"179":{"skill_id":"179","skill_name":"魔力開放"},"23":{"skill_id":"23","skill_name":"魔眼"},"2179":{"skill_id":"2179","skill_name":"鮮緑の春風"},"7":{"skill_id":"7","skill_name":"鳳舞"},"2142":{"skill_id":"2142","skill_name":"鳴神"},"2182":{"skill_id":"2182","skill_name":"黒真珠BOMB"},"2326":{"skill_id":"2326","skill_name":"龍剣烈断"},"21":{"skill_id":"21","skill_name":"龍姫の羽撃き"},"2473":{"skill_id":"2473","skill_name":"２中炎"},"117":{"skill_id":"117","skill_name":"２乱射"},"141":{"skill_id":"141","skill_name":"２乱戦"},"125":{"skill_id":"125","skill_name":"２乱舞"},"2106":{"skill_id":"2106","skill_name":"２壊戦"},"2329":{"skill_id":"2329","skill_name":"２暴射"},"2104":{"skill_id":"2104","skill_name":"２段剛射"},"2354":{"skill_id":"2354","skill_name":"２海撃"},"2236":{"skill_id":"2236","skill_name":"２砲撃"},"2157":{"skill_id":"2157","skill_name":"２貫船"},"108":{"skill_id":"108","skill_name":"２連撃"},"167":{"skill_id":"167","skill_name":"２連沈"},"82":{"skill_id":"82","skill_name":"２連突"},"2237":{"skill_id":"2237","skill_name":"３乱刀舞"},"2286":{"skill_id":"2286","skill_name":"３乱刃"},"118":{"skill_id":"118","skill_name":"３乱射"},"149":{"skill_id":"149","skill_name":"３乱戦"},"2141":{"skill_id":"2141","skill_name":"３乱殲"},"2349":{"skill_id":"2349","skill_name":"３乱突"},"31":{"skill_id":"31","skill_name":"３乱舞"},"100107":{"skill_id":"100107","skill_name":"３壊戦"},"2203":{"skill_id":"2203","skill_name":"３段剛射"},"2355":{"skill_id":"2355","skill_name":"３海撃"},"2390":{"skill_id":"2390","skill_name":"３激射"},"110":{"skill_id":"110","skill_name":"３連撃"},"2036":{"skill_id":"2036","skill_name":"３連突"},"2103":{"skill_id":"2103","skill_name":"４中炎"},"2287":{"skill_id":"2287","skill_name":"４乱刃"},"100105":{"skill_id":"100105","skill_name":"４乱奪"},"71":{"skill_id":"71","skill_name":"４乱射"},"2362":{"skill_id":"2362","skill_name":"４乱徹甲"},"63":{"skill_id":"63","skill_name":"４乱戦"},"2258":{"skill_id":"2258","skill_name":"４乱殲"},"2072":{"skill_id":"2072","skill_name":"４乱穿"},"2125":{"skill_id":"2125","skill_name":"４乱突"},"26":{"skill_id":"26","skill_name":"４乱舞"},"2191":{"skill_id":"2191","skill_name":"４掃射"},"2222":{"skill_id":"2222","skill_name":"４砲撃"},"2147":{"skill_id":"2147","skill_name":"４貫船"},"112":{"skill_id":"112","skill_name":"４連撃"},"2122":{"skill_id":"2122","skill_name":"４連操槍"},"2396":{"skill_id":"2396","skill_name":"４連突"},"2238":{"skill_id":"2238","skill_name":"５乱刀舞"},"2420":{"skill_id":"2420","skill_name":"５乱刃"},"2221":{"skill_id":"2221","skill_name":"５乱射"},"2113":{"skill_id":"2113","skill_name":"５乱戦"},"2299":{"skill_id":"2299","skill_name":"５乱殲"},"2397":{"skill_id":"2397","skill_name":"５乱突"},"2244":{"skill_id":"2244","skill_name":"５乱舞"},"2247":{"skill_id":"2247","skill_name":"５掃射"},"2343":{"skill_id":"2343","skill_name":"５激射"},"2292":{"skill_id":"2292","skill_name":"５砲撃"},"2133":{"skill_id":"2133","skill_name":"５貫船"},"114":{"skill_id":"114","skill_name":"５連撃"},"2340":{"skill_id":"2340","skill_name":"５連突"},"2437":{"skill_id":"2437","skill_name":"６中炎"},"2313":{"skill_id":"2313","skill_name":"６乱奪"},"100110":{"skill_id":"100110","skill_name":"６乱射"},"2321":{"skill_id":"2321","skill_name":"６乱舞"},"2445":{"skill_id":"2445","skill_name":"６掃射"},"2401":{"skill_id":"2401","skill_name":"６激射"},"2320":{"skill_id":"2320","skill_name":"６競撃"},"2375":{"skill_id":"2375","skill_name":"６討撃"},"2688":{"skill_id":"2688","skill_name":"７乱奪"},"2470":{"skill_id":"2470","skill_name":"７乱殲"},"2374":{"skill_id":"2374","skill_name":"７凶戦"},"2439":{"skill_id":"2439","skill_name":"７討撃"},"2363":{"skill_id":"2363","skill_name":"８中炎"},"2377":{"skill_id":"2377","skill_name":"８乱舞"},"2308":{"skill_id":"2308","skill_name":"８凶戦"},"682":{"skill_id":"682","skill_name":"【戦】結集"},"100601":{"skill_id":"100601","skill_name":"【戦】達眼"},"685":{"skill_id":"685","skill_name":"【獣】結集"},"684":{"skill_id":"684","skill_name":"【飛】結集"},"683":{"skill_id":"683","skill_name":"【魔】結集"},"634":{"skill_id":"634","skill_name":"アベンジャー"},"8016":{"skill_id":"8016","skill_name":"アミューズ"},"8017":{"skill_id":"8017","skill_name":"アミューズメンタル"},"8041":{"skill_id":"8041","skill_name":"アンチエアクラフト"},"679":{"skill_id":"679","skill_name":"アンチブロッカー"},"1706":{"skill_id":"1706","skill_name":"イリュージョン"},"8030":{"skill_id":"8030","skill_name":"イヴィルシール"},"630":{"skill_id":"630","skill_name":"オーヴァークロック"},"8012":{"skill_id":"8012","skill_name":"オーヴァーヒート"},"676":{"skill_id":"676","skill_name":"カオティックシール"},"1702":{"skill_id":"1702","skill_name":"カラクリ技師"},"8046":{"skill_id":"8046","skill_name":"キャプテンドリーム"},"648":{"skill_id":"648","skill_name":"クイーンズレイジ"},"8004":{"skill_id":"8004","skill_name":"グラッジブースト"},"663":{"skill_id":"663","skill_name":"グラントショック"},"667":{"skill_id":"667","skill_name":"サイコラビット"},"668":{"skill_id":"668","skill_name":"サマーギフト"},"8008":{"skill_id":"8008","skill_name":"シャイニング・サン"},"691":{"skill_id":"691","skill_name":"シャイニーアイ"},"100605":{"skill_id":"100605","skill_name":"シャスール"},"1703":{"skill_id":"1703","skill_name":"ステラフォース"},"8050":{"skill_id":"8050","skill_name":"スナイパー"},"8051":{"skill_id":"8051","skill_name":"スナイプライズ"},"692":{"skill_id":"692","skill_name":"スリープネス"},"8038":{"skill_id":"8038","skill_name":"セブンスター"},"658":{"skill_id":"658","skill_name":"ターボブースト"},"670":{"skill_id":"670","skill_name":"チャームアイ"},"625":{"skill_id":"625","skill_name":"ツースター"},"1711":{"skill_id":"1711","skill_name":"ディリュージョン"},"651":{"skill_id":"651","skill_name":"ドラゴンブラッド"},"606":{"skill_id":"606","skill_name":"ハンター"},"8019":{"skill_id":"8019","skill_name":"ハンターアイ"},"8036":{"skill_id":"8036","skill_name":"バトルレイジ"},"1705":{"skill_id":"1705","skill_name":"バレッジファイア"},"677":{"skill_id":"677","skill_name":"パワーレイズ"},"647":{"skill_id":"647","skill_name":"ヒートソウル"},"608":{"skill_id":"608","skill_name":"フィーメイルキラー"},"8003":{"skill_id":"8003","skill_name":"フィーメイルバスター"},"660":{"skill_id":"660","skill_name":"フェイタルヒット"},"8005":{"skill_id":"8005","skill_name":"フェイタルピアース"},"695":{"skill_id":"695","skill_name":"フェイタルブレイク"},"652":{"skill_id":"652","skill_name":"フォースブースト"},"631":{"skill_id":"631","skill_name":"フルチャージ"},"641":{"skill_id":"641","skill_name":"ブレイカー"},"8031":{"skill_id":"8031","skill_name":"ブレイクフォース"},"8034":{"skill_id":"8034","skill_name":"ブレイクブースト"},"100608":{"skill_id":"100608","skill_name":"ブレイジング・サン"},"639":{"skill_id":"639","skill_name":"ボルテージ"},"607":{"skill_id":"607","skill_name":"メイルキラー"},"698":{"skill_id":"698","skill_name":"メイルバスター"},"629":{"skill_id":"629","skill_name":"ライジング"},"8007":{"skill_id":"8007","skill_name":"ライジング・サン"},"689":{"skill_id":"689","skill_name":"リーンフォース"},"624":{"skill_id":"624","skill_name":"ワンスター"},"678":{"skill_id":"678","skill_name":"万物永劫"},"100610":{"skill_id":"100610","skill_name":"万物混沌"},"623":{"skill_id":"623","skill_name":"不意打ち"},"659":{"skill_id":"659","skill_name":"先の先"},"699":{"skill_id":"699","skill_name":"先制"},"693":{"skill_id":"693","skill_name":"先手必勝"},"8026":{"skill_id":"8026","skill_name":"先駆け"},"8010":{"skill_id":"8010","skill_name":"光の先"},"8074":{"skill_id":"8074","skill_name":"光縛迅"},"8048":{"skill_id":"8048","skill_name":"光迅"},"8052":{"skill_id":"8052","skill_name":"刻呪泉"},"100613":{"skill_id":"100613","skill_name":"剣戦"},"100612":{"skill_id":"100612","skill_name":"勇戦"},"1707":{"skill_id":"1707","skill_name":"反転攻勢"},"8020":{"skill_id":"8020","skill_name":"呪刻の標"},"601":{"skill_id":"601","skill_name":"命中"},"649":{"skill_id":"649","skill_name":"報復"},"8047":{"skill_id":"8047","skill_name":"天眼"},"8028":{"skill_id":"8028","skill_name":"太陽燦々"},"8027":{"skill_id":"8027","skill_name":"奇襲"},"8025":{"skill_id":"8025","skill_name":"奇魂"},"8042":{"skill_id":"8042","skill_name":"対抗心【獣】"},"100614":{"skill_id":"100614","skill_name":"対魔"},"8054":{"skill_id":"8054","skill_name":"岩封の魔剣"},"622":{"skill_id":"622","skill_name":"強襲"},"8098":{"skill_id":"8098","skill_name":"征魔"},"653":{"skill_id":"653","skill_name":"心眼"},"8060":{"skill_id":"8060","skill_name":"心魂"},"602":{"skill_id":"602","skill_name":"急所"},"8045":{"skill_id":"8045","skill_name":"怨慨"},"8024":{"skill_id":"8024","skill_name":"想斬"},"8073":{"skill_id":"8073","skill_name":"想輝迅"},"686":{"skill_id":"686","skill_name":"慧眼"},"8037":{"skill_id":"8037","skill_name":"扇情"},"100615":{"skill_id":"100615","skill_name":"抑魔"},"100609":{"skill_id":"100609","skill_name":"撹乱"},"603":{"skill_id":"603","skill_name":"攻戦"},"8056":{"skill_id":"8056","skill_name":"春万彩"},"680":{"skill_id":"680","skill_name":"暗影"},"8015":{"skill_id":"8015","skill_name":"未知への探求"},"646":{"skill_id":"646","skill_name":"森羅万象"},"696":{"skill_id":"696","skill_name":"死を喰らう"},"665":{"skill_id":"665","skill_name":"気迫"},"8069":{"skill_id":"8069","skill_name":"氷壊"},"644":{"skill_id":"644","skill_name":"活眼"},"8009":{"skill_id":"8009","skill_name":"海拡"},"100611":{"skill_id":"100611","skill_name":"渦潮領域"},"8040":{"skill_id":"8040","skill_name":"湯煙暗刺"},"8021":{"skill_id":"8021","skill_name":"滅を喰らう"},"8032":{"skill_id":"8032","skill_name":"激怒"},"664":{"skill_id":"664","skill_name":"激戦"},"8079":{"skill_id":"8079","skill_name":"烈戦"},"8014":{"skill_id":"8014","skill_name":"焔纏い"},"8033":{"skill_id":"8033","skill_name":"熾烈"},"688":{"skill_id":"688","skill_name":"獣の眼"},"8023":{"skill_id":"8023","skill_name":"獣操の眼"},"8049":{"skill_id":"8049","skill_name":"異の集積"},"697":{"skill_id":"697","skill_name":"瞬撃"},"661":{"skill_id":"661","skill_name":"石化の魔剣"},"8022":{"skill_id":"8022","skill_name":"石縛の眼"},"8006":{"skill_id":"8006","skill_name":"石縛の魔剣"},"636":{"skill_id":"636","skill_name":"破壊神"},"604":{"skill_id":"604","skill_name":"破魔"},"8044":{"skill_id":"8044","skill_name":"絆の型・菖蒲"},"1709":{"skill_id":"1709","skill_name":"美刃迫命"},"1701":{"skill_id":"1701","skill_name":"翻弄"},"8075":{"skill_id":"8075","skill_name":"致命の業"},"100607":{"skill_id":"100607","skill_name":"苛烈"},"635":{"skill_id":"635","skill_name":"荒魂"},"8901":{"skill_id":"8901","skill_name":"虎砲招来"},"8086":{"skill_id":"8086","skill_name":"討魔"},"666":{"skill_id":"666","skill_name":"豪気"},"1708":{"skill_id":"1708","skill_name":"迎撃態勢"},"626":{"skill_id":"626","skill_name":"逆襲"},"673":{"skill_id":"673","skill_name":"閃光戦"},"8011":{"skill_id":"8011","skill_name":"闇融"},"675":{"skill_id":"675","skill_name":"集中"},"628":{"skill_id":"628","skill_name":"雷光戦"},"654":{"skill_id":"654","skill_name":"電光石火"},"627":{"skill_id":"627","skill_name":"電撃戦"},"640":{"skill_id":"640","skill_name":"願掛け"},"605":{"skill_id":"605","skill_name":"飛散"},"8094":{"skill_id":"8094","skill_name":"飛絶"},"8198":{"skill_id":"8198","skill_name":"鬼化"},"8013":{"skill_id":"8013","skill_name":"魂の乱獲"},"656":{"skill_id":"656","skill_name":"魔力容量【２回】"},"655":{"skill_id":"655","skill_name":"魔力容量【３回】"},"690":{"skill_id":"690","skill_name":"魔力容量【５回】"},"8057":{"skill_id":"8057","skill_name":"魔力容量【６回】"},"672":{"skill_id":"672","skill_name":"黒威のブレイカー"},"7099":{"skill_id":"7099","skill_name":"あったか毛衣"},"565":{"skill_id":"565","skill_name":"かがやく胞子"},"566":{"skill_id":"566","skill_name":"きらめく胞子"},"7082":{"skill_id":"7082","skill_name":"ご贔屓に♪"},"511":{"skill_id":"511","skill_name":"とくとくぱんだ"},"7027":{"skill_id":"7027","skill_name":"ふわふわ綿毛"},"7028":{"skill_id":"7028","skill_name":"ほわほわ綿毛"},"537":{"skill_id":"537","skill_name":"まどろむ羊"},"7003":{"skill_id":"7003","skill_name":"ゆめみる羊"},"7071":{"skill_id":"7071","skill_name":"ウィープレディ"},"7103":{"skill_id":"7103","skill_name":"ウェーブフラッグ"},"7085":{"skill_id":"7085","skill_name":"エレガントダンス"},"7035":{"skill_id":"7035","skill_name":"カリヨンの鐘"},"7036":{"skill_id":"7036","skill_name":"サムシングフォー"},"7033":{"skill_id":"7033","skill_name":"ショーティ"},"7037":{"skill_id":"7037","skill_name":"シロヘビの牙"},"7026":{"skill_id":"7026","skill_name":"シンギングバード"},"515":{"skill_id":"515","skill_name":"ジョイフルサーカス"},"7044":{"skill_id":"7044","skill_name":"スケープドール"},"591":{"skill_id":"591","skill_name":"スネークシェッド"},"7052":{"skill_id":"7052","skill_name":"スノーマンガード"},"7011":{"skill_id":"7011","skill_name":"スピードスター"},"540":{"skill_id":"540","skill_name":"スレイライド"},"559":{"skill_id":"559","skill_name":"セイントフラワー"},"509":{"skill_id":"509","skill_name":"ドラゴンジーン"},"7076":{"skill_id":"7076","skill_name":"ドリームダンサー"},"568":{"skill_id":"568","skill_name":"ビーストロアー"},"521":{"skill_id":"521","skill_name":"フェアリーティア"},"558":{"skill_id":"558","skill_name":"フラッターブルーム"},"580":{"skill_id":"580","skill_name":"フレイムガイスト"},"593":{"skill_id":"593","skill_name":"ブルータリティ"},"7006":{"skill_id":"7006","skill_name":"プリティキャット"},"564":{"skill_id":"564","skill_name":"ベスティアル"},"7004":{"skill_id":"7004","skill_name":"ホーリーウィング"},"7014":{"skill_id":"7014","skill_name":"マナコート"},"514":{"skill_id":"514","skill_name":"マナヴェール"},"7002":{"skill_id":"7002","skill_name":"マーレの慈愛"},"536":{"skill_id":"536","skill_name":"マーレの祝福"},"7062":{"skill_id":"7062","skill_name":"ミスティコート"},"7013":{"skill_id":"7013","skill_name":"ミッシング"},"7012":{"skill_id":"7012","skill_name":"ラピッドフライト"},"510":{"skill_id":"510","skill_name":"ラヴァーズソウル"},"516":{"skill_id":"516","skill_name":"リザレクション"},"531":{"skill_id":"531","skill_name":"リバースソウル"},"541":{"skill_id":"541","skill_name":"レディ・クリスマス"},"599":{"skill_id":"599","skill_name":"不変の魔血"},"7041":{"skill_id":"7041","skill_name":"不敵"},"554":{"skill_id":"554","skill_name":"不滅の魂"},"524":{"skill_id":"524","skill_name":"人魚の王血"},"520":{"skill_id":"520","skill_name":"信義の剣"},"7009":{"skill_id":"7009","skill_name":"八守の魔弾"},"556":{"skill_id":"556","skill_name":"六剣の祝福"},"7061":{"skill_id":"7061","skill_name":"円光一尋"},"100503":{"skill_id":"100503","skill_name":"冥を喰らう"},"546":{"skill_id":"546","skill_name":"勝負師"},"555":{"skill_id":"555","skill_name":"収呪の魂"},"7088":{"skill_id":"7088","skill_name":"古代術の叡智"},"512":{"skill_id":"512","skill_name":"古代術の知識"},"7078":{"skill_id":"7078","skill_name":"古龍の加護"},"533":{"skill_id":"533","skill_name":"古龍の威光"},"7001":{"skill_id":"7001","skill_name":"吉星"},"551":{"skill_id":"551","skill_name":"名湯の薬効"},"504":{"skill_id":"504","skill_name":"呪怨"},"517":{"skill_id":"517","skill_name":"回生の極光"},"7083":{"skill_id":"7083","skill_name":"夏の女王"},"7040":{"skill_id":"7040","skill_name":"夏の想い出"},"100515":{"skill_id":"100515","skill_name":"夏夢の記憶"},"7043":{"skill_id":"7043","skill_name":"夏幸の記憶"},"7042":{"skill_id":"7042","skill_name":"夢中"},"7047":{"skill_id":"7047","skill_name":"夢見の薬毒"},"513":{"skill_id":"513","skill_name":"大いなる翼"},"7054":{"skill_id":"7054","skill_name":"女傑"},"506":{"skill_id":"506","skill_name":"女王の矜持"},"7039":{"skill_id":"7039","skill_name":"姉妹の絆"},"584":{"skill_id":"584","skill_name":"婚儀の聖鎧"},"583":{"skill_id":"583","skill_name":"婚礼の鎧"},"7046":{"skill_id":"7046","skill_name":"子獅子奮刃"},"569":{"skill_id":"569","skill_name":"岩鱗"},"100506":{"skill_id":"100506","skill_name":"常夏の海浜Ⅰ"},"100507":{"skill_id":"100507","skill_name":"常夏の海浜Ⅱ"},"100508":{"skill_id":"100508","skill_name":"常夏の海浜Ⅲ"},"589":{"skill_id":"589","skill_name":"平静"},"7020":{"skill_id":"7020","skill_name":"幻像"},"528":{"skill_id":"528","skill_name":"弾除けの術"},"100505":{"skill_id":"100505","skill_name":"律儀の夏"},"592":{"skill_id":"592","skill_name":"律心"},"562":{"skill_id":"562","skill_name":"復讐の海陣"},"7049":{"skill_id":"7049","skill_name":"心酔"},"535":{"skill_id":"535","skill_name":"忠義の夏"},"100501":{"skill_id":"100501","skill_name":"怨毒"},"582":{"skill_id":"582","skill_name":"悠然"},"7008":{"skill_id":"7008","skill_name":"悪絶"},"7021":{"skill_id":"7021","skill_name":"情熱"},"7010":{"skill_id":"7010","skill_name":"情熱のメモリー"},"7023":{"skill_id":"7023","skill_name":"憩いのぬくもり"},"7055":{"skill_id":"7055","skill_name":"戦乙女"},"7017":{"skill_id":"7017","skill_name":"投扇興"},"548":{"skill_id":"548","skill_name":"探求者"},"7053":{"skill_id":"7053","skill_name":"撃墜"},"552":{"skill_id":"552","skill_name":"撃流"},"7058":{"skill_id":"7058","skill_name":"明鏡止水"},"7072":{"skill_id":"7072","skill_name":"春装"},"588":{"skill_id":"588","skill_name":"智謀"},"7067":{"skill_id":"7067","skill_name":"森獣の湯守"},"529":{"skill_id":"529","skill_name":"歴戦の勇士"},"501":{"skill_id":"501","skill_name":"毒"},"522":{"skill_id":"522","skill_name":"永劫回帰"},"7057":{"skill_id":"7057","skill_name":"浩然"},"590":{"skill_id":"590","skill_name":"海豹の毛皮"},"542":{"skill_id":"542","skill_name":"海飛"},"581":{"skill_id":"581","skill_name":"清澄"},"561":{"skill_id":"561","skill_name":"温泉招き猫"},"534":{"skill_id":"534","skill_name":"火の精霊"},"7038":{"skill_id":"7038","skill_name":"煌羽"},"100504":{"skill_id":"100504","skill_name":"煌鱗"},"7070":{"skill_id":"7070","skill_name":"煙玉"},"7007":{"skill_id":"7007","skill_name":"狂戦"},"7050":{"skill_id":"7050","skill_name":"狂闘"},"502":{"skill_id":"502","skill_name":"猛毒"},"519":{"skill_id":"519","skill_name":"獅子制勢"},"597":{"skill_id":"597","skill_name":"獣信の心"},"596":{"skill_id":"596","skill_name":"獣想の心"},"7065":{"skill_id":"7065","skill_name":"球流し"},"7045":{"skill_id":"7045","skill_name":"甘味な魔除け"},"7077":{"skill_id":"7077","skill_name":"白無垢"},"563":{"skill_id":"563","skill_name":"白牡丹の主"},"550":{"skill_id":"550","skill_name":"看板猫"},"543":{"skill_id":"543","skill_name":"真眼の盾"},"100513":{"skill_id":"100513","skill_name":"祓い灯"},"585":{"skill_id":"585","skill_name":"祝福のヴェール"},"7107":{"skill_id":"7107","skill_name":"神徳"},"560":{"skill_id":"560","skill_name":"神流桜乱"},"539":{"skill_id":"539","skill_name":"神纏の氷眼"},"20310":{"skill_id":"20310","skill_name":"禁書庫の司書"},"549":{"skill_id":"549","skill_name":"秘湯の麗人"},"100514":{"skill_id":"100514","skill_name":"秘誓"},"544":{"skill_id":"544","skill_name":"立願"},"7056":{"skill_id":"7056","skill_name":"節小袖"},"20308":{"skill_id":"20308","skill_name":"精霊術師"},"557":{"skill_id":"557","skill_name":"紅牡丹の君"},"7075":{"skill_id":"7075","skill_name":"練達の勇士"},"567":{"skill_id":"567","skill_name":"義心"},"595":{"skill_id":"595","skill_name":"翔鳥"},"518":{"skill_id":"518","skill_name":"聖樹の守護者"},"7019":{"skill_id":"7019","skill_name":"胡蝶の初夢"},"503":{"skill_id":"503","skill_name":"腐乱"},"505":{"skill_id":"505","skill_name":"腐蝕"},"7030":{"skill_id":"7030","skill_name":"自制"},"7031":{"skill_id":"7031","skill_name":"自律"},"7024":{"skill_id":"7024","skill_name":"至福のひととき"},"7005":{"skill_id":"7005","skill_name":"至高の一品"},"100502":{"skill_id":"100502","skill_name":"良星"},"7069":{"skill_id":"7069","skill_name":"花蝶の舞"},"7048":{"skill_id":"7048","skill_name":"英姿"},"526":{"skill_id":"526","skill_name":"萌ゆる恋"},"527":{"skill_id":"527","skill_name":"萌ゆる恋情"},"7051":{"skill_id":"7051","skill_name":"蒼輝の天狼"},"7068":{"skill_id":"7068","skill_name":"装鱗甲"},"7064":{"skill_id":"7064","skill_name":"討獣術"},"545":{"skill_id":"545","skill_name":"誓願"},"530":{"skill_id":"530","skill_name":"警戒"},"7080":{"skill_id":"7080","skill_name":"豪技"},"598":{"skill_id":"598","skill_name":"輝羽"},"7063":{"skill_id":"7063","skill_name":"退魔術"},"7029":{"skill_id":"7029","skill_name":"邪霊"},"100511":{"skill_id":"100511","skill_name":"金剛砕きの型"},"7022":{"skill_id":"7022","skill_name":"鉄桶制裁"},"7166":{"skill_id":"7166","skill_name":"鉄鎧皮"},"538":{"skill_id":"538","skill_name":"鉄陣硬"},"7167":{"skill_id":"7167","skill_name":"鋼鎧皮"},"7032":{"skill_id":"7032","skill_name":"鎧血"},"7034":{"skill_id":"7034","skill_name":"閃電"},"547":{"skill_id":"547","skill_name":"闇化"},"7079":{"skill_id":"7079","skill_name":"闘将"},"594":{"skill_id":"594","skill_name":"闘鬼"},"7060":{"skill_id":"7060","skill_name":"険絶"},"100510":{"skill_id":"100510","skill_name":"険阻"},"7168":{"skill_id":"7168","skill_name":"頑強の魔血"},"7015":{"skill_id":"7015","skill_name":"飛空"},"20309":{"skill_id":"20309","skill_name":"鬼族"},"7066":{"skill_id":"7066","skill_name":"魔球流し"},"553":{"skill_id":"553","skill_name":"魔皮"},"507":{"skill_id":"507","skill_name":"魔道の才"},"532":{"skill_id":"532","skill_name":"魔鏡剣"},"508":{"skill_id":"508","skill_name":"鱗甲"},"7018":{"skill_id":"7018","skill_name":"鳳凰再臨"},"7059":{"skill_id":"7059","skill_name":"鳳凰永翔"},"7112":{"skill_id":"7112","skill_name":"鴉王の威"},"100509":{"skill_id":"100509","skill_name":"鴉王の武"},"7025":{"skill_id":"7025","skill_name":"龍鱗の鎧"},"10706":{"skill_id":"10706","skill_name":"25%防衛"},"10102":{"skill_id":"10102","skill_name":"【戦】10%緩和"},"10003":{"skill_id":"10003","skill_name":"【戦】半減"},"10006":{"skill_id":"10006","skill_name":"【戦】反射"},"10005":{"skill_id":"10005","skill_name":"【戦】吸収"},"10001":{"skill_id":"10001","skill_name":"【戦】回避"},"10108":{"skill_id":"10108","skill_name":"【戦】接蝕"},"10104":{"skill_id":"10104","skill_name":"【戦】根性"},"10004":{"skill_id":"10004","skill_name":"【戦】無効"},"10002":{"skill_id":"10002","skill_name":"【戦】緩和"},"10103":{"skill_id":"10103","skill_name":"【戦】蘇生"},"10402":{"skill_id":"10402","skill_name":"【獣】10%緩和"},"10021":{"skill_id":"10021","skill_name":"【獣】半減"},"10024":{"skill_id":"10024","skill_name":"【獣】反射"},"10023":{"skill_id":"10023","skill_name":"【獣】吸収"},"10019":{"skill_id":"10019","skill_name":"【獣】回避"},"10404":{"skill_id":"10404","skill_name":"【獣】根性"},"10022":{"skill_id":"10022","skill_name":"【獣】無効"},"10020":{"skill_id":"10020","skill_name":"【獣】緩和"},"10601":{"skill_id":"10601","skill_name":"【男】吸収"},"10603":{"skill_id":"10603","skill_name":"【男・女】吸収"},"10302":{"skill_id":"10302","skill_name":"【飛】10%緩和"},"10015":{"skill_id":"10015","skill_name":"【飛】半減"},"10018":{"skill_id":"10018","skill_name":"【飛】反射"},"10017":{"skill_id":"10017","skill_name":"【飛】吸収"},"10013":{"skill_id":"10013","skill_name":"【飛】回避"},"10304":{"skill_id":"10304","skill_name":"【飛】根性"},"10016":{"skill_id":"10016","skill_name":"【飛】無効"},"10014":{"skill_id":"10014","skill_name":"【飛】緩和"},"10303":{"skill_id":"10303","skill_name":"【飛】蘇生"},"10202":{"skill_id":"10202","skill_name":"【魔】10%緩和"},"10009":{"skill_id":"10009","skill_name":"【魔】半減"},"10012":{"skill_id":"10012","skill_name":"【魔】反射"},"10011":{"skill_id":"10011","skill_name":"【魔】吸収"},"10007":{"skill_id":"10007","skill_name":"【魔】回避"},"10204":{"skill_id":"10204","skill_name":"【魔】根性"},"10010":{"skill_id":"10010","skill_name":"【魔】無効"},"10008":{"skill_id":"10008","skill_name":"【魔】緩和"},"10203":{"skill_id":"10203","skill_name":"【魔】蘇生"},"10560":{"skill_id":"10560","skill_name":"うつぼの守り"},"10555":{"skill_id":"10555","skill_name":"お得意様♪"},"10728":{"skill_id":"10728","skill_name":"もっこもこ"},"10703":{"skill_id":"10703","skill_name":"もっふもふ"},"10540":{"skill_id":"10540","skill_name":"もふもふ"},"10572":{"skill_id":"10572","skill_name":"アイアンスキン"},"10565":{"skill_id":"10565","skill_name":"アイギスの盾"},"10552":{"skill_id":"10552","skill_name":"アキレウスの鎧"},"10722":{"skill_id":"10722","skill_name":"インビジブルフェアリー"},"10580":{"skill_id":"10580","skill_name":"ウィンドアーマー"},"10309":{"skill_id":"10309","skill_name":"エアロリフレクト"},"10512":{"skill_id":"10512","skill_name":"オーヴァードライブ"},"10595":{"skill_id":"10595","skill_name":"カラクリガード"},"10726":{"skill_id":"10726","skill_name":"カラクリサービス"},"10727":{"skill_id":"10727","skill_name":"カラクリバトラー"},"10522":{"skill_id":"10522","skill_name":"コールドアーマー"},"10507":{"skill_id":"10507","skill_name":"サラウンドディフェンス"},"10550":{"skill_id":"10550","skill_name":"サンド・プロテクション"},"10534":{"skill_id":"10534","skill_name":"サンライトエンジン"},"10593":{"skill_id":"10593","skill_name":"シルフィリフレクション"},"10597":{"skill_id":"10597","skill_name":"スイムドッヂ"},"10719":{"skill_id":"10719","skill_name":"ストームアーマー"},"10590":{"skill_id":"10590","skill_name":"セイクリッドシールド"},"10544":{"skill_id":"10544","skill_name":"セイントプロテクト"},"10112":{"skill_id":"10112","skill_name":"トラップボム"},"10566":{"skill_id":"10566","skill_name":"ドラゴンコート"},"10510":{"skill_id":"10510","skill_name":"ドラゴンスキン"},"10209":{"skill_id":"10209","skill_name":"ドリーミング・サンド"},"10505":{"skill_id":"10505","skill_name":"ハーフリフレクション"},"10502":{"skill_id":"10502","skill_name":"バックラー"},"110502":{"skill_id":"110502","skill_name":"バトルマスキュラー"},"10576":{"skill_id":"10576","skill_name":"バーニングアーマー"},"10532":{"skill_id":"10532","skill_name":"パペットウォール"},"10592":{"skill_id":"10592","skill_name":"パペットリフレクト"},"10556":{"skill_id":"10556","skill_name":"ヒステリックビースト"},"110301":{"skill_id":"110301","skill_name":"ビーストリフレクト"},"10527":{"skill_id":"10527","skill_name":"ファイアエレメント"},"10705":{"skill_id":"10705","skill_name":"ファイアーフェザーズ"},"10712":{"skill_id":"10712","skill_name":"フェアリークィーン"},"10538":{"skill_id":"10538","skill_name":"フェアリーセンス"},"10541":{"skill_id":"10541","skill_name":"フェアリーブラッド"},"10551":{"skill_id":"10551","skill_name":"フレイムアーマー"},"10109":{"skill_id":"10109","skill_name":"フレイムスキン"},"10729":{"skill_id":"10729","skill_name":"フレイムドレス"},"10702":{"skill_id":"10702","skill_name":"フレイムボディ"},"10723":{"skill_id":"10723","skill_name":"プレゼントウォール"},"10533":{"skill_id":"10533","skill_name":"ホーリーシールド"},"10537":{"skill_id":"10537","skill_name":"モストマスキュラー"},"10734":{"skill_id":"10734","skill_name":"リベンジグレア"},"10564":{"skill_id":"10564","skill_name":"リベンジロアー"},"10583":{"skill_id":"10583","skill_name":"ロアリングビースト"},"10549":{"skill_id":"10549","skill_name":"ワイルドライフ"},"10714":{"skill_id":"10714","skill_name":"ヴェールナイフ"},"10506":{"skill_id":"10506","skill_name":"不屈"},"10563":{"skill_id":"10563","skill_name":"不撓"},"10542":{"skill_id":"10542","skill_name":"人魚の血"},"10574":{"skill_id":"10574","skill_name":"優美な剣舞踊"},"10720":{"skill_id":"10720","skill_name":"光輝のビスケッタ"},"10528":{"skill_id":"10528","skill_name":"円環の構え"},"10547":{"skill_id":"10547","skill_name":"分身"},"10513":{"skill_id":"10513","skill_name":"力流の舞"},"10709":{"skill_id":"10709","skill_name":"力転の舞"},"10725":{"skill_id":"10725","skill_name":"呪闇の鎧"},"10539":{"skill_id":"10539","skill_name":"夏疾風"},"10718":{"skill_id":"10718","skill_name":"夢の侵蝕"},"10581":{"skill_id":"10581","skill_name":"大蛇の守り"},"10575":{"skill_id":"10575","skill_name":"天の祝福"},"10721":{"skill_id":"10721","skill_name":"天舞"},"10578":{"skill_id":"10578","skill_name":"察知"},"10536":{"skill_id":"10536","skill_name":"幽体"},"10523":{"skill_id":"10523","skill_name":"後の先"},"10571":{"skill_id":"10571","skill_name":"心詠"},"10546":{"skill_id":"10546","skill_name":"慶雲の誉れ"},"10518":{"skill_id":"10518","skill_name":"星鏡の輝き"},"10704":{"skill_id":"10704","skill_name":"曲芸飛行"},"10110":{"skill_id":"10110","skill_name":"武装破壊"},"10708":{"skill_id":"10708","skill_name":"残光"},"10514":{"skill_id":"10514","skill_name":"残影"},"10582":{"skill_id":"10582","skill_name":"毒蛇の守り"},"10599":{"skill_id":"10599","skill_name":"潜水"},"1801":{"skill_id":"1801","skill_name":"狂血"},"10573":{"skill_id":"10573","skill_name":"用心"},"10531":{"skill_id":"10531","skill_name":"疾風迅雷"},"10717":{"skill_id":"10717","skill_name":"癒しの衣"},"10707":{"skill_id":"10707","skill_name":"盤石の盾"},"10711":{"skill_id":"10711","skill_name":"硬皮"},"10548":{"skill_id":"10548","skill_name":"福音"},"10308":{"skill_id":"10308","skill_name":"竜の古傷"},"10525":{"skill_id":"10525","skill_name":"聖剣の加護"},"10516":{"skill_id":"10516","skill_name":"聖獣の加護"},"10559":{"skill_id":"10559","skill_name":"茨の衣"},"10594":{"skill_id":"10594","skill_name":"茨の鎧"},"10503":{"skill_id":"10503","skill_name":"見切り"},"10741":{"skill_id":"10741","skill_name":"豪勇"},"10535":{"skill_id":"10535","skill_name":"豪胆"},"10511":{"skill_id":"10511","skill_name":"身代わり"},"10519":{"skill_id":"10519","skill_name":"転生"},"10716":{"skill_id":"10716","skill_name":"輝鱗"},"110501":{"skill_id":"110501","skill_name":"逃げ足"},"10517":{"skill_id":"10517","skill_name":"金剛"},"10579":{"skill_id":"10579","skill_name":"金剛不壊"},"10529":{"skill_id":"10529","skill_name":"鉄壁"},"10545":{"skill_id":"10545","skill_name":"閃光のビスケッタ"},"10570":{"skill_id":"10570","skill_name":"除災招福"},"10701":{"skill_id":"10701","skill_name":"静心"},"10521":{"skill_id":"10521","skill_name":"飛翔"},"10509":{"skill_id":"10509","skill_name":"飛行"},"10558":{"skill_id":"10558","skill_name":"黄泉還り"}}
  ;

  const STATUS_BASELINE =
{"5401":{"status_id":"5401","status_name":"逆上"},"5402":{"status_id":"5402","status_name":"幼化"},"5501":{"status_id":"5501","status_name":"混乱"},"5502":{"status_id":"5502","status_name":"船狂"},"5503":{"status_id":"5503","status_name":"狂乱"},"5504":{"status_id":"5504","status_name":"呪乱"},"5505":{"status_id":"5505","status_name":"船荒"},"5602":{"status_id":"5602","status_name":"恐怖"},"5631":{"status_id":"5631","status_name":"畏怖"},"5852":{"status_id":"5852","status_name":"虚弱"},"6001":{"status_id":"6001","status_name":"呪い"},"6002":{"status_id":"6002","status_name":"火傷"},"6003":{"status_id":"6003","status_name":"バレットレイン（異常状態）"},"6004":{"status_id":"6004","status_name":"ラピッドショット（異常状態）"},"6005":{"status_id":"6005","status_name":"バレットストーム（異常状態）"},"6006":{"status_id":"6006","status_name":"煌春（異常状態）"},"6101":{"status_id":"6101","status_name":"ポイズン"},"6102":{"status_id":"6102","status_name":"ベノム"},"6103":{"status_id":"6103","status_name":"出血"},"6104":{"status_id":"6104","status_name":"燃焼"},"6105":{"status_id":"6105","status_name":"闇討ち"},"6106":{"status_id":"6106","status_name":"呪印"},"6107":{"status_id":"6107","status_name":"重傷"},"6108":{"status_id":"6108","status_name":"重傷【1ターン】"},"6109":{"status_id":"6109","status_name":"不治"},"6110":{"status_id":"6110","status_name":"浸水"},"6111":{"status_id":"6111","status_name":"損壊"},"6112":{"status_id":"6112","status_name":"船爆"},"6114":{"status_id":"6114","status_name":"深手"},"6115":{"status_id":"6115","status_name":"瀕死"},"6116":{"status_id":"6116","status_name":"流血"},"6901":{"status_id":"6901","status_name":"麻痺"},"6902":{"status_id":"6902","status_name":"悪夢"},"6903":{"status_id":"6903","status_name":"石化"},"6904":{"status_id":"6904","status_name":"睡眠"},"6947":{"status_id":"6947","status_name":"故障"},"6948":{"status_id":"6948","status_name":"凍結"}}
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


  // =======================================================
  // state defaults
  // =======================================================

  function emptyState() {

    return {
      start_url:
        null,

      pending_urls:
        [],

      visited_urls:
        [],

      items:
        [],

      running:
        false,

      stopped:
        false,

      finished:
        false,

      errors:
        []
    };
  }


  // =======================================================
  // item compression
  // =======================================================

  function compactItem(item) {

    if (
      !item
      ||
      !item.id
    ) {
      return null;
    }


    const id =
      String(
        item.id
      );


    /*
      既存スキル。

      原則IDだけ残す。

      ただし名称変更らしきものを
      検出した場合だけ observed_text を残す。
    */

    if (
      SKILL_BASELINE[
        id
      ]
    ) {

      const out = {
        id:
          id,

        detected_type:
          'skill'
      };


      if (
        item.name_mismatch
      ) {

        out.name_mismatch =
          true;

        out.observed_text =
          item.observed_text
          ||
          item.raw_text
          ||
          '';
      }


      return out;
    }


    /*
      既存異常状態。

      IDだけ残す。
    */

    if (
      STATUS_BASELINE[
        id
      ]
    ) {

      return {
        id:
          id,

        detected_type:
          'status'
      };
    }


    /*
      未知IDだけは詳細を残す。

      今後追加された本物の新規スキルや
      新しい異常状態の調査材料になる。
    */

    return {
      id:
        id,

      detected_type:
        'unknown',

      name:
        item.name
        || '',

      description:
        item.description
        || '',

      raw_text:
        item.raw_text
        || '',

      detail_url:
        item.detail_url
        || '',

      source_page:
        item.source_page
        || ''
    };
  }


  function compactItems(items) {

    const map =
      new Map();


    for (
      const raw
      of (
        items
        || []
      )
    ) {

      const item =
        compactItem(
          raw
        );


      if (
        !item
        ||
        !item.id
      ) {
        continue;
      }


      const id =
        String(
          item.id
        );


      const old =
        map.get(
          id
        );


      if (!old) {

        map.set(
          id,
          item
        );

        continue;
      }


      /*
        名称変更候補があれば優先。
      */

      if (
        item.name_mismatch
        &&
        !old.name_mismatch
      ) {

        map.set(
          id,
          item
        );

        continue;
      }


      /*
        未知IDは、
        調査情報が長い方を残す。
      */

      if (
        item.detected_type
        ===
        'unknown'
      ) {

        const oldSize =
          JSON.stringify(
            old
          ).length;

        const newSize =
          JSON.stringify(
            item
          ).length;


        if (
          newSize
          >
          oldSize
        ) {

          map.set(
            id,
            item
          );
        }
      }
    }


    return [
      ...map.values()
    ];
  }


  function compactState(
    src
  ) {

    const s =
      src
      ||
      emptyState();


    return {
      start_url:
        s.start_url
        ||
        null,

      pending_urls:
        Array.isArray(
          s.pending_urls
        )
          ?
            s.pending_urls
          :
            [],

      visited_urls:
        Array.isArray(
          s.visited_urls
        )
          ?
            s.visited_urls
          :
            [],

      items:
        compactItems(
          s.items
          ||
          []
        ),

      /*
        ページ再読み込み後に
        running=trueのまま固まらないよう
        必ずfalseにする。
      */

      running:
        false,

      stopped:
        !!s.stopped,

      finished:
        !!s.finished,

      errors:
        Array.isArray(
          s.errors
        )
          ?
            s.errors
          :
            []
    };
  }


  // =======================================================
  // existing V2 storage rescue
  // =======================================================

  function rescueExistingStorage() {

    const raw =
      localStorage.getItem(
        STATE_KEY
      );


    if (!raw) {

      return emptyState();
    }


    let parsed;


    try {

      parsed =
        JSON.parse(
          raw
        );

    } catch (
      error
    ) {

      console.error(
        '旧state解析失敗',
        error
      );

      return emptyState();
    }


    const compact =
      compactState(
        parsed
      );


    /*
      旧stateがlocalStorage上限付近まで
      膨らんでいる可能性がある。

      同じ巨大キーへ直接上書きすると
      SafariがQuotaExceededErrorを出す可能性があるため、
      一度メモリに保持して旧値を削除してから
      軽量版を書き戻す。
    */

    try {

      localStorage.removeItem(
        STATE_KEY
      );


      localStorage.setItem(
        STATE_KEY,
        JSON.stringify(
          compact
        )
      );


      console.log(
        'JOLLY V2 state compacted',
        {
          visited:
            compact
              .visited_urls
              .length,

          pending:
            compact
              .pending_urls
              .length,

          items:
            compact
              .items
              .length
        }
      );


      return compact;

    } catch (
      error
    ) {

      console.error(
        'state圧縮保存失敗',
        error
      );


      /*
        メモリ上の進捗だけでも利用する。
      */

      return compact;
    }
  }


  let state =
    rescueExistingStorage();


  // =======================================================
  // state save
  // =======================================================

  function saveState() {

    const compact =
      compactState(
        state
      );


    /*
      メモリ上も軽量版へ置換。
    */

    state.start_url =
      compact.start_url;

    state.pending_urls =
      compact.pending_urls;

    state.visited_urls =
      compact.visited_urls;

    state.items =
      compact.items;

    state.stopped =
      compact.stopped;

    state.finished =
      compact.finished;

    state.errors =
      compact.errors;


    try {

      localStorage.setItem(
        STATE_KEY,
        JSON.stringify(
          compact
        )
      );

    } catch (
      error
    ) {

      console.error(
        'saveState error',
        error
      );


      throw new Error(
        '進捗保存に失敗しました: '
        +
        (
          error
            ?.name
          ||
          error
        )
      );
    }
  }


  // =======================================================
  // URL
  // =======================================================

  function normalizeUrl(
    href,
    base
  ) {

    try {

      const url =
        new URL(
          href,
          base
        );


      if (
        url.origin
        !==
        location.origin
      ) {

        return null;
      }


      url.hash =
        '';


      return url.href;

    } catch (_) {

      return null;
    }
  }


  // =======================================================
  // ID extraction
  // =======================================================

  function extractNumericId(
    url,
    element
  ) {

    const params = [
      'skill_no',
      'skill',
      'skill_id',
      'id',
      'no'
    ];


    for (
      const key
      of params
    ) {

      const value =
        url.searchParams.get(
          key
        );


      if (
        value
        &&
        /^\d+$/.test(
          value
        )
      ) {

        return value;
      }
    }


    const attrs = [
      element
        ?.getAttribute(
          'data-skill-id'
        ),

      element
        ?.getAttribute(
          'data-skill-no'
        ),

      element
        ?.getAttribute(
          'data-id'
        )
    ];


    for (
      const value
      of attrs
    ) {

      if (
        value
        &&
        /^\d+$/.test(
          value
        )
      ) {

        return value;
      }
    }


    return null;
  }


  // =======================================================
  // parse observed text
  // =======================================================

  function parseObserved(
    id,
    rawText
  ) {

    const text =
      clean(
        rawText
      );


    const oldSkill =
      SKILL_BASELINE[
        String(
          id
        )
      ];


    if (oldSkill) {

      const oldName =
        clean(
          oldSkill
            .skill_name
        );


      /*
        正常。

        SkillSearchでは
        「スキル名 効果文」
        と連続表示されるため、
        既存名で始まっていれば名称変更なし。
      */

      if (
        text === oldName
        ||
        text.startsWith(
          oldName
          +
          ' '
        )
      ) {

        return {
          id:
            String(
              id
            ),

          detected_type:
            'skill',

          name_mismatch:
            false
        };
      }


      /*
        本当に既存名から始まらない場合だけ
        名称変更候補として保存。
      */

      return {
        id:
          String(
            id
          ),

        detected_type:
          'skill',

        name_mismatch:
          true,

        observed_text:
          text
      };
    }


    const oldStatus =
      STATUS_BASELINE[
        String(
          id
        )
      ];


    if (oldStatus) {

      return {
        id:
          String(
            id
          ),

        detected_type:
          'status'
      };
    }


    /*
      未知ID。

      正式な名称決定は後工程に回す。

      ここでは先頭語を仮名として保存。
    */

    const firstSpace =
      text.indexOf(
        ' '
      );


    let name =
      text;

    let description =
      '';


    if (
      firstSpace
      >
      0
    ) {

      name =
        clean(
          text.slice(
            0,
            firstSpace
          )
        );

      description =
        clean(
          text.slice(
            firstSpace + 1
          )
        );
    }


    return {
      id:
        String(
          id
        ),

      detected_type:
        'unknown',

      name:
        name,

      description:
        description,

      raw_text:
        text
    };
  }


  // =======================================================
  // extract page items
  // =======================================================

  function extractItemsFromDoc(
    doc,
    pageUrl
  ) {

    const found =
      [];


    for (
      const link
      of doc.querySelectorAll(
        'a[href]'
      )
    ) {

      const href =
        normalizeUrl(
          link.getAttribute(
            'href'
          ),
          pageUrl
        );


      if (!href) {

        continue;
      }


      let url;


      try {

        url =
          new URL(
            href
          );

      } catch (_) {

        continue;
      }


      /*
        SkillSearchの各項目は、
        card album の skill_no へリンクしている。
      */

      if (
        !url.searchParams.has(
          'skill_no'
        )
      ) {

        continue;
      }


      const id =
        extractNumericId(
          url,
          link
        );


      if (!id) {

        continue;
      }


      const ownText =
        clean(
          link.textContent
        );


      const parentText =
        clean(
          link
            .parentElement
            ?.textContent
        );


      const rawText =
        (
          parentText.length
          >
          ownText.length
        )
          ?
            parentText
          :
            ownText;


      const parsed =
        parseObserved(
          id,
          rawText
        );


      parsed.detail_url =
        href;

      parsed.source_page =
        pageUrl;


      found.push(
        parsed
      );
    }


    return compactItems(
      found
    );
  }


  // =======================================================
  // pagination
  // =======================================================

  function sameSkillSearch(
    candidateUrl
  ) {

    try {

      const url =
        new URL(
          candidateUrl
        );


      return (
        url.origin
        ===
        location.origin
        &&
        url.searchParams.get(
          'M'
        )
        ===
        'Help'
        &&
        url.searchParams.get(
          'A'
        )
        ===
        'SkillSearch'
      );

    } catch (_) {

      return false;
    }
  }


  function extractNextPages(
    doc,
    pageUrl
  ) {

    const urls =
      [];


    for (
      const link
      of doc.querySelectorAll(
        'a[href]'
      )
    ) {

      const href =
        normalizeUrl(
          link.getAttribute(
            'href'
          ),
          pageUrl
        );


      if (
        !href
        ||
        !sameSkillSearch(
          href
        )
      ) {

        continue;
      }


      const url =
        new URL(
          href
        );


      /*
        SkillSearchのページ送りはp。
      */

      if (
        !url.searchParams.has(
          'p'
        )
      ) {

        continue;
      }


      urls.push(
        href
      );
    }


    return [
      ...new Set(
        urls
      )
    ];
  }


  // =======================================================
  // fetch
  // =======================================================

  async function fetchPage(
    url
  ) {

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


    if (
      !response.ok
    ) {

      throw new Error(
        'HTTP '
        +
        response.status
      );
    }


    if (
      /ログイン情報入力/
        .test(
          html
        )
      ||
      /module=auth/
        .test(
          html
        )
      ||
      /auth001/
        .test(
          html
        )
    ) {

      throw new Error(
        'LOGIN_REQUIRED'
      );
    }


    return new DOMParser()
      .parseFromString(
        html,
        'text/html'
      );
  }


  // =======================================================
  // classify / compare
  // =======================================================

  function classify() {

    const items =
      compactItems(
        state.items
      );


    const skills = [];

    const statuses = [];

    const unknown = [];


    for (
      const item
      of items
    ) {

      const id =
        String(
          item.id
        );


      if (
        SKILL_BASELINE[
          id
        ]
      ) {

        skills.push(
          item
        );

      } else if (
        STATUS_BASELINE[
          id
        ]
      ) {

        statuses.push(
          item
        );

      } else {

        unknown.push(
          item
        );
      }
    }


    return {
      skills,
      statuses,
      unknown
    };
  }


  function compare() {

    const grouped =
      classify();


    const skillIds =
      new Set(
        grouped.skills.map(
          x =>
            String(
              x.id
            )
        )
      );


    const statusIds =
      new Set(
        grouped.statuses.map(
          x =>
            String(
              x.id
            )
        )
      );


    const missingSkills =
      Object.values(
        SKILL_BASELINE
      )
      .filter(
        x =>
          !skillIds.has(
            String(
              x.skill_id
            )
          )
      );


    const missingStatuses =
      Object.values(
        STATUS_BASELINE
      )
      .filter(
        x =>
          !statusIds.has(
            String(
              x.status_id
            )
          )
      );


    const renamedSkills =
      grouped.skills
        .filter(
          x =>
            x.name_mismatch
        )
        .map(
          x => ({

            skill_id:
              String(
                x.id
              ),

            old_name:
              SKILL_BASELINE[
                String(
                  x.id
                )
              ]
              ?.skill_name
              ||
              '',

            observed_text:
              x.observed_text
              ||
              ''
          })
        );


    return {
      skill_baseline_count:
        Object.keys(
          SKILL_BASELINE
        ).length,

      skill_latest_count:
        grouped.skills.length,

      status_baseline_count:
        Object.keys(
          STATUS_BASELINE
        ).length,

      status_latest_count:
        grouped.statuses.length,

      new_candidates:
        grouped.unknown,

      missing_skills:
        missingSkills,

      missing_statuses:
        missingStatuses,

      renamed_skills:
        renamedSkills
    };
  }


  // =======================================================
  // UI status
  // =======================================================

  function setStatus(
    message
  ) {

    const el =
      document.getElementById(
        'jsdp21_status'
      );


    if (el) {

      el.textContent =
        message;
    }
  }


  function refreshSummary() {

    const diff =
      compare();


    setStatus(
      'スキル '
      +
      diff.skill_latest_count
      +
      '/'
      +
      diff.skill_baseline_count
      +
      ' ／ 異常状態 '
      +
      diff.status_latest_count
      +
      '/'
      +
      diff.status_baseline_count
      +
      ' ／ 新規候補 '
      +
      diff.new_candidates.length
      +
      ' ／ スキル消失 '
      +
      diff.missing_skills.length
      +
      ' ／ 名称変更候補 '
      +
      diff.renamed_skills.length
      +
      ' ／ 巡回済 '
      +
      state.visited_urls.length
      +
      ' ／ 未巡回 '
      +
      state.pending_urls.length
      +
      ' ／ エラー '
      +
      state.errors.length
    );
  }


  // =======================================================
  // run
  // =======================================================

  async function run() {

    if (
      state.running
    ) {

      return;
    }


    /*
      新規実行時のみ先頭URLを登録。

      旧v2の進捗がある場合は
      pending_urls / visited_urls をそのまま使う。
    */

    if (
      !state.start_url
    ) {

      state.start_url =
        location.href;


      state.pending_urls = [
        location.href
      ];


      state.visited_urls = [];

      state.items = [];

      state.errors = [];
    }


    /*
      前回187ページ付近で停止したとき、
      stopped=true が保存されている可能性がある。
    */

    state.running =
      true;

    state.stopped =
      false;

    state.finished =
      false;


    saveState();


    while (
      !state.stopped
      &&
      state.pending_urls.length
    ) {

      const url =
        state.pending_urls.shift();


      if (
        state.visited_urls.includes(
          url
        )
      ) {

        continue;
      }


      setStatus(
        '巡回中 '
        +
        (
          state.visited_urls.length
          +
          1
        )
        +
        'ページ'
        +
        ' ／ 保存項目 '
        +
        state.items.length
      );


      try {

        const doc =
          await fetchPage(
            url
          );


        const pageItems =
          extractItemsFromDoc(
            doc,
            url
          );


        state.items =
          compactItems([
            ...state.items,
            ...pageItems
          ]);


        const nextPages =
          extractNextPages(
            doc,
            url
          );


        for (
          const next
          of nextPages
        ) {

          if (
            !state
              .visited_urls
              .includes(
                next
              )
            &&
            !state
              .pending_urls
              .includes(
                next
              )
          ) {

            state
              .pending_urls
              .push(
                next
              );
          }
        }


        state
          .visited_urls
          .push(
            url
          );


        state.errors =
          state.errors.filter(
            x =>
              x.url
              !==
              url
          );


      } catch (
        error
      ) {

        state.errors =
          state.errors.filter(
            x =>
              x.url
              !==
              url
          );


        state.errors.push({
          url:
            url,

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


      /*
        各ページ終了ごとに
        軽量stateのみ保存。
      */

      saveState();


      await sleep(
        500
      );
    }


    state.running =
      false;


    if (
      !state.pending_urls.length
      &&
      !state.stopped
    ) {

      state.finished =
        true;
    }


    saveState();

    refreshSummary();
  }


  function stop() {

    state.stopped =
      true;


    saveState();


    setStatus(
      '停止要求を受け付けました'
    );
  }


  // =======================================================
  // export
  // =======================================================

  function buildExport() {

    const diff =
      compare();


    return {
      meta: {
        version:
          VERSION,

        checked_at:
          new Date()
            .toISOString(),

        start_url:
          state.start_url,

        skill_baseline_count:
          diff.skill_baseline_count,

        skill_latest_count:
          diff.skill_latest_count,

        status_baseline_count:
          diff.status_baseline_count,

        status_latest_count:
          diff.status_latest_count,

        new_candidate_count:
          diff.new_candidates.length,

        missing_skill_count:
          diff.missing_skills.length,

        missing_status_count:
          diff.missing_statuses.length,

        renamed_skill_candidate_count:
          diff.renamed_skills.length,

        visited_page_count:
          state.visited_urls.length,

        pending_page_count:
          state.pending_urls.length,

        finished:
          state.finished,

        error_count:
          state.errors.length
      },


      new_candidates:
        diff.new_candidates,

      missing_skills:
        diff.missing_skills,

      missing_statuses:
        diff.missing_statuses,

      renamed_skill_candidates:
        diff.renamed_skills,

      errors:
        state.errors
    };
  }


  function showDiff() {

    const diff =
      compare();


    const lines = [

      'スキル: '
      +
      diff.skill_latest_count
      +
      '/'
      +
      diff.skill_baseline_count,

      '異常状態: '
      +
      diff.status_latest_count
      +
      '/'
      +
      diff.status_baseline_count,

      '',

      '新規候補: '
      +
      diff.new_candidates.length
    ];


    for (
      const item
      of diff
        .new_candidates
        .slice(
          0,
          100
        )
    ) {

      lines.push(
        '＋ '
        +
        item.id
        +
        ' '
        +
        (
          item.name
          ||
          ''
        )
      );
    }


    lines.push(
      '',

      'スキル消失: '
      +
      diff.missing_skills.length,

      '異常状態消失: '
      +
      diff.missing_statuses.length,

      '名称変更候補: '
      +
      diff.renamed_skills.length,

      '',

      '巡回済: '
      +
      state.visited_urls.length,

      '未巡回: '
      +
      state.pending_urls.length,

      'エラー: '
      +
      state.errors.length
    );


    alert(
      lines.join(
        '\n'
      )
    );
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
        'jolly_skill_update_manifest_v2.json',
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
      'JSON共有できなかったため全文をコピーしました'
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


  // =======================================================
  // reset
  // =======================================================

  function resetAll() {

    if (
      !confirm(
        '今回のスキル差分確認結果と進捗を全削除しますか？'
      )
    ) {

      return;
    }


    localStorage.removeItem(
      STATE_KEY
    );


    state =
      emptyState();


    refreshSummary();
  }


  // =======================================================
  // panel
  // =======================================================

  function makePanel() {

    document
      .getElementById(
        'jolly_skill_delta_panel_v21'
      )
      ?.remove();


    const panel =
      document.createElement(
        'div'
      );


    panel.id =
      'jolly_skill_delta_panel_v21';


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
      'box-shadow:0 8px 30px #0008',
      'max-height:70vh',
      'overflow:auto'
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
          JOLLY スキル差分確認 v2.1
        </b>

        <button id="jsdp21_close">
          ×
        </button>

      </div>


      <div
        id="jsdp21_status"
        style="
          background:#1f2937;
          padding:8px;
          border-radius:10px;
          margin-bottom:8px;
          line-height:1.5;
        "
      >
        読み込み中…
      </div>


      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:7px;
      ">

        <button id="jsdp21_start">
          ① 続きから取得
        </button>

        <button id="jsdp21_stop">
          停止
        </button>

        <button id="jsdp21_show">
          ② 差分表示
        </button>

        <button id="jsdp21_share">
          差分JSON保存
        </button>

        <button id="jsdp21_copy">
          JSON全文コピー
        </button>

        <button id="jsdp21_reset">
          全リセット
        </button>

      </div>


      <div style="
        color:#cbd5e1;
        font-size:11px;
        line-height:1.5;
        margin-top:8px;
      ">
        旧v2の保存済み進捗を起動時に自動圧縮します。
        既存スキルと異常状態はIDだけ保存し、
        未知IDだけ詳細を保持します。
      </div>
    `;


    const style =
      document.createElement(
        'style'
      );


    style.textContent = `
      #jolly_skill_delta_panel_v21 button {
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
        'jsdp21_close'
      )
      .onclick =
        () =>
          panel.remove();


    document
      .getElementById(
        'jsdp21_start'
      )
      .onclick =
        () =>
          run()
            .catch(
              error =>
                alert(
                  error.message
                )
            );


    document
      .getElementById(
        'jsdp21_stop'
      )
      .onclick =
        stop;


    document
      .getElementById(
        'jsdp21_show'
      )
      .onclick =
        showDiff;


    document
      .getElementById(
        'jsdp21_share'
      )
      .onclick =
        () =>
          shareJson()
            .catch(
              error =>
                alert(
                  error.message
                )
            );


    document
      .getElementById(
        'jsdp21_copy'
      )
      .onclick =
        () =>
          copyJson()
            .catch(
              error =>
                alert(
                  error.message
                )
            );


    document
      .getElementById(
        'jsdp21_reset'
      )
      .onclick =
        resetAll;


    refreshSummary();
  }


  makePanel();

})();
