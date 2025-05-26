import Navbar from "components/Navbars/IndexNavbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "utils/http-interceptor";

const rolesList =[{
  label: 'store',
  value: 'store'
},{
  label: 'employe',
  value: 'employe'
}]

const AddCustomer = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [customerData, setCustomerData] = useState<any>();
  const [formData, setFormData] = useState<any>({
    fullName: "",
    phone: "",
    role: "",
    isActive: true
  });

  useEffect(() => {
    const customerData = localStorage.getItem("customerData");
    if (customerData) {
      const parsedCustomerData = JSON.parse(customerData);
      setCustomerData(parsedCustomerData);
    } else {
      navigate(`/`);
    }
  }, []);

  const validate = () => {
    const errors: any = {};
    if (!formData.fullName.trim()) errors.fullName = "الاسم مطلوب";
    if (!formData.phone.trim()) {
      errors.phone = "رقم الهاتف مطلوب";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "رقم الهاتف غير صالح";
    }
    if (!formData.role) {
      errors.role = "السعر مطلوب";
    }
    return errors;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    setErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  const createCustomer = async (customerData: any) => {
    console.log("dddd",customerData)
    const api = `/delivery/create-customer`;
    const body = {
      customerData,
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
    await createCustomer(formData);

    // Simulating an API call
    setLoading(false);
    setSuccessMessage("تم إرسال الطلب بنجاح!");
    setFormData({ fullName: "", phone: "", role: "" });
    navigate(`/delivery-list`);
  };

  return (
    <>
      <Navbar />
      <div className="mt-14 pt-6 p-4 bg-blueGray-900 h-full  rtl  justify-center md:flex">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center text-white">
            اضف مستخدم
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-lg text-white mb-2">
                الاسم
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
              النوع
              </label>
              <select
                onChange={handleChange}
                name="role"
                defaultValue=""
                className="w-full bg-none p-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option value="" disabled>
                  اختر النوع
                </option>
                {rolesList?.map((role: any) => (
                  <option key={role.value} value={role.value}>
                    {role.value}
                  </option>
                ))}
              </select>
              <span className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-500">
                &#9662; {/* Unicode for left arrow */}
              </span>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
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
        </div>
      </div>
    </>
  );
};

export default AddCustomer;
