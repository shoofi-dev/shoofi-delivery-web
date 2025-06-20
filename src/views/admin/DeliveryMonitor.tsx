import React, { useState, useEffect } from 'react';
import getDeliveryOrders from 'apis/admin/delivery/get-delivery-orders';
import getDeliveryAlerts from 'apis/admin/delivery/get-delivery-alerts';
import CardDeliveryOrdersTable from '../../components/Cards/CardDeliveryOrdersTable';
import CardAlerts from '../../components/Cards/CardAlerts';

const DeliveryMonitor = () => {
  const [orders, setOrders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    limit: 10,
    offset: 0,
    status: '',
    driverId: '',
  });

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data:any = await getDeliveryOrders(filters);
      setOrders(data.orders);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const data: any = await getDeliveryAlerts();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
      // We don't set a visible error for alert fetching to not distract the user
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  useEffect(() => {
    fetchAlerts(); // Fetch alerts on initial render
    const intervalId = setInterval(fetchAlerts, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleReassignFromAlerts = () => {
    // Refresh both orders and alerts after reassignment
    fetchOrders();
    fetchAlerts();
  };

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-4">ניטור משלוחים</h1>
      <div> 
        <CardAlerts alerts={alerts} onReassign={handleReassignFromAlerts} />

      </div>
      <div className="flex space-x-4 mb-4">
        <select name="status" onChange={handleFilterChange} className="border p-2 rounded">
          <option value="">כל הסטטוסים</option>
          <option value="1">ממתין</option>
          <option value="2">שויך</option>
          <option value="3">בדרך</option>
          <option value="0">נמסר</option>
          <option value="-1">בוטל</option>
        </select>
        <input
          type="text"
          name="driverId"
          placeholder="סנן לפי מזהה שליח"
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
      </div>
      {loading && <p>טוען...</p>}
      {error && <p className="text-red-500">שגיאה בטעינת הזמנות</p>}
      <CardDeliveryOrdersTable orders={orders} onReassign={fetchOrders} />
    </div>
  );
};

export default DeliveryMonitor;