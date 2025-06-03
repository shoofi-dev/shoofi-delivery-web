import getCategoriesListApi from "apis/admin/category/get-categories";
import { cdnUrl } from "consts/shared";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TCategory } from "shared/types/category";

export default function CategoriesList() {
  const [categoryList, setCategoryList] = useState<TCategory[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    getCategoriesListApi().then((res) => {
      setCategoryList(res);
    });
  }, []);

  const handleEdit = (id: string) => navigate(`/admin/category/edit/${id}`);
  const handleAdd = () => navigate("/admin/category/add");
  const handleDelete = (id: string) => {
    // TODO: Implement delete logic (API call and refresh list)
    if (window.confirm("Delete this category?")) {
      // deleteCategoryApi(id).then(() => fetchCategories());
      alert("Delete logic not implemented");
    }
  };
  const handleRowClick = (id: string) => navigate(`/admin/categories/${id}/stores`);

  if (!categoryList) {
    return null;
  }
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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">שם (ערבית)</th>
              <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">שם (עברית)</th>
              <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">תמונה</th>
              <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-center">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {categoryList.map((category) => (
              <tr key={category._id} className="border-t hover:bg-blue-50 transition cursor-pointer" onClick={() => handleRowClick(category._id)}>
                <td className="px-4 py-2 text-right">{category.nameAR}</td>
                <td className="px-4 py-2 text-right">{category.nameHE}</td>
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
    </div>
  );
}
