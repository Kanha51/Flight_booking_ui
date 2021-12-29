import axios from "axios";
import { encode as base64_encode } from "base-64";
import {
  AUTH_SIGN_IN,
  AUTH_SIGN_UP,
  AUTH_ERROR,
  AUTH_SIGN_OUT,
  CLEAR_FLIGHT,
  ADMIN_AUTH_SIGN_IN,
  FLIGHT_ERROR,
  SEARCH_FLIGHT,
  CLEAR_FLIGHT_ERROR,
  BOOK_FLIGHT,
  USER_DETAILS_ERROR,
} from "./types";

import {
  ADMIN_LOGIN,
  REGISTER_AIRLINE,
  ADD_UPDATE_FLIGHT,
  SEARCH_FLIGHT_URL,
  USER_SIGN_UP_URL,
  USER_LOGIN_URL,
  USER_BOOK_TICKET,
  USER_FLIGHT_CANCEL,
} from "./urlConstant";

export const signOut = () => {
  return (dispatch) => {
    localStorage.removeItem("JWT_TOKEN");
    axios.defaults.headers.common["Authorization"] = "";

    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
    localStorage.clear();
    sessionStorage.clear();
    dispatch({
      type: AUTH_SIGN_OUT,
      payload: {},
    });
    dispatch({
      type: CLEAR_FLIGHT,
    });
  };
};

export const validateSignIn = (data) => {
  return () => {
    if (data.username && data.password) {
      return true;
    } else {
      return false;
    }
  };
};
export const signIn = (data) => {
  var encoded = base64_encode(data.password);
  data.password = encoded;
  return async (dispatch) => {
    try {
      const config = {
        headers: { Authorization: `` },
      };
      const res = await axios.post(ADMIN_LOGIN, data, config);
      console.log(res);
      dispatch({
        type: ADMIN_AUTH_SIGN_IN,
        payload: "admin",
      });

      localStorage.setItem("JWT_TOKEN", res.data.token);
      localStorage.setItem("USER_TYPE", "admin");
      const authHeader = "";
      axios.defaults.headers.common["Authorization"] = authHeader;
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: "Email or password isn't correct",
      });
      console.log(error);
    }
  };
};

export const registerNewAirlines = (data) => {
  return async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ` + localStorage.getItem("JWT_TOKEN"),
        },
      };

      const res = await axios.post(REGISTER_AIRLINE, data, config);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
};

export const addUpateFlight = (data) => {
  return async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ` + localStorage.getItem("JWT_TOKEN"),
        },
      };

      const res = await axios.post(ADD_UPDATE_FLIGHT, data, config);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
};

export const validateSearch = (data) => {
  return (dispatch) => {
    if (data.fromPlace && data.toPlace && data.travelStartDate) {
      if (data.fromPlace === data.toPlace) {
        dispatch({
          type: FLIGHT_ERROR,
          payload: "Source and destination cannot be same",
        });
        return false;
      } else {
        console.log(Date.now());
        if (Date.parse(data.travelStartDate) < Date.now()) {
          dispatch({
            type: FLIGHT_ERROR,
            payload: "Past date is not allowed",
          });
          return false;
        } else return true;
      }
    } else {
      dispatch({
        type: FLIGHT_ERROR,
        payload: "All fields are required",
      });
      return false;
    }
  };
};

export const searchFlight = (data) => {
  return async (dispatch) => {
    try {
      const config = {
        headers: { Authorization: "" },
      };
      const res = await axios.post(SEARCH_FLIGHT_URL, data, config);
      console.log(res.data);
      if (res.data.length > 0) {
        dispatch({
          type: SEARCH_FLIGHT,
          payload: res.data,
        });
        dispatch({
          type: CLEAR_FLIGHT_ERROR,
          payload: "",
        });
      } else {
        dispatch({
          type: FLIGHT_ERROR,
          payload: "Could not get any flights",
        });
      }
      // return res.data;
    } catch (error) {
      dispatch({
        type: FLIGHT_ERROR,
        payload: "Could not connect",
      });
      console.log(error);
    }
  };
};

export const validateSignUp = (data) => {
  return (dispatch) => {
    if (
      data.email &&
      data.password1 &&
      data.password2 &&
      data.fName &&
      data.lName
    ) {
      if (data.password1 !== data.password2) {
        dispatch({
          type: AUTH_ERROR,
          payload: "Passwords don't match",
        });
        return false;
      } else return true;
    } else {
      dispatch({
        type: AUTH_ERROR,
        payload: "All fields are required",
      });
      return false;
    }
  };
};

export const signUp = (data) => {
  return async (dispatch) => {
    try {
      const config = {
        headers: { Authorization: "" },
      };
      var encoded = base64_encode(data.password1);
      const user = {
        emailId: data.email,
        password: encoded,
        fName: data.fName,
        lName: data.lName,
      };
      const res = await axios.post(USER_SIGN_UP_URL, user, config);
      console.log(res);
      dispatch({
        type: AUTH_SIGN_UP,
        payload: res.data,
      });

      localStorage.setItem("JWT_TOKEN", res.data.token);
      const authHeader = "Bearer " + res.data.token;
      axios.defaults.headers.common["Authorization"] = authHeader;
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: "Email is already in use",
      });
      console.log(error);
    }
  };
};

export const userSignIn = (data) => {
  var encoded = base64_encode(data.password);
  data.password = encoded;
  return async (dispatch) => {
    try {
      const config = {
        headers: { Authorization: `` },
      };
      const res = await axios.post(USER_LOGIN_URL, data, config);
      console.log(res);
      dispatch({
        type: AUTH_SIGN_IN,
        payload: "user",
      });

      localStorage.setItem("JWT_TOKEN", res.data.token);
      localStorage.setItem("USER_TYPE", "user");
      localStorage.setItem("USER_NAME", data.username);
      const authHeader = "";
      axios.defaults.headers.common["Authorization"] = authHeader;
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: "Email or password isn't correct",
      });
      console.log(error);
    }
  };
};

export const storeFlight = (data) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: BOOK_FLIGHT,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: FLIGHT_ERROR,
        payload: "No flight found for given id",
      });
      console.log(error);
    }
  };
};

export const validateUserDetails = (data) => {
  return (dispatch) => {
    if (
      data.firstName &&
      data.lastName &&
      data.birthdate &&
      data.govtProof &&
      data.govtProofId
    ) {
      if (Date.parse(data.birthdate) > Date.now()) {
        dispatch({
          type: USER_DETAILS_ERROR,
          payload: "Future date is not allowed",
        });
        return false;
      } else return true;
    } else {
      dispatch({
        type: USER_DETAILS_ERROR,
        payload: "All fields are required",
      });
      return false;
    }
  };
};

export const addUserDetails = (formData, flight, sData) => {
  return async (dispatch) => {
    try {
      const config = {
        headers: {
          Authorization: "",
        },
      };

      const data = {
        customerEmailId: localStorage.getItem("USER_NAME"),
        customerName: formData.firstName + " " + formData.lastName,
        airlineName: flight.airlineName,
        flightFrom: flight.fromFlight,
        flightFromCode: flight.fromFlightCode,
        flightNo: flight.flightNo,
        flightTo: flight.toFlight,
        flightToCode: flight.toFlightCode,
        mealType: flight.meals,
        price: sData.total,
        startDate: flight.startDate,
        seatType: sData.seatTypes,
        landingTime: flight.landingTime,
        takeOffTime: flight.takeOffTime,
        dateTime: localStorage.getItem("FLIGHT_DATE"),
        discountPercentage: sData.discountPercentage,
      };

      await axios.post(USER_BOOK_TICKET, data, config);
    } catch (error) {
      dispatch({
        type: USER_DETAILS_ERROR,
        payload: "Adding passenger failed",
      });
      console.log(error);
    }
  };
};

export const cancelTicket = (payData) => {
  return async (dispatch) => {
    try {
      const config = {
        headers: {
          Authorization: "",
        },
      };

      await axios.post(USER_FLIGHT_CANCEL, payData, config);
    } catch (error) {
      dispatch({
        type: USER_DETAILS_ERROR,
        payload: "Adding passenger failed",
      });
      console.log(error);
    }
  };
};
