import Navbar from "components/Navbars/IndexNavbar";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StoreContext } from "stores";
import { axiosInstance } from "utils/http-interceptor";

const DeliveryOrderForm = () => {
  const navigate = useNavigate();
  const { storeDataStore } = useContext(StoreContext);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [customerData, setCustomerData] = useState<any>();
  const [formData, setFormData] = useState<any>({
    fullName: "",
    phone: "",
    price: "",
    pickupTime: "",
    storeName: "",
  });

  useEffect(() => {
    const customerData = localStorage.getItem("customerData");
    if (customerData) {
      const parsedCustomerData = JSON.parse(customerData);
      setCustomerData(parsedCustomerData);
      setFormData((prev: any) => ({
        ...prev,
        storeName: parsedCustomerData?.fullName,
        storeId: parsedCustomerData?._id,
      }));
    } else {
      navigate(`/`);
    }
  }, []);

  const validate = () => {
    const errors: any = {};
    if (!formData.fullName.trim()) errors.fullName = "الاسم مطلوب";
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      errors.phone = "رقم الهاتف غير صالح";
    } 
    if (formData.price && (isNaN(formData.price) || formData.price <= 0)) {
      errors.price = "يرجى إدخال سعر صالح";
    } 
    if (!formData.pickupTime) errors.pickupTime = "يرجى اختيار موعد الاستلام";
    return errors;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    setErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  const bookCustomDelivery = async (deliveryData: any) => {
    const api = `/delivery/book`;
    const body = {
      deliveryData,
    };
    return axiosInstance.post(api, body).then(function (response: any) {
      // const res = JSON.parse(fromBase64(response.data));
      return response;
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setSuccessMessage("");
    setErrors({}); // Clear any previous errors

    try {
      await bookCustomDelivery(formData);
      setLoading(false);
      setSuccessMessage("تم إرسال الطلب بنجاح!");
      setFormData({ fullName: "", phone: "", price: "", pickupTime: "" });
      navigate(`/delivery-list`);
    } catch (error) {
      setLoading(false);
      setErrors({
        general: "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
      });
    }
  };

  if (!storeDataStore.storeData?.isOpen) {
    return (
      <>
        <Navbar />
        <div className="mt-14 pt-6 p-4 bg-blueGray-900 h-full  rtl  justify-center md:flex">
          <div className="max-w-md">
            <h1 className="text-3xl mt-10 font-bold mb-4 text-center text-red-500">
              مغلق
            </h1>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mt-14 pt-6 p-4 bg-blueGray-900 h-full  rtl  justify-center md:flex md:mt-20">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center text-white">
            طلب توصيل
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-lg text-white mb-2">
              * الاسم
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full border-gray-300 rounded p-2 focus:ring-blue focus:border-blue ${
                  errors.fullName ? "border-red-500" : ""
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-lg text-white mb-2">
                رقم الهاتف
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full border-gray rounded p-2 focus:ring-blue focus:border-blue ${
                  errors.phone ? "border-red-500" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-lg text-white mb-2">
                السعر
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full border-gray rounded p-2 focus:ring-blue focus:border-blue ${
                  errors.price ? "border-red-500" : ""
                }`}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>
            <div className="pb-10">
              <label className="block text-sm text-lg text-white mb-2">
              * موعد الاستلام
              </label>
              <div className="flex overflow-x-auto scrollbar-hide">
                {[10, 15, 20, 25, 30, 40, 45].map((time) => (
                  <div
                    key={time}
                    className={`flex-shrink-0 ml-2 w-20 h-20 flex items-center justify-center border rounded-lg cursor-pointer ${
                      formData.pickupTime === time.toString()
                        ? "bg-green-500 text-white"
                        : "bg-gray-100"
                    } ${errors.pickupTime ? "border-red-500" : ""}`}
                    onClick={() => {
                      setFormData((prev: any) => ({
                        ...prev,
                        pickupTime: time.toString(),
                      }));
                      setErrors((prev: any) => ({ ...prev, pickupTime: "" }));
                    }}
                  >
                    {time}
                  </div>
                ))}
              </div>
              {errors.pickupTime && (
                <p className="text-red-500 text-sm mt-1">{errors.pickupTime}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300 "
              disabled={loading}
            >
              {loading ? "جار الإرسال..." : "إرسال"}
            </button>
          </form>
          {successMessage && (
            <p className="mt-4 text-green-500 font-medium text-center">
              {successMessage}
            </p>
          )}
          {errors.general && (
            <p className="text-red-500 text-center text-sm mt-2">
              {errors.general}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default observer(DeliveryOrderForm);
