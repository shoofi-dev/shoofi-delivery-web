import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GoogleMapPicker from '../../../components/Maps/GoogleMapPicker';
import { axiosInstance } from 'utils/http-interceptor';

const initialState = {
  name: '', nameAR: '', nameHE: '', start: '', end: '', isStoreClose: false, isAlwaysOpen: false, id: '', location: { type: 'Point', coordinates: [0, 0] }, coverageRadius: '', phone: '', email: '', status: true, order: '', image: null
};

const DeliveryCompanyForm = () => {
  const [form, setForm] = useState(initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      axiosInstance.get(`/shoofiAdmin/delivery-company/${id}`).then((res: any) => {
        console.log("res", res)
        setForm({ ...res, image: null });
        setImagePreview(res.image.uri);
      });
    }
  }, [id, isEdit]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleMapChange = (lng: number, lat: number) => {
    setForm(f => ({ ...f, location: { type: 'Point', coordinates: [lng, lat] } }));
  };

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    setForm(f => ({ ...f, image: file }));
    setImagePreview(file ? URL.createObjectURL(file) : null as any);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'image' && v) data.append('img', v as any);
      else if (k === 'location') data.append('location', JSON.stringify(v));
      else data.append(k, v as any);
    });
    if (isEdit) {
      await axiosInstance.post(`/shoofiAdmin/delivery-company/update/${id}`, data);
    } else {
      await axiosInstance.post('/shoofiAdmin/delivery-company/add', data);
    }
    navigate('/admin/delivery-companies');
  };

  return (
    <form className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit' : 'Add'} Delivery Company</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2 rounded" required />
        <input name="nameAR" value={form.nameAR} onChange={handleChange} placeholder="Name (AR)" className="border p-2 rounded" required />
        <input name="nameHE" value={form.nameHE} onChange={handleChange} placeholder="Name (HE)" className="border p-2 rounded" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
        <input name="start" value={form.start} onChange={handleChange} placeholder="Start Time (e.g. 08:00)" className="border p-2 rounded" required />
        <input name="end" value={form.end} onChange={handleChange} placeholder="End Time (e.g. 22:00)" className="border p-2 rounded" required />
        <input name="id" value={form.id} onChange={handleChange} placeholder="Company ID" className="border p-2 rounded" required />
        <input name="order" value={form.order} onChange={handleChange} placeholder="Order" className="border p-2 rounded" type="number" />
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="isStoreClose" checked={form.isStoreClose} onChange={handleChange} />
          <span>Is Store Close</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="isAlwaysOpen" checked={form.isAlwaysOpen} onChange={handleChange} />
          <span>Is Always Open</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="status" checked={form.status} onChange={handleChange} />
          <span>Status (Active)</span>
        </label>
        <div>
          <label>Image:</label>
          <input type="file" accept="image/*" onChange={handleImage} />
          {imagePreview && <img src={imagePreview} alt="Preview" className="h-16 mt-2" />}
        </div>
      </div>
      <div className="mt-4">
        <label className="block mb-2 font-semibold">Location & Coverage Radius (drag marker or resize circle):</label>
        <GoogleMapPicker
          lng={form.location.coordinates[0]}
          lat={form.location.coordinates[1]}
          radius={Number(form.coverageRadius) || 1000}
          onChange={handleMapChange}
          onRadiusChange={(r: number) => setForm(f => ({ ...f, coverageRadius: r.toString() }))}
        />
        <div className="text-sm mt-2">
          Lng: {form.location.coordinates[0]}, Lat: {form.location.coordinates[1]}, Radius: {form.coverageRadius} meters
        </div>
      </div>
      <button type="submit" className="mt-6 bg-blue-500 text-white px-6 py-2 rounded">{isEdit ? 'Update' : 'Add'} Company</button>
    </form>
  );
};

export default DeliveryCompanyForm; 