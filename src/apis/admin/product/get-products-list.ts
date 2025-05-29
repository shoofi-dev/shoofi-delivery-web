import { BASE_URL, MENU_API } from "consts/api";
import { axiosInstance } from "utils/http-interceptor";

export const getProductsListApi = (headers = {}) => {
    return axiosInstance
      .get(`${BASE_URL}${MENU_API.GET_MENU_API}`, { headers })
      .then(function (response: any) {
           console.log("get orders list success", response);
          return response.menu;
      });
  };      


  export default getProductsListApi;