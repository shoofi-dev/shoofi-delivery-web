import searchCustomer from "apis/delivery/search-customer";
import Navbar from "components/Navbars/IndexNavbar";
import { BASE_URL } from "consts/api";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCustomerFlow = async (phoneNumberValue: any) => {
    try {
      const response: any = await searchCustomer(phoneNumberValue);
      if (response && response?.length) {
        const user = response[0];
        if (user.isActive) {
          localStorage.setItem("customerData", JSON.stringify(user));

          if (user.role === "store") {
            navigate(`/delivery-list`);
          } else {
            navigate(`/delivery-list`);
          }
          return;
        }
        setErrorMessage("الرجاء التواصل مع المسؤل");

        return;
      }
      setErrorMessage("الرقم غير مسجل");
    } catch (error) {
      console.error("Error during login:", error);
      alert(error);
    }
  };

  useEffect(() => {
    const customerData = localStorage.getItem("customerData");
    if (customerData) {
      const parsedCustomerData = JSON.parse(customerData);
      handleCustomerFlow(parsedCustomerData?.phone);
    }
  }, []);

  const validatePhoneNumber = (number: any) => {
    const phoneRegex = /^\+?[0-9]\d{9}$/; // Simple E.164 validation
    return phoneRegex.test(number);
  };


  const validateCode = (value: any) => {
    return value === "2255"
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    if(e.target.id === "phoneNumber"){
      setPhoneNumber(value);
      setIsValid(validatePhoneNumber(value));
      if(value === "0544605797"){
        setIsCodeValid(false)
      }
    }
    if(e.target.id === "code"){
      setCode(value);
      setIsCodeValid(validateCode(value));
    }

  };

  const handleSubmit = async () => {
    if (!phoneNumber) {
      return;
    }

    handleCustomerFlow(phoneNumber);
  };

  return (
    <>
      <section className="bg-green-100 h-[100%] relative items-center  justify-center text-center h-full w-full pt-10 px-5">
        <img
        alt="..."
        src="/shoofi-logo-blue.png"
        className="align-middle rounded-t-lg h-40 md:h-40 self-center m-auto mb-10"
      />

        <div className=" bg-gray px-6 py-4  rounded-lg shadow-lg w-full ">
          <h2 className="text-2xl font-bold mb-6 text-white">ادخل رقم الهاتف</h2>
          <input
            type="text"
            placeholder="رقم الهاتف"
            value={phoneNumber}
            onChange={handleInputChange}
            id="phoneNumber"
            className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue text-lg mb-2"
          />
          <div className="text-red-500 text-right">{errorMessage}</div>
          {phoneNumber === "0544605797" &&<input
            type="text"
            placeholder="ادخل الكود"
            value={code}
            onChange={handleInputChange}
            id="code"
            className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue text-lg mb-2"
          />}
          <button
            onClick={handleSubmit}
            disabled={!isValid && !isCodeValid}
            className={`mt-4 w-[60%] mt-2 px-4 py-3 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue ${
              isValid && isCodeValid
                ? "bg-blue text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            تم
          </button>
        </div>
      </section>
    </>
  );
}
