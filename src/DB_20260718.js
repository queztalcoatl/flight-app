export const DB = {
  // ---------------------------------------------------------
  // 路線マイル一覧（ANA 国内・国際線）
  // ---------------------------------------------------------
  sections: {
    // 北海道方面
    "HND-CTS": { mile: 510 },   // 羽田 - 新千歳（札幌）
    "HND-WKJ": { mile: 679 },   // 羽田 - 稚内
    "HND-MMB": { mile: 609 },   // 羽田 - 女満別
    "HND-AKJ": { mile: 576 },   // 羽田 - 旭川
    "HND-SHB": { mile: 605 },   // 羽田 - 紋別
    "HND-MBE": { mile: 623 },   // 羽田 - 釧路
    "HND-KUH": { mile: 555 },   // 羽田 - 中標津
    "HND-OBO": { mile: 526 },   // 羽田 - 帯広
    "HND-HKD": { mile: 424 },   // 羽田 - 函館

    // 東北・北陸
    "HND-AXT": { mile: 279 },   // 羽田 - 秋田
    "HND-ONJ": { mile: 314 },   // 羽田 - 大館能代
    "HND-SYO": { mile: 218 },   // 羽田 - 庄内
    "HND-SDJ": { mile: 177 },   // 羽田 - 仙台
    "HND-KIJ": { mile: 167 },   // 羽田 - 新潟
    "HND-HAC": { mile: 177 },   // 羽田 - 八丈島
    "HND-TOY": { mile: 176 },   // 羽田 - 富山
    "HND-KMQ": { mile: 211 },   // 羽田 - 小松
    "HND-NTQ": { mile: 207 },   // 羽田 - 能登

    // 中部・関西
    "HND-NGO": { mile: 193 },   // 羽田 - 中部（名古屋）
    "HND-ITM": { mile: 280 },   // 羽田 - 伊丹（大阪）

    // 中国・四国
    "HND-OKJ": { mile: 356 },   // 羽田 - 岡山
    "HND-HIJ": { mile: 414 },   // 羽田 - 広島
    "HND-IWK": { mile: 457 },   // 羽田 - 岩国
    "HND-UBJ": { mile: 510 },   // 羽田 - 山口宇部
    "HND-TTJ": { mile: 328 },   // 羽田 - 鳥取
    "HND-YGJ": { mile: 384 },   // 羽田 - 米子
    "HND-IWJ": { mile: 474 },   // 羽田 - 石見（萩・益田）
    "HND-TAK": { mile: 354 },   // 羽田 - 高松
    "HND-TKS": { mile: 329 },   // 羽田 - 徳島
    "HND-MYJ": { mile: 438 },   // 羽田 - 松山
    "HND-KCZ": { mile: 393 },   // 羽田 - 高知

    // 九州
    "HND-KKJ": { mile: 534 },   // 羽田 - 北九州
    "HND-FUK": { mile: 567 },   // 羽田 - 福岡
    "HND-HSG": { mile: 584 },   // 羽田 - 佐賀
    "HND-OIT": { mile: 499 },   // 羽田 - 大分
    "HND-KMJ": { mile: 568 },   // 羽田 - 熊本
    "HND-NGS": { mile: 610 },   // 羽田 - 長崎
    "HND-KMI": { mile: 561 },   // 羽田 - 宮崎
    "HND-KOJ": { mile: 601 },   // 羽田 - 鹿児島

    // 沖縄・離島
    "HND-OKA": { mile: 984 },   // 羽田 - 那覇（沖縄）
    "HND-ISG": { mile: 1224 },  // 羽田 - 石垣
    "HND-MMY": { mile: 1158 },  // 羽田 - 宮古
    "OKA-ISG": { mile: 247 },   // 那覇 - 石垣
    "OKA-MMY": { mile: 177 },   // 那覇 - 宮古

    // 国際線
    "HND-FRA": { mile: 6018 },  // 羽田 - フランクフルト
    "FRA-TOS": { mile: 1403 },  // フランクフルト - トロムソ
    "NRT-FRA": { mile: 5821 },  // 成田 - フランクフルト
    "HND-ZRH": { mile: 6266 },  // 羽田 - チューリッヒ
    "NRT-ZRH": { mile: 6062 }   // 成田 - チューリッヒ
  },

  // ---------------------------------------------------------
  // 旧クラス（2026/5/19以前）
  // ---------------------------------------------------------
  oldClasses: {
    "2": { rate: 1.25, point: 400 },
    "3": { rate: 1.0,  point: 400 },
    "5": { rate: 0.75, point: 400 },
    "6": { rate: 0.75, point: 200 },
    "7": { rate: 0.75, point: 0 },
    "8": { rate: 0.5,  point: 0 }
  },

  // ---------------------------------------------------------
  // 新クラス（2026/5/19以降）
  // ---------------------------------------------------------
  newClasses: {
    A: { rate: 1.5, point: 400, desc: "<ファーストクラス> フレックス/Biz" },
    B: { rate: 1.3, point: 400, desc: "<ファーストクラス> スタンダード" },
    C: { rate: 1.2, point: 400, desc: "<ファーストクラス> シンプル" },
    D: { rate: 1.0, point: 400, desc: "<エコノミークラス> フレックス/Biz" },
    H: { rate: 0.8, point: 200, desc: "<エコノミークラス> スタンダード" },
    I: { rate: 0.7, point: 100, desc: "<エコノミークラス> シンプル" },
    J: { rate: 0.5, point: 0,   desc: "<エコノミークラス> セール" }
  },

  // ---------------------------------------------------------
  // ANA SKY コイン変換率（10,000単位の公式段階を網羅）
  // ---------------------------------------------------------
  skycoinRatesOfficial: [
    { min: 0,     max: 9999,   rate: 1.0 }, // 〜9,999マイル → 1.0倍
    { min: 10000, max: 19999,  rate: 1.3 }, // 10,000〜19,999 → 1.3倍
    { min: 20000, max: 29999,  rate: 1.4 }, // 20,000〜29,999 → 1.4倍
    { min: 30000, max: 39999,  rate: 1.5 }, // 30,000〜39,999 → 1.5倍
    { min: 40000, max: 49999,  rate: 1.6 }, // 40,000〜49,999 → 1.6倍
    { min: 50000, max: 200000, rate: 1.7 }  // 50,000〜200,000 → 1.7倍
  ],

  // ---------------------------------------------------------
  // 合計マイルから「万単位で交換した場合のスカイコイン」を計算
  // totalMiles: 合計マイル（未来＋現在）
  // currentCoin: 現在保有スカイコイン
  // 戻り値:
  //   roundedMiles        … 万単位に丸めた交換対象マイル（例: 80770 → 80000）
  //   smallPartMiles      … 端数マイル（例: 770）
  //   coinFromMiles       … roundedMiles を交換した場合のスカイコイン
  //   totalCoinWithCurrent… coinFromMiles + currentCoin
  //   rate                … 適用された倍率
  // ---------------------------------------------------------
  calcSkycoinFromMilesOfficial: function(totalMiles, currentCoin) {
    // 万単位に丸める（交換対象）
    const roundedMiles = Math.floor(totalMiles / 10000) * 10000;
    const smallPartMiles = totalMiles - roundedMiles;

    // レート決定（公式段階に基づく）
    let rate = 1.0;
    for (const r of DB.skycoinRatesOfficial) {
      if (roundedMiles >= r.min && roundedMiles <= r.max) {
        rate = r.rate;
        break;
      }
    }
    // 200,000マイルを超える場合も、とりあえず1.7倍固定扱い
    if (roundedMiles > 200000) {
      rate = 1.7;
    }

    const coinFromMiles = roundedMiles * rate;
    const totalCoinWithCurrent = coinFromMiles + (currentCoin || 0);

    return {
      roundedMiles,
      smallPartMiles,
      coinFromMiles,
      totalCoinWithCurrent,
      rate
    };
  }
};
