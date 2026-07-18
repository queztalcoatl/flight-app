export const DB = {
  // ---------------------------------------------------------
  // 空港名一覧（from/to 表示用）※ sections にあるコードは全て網羅
  // ---------------------------------------------------------
  airports: {
    HND: "羽田",
    CTS: "新千歳（札幌）",
    OKA: "那覇（沖縄）",
    ISG: "石垣",

    NGO: "中部（名古屋）",
    ITM: "伊丹（大阪）",
    FUK: "福岡",

    WKJ: "稚内",
    MMB: "女満別",
    AKJ: "旭川",
    SHB: "紋別",
    MBE: "釧路",
    KUH: "中標津",
    OBO: "帯広",
    HKD: "函館",

    AXT: "秋田",
    ONJ: "大館能代",
    SYO: "庄内",
    SDJ: "仙台",
    KIJ: "新潟",
    HAC: "八丈島",
    TOY: "富山",
    KMQ: "小松",
    NTQ: "能登",

    OKJ: "岡山",
    HIJ: "広島",
    IWK: "岩国",
    UBJ: "山口宇部",
    TTJ: "鳥取",
    YGJ: "米子",
    IWJ: "石見（萩・益田）",
    TAK: "高松",
    TKS: "徳島",
    MYJ: "松山",
    KCZ: "高知",

    KKJ: "北九州",
    HSG: "佐賀",
    OIT: "大分",
    KMJ: "熊本",
    NGS: "長崎",
    KMI: "宮崎",
    KOJ: "鹿児島",

    MMY: "宮古",
  },

  // ---------------------------------------------------------
  // 路線マイル一覧（ANA 国内・国際線）
  // ---------------------------------------------------------
  sections: {
    "--------- 主要 ---------": null,
    "HND-OKA": { mile: 984 },
    "OKA-HND": { mile: 984 },
    "HND-CTS": { mile: 510 },
    "CTS-HND": { mile: 510 },
    "HND-ISG": { mile: 1224 },
    "ISG-HND": { mile: 1224 },
    "OKA-ISG": { mile: 247 },
    "ISG-OKA": { mile: 247 },

    "--------- 北海道 ---------": null,
    "HND-WKJ": { mile: 679 },
    "HND-MMB": { mile: 609 },
    "HND-AKJ": { mile: 576 },
    "HND-SHB": { mile: 605 },
    "HND-MBE": { mile: 623 },
    "HND-KUH": { mile: 555 },
    "HND-OBO": { mile: 526 },
    "HND-HKD": { mile: 424 },

    "--------- 東北 ---------": null,
    "HND-AXT": { mile: 279 },
    "HND-ONJ": { mile: 314 },
    "HND-SYO": { mile: 218 },
    "HND-SDJ": { mile: 177 },
    "HND-KIJ": { mile: 167 },
    "HND-HAC": { mile: 177 },
    "HND-TOY": { mile: 176 },
    "HND-KMQ": { mile: 211 },
    "HND-NTQ": { mile: 207 },

    "--------- 中部、関西 ---------": null,
    "HND-NGO": { mile: 193 },
    "HND-ITM": { mile: 280 },

    "--------- 中国 ---------": null,
    "HND-OKJ": { mile: 356 },
    "HND-HIJ": { mile: 414 },
    "HND-IWK": { mile: 457 },
    "HND-UBJ": { mile: 510 },
    "HND-TTJ": { mile: 328 },
    "HND-YGJ": { mile: 384 },
    "HND-IWJ": { mile: 474 },
    "HND-TAK": { mile: 354 },
    "HND-TKS": { mile: 329 },
    "HND-MYJ": { mile: 438 },
    "HND-KCZ": { mile: 393 },

    "--------- 九州 ---------": null,
    "HND-KKJ": { mile: 534 },
    "HND-FUK": { mile: 567 },
    "HND-HSG": { mile: 584 },
    "HND-OIT": { mile: 499 },
    "HND-KMJ": { mile: 568 },
    "HND-NGS": { mile: 610 },
    "HND-KMI": { mile: 561 },
    "HND-KOJ": { mile: 601 },

    "--------- 沖縄 ---------": null,
    "HND-MMY": { mile: 1158 },
  },

  // ---------------------------------------------------------
  // 旧クラス（2026/5/19以前）
  // ---------------------------------------------------------
  oldClasses: {
    "2": { rate: 1.25, point: 400 },
    "3": { rate: 1.0, point: 400 },
    "5": { rate: 0.75, point: 400 },
    "6": { rate: 0.75, point: 200 },
    "7": { rate: 0.75, point: 0 },
    "8": { rate: 0.5, point: 0 }
  },

  // ---------------------------------------------------------
  // 新クラス（2026/5/19以降）
  // ---------------------------------------------------------
  newClasses: {
    A: { rate: 1.5, point: 400, desc: "<ファースト> フレックス/Biz" },
    B: { rate: 1.3, point: 400, desc: "<ファースト> スタンダード" },
    C: { rate: 1.2, point: 400, desc: "<ファースト> シンプル" },
    D: { rate: 1.0, point: 400, desc: "<エコノミー> フレックス/Biz" },
    H: { rate: 0.8, point: 200, desc: "<エコノミー> スタンダード" },
    I: { rate: 0.7, point: 100, desc: "<エコノミー> シンプル" },
    J: { rate: 0.5, point: 0, desc: "<エコノミー> セール" }
  },

  // ---------------------------------------------------------
  // ANA SKY コイン変換率（公式段階）
  // ---------------------------------------------------------
  skycoinRatesOfficial: [
    { min: 0,     max: 9999,   rate: 1.0 },
    { min: 10000, max: 19999,  rate: 1.3 },
    { min: 20000, max: 29999,  rate: 1.4 },
    { min: 30000, max: 39999,  rate: 1.5 },
    { min: 40000, max: 49999,  rate: 1.6 },
    { min: 50000, max: 200000, rate: 1.7 }
  ],

  // ---------------------------------------------------------
  // 万単位交換のスカイコイン計算（公式段階）
  // ---------------------------------------------------------
  calcSkycoinFromMilesOfficial: function(totalMiles, currentCoin) {
    const roundedMiles = Math.floor(totalMiles / 10000) * 10000;
    const smallPartMiles = totalMiles - roundedMiles;

    let rate = 1.0;
    for (const r of DB.skycoinRatesOfficial) {
      if (roundedMiles >= r.min && roundedMiles <= r.max) {
        rate = r.rate;
        break;
      }
    }
    if (roundedMiles > 200000) rate = 1.7;

    const coinFromMiles = roundedMiles * rate;
    const totalCoinWithCurrent = coinFromMiles + (currentCoin || 0);

    return {
      roundedMiles,
      smallPartMiles,
      coinFromMiles,
      totalCoinWithCurrent,
      rate
    };
  },

  // ---------------------------------------------------------
  // PP / Mile 計算（完全版）
  // ---------------------------------------------------------
  calcPPMile: function(from, to, classType, date) {
    const key = `${from}-${to}`;
    const sec = DB.sections[key];
    if (!sec || !sec.mile) {
      return { pp: 0, mile: 0 };
    }

    const baseMile = sec.mile;

    // 旧クラス / 新クラスの切り替え（2026/05/19）
    const border = new Date("2026-05-19");
    const d = date ? new Date(date) : border;
    const isNew = d >= border;

    const cls =
      (isNew ? DB.newClasses[classType] : DB.oldClasses[classType]) ||
      DB.newClasses[classType] ||
      DB.oldClasses[classType];

    if (!cls) {
      return { pp: 0, mile: baseMile };
    }

    const rate = cls.rate;
    const point = cls.point;

    // PP: ANA 国内線の一般的な式
    //   baseMile × rate × 2 + point
    const pp = Math.floor(baseMile * rate * 2 + point);

    // Mile: 実績値に合わせた係数（rate × 2.3）
    const mile = Math.floor(baseMile * rate * 2.3);

    return { pp, mile };
  }
};
