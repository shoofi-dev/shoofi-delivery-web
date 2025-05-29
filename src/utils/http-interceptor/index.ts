import sendClientError from "apis/delivery/send-client-error";
import axios from "axios";
import { BASE_URL } from "consts/api";

const general_errors_codes = ["-400", "-6", "-7", "-10", "-11", "-401"];
const TOKEN_NOT_VALID = -12;
export const axiosInstance = axios.create({
  baseURL: BASE_URL + "/",
});

axiosInstance.interceptors.request.use(
  async function (config: any) {
    const token = await localStorage.getItem("@storage_userToken");
    console.log("token", token)
    if (token) {
      config.headers["Authorization"] = "Token " + token;
    }
    if (config.headers["Content-Type"] !== "multipart/form-data") {
      config.headers["Content-Type"] = "application/json";
    }
    config.headers["app-name"] = config.headers["app-name"] || 'shoofi';
    return config;
  },
  function (error) {

    if (error?.message?.includes("Network Error")) {
 
    }
    if (error?.message?.includes("timeout")) {

    }
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response: any) {

    if (
      response.has_err &&
      general_errors_codes.indexOf(response.error_code) > -1
    ) {
      const customerData = localStorage.getItem("customerData");
      sendClientError({...response, customerData})
    }

    return response.data;
  },
  function (error) {
    const customerData = localStorage.getItem("customerData");
    sendClientError({...error, customerData})
    if (error?.message?.includes("Network Error")) {
 
    }
    if (
      error?.message?.includes("timeout") ||
      error?.message?.includes("Network Error")
    ) {
  
    }
    if (error?.message?.includes("401")) {
 
    }
    return Promise.reject(error);
  }
);
