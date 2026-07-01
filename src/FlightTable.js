import React, { useEffect, useRef, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack } from "@mui/material";

export default function FlightTable({ flights, onDelete, onEdit, onImport }) {

  // today を useMemo で固定化（Lint対策）
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const exportCSV = () => {
    if (flights.length === 0) {
      alert("データがありません");
      return;
    }

    const header = ["日付", "支払", "クラス", "出発", "到着", "PP", "Mile", "確度"];
    const rows = flights.map((f) => [
      f.date,
      f.pay,
      f.classType,
      f.from,
      f.to,
      f.pp,
      f.mile,
      f.kakudo
    ]);

    const csvContent = [header, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "flights.csv";
    link.click();
  };

  const safeNumber = (v, def = 100) => {
    const n = Number(String(v).trim().replace(/[^0-9]/g, ""));
    return isNaN(n) ? def : n;
  };

  const importCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
      const dataLines = lines.slice(1);

      const importedFlights = dataLines.map((line) => {
        const cols = line.split(",");
        return {
          id: crypto.randomUUID(),
          date: cols[0],
          pay: cols[1],
          classType: cols[2],
          from: cols[3],
          to: cols[4],
          kakudo: safeNumber(cols[5], 100),
          pp: 0,
          mile: 0
        };
      });

      onImport(importedFlights);
    };

    reader.readAsText(file);
  };

  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const firstFutureIndex = flights.findIndex((f) => {
      const d = new Date(f.date);
      d.setHours(0, 0, 0, 0);
      return d >= today;
    });

    const timer = setTimeout(() => {
      const gridBody = gridRef.current.querySelector(".MuiDataGrid-virtualScroller");
      if (gridBody && firstFutureIndex >= 0) {
        const rowHeight = 52;
        gridBody.scrollTop = firstFutureIndex * rowHeight;
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [flights, today]);

  const columns = [
    { field: "date", headerName: "日付", width: 110 },
    { field: "pay", headerName: "支払", width: 90 },
    { field: "classType", headerName: "クラス", width: 90 },
    { field: "from", headerName: "出発", width: 90 },
    { field: "to", headerName: "到着", width: 90 },
    { field: "pp", headerName: "PP", width: 90 },
    { field: "mile", headerName: "Mile", width: 90 },
    { field: "kakudo", headerName: "確度", width: 90 },
    {
      field: "actions",
      headerName: "操作",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" onClick={() => onEdit(params.row)}>
            編集
          </Button>
          <Button size="small" color="error" variant="outlined" onClick={() => onDelete(params.row)}>
            削除
          </Button>
        </Stack>
      )
    }
  ];

  return (
    <div style={{ marginTop: 20 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button variant="outlined" onClick={exportCSV}>CSV ダウンロード</Button>
        <Button variant="outlined" component="label">
          CSV 読み込み
          <input type="file" accept=".csv" hidden onChange={importCSV} />
        </Button>
      </Stack>

      <div style={{ height: 500, width: "100%", marginTop: 10 }}>
        <DataGrid
          rows={flights}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          paginationModel={{ pageSize: 100 }}
          ref={gridRef}
          getRowClassName={(params) => {
            const rowDate = new Date(params.row.date);
            return rowDate < today ? "past-row" : "";
          }}
        />
      </div>

      <style>
        {`
          .past-row {
            background-color: #e0e0e0 !important;
          }
        `}
      </style>
    </div>
  );
}
