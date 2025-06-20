import { axiosInstance } from "utils/http-interceptor";

const getAvailableDrivers = async (orderId?: string) => {
  try {
    const response = await axiosInstance.get('/delivery/admin/drivers', {
      params: { orderId }
    });
    return response;
  } catch (error) {
    console.error("Error fetching available drivers:", error);
    throw error;
  }
};

export default getAvailableDrivers; 