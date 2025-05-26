import axios from "axios";
import { BASE_URL, MENU_API } from "consts/api";

export const getProductsListApi = () => {
    return axios
      .get(`${BASE_URL}${MENU_API.GET_MENU_API}`)
      .then(function (response) {
           console.log("get orders list success", response);
          return response.data.menu;
      });
  };      


  export default getProductsListApi;