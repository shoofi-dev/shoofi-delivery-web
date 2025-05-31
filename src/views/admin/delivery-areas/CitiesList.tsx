import React, { useEffect, useState } from "react";
import { axiosInstance } from "utils/http-interceptor";
import { useNavigate } from "react-router-dom";

const CitiesList = () => {
  const [cities, setCities] = useState<Array<{ _id: string; nameAR: string; nameHE: string, geometry: any }>>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchCities = async () => {
    const res: any = await axiosInstance.get("/delivery/cities");
    setCities(res);
  };

  useEffect(() => { fetchCities(); }, []);

  const handleAdd = () => {
    navigate("/admin/cities/add");
  };

  const handleEdit = (city: { _id: string; nameAR: string; nameHE: string; geometry: any }) => {
    navigate(`/admin/cities/edit/${city._id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this city?")) {
      await axiosInstance.delete(`/delivery/city/${id}`);
      fetchCities();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await axiosInstance.post(`/delivery/city/update/${editId}`, { nameAR: name, nameHE: name, geometry: null });
    } else {
      await axiosInstance.post("/delivery/city/add", { nameAR: name, nameHE: name, geometry: null });
    }
    setShowForm(false);
    setName("");
    setEditId(null);
    fetchCities();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Cities</h2>
      <button onClick={handleAdd} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">Add City</button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 flex items-center space-x-2">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="City Name"
            className="border p-2 rounded"
            required
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">{editId ? "Update" : "Add"}</button>
          <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
        </form>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map(city => (
              <tr key={city._id} className="border-t">
                <td className="px-4 py-2">{city.nameAR}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleEdit(city)} className="text-blue-500 mr-2">Edit</button>
                  <button onClick={() => handleDelete(city._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CitiesList; 