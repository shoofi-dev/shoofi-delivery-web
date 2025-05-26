import getEmployesListApi from "apis/delivery/get-employe-list";
import getPaymentsListAPI from "apis/delivery/get-payments-list";
import Navbar from "components/Navbars/IndexNavbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "utils/http-interceptor";

const EmployePayments = () => {
  const [paymentsList, setPaymentsList] = useState<any>([]);

  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [employeList, setEmployeList] = useState<any>();
  const [employeListMapped, setEmployeListMapped] = useState<any>();

  const mapEmployeListToList = () => {
    const mapped = employeList?.map((item: any) => ({
      label: item.fullName,
      value: item._id,
    }));
    console.log("mapped", mapped);
    setEmployeListMapped(mapped);
  };
  useEffect(() => {
    if (employeList) {
      mapEmployeListToList();
    }
  }, [employeList]);

  const getEmployesList = async (companyId: string) => {
    const list: any = await getEmployesListApi(companyId);
    setEmployeList(list); 
  };

  useEffect(() => {
    const customerData = localStorage.getItem("customerData");
    if (customerData) {
      const parsedCustomerData = JSON.parse(customerData);
      getEmployesList(parsedCustomerData.companyId);
    }
  }, []);

  // Function to handle assignee selection
  const handleSelectAssignee = (assigneeId: any) => {
    console.log("assigneeId", assigneeId);
    const assigneeData = paymentsList.find(
      (assignee: any) => assignee._id === assigneeId
    );
    setSelectedAssignee(assigneeId);
    setFilteredData(assigneeData ? assigneeData.dailyOrders : []);
  };

  const getPaymentsList = async (isAllCheckedValue?: boolean) => {
    const list: any = await getPaymentsListAPI();
    setPaymentsList(list);
  };

  useEffect(() => {
    getPaymentsList();
  }, []);

  return (
    <div className=" pt-12  md:pt-20 p-4 bg-blueGray-800 h-full  bg-white rtl">
      <Navbar />
      <div className="max-w-md mx-auto">
        <div className="text-2xl font-bold mb-0 text-center text-white pt-5">
          عدد الطلبات لكل مرسل
        </div>
        <div className="mb-6">
          <div className="relative mb-6 mt-5">
        
            <select
              onChange={(e) => handleSelectAssignee(e.target.value)}
              defaultValue=""
              className="w-full bg-none p-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              <option value="" disabled>
                اختر المرسل
              </option>
              {employeListMapped?.map((assignee: any) => (
                <option key={assignee._id} value={assignee.value}>
                  {assignee.label}
                </option>
              ))}
            </select>
            <span className="absolute left-3 top-2 transform -translate-y-1/2 text-gray-500 text-2xl">
              &#9662; {/* Unicode for left arrow */}
            </span>
          </div>
        </div>

        {/* جدول للمرسل المحدد */}
        <div>
          {selectedAssignee && (
            <div className="bg-white shadow-lg rounded-lg p-3">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-right text-lg font-medium text-gray-600">
                      التاريخ
                    </th>
                    <th className="py-3 px-4 text-right text-lg font-medium text-gray-600">
                      عدد الطلبات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="py-3 px-4 text-center text-sm text-gray-500"
                      >
                        لا توجد طلبات متاحة
                      </td>
                    </tr>
                  ) : (
                    filteredData?.map((order: any, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {order.date}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {order.orderCount}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployePayments;
