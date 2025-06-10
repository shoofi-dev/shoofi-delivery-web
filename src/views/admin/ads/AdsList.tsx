import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../utils/http-interceptor";
import { toast } from 'react-toastify';
import Loader from 'components/Loader/loader';
import { cdnUrl } from "../../../consts/shared";

interface Ad {
  _id: string;
  titleAR: string;
  titleHE: string;
  image?: any;
  startDate: string;
  endDate: string;
}

const AdsList = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res: any = await axiosInstance.get("/ads/list");
      setAds(res);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "שגיאה בטעינת מודעות");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את המודעה?")) return;
    setLoading(true);
    try {
      await axiosInstance.delete(`/ads/${id}`);
      toast.success("מודעה נמחקה בהצלחה!");
      fetchAds();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "שגיאה במחיקת מודעה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">מודעות</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => navigate("/admin/ads/add")}
        >
          הוסף מודעה
        </button>
      </div>
      {loading && <Loader />}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">תמונה</th>
              <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">כותרת (ערבית)</th>
              <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">כותרת (עברית)</th>
              <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">תאריך התחלה</th>
              <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">תאריך סיום</th>
              <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-center">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad._id} className="border-t hover:bg-blue-50 transition">
                <td className="py-2 px-4">
                  {ad.image?.uri && (
                    <img
                      src={cdnUrl + ad.image.uri}
                      alt="ad"
                      className="h-12 w-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="py-2 px-4 text-right">{ad.titleAR}</td>
                <td className="py-2 px-4 text-right">{ad.titleHE}</td>
                <td className="py-2 px-4 text-right">{ad.startDate?.slice(0, 10)}</td>
                <td className="py-2 px-4 text-right">{ad.endDate?.slice(0, 10)}</td>
                <td className="py-2 px-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
                      onClick={() => navigate(`/admin/ads/edit/${ad._id}`)}
                    >
                      ערוך
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDelete(ad._id)}
                    >
                      הסר
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdsList; 