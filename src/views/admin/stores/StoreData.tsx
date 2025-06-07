import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from 'utils/http-interceptor';

interface StoreDataProps {
  logo?: File | null;
  name_ar?: string;
  name_he?: string;
  appName?: string;
  storeLogo?: string;
}

interface StoreDataForm {
  _id?: string;
  id?: number;
  delivery_support: boolean;
  takeaway_support: boolean;
  cash_support: boolean;
  creditcard_support: boolean;
  day: string;
  start: string;
  end: string;
  isOpen: boolean;
  isStoreClose: boolean;
  isAlwaysOpen: boolean;
  cover_sliders: string[];
  delivery_price: number;
  order_company_delta_minutes: number;
  isOrderLaterSupport: boolean;
  orderNowEndTime: string;
  orderLaterEndTime: string;
  minTimeToOrder: number;
  phone: string;
  address: string;
}

const StoreData: React.FC<StoreDataProps> = ({ logo, name_ar, name_he, appName, storeLogo }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<StoreDataForm>({
    delivery_support: true,
    takeaway_support: true,
    cash_support: true,
    creditcard_support: false,
    day: 'Sunday',
    start: '10:00',
    end: '00:00',
    isOpen: true,
    isStoreClose: false,
    isAlwaysOpen: true,
    cover_sliders: [],
    delivery_price: 20,
    order_company_delta_minutes: 0,
    isOrderLaterSupport: false,
    orderNowEndTime: '23:00',
    orderLaterEndTime: '23:59',
    minTimeToOrder: 60,
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const response: any = await axiosInstance.get(`/store/get/${appName}`);
      console.log("response", response);
      if(response){
        setFormData(response);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Create the data object
      const dataToSend = {
        ...formData,
        appName,
        name_ar,
        name_he,
        storeLogo
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div>
              <label htmlFor="day" className="block mb-2">יום</label>
              <select
                id="day"
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start" className="block mb-2">שעת פתיחה</label>
                <input
                  type="time"
                  id="start"
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="end" className="block mb-2">שעת סגירה</label>
                <input
                  type="time"
                  id="end"
                  name="end"
                  value={formData.end}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Store Status */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">סטטוס חנות</h2>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isOpen"
                name="isOpen"
                checked={formData.isOpen}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 ml-2"
              />
              <label htmlFor="isOpen">חנות פתוחה</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isStoreClose"
                name="isStoreClose"
                checked={formData.isStoreClose}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 ml-2"
              />
              <label htmlFor="isStoreClose">חנות סגורה</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAlwaysOpen"
                name="isAlwaysOpen"
                checked={formData.isAlwaysOpen}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 ml-2"
              />
              <label htmlFor="isAlwaysOpen">חנות פתוחה תמיד</label>
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
              <label htmlFor="delivery_price" className="block mb-2">מחיר משלוח</label>
              <input
                type="number"
                id="delivery_price"
                name="delivery_price"
                value={formData.delivery_price}
                onChange={handleNumberChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="order_company_delta_minutes" className="block mb-2">זמן הכנה (דקות)</label>
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
    </div>
  );
};

export default StoreData; 