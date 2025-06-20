import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from 'utils/http-interceptor';
import CitySelect from 'components/admin/CitySelect';
import clsx from 'clsx';

interface City {
  _id: string;
  nameAR: string;
  nameHE: string;
}

interface Company {
  _id: string;
  name: string;
  nameAR: string;
  nameHE: string;
  phone: string;
  status: boolean;
  coverageRadius: number;
}

const DeliveryCompaniesList = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState('');
  const navigate = useNavigate();
  const { cityId } = useParams();

  useEffect(() => {
    if (cityId) {
      setSelectedCityId(cityId);
    }
    fetchCities();
  }, [cityId]);

  useEffect(() => {
    if (selectedCityId) {
      fetchCompanies();
    }
  }, [selectedCityId]);

  const fetchCities = async () => {
    const res: any = await axiosInstance.get<City[]>('/delivery/cities');
    setCities(res);
  };

  const fetchCompanies = async () => {
    const res: any = await axiosInstance.get<Company[]>(`/delivery/companies/by-city/${selectedCityId}`);
    setCompanies(res);
  };

  const handleEdit = (id: string) => navigate(`/admin/delivery-companies/edit/${id}`);
  const handleAdd = () => {
    navigate(`/admin/delivery-companies/add/${selectedCityId}`);
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('האם למחוק את החברה?')) {
      await axiosInstance.delete(`/delivery/company/${id}`);
      fetchCompanies();
    }
  };
  const handleRowClick = (id: string) => navigate(`/admin/delivery-companies/${id}/employees`);
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
    setSelectedCityId(cityId);
    navigate(`/admin/delivery-companies/city/${cityId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">חברות משלוחים</h2>
        <button
          onClick={handleAdd}
          className={clsx('bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600', !selectedCityId && 'opacity-50 cursor-not-allowed')}
          disabled={!selectedCityId}
          style={{ zIndex: 1000, position: 'relative', pointerEvents: 'auto' }}
        >
          הוסף חברה
        </button>
      </div>
      <div className="flex items-center space-x-4 mt-4 mb-6">
        <CitySelect 
          value={selectedCityId}
          onChange={setSelectedCityId}
        />
      </div>
      {selectedCityId ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">שם (ערבית)</th>
                <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">שם (עברית)</th>
                <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">טלפון</th>
                <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">סטטוס</th>
                <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-center">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c._id} className="border-t cursor-pointer hover:bg-blue-50 transition" onClick={() => handleRowClick(c._id)}>
                  <td className="px-4 py-2 text-right">{c.nameAR}</td>
                  <td className="px-4 py-2 text-right">{c.nameHE}</td>
                  <td className="px-4 py-2 text-right">{c.phone}</td>
                  <td className="px-4 py-2 text-right">{c.status ? 'פעיל' : 'לא פעיל'}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={e => { e.stopPropagation(); handleEdit(c._id); }} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">ערוך</button>
                      <button onClick={e => { e.stopPropagation(); handleDelete(c._id); }} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">הסר</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          אנא בחר עיר כדי לצפות בחברות המשלוחים
        </div>
      )}
    </div>
  );
};

export default DeliveryCompaniesList; 