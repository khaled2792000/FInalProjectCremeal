import React, { useState } from "react";
import CardHeader from "@mui/material/CardHeader";
import { Box, Card, Typography } from "@mui/material";

export default function StatisticsShowNumberCard(props) {
  const [number, setNumber] = useState(0);
  return (
    <>
      <Card
        sx={{
          textAlign: "center",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          padding: 5,
          maxHeight: 20,
          boxSizing: "content-box",
        }}
      >
        {props.iconComponent}
        <CardHeader
          title={props.headerTitle}
          subheader={props.headerSubTitle}
        />
        <Box
          sx={{
            textAlign: "center",
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="h3" color="initial" component={"p"}>
            {number}
          </Typography>
        </Box>
      </Card>
    </>
  );
}
