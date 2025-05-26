import { axiosInstance } from "utils/http-interceptor";

export const updateDeliveryAPI = (data: any) => {
    const body = data;
    return axiosInstance
      .post(`delivery/update`, body)
      .then(function (response) {

         console.log("menu list success", response);
          return response;
      });
  };

  export default updateDeliveryAPI;