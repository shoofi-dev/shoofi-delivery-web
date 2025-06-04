import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../utils/http-interceptor';

interface EmployeeForm {
  phone: string;
  role: string;
  fullName: string;
  isActive: boolean;
  companyId: string;
}

const DeliveryCompanyEmployeeForm: React.FC = () => {
  const { companyId, id } = useParams<{ companyId: string; id?: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<EmployeeForm>({
    phone: '',
    role: '',
    fullName: '',
    isActive: true,
    companyId: companyId || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response: any = await axiosInstance.get<EmployeeForm>(`/delivery/company/employee/${id}`);
      setForm(response);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employee');
      console.error('Error fetching employee:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await axiosInstance.post(`/delivery/company/employee/update/${id}`, form);
      } else {
        await axiosInstance.post(`/delivery/company/${companyId}/employee/add`, form);
      }
      navigate(`/admin/delivery-companies/${companyId}/employees`);
    } catch (err) {
      setError('Failed to save employee');
      console.error('Error saving employee:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h1 className="text-2xl font-bold mb-6">
        {id ? 'ערוך עובד' : 'הוסף עובד'}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
            שם מלא
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            טלפון
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
            תפקיד
          </label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rtl-select"
            required
          >
            <option value="">בחר תפקיד</option>
            <option value="driver">נהג</option>
            <option value="manager">מנהל</option>
            <option value="admin">מנהל מערכת</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className=" ml-2 form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700 text-sm font-bold">פעיל</span>
          </label>
        </div>

        <div className="flex items-center gap-4 mt-12">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'שומר...' : 'שמור'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/delivery-companies/${companyId}/employees`)}
            className=" text-gray-600 hover:text-gray-800"
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryCompanyEmployeeForm; 