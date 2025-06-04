import { useEffect, useState } from "react";
import { axiosInstance } from "../../../utils/http-interceptor";
import { format } from "date-fns";

const today = format(new Date(), "yyyy-MM-dd");

const DeliveryListAnalytics = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [storeId, setStoreId] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [error, setError] = useState("");

  const fetchDeliveries = async () => {
    setLoading(true);
    setError("");
    try {
      const res: any = await axiosInstance.post("/analytics/deliveries", {
        storeId: storeId || undefined,
        status: status || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }, {
        headers: {
          "app-name": "delivery-company",
        },
      });
      console.log("res", res)
      setDeliveries(res);
    } catch (e: any) {
      setError(e?.response?.data?.message || "שגיאה בטעינת המשלוחים");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    // eslint-disable-next-line
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDeliveries();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">רשימת משלוחים (אנליטיקה)</h2>
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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              {/* <th className="px-4 py-2 border-b">ID</th> */}
              <th className="px-4 py-2 border-b">חנות</th>
              <th className="px-4 py-2 border-b">חברת משלוחים</th>
              <th className="px-4 py-2 border-b">סטטוס</th>
              <th className="px-4 py-2 border-b">נוצר בתאריך</th>
              <th className="px-4 py-2 border-b">שעת אספקה</th>
              <th className="px-4 py-2 border-b">לקוח</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8">טוען...</td></tr>
            ) : deliveries.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8">אין נתונים</td></tr>
            ) : (
              deliveries.map((d) => (
                <tr key={d._id} className="hover:bg-blueGray-50">
                  {/* <td className="px-4 py-2 border-b">{d._id}</td> */}
                  <td className="px-4 py-2 border-b">{d.storeName}</td>
                  <td className="px-4 py-2 border-b">{d.companyName}</td>
                  <td className="px-4 py-2 border-b">{d.status}</td>
                  <td className="px-4 py-2 border-b">{d.created ? format(new Date(d.created), 'MM-dd HH:mm') : ''}</td>
                  <td className="px-4 py-2 border-b">{d.deliveryDeltaMinutes}</td>
                  <td className="px-4 py-2 border-b">{d.fullName || d.customerId}</td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryListAnalytics;