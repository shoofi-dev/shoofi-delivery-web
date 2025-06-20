import { axiosInstance } from "utils/http-interceptor";

const getDeliveryAlerts = async () => {
  try {
    const response = await axiosInstance.get('/delivery/admin/alerts');
    return response;
  } catch (error) {
    console.error('Error fetching delivery alerts:', error);
    throw error;
  }
};

export default getDeliveryAlerts; 