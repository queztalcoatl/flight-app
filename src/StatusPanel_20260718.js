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

  // ---------------------------------------------------------
  // 路線別 PP 試算（calcPPMile と同じロジック）
  // ---------------------------------------------------------
  const sectionKeys = Object.keys(DB.sections);

  const [selectedSection, setSelectedSection] = useState("HND-OKA");
  const [unitPrice, setUnitPrice] = useState(0);
  const [classType, setClassType] = useState("H");

  const sec = DB.sections[selectedSection];
  const secMile = sec?.mile ?? 0;

  const cutoff = new Date("2026-05-19");
  const todayDate = new Date();

  const classes =
    todayDate < cutoff
      ? { ...DB.oldClasses, ...DB.newClasses }
      : DB.newClasses;

  const cls = classes[classType];

  const ppPerFlight =
    cls ? Math.floor(secMile * cls.rate * 2 + cls.point) : 0;

  const count =
    unitPrice > 0 ? Math.floor(totalCoinWithCurrent / unitPrice) : 0;

  const ppTotalRoute = count * ppPerFlight;

  // ---------------------------------------------------------
  // 路線別 PP 試算の折りたたみ
  // ---------------------------------------------------------
  const [showRouteCalc, setShowRouteCalc] = useState(false);

  const toggleRouteCalc = () => {
    setShowRouteCalc(!showRouteCalc);
  };

  return (
    <Card style={{ marginBottom: 20 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          PP計
        </Typography>

        {/* PP表 + 未来Mile 横並び */}
        <div style={{ display: "flex", gap: "20px", marginTop: 10 }}>
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

        {/* 入力＋計算結果 */}
        <Typography variant="subtitle1" gutterBottom style={{ marginTop: 20 }}>
          マイル→SkyCoin試算
        </Typography>

        <div style={{ display: "flex", gap: "20px", marginTop: 10 }}>
          <table className="table-bordered" style={{ flex: 1 }}>
            <thead>
              <tr>
                <th>項目</th>
                <th>値</th>
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
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <table className="table-bordered" style={{ flex: 1 }}>
            <thead>
              <tr>
                <th>項目</th>
                <th>値</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>合計マイル</td>
                <td>{totalMile}</td>
              </tr>
              <tr>
                <td>Coin（{roundedMiles} × {rate}）</td>
                <td>{coinFromMiles}</td>
              </tr>
              <tr>
                <td>Coin合計</td>
                <td>{totalCoinWithCurrent}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 路線別 PP 試算（折りたたみ） */}
        <div style={{ marginTop: 20 }}>
          <button
            onClick={toggleRouteCalc}
            style={{
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "6px 12px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {showRouteCalc ? "▲ 路線別 PP 試算を閉じる" : "▶ 路線別 PP 試算を開く"}
          </button>

          {showRouteCalc && (
            <table className="table-bordered" style={{ width: "100%", marginTop: 10 }}>
              <thead>
                <tr>
                  <th>路線</th>
                  <th>単価</th>
                  <th>回数</th>
                  <th>クラス</th>
                  <th>PP単価</th>
                  <th>PP計</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    <select
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      style={{ width: "100%", fontSize: "14px" }}
                    >
                      {sectionKeys.map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      type="number"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(Number(e.target.value))}
                      style={{ width: "100%", textAlign: "right" }}
                    />
                  </td>

                  <td style={{ textAlign: "right" }}>{count}</td>

                  <td>
                    <select
                      value={classType}
                      onChange={(e) => setClassType(e.target.value)}
                      style={{ width: "100%", fontSize: "14px" }}
                    >
                      {Object.keys(DB.newClasses).map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td style={{ textAlign: "right" }}>{ppPerFlight}</td>

                  <td style={{ textAlign: "right" }}>{ppTotalRoute}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
