import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Stack,
  MenuItem,
  DialogContent
} from "@mui/material";

export default function FlightForm({ onAdd, onUpdate, editData }) {
  const [form, setForm] = useState({
    id: null,
    date: "",
    pay: "",
    classType: "",
    from: "",
    to: "",
    kakudo: 100
  });

  // 編集モードなら値をセット
  useEffect(() => {
    if (editData) {
      setForm({
        id: editData.id,   // ← id を確実に保持
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
        date: "",
        pay: "",
        classType: "",
        from: "",
        to: "",
        kakudo: 100
      });
    }
  }, [editData]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = () => {
    const data = {
      ...form,
      id: form.id ?? editData?.id ?? null   // ← ここで id を絶対に保持
    };

    if (editData) onUpdate(data);
    else onAdd(data);
  };

  return (
    <DialogContent>
      <Stack spacing={2}>
        <TextField
          label="日付"
          type="date"
          value={form.date}
          onChange={handleChange("date")}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="支払"
          value={form.pay}
          onChange={handleChange("pay")}
        />

        <TextField
          label="クラス"
          select
          value={form.classType}
          onChange={handleChange("classType")}
        >
          <MenuItem value="H">H</MenuItem>
          <MenuItem value="7">7</MenuItem>
          <MenuItem value="5">5</MenuItem>
          <MenuItem value="3">3</MenuItem>
        </TextField>

        <TextField
          label="出発"
          value={form.from}
          onChange={handleChange("from")}
        />

        <TextField
          label="到着"
          value={form.to}
          onChange={handleChange("to")}
        />

        <TextField
          label="確度"
          type="number"
          value={form.kakudo}
          onChange={handleChange("kakudo")}
        />

        <Button variant="contained" onClick={handleSubmit}>
          {editData ? "更新" : "追加"}
        </Button>
      </Stack>
    </DialogContent>
  );
}
