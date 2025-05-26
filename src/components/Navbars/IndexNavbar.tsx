/*eslint-disable*/
import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
// components

import IndexDropdown from "components/Dropdowns/IndexDropdown.js";
import getStoreDataApi from "apis/delivery/get-store";
import clsx from "clsx";
import { StoreContext } from "stores";
import { observer } from "mobx-react-lite";

function Navbar(props: any) {
  const navigate = useNavigate();
  const { storeDataStore } = useContext(StoreContext);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [customerData, setCustomerData] = useState<any>();
  const navbarRef = useRef<any>(null); // Reference for the navbar container

  const getStoreDataFromApi = async () => {
    const storeDataRes: any = await getStoreDataApi();
    localStorage.setItem("storeData", JSON.stringify(storeDataRes[0]));
    storeDataStore.setStoreData(storeDataRes[0]);
  };
  useEffect(() => {
    const customerData = localStorage.getItem("customerData");
    if (customerData) {
      const parsedCustomerData = JSON.parse(customerData);
      setCustomerData(parsedCustomerData);

      getStoreDataFromApi();

      const interval = setInterval(() => {
        if (customerData) {
          getStoreDataFromApi();
        }
      }, 60 * 1000);

      return () => clearInterval(interval);
    }
  }, []);
  useEffect(() => {
    // Close the navbar when clicking outside of it
    const handleClickOutside = (event: any) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setNavbarOpen(false);
      }
    };

    // Add the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logOut = () => {
    localStorage.removeItem("customerData");
    navigate(`/`);
  };
  const gotToEmployePayments = () => {
    navigate(`/employe-payments`);
  };
  const gotToDeliveryList = () => {
    navigate(`/delivery-list`);
  };
  const goToBooDelivery = () => {
    navigate(`/delivery-order`);
  };
  const goToAddCustomer = () => {
    navigate(`/add-customer`);
  };
  const gotToAdminSettings = () => {
    navigate(`/admin-settings`);
  };

  return (
    <>
      <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-1 navbar-expand-lg bg-white shadow ">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full items-center relative flex justify-between  ">
            <Link
              to="/delivery-list"
              className="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-0 whitespace-nowrap uppercase self-center mx0a"
            >
              <img
                alt="..."
                src="/icon.png"
                className="align-middle rounded-t-lg h-12 md:h-20 self-center m-auto"
              />
            </Link>

            <div className="text-2xl">{customerData?.fullName}</div>

            <button
              className="cursor-pointer absolute left-10 text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block outline-none focus:outline-none"
              type="button"
              onClick={() => goToBooDelivery()}
            >
              <i
                className={clsx(
                  "fas fa-shipping-fast ",
                  storeDataStore.storeData?.isOpen ? "text-green-500" : "text-red-500"
                )}
              ></i>
            </button>
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block  outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div
            ref={navbarRef}
            className={
              "flex-grow items-center bg-white lg:shadow-none" +
              (navbarOpen ? " block" : " hidden")
            }
            id="example-navbar-warning"
          >
            <ul className="flex flex-col  list-none mr-auto pt-5">
              {
                <li
                  onClick={gotToDeliveryList}
                  className="flex items-center border-t"
                >
                  <div className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-lg uppercase font-bold">
                    قائمة الارساليات
                  </div>
                </li>
              }
              {customerData?.role === "admin" && (
                <li
                  onClick={gotToEmployePayments}
                  className="flex items-center border-t"
                >
                  <div className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-lg uppercase font-bold">
                    قائمة بعدد الارساليات
                  </div>
                </li>
              )}
              {customerData?.role === "admin" && (
                <li
                  onClick={gotToAdminSettings}
                  className="flex items-center border-t"
                >
                  <div className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-lg uppercase font-bold">
                    الاعدادات
                  </div>
                </li>
              )}
              {customerData?.role === "master" && (
                <li
                  onClick={goToAddCustomer}
                  className="flex items-center border-t"
                >
                  <div className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-lg uppercase font-bold">
                    اضف مستخدم
                  </div>
                </li>
              )}
              <li onClick={logOut} className="flex items-center border-t">
                <div className="hover:text-blueGray-500 text-red-500 px-3 py-4 lg:py-2 flex items-center text-lg uppercase font-bold">
                  الخروج
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
export default observer(Navbar);

