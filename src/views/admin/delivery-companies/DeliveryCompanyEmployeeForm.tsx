import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from 'utils/http-interceptor';

const initialState = { fullName: '', phone: '', role: '', isActive: true };

const DeliveryCompanyEmployeeForm = () => {
  const { companyId, id } = useParams();
  const [form, setForm] = useState(initialState);
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      axiosInstance.get(`/shoofiAdmin/delivery-company/employee/${id}`).then((res: any) => {
        setForm({ ...res });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isEdit) {
      await axiosInstance.post(`/shoofiAdmin/delivery-company/employee/update/${id}`, form);
    } else {
      await axiosInstance.post(`/shoofiAdmin/delivery-company/${companyId}/employee/add`, form);
    }
    navigate(`/admin/delivery-companies/${companyId}/employees`);
  };

  return (
    <form className="max-w-md mx-auto p-6 bg-white rounded shadow mt-8" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit' : 'Add'} Employee</h2>
      <div className="grid grid-cols-1 gap-4">
        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="border p-2 rounded" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" required />
        <input name="role" value={form.role} onChange={handleChange} placeholder="Role" className="border p-2 rounded" required />
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
          <span>Active</span>
        </label>
      </div>
      <button type="submit" className="mt-6 bg-blue-500 text-white px-6 py-2 rounded">{isEdit ? 'Update' : 'Add'} Employee</button>
    </form>
  );
};

export default DeliveryCompanyEmployeeForm; 