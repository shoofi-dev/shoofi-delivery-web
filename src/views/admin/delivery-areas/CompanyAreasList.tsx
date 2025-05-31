import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "utils/http-interceptor";

const CompanyAreasList = () => {
  const { companyId } = useParams();
  const [companies, setCompanies] = useState<Array<{ _id: string; name: string }>>([]);
  const [areas, setAreas] = useState<Array<{ _id: string; name: string }>>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [supportedAreas, setSupportedAreas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/shoofiAdmin/delivery-companies").then((res: any) => setCompanies(res));
    axiosInstance.get("/delivery/areas").then((res: any) => setAreas(res));
  }, []);

  // Auto-select company if companyId param is present
  useEffect(() => {
    if (companyId) setSelectedCompany(companyId);
  }, [companyId]);

  useEffect(() => {
    if (selectedCompany) {
      axiosInstance.get(`/delivery/company/${selectedCompany}/areas`).then((res: any) => setSupportedAreas(res));
    }
  }, [selectedCompany]);

  const handleAdd = () => navigate(`/admin/delivery-company-areas/${selectedCompany}/add`);
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
      <div className="mb-4">
        <select
          className="border p-2 rounded"
          value={selectedCompany}
          onChange={e => setSelectedCompany(e.target.value)}
        >
          <option value="">Select Company</option>
          {companies.map((c: any) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        {selectedCompany && (
          <button onClick={handleAdd} className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">Add Area</button>
        )}
      </div>
      {selectedCompany && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">Area</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Min Order</th>
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
                    <td className="px-4 py-2">{a.minOrder}</td>
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