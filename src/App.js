import React, { useState, useEffect, useMemo } from "react";
import FlightForm from "./FlightForm";
import FlightTable from "./FlightTable";
import StatusPanel from "./StatusPanel";
import { DB } from "./DB";
import { Dialog, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import { db } from "./firebase";
import { ref, onValue, update, remove } from "firebase/database";

// ------------------------------
// 正規化（区間検索用）
// ------------------------------
const normalize = (str) => String(str).replace(/[^A-Za-z]/g, "").toUpperCase();

// ------------------------------
// PP/Mile 計算（新旧クラス対応版・完全修正版）
// ------------------------------
const calcPPMile = (from, to, classType, date) => {
  const fromNorm = normalize(from);
  const toNorm = normalize(to);

  // 区間検索
  const secKey = Object.keys(DB.sections).find((key) => {
    const keyNorm = normalize(key);
    return keyNorm.includes(fromNorm) && keyNorm.includes(toNorm);
  });

  const sec = secKey ? DB.sections[secKey] : null;
  if (!sec) return { pp: 0, mile: 0 };

  // ★ 日付正規化（YYYY-MM-DDに統一）
  const normalizedDate = date
    .replace(/\/|-/g, "-")
    .split("-")
    .map((v, i) => (i === 1 || i === 2 ? v.padStart(2, "0") : v))
    .join("-");

  const cutoff = new Date("2026-05-19");
  const current = new Date(normalizedDate);

  // ★ 新旧クラス体系（fallback付き）
  const classes =
    current < cutoff
      ? { ...DB.oldClasses, ...DB.newClasses }
      : { ...DB.newClasses, ...DB.oldClasses };

  const cls = classes[classType];
  if (!cls) return { pp: 0, mile: 0 };

  // PP/Mile 計算
  const pp = Math.floor(sec.mile * cls.rate * 2 + cls.point);
  const mile = Math.floor(sec.mile * cls.rate * 2.3);

  return { pp, mile };
};

export default function App() {
  const [flights, setFlights] = useState([]);

  // ------------------------------
  // 年度選択（デフォルト＝今日の年）
  // ------------------------------
  const [year, setYear] = useState(new Date().getFullYear());

// 年度フィルタ（完全版）
const filterByYear = (flights, year) => {
  return flights.filter((f) => {
    if (!f.date) return false;

    // 日付を YYYY-MM-DD に正規化
    const normalized = f.date
      .replace(/\/|-/g, "-") // 区切り統一
      .split("-")
      .map((v, i) => (i === 1 || i === 2 ? v.padStart(2, "0") : v)) // 月日を0埋め
      .join("-");

    const d = new Date(normalized);
    if (isNaN(d)) return false;

    // 年度判定
    return d.getFullYear() === year;
  });
};



  // ------------------------------
  // Firebase 読み込み
  // ------------------------------
  useEffect(() => {
    const flightsRef = ref(db, "flights");
    onValue(flightsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loadedFlights = Object.values(data);
      setFlights(loadedFlights);
    });
  }, []);

// 年度別フライト（useMemoでリアクティブ化）
const yearlyFlights = useMemo(() => {
  return filterByYear(flights, year);
}, [flights, year]);

// デバッグログ
useEffect(() => {
  console.log("Loaded flights:", flights);
  console.log("Yearly flights:", yearlyFlights);
}, [flights, year, yearlyFlights]); // ← missing dependencyを追加



  // ------------------------------
  // 日付ソート
  // ------------------------------
  const sortedFlights = [...yearlyFlights].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // ------------------------------
  // モーダル管理
  // ------------------------------
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editFlight, setEditFlight] = useState(null);

  const openAddForm = () => {
    setEditFlight(null);
    setIsFormOpen(true);
  };

  const openEditForm = (flight) => {
    setEditFlight(flight);
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  // ------------------------------
  // 新規追加
  // ------------------------------
  const addFlight = (flight) => {
    const { pp, mile } = calcPPMile(
      flight.from,
      flight.to,
      flight.classType,
      flight.date
    );

    const newFlight = {
      ...flight,
      pp,
      mile,
      id: crypto.randomUUID()
    };

    const flightsRef = ref(db, `flights/${newFlight.id}`);
    update(flightsRef, newFlight);

    setFlights([...flights, newFlight]);
    closeForm();
  };

  // ------------------------------
  // 編集更新
  // ------------------------------
  const updateFlight = (updated) => {
    const { pp, mile } = calcPPMile(
      updated.from,
      updated.to,
      updated.classType,
      updated.date
    );

    const updatedFlight = { ...updated, pp, mile };

    const flightsRef = ref(db, `flights/${updated.id}`);
    update(flightsRef, updatedFlight);

    setFlights(
      flights.map((f) => (f.id === updated.id ? updatedFlight : f))
    );

    closeForm();
  };

  // ------------------------------
  // 削除
  // ------------------------------
  const deleteFlight = (flight) => {
    const flightsRef = ref(db, `flights/${flight.id}`);
    remove(flightsRef);
    setFlights(flights.filter((f) => f.id !== flight.id));
  };

  // ------------------------------
  // CSV インポート
  // ------------------------------
  const importFlights = (imported) => {
    const recalculated = imported.map((f) => {
      const { pp, mile } = calcPPMile(
        f.from,
        f.to,
        f.classType,
        f.date
      );

      const newFlight = {
        id: f.id ?? crypto.randomUUID(),
        ...f,
        pp,
        mile
      };

      const flightsRef = ref(db, `flights/${newFlight.id}`);
      update(flightsRef, newFlight);

      return newFlight;
    });

    setFlights([...flights, ...recalculated]);
  };

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <div style={{ padding: 20 }}>

      {/* 年度選択 */}
      <TextField
        label="年度"
        select
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        style={{ width: 120, marginBottom: 20 }}
      >
        {[2026, 2027].map((y) => (
          <MenuItem key={y} value={y}>{y}年</MenuItem>
        ))}
      </TextField>

      {/* 年度別 PP/Mile 集計 */}
<StatusPanel flights={sortedFlights} year={year} />



      <Button variant="contained" onClick={openAddForm}>
        フライト追加
      </Button>

      <FlightTable
        flights={sortedFlights}
        onDelete={deleteFlight}
        onEdit={openEditForm}
        onImport={importFlights}
      />

      <Dialog open={isFormOpen} onClose={closeForm} fullWidth maxWidth="sm">
        <FlightForm
          onAdd={addFlight}
          onUpdate={updateFlight}
          editData={editFlight}
        />
        <DialogActions>
          <Button onClick={closeForm}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
