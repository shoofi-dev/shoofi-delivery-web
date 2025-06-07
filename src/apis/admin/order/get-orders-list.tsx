import axios from "axios";
import { BASE_URL } from "consts/api";
import { axiosInstance } from "utils/http-interceptor";

interface OrderFilters {
  startDate?: string;
  endDate?: string;
  status?: string[];
  cityIds?: string[];
}

export const getOrdersListApi = (page: number = 1, filters?: OrderFilters) => {
  const body = {
    pageNumber: page,
    ...filters
  }
  return axiosInstance
    .post(`${BASE_URL}order/admin/all-orders`, body)
    .then(function (response) {
      console.log("get orders list success", response);
      return response;
    });
};

export default getOrdersListApi;