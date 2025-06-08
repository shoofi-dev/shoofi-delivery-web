import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "utils/http-interceptor";

interface City {
  _id: string;
  nameAR: string;
  nameHE: string;
}

interface Area {
  _id: string;
  name: string;
}

interface AreaForm {
  areaId: string;
  price: number;
  eta: number;
}

const CompanyAreaForm = () => {
  const { companyId, id, cityId } = useParams();
  const navigate = useNavigate();
  const [areas, setAreas] = useState<Area[]>([]);
  const [companyAreas, setCompanyAreas] = useState<string[]>([]);
  const [formData, setFormData] = useState<AreaForm>({
    areaId: "",
    price: 0,
    eta: 0
  });

  useEffect(() => {
    if (cityId) {
      axiosInstance.get(`/delivery/areas/by-city/${cityId}`).then((res: any) => setAreas(res));
    }
  }, [cityId]);

  useEffect(() => {
    if (companyId) {
      axiosInstance.get(`/delivery/company/${companyId}/areas`).then((res: any) => {
        const existingAreaIds = res.map((area: any) => area.areaId._id || area.areaId);
        setCompanyAreas(existingAreaIds);
      });
    }
  }, [companyId]);

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/delivery/company/${companyId}/area/${id}`).then((res: any) => {
        setFormData({
          areaId: res.areaId,
          price: res.price,
          eta: res.eta
        });
      });
    }
  }, [id, companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await axiosInstance.post(`/delivery/company/${companyId}/area/update/${id}`, formData);
    } else {
      await axiosInstance.post(`/delivery/company/${companyId}/area/add`, formData);
    }
    navigate(`/admin/delivery-company-areas/${companyId}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "areaId" ? value : Number(value)
    }));
  };

  // Filter out areas that the company already has
  const availableAreas = areas.filter(area => 
    !companyAreas.includes(area._id) || area._id === formData.areaId
  );

  return (
    <div className=" mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">{id ? "ערוך" : "הוסף"} אזור לחברה</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">אזור</label>
          <select
            name="areaId"
            value={formData.areaId}
            onChange={handleChange}
            className="mt-1 max-w-lg block w-full border border-gray-300 rounded-md shadow-sm p-2 rtl-select"
            required
          >
            <option value="">בחר אזור</option>
            {availableAreas.map(area => (
              <option key={area._id} value={area._id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">מחיר</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">זמן משלוח (דקות)</label>
          <input
            type="number"
            name="eta"
            value={formData.eta}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            min="0"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">שמור</button>
      </form>
    </div>
  );
};

export default CompanyAreaForm; 