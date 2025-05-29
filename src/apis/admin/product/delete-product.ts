import { BASE_URL } from "consts/api";
import { axiosInstance } from "utils/http-interceptor";

export const deleteProductApi = (idsList: string[], storeAppName: string) => {
   
    return axiosInstance
      .post(BASE_URL+"admin/product/delete", {
        productsIdsList: idsList,
      },{
        headers: {
          "app-name": storeAppName,
        },
      })
      .then(function (response) {
          console.log("delete product success", response);
          return response.data;
      });
  };

  export default deleteProductApi;