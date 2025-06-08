import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../utils/http-interceptor';

interface City {
  _id: string;
  nameAR: string;
  nameHE: string;
}

interface CompanyForm {
  nameAR: string;
  nameHE: string;
  start: string;
  end: string;
  isStoreClose: boolean;
  isAlwaysOpen: boolean;
  coverageRadius: string;
  phone: string;
  email: string;
  status: boolean;
  image: File | null;
  supportedCities: string[];
}

const initialState: CompanyForm = { 
  nameAR: '',
  nameHE: '',
  start: '',
  end: '',
  isStoreClose: false,
  isAlwaysOpen: false,
  coverageRadius: '',
  phone: '',
  email: '',
  status: true,
  image: null,
  supportedCities: []
};

const DeliveryCompanyForm = () => {
  const [form, setForm] = useState<CompanyForm>(initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const navigate = useNavigate();
  const { id, cityId } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    fetchCities();
    if (cityId) {
      setForm(f => ({ ...f, cityId }));
    }
    if (isEdit) {
      axiosInstance.get<CompanyForm>(`/delivery/company/${id}`).then((res: any) => {
        setForm({ ...res, image: null });
      });
    }
  }, [id, cityId, isEdit]);

  const fetchCities = async () => {
    const res: any = await axiosInstance.get<City[]>('/delivery/cities');
    setCities(res);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(f => ({ ...f, [name]: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleMultiSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (value === 'all') {
      setForm(f => ({
        ...f,
        supportedCities: checked ? cities.map(city => city._id) : []
      }));
    } else {
      setForm(f => ({
        ...f,
        supportedCities: checked
          ? [...(f.supportedCities || []), value]
          : (f.supportedCities || []).filter(id => id !== value)
      }));
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(f => ({ ...f, image: file }));
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'image' && v) data.append('img', v);
      else if (k === 'supportedCities') data.append(k, JSON.stringify(v));
      else data.append(k, String(v));
    });
    if (isEdit) {
      await axiosInstance.post(`/delivery/company/update/${id}`, data);
    } else {
      await axiosInstance.post('/delivery/company/add', data);
    }
    navigate(`/admin/delivery-companies/city/${cityId}`);
  };

  return (
    <form className="bg-white rounded-xl shadow-lg p-6 mb-8" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">{isEdit ? 'ערוך' : 'הוסף'} חברת משלוחים</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
        <input name="nameAR" value={form.nameAR} onChange={handleChange} placeholder="שם בערבית" className="border p-2 rounded" required />
        <input name="nameHE" value={form.nameHE} onChange={handleChange} placeholder="שם בעברית" className="border p-2 rounded" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="טלפון" className="border p-2 rounded" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="אימייל" className="border p-2 rounded" />
        <input name="start" value={form.start} onChange={handleChange} placeholder="שעת התחלה (למשל 08:00)" className="border p-2 rounded" required />
        <input name="end" value={form.end} onChange={handleChange} placeholder="שעת סיום (למשל 22:00)" className="border p-2 rounded" required />
        <div className="col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            ערים נתמכות
          </label>
          <div className="border rounded p-4 max-h-60 overflow-y-auto">
            <label className="flex items-center space-x-2 mb-2 pb-2 border-b">
              <input
                type="checkbox"
                value="all"
                checked={form.supportedCities?.length === cities.length}
                onChange={handleMultiSelect}
                className="form-checkbox h-5 w-5 text-blue-600 ml-2"
              />
              <span className="font-semibold">בחר הכל</span>
            </label>
            <div className="space-y-2">
              {cities.map((city) => (
                <label key={city._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={city._id}
                    checked={form.supportedCities?.includes(city._id)}
                    onChange={handleMultiSelect}
                    className="form-checkbox h-5 w-5 text-blue-600 ml-2"
                  />
                  <span>{city.nameAR} / {city.nameHE}</span>
                </label>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">בחר את הערים שבהן החברה פועלת</p>
        </div>
        {/* <label className="flex items-center space-x-2">
          <input type="checkbox" name="isStoreClose" checked={form.isStoreClose} onChange={handleChange} className="form-checkbox h-5 w-5 text-blue-600 ml-2" />
          <span>חנות סגורה</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="isAlwaysOpen" checked={form.isAlwaysOpen} onChange={handleChange} className="form-checkbox h-5 w-5 text-blue-600 ml-2" />
          <span>פתוח תמיד</span>
        </label> */}
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="status" checked={form.status} onChange={handleChange} className="form-checkbox h-5 w-5 text-blue-600 ml-2" />
          <span>סטטוס (פעיל)</span>
        </label>
        <div>
          <label>תמונה:</label>
          <input type="file" accept="image/*" onChange={handleImage} />
          {imagePreview && <img src={imagePreview} alt="תצוגה מקדימה" className="h-16 mt-2" />}
        </div>
      </div>
      <button type="submit" className="mt-6 bg-blue-500 text-white px-6 py-2 rounded">{isEdit ? 'עדכן' : 'הוסף'} חברה</button>
    </form>
  );
};

export default DeliveryCompanyForm; 