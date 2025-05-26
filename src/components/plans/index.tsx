import React from "react";
import BronzePlan from "./bronze-plan";
import GoldPlan from "./gold-plan";
import PremiumPlan from "./premium-plan";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./style.css"; // Create and import a CSS file for animations

const Plans = () => {
  const [openTab, setOpenTab] = React.useState(1);

  return (
    <>
      <div className="flex flex-wrap lg:px-20 lg:pt-20">
        <div className="w-full text-center lg:mb-14">
          <h2 className="text-lg lg:text-4xl font-semibold text-white pt-5 lg:pt-0">رُزم تعليم سباحة</h2>
        </div>
        <div className="w-full">
          <ul
            className="flex mb-10 list-none flex-wrap pt-3 pb-4 flex-row"
            role="tablist"
          >
            <li className="-mb-px flex-auto text-center">
              <a
                className={
                  "text-xs font-bold px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 1
                    ? "text-white bg-blueGray-700 sm:shadow-pink"
                    : "text-lightBlue-600 bg-blueGray-900")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                href="#link1"
                role="tablist"
              >
                <div className="text-white p-5 lg:p-10 text-center inline-flex items-center justify-center mb-5 shadow-lg rounded-full bg-white">
                  <i className="fas fa-award text-gray-500 text-[50px] lg:text-[120px]"></i>
                </div>
                <div className="text-lg lg:text-2xl text-white">الفضية</div>
              </a>
            </li>
            <li className="-mb-px mx-2 lg:mx-20 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 2
                    ? "text-white bg-blueGray-700 sm:shadow-pink"
                    : "text-lightBlue-600 bg-blueGray-900")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                href="#link2"
                role="tablist"
              >
                <div className="text-white p-5 lg:p-10 text-center inline-flex items-center justify-center mb-5 shadow-lg rounded-full bg-white">
                  <i className="fas fa-award text-yellow-600 text-[50px] lg:text-[120px]"></i>
                </div>
                <div className="text-lg lg:text-2xl text-white">الذهبية</div>
              </a>
            </li>
            <li className="-mb-px flex-auto text-center">
              <a
                className={
                  "text-xs font-bold px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 3
                    ? "text-white bg-blueGray-700 sm:shadow-pink"
                    : "text-lightBlue-600 bg-blueGray-900")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(3);
                }}
                href="#link3"
                role="tablist"
              >
                <div className="text-white p-5 lg:p-10 text-center inline-flex items-center justify-center mb-5 shadow-lg rounded-full bg-white">
                  <i className="fas fa-award text-pink text-[50px] lg:text-[120px]"></i>
                </div>
                <div className="text-lg lg:text-2xl text-white">Premium</div>
              </a>
            </li>
          </ul>
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-900">
            <div className="px-4 py-5 flex-auto">
              <TransitionGroup>
                <CSSTransition
                  key={openTab}
                  timeout={300}
                  classNames="fade"
                >
                  <div className="tab-content tab-space">
                    {openTab === 1 && <BronzePlan />}
                    {openTab === 2 && <GoldPlan />}
                    {openTab === 3 && <PremiumPlan />}
                  </div>
                </CSSTransition>
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Plans;
