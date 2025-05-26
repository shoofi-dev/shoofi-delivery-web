import axios from "axios";
import { BASE_URL } from "consts/api";

export const getClientErrosListApi = ({pageNumber}: {pageNumber:number}) => {
    const body = {
      pageNumber
    }
    return axios
      .post(`${BASE_URL}error-handler/get-client-error`, body)
      .then(function (response) {
        //   console.log("get orders list success", response);
          return response.data.data;
      });
  };

  export default getClientErrosListApi;