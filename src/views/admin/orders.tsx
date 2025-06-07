import getOrdersListApi from "apis/admin/order/get-orders-list";
import { useEffect, useState } from "react";
import { axiosInstance } from "utils/http-interceptor";
import OrderCard from "components/Cards/CardOrder";
import Loader from "components/Loader/loader";
import clsx from "clsx";
import getMenu from "apis/admin/menu/get-menu";
import { format } from "date-fns";

const today = format(new Date(), "yyyy-MM-dd");

const OrderdsPage = () => {
  const [ordersList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [cities, setCities] = useState<Array<{id: string, name: string}>>([]);

  const statusOptions = [
    { value: "1", label: "ממתין" },
    { value: "2", label: "במשלוח" },
    { value: "3", label: "הושלם" },
    { value: "4", label: "בוטל" }
  ];

  const fetchCities = async () => {
    const res: any = await axiosInstance.get("/delivery/cities");
    setCities(res.map((city: any) => ({ id: city._id, name: city.nameAR })));
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleStatusChange = (statusValue: string) => {
    setSelectedStatuses(prev => 
      prev.includes(statusValue)
        ? prev.filter(s => s !== statusValue)
        : [...prev, statusValue]
    );
  };

  const handleCityChange = (cityId: string) => {
    setSelectedCityIds(prev => 
      prev.includes(cityId)
        ? prev.filter(id => id !== cityId)
        : [...prev, cityId]
    );
  };

  const handleGetOrdersList = async (currentPage: number) => {
    setIsLoading(true);
    await getMenu();
    getOrdersListApi(currentPage, {
      startDate,
      endDate,
      status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      cityIds: selectedCityIds.length > 0 ? selectedCityIds : undefined
    }).then((res:any) => {
      setOrderList(res.ordersList);
      setTotalItems(res.totalItems);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    handleGetOrdersList(currentPage);
  }, [currentPage, startDate, endDate, selectedStatuses, selectedCityIds]);

  const nextPage = () => {
    setCurrentPage(currentPage + 1)
  }
  const prevPage = () => {
    setCurrentPage(currentPage - 1)
  }
  
  if(isLoading){
    return <Loader/>
  }

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded p-6">
      <div className="flex flex-wrap gap-4 mb-6 items-end ">
        <div>
          <label className="block mb-1">עיר</label>
          <div className="border rounded px-3 py-2 bg-white">
            {cities.map(city => (
              <div key={city.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`city-${city.id}`}
                  checked={selectedCityIds.includes(city.id)}
                  onChange={() => handleCityChange(city.id)}
                  className="rounded"
                />
                <label htmlFor={`city-${city.id}`}>{city.name}</label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-1">סטטוס</label>
          <div className="border rounded px-3 py-2 bg-white">
            {statusOptions.map(option => (
              <div key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`status-${option.value}`}
                  checked={selectedStatuses.includes(option.value)}
                  onChange={() => handleStatusChange(option.value)}
                  className="rounded"
                />
                <label htmlFor={`status-${option.value}`}>{option.label}</label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-1">תאריך התחלה</label>
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">תאריך סיום</label>
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
      </div>

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
