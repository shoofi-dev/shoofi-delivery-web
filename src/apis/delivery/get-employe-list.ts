import { axiosInstance } from "utils/http-interceptor";

export const getEmployesListApi = (companyId: string) => {
    const body:any = {
        companyId: companyId
    }
    return axiosInstance
      .post(`delivery/employe-list`, body)
      .then(function (response) {

         console.log("delivery/employe-list", response);
          return response;
      });
  };

  export default getEmployesListApi;