export const BASE_URL = "http://localhost:8082/api/v1.0/";
export const USER_BASE_URL = "http://localhost:8084/api/v1.0/flight";
export const USER_LOGIN_URL = "http://localhost:8084/api/v1.0/user/login";

export const ADMIN_LOGIN = BASE_URL + "admin/login";
export const REGISTER_AIRLINE = BASE_URL + "flight/airline/register";
export const ADD_UPDATE_FLIGHT = BASE_URL + "flight/airline/inventory/add";
export const GET_FLIGHT_DATA = BASE_URL + "flight/airline/flightData";
export const GET_AIRLINE_DATA = BASE_URL + "flight/airline/airlinedata";
export const BLOCK_AIRLINE = BASE_URL + "flight/airline/block";
export const SEARCH_FLIGHT_URL = USER_BASE_URL + "/search";
export const USER_SIGN_UP_URL = USER_BASE_URL + "/signup";
export const USER_BOOK_TICKET = USER_BASE_URL + "/booking";
export const USER_FLIGHT_HISTORY = USER_BASE_URL + "/flighthistory";
export const USER_FLIGHT_CANCEL = USER_BASE_URL + "/cancel";
