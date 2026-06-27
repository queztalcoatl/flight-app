import React, { useState, useEffect } from "react";
import FlightForm from "./FlightForm";
import FlightTable from "./FlightTable";
import StatusPanel from "./StatusPanel";
import { DB } from "./DB";

export default function App() {
  const [flights, setFlights] = useState([]);

  // -----------------------------
  // localStorage 読み込み
  // -----------------------------
  useEffect(() => {
    const saved = localStorage.getItem("flights");
    if (saved) {
      try {
        setFlights(JSON.parse(saved));
      } catch (e) {
        console.error("保存データの読み込みに失敗:", e);
      }
    }
  }, []);

  // -----------------------------
  // localStorage 保存
  // -----------------------------
  useEffect(() => {
    localStorage.setItem("flights", JSON.stringify(flights));
  }, [flights]);

  // -----------------------------
  // 正規化（HNDOKA → HNDOKA）
  // -----------------------------
  const normalize = (str) =>
    str.replace(/[^A-Za-z]/g, "").toUpperCase();

  // -----------------------------
  // PP/Mile 計算（切り捨て）
  // -----------------------------
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

  // -----------------------------
  // モーダル管理
  // -----------------------------
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

  const closeForm = () => {
    setIsFormOpen(false);
  };

  // -----------------------------
  // 新規追加（ID 付与）
  // -----------------------------
  const addFlight = (flight) => {
    const { pp, mile } = calcPPMile(flight.from, flight.to, flight.classType);

    const newFlight = {
      id: crypto.randomUUID(), // ★ 一意のID
      ...flight,
      pp,
      mile
    };

    setFlights([...flights, newFlight]);
    closeForm();
  };

  // -----------------------------
  // 編集更新（ID で一致判定）
  // -----------------------------
  const updateFlight = (updated) => {
    const { pp, mile } = calcPPMile(updated.from, updated.to, updated.classType);

    setFlights(
      flights.map((f) =>
        f.id === updated.id ? { ...updated, pp, mile } : f
      )
    );

    closeForm();
  };

  // -----------------------------
  // 削除（ID で削除 → ズレ完全解消）
  // -----------------------------
  const deleteFlight = (flight) => {
    setFlights(flights.filter((f) => f.id !== flight.id));
  };

  // -----------------------------
  // CSV インポート（ID 付与）
  // -----------------------------
  const importFlights = (imported) => {
    const recalculated = imported.map((f) => {
      const { pp, mile } = calcPPMile(f.from, f.to, f.classType);
      return {
        id: crypto.randomUUID(),
        ...f,
        pp,
        mile
      };
    });

    setFlights([...flights, ...recalculated]);
  };

  // -----------------------------
  // 日付ソート（昇順）
  // -----------------------------
  const sortedFlights = [...flights].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div style={{ padding: 20 }}>
      <StatusPanel flights={sortedFlights} />

      <button onClick={openAddForm}>フライト追加</button>

      <FlightTable
        flights={sortedFlights}
        onDelete={deleteFlight}
        onEdit={openEditForm}
        onImport={importFlights}
      />

      {isFormOpen && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <FlightForm
              onAdd={addFlight}
              onUpdate={updateFlight}
              editData={editFlight}
            />
            <button onClick={closeForm}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------
// モーダルのスタイル
// -----------------------------
const modalStyle = {
  position: "fixed",
  top: 0,
  left: 1,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,10,0.10)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalContentStyle = {
  background: "white",
  padding: 20,
  borderRadius: 8,
  width: "400px"
};
