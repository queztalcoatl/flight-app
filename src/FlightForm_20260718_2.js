import React, { useState, useEffect } from "react";
import { TextField, Button, Stack, MenuItem, DialogContent } from "@mui/material";
import { DB } from "./DB";

export default function FlightForm({ onAdd, onUpdate, editData }) {
  const nextMonth = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  })();

  const [form, setForm] = useState({
    id: null,
    date: nextMonth,
    pay: "会社",
    classType: "H",
    from: "HND",
    to: "OKA",
    kakudo: 60,
    note: ""
  });

  useEffect(() => {
    if (editData) {
      setForm({
        id: editData.id,
        date: editData.date,
        pay: editData.pay,
        classType: editData.classType,
        from: editData.from,
        to: editData.to,
        kakudo: editData.kakudo,
        note: editData.note ?? ""
      });
    } else {
      setForm({
        id: null,
        date: nextMonth,
        pay: "会社",
        classType: "H",
        from: "HND",
        to: "OKA",
        kakudo: 60,
        note: ""
      });
    }
  }, [editData]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = () => {
    const data = { ...form, id: form.id ?? editData?.id ?? null };
    if (editData) onUpdate(data);
    else onAdd(data);
  };

  return (
    <DialogContent>
      <Stack spacing={2}>

        {/* 日付 */}
        <TextField
          label="日付"
          type="date"
          value={form.date}
          onChange={handleChange("date")}
          InputLabelProps={{ shrink: true }}
        />

        {/* 支払 */}
        <TextField label="支払" select value={form.pay} onChange={handleChange("pay")}>
          <MenuItem value="会社">会社</MenuItem>
          <MenuItem value="個人">個人</MenuItem>
        </TextField>

        {/* クラス */}
        <TextField label="クラス" select value={form.classType} onChange={handleChange("classType")}>
          {(() => {
            const cutoff = new Date("2026-05-19");
            const current = new Date(form.date);
            const classes =
              current < cutoff ? { ...DB.oldClasses, ...DB.newClasses } : DB.newClasses;

            return Object.keys(classes).map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ));
          })()}
        </TextField>

        {/* クラス説明 */}
        <div style={{ fontSize: "0.8rem", color: "#555" }}>
          {DB.newClasses[form.classType]?.desc ??
            DB.oldClasses[form.classType]?.desc ??
            ""}
        </div>

        {/* 路線選択 */}
        <TextField
          label="路線"
          select
          value={`${form.from}-${form.to}`}
          onChange={(e) => {
            const [from, to] = e.target.value.split("-");
            setForm({ ...form, from, to });
          }}
        >
          {Object.keys(DB.sections).map((route) => {
            const [from, to] = route.split("-");
            return (
              <MenuItem key={route} value={route}>
                {route}（{DB.airports[from]} → {DB.airports[to]}）
              </MenuItem>
            );
          })}
        </TextField>

        {/* 出発 */}
        <TextField
          label="出発"
          select
          value={form.from}
          onChange={(e) => {
            const newFrom = e.target.value;
            const newRoute = `${newFrom}-${form.to}`;

            if (DB.sections[newRoute]) {
              setForm({ ...form, from: newFrom });
            } else {
              setForm({ ...form, from: newFrom });
            }
          }}
        >
          {Object.keys(DB.airports).map((code) => (
            <MenuItem key={code} value={code}>
              {code}（{DB.airports[code]}）
            </MenuItem>
          ))}
        </TextField>

        <div style={{ fontSize: "0.8rem", color: "#555" }}>
          {DB.airports[form.from] ?? ""}
        </div>

        {/* 到着 */}
        <TextField
          label="到着"
          select
          value={form.to}
          onChange={(e) => {
            const newTo = e.target.value;
            const newRoute = `${form.from}-${newTo}`;

            if (DB.sections[newRoute]) {
              setForm({ ...form, to: newTo });
            } else {
              setForm({ ...form, to: newTo });
            }
          }}
        >
          {Object.keys(DB.airports).map((code) => (
            <MenuItem key={code} value={code}>
              {code}（{DB.airports[code]}）
            </MenuItem>
          ))}
        </TextField>

        <div style={{ fontSize: "0.8rem", color: "#555" }}>
          {DB.airports[form.to] ?? ""}
        </div>

        {/* 確度 */}
        <TextField
          label="確度"
          type="number"
          value={form.kakudo}
          onChange={handleChange("kakudo")}
        />

        {/* 備考 */}
        <TextField
          label="備考"
          value={form.note}
          inputProps={{ maxLength: 20 }}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          fullWidth
        />

        {/* 追加／更新 */}
        <Button variant="contained" onClick={handleSubmit}>
          {editData ? "更新" : "追加"}
        </Button>
      </Stack>
    </DialogContent>
  );
}
