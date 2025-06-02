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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
          Create Store Settings
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Store Data' : 'Add Store Data'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Support Options */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Support Options</h2>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="delivery_support"
                name="delivery_support"
                checked={formData.delivery_support}
                onChange={handleChange}
                className="form-checkbox h-5 w-5"
              />
              <label htmlFor="delivery_support">Delivery Support</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="takeaway_support"
                name="takeaway_support"
                checked={formData.takeaway_support}
                onChange={handleChange}
                className="form-checkbox h-5 w-5"
              />
              <label htmlFor="takeaway_support">Takeaway Support</label>
            </div>
          </div>

          {/* Payment Options */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Payment Options</h2>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="cash_support"
                name="cash_support"
                checked={formData.cash_support}
                onChange={handleChange}
                className="form-checkbox h-5 w-5"
              />
              <label htmlFor="cash_support">Cash Support</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="creditcard_support"
                name="creditcard_support"
                checked={formData.creditcard_support}
                onChange={handleChange}
                className="form-checkbox h-5 w-5"
              />
              <label htmlFor="creditcard_support">Credit Card Support</label>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Operating Hours</h2>
            <div>
              <label htmlFor="day" className="block mb-2">Day</label>
              <select
                id="day"
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start" className="block mb-2">Start Time</label>
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
                <label htmlFor="end" className="block mb-2">End Time</label>
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
            <h2 className="text-xl font-semibold">Store Status</h2>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isOpen"
                name="isOpen"
                checked={formData.isOpen}
                onChange={handleChange}
                className="form-checkbox h-5 w-5"
              />
              <label htmlFor="isOpen">Is Open</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isStoreClose"
                name="isStoreClose"
                checked={formData.isStoreClose}
                onChange={handleChange}
                className="form-checkbox h-5 w-5"
              />
              <label htmlFor="isStoreClose">Is Store Closed</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAlwaysOpen"
                name="isAlwaysOpen"
                checked={formData.isAlwaysOpen}
                onChange={handleChange}
                className="form-checkbox h-5 w-5"
              />
              <label htmlFor="isAlwaysOpen">Is Always Open</label>
            </div>
          </div>

          {/* Order Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Order Settings</h2>
            <div>
              <label htmlFor="delivery_price" className="block mb-2">Delivery Price</label>
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
              <label htmlFor="order_company_delta_minutes" className="block mb-2">Order Company Delta Minutes</label>
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
            <h2 className="text-xl font-semibold">Order Time Settings</h2>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isOrderLaterSupport"
                name="isOrderLaterSupport"
                checked={formData.isOrderLaterSupport}
                onChange={handleChange}
                className="form-checkbox h-5 w-5"
              />
              <label htmlFor="isOrderLaterSupport">Order Later Support</label>
            </div>
            <div>
              <label htmlFor="orderNowEndTime" className="block mb-2">Order Now End Time</label>
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
              <label htmlFor="orderLaterEndTime" className="block mb-2">Order Later End Time</label>
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
              <label htmlFor="minTimeToOrder" className="block mb-2">Minimum Time to Order (minutes)</label>
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
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreData; 