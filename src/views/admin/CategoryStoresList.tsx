import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from 'utils/http-interceptor';

const CategoryStoresList = () => {
  const { categoryId } = useParams();
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (categoryId) {
      axiosInstance.post('/shoofiAdmin/stores/by-category', { categoryId }).then((res: any) => {
        setStores(res);
      });
    }
  }, [categoryId]);

  const handleEdit = (id: string) => navigate(`/admin/store/edit/${id}`);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Stores in Category</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">Store Name</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store: any) => (
              <tr key={store._id} className="border-t">
                <td className="px-4 py-2">{store.name || store.storeName}</td>
                <td className="px-4 py-2">{store.address || ''}</td>
                <td className="px-4 py-2">{store.phone || ''}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleEdit(store._id)} className="text-blue-500 mr-2">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryStoresList; 