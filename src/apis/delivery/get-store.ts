import { axiosInstance } from "utils/http-interceptor";

export const getStoreDataApi = () => {
    const body:any = { }
  
    return axiosInstance
      .post(`store`, body)
      .then(function (response) {

          return response.data;
      });
  };

  export default getStoreDataApi;