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
import StoreDropdown from "components/admin/StoreDropdown";
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

  const getProductsList = () => {
    if (!storeAppName) return;
    getProductsListApi({ 'app-name': storeAppName }).then((res) => {
      console.log("res", res)
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
          return CategoryConsts[ CategoryEnum.cheeseCake]
        case "2":
          return CategoryConsts[ CategoryEnum.chockolateCate]
        case "3":
          return CategoryConsts[ CategoryEnum.uniqueCake]
        case "4":
          return CategoryConsts[ CategoryEnum.birthdayCake]
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
    deleteProductApi(deleteList);
    //TODO : call delete products api
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

  return (
    <div className="flex flex-wrap justify-center relative">
      <StoreDropdown value={storeAppName} onChange={setStoreAppName} label="בחר חנות" />
      <CategoryDropdown
        value={categoryId}
        onChange={setCategoryId}
        label="בחר קטגוריה"
        categories={menu}
      />
      <div className="w-full px-4">
        <div
          className={clsx(
            "flex items-center rounded-lg rounded p-3 shadow-lg bg-gray-100",
            isDeleteActive ? "bg-red-300" : "bg-white"
          )}
        >
          <div
            onClick={deleteSelectedItems}
            role="button"
            className={clsx(
              "bg-orange-600 disabled",
              iconClass,
              isDeleteActive ? "visible" : "invisible",
              deleteList.length === 0
                ? "opacity-30 pointer-events-none"
                : "opacity-100 pointer-events-auto"
            )}
          >
            <i className="fas fa-check"></i>
          </div>
          <h1 className="text-4xl m-auto w-fit">{getCategoryName()}</h1>
          <div className="flex gap-3">
            <div
              role="button"
              onClick={handleDeleteItemsClick}
              className={clsx(iconClass, "bg-red-600")}
            >
              <i
                className={clsx(
                  isDeleteActive ? "fa fa-times" : "fas fa-trash"
                )}
              ></i>
            </div>
            <div
              role="button"
              onClick={handleAddNewClick}
              className={clsx(
                "bg-lightBlue-600 disabled",
                iconClass,
                isDeleteActive
                  ? "opacity-30 pointer-events-none"
                  : "opacity-100 pointer-events-auto"
              )}
            >
              <i className="fas fa-plus"></i>
            </div>
          </div>
        </div>
        <div className="flex gap-5 flex-wrap mt-10 -mx-1 lg:-mx-4">
          {productsList?.map((product: any) => (
            <Link
              onClick={(e) => {
                handleProductClick(e, product);
              }}
              className={clsx("my-1 transition duration-500 hover:scale-105")}
              to={`/admin/product/${storeAppName}/${product._id}`}
            >
              <div>
                <article className="overflow-hidden rounded-lg shadow-lg">
                  <img
                    alt="Placeholder"
                    className="block  max-w-50 max-h-80"
                    src={`${cdnUrl}${product.img[0].uri}`}
                  />
                  <div
                    className={clsx(
                      "flex items-center leading-tight p-2 md:p-4",
                      isDeleteActive && isInDeleteList(product)
                        ? "bg-red-600"
                        : "bg-white"
                    )}
                  >
                    <div className="text-lg w-full text-center">
                      <span className="text-black	">{product.nameAR}</span>
                    </div>
                  </div>
                </article>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
