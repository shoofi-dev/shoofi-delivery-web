import React from "react";
import { Link } from "react-router-dom";
import { createPopper } from "@popperjs/core";
import clsx from "clsx";

const SwimmingTypesDropdown = () => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef<any>();
  const popoverDropdownRef = React.createRef<any>();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <a
        className="lg:text-white lg:hover:text-blueGray-200 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center lg:text-lg uppercase font-bold w-full"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
        
      >
        انواع السباحة
        <i className={clsx("mr-2 lg:text-blueGray-200 text-blueGray-400 fa-solid  lg:text-lg leading-lg", dropdownPopoverShow ? 'fa-chevron-up' : 'fa-chevron-down')} />

      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-lg z-50 float-left py-2 list-none text-right rounded shadow-lg min-w-48 mr-30 w-[87%] md:w-auto"
        }
      >
        <Link
          to="/swimming-types/free-style"
          className={
            "lg:text-md mt-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700  hover:bg-blueGray-700 hover:text-white"
          }
        >
          السباحة الحرة
        </Link>
        <hr className="my-2  md:min-w-full" />

        <Link
          to="/swimming-types/marathon"
          className={
            "lg:text-md px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-blueGray-700 hover:text-white"
          }
        >
          السباحة الماراثونية
        </Link>
        <hr className="my-2  md:min-w-full" />

        <Link
          to="/swimming-types/sea"
          className={
            "lg:text-md  px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700  hover:bg-blueGray-700 hover:text-white"
          }
        >
          السباحة في البحر
        </Link>
      </div>
    </>
  );
};

export default SwimmingTypesDropdown;
