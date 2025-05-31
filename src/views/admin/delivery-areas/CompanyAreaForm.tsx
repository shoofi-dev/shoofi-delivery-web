import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "utils/http-interceptor";

const CompanyAreaForm = () => {
  const { companyId, id } = useParams();
  const navigate = useNavigate();
  const [areas, setAreas] = useState<Array<{ _id: string; name: string }>>([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [price, setPrice] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [eta, setEta] = useState("");
  const [assignedAreaIds, setAssignedAreaIds] = useState<string[]>([]);

  useEffect(() => {
    axiosInstance.get("/delivery/areas").then((res: any) => setAreas(res));
    // Fetch assigned areas for this company
    axiosInstance.get(`/delivery/company/${companyId}/areas`).then((res: any) => {
      setAssignedAreaIds(res.map((a: any) => (a.areaId._id || a.areaId)));
    });
    if (id) {
      axiosInstance.get(`/delivery/company/${companyId}/area/${id}`).then((res: any) => {
        setSelectedArea(res.areaId);
        setPrice(res.price);
        setMinOrder(res.minOrder);
        setEta(res.eta);
      });
    }
  }, [companyId, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { areaId: selectedArea, price, minOrder, eta };
    if (id) {
      await axiosInstance.post(`/delivery/company/${companyId}/area/update/${id}`, data);
    } else {
      await axiosInstance.post(`/delivery/company/${companyId}/area/add`, data);
    }
    navigate(`/admin/delivery-company-areas/${companyId}`);
  };

  // Filter out already assigned areas, except the one being edited
  const availableAreas = areas.filter(area =>
    !assignedAreaIds.includes(area._id) || area._id === selectedArea
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{id ? "Edit" : "Add"} Company Supported Area</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Area</label>
          <select
            value={selectedArea}
            onChange={e => setSelectedArea(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">Select Area</option>
            {availableAreas.map(area => (
              <option key={area._id} value={area._id}>{area.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Min Order</label>
          <input
            type="number"
            value={minOrder}
            onChange={e => setMinOrder(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">ETA</label>
          <input
            type="text"
            value={eta}
            onChange={e => setEta(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
      </form>
    </div>
  );
};

export default CompanyAreaForm; 