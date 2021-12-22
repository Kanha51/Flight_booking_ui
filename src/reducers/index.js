import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./auth";
import flightReducer from "./flight";

export default combineReducers({
  form: formReducer,
  auth: authReducer,
  flight: flightReducer,
});
