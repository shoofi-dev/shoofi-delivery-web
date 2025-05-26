import { axiosInstance } from "utils/http-interceptor";

export const getDeliveryListApi = (isAllChecked:boolean, customerData: any,isAllWeek: boolean) => {
    const body:any = {
      customerId: customerData._id,
      isAllWeek
    }
    if(isAllChecked){
      body.statusList = ["0","1","2","3","4","-1"]
    }
    return axiosInstance
      .post(`delivery/list`, body)
      .then(function (response) {

         console.log("menu list success", response);
          return response;
      });
  };

  export default getDeliveryListApi;