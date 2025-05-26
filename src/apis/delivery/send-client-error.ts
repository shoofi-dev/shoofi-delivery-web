import { axiosInstance } from "utils/http-interceptor";

export const sendClientError = (data: any) => {
    const body = data;
    return axiosInstance
      .post(`error-handler/insert-client-error`, body)
      .then(function (response) {

         console.log("menu list success", response);
          return response;
      });
  };

  export default sendClientError;