import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import "./StatusPanel.css";
import { DB } from "./DB";
import { db } from "./firebase";
import { ref, set, onValue } from "firebase/database";

export default function StatusPanel({ flights, year }) {
  // ---------------------------------------------------------
  // 集計結果 state 化（再集計対応）
  // ---------------------------------------------------------
  const [ppCompany, setPPCompany] = useState({});
  const [ppPersonal, setPPPersonal] = useState({});
  const [ppTotal, setPPTotal] = useState({});
  const [mileCompanyFuture, setMileCompanyFuture] = useState(0);
  const [milePersonalFuture, setMilePersonalFuture] = useState(0);
  const [mileTotalFuture, setMileTotalFuture] = useState(0);

  // ✅ flights 更新時に再集計
useEffect(() => {
  if (!flights || flights.length === 0) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();

  console.log("🧩 flights changed:", flights.length, "year:", year);

  const initPP = () => ({ jisseki: 0, p100: 0, p80: 0, p60: 0 });
  const company = initPP();
  const personal = initPP();
  const total = initPP();

  let companyFuture = 0;
  let personalFuture = 0;
  let totalFuture = 0;

  flights.forEach((f) => {
    const d = new Date(f.date);
    d.setHours(0, 0, 0, 0);
    const isCompany = f.pay === "会社";
    const bucket = isCompany ? company : personal;

    if (f.kakudo === 100) {
      bucket.p100 += f.pp;
      total.p100 += f.pp;
    }
    if (f.kakudo >= 80) {
      bucket.p80 += f.pp;
      total.p80 += f.pp;
    }
    if (f.kakudo >= 60) {
      bucket.p60 += f.pp;
      total.p60 += f.pp;
    }

    if (d <= today && f.kakudo === 100) {
      bucket.jisseki += f.pp;
      total.jisseki += f.pp;
    }

    if (year < currentYear) return;
    if (year === currentYear) {
      if (d > today && Number(f.kakudo) === 100) {
        if (isCompany) companyFuture += f.mile;
        else personalFuture += f.mile;
        totalFuture += f.mile;
      }
    } else if (year > currentYear) {
      const yearStart = new Date(year, 0, 1);
      yearStart.setHours(0, 0, 0, 0);
      if (d >= yearStart && Number(f.kakudo) === 100) {
        if (isCompany) companyFuture += f.mile;
        else personalFuture += f.mile;
        totalFuture += f.mile;
      }
    }
  });

  setPPCompany(company);
  setPPPersonal(personal);
  setPPTotal(total);
  setMileCompanyFuture(companyFuture);
  setMilePersonalFuture(personalFuture);
  setMileTotalFuture(totalFuture);

  console.log("🔄 PP/Mile recalculated:", company, personal, total);
}, [JSON.stringify(flights), year]);


  // ---------------------------------------------------------
  // Realtime 永続化（既存仕様維持）
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
  // スカイコイン計算（既存仕様維持）
  // ---------------------------------------------------------
  const totalMile = currentMile + mileTotalFuture;
  const r = DB.calcSkycoinFromMilesOfficial(totalMile, currentCoinInput);
  const roundedMiles = r.roundedMiles;
  const coinFromMiles = r.coinFromMiles;
  const totalCoinWithCurrent = r.totalCoinWithCurrent;
  const rate = r.rate;

  // ---------------------------------------------------------
  // 表示（既存構文そのまま）
  // ---------------------------------------------------------
  return (
    <Card style={{ marginBottom: 20 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          PP計
        </Typography>

        {/* PP表 + 未来Mile 横並び */}
        <div style={{ display: "flex", gap: "20px", marginTop: 10 }}>
          {/* PP表 */}
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

          {/* 未来Mile */}
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
          {/* 左：入力欄 */}
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