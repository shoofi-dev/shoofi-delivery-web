import { axiosInstance } from "utils/http-interceptor";

export const updateStoreDataApi = (isStoreClose: boolean, _id: any) => {
    const data ={
        isStoreClose,
        _id
    }
    const body:any = {
        data
     }
  
    return axiosInstance
      .post(`store/update`, body)
      .then(function (response) {

          return response.data;
      });
  };

  export default updateStoreDataApi;