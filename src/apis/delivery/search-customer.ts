import { axiosInstance } from "utils/http-interceptor";

export const searchCustomer = (searchQuery: string) => {
    const body:any = {
        searchQuery
    }
    return axiosInstance
      .post(`customer/search-customer`, body)
      .then(function (response) {

         console.log("search-customer", response);
          return response;
      });
  };

  export default searchCustomer;