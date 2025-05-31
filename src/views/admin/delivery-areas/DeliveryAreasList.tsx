import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "utils/http-interceptor";

const DeliveryAreasList = () => {
  const [cities, setCities] = useState<Array<{ _id: string; nameAR: string; nameHE: string, geometry: any }>>([]);
  const [cityId, setCityId] = useState("");
  const [areas, setAreas] = useState<Array<{ _id: string; name: string; cityId?: string }>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/delivery/cities").then((res: any) => setCities(res));
  }, []);

  useEffect(() => {
    if (cityId) {
      axiosInstance.get("/delivery/areas").then((res: any) => setAreas(res.filter((a: any) => a.cityId === cityId)));
    } else {
      setAreas([]);
    }
  }, [cityId]);

  const handleAdd = () => navigate(`/admin/delivery-areas/add`);
  const handleEdit = (id: string) => navigate(`/admin/delivery-areas/edit/${id}/${cityId}`);
  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this delivery area?")) {
      await axiosInstance.delete(`/delivery/area/${id}`);
      setAreas(areas.filter(area => area._id !== id));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Delivery Areas</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">City</label>
        <select
          value={cityId}
          onChange={e => setCityId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select City</option>
          {cities.map(city => (
            <option key={city._id} value={city._id}>{city.nameAR}</option>
          ))}
        </select>
        <button onClick={handleAdd} style={{ zIndex: 1000, position: 'relative', pointerEvents: 'auto' }} className="ml-4 bg-blue-500 text-white px-4 py-2 rounded" disabled={!cityId}>Add Area</button>
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