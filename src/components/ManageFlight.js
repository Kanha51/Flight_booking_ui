import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import { ADD_UPDATE_FLIGHT, GET_FLIGHT_DATA } from "../actions/urlConstant";

function ManageFlight() {
  //   console.log(fetchFlights);

  var columns = [
    { title: "Flight No", field: "flightNo", editable: "never" },
    { title: "Business Seats", field: "businessSeats", type: "numeric" },
    { title: "Non Business Seats", field: "nonBusinessSeats", type: "numeric" },
    { title: "No. of Rows", field: "noOfRows", type: "numeric" },
    { title: "Fare", field: "ticketCost", type: "decimal" },
    { title: "Tax", field: "tax", type: "decimal" },
    { title: "Take Off Time", field: "takeOffTime", type: "time" },
    { title: "Landing Time", field: "landingTime", type: "time" },
  ];

  const [data, setData] = useState([]);

  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ` + localStorage.getItem("JWT_TOKEN") },
    };
    axios
      .get(GET_FLIGHT_DATA, config)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((error) => {
        console.log("Error");
      });
  }, []);

  const handleRowUpdate = (newData, oldData, resolve) => {
    //validation
    let errorList = [];

    if (newData.startDate === "") {
      errorList.push("Please enter Start Date");
    }
    if (newData.businessSeats === "") {
      errorList.push("Please enter No. Of Business Seats");
    }
    if (newData.nonBusinessSeats === "") {
      errorList.push("Please enter No. Of Non Business Seats");
    }
    if (newData.noOfRows === "") {
      errorList.push("Please enter No. of Rows");
    }
    if (newData.ticketCost === "") {
      errorList.push("Please enter fare");
    }
    if (newData.tax === "") {
      errorList.push("Please enter tax");
    }
    if (newData.otherCharges === "") {
      errorList.push("Please enter other Charges");
    }
    if (newData.otherChargesInfo === "") {
      errorList.push("Please enter OtherCharges Info");
    }

    if (errorList.length < 1) {
      const config = {
        headers: {
          Authorization: `Bearer ` + localStorage.getItem("JWT_TOKEN"),
        },
      };
      // newData.landingTime = newData.landingTime.newData.takeOffTime =
      //   newData.takeOffTime.substr(17, 25);
      axios
        .post(ADD_UPDATE_FLIGHT, newData, config)
        .then((res) => {
          const dataUpdate = [...data];
          const index = oldData.tableData.id;
          dataUpdate[index] = res.data;
          setData([...dataUpdate]);
          resolve();
          setIserror(false);
          setErrorMessages([]);
        })
        .catch((error) => {
          setErrorMessages(["Update failed! Server error"]);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
    }
  };

  return (
    <div className="App">
      <Grid container spacing={1}>
        <Grid item xs={1}></Grid>
        <Grid item xs={0}>
          <div>
            {iserror && (
              <Alert severity="error">
                {errorMessages.map((msg, i) => {
                  return <div key={i}>{msg}</div>;
                })}
              </Alert>
            )}
          </div>

          <MaterialTable
            title="Manage flights"
            columns={columns}
            data={data}
            // icons={tableIcons}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  handleRowUpdate(newData, oldData, resolve);
                }),
            }}
          />
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
    </div>
  );
}
export default ManageFlight;
