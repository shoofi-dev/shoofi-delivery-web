import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from 'utils/http-interceptor';
import { cdnUrl } from "consts/shared";

interface StoreDataProps {
  logo: File | null;
  name_ar: string;
  name_he: string;
  appName: string;
  storeLogo: string;
  cover_sliders: string[];
  handleStoreFormSubmit: (e?: React.FormEvent) => void;
  location: {
    lat: number;
    lng: number;
  };
  descriptionAR?: string;
  descriptionHE?: string;
}

interface StoreDataForm {
  _id?: string;
  id?: number;
  delivery_support: boolean;
  takeaway_support: boolean;
  cash_support: boolean;
  creditcard_support: boolean;
  day: string;
  delivery_price: number;
  order_company_delta_minutes: number;
  isOrderLaterSupport: boolean;
  orderNowEndTime: string;
  orderLaterEndTime: string;
  minTimeToOrder: number;
  phone: string;
  address: string;
  minReady?: number;
  maxReady?: number;
}

const weekDays = [
  { key: 'sunday', label: 'ראשון' },
  { key: 'monday', label: 'שני' },
  { key: 'tuesday', label: 'שלישי' },
  { key: 'wednesday', label: 'רביעי' },
  { key: 'thursday', label: 'חמישי' },
  { key: 'friday', label: 'שישי' },
  { key: 'saturday', label: 'שבת' },
];

const defaultOpenHours = {
  sunday:    { isOpen: true,  start: "10:00", end: "22:00" },
  monday:    { isOpen: true,  start: "10:00", end: "22:00" },
  tuesday:   { isOpen: true,  start: "10:00", end: "22:00" },
  wednesday: { isOpen: true,  start: "10:00", end: "22:00" },
  thursday:  { isOpen: true,  start: "10:00", end: "22:00" },
  friday:    { isOpen: false, start: "10:00", end: "16:00" },
  saturday:  { isOpen: false, start: "10:00", end: "16:00" },
};

const StoreData: React.FC<StoreDataProps> = ({
  logo,
  name_ar,
  name_he,
  appName,
  storeLogo,
  cover_sliders,
  handleStoreFormSubmit,
  location,
  descriptionAR,
  descriptionHE
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<StoreDataForm & { openHours: { [key: string]: { isOpen: boolean; start: string; end: string } } }>({
    delivery_support: true,
    takeaway_support: true,
    cash_support: true,
    creditcard_support: true,
    day: 'Sunday',
    delivery_price: 0,
    order_company_delta_minutes: 0,
    isOrderLaterSupport: false,
    orderNowEndTime: '23:00',
    orderLaterEndTime: '23:59',
    minTimeToOrder: 60,
    phone: '',
    address: '',
    openHours: defaultOpenHours,
    minReady: undefined,
    maxReady: undefined,
  });

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const response: any = await axiosInstance.get(`/store/get/${appName}`);
      if(response){
        setFormData({
          ...response,
          openHours: response.openHours || defaultOpenHours,
          cover_sliders: response.cover_sliders || []
        });
        setShowForm(true);
        setIsEditMode(true);
      }else{
        console.log("no response");
        setShowForm(false);
        setIsEditMode(false);
      }
    } catch (error) {
      toast.error('Failed to fetch store data');
      console.error('Error fetching store data:', error);
      setShowForm(false);
      setIsEditMode(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleOpenHourChange = (dayKey: string, field: 'isOpen' | 'start' | 'end', value: any) => {
    setFormData(prev => ({
      ...prev,
      openHours: {
        ...prev.openHours,
        [dayKey]: {
          ...prev.openHours[dayKey],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    await handleStoreFormSubmit(e);
    e.preventDefault();
    try {
      setLoading(true);
      
      // Create the data object
      const dataToSend = {
        ...formData,
        appName,
        name_ar,
        name_he,
        storeLogo,
        cover_sliders: cover_sliders || [],
        location,
        descriptionAR,
        descriptionHE
      };

      if (isEditMode) {
        await axiosInstance.post(`/store/update`, dataToSend,{headers: {
          'app-name': appName || ''
        }});
        toast.success('Store data updated successfully');
      } else {
        await axiosInstance.post('/store/add', dataToSend);
        toast.success('Store data added successfully');
      }
       navigate('/admin/stores');
    } catch (error) {
      toast.error('Failed to save store data');
      console.error('Error saving store data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="flex justify-center items-center py-8">
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          צור הגדרות חנות
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'ערוך נתוני חנות' : 'הוסף נתוני חנות'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* Support Options */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">אפשרויות תמיכה</h2>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="delivery_support"
                name="delivery_support"
                checked={formData.delivery_support}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 ml-2"
              />
              <label htmlFor="delivery_support">תמיכה במשלוחים</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="takeaway_support"
                name="takeaway_support"
                checked={formData.takeaway_support}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 ml-2"
              />
              <label htmlFor="takeaway_support">תמיכה באיסוף עצמי</label>
            </div>
          </div>

          {/* Payment Options */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">אפשרויות תשלום</h2>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="cash_support"
                name="cash_support"
                checked={formData.cash_support}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 ml-2"
              />
              <label htmlFor="cash_support">תשלום במזומן</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="creditcard_support"
                name="creditcard_support"
                checked={formData.creditcard_support}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 ml-2"
              />
              <label htmlFor="creditcard_support">תשלום בכרטיס אשראי</label>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">שעות פעילות</h2>
            <div className="space-y-2">
              <label className="block mb-2 font-semibold">שעות פתיחה לכל יום</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {weekDays.map(day => (
                  <div key={day.key} className="flex items-center space-x-2 border p-2 rounded">
                    <input
                      type="checkbox"
                      checked={formData.openHours[day.key]?.isOpen}
                      onChange={e => handleOpenHourChange(day.key, 'isOpen', e.target.checked)}
                      className="form-checkbox h-5 w-5 ml-2"
                    />
                    <span className="w-16">{day.label}</span>
                    <input
                      type="time"
                      value={formData.openHours[day.key]?.start}
                      onChange={e => handleOpenHourChange(day.key, 'start', e.target.value)}
                      className="w-28 p-1 border rounded mx-2"
                      disabled={!formData.openHours[day.key]?.isOpen}
                    />
                    <span>עד</span>
                    <input
                      type="time"
                      value={formData.openHours[day.key]?.end}
                      onChange={e => handleOpenHourChange(day.key, 'end', e.target.value)}
                      className="w-28 p-1 border rounded mx-2"
                      disabled={!formData.openHours[day.key]?.isOpen}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">מידע על החנות</h2>
            <div>
              <label htmlFor="phone" className="block mb-2">מספר טלפון</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="הזן מספר טלפון"
              />
            </div>
            <div>
              <label htmlFor="address" className="block mb-2">כתובת</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="הזן כתובת חנות"
              />
            </div>
          </div>

          {/* Order Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">הגדרות הזמנה</h2>
            <div>
              <label htmlFor="order_company_delta_minutes" className="block mb-2">זמן הכנה משוער(דקות)</label>
              <input
                type="number"
                id="order_company_delta_minutes"
                name="order_company_delta_minutes"
                value={formData.order_company_delta_minutes}
                onChange={handleNumberChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Order Time Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">הגדרות זמן הזמנה</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="minReady" className="block mb-2">זמן הכנה מינימלי (דקות)</label>
                <input
                  type="number"
                  id="minReady"
                  name="minReady"
                  value={formData.minReady ?? ''}
                  onChange={handleNumberChange}
                  className="w-full p-2 border rounded"
                  placeholder="הזן זמן מינימלי"
                />
              </div>
              <div>
                <label htmlFor="maxReady" className="block mb-2">זמן הכנה מקסימלי (דקות)</label>
                <input
                  type="number"
                  id="maxReady"
                  name="maxReady"
                  value={formData.maxReady ?? ''}
                  onChange={handleNumberChange}
                  className="w-full p-2 border rounded"
                  placeholder="הזן זמן מקסימלי"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isOrderLaterSupport"
                name="isOrderLaterSupport"
                checked={formData.isOrderLaterSupport}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 ml-2"
              />
              <label htmlFor="isOrderLaterSupport">תמיכה בהזמנה מראש</label>
            </div>
            <div>
              <label htmlFor="orderNowEndTime" className="block mb-2">שעת סיום הזמנה מיידית</label>
              <input
                type="time"
                id="orderNowEndTime"
                name="orderNowEndTime"
                value={formData.orderNowEndTime}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="orderLaterEndTime" className="block mb-2">שעת סיום הזמנה מראש</label>
              <input
                type="time"
                id="orderLaterEndTime"
                name="orderLaterEndTime"
                value={formData.orderLaterEndTime}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="minTimeToOrder" className="block mb-2">זמן מינימום להזמנה (דקות)</label>
              <input
                type="number"
                id="minTimeToOrder"
                name="minTimeToOrder"
                value={formData.minTimeToOrder}
                onChange={handleNumberChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/stores')}
            className="px-4 py-2 border rounded hover:bg-gray-100 ml-4"
          >
            ביטול
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'שומר...' : 'שמור'}
          </button>
        </div>
      </form>

      <div className="space-y-4 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">פרטי חנות</h3>
            <p><strong>מזהה:</strong> {appName}</p>
            <p><strong>שם (ערבית):</strong> {name_ar}</p>
            <p><strong>שם (עברית):</strong> {name_he}</p>
            {location && (
              <p><strong>מיקום:</strong> {location.lat}, {location.lng}</p>
            )}
            <p><strong>תיאור (עברית):</strong> {descriptionHE}</p>
            <p><strong>תיאור (ערבית):</strong> {descriptionAR}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">תמונות</h3>
            <div className="space-y-4">
              <div>
                <p className="mb-2"><strong>לוגו:</strong></p>
                {storeLogo && (
                  <img
                  src={storeLogo && storeLogo.startsWith("blob:") ? storeLogo : cdnUrl + storeLogo}
                    alt="Store Logo"
                    className="h-20 w-20 object-contain border rounded"
                  />
                )}
              </div>
              <div>
                <p className="mb-2"><strong>תמונות כיסוי:</strong></p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {cover_sliders.map((url, index) => (
                    <img
                      key={index}
                      src={cdnUrl + url}
                      alt={`Cover Image ${index + 1}`}
                      className="h-32 w-full object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreData; 