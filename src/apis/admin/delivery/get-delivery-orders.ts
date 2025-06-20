import { axiosInstance } from "utils/http-interceptor";

const getDeliveryOrders = async (params: any) => {
  try {
    const response = await axiosInstance.get('/delivery/admin/orders', { params });
    return response;
  } catch (error) {
    console.error("Error fetching delivery orders:", error);
    throw error;
  }
};

export default getDeliveryOrders; 