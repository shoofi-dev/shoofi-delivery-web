import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "utils/http-interceptor";
import { toast } from "react-toastify";
import { getCategoriesListApi } from "apis/admin/category/get-categories";
import { cdnUrl } from "consts/shared";
import StoreData from './StoreData';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

interface StoreFormData {
  appName: string;
  name_ar: string;
  name_he: string;
  business_visible: boolean;
  categoryIds: string[];
  supportedCities: string[];
  lat?: number;
  lng?: number;
  descriptionAR?: string;
  descriptionHE?: string;
}

// Add this regex for validation
const appNameRegex = /^[a-z]+(-[a-z]+)*$/;

const defaultCenter = { lat: 32.11453261988036, lng: 34.97186886900658 };
const mapContainerStyle = { width: '100%', height: '300px' };

export default function StoreForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState<StoreFormData>({
    appName: "",
    name_ar: "",
    name_he: "",
    business_visible: true,
    categoryIds: [],
    supportedCities: [],
    descriptionAR: "",
    descriptionHE: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<any>();
  const [coverFiles, setCoverFiles] = useState<File[]>([]);
  const [coverPreviews, setCoverPreviews] = useState<string[]>([]);
  const [existingCoverSliders, setExistingCoverSliders] = useState<string[]>([]);
  const [appNameError, setAppNameError] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [citiesError, setCitiesError] = useState("");
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
  });

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
      const lat = store.location && Array.isArray(store.location.coordinates) ? store.location.coordinates[1] : store.lat;
      const lng = store.location && Array.isArray(store.location.coordinates) ? store.location.coordinates[0] : store.lng;
      setFormData({
        appName: store.appName,
        name_ar: store.name_ar || "",
        name_he: store.name_he || "",
        business_visible: store.business_visible ?? true,
        categoryIds: store.categoryIds || [],
        supportedCities: store.supportedCities,
        lat,
        lng,
        descriptionAR: store.descriptionAR || "",
        descriptionHE: store.descriptionHE || "",
      });
      if (lat && lng) {
        setLocation({ lat, lng });
      }
      if (store.storeLogo) {
        setLogoPreview( store.storeLogo.uri);
      }
      if (store.cover_sliders && store.cover_sliders.length > 0) {
        const coverUrls = store.cover_sliders.map((slider: any) => slider.uri);
        setExistingCoverSliders(coverUrls);
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

  const handleCoverImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setCoverFiles(prev => [...prev, ...newFiles]);
      
      // Create previews for new files
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setCoverPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeCoverImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      setExistingCoverSliders(prev => prev.filter((_, i) => i !== index));
    } else {
      setCoverFiles(prev => prev.filter((_, i) => i !== index));
      setCoverPreviews(prev => prev.filter((_, i) => i !== index));
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
    // Clear error when cities are selected/deselected
    setCitiesError("");
  };

  const handleCityChange = (cityId: string) => {
    setFormData(prev => ({
      ...prev,
      supportedCities: prev.supportedCities.includes(cityId)
        ? prev.supportedCities.filter(id => id !== cityId)
        : [...prev.supportedCities, cityId]
    }));
    // Clear error when cities are selected
    setCitiesError("");
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
  };

  const handleAppNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || appNameRegex.test(value)) {
      setAppNameError("");
    } else {
      setAppNameError("שם חייב להכיל אותיות באנגלית קטנות ומקפים בלבד (למשל: kbc, k-b-c, store-name)");
    }
    handleChange(e);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (appNameError) {
      e?.preventDefault();
      return;
    }
    console.log("formData.supportedCities", formData.supportedCities);
    // Validate that at least one city is selected
    if (formData.supportedCities.length === 0) {
      setCitiesError("יש לבחור לפחות עיר אחת");
      e?.preventDefault();
      return;
    }
    
    e?.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("appName", formData.appName);
      formDataToSend.append("name_ar", formData.name_ar);
      formDataToSend.append("name_he", formData.name_he);
      formDataToSend.append("descriptionAR", formData.descriptionAR || "");
      formDataToSend.append("descriptionHE", formData.descriptionHE || "");
      formDataToSend.append("business_visible", formData.business_visible.toString());
      formDataToSend.append("categoryIds", JSON.stringify(formData.categoryIds));
      formDataToSend.append("supportedCities", JSON.stringify(formData.supportedCities));
      if (location) {
        formDataToSend.append("lat", String(location.lat));
        formDataToSend.append("lng", String(location.lng));
      }
      if (logo) {
        formDataToSend.append("logo", logo);
      }

      // Append new cover images
      coverFiles.forEach((file) => {
        formDataToSend.append("cover_sliders", file);
      });

      // Append existing cover slider URLs
      existingCoverSliders.forEach((url) => {
        formDataToSend.append("existing_cover_sliders", url);
      });

      if (id) {
        await axiosInstance.post(`/shoofiAdmin/store/update/${id}`, formDataToSend);
        toast.success("Store updated successfully");
      } else {
        await axiosInstance.post("/shoofiAdmin/store/add", formDataToSend);
        toast.success("Store added successfully");
      }
      //await fetchStore();
       navigate("/admin/stores");
    } catch (error) {
      console.error("Error saving store:", error);
      toast.error("Failed to save store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="font-semibold text-base text-blueGray-700">
              {id ? "עריכת חנות" : "הוספת חנות"}
            </h3>
          </div>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-md font-bold mb-2">
                  מזהה חנות
                </label>
                <input
                  type="text"
                  name="appName"
                  value={formData.appName}
                  onChange={handleAppNameChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  required
                />
                {appNameError && (
                  <div className="text-red-600 text-sm mt-1">{appNameError}</div>
                )}
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-md font-bold mb-2">
                  שם (ערבית)
                </label>
                <input
                  type="text"
                  name="name_ar"
                  value={formData.name_ar}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  required
                />
              </div>
            </div>
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-md font-bold mb-2">
                  שם (עברית)
                </label>
                <input
                  type="text"
                  name="name_he"
                  value={formData.name_he}
                  onChange={handleChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  required
                />
                <label className="block uppercase text-blueGray-600 text-md font-bold mb-2 mt-4">
                  תיאור החנות (עברית)
                </label>
                <textarea
                  name="descriptionHE"
                  value={formData.descriptionHE}
                  onChange={handleDescriptionChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  rows={3}
                  placeholder="הזן תיאור החנות בעברית"
                />
                <label className="block uppercase text-blueGray-600 text-md font-bold mb-2 mt-4">
                  תיאור החנות (ערבית)
                </label>
                <textarea
                  name="descriptionAR"
                  value={formData.descriptionAR}
                  onChange={handleDescriptionChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  rows={3}
                  placeholder="הזן תיאור החנות בערבית"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-md font-bold mb-2">
                  מוצג ללקוחות
                </label>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    name="business_visible"
                    checked={formData.business_visible}
                    onChange={(e) => setFormData(prev => ({ ...prev, business_visible: e.target.checked }))}
                    className="form-checkbox h-4 w-4 text-blue-600 ml-2"
                  />
                  <span className="ml-2 text-sm">מוצג ללקוחות</span>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-md font-bold mb-2">
                  קטגוריות
                </label>
                <div className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {categories.map((category: any) => (
                      <label key={category._id} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.categoryIds.includes(category._id)}
                          onChange={() => handleCategoryChange(category._id)}
                          className="form-checkbox h-4 w-4 text-blue-600 ml-2"
                        />
                        <span className="ml-2 text-sm">{category.nameHE}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-md font-bold mb-2">
                  הערים שתומכות בחנות
                </label>
                <div className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                  <div className="mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.supportedCities.length === cities.length}
                        onChange={handleSelectAll}
                        className="form-checkbox h-4 w-4 text-blue-600 ml-2"
                      />
                      <span className="ml-2 text-sm">בחר הכל</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {cities.map((city: any) => (
                      <label key={city._id} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.supportedCities.includes(city._id)}
                          onChange={() => handleCityChange(city._id)}
                          className="form-checkbox h-4 w-4 text-blue-600 ml-2"
                        />
                        <span className="ml-2 text-sm">{city.nameAR}</span>
                      </label>
                    ))}
                  </div>
                  {citiesError && (
                    <div className="text-red-600 text-sm mt-2">{citiesError}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-md font-bold mb-2">
                  לוגו חנות
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
                {logoPreview && (
                  <img
                  src={logoPreview && logoPreview.startsWith("blob:") ? logoPreview : cdnUrl + logoPreview}
                  alt="Logo Preview"
                    className="mt-2 h-20 w-20 object-contain"
                  />
                )}
               
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-md font-bold mb-2">
                  תמונות כיסוי
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleCoverImagesChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {coverPreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative">
                      <img
                        src={ preview}
                        alt={`Cover ${index + 1}`}
                        className="h-32 w-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeCoverImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                  {existingCoverSliders.map((url, index) => (
                    <div key={`existing-${index}`} className="relative">
                      <img
                        src={cdnUrl + url}
                        alt={`Existing Cover ${index + 1}`}
                        className="h-32 w-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeCoverImage(index, true)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full px-4 mb-6">
              <label className="block uppercase text-blueGray-600 text-md font-bold mb-2">
                מיקום חנות על המפה
              </label>
              {loadError && <div>שגיאה בטעינת המפה</div>}
              {!isLoaded ? (
                <div>טוען מפה...</div>
              ) : (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={location || defaultCenter}
                  zoom={15}
                  onClick={e => {
                    if (e.latLng) {
                      setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                    }
                  }}
                >
                  {location && <Marker position={location} />}
                </GoogleMap>
              )}
              {location && (
                <div className="mt-2 text-sm text-gray-600">
                  Lat: {location.lat}, Lng: {location.lng}
                </div>
              )}
            </div>
          </div>
          {!id && <div className="flex justify-end space-x-4 gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/stores')}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'שמירה...' : 'שמירה'}
            </button>
          </div>}
        </form>

        {/* Store Data Section */}
        {formData.appName && id && <div className="mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">הגדרות חנות</h2>
            <StoreData 
              logo={logo}
              name_ar={formData.name_ar}
              name_he={formData.name_he}
              appName={formData.appName}
              storeLogo={logoPreview}
              cover_sliders={[...existingCoverSliders, ...coverPreviews]}
              handleStoreFormSubmit={handleSubmit}
              location={location || { lat: 0, lng: 0 }}
              descriptionAR={formData.descriptionAR}
              descriptionHE={formData.descriptionHE}
            />
          </div>
        </div>}
      </div>
    </div>
  );
} 