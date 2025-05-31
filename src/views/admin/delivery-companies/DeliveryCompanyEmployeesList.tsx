import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from 'utils/http-interceptor';

const DeliveryCompanyEmployeesList = () => {
  const { companyId } = useParams();
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    const res: any = await axiosInstance.get(`/shoofiAdmin/delivery-company/${companyId}/employees`);
    setEmployees(res);
  };
  useEffect(() => { fetchEmployees(); }, [companyId]);

  const handleAdd = () => navigate(`/admin/delivery-companies/${companyId}/employees/add`);
  const handleEdit = (id: string) => navigate(`/admin/delivery-companies/${companyId}/employees/edit/${id}`);
  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this employee?')) {
      await axiosInstance.delete(`/shoofiAdmin/delivery-company/employee/${id}`);
      fetchEmployees();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Employees</h2>
        <button onClick={handleAdd}   className="bg-blue-500 text-white px-4 py-2 rounded"
  style={{ zIndex: 1000, position: 'relative', pointerEvents: 'auto' }}>Add Employee</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">Full Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Active</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e: any) => (
              <tr key={e._id} className="border-t">
                <td className="px-4 py-2">{e.fullName}</td>
                <td className="px-4 py-2">{e.phone}</td>
                <td className="px-4 py-2">{e.role}</td>
                <td className="px-4 py-2">{e.isActive ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleEdit(e._id)} className="text-blue-500 mr-2">Edit</button>
                  <button onClick={() => handleDelete(e._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryCompanyEmployeesList; 