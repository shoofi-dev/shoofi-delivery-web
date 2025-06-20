/*eslint-disable*/
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import { useState } from "react";

const sideBarList = () => {
  return (
    <>
    <ul>
     <li className="items-center cursor-pointer">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/dashboard") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/dashboard"
                >
                  <i
                    className={
                      "fas fa-tv mr-2 text-sm " +
                      (window.location.href.indexOf("/admin/dashboard") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  Dashboard
                </Link>
              </li>

              <li className="items-center cursor-pointer">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/settings") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/settings"
                >
                  <i
                    className={
                      "fas fa-tools mr-2 text-sm " +
                      (window.location.href.indexOf("/admin/settings") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  Settings
                </Link>
              </li>

              <li className="items-center cursor-pointer">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/tables") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/tables"
                >
                  <i
                    className={
                      "fas fa-table mr-2 text-sm " +
                      (window.location.href.indexOf("/admin/tables") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  Tables
                </Link>
              </li>

              <li className="items-center cursor-pointer">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/delivery-monitor") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/delivery-monitor"
                >
                  <i
                    className={
                      "fas fa-truck mr-2 text-sm " +
                      (window.location.href.indexOf("/admin/delivery-monitor") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  Delivery Monitor
                </Link>
              </li>

              <li className="items-center cursor-pointer">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/maps") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/maps"
                >
                  <i
                    className={
                      "fas fa-map-marked mr-2 text-sm " +
                      (window.location.href.indexOf("/admin/maps") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  Maps
                </Link>
              </li>
            </ul>

            <hr className="my-4 md:min-w-full" />
            <h6 className="md:min-w-full text-blueGray-900 text-lg uppercase font-bold block pt-1 pb-4 no-underline">
              Auth Layout Pages
            </h6>

            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center cursor-pointer">
                <Link
                  className="text-blueGray-700 hover:text-blueGray-900 text-xs uppercase py-3 font-bold block"
                  to="/auth/login"
                >
                  <i className="fas fa-fingerprint text-blueGray-400 mr-2 text-sm"></i>{" "}
                  Login
                </Link>
              </li>

              <li className="items-center cursor-pointer ">
                <div className="text-blueGray-700 hover:text-blueGray-900 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-fingerprint text-blueGray-400 mr-2 text-sm"></i>{" "}
                  Login
                </div>
              </li>

              <li className="items-center cursor-pointer">
                <Link
                  className="text-blueGray-700 hover:text-blueGray-900 text-xs uppercase py-3 font-bold block"
                  to="/auth/register"
                >
                  <i className="fas fa-clipboard-list text-blueGray-300 mr-2 text-sm"></i>{" "}
                  Register
                </Link>
              </li>
            </ul>

            <hr className="my-4 md:min-w-full" />
            <h6 className="md:min-w-full text-blueGray-900 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              No Layout Pages
            </h6>

            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center cursor-pointer">
                <Link
                  className="text-blueGray-700 hover:text-blueGray-900 text-xs uppercase py-3 font-bold block"
                  to="/landing"
                >
                  <i className="fas fa-newspaper text-blueGray-400 mr-2 text-sm"></i>{" "}
                  Landing Page
                </Link>
              </li>

              <li className="items-center cursor-pointer">
                <Link
                  className="text-blueGray-700 hover:text-blueGray-900 text-xs uppercase py-3 font-bold block"
                  to="/profile"
                >
                  <i className="fas fa-user-circle text-blueGray-400 mr-2 text-sm"></i>{" "}
                  Profile Page
                </Link>
              </li>
            </ul>

            <hr className="my-4 md:min-w-full" />
            <h6 className="md:min-w-full text-blueGray-900 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Documentation
            </h6>
            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="inline-flex cursor-pointer">
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind/react/colors/notus"
                  target="_blank"
                  className="text-blueGray-700 hover:text-blueGray-900 text-sm block mb-4 no-underline font-semibold"
                >
                  <i className="fas fa-paint-brush mr-2 text-blueGray-300 text-base"></i>
                  Styles
                </a>
              </li>

              <li className="inline-flex cursor-pointer">
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind/react/alerts/notus"
                  target="_blank"
                  className="text-blueGray-700 hover:text-blueGray-900 text-sm block mb-4 no-underline font-semibold"
                >
                  <i className="fab fa-css3-alt mr-2 text-blueGray-300 text-base"></i>
                  CSS Components
                </a>
              </li>

              <li className="inline-flex cursor-pointer">
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind/angular/overview/notus"
                  target="_blank"
                  className="text-blueGray-700 hover:text-blueGray-900 text-sm block mb-4 no-underline font-semibold"
                >
                  <i className="fab fa-angular mr-2 text-blueGray-300 text-base"></i>
                  Angular
                </a>
              </li>

              <li className="inline-flex cursor-pointer">
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind/js/overview/notus"
                  target="_blank"
                  className="text-blueGray-700 hover:text-blueGray-900 text-sm block mb-4 no-underline font-semibold"
                >
                  <i className="fab fa-js-square mr-2 text-blueGray-300 text-base"></i>
                  Javascript
                </a>
              </li>

              <li className="inline-flex cursor-pointer">
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind/nextjs/overview/notus"
                  target="_blank"
                  className="text-blueGray-700 hover:text-blueGray-900 text-sm block mb-4 no-underline font-semibold"
                >
                  <i className="fab fa-react mr-2 text-blueGray-300 text-base"></i>
                  NextJS
                </a>
              </li>

              <li className="inline-flex cursor-pointer">
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind/react/overview/notus"
                  target="_blank"
                  className="text-blueGray-700 hover:text-blueGray-900 text-sm block mb-4 no-underline font-semibold"
                >
                  <i className="fab fa-react mr-2 text-blueGray-300 text-base"></i>
                  React
                </a>
              </li>

              <li className="inline-flex cursor-pointer">
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind/svelte/overview/notus"
                  target="_blank"
                  className="text-blueGray-700 hover:text-blueGray-900 text-sm block mb-4 no-underline font-semibold"
                >
                  <i className="fas fa-link mr-2 text-blueGray-300 text-base"></i>
                  Svelte
                </a>
              </li>

              <li className="inline-flex cursor-pointer">
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind/vue/overview/notus"
                  target="_blank"
                  className="text-blueGray-700 hover:text-blueGray-900 text-sm block mb-4 no-underline font-semibold"
                >
                  <i className="fab fa-vuejs mr-2 text-blueGray-300 text-base"></i>
                  VueJS
                </a>
              </li>
    </ul>
    </>
  )
}

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = useState("hidden");
  const navigate = useNavigate();

  const handleLogOut = () => {
    axios.get("http://localhost:1111/admin/logout").then(function (response) {
      navigate("/");
    });
  };

  return (
    <>
      <nav className="dir-rtl right-0 text-right md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link
            className="md:block md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0 "
            to="/"
          >
            <img className="w-8/12  h-12 mx-auto" src="/icon4.png" />
          </Link>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            {/* Form */}
            <form className="mt-6 mb-4 md:hidden">
              <div className="mb-3 pt-0">
                <input
                  type="text"
                  placeholder="Search"
                  className="border-0 px-3 py-2 h-12 border border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                />
              </div>
            </form>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />

            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
            <h6 className="md:min-w-full text-blueGray-900 text-lg uppercase font-bold block pt-1 pb-4 no-underline">
               ניהול חנויות ומוצרים
              </h6>
            <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/stores") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/stores"
                >
                  <i
                    className={
                      "fas fa-store mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/stores") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>ניהול חנויות</div>
                </Link>
              </li>
              <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/general-categories") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/general-categories"
                >
                  <i
                    className={
                      "fas fa-list mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/general-categories") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>קטגוריות כלליות</div>
                </Link>
              </li>
              <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/categories") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/categories"
                >
                  <i
                    className={
                      "fas fa-list mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/categories") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>תת קטגוריות</div>
                </Link>
              </li>

              <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md  uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/ads") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/ads"
                >
                  <i
                    className={
                      "fas fa-bullhorn mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/ads") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>ניהול מודעות</div>
                </Link>
              </li>

              <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md  uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/orders") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/orders"
                >
                  <i
                    className={
                      "fas fa-shopping-cart mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/orders") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>רשימת הזמנות</div>
                </Link>
              </li>

              {/* <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md  uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/products") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/products"
                >
                  <i
                    className={
                      "fas fa-birthday-cake mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/products") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>רשימת מוצרים</div>
                </Link>
              </li> */}


              {/* <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md  uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/product/add") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/product/add"
                >
                  <i
                    className={
                      "fas fa-plus mr-2 mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/product/add") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>הוספת מוצר</div>
                </Link>
              </li> */}



              {/* <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md  uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/errors") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/errors"
                >
                  <i
                    className={
                      "fas fa-exclamation-circle mr-2 mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/errors") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>רשימת שגיאות</div>
                </Link>
              </li> */}

              <hr className="my-4 md:min-w-full" />
              <h6 className="md:min-w-full text-blueGray-900 text-lg uppercase font-bold block pt-1 pb-4 no-underline">
                משלוחים
              </h6>

              {/* <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/analytics/orders") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/analytics/orders"
                >
                  <i
                    className={
                      "fas fa-chart-bar mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/analytics/orders") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>הזמנות</div>
                </Link>
              </li> */}

    

              <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/delivery-areas") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/delivery-areas"
                >
                  <i
                    className={
                      "fas fa-map mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/delivery-areas") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>אזורי משלוח</div>
                </Link>
              </li>

              <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/delivery-company-areas") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/delivery-company-areas"
                >
                  <i
                    className={
                      "fas fa-truck mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/delivery-company-areas") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>אזורים נתמכים(לפי חברה)</div>
                </Link>
              </li>

              <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/cities") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/cities"
                >
                  <i
                    className={
                      "fas fa-city mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/cities") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>ערים נתמכות</div>
                </Link>
              </li>

              <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md  uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/delivery-companies") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/delivery-companies"
                >
                  <i
                    className={
                      "fas fa-truck mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/delivery-companies") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>חברות משלוחים</div>
                </Link>
              </li>

              <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/analytics/deliveries-list") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/analytics/deliveries-list"
                >
                  <i
                    className={
                      "fas fa-list-alt mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/analytics/deliveries-list") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>רשימת משלוחים</div>
                </Link>
              </li>

              <hr className="my-4 md:min-w-full" />
              <h6 className="md:min-w-full text-blueGray-900 text-lg uppercase font-bold block pt-1 pb-4 no-underline">
                ניהול לקוחות
              </h6>
              <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/analytics/customers") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/analytics/customers"
                >
                  <i
                    className={
                      "fas fa-users mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/analytics/customers") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>לקוחות</div>
                </Link>
              </li>

              {/* <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/store-categories") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/store-categories"
                >
                  <i
                    className={
                      "fas fa-tags mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/store-categories") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>Store Categories</div>
                </Link>
              </li> */}

              <hr className="my-4 md:min-w-full" />
              <h6 className="md:min-w-full text-blueGray-900 text-lg uppercase font-bold block pt-1 pb-4 no-underline">
                ניהול קופונים
              </h6>
              <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/coupons") !== -1 && !window.location.href.includes("/analytics")
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/coupons"
                >
                  <i
                    className={
                      "fas fa-ticket-alt mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/coupons") !== -1 && !window.location.href.includes("/analytics")
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>ניהול קופונים</div>
                </Link>
              </li>
              <li className="items-center cursor-pointer">
                <Link
                  className={
                    "flex items-center text-md uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/coupons/analytics") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/coupons/analytics"
                >
                  <i
                    className={
                      "fas fa-chart-line mx-2 text-lg " +
                      (window.location.href.indexOf("/admin/coupons/analytics") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  <div>ניתוח קופונים</div>
                </Link>
              </li>



              <li className="items-center cursor-pointer">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/delivery-monitor") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-900")
                  }
                  to="/admin/delivery-monitor"
                >
                  <i
                    className={
                      "fas fa-truck mr-2 text-sm " +
                      (window.location.href.indexOf("/admin/delivery-monitor") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  Delivery Monitor
                </Link>
              </li>
            </ul>
            {/* {sideBarList()} */}
          </div>
        </div>
      </nav>
    </>
  );
}
