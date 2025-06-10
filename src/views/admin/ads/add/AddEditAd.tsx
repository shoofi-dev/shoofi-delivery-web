import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../../../utils/http-interceptor";
import { toast } from 'react-toastify';
import Loader from 'components/Loader/loader';

interface Ad {
  _id?: string;
  titleAR: string;
  titleHE: string;
  descriptionAR: string;
  descriptionHE: string;
  image?: any;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}

const AddEditAd = () => {
  const [titleAR, setTitleAR] = useState("");
  const [titleHE, setTitleHE] = useState("");
  const [descriptionAR, setDescriptionAR] = useState("");
  const [descriptionHE, setDescriptionHE] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axiosInstance.get(`/ads/${id}`).then((res: any) => {
        const ad = res;
        setTitleAR(ad.titleAR);
        setTitleHE(ad.titleHE);
        setDescriptionAR(ad.descriptionAR);
        setDescriptionHE(ad.descriptionHE);
        setStartDate(ad.startDate ? ad.startDate.slice(0, 10) : "");
        setEndDate(ad.endDate ? ad.endDate.slice(0, 10) : "");
        if (ad.image?.uri) {
          setImagePreview(process.env.REACT_APP_CDN_URL + ad.image.uri);
        }
      }).catch(() => {
        toast.error('שגיאה בטעינת פרטי המודעה');
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("titleAR", titleAR);
      formData.append("titleHE", titleHE);
      formData.append("descriptionAR", descriptionAR);
      formData.append("descriptionHE", descriptionHE);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      if (image) {
        formData.append("img", image);
      }
      const url = id ? `/ads/update/${id}` : "/ads/add";
      await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(id ? "מודעה עודכנה בהצלחה!" : "מודעה נוספה בהצלחה!");
      setTimeout(() => navigate("/admin/ads"), 1200);
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || (id ? "שגיאה בעדכון מודעה" : "שגיאה בהוספת מודעה");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
        <h2 className="text-2xl font-bold mb-4">{id ? "עריכת מודעה" : "הוספת מודעה חדשה"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1">כותרת (ערבית)</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={titleAR}
              onChange={e => setTitleAR(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">כותרת (עברית)</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={titleHE}
              onChange={e => setTitleHE(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">תיאור (ערבית)</label>
            <textarea
              className="border rounded px-3 py-2 w-full"
              value={descriptionAR}
              onChange={e => setDescriptionAR(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">תיאור (עברית)</label>
            <textarea
              className="border rounded px-3 py-2 w-full"
              value={descriptionHE}
              onChange={e => setDescriptionHE(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">תאריך התחלה</label>
            <input
              className="border rounded px-3 py-2 w-full"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">תאריך סיום</label>
            <input
              className="border rounded px-3 py-2 w-full"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">תמונה</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 w-40 h-24 object-cover rounded" />
            )}
          </div>
          <button
            type="submit"
            className="bg-blueGray-800 text-white px-4 py-2 rounded shadow mt-2"
            disabled={loading}
          >
            {loading ? (id ? "שומר..." : "שומר...") : (id ? "עדכן מודעה" : "שמור מודעה")}
          </button>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </form>
      </div>
    </>
  );
};

export default AddEditAd; 