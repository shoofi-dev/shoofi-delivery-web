// export getMenuFromServer = () => {
//     const body = {};
//     return axiosInstance
//       .get(`${MENU_API.GET_MENU_API}`)
//       .then(function (response) {
//         return response;
//       });
//   };

import { BASE_URL } from "consts/api";
import { axiosInstance } from "utils/http-interceptor";

export const getMenu = () => {
  const body = {

  }
    return axiosInstance
      .get(`${BASE_URL}menu`)
      .then(function (response) {

         console.log("menu list success", response);
          return response;
      });
  };

  export default getMenu;