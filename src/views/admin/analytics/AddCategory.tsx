import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../../utils/http-interceptor";
import ExtrasManager, { Extra } from "../../../components/admin/ExtrasManager";
import { cdnUrl } from "../../../consts/shared";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [nameAR, setNameAR] = useState("");
  const [nameHE, setNameHE] = useState("");
  const [order, setOrder] = useState("");
  const [extras, setExtras] = useState<Extra[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/shoofiAdmin/category/${id}`).then((res: any) => {
        const cat = res;
        setName(cat.name);
        setNameAR(cat.nameAR);
        setNameHE(cat.nameHE);
        setOrder(cat.order);
        setExtras(cat.extras || []);
        if (cat.image?.uri) {
          setImagePreview(cdnUrl + cat.image.uri);
        }
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
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("nameAR", nameAR);
      formData.append("nameHE", nameHE);
      formData.append("order", order);
      formData.append("extras", JSON.stringify(extras));
      if (image) {
        formData.append("img", image);
      }
      const url = id ? `/shoofiAdmin/category/update/${id}` : "/shoofiAdmin/category/add";
      await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(id ? "קטגוריה עודכנה בהצלחה!" : "קטגוריה נוספה בהצלחה!");
      setTimeout(() => navigate("/admin/categories"), 1200);
    } catch (e: any) {
      setError(e?.response?.data?.message || (id ? "שגיאה בעדכון קטגוריה" : "שגיאה בהוספת קטגוריה"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">{id ? "עריכת קטגוריה" : "הוספת קטגוריה חדשה"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1">שם קטגוריה (אנגלית)</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">שם קטגוריה (ערבית)</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={nameAR}
            onChange={e => setNameAR(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">שם קטגוריה (עברית)</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={nameHE}
            onChange={e => setNameHE(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">סדר</label>
          <input
            className="border rounded px-3 py-2 w-full"
            type="number"
            value={order}
            onChange={e => setOrder(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">תוספות</label>
          <ExtrasManager
            value={extras}
            onChange={setExtras}
            globalExtras={[]}
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
          {loading ? (id ? "שומר..." : "שומר...") : (id ? "עדכן קטגוריה" : "שמור קטגוריה")}
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
        {success && <div className="text-green-600 mt-2">{success}</div>}
      </form>
    </div>
  );
};

export default AddCategory; 