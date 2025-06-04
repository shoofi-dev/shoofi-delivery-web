import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cdnUrl } from "consts/shared";
import CitySelect from "components/admin/CitySelect";
import { axiosInstance } from "utils/http-interceptor";

interface Store {
  _id: string;
  storeName: string;
  storeLogo: any;
  appName: string;
  categoryId: string;
  supportedCities: string[];
}

export default function StoresList() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCityId) {
      fetchStoresByCity(selectedCityId);
    } else {
      // fetchStores();
    }
  }, [selectedCityId]);

  const fetchStores = async () => {
    try {
      const response: any = await axiosInstance.get("shoofiAdmin/store/all");
      setStores(response);
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  const fetchStoresByCity = async (cityId: string) => {
    setLoading(true);
    try {
      const response: any = await axiosInstance.get(
        `shoofiAdmin/store/by-city/${cityId}`
      );
      setStores(response);
    } catch (error) {
      console.error("Error fetching stores by city:", error);
      toast.error("Failed to fetch stores by city");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      try {
        await axiosInstance.delete(`shoofiAdmin/store/${id}`);
        toast.success("Store deleted successfully");
        if (selectedCityId) {
          fetchStoresByCity(selectedCityId);
        }
      } catch (error) {
        console.error("Error deleting store:", error);
        toast.error("Failed to delete store");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded p-6">
      <div className="flex justify-between items-center mb-4 w-full">
        <h2 className="text-2xl font-bold">רשימת חנויות</h2>
        <div className="relative  px-4  text-right">
          <Link
            to="/admin/stores/add"
            className="bg-blue-500 text-white active:bg-blue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          >
            הוסף חנות
          </Link>
        </div>
      </div>
      <div className="rounded-t mb-0  py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <CitySelect value={selectedCityId} onChange={setSelectedCityId} />
          </div>
        </div>
      </div>

      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right">
                לוגו
              </th>
              <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right">
                שם חנות
              </th>
              <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right">
                App Name
              </th>
              <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                פעולות
              </th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store._id}>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {store.storeLogo && (
                    <img
                      src={cdnUrl + store.storeLogo.uri}
                      alt={store.storeName}
                      className="h-12 w-12 object-contain"
                    />
                  )}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                  {store.storeName}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                  {store.appName}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                  <div className="flex justify-center gap-3">
                    <Link
                      to={`/admin/stores/edit/${store._id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      ערוך
                    </Link>
                    <button
                      onClick={() => handleDelete(store._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      הסר
                    </button>
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() =>
                        navigate(`/admin/store-categories/${store.appName}`)
                      }
                    >
                      נהל תפריט
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
