import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// components
import { useEffect, useState } from "react";
import clsx from "clsx";
import getProductsListApi from "apis/admin/product/get-products-list";
import deleteProductApi from "apis/admin/product/delete-product";
import getProductsByCategoryIdApi from "apis/admin/product/get-products-by-category-id";
import { CategoryConsts, CategoryEnum } from "shared/constants";
import { cdnUrl } from "consts/shared";
import StoreDropdown, { Store } from "components/admin/StoreDropdown";
import CategoryDropdown from "components/admin/CategoryDropdown";

const iconClass =
  "text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full";
export default function ProductsList() {
  const params = useParams<any>();
  const navigate = useNavigate();

  const [productsList, setProductsList] = useState<any[]>([]);
  const [isDeleteActive, setIsdeleteActive] = useState(false);
  const [deleteList, setDeleteList] = useState<any>([]);
  const [storeAppName, setStoreAppName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [menu, setMenu] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store>();
  const getProductsList = () => {
    if (!storeAppName) return;
    getProductsListApi({ "app-name": storeAppName }).then((res) => {
      console.log("res", res);
      setMenu(res);
      if (res.length > 0 && !categoryId) {
        setCategoryId(res[0]._id);
      }
    });
  };

  useEffect(() => {
    getProductsList();
    // eslint-disable-next-line
  }, [storeAppName]);

  useEffect(() => {
    if (!categoryId || !menu.length) {
      setProductsList([]);
      return;
    }
    const category = menu.find((cat: any) => cat._id === categoryId);
    setProductsList(category?.products || []);
  }, [categoryId, menu]);

  const getCategoryName = () => {
    if (params.id) {
      switch (params.id) {
        case "1":
          return CategoryConsts[CategoryEnum.cheeseCake];
        case "2":
          return CategoryConsts[CategoryEnum.chockolateCate];
        case "3":
          return CategoryConsts[CategoryEnum.uniqueCake];
        case "4":
          return CategoryConsts[CategoryEnum.birthdayCake];
      }
    }
  };

  const handleProductClick = (e: any, product: any) => {
    if (isDeleteActive) {
      e.preventDefault();
      if (isInDeleteList(product)) {
        const updatedDeleteList = deleteList.filter(
          (id: any) => id !== product._id
        );
        setDeleteList(updatedDeleteList);
      } else {
        setDeleteList([...deleteList, product._id]);
      }
    }
  };

  const isInDeleteList = (product: any) => {
    return deleteList.indexOf(product._id) > -1;
  };

  const deleteSelectedItems = () => {
    setIsdeleteActive(false);
    deleteProductApi(deleteList, storeAppName);
    //TODO : call delete products api
  };

  const handleStoreChange = (store: Store) => {
    setSelectedStore(store);
    setStoreAppName(store.appName);
  };

  const handleDeleteItemsClick = () => {
    if (isDeleteActive) {
      setDeleteList([]);
    }
    setIsdeleteActive(!isDeleteActive);
  };

  const handleAddNewClick = () => {
    navigate("/admin/product");
  };

  // Responsive product card
  const ProductCard = ({ product }: { product: any }) => (
    <Link
      key={product._id}
      onClick={(e) => {
        handleProductClick(e, product);
      }}
      className={clsx(
        "transition duration-500 hover:scale-105 w-full max-w-xs mx-auto"
      )}
      to={`/admin/product/${storeAppName}/${product._id}`}
    >
      <div className="bg-white rounded-xl shadow-lg flex flex-col justify-between overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-gray-50 aspect-[3/4]">
          <img
            alt={product.nameAR}
            className="object-contain w-full h-full"
            src={`${cdnUrl}${product.img[0].uri}`}
          />
        </div>
        <div className="p-4 text-center">
          <div className="font-bold text-base md:text-lg text-gray-800 mb-1">
            {product.nameAR}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8">
          {/* Title (RTL: right) */}
          <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-0 text-right order-3">
            ניהול מוצרים
          </h1>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Dropdowns (center) */}
              <div className="flex gap-2 sm:gap-4 items-center flex-1  order-1 md:order-2">
                <div className="w-48">
                  <StoreDropdown
                    value={storeAppName}
                    onChange={handleStoreChange}
                    label="בחר חנות"
                  />
                </div>
                <div className="w-48">
                  <CategoryDropdown
                    value={categoryId}
                    onChange={setCategoryId}
                    label="בחר קטגוריה"
                    categories={menu}
                  />
                </div>
              </div>
            </div>

            {/* Actions (RTL: left) */}
            <div className="flex gap-2 sm:gap-3 items-center justify-start order-2 md:order-1">
              <button
                onClick={handleDeleteItemsClick}
                className={clsx(
                  "bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow text-2xl",
                  isDeleteActive ? "ring-2 ring-red-300" : ""
                )}
                title="מחק מוצרים"
              >
                <i
                  className={clsx(
                    isDeleteActive ? "fa fa-times" : "fas fa-trash"
                  )}
                ></i>
              </button>
              <button
                onClick={handleAddNewClick}
                className={clsx(
                  "bg-lightBlue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow text-2xl hover:bg-lightBlue-700 transition",
                  isDeleteActive
                    ? "opacity-30 pointer-events-none"
                    : "opacity-100 pointer-events-auto"
                )}
                title="הוסף מוצר"
                disabled={isDeleteActive}
              >
                <i className="fas fa-plus"></i>
              </button>
              <button
                onClick={deleteSelectedItems}
                className={clsx(
                  "bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow text-2xl",
                  isDeleteActive ? "visible" : "invisible",
                  deleteList.length === 0
                    ? "opacity-30 pointer-events-none"
                    : "opacity-100 pointer-events-auto"
                )}
                title="אשר מחיקה"
                style={{ marginRight: "8px" }}
              >
                <i className="fas fa-check"></i>
              </button>
            </div>
          </div>
        </div>
        {/* Product Grid or Empty State */}
        {productsList.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <i className="fas fa-box-open text-5xl mb-4"></i>
            <div>אין מוצרים בקטגוריה זו</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsList?.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
