import { useEffect, useState } from "react";
import { axiosInstance } from "../../../utils/http-interceptor";
import { format } from "date-fns";

const today = format(new Date(), "yyyy-MM-dd");

interface DeliveryCompany {
  _id: string;
  name: string;
  nameAR: string;
  nameHE: string;
}

const DeliveryListAnalytics = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<DeliveryCompany[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res: any = await axiosInstance.get<DeliveryCompany[]>("/delivery/companies");
      setCompanies(res);
    } catch (e: any) {
      setError(e?.response?.data?.message || "שגיאה בטעינת חברות המשלוחים");
    }
  };

  const fetchDeliveries = async () => {
    setLoading(true);
    setError("");
    try {
      const res: any = await axiosInstance.post("/analytics/deliveries", {
        companyId: selectedCompanyId || undefined,
        status: status || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }, {
        headers: {
          "app-name": "delivery-company",
        },
      });
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
          <label className="block mb-1">חברת משלוחים</label>
          <select
            className="border rounded px-3 py-2 w-64 rtl-select"
            value={selectedCompanyId}
            onChange={e => setSelectedCompanyId(e.target.value)}
          >
            <option value="">כל החברות</option>
            {companies.map(company => (
              <option key={company._id} value={company._id}>
                {company.nameHE}
              </option>
            ))}
          </select>
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
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b text-center">חנות</th>
              <th className="px-4 py-2 border-b text-center">חברת משלוחים</th>
              <th className="px-4 py-2 border-b text-center">סטטוס</th>
              <th className="px-4 py-2 border-b text-center">נוצר בתאריך</th>
              <th className="px-4 py-2 border-b text-center">שעת אספקה</th>
              <th className="px-4 py-2 border-b text-center">לקוח</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8">טוען...</td></tr>
            ) : deliveries.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8">אין נתונים</td></tr>
            ) : (
              deliveries.map((d) => {
                const isOldPending = d.status === "1" && d.created && 
                  (new Date().getTime() - new Date(d.created).getTime()) > 2 * 60 * 1000;
                
                const isLateDelivery = d.status === "2" && d.deliveryDeltaMinutes && 
                  d.deliveryDeltaMinutes > 2;
                
                return (
                  <tr key={d._id} className={`hover:bg-blue-50 ${isOldPending || isLateDelivery ? 'bg-red-600 text-white' : ''}`}>
                    <td className="px-4 py-2 border-b text-center">{d.storeName}</td>
                    <td className="px-4 py-2 border-b text-center">{d.companyName}</td>
                    <td className="px-4 py-2 border-b text-center">{d.status}</td>
                    <td className="px-4 py-2 border-b text-center">{d.created ? format(new Date(d.created), 'MM-dd HH:mm') : ''}</td>
                    <td className="px-4 py-2 border-b text-center">{d.deliveryDeltaMinutes}</td>
                    <td className="px-4 py-2 border-b text-center">{d.fullName || d.customerId}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryListAnalytics;