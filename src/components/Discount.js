import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import { DISCOUNT_SAVE, DISCOUNT_GET } from "../actions/urlConstant";

function Discount() {
  var columns = [
    {
      title: "Discount Code",
      field: "discountCode",
    },

    {
      title: "Discount Description",
      field: "discountDescription",
    },
    { title: "Discount %", field: "discountPercentage", type: "decimal" },
  ];

  const [data, setData] = useState([]);

  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: "",
      },
    };
    axios
      .get(DISCOUNT_GET, config)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((error) => {
        console.log("Error");
      });
  }, []);

  const handleRowAdd = (newData, resolve) => {
    const config = {
      headers: {
        Authorization: "",
      },
    };
    //validation
    let errorList = [];
    if (newData.discountCode === "") {
      errorList.push("Please enter Discount Code");
    }
    if (newData.discountDescription === "") {
      errorList.push("Please enter Discount Description");
    }
    if (newData.discountPercentage === "") {
      errorList.push("Please enter Discount %");
    }
    if (errorList.length < 1) {
      axios
        .post(DISCOUNT_SAVE, newData, config)
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
            title="Manage Discounts"
            columns={columns}
            data={data}
            // icons={tableIcons}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve) => {
                  handleRowAdd(newData, resolve);
                }),
            }}
          />
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
    </div>
  );
}
export default Discount;
