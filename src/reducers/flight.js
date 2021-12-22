import {
  SEARCH_FLIGHT,
  FLIGHT_ERROR,
  BOOK_FLIGHT,
  CLEAR_FLIGHT,
  CLEAR_BOOKING,
  CLEAR_FLIGHT_ERROR,
} from "../actions/types";

const DEFAULT_STATE = {
  flights: [],
  flight: {},
  booking: {},
  bookings: [],
  userDetails: {},
  cancelBooking: false,
  errorMessage: "",
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SEARCH_FLIGHT:
      return {
        ...state,
        flights: action.payload,
      };
    case BOOK_FLIGHT:
      return {
        ...state,
        flight: action.payload,
      };
    case CLEAR_BOOKING:
      return {
        ...state,
        cancelBooking: false,
        booking: action.payload,
      };
    case CLEAR_FLIGHT_ERROR:
      return {
        ...state,
        errorMessage: action.payload,
      };
    case CLEAR_FLIGHT:
      return {
        ...state,
        flights: [],
        flightId: {},
        booking: {},
        userDetails: {},
      };
    case FLIGHT_ERROR:
      return { ...state, errorMessage: action.payload };

    default:
      return state;
  }
};
