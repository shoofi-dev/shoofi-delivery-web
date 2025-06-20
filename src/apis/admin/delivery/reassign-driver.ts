import { axiosInstance } from "utils/http-interceptor";

const reassignDriver = async (body: any) => {
  try {
    const { data } = await axiosInstance.post('/delivery/admin/reassign', body);
    return data;
  } catch (error) {
    console.error("Error reassigning driver:", error);
    throw error;
  }
};

export default reassignDriver; 