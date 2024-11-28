import { api } from "../../../config/api";
import {
  createOrderFailure,
  createOrderRequest,
  createOrderSuccess,
  getUsersOrdersFailure,
  getUsersOrdersRequest,
  getUsersOrdersSuccess,
} from "./ActionCreators";
import {
  GET_USERS_NOTIFICATION_FAILURE,
  GET_USERS_NOTIFICATION_SUCCESS,
} from "./ActionTypes";

export const createOrder = ({ data, jwt }) => {
  return async (dispatch) => {
    dispatch(createOrderRequest());
    try {
      // console.log(reqData);
      const response = await api.post("/api/order", data, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("this is resopnse:", response.data);
      // console.log("post"); "Request failed with status code 400"
      // if (order.payment_url) {
      //   window.location.href = order.payment_url;
      // }
      // console.log("created order data", order);
      // console.log("createdAgaain");
      // console.log("this is data:", order);
      // dispatch(createOrderSuccess(order));
      dispatch({
        type: "CREATE_ORDER_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      console.log("error ", error);
      dispatch(createOrderFailure(error));
    }
  };
};

export const getUsersOrders = (jwt) => {
  return async (dispatch) => {
    dispatch(getUsersOrdersRequest());
    try {
      // console.log("getCalled with data:", jwt);
      const { data } = await api.get(`/api/order/user`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch(getUsersOrdersSuccess(data));
    } catch (error) {
      dispatch(getUsersOrdersFailure(error));
    }
  };
};

export const getUsersNotificationAction = () => {
  return async (dispatch) => {
    dispatch(createOrderRequest());
    try {
      const { data } = await api.get("/api/notifications");

      console.log("all notifications ", data);
      dispatch({ type: GET_USERS_NOTIFICATION_SUCCESS, payload: data });
    } catch (error) {
      console.log("error ", error);
      dispatch({ type: GET_USERS_NOTIFICATION_FAILURE, payload: error });
    }
  };
};
