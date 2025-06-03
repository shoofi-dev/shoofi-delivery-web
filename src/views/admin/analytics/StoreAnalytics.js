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

export default function StoreAnalytics() {
  const { startDate: defaultStart, endDate: defaultEnd } = getDefaultDates();
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [storeData, setStoreData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (type, value) => {
    if (type === "startDate") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const fetchStoreData = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post("/analytics/stores-by-category", {
        startDate,
        endDate,
      });
      setStoreData(response);
    } catch (error) {
      console.error("Error fetching store data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchStoreData();
    }
  }, [startDate, endDate]);

  const chartData = {
    labels: storeData.map((item) => item._id),
    datasets: [
      {
        label: "Number of Stores",
        data: storeData.map((item) => item.storeCount),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Total Revenue",
        data: storeData.map((item) => item.totalRevenue),
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
        text: "Stores and Revenue by Category",
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="text-2xl font-bold text-blueGray-700 mb-4">
              אנליטיקת חנויות
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
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-blueGray-50 text-blueGray-500 align-middle text-right border-b text-xs uppercase font-semibold">קטגוריה</th>
                  <th className="px-6 py-3 bg-blueGray-50 text-blueGray-500 align-middle text-right border-b text-xs uppercase font-semibold">מספר חנויות</th>
                  <th className="px-6 py-3 bg-blueGray-50 text-blueGray-500 align-middle text-right border-b text-xs uppercase font-semibold">סך הכל הכנסות</th>
                </tr>
              </thead>
              <tbody>
                {storeData.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-blue-50 transition">
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                      {item._id}
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                      {item.storeCount}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                      ₪{item.totalRevenue.toFixed(2)}
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