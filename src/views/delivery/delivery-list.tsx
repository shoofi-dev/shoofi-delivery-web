// src/Cart.js
import { getToken } from "@firebase/messaging";
import getDeliveryListApi from "apis/delivery/get-delivery-list";
import getEmployesListApi from "apis/delivery/get-employe-list";
import updateDeliveryAPI from "apis/delivery/update-delivery";
import updateNotificationToken from "apis/delivery/update-notification-token";
import clsx from "clsx";
import Navbar from "components/Navbars/IndexNavbar";
import messaging, { requestNotificationPermission } from "firebase-config";
import moment from "moment";
import { useEffect, useState } from "react";

const statusList = [
  { label: "جديدة", value: "1" },
  { label: "بانتظار المرسل", value: "2" },
  { label: "بطريق", value: "3" },
  { label: "تم التوصيل", value: "4" },
  { label: "الغيت", value: "0" },
];

const DeliveryListView = () => {
  const [deliveryList, setDeliveryList] = useState<any>([]);
  const [isAllChecked, setIsAllChecked] = useState<any>(false);
  const [selectedAssignee, setSelectedAssignee] = useState<any>({});
  const [selectedEditOrders, setSelectedEditOrders] = useState<any>({});
  const [isSubscribedToPush, setIsSubscribedToPush] = useState(false);
  const [customerData, setCustomerData] = useState<any>();
  const [employeList, setEmployeList] = useState<any>();
  const [employeListMapped, setEmployeListMapped] = useState<any>();
  const [isAllWeek, setIsAllWeek] = useState<any>(false);

  const updateDelivery = async (updateData: any) => {
    await updateDeliveryAPI(updateData);
  };

  const mapEmployeListToList = () => {
    const mapped = employeList?.map((item: any) => ({
      label: item.fullName,
      value: item._id,
    }));
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

  const checkIsSubscribedToPush = async (customerData: any) => {
    const token = await getToken(messaging, {
      vapidKey:
        "BPtN4f-Ilagn3-nIjsN6D52smAFuTF5j3cJJgLyOfSzLr-HWyv0epvdZutTelPCNVW9rx4v53240PiXg_8P58wo",
    });
    if (token) {
      updateNotificationToken(customerData._id, token);
      setIsSubscribedToPush(true);
    } else {
      setIsSubscribedToPush(false);
    }
  };

  useEffect(() => {
    const customerData = localStorage.getItem("customerData");
    if (customerData) {
      const parsedCustomerData = JSON.parse(customerData);
      setCustomerData(parsedCustomerData);
      if (parsedCustomerData.role !== "store") {
        checkIsSubscribedToPush(parsedCustomerData);
      }
        getEmployesList(parsedCustomerData.companyId);
    }
  }, []);

  const requestPermission = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }

    Notification.requestPermission().then(async (permission) => {
      if (permission === "granted") {
        const token = await requestNotificationPermission();
        if (token) {
          updateNotificationToken(customerData._id, token);
          setIsSubscribedToPush(true);
        }
      } else {
        alert("Notification permission denied.");
      }
    });
  };

  const getDeliveryList = async (
    isAllCheckedValue?: boolean,
    isAllWeekValue?: boolean
  ) => {
    const list: any = await getDeliveryListApi(
      isAllCheckedValue ?? isAllChecked,
      customerData,
      isAllWeekValue ?? isAllWeek
    );
    const updatedAssignee: any = {};
    list.forEach((item: any) => {
      if (item.assignee) {
        updatedAssignee[item._id] = item.assignee;
      }
    });

    setSelectedAssignee(updatedAssignee);
    setDeliveryList(list);
  };

  useEffect(() => {
    if (!customerData) {
      return;
    }
    getDeliveryList(isAllChecked);

    const interval = setInterval(() => {
      getDeliveryList(isAllChecked);
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, [customerData, isAllChecked, isAllWeek]);

  const getColorAndTextByStatus = (order: any) => {
    switch (order.status) {
      case "-1":
        return {
          color: "red-500",
          status: "الغيت من المطعم",
          textColor: 'black'
        };
      case "0":
        return {
          // text: "الغيت",
          color: "red-500",
          status: "الغيت",
        };
      case "1":
        return {
          text: "عين مرسل",
          color: "blue",
          status: "جديدة",
        };
      case "2":
        return {
          text: "اقبل",
          color: "orange-500",
          status: "بانتظار المرسل",
        };
      case "3":
        return {
          text: "تم التوصيل",
          color: "pink",
          status: "بطريق",
        };
      case "4":
        return {
          color: "green-500",
          status: "تم التوصيل",
        };
    }
  };

  const updateStatus = async (item: any) => {
    let updateData = { ...item, assignee: selectedAssignee[item._id] || "" };
    switch (item.status) {
      case "1":
        updateData.status = "2";
        break;
      case "2":
        updateData.status = "3";
        break;
      case "3":
        updateData.status = "4";
        break;
    }

    await updateDelivery(updateData);
    getDeliveryList(isAllChecked);
  };

  const handleIsAllFilter = (e: any) => {
    setIsAllChecked(e.target.checked);
    getDeliveryList(e.target.checked, isAllWeek);
  };
  const handleIsAllWeek = (e: any) => {
    setIsAllWeek(e.target.checked);
    getDeliveryList(isAllChecked, e.target.checked);
  };
  const cancelOrder = async (item: any) => {
    const confirmation = window.confirm(
      "هل أنت متأكد أنك تريد إلغاء هذا الطلب؟"
    );

    if (!confirmation) {
      // If the user cancels the confirmation, do nothing
      return;
    }
    let updateData = { ...item, assignee: selectedAssignee[item._id] || "" };
    updateData.status = customerData?.role === "store" ? "-1" : "0";
    await updateDelivery(updateData);
    getDeliveryList(isAllChecked, isAllWeek);
  };

  const handleDropdownChange = async (e: any, item: any) => {
    setSelectedAssignee({ ...selectedAssignee, [item._id]: e.target.value });
    let updateData = { ...item, assignee: e.target.value };

    await updateDelivery(updateData);
    getDeliveryList(isAllChecked, isAllWeek);
  };
  const handleStatusChange = async (e: any, item: any) => {
    let updateData = { ...item, status: e.target.value };
    await updateDelivery(updateData);
    setSelectedEditOrders({
      ...selectedEditOrders,
      [item._id]: !selectedEditOrders[item._id],
    });
    getDeliveryList(isAllChecked, isAllWeek);
  };

  const editStatus = (item: any) => {
    setSelectedEditOrders({
      ...selectedEditOrders,
      [item._id]: !selectedEditOrders[item._id],
    });
  };

  const getEmployeData = (id: string) => {
    const found = employeList?.find((employe: any) => employe._id === id);
    return found;
  };

  if (!isSubscribedToPush && customerData?.role !== "store") {
    return (
      <>
        <Navbar />

        <div className="flex justify-center mt-20">
          <button
            className="w-full bg-blue text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300 max-w-[70%]"
            onClick={requestPermission}
          >
            تشغيل الإشعارات
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-full  mt-14 md:mt-20 items-center justify-center pb-10 text-lg bg-blueGray-900 h-[100%] text-center ">
        <div className="flex items-center py-4  mx-auto justify-center border border-l-0 border-r-0 ">
          <div className="flex items-center justify-center ">
            <label className="inline-flex items-center cursor-pointer">
              <input
                id="customCheckLogin"
                type="checkbox"
                className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150 bg-gray-800 border bg-white"
                onChange={handleIsAllFilter}
                value={isAllChecked}
              />
              <span className="mr-2 text-xl  text-white">كل الطلبيات</span>
            </label>
          </div>
          <div className="flex items-center justify-center mr-5 ">
            <label className="inline-flex items-center cursor-pointer">
              <input
                id="customCheckLogin"
                type="checkbox"
                className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150 bg-gray-800 border bg-white"
                onChange={handleIsAllWeek}
                value={isAllWeek}
              />
              <span className="mr-2 text-xl  text-white">كل الاسبوع</span>
            </label>
          </div>
        </div>

        {!deliveryList || deliveryList?.length === 0 ? (
          <div className="m-auto text-2xl text-white mt-20">
            لا يوجد ارساليات
          </div>
        ) : (
          <div className="pt-2 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-blueGray-900">
              {deliveryList?.map((item: any, index: number) => {
                const colorTextByStatus = getColorAndTextByStatus(item);
                const employeData = getEmployeData(item?.assignee);
                return (
                  <div
                    key={index}
                    className={`relative shadow-md rounded-lg p-4 bg-${colorTextByStatus?.color} text-white flex flex-col gap-2`}
                  >
                    {/* Store Name */}
                    <div className="flex justify-center items-center text-xl font-bold w-full">
                      <div className="absolute left-5 top-5 text-xs">
                        <div>وقت الارسال</div>
                        {moment(item.created).format("HH:mm")}
                      </div>
                      <div className="ml-1.5">المرحلة -</div>
                      <div className="">
                        {selectedEditOrders[item._id] ? (
                          <div className="  w-40">
                            <div className="  w-full">
                              <div className="relative">
                                <select
                                  className="p-2 rounded bg-gray-800 bg-none text-white w-full"
                                  onChange={(e) => handleStatusChange(e, item)}
                                  value={item.status || ""}
                                >
                                  <option value="">اختر المرحلة</option>

                                  {statusList?.map((item: any) => (
                                    <option value={item.value}>
                                      {item.label}
                                    </option>
                                  ))}
                                </select>
                                <span className="absolute left-3 top-2 transform -translate-y-1/2 text-white">
                                  &#9662; {/* Unicode for left arrow */}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className={clsx(colorTextByStatus?.textColor && `text-${colorTextByStatus.textColor}`)}>{colorTextByStatus?.status}</span>
                        )}
                      </div>
                      <div>
                        {customerData.role === "admin" && (
                          <div>
                            {!selectedEditOrders[item._id] && (
                              <i
                                onClick={() => editStatus(item)}
                                className={clsx("fa fa-pencil text-sm mr-1")}
                              ></i>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {customerData.role !== "store" && (
                      <div className="flex justify-center items-center text-lg font-bold">
                        اسم المطعم: {item.storeName || "اسم المحل غير معروف"}
                      </div>
                    )}

                    {/* Full Name and Phone */}
                    <div className="flex justify-between">
                      <span className="font-medium">الاسم:</span>
                      <span>{item.fullName}</span>
                    </div>
                    <div className="border-t border-white"></div>

                    <div className="flex justify-between">
                      <span className="font-medium">رقم الهاتف:</span>
                      <span>{item.phone || 'غير متوفر'}</span>
                    </div>
                    <div className="border-t border-white"></div>

                    {/* Price and Time */}
                    <div className="flex justify-between">
                      <span className="font-medium">السعر:</span>
                      <span>{item.price || 'غير متوفر'}</span>
                    </div>
                    <div className="border-t border-white"></div>

                    <div className="flex justify-between">
                      <span className="font-medium">الوقت:</span>
                      <div>
                        <span className="text-sm">
                          {moment(item.created).format("DD/MM")}
                        </span>

                        {" - "}
                        <span className="font-bold">
                          {item.deliveryDeltaMinutes}
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-white"></div>

                    <div className="flex justify-between">
                      <span className="font-medium">المرسل:</span>
                      <div>
                        <span className="text-sm">
                          {employeData?.fullName || "لم يعين بعد"}
                        </span>

                        {employeData?.phone && (
                          <>
                            {" - "}
                            <span className="font-bold">
                              {employeData?.phone}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="border-t border-white"></div>

                    {/* Dropdown */}
                    {customerData.role === "admin" && (
                      <div className="mx-auto  w-[60%] mt-2">
                        <div className="relative">
                          <select
                            className="p-2 rounded bg-gray-800 bg-none text-white w-full"
                            onChange={(e) => handleDropdownChange(e, item)}
                            value={selectedAssignee[item._id] || ""}
                          >
                            <option value="">اختر المرسل</option>

                            {employeListMapped?.map((item: any) => (
                              <option value={item.value}>{item.label}</option>
                            ))}
                          </select>
                          <span className="absolute left-3 top-2 transform -translate-y-1/2 text-white">
                            &#9662; {/* Unicode for left arrow */}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {
                      colorTextByStatus?.text && (
                        <div className="flex justify-center gap-4 mt-2">
                    {customerData.role !== "store" && <button
                            onClick={() => updateStatus(item)}
                            className={`px-4 py-2 text-white rounded bg-gray-800  w-[40%] ${
                              !selectedAssignee[item._id] &&
                              " bg-gray-800 opacity-50"
                            }`}
                            disabled={!selectedAssignee[item._id]}
                          >
                            {colorTextByStatus?.text}
                          </button>}

                          <button
                            onClick={() => cancelOrder(item)}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600  w-[40%]"
                          >
                            إلغاء
                          </button>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DeliveryListView;
