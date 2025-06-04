import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from 'utils/http-interceptor';
import { toast } from 'react-toastify';
import { cdnUrl } from 'consts/shared';

const DEFAULT_APP_NAME = process.env.REACT_APP_APP_NAME || '';

const StoreCategoryForm: React.FC = () => {
  const { id, appName } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<{ nameAR: string; nameHE: string; img: File | null }>({ nameAR: '', nameHE: '', img: null });
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(id);
  const appNameHeader = appName || DEFAULT_APP_NAME;

  useEffect(() => {
    console.log("isEditMode",isEditMode)
    if (isEditMode) {
      fetchCategory();
    }
  }, [id, appName]);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const res:any = await axiosInstance.get('/store-category/all', {
        headers: { 'app-name': appNameHeader },
      });
      const cat = res.find((c: any) => (c._id?.$oid || c._id) === id);
      console.log("cat",cat)
      if (cat) {
        setForm({ nameAR: cat.nameAR, nameHE: cat.nameHE, img: null });
        if (cat.img && cat.img.length > 0) {
          setImgPreview(`${cdnUrl}${cat.img[0].uri}`);
        }
      }
    } catch (err) {
      console.log("err",err)
      toast.error('Failed to fetch category');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, img: e.target.files[0] });
      setImgPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('nameAR', form.nameAR);
      data.append('nameHE', form.nameHE);
      if (form.img) data.append('img', form.img);
      if (isEditMode) {
        await axiosInstance.post(`/store-category/update/${id}`, data, {
          headers: { 'app-name': appNameHeader, 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Category updated');
      } else {
        await axiosInstance.post('/store-category/add', data, {
          headers: { 'app-name': appNameHeader, 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Category added');
      }
      navigate(appName ? `/admin/store-categories/${appName}` : '/admin/store-categories');
    } catch (err) {
      toast.error('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'ערוך' : 'הוסף'} קטגוריה</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold">שם (ערבית)</label>
          <input
            type="text"
            name="nameAR"
            value={form.nameAR}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">שם (עברית)</label>
          <input
            type="text"
            name="nameHE"
            value={form.nameHE}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">תמונה</label>
          <input type="file" accept="image/*" onChange={handleImage} />
          {imgPreview && (
            <img src={imgPreview} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded" />
          )}
        </div>
        <div className="flex justify-end space-x-4 gap-4">
          <button
            type="button"
            onClick={() => navigate(appName ? `/admin/store-categories/${appName}` : '/admin/store-categories')}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            ביטול
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'שמיר...' : 'שמיר'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreCategoryForm; 