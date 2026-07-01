export const DB = {
  sections: {
    "HND-CTS": { mile: 510 },   // 羽田 - 新千歳（札幌）
    "HND-WKJ": { mile: 679 },   // 羽田 - 稚内
    "HND-MMB": { mile: 609 },   // 羽田 - 女満別
    "HND-AKJ": { mile: 576 },   // 羽田 - 旭川
    "HND-SHB": { mile: 605 },   // 羽田 - 紋別
    "HND-MBE": { mile: 623 },   // 羽田 - 釧路
    "HND-KUH": { mile: 555 },   // 羽田 - 中標津
    "HND-OBO": { mile: 526 },   // 羽田 - 帯広
    "HND-HKD": { mile: 424 },   // 羽田 - 函館
    "HND-AXT": { mile: 279 },   // 羽田 - 秋田
    "HND-ONJ": { mile: 314 },   // 羽田 - 大館能代
    "HND-SYO": { mile: 218 },   // 羽田 - 庄内
    "HND-SDJ": { mile: 177 },   // 羽田 - 仙台
    "HND-KIJ": { mile: 167 },   // 羽田 - 新潟
    "HND-HAC": { mile: 177 },   // 羽田 - 八丈島
    "HND-TOY": { mile: 176 },   // 羽田 - 富山
    "HND-KMQ": { mile: 211 },   // 羽田 - 小松
    "HND-NTQ": { mile: 207 },   // 羽田 - 能登
    "HND-NGO": { mile: 193 },   // 羽田 - 中部（名古屋）
    "HND-ITM": { mile: 280 },   // 羽田 - 伊丹（大阪）
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
    "HND-KKJ": { mile: 534 },   // 羽田 - 北九州
    "HND-FUK": { mile: 567 },   // 羽田 - 福岡
    "HND-HSG": { mile: 584 },   // 羽田 - 佐賀
    "HND-OIT": { mile: 499 },   // 羽田 - 大分
    "HND-KMJ": { mile: 568 },   // 羽田 - 熊本
    "HND-NGS": { mile: 610 },   // 羽田 - 長崎
    "HND-KMI": { mile: 561 },   // 羽田 - 宮崎
    "HND-KOJ": { mile: 601 },   // 羽田 - 鹿児島
    "HND-OKA": { mile: 984 },   // 羽田 - 那覇（沖縄）
    "HND-ISG": { mile: 1224 },  // 羽田 - 石垣
    "HND-MMY": { mile: 1158 },  // 羽田 - 宮古

    "OKA-ISG": { mile: 247 },   // 那覇 - 石垣
    "OKA-MMY": { mile: 177 },   // 那覇 - 宮古

    "HND-FRA": { mile: 6018 },  // 羽田 - フランクフルト
    "FRA-TOS": { mile: 1403 },  // フランクフルト - トロムソ
    "NRT-FRA": { mile: 5821 },  // 成田 - フランクフルト
    "HND-ZRH": { mile: 6266 },  // 羽田 - チューリッヒ
    "NRT-ZRH": { mile: 6062 }   // 成田 - チューリッヒ
  },

 // ★ 2026/5/19以前の旧クラス
  oldClasses: {
    "2": { rate: 1.25, point: 400 },
    "3": { rate: 1.0,  point: 400 },
    "5": { rate: 0.75, point: 400 },
    "6": { rate: 0.75, point: 200 },
    "7": { rate: 0.75, point: 0 },
    "8": { rate: 0.5,  point: 0 }
  },

  // ★ 2026/5/19以降の新クラス（A〜J）
  newClasses: {
    A: { rate: 1.5, point: 400, desc: "<ファーストクラス> フレックス/Biz" },
    B: { rate: 1.3, point: 400, desc: "<ファーストクラス> スタンダード" },
    C: { rate: 1.2, point: 400, desc: "<ファーストクラス> シンプル" },
    D: { rate: 1.0, point: 400, desc: "<エコノミークラス> フレックス/Biz" },
    H: { rate: 0.8, point: 200, desc: "<エコノミークラス> スタンダード" },
    I: { rate: 0.7, point: 100, desc: "<エコノミークラス> シンプル" },
    J: { rate: 0.5, point: 0,   desc: "<エコノミークラス> セール" }
  }
};



