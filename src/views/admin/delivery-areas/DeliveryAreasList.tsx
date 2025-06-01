import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "utils/http-interceptor";

interface City {
  _id: string;
  nameAR: string;
  nameHE: string;
}

const DeliveryAreasList = () => {
  const [areas, setAreas] = useState<Array<{ _id: string; name: string }>>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/delivery/cities").then((res: any) => setCities(res));
  }, []);

  useEffect(() => {
    if (selectedCityId) {
      axiosInstance.get(`/delivery/areas/by-city/${selectedCityId}`).then((res: any) => setAreas(res));
    } else {
      setAreas([]);
    }
  }, [selectedCityId]);

  const handleAdd = () => navigate(`/admin/delivery-areas/add/${selectedCityId}`);
  const handleEdit = (id: string) => navigate(`/admin/delivery-areas/edit/${id}/${selectedCityId}`);
  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this area?")) {
      await axiosInstance.delete(`/delivery/area/${id}`);
      setAreas(areas.filter(a => a._id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Delivery Areas</h2>

      </div>

      <div className="flex items-center gap-4">
          <select
            value={selectedCityId}
            onChange={e => setSelectedCityId(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city._id} value={city._id}>
                {city.nameAR} / {city.nameHE}
              </option>
            ))}
          </select>
          <button 
            onClick={handleAdd} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={!selectedCityId}
          >
            Add Area
          </button>
        </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {areas.map(area => (
              <tr key={area._id} className="border-t">
                <td className="px-4 py-2">{area.name}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleEdit(area._id)} className="text-blue-500 mr-2">Edit</button>
                  <button onClick={() => handleDelete(area._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryAreasList; 