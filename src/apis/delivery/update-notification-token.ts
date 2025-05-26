import { axiosInstance } from "utils/http-interceptor";

export const updateNotificationToken = (customerId: any, notificationToken: string) => {
  const body = { customerId, notificationToken };
  return axiosInstance
    .post(`customer/update-notification-token`, body)
    .then(function (response) {
      return response;
    });
};

export default updateNotificationToken;
