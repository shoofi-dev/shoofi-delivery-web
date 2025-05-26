import React from "react";

export default function Footer() {
  const openInNewTab = (link) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };
  return (
    <>
      <footer className="relative bg-blueGray-200 pt-8 pb-6">
        <div
          className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
          style={{ transform: "translateZ(0)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="text-blueGray-200 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
        <div className="container mx-auto px-4 items-center">
          <div className=" text-center mx-auto">
            <div className="w-full lg:w-6/12 mx-auto">
              <h4 className="text-3xl font-semibold ">لنبقى على تواصل!!</h4>
              <h5 className="text-lg mt-0 mb-2 text-blueGray-600">
                تجدنا على أي من هذه المنصات التواصل الاجتماعي.
              </h5>
              <div className="mt-6 lg:mb-0 mb-6">
                <button
                  onClick={() => {
                    openInNewTab("https://www.instagram.com/rehammansour589/");
                  }}
                  className="bg-white text-lightBlue-400 shadow-lg font-normal h-16 w-16 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                  type="button"
                >
                  <i className="fab fa-instagram fill-gradient-instagram fa-2x"></i>
                </button>
                <button
                  onClick={() => {
                    openInNewTab("https://www.facebook.com/reham.mansour.589");
                  }}
                  className="bg-white text-lightBlue-600 shadow-lg font-normal h-16 w-16 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                  type="button"
                >
                  <i className="fab fa-facebook-square fa-2x"></i>
                </button>
              </div>
            </div>
          </div>
          <hr className="my-6 border-blueGray-300" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4 mx-auto text-center">
              <div className="text-sm text-blueGray-500 font-semibold py-1">
                Copyright © {new Date().getFullYear()} World Of Swimming by{" "}
                <a
                  href="https://www.creative-tim.com?ref=nr-footer"
                  className="text-blueGray-500 hover:text-blueGray-800"
                >
                  Sari Qashuw
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
