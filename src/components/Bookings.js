import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

import { Link } from "react-router-dom";
import {
  USER_FLIGHT_HISTORY,
  USER_FLIGHT_CANCEL,
} from "../actions/urlConstant";

function Bookings() {
  var columns = [
    { title: "PNR No.", field: "pnrNo", editable: "never" },
    { title: "Airlines Company", field: "airlineName", editable: "never" },
    { title: "Passanger Name", field: "customerName", editable: "never" },
    { title: "Flight No", field: "flightNo", editable: "never" },
    { title: "Seat Type", field: "seatType", editable: "never" },
    {
      title: "Travelling Date",
      field: "dateTime",
      type: "date",
      editable: "never",
    },
    { title: "Flight From", field: "flightFrom", editable: "never" },
    { title: "Flight To", field: "flightTo", editable: "never" },
    {
      title: "Take Off Time",
      field: "takeOffTime",
      type: "time",
      editable: "never",
    },
    {
      title: "Landing Time",
      field: "landingTime",
      type: "time",
      editable: "never",
    },
    {
      title: "Ticket Cost",
      field: "price",
      type: "decimal",
      editable: "never",
    },
    {
      title: "Status",
      field: "cancelTicket",
      editable: "never",
    },
  ];
  // const exportPDF = (flightData) => {
  //   const unit = "pt";
  //   const size = "A4";
  //   const orientation = "portrait";

  //   const marginLeft = 40;
  //   const doc = new jsPDF(orientation, unit, size);

  //   doc.setFontSize(15);

  //   const title = "Flight Ticket";
  //   const headers = [
  //     [
  //       "Airline Name",
  //       "PNR No.",
  //       "PNR No.",

  //       "Passanger Name",
  //       "Travelling Date",
  //       "Flight From",
  //       "Flight No.",
  //       "Flight To",
  //       "Landing Time",
  //       "PNR No.",
  //       "Ticket Cost",
  //       "Seat Type",
  //       "Take Off Time",

  //       "Ticket Cost",
  //     ],
  //   ];
  //   flightData.tableData = 1;
  //   let content = {
  //     startY: 50,
  //     head: headers,
  //     body: flightData,
  //   };

  //   doc.text(title, marginLeft, 40);
  //   doc.autoTable1(content);
  //   doc.save("ticket.pdf");
  // };
  const [data, setData] = useState([]);

  useEffect(() => {
    const requestData = {
      userName: localStorage.getItem("USER_NAME"),
    };
    const config = {
      headers: { Authorization: `Bearer ` + localStorage.getItem("JWT_TOKEN") },
    };
    axios
      .post(USER_FLIGHT_HISTORY, requestData, config)
      .then((res) => {
        console.log(res.data);
        res.data.map((val) => {
          return val.cancelTicket === 1
            ? (val.cancelTicket = "Cancelled")
            : (val.cancelTicket = "Successfull");
        });
        setData(res.data);
      })
      .catch((error) => {
        console.log("Error");
      });
  }, []);

  const handleDelete = (flNo) => {
    const payData = {
      pnrNo: flNo,
    };

    const config = {
      headers: { Authorization: `Bearer ` + localStorage.getItem("JWT_TOKEN") },
    };

    axios
      .post(USER_FLIGHT_CANCEL, payData, config)
      .then((res) => console.log(res.data));

    // this.props.history.push("/bookinghistory");
  };

  return (
    <div className="App">
      <Grid container spacing={1}>
        <Grid item xs={1}></Grid>
        <Grid item xs={0}>
          <MaterialTable
            title="Flight History"
            columns={columns}
            data={data}
            actions={[
              (rowData) => ({
                icon: "delete",
                tooltip: "Delete Flight",
                onClick: () => handleDelete(rowData.pnrNo),
                disabled:
                  rowData.cancelTicket === "Cancelled" ||
                  rowData.canCancel === 0,
              }),
              // (rowData) => ({
              //   icon: "download",
              //   tooltip: "Download ticket",
              //   onClick: () => exportPDF(rowData),
              // }),
            ]}
            options={{
              actionsColumnIndex: -1,
            }}
          />
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
    </div>
  );
}
export default Bookings;
