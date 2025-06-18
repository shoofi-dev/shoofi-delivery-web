//export const BASE_URL = "https://shoofi-api-95miq.ondigitalocean.app/api/";
//DEV
  export const BASE_URL = "http://localhost:1111/api/";

export const MENU_API = {
    CONTROLLER: "config",
    GET_MENU_API : "menu",
    GET_SLIDER_API : "getAppSliderGallery",
    ADMIN_UPLOAD_IMAGES_API : "admin/images/upload",
    ADMIN_ADD_PRODUCT_API : "admin/product/insert",
    ADMIN_UPDATE_PRODUCT_API : "admin/product/update",
    ADMIN_UPDATE_PRODUCT_ACTIVE_TASTES_API : "admin/product/update/activeTastes",
    ADMIN_UPDATE_PRODUCTS_ORDER_TASTES_API : "admin/product/update/order",
    ADMIN_UPDATE_IS_IN_STORE_PRODUCT_API : "admin/product/update/isInStore",
    ADMIN_DELETE_PRODUCT_API : "admin/product/delete",
    GET_IMAGES_BY_CATEGORY : "images",
};

export const CUSTOMER_API = {
    CONTROLLER: "customer",
    CREATE_LEAD: "customer/create/lead"
};