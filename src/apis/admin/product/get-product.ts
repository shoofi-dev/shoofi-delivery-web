import axios from "axios";
import { BASE_URL } from "consts/api";
import { axiosInstance } from "utils/http-interceptor";

export const getProductApi = (id: string, storeAppName: string) => {
    return axiosInstance
      .get(`${BASE_URL}admin/product/${id}`, { headers: { 'app-name': storeAppName } })
      .then(function (response) {   
          console.log("get product success", response);
          return response;
      });
  };

  export default getProductApi;