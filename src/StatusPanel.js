import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import "./StatusPanel.css";
import { DB } from "./DB";
import { db } from "./firebase";
import { ref, set, onValue } from "firebase/database";

export default function StatusPanel({ flights }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initPP = () => ({ jisseki: 0, p100: 0, p80: 0, p60: 0 });

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

    if (f.kakudo === 100) {
      bucket.p100 += f.pp;
      ppTotal.p100 += f.pp;
    }
    if (f.kakudo >= 80) {
      bucket.p80 += f.pp;
      ppTotal.p80 += f.pp;
    }
    if (f.kakudo >= 60) {
      bucket.p60 += f.pp;
      ppTotal.p60 += f.pp;
    }

    if (d < today && f.kakudo === 100) {
      bucket.jisseki += f.pp;
      ppTotal.jisseki += f.pp;
    }

    if (d > today && f.kakudo === 100) {
      if (isCompany) mileCompanyFuture += f.mile;
      else milePersonalFuture += f.mile;
      mileTotalFuture += f.mile;
    }
  });

  // ---------------------------------------------------------
  // 🔥 Realtime 永続化
  // ---------------------------------------------------------
  const [currentMile, setCurrentMile] = useState(0);
  const [currentCoinInput, setCurrentCoinInput] = useState(0);

  useEffect(() => {
    const mileRef = ref(db, "settings/currentMile");
    const coinRef = ref(db, "settings/currentCoinInput");

    onValue(mileRef, (snapshot) => {
      const v = snapshot.val();
      if (v !== null) setCurrentMile(v);
    });

    onValue(coinRef, (snapshot) => {
      const v = snapshot.val();
      if (v !== null) setCurrentCoinInput(v);
    });
  }, []);

  const updateMile = (v) => {
    setCurrentMile(v);
    set(ref(db, "settings/currentMile"), v);
  };

  const updateCoin = (v) => {
    setCurrentCoinInput(v);
    set(ref(db, "settings/currentCoinInput"), v);
  };

  // ---------------------------------------------------------
  // スカイコイン計算
  // ---------------------------------------------------------
  const totalMile = currentMile + mileTotalFuture;
  const r = DB.calcSkycoinFromMilesOfficial(totalMile, currentCoinInput);

  const roundedMiles = r.roundedMiles;
  const coinFromMiles = r.coinFromMiles;
  const totalCoinWithCurrent = r.totalCoinWithCurrent;
  const rate = r.rate;

  return (
    <Card style={{ marginBottom: 20 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          PP / Mile 集計
        </Typography>

        {/* PP 表 ＋ 未来 Mile を横並び */}
        <div style={{ display: "flex", gap: "20px", marginTop: 10 }}>
          {/* PP 表 */}
          <table className="table-bordered" style={{ flex: 1 }}>
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
            </tbody>
          </table>

          {/* 未来 Mile（右隣） */}
          <table className="table-bordered" style={{ flex: 1 }}>
            <thead>
              <tr>
                <th></th>
                <th>Mile</th>
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

        {/* 横並びブロック（入力＋計算結果） */}
        <Typography variant="subtitle1" gutterBottom style={{ marginTop: 20 }}>
          現在マイル・スカイコイン入力 ＋ 計算結果
        </Typography>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: 10,
          }}
        >
          {/* 左：入力欄 */}
          <table className="table-bordered" style={{ flex: 1 }}>
            <thead>
              <tr>
                <th style={{ width: "100px" }}>項目</th>
                <th style={{ width: "150px" }}>値</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mile</td>
                <td>
                  <input
                    type="number"
                    value={currentMile}
                    onChange={(e) => updateMile(Number(e.target.value))}
                    style={{
                      width: "100%",
                      textAlign: "right",
                      fontSize: "14px",
                      padding: "4px",
                      boxSizing: "border-box",
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>Sky Coin</td>
                <td>
                  <input
                    type="number"
                    value={currentCoinInput}
                    onChange={(e) => updateCoin(Number(e.target.value))}
                    style={{
                      width: "100%",
                      textAlign: "right",
                      fontSize: "14px",
                      padding: "4px",
                      boxSizing: "border-box",
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* 右：計算結果 */}
          <table className="table-bordered" style={{ flex: 1 }}>
            <thead>
              <tr>
                <th style={{ width: "100px" }}>項目</th>
                <th style={{ width: "150px" }}>値</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>合計マイル</td>
                <td style={{ textAlign: "right" }}>{totalMile}</td>
              </tr>
              <tr>
                <td>Coin（{roundedMiles} × {rate}）</td>
                <td style={{ textAlign: "right" }}>{coinFromMiles}</td>
              </tr>
              <tr>
                <td>Coin合計</td>
                <td style={{ textAlign: "right" }}>{totalCoinWithCurrent}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
