import React, { useState, useEffect } from "react";
import FlightForm from "./FlightForm";
import FlightTable from "./FlightTable";
import StatusPanel from "./StatusPanel";
import { DB } from "./DB";
import { Dialog, DialogActions, Button } from "@mui/material";
import { db } from "./firebase";
import { ref, onValue, update, remove } from "firebase/database";

// ------------------------------
// 正規化（区間検索用）
// ------------------------------
const normalize = (str) => String(str).replace(/[^A-Za-z]/g, "").toUpperCase();

// ------------------------------
// PP/Mile 計算（新旧クラス対応版）
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

  // 日付でクラス体系を切り替え
  const cutoff = new Date("2026-05-19");
  const current = new Date(date);

  const classes =
    current < cutoff
      ? { ...DB.oldClasses, ...DB.newClasses } // 過去は旧＋新
      : DB.newClasses;                         // 以降は新のみ

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
  // CSV インポート（列ズレ修正済）
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
  // 日付ソート
  // ------------------------------
  const sortedFlights = [...flights].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <div style={{ padding: 20 }}>
      <StatusPanel flights={sortedFlights} />

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
