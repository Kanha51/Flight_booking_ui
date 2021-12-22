import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import {
  REGISTER_AIRLINE,
  GET_AIRLINE_DATA,
  BLOCK_AIRLINE,
} from "../actions/urlConstant";

function Flights() {
  var columns = [
    {
      title: "Airlines Company",
      field: "airlineName",
    },

    {
      title: "Airlines Address",
      field: "airlineAddress",
    },
    { title: "Date", field: "startDate", type: "date" },
    {
      title: "Airlines Conatct No",
      field: "contactNo",
      type: "numeric",
    },
    { title: "Flight No", field: "flightNo", editable: "never" },

    {
      title: "Source",
      field: "fromFlight",
    },
    {
      title: "Destination",
      field: "toFlight",
    },

    {
      title: "Source Code",
      field: "fromFlightCode",
    },
    {
      title: "Destination Code",
      field: "toFlightCode",
    },

    {
      title: "Instrument",
      field: "instrument",
    },

    {
      title: "Meals",
      field: "meals",
    },
  ];

  const [data, setData] = useState([]);

  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ` + localStorage.getItem("JWT_TOKEN") },
    };
    axios
      .get(GET_AIRLINE_DATA, config)
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
    if (newData.airlines === "") {
      errorList.push("Please enter airlines company name");
    }
    if (newData.name === "") {
      errorList.push("Please enter flight name");
    }
    if (newData.from === "") {
      errorList.push("Please enter source");
    }
    if (newData.to === "") {
      errorList.push("Please enter destination");
    }
    if (newData.date === "") {
      errorList.push("Please enter date");
    }
    if (newData.fare === "") {
      errorList.push("Please enter fare");
    }

    if (errorList.length < 1) {
      const config = {
        headers: {
          Authorization: `Bearer ` + localStorage.getItem("JWT_TOKEN"),
        },
      };
      axios
        .post(REGISTER_AIRLINE, newData, config)
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

  const handleRowAdd = (newData, resolve) => {
    //validation
    let errorList = [];
    if (newData.airlines === "") {
      errorList.push("Please enter airlines company name");
    }
    if (newData.name === "") {
      errorList.push("Please enter flight name");
    }
    if (newData.from === "") {
      errorList.push("Please enter source");
    }
    if (newData.to === "") {
      errorList.push("Please enter destination");
    }
    if (newData.date === "") {
      errorList.push("Please enter date");
    }
    if (newData.fare === "") {
      errorList.push("Please enter fare");
    }

    if (errorList.length < 1) {
      const config = {
        headers: {
          Authorization: `Bearer ` + localStorage.getItem("JWT_TOKEN"),
        },
      };
      axios
        .post(REGISTER_AIRLINE, newData, config)
        .then((res) => {
          let dataToAdd = [...data];
          dataToAdd.push(res.data);
          setData(dataToAdd);
          resolve();
          setErrorMessages([]);
          setIserror(false);
        })
        .catch((error) => {
          setErrorMessages(["Cannot add data. Server error!"]);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
    }
  };

  const handleRowDelete = (oldData, resolve) => {
    const config = {
      headers: { Authorization: `Bearer ` + localStorage.getItem("JWT_TOKEN") },
    };
    console.log(oldData);
    axios
      .post(BLOCK_AIRLINE, oldData, config)
      .then((res) => {
        const dataDelete = [...data];
        const index = oldData.tableData._id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve();
      })
      .catch((error) => {
        setErrorMessages(["Delete failed! Server error"]);
        setIserror(true);
        resolve();
      });
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
              onRowAdd: (newData) =>
                new Promise((resolve) => {
                  handleRowAdd(newData, resolve);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  handleRowDelete(oldData, resolve);
                }),
            }}
          />
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
    </div>
  );
}
export default Flights;
