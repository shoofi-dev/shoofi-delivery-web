import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "utils/http-interceptor";
import CitySelect from "components/admin/CitySelect";
import clsx from "clsx";
import CityAreasMapModal from "./CityAreasMapModal";

interface City {
  _id: string;
  nameAR: string;
  nameHE: string;
}

const DeliveryAreasList = () => {
  const [areas, setAreas] = useState<Array<{ _id: string; name: string; geometry: any }>>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [selectedCityName, setSelectedCityName] = useState<string>("");
  const [showMapModal, setShowMapModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCityId) {
      axiosInstance.get(`/delivery/areas/by-city/${selectedCityId}`).then((res: any) => setAreas(res));
      // Fetch city name for modal title
      axiosInstance.get(`/delivery/city/${selectedCityId}`).then((res: any) => setSelectedCityName(res.nameHE || ""));
    } else {
      setAreas([]);
      setSelectedCityName("");
    }
  }, [selectedCityId]);

  const handleAdd = () => navigate(`/admin/delivery-areas/add/${selectedCityId}`);
  const handleEdit = (id: string) => navigate(`/admin/delivery-areas/edit/${id}/${selectedCityId}`);
  const handleDelete = async (id: string) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את האזור?")) {
      await axiosInstance.delete(`/delivery/area/${id}`);
      setAreas(areas.filter(a => a._id !== id));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">אזורי משלוח</h2>
      </div>
      <div className="flex items-center justify-between mb-4">
        <CitySelect
          value={selectedCityId}
          onChange={setSelectedCityId}
        />
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className={clsx('bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600', !selectedCityId && 'opacity-50 cursor-not-allowed')}
            disabled={!selectedCityId}
          >
            הוסף אזור
          </button>
          <button
            onClick={() => setShowMapModal(true)}
            className={clsx('bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600', !selectedCityId && 'opacity-50 cursor-not-allowed')}
            disabled={!selectedCityId}
          >
            הצג אזורים על מפה
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-right">שם</th>
              <th className="px-4 py-2 bg-blueGray-50 text-blueGray-500 uppercase text-xs font-semibold border-b text-center">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {areas.map(area => (
              <tr key={area._id} className="border-t hover:bg-blue-50 transition">
                <td className="px-4 py-2 text-right">{area.name}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => handleEdit(area._id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">ערוך</button>
                    <button onClick={() => handleDelete(area._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">הסר</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CityAreasMapModal
        open={showMapModal}
        onClose={() => setShowMapModal(false)}
        areas={areas}
        cityName={selectedCityName}
      />
    </div>
  );
};

export default DeliveryAreasList; 