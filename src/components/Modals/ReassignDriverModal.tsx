import React, { useState, useEffect } from 'react';
import getAvailableDrivers from 'apis/admin/delivery/get-available-drivers';
import reassignDriver from 'apis/admin/delivery/reassign-driver';

const ReassignDriverModal = ({ order, onClose, onReassign }: { order: any, onClose: () => void, onReassign: () => void }) => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const availableDrivers:any = await getAvailableDrivers(order._id);
        setDrivers(availableDrivers);
      } catch (err) {
        setError('Failed to fetch drivers');
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, [order._id]);

  const handleReassign = async () => {
    if (!selectedDriver) {
      alert('Please select a driver');
      return;
    }
    setLoading(true);
    try {
      await reassignDriver({
        orderId: order._id,
        bookId: order.bookId,
        newDriverId: selectedDriver,
      });
      onReassign();
      onClose();
    } catch (err) {
      setError('Failed to reassign driver');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Reassign Order</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Reassign order {order.orderId} to a new driver.
            </p>
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="mt-4 w-full border p-2 rounded"
            >
              <option value="">Select a driver</option>
              {drivers?.map((driver: any) => (
                <option key={driver._id} value={driver._id}>
                  {driver.fullName}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="items-center px-4 py-3">
            <button
              onClick={handleReassign}
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              disabled={loading}
            >
              {loading ? 'Reassigning...' : 'Reassign'}
            </button>
            <button
              onClick={onClose}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReassignDriverModal;