import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Grid,
  CardHeader,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MonetizationOnTwoToneIcon from "@mui/icons-material/MonetizationOnTwoTone";
import FastfoodTwoToneIcon from "@mui/icons-material/FastfoodTwoTone";

import { UserContext } from "../App";
import {
  useAllergics,
  useReligions,
  useStatistics,
  useTransactions,
  useUsers,
} from "../assets/api/apiFunctions";
import { useNavigate } from "react-router-dom";
import PieChartCard from "../components/PieChartCard";
import StatisticsShowNumberCard from "../components/StatisticsShowNumberCard";
import BarChartCard from "../components/BarChartCard";
import UserLineChart, { processUsersData } from "../components/UserLineChart ";
import LineChartComponent from "../components/LineChart ";

export default function GeneralAnalytics() {
  const { token, setToken } = useContext(UserContext);
  const [isTokenLoaded, setIsTokenLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("AdminToken");
    if (storedToken) {
      setToken(storedToken);
    } else {
      navigate("/login");
    }
    setIsTokenLoaded(true);
  }, [navigate, setToken]);

  let { data: dataAllergics = [], isLoading: isLoadingAllergics } =
    useAllergics(token, { enabled: isTokenLoaded && !!token });
  let { data: dataReligions = [], isLoading: isLoadingReligions } =
    useReligions(token, { enabled: isTokenLoaded && !!token });
  const { data: dataStatistics = [], isLoading: isLoadingStatistics } =
    useStatistics(token, { enabled: isTokenLoaded && !!token });
  let { data: dataTransactions = [], isLoading: isLoadingTransactions } =
    useTransactions(token, { enabled: isTokenLoaded && !!token });
  let { data: dataUsers = [], isLoading: isLoadingUsers } = useUsers(token);

  if (!isTokenLoaded)
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  if (
    isLoadingStatistics ||
    isLoadingTransactions ||
    isLoadingUsers ||
    isLoadingAllergics ||
    isLoadingReligions
  )
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  dataReligions = dataReligions.map((obj) => ({
    id: obj.id - 1,
    value: obj.count,
    label: obj.title,
  }));
  dataAllergics = dataAllergics.map((item) => ({
    id: item.id,
    value: item.count,
    label: item.label,
  }));
  dataTransactions = dataTransactions.map((transaction) => ({
    Id: transaction.id,
    UserId: transaction.userId,
    Amount: transaction.amount / 100,
    Currency: transaction.currency,
    Description: transaction.description,
    Date: new Date(transaction.date),
  }));
  dataUsers = processUsersData(dataUsers);

  return (
    <Grid container sx={{ padding: 5, background: "lightgray" }} spacing={2}>
      <Grid container spacing={2} item sm={12}>
        <Grid item xs={12} sm={12} xl={4}>
          <StatisticsShowNumberCard
            headerTitle="Number of users"
            headerSubTitle="The number of users using the app"
            iconComponent={<PersonIcon sx={{ fontSize: "5rem" }} />}
            value={dataStatistics[0]?.value ?? "0"}
          />
        </Grid>
        <Grid item xs={12} sm={12} xl={4}>
          <StatisticsShowNumberCard
            headerTitle="Revenue"
            headerSubTitle="Total revenue generated"
            iconComponent={
              <MonetizationOnTwoToneIcon
                sx={{
                  fontSize: "5rem",
                  color: "green",
                }}
              />
            }
            value={dataStatistics[1]?.value / 100 ?? "0"}
          />
        </Grid>
        <Grid item xs={12} sm={12} xl={4}>
          <StatisticsShowNumberCard
            headerTitle="Number of meals"
            headerSubTitle="The number of meals generated by users"
            iconComponent={
              <FastfoodTwoToneIcon
                sx={{
                  fontSize: "5rem",
                  color: "purple",
                }}
              />
            }
            value={dataStatistics[2]?.value ?? "0"}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} xs={12} sm={12} xl={8} item>
        <Grid item sm={6} sx={12}>
          <BarChartCard
            headerTitle="Allergic-to count"
            headerSubTitle="count of people with each allergies"
            data={dataAllergics}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <PieChartCard
            headerTitle="Religion Distribution"
            headerSubTitle="Percentage of each religion"
            data={dataReligions}
          />
        </Grid>
        <Grid item sm={12} xs={12}>
          <Card
            sx={{
              minHeight: 400,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <CardHeader title="Number of Users Signed Up by Year" />
            <UserLineChart data={dataUsers} />
          </Card>
        </Grid>
      </Grid>
      <Grid item container xs={12} sm={12} xl={4}>
        <Grid item sm={12} component={Card} sx={{ width: "100%" }}>
          <Card sx={{ margin: 2 }}>
            <CardHeader title="Purchases Transactions" />
            <Card
              sx={{
                margin: 2,
                background: "#ece5f4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LineChartComponent
                data={dataTransactions.map((transaction) => {
                  return {
                    date: transaction.Date.toISOString().split("T")[0],
                    amount: transaction.Amount,
                  };
                })}
              />
            </Card>
          </Card>
          <CardHeader title="Transactions" />
          <Grid
            item
            sx={{
              maxHeight: "500px",
              overflowY: "scroll",
              margin: 2,
              background: "#ece5f4",
            }}
          >
            {dataTransactions.length > 0 ? (
              dataTransactions.map((transaction, index) => {
                const formattedDate = new Date(transaction.Date)
                  .toISOString()
                  .split("T")[0];

                return (
                  <Card key={index} sx={{ margin: 1 }}>
                    <CardHeader
                      title={`Transaction #${transaction.Id}`}
                      subheader={`Date: ${formattedDate}`}
                    />

                    <Card sx={{ padding: 2 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <strong>Amount:</strong> {transaction.Amount}{" "}
                          {transaction.Currency}
                        </Grid>
                        <Grid item xs={12}>
                          <strong>Description:</strong>{" "}
                          {transaction.Description}
                        </Grid>
                        <Grid item xs={12}>
                          <strong>User ID:</strong> {transaction.UserId}
                        </Grid>
                      </Grid>
                    </Card>
                  </Card>
                );
              })
            ) : (
              <Card sx={{ margin: 1, padding: 2, textAlign: "center" }}>
                <CardHeader title="No Transactions Available" />
                <p>There are no data for transactions at the moment.</p>
              </Card>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
