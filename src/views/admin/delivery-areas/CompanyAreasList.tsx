import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "utils/http-interceptor";

interface City {
  _id: string;
  nameAR: string;
  nameHE: string;
}

interface Company {
  _id: string;
  nameAR: string;
  nameHE: string;
}

const CompanyAreasList = () => {
  const { companyId } = useParams();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [areas, setAreas] = useState<Array<{ _id: string; name: string }>>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [supportedAreas, setSupportedAreas] = useState([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/delivery/cities").then((res: any) => setCities(res));
  }, []);

  useEffect(() => {
    if (selectedCityId) {
      axiosInstance.get(`/delivery/companies/by-city/${selectedCityId}`).then((res: any) => setCompanies(res));
      axiosInstance.get(`/delivery/areas/by-city/${selectedCityId}`).then((res: any) => setAreas(res));
    } else {
      setAreas([]);
      setCompanies([]);
    }
  }, [selectedCityId]);

  // Auto-select company if companyId param is present
  useEffect(() => {
    if (companyId) setSelectedCompany(companyId);
  }, [companyId]);

  useEffect(() => {
    if (selectedCompany) {
      axiosInstance.get(`/delivery/company/${selectedCompany}/areas`).then((res: any) => setSupportedAreas(res));
    }
  }, [selectedCompany]);

  const handleAdd = () => navigate(`/admin/delivery-company-areas/${selectedCompany}/add/${selectedCityId}`);
  const handleEdit = (areaId: string) => navigate(`/admin/delivery-company-areas/${selectedCompany}/edit/${areaId}`);
  const handleDelete = async (areaId: string) => {
    if (window.confirm("Remove this area from company?")) {
      await axiosInstance.delete(`/delivery/company/${selectedCompany}/area/${areaId}`);
      setSupportedAreas(supportedAreas.filter((a: any) => a.areaId !== areaId));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">אזורים נתמכים על ידי החברה</h2>
      <div className="mb-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">בחר עיר</label>
          <select
            className="border p-2 rounded w-full md:w-64"
            value={selectedCityId}
            onChange={e => setSelectedCityId(e.target.value)}
          >
            <option value="">בחר עיר</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.nameAR} / {city.nameHE}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">בחר חברה</label>
          <select
            className="border p-2 rounded w-full md:w-64"
            value={selectedCompany}
            onChange={e => setSelectedCompany(e.target.value)}
            disabled={!selectedCityId}
          >
            <option value="">בחר חברה</option>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>{c.nameAR} / {c.nameHE}</option>
            ))}
          </select>
        </div>
        {selectedCompany && (
          <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">הוסף אזור</button>
        )}
      </div>
      {selectedCompany && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">אזור</th>
                <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">מחיר</th>
                <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">זמן הגעה</th>
                <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-center">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {supportedAreas.map((a: any) => {
                const area = areas.find((ar: any) => ar._id === (a.areaId._id || a.areaId));
                return (
                  <tr key={a.areaId} className="border-t hover:bg-blue-50 transition">
                    <td className="px-4 py-2 text-right">{area ? area.name : a.areaId}</td>
                    <td className="px-4 py-2 text-right">{a.price}</td>
                    <td className="px-4 py-2 text-right">{a.eta}</td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleEdit(a.areaId)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">ערוך</button>
                        <button onClick={() => handleDelete(a.areaId)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">הסר</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompanyAreasList; 