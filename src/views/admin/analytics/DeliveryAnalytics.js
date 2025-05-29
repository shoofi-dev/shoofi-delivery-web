import React, { useState, useEffect } from "react";
import { axiosInstance } from '../../../utils/http-interceptor';
// import DateRangePicker from "components/DateRangePicker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController, 
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
// import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function getDefaultDates() {
  const today = new Date();
  const endDate = today.toISOString().slice(0, 10);
  const past = new Date();
  past.setMonth(today.getMonth() - 3);
  const startDate = past.toISOString().slice(0, 10);
  return { startDate, endDate };
}

export default function DeliveryAnalytics() {
  const { startDate: defaultStart, endDate: defaultEnd } = getDefaultDates();
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [deliveryData, setDeliveryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (type, value) => {
    if (type === "startDate") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const fetchDeliveryData = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post("/analytics/deliveries-by-company", {
        startDate,
        endDate,
      });
      setDeliveryData(response);
    } catch (error) {
      console.error("Error fetching delivery data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchDeliveryData();
    }
  }, [startDate, endDate]);

  const chartData = {
    labels: deliveryData.map((item) => item._id),
    datasets: [
      {
        label: "Number of Deliveries",
        data: deliveryData.map((item) => item.deliveryCount),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Total Earnings",
        data: deliveryData.map((item) => item.totalEarnings),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Deliveries and Earnings by Company",
      },
    },
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="font-semibold text-base text-blueGray-700">
              אנליטיקת משלוחים
            </h3>
          </div>
        </div>
      </div>

      <div className="block w-full overflow-x-auto p-4">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700 mr-2">מתאריך:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleDateChange("startDate", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700 mr-2">עד תאריך:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleDateChange("endDate", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center">טוען...</div>
        ) : (
          <>
            {/* <div className="mb-8">
              <Bar options={chartOptions} data={chartData} />
            </div> */}

            <table className="items-center w-full bg-transparent border-collapse">
              <thead>
                <tr>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle text-right border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
                    מזהה חברה
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle text-right border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
                    מספר משלוחים
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle text-right border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
                    סך הכל רווחים
                  </th>
                </tr>
              </thead>
              <tbody>
                {deliveryData.map((item, index) => (
                  <tr key={index}>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                      {item._id}
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                      {item.deliveryCount}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                      ₪{item.totalEarnings.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
} 