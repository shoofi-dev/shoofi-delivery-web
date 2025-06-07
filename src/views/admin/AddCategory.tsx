import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../utils/http-interceptor";
import ExtrasManager from "../../components/admin/ExtrasManager";
import { Extra } from "../../types/extra";
import { cdnUrl } from "../../consts/shared";
import { toast } from 'react-toastify';
import Loader from 'components/Loader/loader';

interface GeneralCategory {
  _id: string;
  nameAR: string;
  nameHE: string;
}

const AddCategory = () => {
  const [nameAR, setNameAR] = useState("");
  const [nameHE, setNameHE] = useState("");
  const [order, setOrder] = useState("");
  const [extras, setExtras] = useState<Extra[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generalCategories, setGeneralCategories] = useState<GeneralCategory[]>([]);
  const [selectedGeneralCategories, setSelectedGeneralCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch general categories
    const fetchGeneralCategories = async () => {
      try {
        setIsLoading(true);
        const res: any = await axiosInstance.get("/category/general/all");
        setGeneralCategories(res);
      } catch (error) {
        console.error("Failed to fetch general categories:", error);
        toast.error('שגיאה בטעינת קטגוריות כלליות');
      } finally {
        setIsLoading(false);
      }
    };
    fetchGeneralCategories();

    if (id) {
      setIsLoading(true);
      axiosInstance.get(`/shoofiAdmin/category/${id}`).then((res: any) => {
        const cat = res;
        setNameAR(cat.nameAR);
        setNameHE(cat.nameHE);
        setOrder(cat.order);
        setExtras(cat.extras || []);
        setSelectedGeneralCategories(cat.supportedGeneralCategoryIds || []);
        if (cat.image?.uri) {
          setImagePreview(cdnUrl + cat.image.uri);
        }
      }).catch(() => {
        toast.error('שגיאה בטעינת פרטי הקטגוריה');
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

  const handleGeneralCategoryChange = (categoryId: string) => {
    setSelectedGeneralCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("nameAR", nameAR);
      formData.append("nameHE", nameHE);
      formData.append("order", order);
      formData.append("extras", JSON.stringify(extras));
      formData.append("supportedGeneralCategoryIds", JSON.stringify(selectedGeneralCategories));
      if (image) {
        formData.append("img", image);
      }
      const url = id ? `/shoofiAdmin/category/update/${id}` : "/shoofiAdmin/category/add";
      await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(id ? "קטגוריה עודכנה בהצלחה!" : "קטגוריה נוספה בהצלחה!");
      setTimeout(() => navigate("/admin/categories"), 1200);
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || (id ? "שגיאה בעדכון קטגוריה" : "שגיאה בהוספת קטגוריה");
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
        <h2 className="text-2xl font-bold mb-4">{id ? "עריכת קטגוריה" : "הוספת קטגוריה חדשה"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1">קטגוריות כלליות</label>
            <div className="border rounded p-3 max-h-48 overflow-y-auto">
              {generalCategories.map((category) => (
                <div key={category._id} className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id={category._id}
                    checked={selectedGeneralCategories.includes(category._id)}
                    onChange={() => handleGeneralCategoryChange(category._id)}
                    className="h-4 w-4"
                  />
                  <label htmlFor={category._id} className="cursor-pointer">
                    {category.nameHE}
                  </label>
                </div>
              ))}
            </div>
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
    </>
  );
};

export default AddCategory; 