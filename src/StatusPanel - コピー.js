import React from "react";

export default function StatusPanel({ flights }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = 50000;

  // 集計用オブジェクト
  const initPP = () => ({
    jisseki: 0,
    p100: 0,
    p80: 0,
    p60: 0
  });

  const ppCompany = initPP();
  const ppPersonal = initPP();
  const ppTotal = initPP();

  let mileCompanyFuture = 0;
  let milePersonalFuture = 0;
  let mileTotalFuture = 0;

  flights.forEach((f) => {
    const d = new Date(f.date);
    d.setHours(0, 0, 0, 0);

    const isCompany = f.pay === "会社";
    const bucket = isCompany ? ppCompany : ppPersonal;

    // --- PP 集計 ---

    // 100%
    if (f.kakudo === 100) {
      bucket.p100 += f.pp;
      ppTotal.p100 += f.pp;
    }

    // 80%以上
    if (f.kakudo >= 80) {
      bucket.p80 += f.pp;
      ppTotal.p80 += f.pp;
    }

    // 60%以上
    if (f.kakudo >= 60) {
      bucket.p60 += f.pp;
      ppTotal.p60 += f.pp;
    }

    // 実績（今日以前 & 100%）
    if (d <= today && f.kakudo === 100) {
      bucket.jisseki += f.pp;
      ppTotal.jisseki += f.pp;
    }

    // --- Mile 集計（明日以降 & 100%）---
    if (d > today && f.kakudo === 100) {
      if (isCompany) {
        mileCompanyFuture += f.mile;
      } else {
        milePersonalFuture += f.mile;
      }
      mileTotalFuture += f.mile;
    }
  });

  // 残り（合計 - 50000）
  const remain = {
    jisseki: ppTotal.jisseki - target,
    p100: ppTotal.p100 - target,
    p80: ppTotal.p80 - target,
    p60: ppTotal.p60 - target
  };

  const colorFor = (v) => (v < 0 ? "red" : "black");

  return (
    <div style={{ marginBottom: 20 }}>
      <h2>ステータス</h2>

      {/* PP 集計テーブル */}
      <table border="1" style={{ width: "100%", textAlign: "right", marginBottom: 10 }}>
        <thead>
          <tr>
            <th></th>
            <th>実績</th>
            <th>100%</th>
            <th>80%</th>
            <th>60%</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>会社</td>
            <td>{ppCompany.jisseki}</td>
            <td>{ppCompany.p100}</td>
            <td>{ppCompany.p80}</td>
            <td>{ppCompany.p60}</td>
          </tr>
          <tr>
            <td>個人</td>
            <td>{ppPersonal.jisseki}</td>
            <td>{ppPersonal.p100}</td>
            <td>{ppPersonal.p80}</td>
            <td>{ppPersonal.p60}</td>
          </tr>
          <tr>
            <td>合計</td>
            <td>{ppTotal.jisseki}</td>
            <td>{ppTotal.p100}</td>
            <td>{ppTotal.p80}</td>
            <td>{ppTotal.p60}</td>
          </tr>
          <tr>
            <td>残り（目標 {target}）</td>
            <td style={{ color: colorFor(remain.jisseki) }}>{remain.jisseki}</td>
            <td style={{ color: colorFor(remain.p100) }}>{remain.p100}</td>
            <td style={{ color: colorFor(remain.p80) }}>{remain.p80}</td>
            <td style={{ color: colorFor(remain.p60) }}>{remain.p60}</td>
          </tr>
        </tbody>
      </table>

      {/* Mile 集計テーブル（明日以降 & 100%） */}
      <table border="1" style={{ width: "100%", textAlign: "right" }}>
        <thead>
          <tr>
            <th></th>
            <th>未来 Mile（明日以降 & 100%）</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>会社</td>
            <td>{mileCompanyFuture}</td>
          </tr>
          <tr>
            <td>個人</td>
            <td>{milePersonalFuture}</td>
          </tr>
          <tr>
            <td>合計</td>
            <td>{mileTotalFuture}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
