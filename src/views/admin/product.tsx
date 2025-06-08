import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TProduct } from "shared/types/product";
import StoreDropdown, { Store } from "../../components/admin/StoreDropdown";
import { axiosInstance } from "../../utils/http-interceptor";
import CategoryDropdown from "../../components/admin/CategoryDropdown";
import ProductInfoForm from "../../components/admin/ProductInfoForm";
import ExtrasManager from "../../components/admin/ExtrasManager";
import { MultiSelect } from 'react-multi-select-component';
import { toast } from 'react-toastify';
import Loader from 'components/Loader/loader';

/*consts*/
import { CategoryEnum, CategoryConsts } from "shared/constants";

/* api */
import addOrUpdateProduct from "apis/admin/product/add-new-product";
import uploadImage from "apis/admin/product/upload-image";
import getProductApi from "apis/admin/product/get-product";
import getCategoriesListApi from "apis/admin/category/get-categories";
import { TCategory } from "shared/types/category";
import React from "react";
import { cdnUrl } from "consts/shared";

const iconClass =
  "text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full";
const inputClass =
  "border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded  shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150";
const inputLabelClass =
  "block text-lg uppercase text-blueGray-600 font-bold mb-2";

const formModes = {
  preview: 1,
  edit: 2,
  addNew: 3,
};
const ProductPage = () => {
  const {appName,categoryIdParam, id} = useParams();
  const [selectedProduct, setSelectedProduct] = useState<any>();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<number>();
  const [imgFile, setImgFile] = useState<File>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const navigate = useNavigate();

  const [categorytList, setCategorytList] = useState<TCategory[]>([]);
  const [globalCategorytList, setGlobalCategorytList] = useState<TCategory[]>([]);
  const [globalExtrasList, setGlobalExtrasList] = useState<any[]>([]);
  const [storeAppName, setStoreAppName] = useState<string>(appName || "");
  const [categoryId, setCategoryId] = useState<string>(categoryIdParam || "");
  const [selectedStore, setSelectedStore] = useState<Store>();
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);

  // Load categories when store changes
  useEffect(() => {
    if (storeAppName) {
      axiosInstance.get("/admin/categories", {
        headers: { 'app-name': storeAppName }
      }).then((categories: any) => {
        setCategorytList(categories);
      });
    } else {
      setCategorytList([]);
    }
  }, [storeAppName]);

  // Set selected categories when product or categories change
  useEffect(() => {
    if (selectedProduct?.supportedCategoryIds && categorytList.length > 0) {
      const selectedCats = categorytList
        .filter((cat: any) => selectedProduct.supportedCategoryIds.includes(cat._id.toString()))
        .map((cat: any) => ({ label: cat.nameHE, value: cat._id }));
      setSelectedCategories(selectedCats);
    }
  }, [selectedProduct, categorytList]);

  useEffect(() => {
    if (id === undefined) {
      setFormMode(formModes.addNew);
      // Set default category from route params if available
      if (categoryIdParam && categorytList.length > 0) {
        const defaultCategory = categorytList.find(cat => cat._id.toString() === categoryIdParam.toString());
        if (defaultCategory) {
          setSelectedCategories([{ label: defaultCategory.nameHE, value: defaultCategory._id }]);
          setSelectedProduct((prev: any) => ({
            ...prev,
            supportedCategoryIds: [defaultCategory._id]
          }));
        }
      }
    } else {
      if (storeAppName) {
        setStoreAppName(storeAppName);
      }
      
      getProductApi(id, storeAppName || "").then((res: any) => {
        console.log("res",res)
        setSelectedProduct(res);
        setFormMode(formModes.preview);
      });
    }
  }, [categorytList, categoryIdParam]);

  useEffect(() => {
    console.log("selectedStore", selectedStore)
    if(!selectedStore) return;
    console.log("globalCategorytList")
      axiosInstance.get("/admin/categories", {
        headers: { 'app-name': 'shoofi' }
      }).then((categories: any) => {
        console.log("selectedStore", selectedStore)
        setGlobalCategorytList(categories);
        const categoryExtras = categories
        .filter((c: any) => selectedStore.categoryIds?.includes(c._id))
        .flatMap((c: any) => c.extras || []);
      setGlobalExtrasList(categoryExtras);
      });
 
  }, [selectedStore]);

  // useEffect(() => {
  //   console.log("selectedProduct", selectedProduct)
  //   if (globalCategorytList) {
  //     console.log("globalCategorytList", globalCategorytList)
  //     console.log("categoryId", categoryId)
  //     console.log("selectedProduct?.categoryId", selectedProduct?.categoryId)
  //     const categoryRes = globalCategorytList.find((c: any) => (c._id === categoryId || c._id === selectedProduct?.categoryId));
  //     console.log("categoryRes", categoryRes)
  //     // setGlobalExtrasList(categoryRes?.extras); 
  //      }
  // }, [globalCategorytList]);

  useEffect(() => {
    switch (formMode) {
      case formModes.edit:
        setIsDisabled(false);
        break;
      case formModes.addNew:
        setIsDisabled(false);
        break;
      case formModes.preview:
        setIsDisabled(true);
        break;
      default:
        break;
    }
  }, [formMode]);

  const handlEditClick = () => {
    if (formMode === formModes.edit) {
      setFormMode(formModes.preview);
      return;
    }
    setFormMode(formModes.edit);
  };

  const handlAddClick = () => {
    if (selectedProduct && getImgSrc() !== "") {
      setIsLoading(true);
      const updatedData = { 
        ...selectedProduct, 
        img: imgFile,
        supportedCategoryIds: selectedCategories.map(cat => cat.value)
      };
      setSelectedProduct(updatedData);
      addOrUpdateProduct(updatedData, storeAppName, formMode === formModes.edit)
        .then((res: any) => {
          if (formMode === formModes.edit && selectedProduct._id) {
            getProductApi(selectedProduct._id, storeAppName).then((fresh) => {
              setSelectedProduct(fresh);
              setFormMode(formModes.preview);
              setIsLoading(false);
              toast.success('המוצר עודכן בהצלחה');
              navigate(-1);
            });
          } else {
            setIsLoading(false);
            toast.success('המוצר נוצר בהצלחה');
            navigate(-1);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error('אירעה שגיאה. אנא נסה שוב');
        });
    }
  };

  const handleFileChange = (event: any) => {
    const target = event.target;
    const file = event.target.files[0];
    setImgFile(file);
    
    // Update selectedProduct with new image
    if (selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        img: [{
          uri: URL.createObjectURL(file),
          file: file
        }]
      });
    }
  };

  const handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const handleStoreChange = (store: Store) => {
    console.log("storetttt", store)
    setSelectedStore(store);
    setStoreAppName(store.appName);
  };

  const handleCategoryChange = (selected: any[]) => {
    setSelectedCategories(selected);
    setSelectedProduct((prev: any) => ({
      ...prev,
      supportedCategoryIds: selected.map(cat => cat.value)
    }));
  };

  const getInputClass = () => {
    switch (formMode) {
      case formModes.edit:
        return "bg-white";
      case formModes.addNew:
        return "bg-white";
      case formModes.preview:
        return "bg-blueGray-100";
      default:
        return "";
    }
  };

  const getCardTitle = () => {
    switch (formMode) {
      case formModes.edit:
        return "ערוך מוצר";
      case formModes.addNew:
        return "הוסף מוצר";
      case formModes.preview:
        return "פרטי מוצר";
      default:
        return "";
    }
  };

  const getImgSrc = () => {
    switch (formMode) {
      case formModes.addNew:
        return imgFile ? URL.createObjectURL(imgFile) : "";
      case formModes.preview:
      case formModes.edit:
        if (selectedProduct?.img?.[0]?.uri) {
          const uri = selectedProduct.img[0].uri;
          return uri.startsWith("blob:") ? uri : `${cdnUrl}${uri}`;
        }
        return "";
      default:
        return "";
    }
  };

  // Add a function to reload the product from the server
  const reloadProduct = () => {
    if (id) {
      getProductApi(id, storeAppName || "").then((res: any) => {
        setSelectedProduct(res);
        if (res.supportedCategoryIds) {
          const selectedCats = categorytList
            .filter(cat => res.supportedCategoryIds.includes(cat._id))
            .map(cat => ({ label: cat.nameHE, value: cat._id }));
          setSelectedCategories(selectedCats);
        }
        setFormMode(formModes.preview);
      });
    } else {
      setFormMode(formModes.preview);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6 w-full flex items-center gap-4">
          <StoreDropdown value={storeAppName} onChange={handleStoreChange} label="בחר חנות" />
          {storeAppName && (
            <div className="w-full">
              <div className="mb-4">
                <label className="block text-lg uppercase text-blueGray-600 font-bold mb-2">
                  בחר קטגוריות
                </label>
                <MultiSelect
                  options={categorytList.map(cat => ({ label: cat.nameHE, value: cat._id }))}
                  value={selectedCategories}
                  onChange={handleCategoryChange}
                  labelledBy="בחר קטגוריות"
                  className="w-full"
                  disabled={isDisabled}
                  overrideStrings={{
                    allItemsAreSelected: "כל הפריטים נבחרו",
                    selectAll: "בחר הכל",
                    selectSomeItems: "בחר פריטים",
                    clearSelected: "נקה בחירה",
                    search: "חפש",
                    noOptions: "אין תוצאות",
                    create: "יצירת פריט",
                    createItem: "יצירת פריט",
                  }}
                  ItemRenderer={({ checked, option, onClick, disabled }: { checked: boolean; option: any; onClick: () => void; disabled: boolean }) => (
                    <div
                      className={`item-renderer ${disabled ? "disabled" : ""}`}
                      onClick={onClick}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        readOnly
                        disabled={disabled}
                      />
                      <div className="flex items-center gap-2 mr-2">
                        <span>{option.label}</span>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          )}
          {/* Edit button in preview mode */}
          {formMode === formModes.preview && (
            <button
              onClick={() => setFormMode(formModes.edit)}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-16 h-12 flex items-center justify-center shadow"
              title="ערוך מוצר"
            >
              <i className="fas fa-edit"></i>
            </button>
          )}
          {/* Cancel Edit button in edit mode */}
          {formMode === formModes.edit && (
            <button
              onClick={reloadProduct}
              className="bg-red-700 hover:bg-red-600 text-white rounded-full w-16 h-12 flex items-center justify-center shadow"
              title="בטל עריכה"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        {storeAppName && selectedCategories.length > 0 ? (
          <div className="flex-auto px-4 lg:px-10 py-10 pt-5">
            <div className="relative">
              <ExtrasManager
                value={selectedProduct?.extras || []}
                onChange={(extras) => setSelectedProduct({ ...selectedProduct, extras })}
                globalExtras={globalExtrasList as any}
              />
              <ProductInfoForm
                selectedProduct={selectedProduct}
                isDisabled={isDisabled}
                inputClass={inputClass}
                inputLabelClass={inputLabelClass}
                getInputClass={getInputClass}
                handleInputChange={handleInputChange}
                imgFile={imgFile}
                getImgSrc={getImgSrc}
                handleFileChange={handleFileChange}
                handlAddClick={handlAddClick}
              />
            </div>
          </div>
        ) : storeAppName ? (
          <div className="flex justify-center items-center py-10 text-lg text-gray-500">בחר קטגוריות כדי להוסיף או לערוך מוצר</div>
        ) : (
          <div className="flex justify-center items-center py-10 text-lg text-gray-500">בחר חנות כדי להוסיף או לערוך מוצר</div>
        )}
      </div>
    </>
  );
};
export default ProductPage;
