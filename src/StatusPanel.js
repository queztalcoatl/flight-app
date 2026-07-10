import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import "./StatusPanel.css";

export default function StatusPanel({ flights }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = 50000;

  const initPP = () => ({
    jisseki: 0,
    p100: 0,
    p80: 0,
    p60: 0
  });

  const ppCompany = initPP();
  const ppPersonal = initPP();
  const ppTotal = initPP();

  let mileCompanyFuture = 0;
  let milePersonalFuture = 0;
  let mileTotalFuture = 0;

  flights.forEach((f) => {
    const d = new Date(f.date);
    d.setHours(0, 0, 0, 0);

    const isCompany = f.pay === "会社";
    const bucket = isCompany ? ppCompany : ppPersonal;

    if (f.kakudo === 100) {
      bucket.p100 += f.pp;
      ppTotal.p100 += f.pp;
    }

    if (f.kakudo >= 80) {
      bucket.p80 += f.pp;
      ppTotal.p80 += f.pp;
    }

    if (f.kakudo >= 60) {
      bucket.p60 += f.pp;
      ppTotal.p60 += f.pp;
    }

    if (d < today && f.kakudo === 100) {
      bucket.jisseki += f.pp;
      ppTotal.jisseki += f.pp;
    }

    if (d > today && f.kakudo === 100) {
      if (isCompany) mileCompanyFuture += f.mile;
      else milePersonalFuture += f.mile;
      mileTotalFuture += f.mile;
    }
  });

  const remain = {
    jisseki: ppTotal.jisseki - target,
    p100: ppTotal.p100 - target,
    p80: ppTotal.p80 - target,
    p60: ppTotal.p60 - target
  };

  const colorFor = (v) => (v < 0 ? "red" : "black");

  return (
    <Card style={{ marginBottom: 20 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          PP / Mile 集計
        </Typography>

        <table className="table-bordered">
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc" }}></th>
              <th style={{ border: "1px solid #ccc" }}>実績</th>
              <th style={{ border: "1px solid #ccc" }}>100%</th>
              <th style={{ border: "1px solid #ccc" }}>80%</th>
              <th style={{ border: "1px solid #ccc" }}>60%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
               <td style={{ border: "1px solid #ccc" }}>会社</td>
               <td style={{ border: "1px solid #ccc" }}>{ppCompany.jisseki}</td>
               <td style={{ border: "1px solid #ccc" }}>{ppCompany.p100}</td>
               <td style={{ border: "1		px solid #ccc" }}>{ppCompany.p80}</td>
               <td style={{ border: "1px solid #ccc" }}>{ppCompany.p60}</td>
            </tr>
            <tr>
               <td style={{ border: "1px solid #ccc" }}>個人</td>
               <td style={{ border: "1px solid #ccc" }}>{ppPersonal.jisseki}</td>
               <td style={{ border: "1px solid #ccc" }}>{ppPersonal.p100}</td>
               <td style={{ border: "1px solid #ccc" }}>{ppPersonal.p80}</td>
               <td style={{ border: "1px solid #ccc" }}>{ppPersonal.p60}</td>
            </tr>
            <tr>
               <td style={{ border: "1px solid #ccc",
                 }}>合計</td>
               <td style={{ border: "1px solid #ccc" }}>{ppTotal.jisseki}</td>
               <td style={{ border: "1px solid #ccc" }}>{ppTotal.p100}</td>
               <td style={{ border: "1px solid #ccc" }}>{ppTotal.p80}</td>
               <td style={{ border: "1px solid #ccc" }}>{ppTotal.p60}</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ccc",
               fontWeight: "bold",
               textAlign: "center"  }}>残PP</td>
              <td style={{ border: "1px solid #ccc",
               color: colorFor(remain.jisseki),
               fontWeight: "bold",
               textAlign: "right" }}>
                {remain.jisseki}
              </td>
              <td style={{ border: "1px solid #ccc",  color: colorFor(remain.p100),
               fontWeight: "bold",
               textAlign: "right" }}>
                {remain.p100}
              </td>
              <td style={{ border: "1px solid #ccc", color: colorFor(remain.p80),
                             fontWeight: "bold",
               textAlign: "right" }}>
                {remain.p80}
              </td>
              <td style={{ border: "1px solid #ccc", color: colorFor(remain.p60),
                             fontWeight: "bold",
               textAlign: "right" }}>
                {remain.p60}
              </td>
            </tr>
          </tbody>
        </table>

        <Typography variant="subtitle1" gutterBottom>
          未来 Mile（明日以降 & 確度 100%）
        </Typography>
        <table className="table-bordered">
          <thead>
            <tr>
              <th></th>
              <th>Mile</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>会社</td>
              <td style={{ border: "1px solid #ccc" }}>{mileCompanyFuture}</td>
            </tr>
            <tr>
              <td>個人</td>
              <td style={{ border: "1px solid #ccc" }}>{milePersonalFuture}</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ccc" }}>合計</td>
              <td style={{ border: "1px solid #ccc" }}>{mileTotalFuture}</td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
