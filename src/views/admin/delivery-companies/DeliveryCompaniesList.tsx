import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from 'utils/http-interceptor';

const DeliveryCompaniesList = () => {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();
  const fetchCompanies = async () => {
    const res: any = await axiosInstance.get('/shoofiAdmin/delivery-companies');
    setCompanies(res);
  };
  useEffect(() => { fetchCompanies(); }, []);

  const handleEdit = (id: string) => navigate(`/admin/delivery-companies/edit/${id}`);
  const handleAdd = () => navigate('/admin/delivery-companies/add');
  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this company?')) {
      await axiosInstance.delete(`/shoofiAdmin/delivery-company/${id}`);
      fetchCompanies();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Delivery Companies</h2>
        <button
  onClick={handleAdd}
  className="bg-blue-500 text-white px-4 py-2 rounded"
  style={{ zIndex: 1000, position: 'relative', pointerEvents: 'auto' }}
>
  Add Company
</button>      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Name (AR)</th>
              <th className="px-4 py-2">Name (HE)</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Coverage Radius</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c: any) => (
              <tr key={c._id} className="border-t">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.nameAR}</td>
                <td className="px-4 py-2">{c.nameHE}</td>
                <td className="px-4 py-2">{c.phone}</td>
                <td className="px-4 py-2">{c.status ? 'Active' : 'Inactive'}</td>
                <td className="px-4 py-2">{c.coverageRadius}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleEdit(c._id)} className="text-blue-500 mr-2">Edit</button>
                  <button onClick={() => handleDelete(c._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryCompaniesList; 