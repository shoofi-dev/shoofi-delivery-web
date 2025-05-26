import { axiosInstance } from "utils/http-interceptor";

export const getPaymentsListAPI = () => {
    const body:any = { }
  
    return axiosInstance
      .post(`delivery/employe-payments`, body)
      .then(function (response) {

         console.log("employe-payments", response);
          return response;
      });
  };

  export default getPaymentsListAPI;