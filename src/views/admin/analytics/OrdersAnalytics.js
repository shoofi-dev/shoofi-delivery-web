import React, { useState, useEffect } from "react";
import { axiosInstance } from '../../../utils/http-interceptor';
import DateRangePicker from "components/DateRangePicker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController, 
  LineController,
  PointElement,   // <-- Add this

  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format } from "date-fns";

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

export default function OrdersAnalytics() {
  const today = format(new Date(), "yyyy-MM-dd");

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (type, value) => {
    if (type === "startDate") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const fetchOrderData = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post("/analytics/orders-per-restaurant", {
        startDate,
        endDate,
      },
      {
        headers: {
          "app-name": "delivery-company",
        },
      }
    );
      setOrderData(response);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchOrderData();
    }
  }, [startDate, endDate]);

  const chartData = {
    labels: orderData.map((item) => item._id),
    datasets: [
      {
        label: "Number of Orders",
        data: orderData.map((item) => item.orderCount),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Total Sales",
        data: orderData.map((item) => item.totalSales),
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
        text: "Orders and Sales by Restaurant",
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="text-2xl font-bold text-blueGray-700 mb-4">
            ניתוח הזמנות            </h3>
          </div>
        </div>
      </div>

      <div className="block w-full overflow-x-auto p-4">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}

        />

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-blueGray-50 text-blueGray-500 align-middle text-right border-b text-xs uppercase font-semibold">מזהה מסעדה</th>
                  <th className="px-6 py-3 bg-blueGray-50 text-blueGray-500 align-middle text-right border-b text-xs uppercase font-semibold">מספר הזמנות</th>
                  <th className="px-6 py-3 bg-blueGray-50 text-blueGray-500 align-middle text-right border-b text-xs uppercase font-semibold">סך הכל מכירות</th>
                </tr>
              </thead>
              <tbody>
                {orderData.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-blue-50 transition">
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      {item._id}
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">{item.orderCount}</td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">₪{item.totalSales.toFixed(2)}</td>
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