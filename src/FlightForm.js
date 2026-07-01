import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Stack,
  MenuItem,
  DialogContent
} from "@mui/material";
import { DB } from "./DB"; // ← クラス選択にDBを利用

export default function FlightForm({ onAdd, onUpdate, editData }) {
  // 今日の日付を YYYY-MM-DD 形式で取得
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    id: null,
    date: today,          // デフォルト：今日
    pay: "会社",          // デフォルト：会社
    classType: Object.keys(DB.classes)[0], // デフォルト：DBの最初のクラス
    from: "HND",          // デフォルト：HND
    to: "HND",            // デフォルト：HND
    kakudo: 100           // デフォルト：100
  });

  // 編集モードなら値をセット
  useEffect(() => {
    if (editData) {
      setForm({
        id: editData.id,
        date: editData.date,
        pay: editData.pay,
        classType: editData.classType,
        from: editData.from,
        to: editData.to,
        kakudo: editData.kakudo
      });
    } else {
      setForm({
        id: null,
        date: today,
        pay: "会社",
        classType: Object.keys(DB.classes)[0],
        from: "HND",
        to: "HND",
        kakudo: 100
      });
    }
  }, [editData, today]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = () => {
    const data = {
      ...form,
      id: form.id ?? editData?.id ?? null
    };

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
        <TextField
          label="支払"
          select
          value={form.pay}
          onChange={handleChange("pay")}
        >
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
          {Object.keys(DB.classes).map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>

        {/* 出発 */}
        <TextField
          label="出発"
          value={form.from}
          onChange={handleChange("from")}
        />

        {/* 到着 */}
        <TextField
          label="到着"
          value={form.to}
          onChange={handleChange("to")}
        />

        {/* 確度 */}
        <TextField
          label="確度"
          type="number"
          value={form.kakudo}
          onChange={handleChange("kakudo")}
        />

        {/* 追加／更新ボタン */}
        <Button variant="contained" onClick={handleSubmit}>
          {editData ? "更新" : "追加"}
        </Button>
      </Stack>
    </DialogContent>
  );
}
