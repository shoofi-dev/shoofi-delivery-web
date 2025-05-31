import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import 'animate.css';
import './styles.css'

// layouts

import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";

// views without layouts

import Landing from "views/landing/Landing";
import Profile from "views/Profile";
import Index from "views/Index";
import Login from "views/auth/Login";
import Register from "views/auth/Register";

// views

import Dashboard from "views/admin/Dashboard.js";
import Maps from "views/admin/Maps.js";
import Settings from "views/admin/Settings.js";
import Tables from "views/admin/Tables.js";
import ProductsList from "views/admin/Products";
import CategoriesList from "views/admin/categories";
import ProductPage from "views/admin/product";
import OrderdsPage from "views/admin/orders";
import ErrorsPage from "views/admin/errors";
import DeliveryArea from "views/admin/delivery-area";
import Cart from "views/cart/cart";
import DeliveryListView from "views/delivery/delivery-list";
import FreeStyleSwimming from "views/swimming-types/free-style-swimming";
import MarathonSwimming from "views/swimming-types/marathon-swimming";
import SeaSwimming from "views/swimming-types/sea-swimming";
import FullScreenVideo1 from "views/tv-ad/video1";
import FullScreenVideo2 from "views/tv-ad/video2";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import DeliveryOrderForm from "views/delivery/delivery-order";
import EmployePayments from "views/delivery/emloye-payments";
import AdminSettings from "views/delivery/settigns";
import AddCustomer from "views/delivery/add-customer";
import { StoreContext } from "stores";
import { storeDataStore } from "stores/store";
import OrdersAnalytics from "views/admin/analytics/OrdersAnalytics";
import DeliveryAnalytics from "views/admin/analytics/DeliveryAnalytics";
import CustomerAnalytics from "views/admin/analytics/CustomerAnalytics";
import DeliveryListAnalytics from "views/admin/analytics/DeliveryListAnalytics";
import AddCategory from "views/admin/analytics/AddCategory";
import DeliveryCompaniesList from "views/admin/delivery-companies/DeliveryCompaniesList";
import DeliveryCompanyForm from "views/admin/delivery-companies/DeliveryCompanyForm";
import DeliveryCompanyEmployeesList from "views/admin/delivery-companies/DeliveryCompanyEmployeesList";
import DeliveryCompanyEmployeeForm from "views/admin/delivery-companies/DeliveryCompanyEmployeeForm";
import { loadGoogleMapsApi } from "utils/loadGoogleMaps";
import CategoryStoresList from "views/admin/CategoryStoresList";
import DeliveryAreasList from "views/admin/delivery-areas/DeliveryAreasList";
import DeliveryAreaForm from "views/admin/delivery-areas/DeliveryAreaForm";
import CompanyAreasList from "views/admin/delivery-areas/CompanyAreasList";
import CompanyAreaForm from "views/admin/delivery-areas/CompanyAreaForm";
import CitiesList from "views/admin/delivery-areas/CitiesList";
import CitiesForm from "views/admin/delivery-areas/CitiesForm";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY!;

const AppWithGoogleMaps = () => {
  const [mapsReady, setMapsReady] = useState(false);
  useEffect(() => {
    loadGoogleMapsApi(GOOGLE_MAPS_API_KEY)
      .then(() => setMapsReady(true))
      .catch(() => alert("Failed to load Google Maps"));
  }, []);
  if (!mapsReady) return <div>Loading map...</div>;
  return (
    <BrowserRouter>
      <StoreContext.Provider
        value={{
          storeDataStore: storeDataStore,
        }}
      >
        <Routes>
          {/* add routes with layouts */}
          <Route path="/admin" element={<Admin />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/categories" element={<CategoriesList />} />
            <Route path="/admin/categories/:id" element={<ProductsList />} />
            <Route path="/admin/products" element={<ProductsList />} />
            <Route path="/admin/products/:id" element={<ProductsList />} />
            <Route path="/admin/product" element={<ProductPage />} />
            <Route path="/admin/product/add" element={<ProductPage />} />
            <Route path="/admin/product/:id" element={<ProductPage />} />
            <Route path="/admin/product/:storeAppName/:id" element={<ProductPage />} />
            <Route path="/admin/errors" element={<ErrorsPage />} />
            <Route path="/admin/orders" element={<OrderdsPage />} />
            <Route path="/admin/maps" element={<Maps />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/tables" element={<Tables />} />
            <Route path="/admin/delivery/area" element={<DeliveryArea />} />
            <Route path="/admin/analytics/orders" element={<OrdersAnalytics />} />
            <Route path="/admin/analytics/deliveries" element={<DeliveryAnalytics />} />
            <Route path="/admin/analytics/customers" element={<CustomerAnalytics />} />
            <Route path="/admin/analytics/deliveries-list" element={<DeliveryListAnalytics />} />
            <Route path="/admin/category/add" element={<AddCategory />} />
            <Route path="/admin/category/edit/:id" element={<AddCategory />} />
            <Route path="/admin/delivery-companies" element={<DeliveryCompaniesList />} />
            <Route path="/admin/delivery-companies/add" element={<DeliveryCompanyForm />} />
            <Route path="/admin/delivery-companies/edit/:id" element={<DeliveryCompanyForm />} />
            <Route path="/admin/delivery-companies/:companyId/employees" element={<DeliveryCompanyEmployeesList />} />
            <Route path="/admin/delivery-companies/:companyId/employees/add" element={<DeliveryCompanyEmployeeForm />} />
            <Route path="/admin/delivery-companies/:companyId/employees/edit/:id" element={<DeliveryCompanyEmployeeForm />} />
            <Route path="/admin/categories/:categoryId/stores" element={<CategoryStoresList />} />
            <Route path="/admin/delivery-areas" element={<DeliveryAreasList />} />
            <Route path="/admin/delivery-areas/add" element={<DeliveryAreaForm />} />
            <Route path="/admin/delivery-areas/edit/:id/:cityId" element={<DeliveryAreaForm />} />
            <Route path="/admin/delivery-company-areas" element={<CompanyAreasList />} />
            <Route path="/admin/delivery-company-areas/:companyId" element={<CompanyAreasList />} />
            <Route path="/admin/delivery-company-areas/:companyId/add" element={<CompanyAreaForm />} />
            <Route path="/admin/delivery-company-areas/:companyId/edit/:id" element={<CompanyAreaForm />} />
            <Route path="/admin/cities" element={<CitiesList />} />
            <Route path="/admin/cities/add" element={<CitiesForm />} />
            <Route path="/admin/cities/edit/:id" element={<CitiesForm />} />
            <Route path="" element={<Navigate to="/admin/dashboard" />} />
          </Route>
          <Route path="auth" element={<Auth />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="" element={<Navigate to="/auth/login" />} />
          </Route>
          {/* add routes without layouts */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/swimming-types/free-style" element={<FreeStyleSwimming />} />
          <Route path="/swimming-types/marathon" element={<MarathonSwimming />} />
          <Route path="/swimming-types/sea" element={<SeaSwimming />} />
          <Route path="/delivery-list" element={<DeliveryListView />} />
          <Route path="/delivery-order" element={<DeliveryOrderForm />} />
          <Route path="/add-customer" element={<AddCustomer />} />
          <Route path="/admin-settings" element={<AdminSettings />} />
          <Route path="/employe-payments" element={<EmployePayments />} />
          <Route path="/butcherl/video-1" element={<FullScreenVideo1 />} />
          <Route path="/butcherl/video-2" element={<FullScreenVideo2 />} />
          <Route path="/" element={<Index />} />
        </Routes>
      </StoreContext.Provider>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
serviceWorkerRegistration.register({});

root.render(<AppWithGoogleMaps />);
