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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Company Supported Areas</h2>
      <div className="mb-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select City</label>
          <select
            className="border p-2 rounded w-full md:w-64"
            value={selectedCityId}
            onChange={e => setSelectedCityId(e.target.value)}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.nameAR} / {city.nameHE}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Company</label>
          <select
            className="border p-2 rounded w-full md:w-64"
            value={selectedCompany}
            onChange={e => setSelectedCompany(e.target.value)}
            disabled={!selectedCityId}
          >
            <option value="">Select Company</option>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>{c.nameAR} / {c.nameHE}</option>
            ))}
          </select>
        </div>
        {selectedCompany && (
          <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">Add Area</button>
        )}
      </div>
      {selectedCompany && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">Area</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">ETA</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {supportedAreas.map((a: any) => {
                const area = areas.find((ar: any) => ar._id === (a.areaId._id || a.areaId));
                return (
                  <tr key={a.areaId} className="border-t">
                    <td className="px-4 py-2">{area ? area.name : a.areaId}</td>
                    <td className="px-4 py-2">{a.price}</td>
                    <td className="px-4 py-2">{a.eta}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleEdit(a.areaId)} className="text-blue-500 mr-2">Edit</button>
                      <button onClick={() => handleDelete(a.areaId)} className="text-red-500">Remove</button>
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