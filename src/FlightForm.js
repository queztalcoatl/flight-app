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
  }, [editData, nextMonth]);

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
        <TextField
          label="クラス"
          select
          value={form.classType}
          onChange={handleChange("classType")}
        >
          {Object.entries(DB.newClasses).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {key}（{value.desc.replace(/<|>/g, "")}）
            </MenuItem>
          ))}
        </TextField>

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

        {/* 出発・反転・到着 */}
        <Stack direction="row" spacing={2} alignItems="center">
          {/* 出発 */}
          <TextField
            label="出発"
            select
            value={form.from}
            onChange={(e) => {
              const newFrom = e.target.value;
              setForm({ ...form, from: newFrom });
            }}
          >
            {Object.keys(DB.airports).map((code) => (
              <MenuItem key={code} value={code}>
                {code}（{DB.airports[code]}）
              </MenuItem>
            ))}
          </TextField>

          {/* 反転ボタン */}
          <Button
            variant="outlined"
            onClick={() => {
              setForm({ ...form, from: form.to, to: form.from });
            }}
          >
            ⇄ 反転
          </Button>

          {/* 到着 */}
          <TextField
            label="到着"
            select
            value={form.to}
            onChange={(e) => {
              const newTo = e.target.value;
              setForm({ ...form, to: newTo });
            }}
          >
            {Object.keys(DB.airports).map((code) => (
              <MenuItem key={code} value={code}>
                {code}（{DB.airports[code]}）
              </MenuItem>
            ))}
          </TextField>
        </Stack>

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
