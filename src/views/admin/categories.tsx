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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">קטגוריות</h2>
        <button
          className="bg-blueGray-800 text-white px-6 py-2 rounded shadow"
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
              <th className="px-4 py-2">Name (AR)</th>
              <th className="px-4 py-2">Name (HE)</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoryList.map((category) => (
              <tr key={category._id} className="border-t cursor-pointer hover:bg-blue-50" onClick={() => handleRowClick(category._id)}>
                <td className="px-4 py-2">{category.nameAR}</td>
                <td className="px-4 py-2">{category.nameHE}</td>
                <td className="px-4 py-2">
                  <img
                    alt="Category"
                    className="w-24 h-12 object-cover rounded"
                    src={category.image?.uri ? `${cdnUrl}${category.image.uri}` : ''}
                  />
                </td>
                <td className="px-4 py-2">
                  <button onClick={e => { e.stopPropagation(); handleEdit(category._id); }} className="text-blue-500 mr-2">Edit</button>
                  <button onClick={e => { e.stopPropagation(); handleDelete(category._id); }} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
