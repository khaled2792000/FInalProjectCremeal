import { Card, CardHeader } from "@mui/material";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts";
import React from "react";

export default function PieChartCard(props) {
  return (
    <Card sx={{ padding: 2, minHeight: 320 }}>
      <CardHeader title={props.headerTitle} subheader={props.headerSubTitle} />
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: 10, label: "Meal" },
              { id: 1, value: 15, label: "Female" },
              { id: 2, value: 15, label: "Female" },
              { id: 3, value: 15, label: "Female" },
              { id: 4, value: 15, label: "Female" },
            ],
            arcLabel: (item) => `${item.label.charAt(0)}`,
            highlightScope: { faded: "global", highlighted: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "white",
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
        width={400}
        height={200}
      />
    </Card>
  );
}
