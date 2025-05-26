import getClientErrosListApi from "apis/admin/errors/get-client-erros-list";
import CardTable from "components/Cards/CardTable";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import moment from "moment";
import Loader from "components/Loader/loader";

export const ErrorsList = ({
  color = "light",
  title,
}: {
  color?: string;
  title: string;
}) => {
  const [errorsList, setErrorsList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const initErrorsList = async (currentPage:number) => {
    setIsLoading(true);
    const errors = await getClientErrosListApi({ pageNumber: currentPage });
    setErrorsList(errors.data);
    setTotalItems(errors.totalItems)
    setIsLoading(false);

  };

  useEffect(() => {
    initErrorsList(currentPage);
  }, [currentPage]);

  const nextPage = () =>{
    setCurrentPage(currentPage + 1)
  }
  const prevPage = () =>{
    setCurrentPage(currentPage - 1)
  }

  console.log("errorsList", errorsList);
  if(isLoading){
    return(
     <Loader/>
    )
  }
  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                {title}
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-900"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Name
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-900"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Message
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-900"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Stack Trace
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-900"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Created Date
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-900"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Customer Id
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                ></th>
              </tr>
            </thead>
            <tbody>
              {errorsList?.map((error: any) => {
                return (
                  <tr>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {error?.error?.name}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {error?.error?.message}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="w-20 truncate	">{error?.stackTrace}</div>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {moment(error?.createdDate).format('DD/MM/YY')}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {error?.customerId}
                    </td>
                  </tr>
                );
              })}

              {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  $2,500 USD
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <i className="fas fa-circle text-orange-500 mr-2"></i> pending
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <div className="flex">
                    <img
                      src={require("assets/img/team-1-800x800.jpg").default}
                      alt="..."
                      className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow"
                    ></img>
                    <img
                      src={require("assets/img/team-2-800x800.jpg").default}
                      alt="..."
                      className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                    ></img>
                    <img
                      src={require("assets/img/team-3-800x800.jpg").default}
                      alt="..."
                      className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                    ></img>
                    <img
                      src={require("assets/img/team-4-470x470.png").default}
                      alt="..."
                      className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                    ></img>
                  </div>
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <div className="flex items-center">
                    <span className="mr-2">60%</span>
                    <div className="relative w-full">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                        <div
                          style={{ width: "60%" }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                </td> */}
            </tbody>
          </table>

        
        </div>
        
      </div>
      <div className="flex flex-col items-center">
            <span className="text-sm ">
              Showing{" "}
              <span className="font-semibold">
                {(currentPage - 1) * 10 ? (currentPage - 1) * 10 : 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold">
              {(currentPage - 1) * 10 ? (currentPage - 1) * 10 + 20 : 1 + 19}

              </span>{" "}
              of{" "}
              <span className="font-semibold">
                {totalItems}
              </span>{" "}
              Entries
            </span>
            <div className="flex gap-5 mt-2 xs:mt-0">
              <button onClick={nextPage} className={clsx('flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white rounded-lg')}>
                Next
              </button>
              <button onClick={prevPage} className={clsx('flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white rounded-lg', currentPage === 1 && 'pointer-events-none	opacity-50')}>
                Prev
              </button>
            </div>
          </div>
    </>
  );
};

export default ErrorsList;

CardTable.defaultProps = {
  color: "light",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
