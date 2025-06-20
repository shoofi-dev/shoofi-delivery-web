import React, { useState } from 'react';
import ReassignDriverModal from '../Modals/ReassignDriverModal';

const CardDeliveryOrdersTable = ({ orders, onReassign }: { orders: any[], onReassign: () => void }) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const getStatusText = (status: string) => {
    switch (status) {
      case '1': return 'ממתין';
      case '2': return 'שויך';
      case '3': return 'בדרך';
      case '0': return 'נמסר';
      case '-1': return 'בוטל';
      default: return 'לא ידוע';
    }
  };

  return (
    <>
      <div className=" flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right">
                  מזהה הזמנה
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right">
                  סטטוס
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right">
                  שליח
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right">
                  נוצר בתאריך
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right">
                  פעולות
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                    {order.bookId}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                    {getStatusText(order.status)}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                    {order.driver?.fullName}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                    {new Date(order.created).toLocaleString()}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-blue-500 text-white p-2 rounded"
                    >
                      שייך מחדש
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedOrder && (
        <ReassignDriverModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onReassign={() => {
            onReassign();
            setSelectedOrder(null);
          }}
        />
      )}
    </>
  );
};

export default CardDeliveryOrdersTable;