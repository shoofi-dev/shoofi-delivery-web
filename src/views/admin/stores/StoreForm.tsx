import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "utils/http-interceptor";
import { toast } from "react-toastify";
import { getCategoriesListApi } from "apis/admin/category/get-categories";
import { cdnUrl } from "consts/shared";

interface StoreFormData {
  storeName: string;
  appName: string;
  categoryIds: string[];
  supportedCities: string[];
}

export default function StoreForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState<StoreFormData>({
    storeName: "",
    appName: "",
    categoryIds: [],
    supportedCities: [],
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<any>();

  useEffect(() => {
    fetchCategories();
    fetchCities();
    if (id) {
      fetchStore();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
        getCategoriesListApi().then((res: any) => {
            setCategories(res);
        });
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  const fetchCities = async () => {
    try {
      const response: any = await axiosInstance.get("/delivery/cities");
      setCities(response);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Failed to fetch cities");
    }
  };

  const fetchStore = async () => {
    try {
      const response: any = await axiosInstance.get(`/shoofiAdmin/store/${id}`);
      const store = response;
      setFormData({
        storeName: store.storeName,
        appName: store.appName,
        categoryIds: store.categoryIds || [],
        supportedCities: store.supportedCities,
      });
      if (store.storeLogo) {
        setLogoPreview(cdnUrl + store.storeLogo.uri);
      }
    } catch (error) {
      console.error("Error fetching store:", error);
      toast.error("Failed to fetch store details");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFormData(prev => ({
        ...prev,
        supportedCities: cities.map((city: any) => city._id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        supportedCities: []
      }));
    }
  };

  const handleCityChange = (cityId: string) => {
    setFormData(prev => ({
      ...prev,
      supportedCities: prev.supportedCities.includes(cityId)
        ? prev.supportedCities.filter(id => id !== cityId)
        : [...prev.supportedCities, cityId]
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("storeName", formData.storeName);
      formDataToSend.append("appName", formData.appName);
      formDataToSend.append("categoryIds", JSON.stringify(formData.categoryIds));
      formDataToSend.append("supportedCities", JSON.stringify(formData.supportedCities));
      if (logo) {
        formDataToSend.append("img", logo);
      }

      if (id) {
        await axiosInstance.post(`/shoofiAdmin/store/update/${id}`, formDataToSend);
        toast.success("Store updated successfully");
      } else {
        await axiosInstance.post("/shoofiAdmin/store/add", formDataToSend);
        toast.success("Store added successfully");
      }

      navigate("/admin/stores");
    } catch (error) {
      console.error("Error saving store:", error);
      toast.error("Failed to save store");
    } finally {
      setLoading(false);
    }
  };
  console.log("cities",cities)
  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="font-semibold text-base text-blueGray-700">
              {id ? "Edit Store" : "Add New Store"}
            </h3>
          </div>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  required
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  App Name
                </label>
                <input
                  type="text"
                  name="appName"
                  value={formData.appName}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  required
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Categories
                </label>
                <div className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {categories.map((category: any) => (
                      <label key={category._id} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.categoryIds.includes(category._id)}
                          onChange={() => handleCategoryChange(category._id)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Supported Cities
                </label>
                <div className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                  <div className="mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.supportedCities.length === cities.length}
                        onChange={handleSelectAll}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm">Select All</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {cities.map((city: any) => (
                      <label key={city._id} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.supportedCities.includes(city._id)}
                          onChange={() => handleCityChange(city._id)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm">{city.nameAR}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Store Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="mt-2 h-20 w-20 object-contain"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/stores")}
              className="bg-gray-500 text-white active:bg-gray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white active:bg-blue-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 