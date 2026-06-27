import React, { useState, useEffect } from "react";
import FlightForm from "./FlightForm";
import FlightTable from "./FlightTable";
import StatusPanel from "./StatusPanel";
import { DB } from "./DB";
import { Dialog, DialogActions, Button } from "@mui/material";
import { db } from "./firebase";
import { ref, onValue, update, remove } from "firebase/database";


export default function App() {
  const [flights, setFlights] = useState([]);

  // ✅ 読み込み（idキー付きオブジェクト → 配列）
  useEffect(() => {
    const flightsRef = ref(db, "flights");
    onValue(flightsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loadedFlights = Object.values(data);
      setFlights(loadedFlights);
    });
  }, []);

  const normalize = (str) => str.replace(/[^A-Za-z]/g, "").toUpperCase();

  // ✅ PP/Mile 計算
  const calcPPMile = (from, to, classType) => {
    const fromNorm = normalize(from);
    const toNorm = normalize(to);
    const secKey = Object.keys(DB.sections).find((key) => {
      const keyNorm = normalize(key);
      return keyNorm.includes(fromNorm) && keyNorm.includes(toNorm);
    });
    const sec = secKey ? DB.sections[secKey] : null;
    const cls = DB.classes[classType];
    let pp = 0;
    let mile = 0;
    if (sec && cls) {
      pp = Math.floor(sec.mile * cls.rate * 2 + cls.point);
      mile = Math.floor(sec.mile * cls.rate * 2.3);
    }
    return { pp, mile };
  };

  // ✅ モーダル管理
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

  // ✅ 新規追加
  const addFlight = (flight) => {
    const { pp, mile } = calcPPMile(flight.from, flight.to, flight.classType);
    const newFlight = { ...flight, pp, mile, id: crypto.randomUUID() };
    const flightsRef = ref(db, `flights/${newFlight.id}`);
    update(flightsRef, newFlight); // ← 部分更新
    setFlights([...flights, newFlight]);
    closeForm();
  };

  // ✅ 編集更新（idを保持して部分更新）
  const updateFlight = (updated) => {
    const { pp, mile } = calcPPMile(updated.from, updated.to, updated.classType);
    const updatedFlight = { ...updated, pp, mile };
    const flightsRef = ref(db, `flights/${updated.id}`);
    update(flightsRef, updatedFlight); // ← 部分更新
    setFlights(
      flights.map((f) => (f.id === updated.id ? updatedFlight : f))
    );
    closeForm();
  };

  // ✅ 削除（個別削除）
const deleteFlight = (flight) => {
  const flightsRef = ref(db, `flights/${flight.id}`);
  remove(flightsRef);   // ← 正しい削除方法
  setFlights(flights.filter((f) => f.id !== flight.id));
};


  // ✅ CSVインポート（idを確実に付与）
  const importFlights = (imported) => {
    const recalculated = imported.map((f) => {
      const { pp, mile } = calcPPMile(f.from, f.to, f.classType);
      const newFlight = {
        id: f.id ?? crypto.randomUUID(),
        ...f,
        pp,
        mile
      };
      const flightsRef = ref(db, `flights/${newFlight.id}`);
      update(flightsRef, newFlight); // ← 部分更新
      return newFlight;
    });
    setFlights([...flights, ...recalculated]);
  };

  // ✅ 日付ソート
  const sortedFlights = [...flights].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

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
