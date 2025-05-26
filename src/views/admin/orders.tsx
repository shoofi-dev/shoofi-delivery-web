import getOrdersListApi from "apis/admin/order/get-orders-list";
import { useEffect, useState } from "react";

import OrderCard from "components/Cards/CardOrder";
import Loader from "components/Loader/loader";
import clsx from "clsx";
import getMenu from "apis/admin/menu/get-menu";

const OrderdsPage = () => {
  const [ordersList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleGetOrdersList = async (currentPage: number) => {
    setIsLoading(true);
    await getMenu();
    getOrdersListApi(currentPage).then((res:any) => {
      console.log("res", res.ordersList)
        setOrderList(res.ordersList);
        setTotalItems(res.totalItems)
        setIsLoading(false);
      });

  };

  useEffect(() => {
    handleGetOrdersList(currentPage);
  }, [currentPage]);

  const nextPage = () =>{
    setCurrentPage(currentPage + 1)
  }
  const prevPage = () =>{
    setCurrentPage(currentPage - 1)
  }
  
  useEffect(() => {
    handleGetOrdersList(currentPage);
  },[]);
  
  if(isLoading){
    return(
     <Loader/>
    )
  }

  
  return (
    <div>
      {ordersList?.map((order) => (
        <OrderCard order={order} />
      ))}
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
    </div>
  );
};

export default OrderdsPage;
