import { axiosInstance } from "../../../utils/http-interceptor";
import { BASE_URL } from "consts/api";

export const getStatisticsNewOrdersApi = (page: number = 1) => {
    return axiosInstance
      .post(`${BASE_URL}order/statistics/new-orders/${page}`, {headers: {
        "app-name": "shoofi"
      }})
      .then(function (response) {
        //   console.log("get orders list success", response);
          return response;
      });
  };

  export default getStatisticsNewOrdersApi;