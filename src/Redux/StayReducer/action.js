import axios from "axios";
import {
  SELECTED_DATE_AND_CITY,
  SELECTED_CITY,
  HOTEL_FAILURE,
  HOTEL_REQUEST,
  GET_HOTEL_SUCCESS,
  POST_HOTEL_SUCCESS,
  NEW_GET_HOTELS_SUCCESS,
  DELETE_HOTEL,
} from "./actionType";

export const getHotelSuccess = (payload) => {
  return { type: GET_HOTEL_SUCCESS, payload };
};

export const postHotelSuccess = (payload) => {
  return { type: POST_HOTEL_SUCCESS };
};

export const hotelRequest = () => {
  return { type: HOTEL_REQUEST };
};

export const hotelFailure = () => {
  return { type: HOTEL_FAILURE };
};

export const fetch_hotel = (payload) => {
  return { type: NEW_GET_HOTELS_SUCCESS, payload };
};

//
export const handleDeleteHotel = (payload) => {
  return { type: DELETE_HOTEL, payload };
};

//Pick date and city for storing into redux store

export const selectDateAndCity = (checkInDate,checkOutDate) => {
  return { type: SELECTED_DATE_AND_CITY, payload: { checkInDate, checkOutDate } };
};
export const selectCity = (selectedCity) => {
  return { type: SELECTED_CITY, payload: { selectedCity } };
};

export const addHotel = (payload) => (dispatch) => {
  dispatch(hotelRequest());

  axios
    .post("http://localhost:8080/hotel", payload) 
    .then(() => {
      dispatch(postHotelSuccess());
    })
    .catch((err) => {
      dispatch(hotelFailure());
    });
};

//http://localhost:8080/hotel?_sort=asc&_order=price&page=1&_limit=20
export const fetchingHotels = (param1, param2, page) => async (dispatch) => {
  const field = (param1 === "price" || param1 === "rating") ? param1 : ((param2 === "price" || param2 === "rating") ? param2 : "");
  const direction = (param1 === "asc" || param1 === "desc") ? param1 : ((param2 === "asc" || param2 === "desc") ? param2 : "");

  dispatch({ type: HOTEL_REQUEST });

  try {
    let url = `http://localhost:8080/hotel`;
    const params = [];

    if (page) params.push(`_page=${page}`);

    if (field) {
      const sortParam = direction === "desc" ? `-${field}` : field;
      params.push(`_sort=${sortParam}`);
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    console.log("Fetching URL:", url);
    const res = await axios.get(url);
    const hotelArray = Array.isArray(res.data) ? res.data : (res.data?.data || []);
    console.log("Fetched hotels:", hotelArray.length);
    dispatch({ type: GET_HOTEL_SUCCESS, payload: hotelArray });
  } catch (err) {
    dispatch({ type: HOTEL_FAILURE });
    console.log(err);
  }
};
//

export const DeleteHotel = (deleteId) => async (dispatch) => {
  try {
    const res = await fetch(
      `http://localhost:8080/hotel/${deleteId}`, 
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await res.json();
    console.log(data);
    dispatch(handleDeleteHotel(deleteId));
  } catch (e) {
    console.log(e);
  }
};
