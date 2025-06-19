import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cdnUrl } from "consts/shared";
import CitySelect from "components/admin/CitySelect";
import { axiosInstance } from "utils/http-interceptor";

interface Store {
  _id: string;
  name_ar: string;
  name_he: string;
  storeLogo: any;
  appName: string;
  categoryId: string;
  supportedCities: string[];
}

export default function StoresList() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCityId) {
      fetchStoresByCity(selectedCityId, 1);
    } else {
      fetchStores(1);
    }
  }, [selectedCityId]);

  const fetchStores = async (page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      
      const response: any = await axiosInstance.get(`shoofiAdmin/store/all?${params}`);
      
      // Handle both paginated and non-paginated responses
      if (response.stores && response.pagination) {
        setStores(response.stores);
        setPagination(response.pagination);
      } else if (Array.isArray(response)) {
        setStores(response);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: response.length,
          itemsPerPage: response.length
        });
      } else {
        setStores([]);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  const fetchStoresByCity = async (cityId: string, page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      
      const response: any = await axiosInstance.get(
        `shoofiAdmin/store/by-city/${cityId}?${params}`
      );
      
      // Handle both paginated and non-paginated responses
      if (response.stores && response.pagination) {
        setStores(response.stores);
        setPagination(response.pagination);
      } else if (Array.isArray(response)) {
        setStores(response);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: response.length,
          itemsPerPage: response.length
        });
      } else {
        setStores([]);
      }
    } catch (error) {
      console.error("Error fetching stores by city:", error);
      toast.error("Failed to fetch stores by city");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (selectedCityId) {
      fetchStoresByCity(selectedCityId, 1);
    } else {
      fetchStores(1);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (selectedCityId) {
      fetchStoresByCity(selectedCityId, 1);
    } else {
      fetchStores(1);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      try {
        await axiosInstance.delete(`shoofiAdmin/store/${id}`);
        toast.success("Store deleted successfully");
        if (selectedCityId) {
          fetchStoresByCity(selectedCityId, pagination.currentPage);
        }
      } catch (error) {
        console.error("Error deleting store:", error);
        toast.error("Failed to delete store");
      }
    }
  };

  const handlePageChange = (page: number) => {
    if (selectedCityId) {
      fetchStoresByCity(selectedCityId, page);
    }
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) {
      return null;
    }

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1}
        className="px-3 py-2 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        הקודם
      </button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 text-sm font-medium rounded-md ${
            i === pagination.currentPage
              ? "text-white bg-blue-600 border border-blue-600"
              : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pagination.totalPages}
        className="px-3 py-2 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        הבא
      </button>
    );

    return pages;
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
            className="bg-blue-500 text-white active:bg-blue-600 text-lg font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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

      {/* Search Section */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
                placeholder="חפש חנות לפי שם, מזהה או תיאור..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <button
                  onClick={handleSearch}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              חפש
            </button>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                נקה
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-lg uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right">
                לוגו
              </th>
              <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-lg uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right">
                שם חנות
              </th>
              <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-lg uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right">
                App Name
              </th>
              <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-lg uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                פעולות
              </th>
            </tr>
          </thead>
          <tbody>
            {stores?.map((store) => (
              <tr key={store._id}>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-lg whitespace-nowrap p-4">
                  {store.storeLogo && (
                    <img
                      src={cdnUrl + store.storeLogo.uri}
                      alt={store.name_he}
                      className="h-12 w-12 object-contain"
                    />
                  )}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-lg whitespace-nowrap p-4 text-right">
                  {store.name_he}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-lg whitespace-nowrap p-4 text-right">
                  {store.appName}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-lg whitespace-nowrap p-4 text-center">
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

      {/* Pagination Summary */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          מציג {((pagination?.currentPage || 1) - 1) * (pagination?.itemsPerPage || 10) + 1} עד {Math.min((pagination?.currentPage || 1) * (pagination?.itemsPerPage || 10), pagination?.totalItems || 0)} מתוך {pagination?.totalItems || 0} חנויות
        </div>
        <div className="flex justify-center">
          {pagination && pagination.totalPages > 1 && renderPagination()}
        </div>
      </div>
    </div>
  );
}
