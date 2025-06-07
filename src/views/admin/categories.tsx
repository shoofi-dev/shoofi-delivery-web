import getCategoriesListApi from "apis/admin/category/get-categories";
import { cdnUrl } from "consts/shared";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TCategory } from "shared/types/category";
import { axiosInstance } from "utils/http-interceptor";

interface GeneralCategory {
  _id: string;
  nameAR: string;
  nameHE: string;
  img?: any;
}

export default function CategoriesList() {
  const [categoryList, setCategoryList] = useState<TCategory[]>([]);
  const [generalCategories, setGeneralCategories] = useState<GeneralCategory[]>([]);
  const [selectedGeneralCategory, setSelectedGeneralCategory] = useState<string>("");
  const navigate = useNavigate();
  const { generalCategoryId } = useParams();

  const fetchGeneralCategories = async () => {
    try {
      const res: any = await axiosInstance.get("/category/general/all");
      setGeneralCategories(res);
    } catch (error) {
      console.error("Failed to fetch general categories:", error);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const res: any = await axiosInstance.get("/shoofiAdmin/category/list");
      setCategoryList(res);
    } catch (error) {
      console.error("Failed to fetch all categories:", error);
    }
  };

  const fetchStoreCategories = async (generalCategoryId: string) => {
    try {
      const res: any = await axiosInstance.get(`/category/by-general/${generalCategoryId}`);
      setCategoryList(res);
    } catch (error) {
      console.error("Failed to fetch store categories:", error);
    }
  };

  useEffect(() => {
    fetchGeneralCategories();
  }, []);

  useEffect(() => {
    if (generalCategoryId) {
      setSelectedGeneralCategory(generalCategoryId);
    }
  }, [generalCategoryId]);

  useEffect(() => {
    if (selectedGeneralCategory) {
      fetchStoreCategories(selectedGeneralCategory);
    } else {
      fetchAllCategories();
    }
  }, [selectedGeneralCategory]);

  const handleEdit = (id: string) => navigate(`/admin/category/edit/${id}`);
  const handleAdd = () => navigate("/admin/category/add");
  const handleDelete = async (id: string) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק קטגוריה זו?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/shoofiAdmin/category/${id}`);
      // Refresh the categories list
      if (selectedGeneralCategory) {
        fetchStoreCategories(selectedGeneralCategory);
      } else {
        fetchAllCategories();
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("שגיאה במחיקת הקטגוריה");
    }
  };
  const handleRowClick = (id: string) => navigate(`/admin/categories/${id}/stores`);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">קטגוריות</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          style={{ zIndex: 1000, position: 'relative', pointerEvents: 'auto' }}
          onClick={handleAdd}
        >
          הוסף קטגוריה
        </button>
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">קטגוריה כללית</label>
        <select
          className="border rounded px-3 py-2 w-full max-w-xs"
          value={selectedGeneralCategory}
          onChange={(e) => setSelectedGeneralCategory(e.target.value)}
        >
          <option value="">הכל</option>
          {generalCategories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.nameHE}
            </option>
          ))}
        </select>
      </div>

      {categoryList.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">שם (ערבית)</th>
                <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">שם (עברית)</th>
                <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">קטגוריה כללית</th>
                <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">תמונה</th>
                <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-center">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {categoryList.map((category:any) => (
                <tr key={category._id} className="border-t hover:bg-blue-50 transition cursor-pointer" onClick={() => handleRowClick(category._id)}>
                  <td className="px-4 py-2 text-right">{category.nameAR}</td>
                  <td className="px-4 py-2 text-right">{category.nameHE}</td>
                  <td className="px-4 py-2 text-right">
                    {generalCategories.find(gc => gc._id === category.generalCategoryId)?.nameHE || '-'}
                  </td>
                  <td className="px-4 py-2 text-right">       {category.image  && (
                      <img
                      src={`${cdnUrl}${category.image.uri}`}
                      alt="category"
                        className="h-12 w-12 object-cover rounded"
                      />
                    )}</td>

                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={e => { e.stopPropagation(); handleEdit(category._id); }} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">ערוך</button>
                      <button onClick={e => { e.stopPropagation(); handleDelete(category._id); }} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">הסר</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-4">
          {selectedGeneralCategory ? "לא נמצאו קטגוריות" : "לא נמצאו קטגוריות"}
        </div>
      )}
    </div>
  );
}
