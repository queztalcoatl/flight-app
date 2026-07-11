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

    const header = ["日付", "支払", "クラス", "出発", "到着", "PP", "Mile", "確度","備考"];
    const rows = flights.map((f) => [
      f.date,
      f.pay,
      f.classType,
      f.from,
      f.to,
      f.pp,
      f.mile,
      f.kakudo,
      f.note ?? ""
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
          note: cols[6] ?? "",
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
        const rowHeight = 28;
        gridBody.scrollTop = firstFutureIndex * rowHeight;
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [flights, today]);

const columns = [
  { field: "date", headerName: "日付", width: 100, align: "right", headerAlign: "center" },
  { field: "from", headerName: "出発", width: 51, align: "center", headerAlign: "center" },
  { field: "to", headerName: "到着", width: 51, align: "center", headerAlign: "center" },
  { field: "classType", headerName: "Cls", width: 20, align: "center", headerAlign: "center" },
  { field: "kakudo", headerName: "確度", width: 40, align: "center", headerAlign: "center" },
  { field: "pp", headerName: "PP", width: 55, align: "right", headerAlign: "center" },
  { field: "mile", headerName: "Mile", width: 55, align: "right", headerAlign: "center" },
  { field: "pay", headerName: "支払", width: 40, align: "center", headerAlign: "center" },
  { field: "note", headerName: "備考", width:150, align: "left", headerAlign: "center" },
  {
    field: "actions",
    headerName: "操作",
    width: 100,
    headerAlign: "center",
    sortable: false,
    renderCell: (params) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",     // 縦中央寄せ
          justifyContent: "center", // 横中央寄せ
          width: "100%",
          height: "100%"
        }}
      >
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            sx={{ minWidth: 32, padding: "1px 3px", fontSize: "0.65rem" }}   // ★ 小型化
            onClick={() => onEdit(params.row)}
          >
            編集
          </Button>

          <Button
            size="small"
            color="error"
            variant="outlined"
            sx={{ minWidth: 32, padding: "1px 3px", fontSize: "0.65rem" }}   // ★ 小型化
            onClick={() => onDelete(params.row)}
          >
            削除
          </Button>
        </Stack>
      </div>
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
  	rowHeight={28}
  	headerHeight={32}
          paginationModel={{ pageSize: 100 }}
          ref={gridRef}
//          getRowClassName={(params) => {
//            const rowDate = new Date(params.row.date);
//            return rowDate < today ? "past-row" : "";
//          }}
            getRowClassName={(params) => {
              const d = new Date(params.row.date);
              d.setHours(0, 0, 0, 0);

              const today = new Date();
              today.setHours(0, 0, 0, 0);

              // ★ 過去日は最優先で灰色
              if (d < today) return "past-row";

              // ★ 今日以降は月ごとに色分け
              const month = d.getMonth(); // 0〜11
              return `month-${month}`;
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
