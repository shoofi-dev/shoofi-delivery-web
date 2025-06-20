import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { axiosInstance } from "utils/http-interceptor";
import { toast } from "react-toastify";
import { cdnUrl } from "consts/shared";
import StoreDropdown, { Store } from "components/admin/StoreDropdown";

const DEFAULT_APP_NAME = process.env.REACT_APP_APP_NAME || "";

const StoreCategoriesList: React.FC = () => {
  const { appNameParam } = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [appName, setStoreAppName] = useState(appNameParam || "");
  const [selectedStore, setSelectedStore] = useState<Store>();

  const navigate = useNavigate();
  console.log("appNameParam", appNameParam);
  const handleStoreChange = (store: Store) => {
    setSelectedStore(store);
    setStoreAppName(store.appName);
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res: any = await axiosInstance.get("/store-category/all", {
        headers: { "app-name": appName || DEFAULT_APP_NAME },
      });
      setCategories(res);
    } catch (err) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appName) {
      console.log("appName", appName);
      fetchCategories();
    }
  }, [appName]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await axiosInstance.delete(`/store-category/${id}`, {
        headers: { "app-name": appName || DEFAULT_APP_NAME },
      });
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedCategories = items.map((cat, index) => ({
      ...cat,
      order: index,
    }));
    
    setCategories(updatedCategories);

    try {
      const payload = updatedCategories.map(({ _id, order }) => ({ _id, order }));
      await axiosInstance.post('/store-category/update-order', { categories: payload }, {
        headers: { 'app-name': appName || DEFAULT_APP_NAME },
      });
      toast.success('Category order updated');
    } catch (err) {
      toast.error('Failed to update category order');
      // Optionally, revert state on error
      fetchCategories();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">קטגוריות חנות</h1>
      </div>
      <div className="w-full mb-4 flex items-center  justify-between">
        <StoreDropdown
          value={appName}
          onChange={handleStoreChange}
          label="בחר חנות"
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
          onClick={() =>
            navigate(
              appName
                ? `/admin/store-categories/${appName}/add`
                : "/admin/store-categories/add"
            )
          }
        >
          הוסף קטגוריה
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="categories">
              {(provided) => (
                <table className="min-w-full bg-white rounded shadow" {...provided.droppableProps} ref={provided.innerRef}>
                  <thead>
                    <tr>
                      <th className="py-2 px-4 bg-blueGray-50 text-blueGray-500 uppercase text-lg font-semibold border-b text-right">
                        תמונה
                      </th>
                      <th className="py-2 px-4 bg-blueGray-50 text-blueGray-500 uppercase text-lg font-semibold border-b text-right">
                        שם (ערבית)
                      </th>
                      <th className="py-2 px-4 bg-blueGray-50 text-blueGray-500 uppercase text-lg font-semibold border-b text-right">
                        שם (עברית)
                      </th>
                      <th className="py-2 px-4 bg-blueGray-50 text-blueGray-500 uppercase text-lg font-semibold border-b text-right">
                        סדר
                      </th>
                      <th className="py-2 px-4 bg-blueGray-50 text-blueGray-500 uppercase text-lg font-semibold border-b text-center">
                        פעולות
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat: any, index: number) => (
                      <Draggable key={cat._id?.$oid || cat._id} draggableId={cat._id?.$oid || cat._id} index={index}>
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="border-t hover:bg-blue-50 transition"
                          >
                            <td className="py-2 px-4">
                              {cat.img && cat.img.length > 0 && (
                                <img
                                  src={`${cdnUrl}${cat.img[0].uri}`}
                                  alt="category"
                                  className="h-12 w-12 object-cover rounded"
                                />
                              )}
                            </td>
                            <td className="py-2 px-4 text-right">{cat.nameAR}</td>
                            <td className="py-2 px-4 text-right">{cat.nameHE}</td>
                            <td className="py-2 px-4 text-right">{cat.order}</td>
                            <td className="py-2 px-4 text-center">
                              <div className="flex justify-center gap-3">
                                <button
                                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
                                  onClick={() =>
                                    navigate(
                                      appName
                                        ? `/admin/store-categories/${appName}/edit/${
                                            cat._id?.$oid || cat._id
                                          }`
                                        : `/admin/store-categories/edit/${
                                            cat._id?.$oid || cat._id
                                          }`
                                    )
                                  }
                                >
                                  ערוך
                                </button>
                                <button
                                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                  onClick={() => handleDelete(cat._id?.$oid || cat._id)}
                                >
                                  הסר
                                </button>
                                <button
                                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                  onClick={() =>
                                    navigate(`/admin/products/${appName}/${cat._id}`)
                                  }
                                >
                                  נהל מוצרים
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  );
};

export default StoreCategoriesList;
