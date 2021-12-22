import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";
import axios from "axios";

import reducers from "./reducers";
import Header from "./components/Header";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Flights from "./components/Flights";
import Bookings from "./components/Bookings";
import authGuard from "./components/authGuard";
import adminGuard from "./components/adminGuard";
import adminSignIn from "./components/AdminSignIn";
import BookFlight from "./components/BookFlight";
import ManageFlight from "./components/ManageFlight";
import History from "./components/BookingHistory";

const jwtToken = localStorage.getItem("JWT_TOKEN");
const authHeader = "Bearer " + jwtToken;
console.log(authHeader);

axios.defaults.headers.common["Authorization"] = authHeader;

function App() {
  return (
    <Provider
      store={createStore(
        reducers,
        {
          auth: {
            isAuthenticated: jwtToken ? true : false,
            token: jwtToken,
          },
        },
        applyMiddleware(reduxThunk)
      )}
    >
      <BrowserRouter>
        <div>
          <Header />
          <Route path="/" exact strict component={Home} />
          <div className="container">
            <Route path="/flights" exact strict component={ManageFlight} />
            <Route path="/signup" exact strict component={SignUp} />
            <Route path="/signin" exact strict component={SignIn} />
            <Route path="/adminsignin" exact strict component={adminSignIn} />
            <Route path="/addairline" exact strict component={Flights} />
            <Route path="/bookings" exact strict component={Bookings} />
            <Route path="/book" exact strict component={BookFlight} />
            <Route path="/bookinghistory" exact strict component={History} />
          </div>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
