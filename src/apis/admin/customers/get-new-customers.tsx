import { axiosInstance } from "../../../utils/http-interceptor";
import { BASE_URL } from "consts/api";

export const getNewCustomersApi = (page: number = 1) => {
    return axiosInstance
      .post(`${BASE_URL}customer/new-customers/${page}`, {headers: {
        "app-name": "shoofi"
      }})
      .then(function (response) {
        //   console.log("get orders list success", response);
          return response;
      });
  };

  export default getNewCustomersApi;