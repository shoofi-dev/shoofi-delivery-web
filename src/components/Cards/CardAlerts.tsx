import React, { useState } from 'react';
import ReassignDriverModal from '../Modals/ReassignDriverModal';

// A mapping from status codes to human-readable text and colors
const statusInfo = {
  '1': { text: 'ממתין', color: 'bg-yellow-500' },
  '2': { text: 'שויך', color: 'bg-blue-500' },
  '3': { text: 'בביצוע', color: 'bg-indigo-500' },
  '0': { text: 'נמסר', color: 'bg-green-500' },
  '-1': { text: 'בוטל', color: 'bg-red-500' },
};

const CardAlerts = ({ alerts, onReassign }: { alerts: any[], onReassign?: () => void }) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  if (!alerts || alerts.length === 0) {
    return null;
  }

  const handleReassign = (order: any) => {
    setSelectedOrder(order);
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-red-100 border-2 border-red-400">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-red-700">
                פעולה נדרשת ({alerts.length})
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right bg-red-200 text-red-600 border-red-300">
                  מזהה הזמנה
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right bg-red-200 text-red-600 border-red-300">
                  התראה
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right bg-red-200 text-red-600 border-red-300">
                  סטטוס נוכחי
                </th>
                 <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right bg-red-200 text-red-600 border-red-300">
                  שליח
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right bg-red-200 text-red-600 border-red-300">
                  פעולה
                </th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert._id}>
                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                    {alert.bookId || 'N/A'}
                  </th>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-bold text-red-700">
                    {alert.alertMessage}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                     <span className={`px-2 py-1 text-white rounded-full text-xs ${statusInfo[alert.status as keyof typeof statusInfo]?.color || 'bg-gray-500'}`}>
                      {statusInfo[alert.status as keyof typeof statusInfo]?.text || 'Unknown'}
                    </span>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {alert.driver?.fullName || alert.driver?.name || 'N/A'}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <button
                      onClick={() => handleReassign(alert)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs"
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
            if (onReassign) {
              onReassign();
            }
            setSelectedOrder(null);
          }}
        />
      )}
    </>
  );
};

export default CardAlerts;
