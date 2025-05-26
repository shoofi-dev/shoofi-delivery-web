import axios from "axios";
import { BASE_URL } from "consts/api";
import { axiosInstance } from "utils/http-interceptor";

export const getOrdersListApi = (page: number = 1) => {
  const body = {
    pageNumber: page,
    oderDirecton: -1
  }
    return axiosInstance
      .post(`${BASE_URL}order/admin/orders`,body)
      .then(function (response) {

         console.log("get orders list success", response);
          return response;
      });
  };

  export default getOrdersListApi;