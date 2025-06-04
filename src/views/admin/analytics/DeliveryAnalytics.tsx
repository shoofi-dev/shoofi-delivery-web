import React, { useState } from 'react';
import { format } from 'date-fns';

const today = format(new Date(), 'yyyy-MM-dd');

const DeliveryAnalytics = () => {
  const [storeId, setStoreId] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState({
    totalDeliveries: 0,
    completedDeliveries: 0,
    failedDeliveries: 0,
    averageDeliveryTime: 0,
    successRate: 0,
    totalRevenue: 0
  });

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement filter logic here
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">אנליטיקת משלוחים</h2>
      <form className="flex flex-wrap gap-4 mb-6 items-end" onSubmit={handleFilter}>
        <div>
          <label className="block mb-1">מזהה חנות</label>
          <input
            className="border rounded px-3 py-2"
            value={storeId}
            onChange={e => setStoreId(e.target.value)}
            placeholder="מזהה חנות"
          />
        </div>
        <div>
          <label className="block mb-1">סטטוס</label>
          <input
            className="border rounded px-3 py-2"
            value={status}
            onChange={e => setStatus(e.target.value)}
            placeholder="סטטוס"
          />
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
        <button
          type="submit"
          className="bg-blueGray-800 text-white px-4 py-2 rounded shadow"
          disabled={loading}
        >
          סנן
        </button>
      </form>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <div className="text-center py-8">טוען...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blueGray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">סה"כ משלוחים</h3>
            <p className="text-3xl font-bold">{analytics.totalDeliveries}</p>
          </div>
          <div className="bg-blueGray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">משלוחים שהושלמו</h3>
            <p className="text-3xl font-bold">{analytics.completedDeliveries}</p>
          </div>
          <div className="bg-blueGray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">משלוחים שנכשלו</h3>
            <p className="text-3xl font-bold">{analytics.failedDeliveries}</p>
          </div>
          <div className="bg-blueGray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">זמן משלוח ממוצע (דקות)</h3>
            <p className="text-3xl font-bold">{analytics.averageDeliveryTime}</p>
          </div>
          <div className="bg-blueGray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">אחוז הצלחה</h3>
            <p className="text-3xl font-bold">{analytics.successRate}%</p>
          </div>
          <div className="bg-blueGray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">סה"כ הכנסות</h3>
            <p className="text-3xl font-bold">₪{analytics.totalRevenue}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryAnalytics; 