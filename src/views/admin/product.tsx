import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TProduct } from "shared/types/product";
import StoreDropdown from "../../components/admin/StoreDropdown";
import { axiosInstance } from "../../utils/http-interceptor";
import CategoryDropdown from "../../components/admin/CategoryDropdown";
import ProductInfoForm from "../../components/admin/ProductInfoForm";

/*consts*/
import { CategoryEnum, CategoryConsts } from "shared/constants";

/* api */
import addNewProductApi from "apis/admin/product/add-new-product";
import uploadImage from "apis/admin/product/upload-image";
import getProductApi from "apis/admin/product/get-product";
import getCategoriesListApi from "apis/admin/category/get-categories";
import { TCategory } from "shared/types/category";
import React from "react";

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
  const params = useParams();
  const [selectedProduct, setSelectedProduct] = useState<TProduct>();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<number>();
  const [imgFile, setImgFile] = useState<File>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const navigate = useNavigate();

  const [categorytList, setCategorytList] = useState<TCategory[]>([]);
  const [storeAppName, setStoreAppName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");

  useEffect(() => {
    if (params.id === undefined) {
      setFormMode(formModes.addNew);
    } else {
      getProductApi(params.id).then((res) => {
        setSelectedProduct(res);
        setFormMode(formModes.preview);
      });
    }
  }, []);

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
    if (selectedProduct && imgFile) {
      setIsLoading(true);
      //uploadImage(imgFile).then((res) => {
        console.log("imgFile",imgFile)
        const updatedData = { ...selectedProduct, img: imgFile };
        setSelectedProduct(updatedData);
        addNewProductApi(updatedData).then((res: any) => {
          console.log(res);
          navigate(`/admin/product/${res.productId}`);
          setIsLoading(false);
        });
      //});
    }
  };

  const handleFileChange = (event: any) => {
    const target = event.target;
    console.log("event.target.files[0]",event.target.files[0])
    setImgFile(event.target.files[0]);
  };

  const handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const handleStoreChange = (appName: string) => {
    setStoreAppName(appName);
  };

  const handleCategoryChange = (event: any) => {
    setCategoryId(event);
    setSelectedProduct({ ...selectedProduct, categoryId: event });
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
        return URL.createObjectURL(imgFile);
      case formModes.preview:
      case formModes.edit:
        return selectedProduct?.img;
      default:
        return "";
    }
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6 w-full">
          <StoreDropdown value={storeAppName} onChange={handleStoreChange} label="בחר חנות" />
          {storeAppName && (
            <div className=" w-full">
              <CategoryDropdown
                value={categoryId || selectedProduct?.categoryId || ""}
                onChange={handleCategoryChange}
                label="בחר קטגוריה"
                categories={categorytList}
              />
            </div>
          )}
        </div>
        {storeAppName && (categoryId || selectedProduct?.categoryId) ? (
          <div className="flex-auto px-4 lg:px-10 py-10 pt-5">
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
            />
          </div>
        ) : storeAppName ? (
          <div className="flex justify-center items-center py-10 text-lg text-gray-500">בחר קטגוריה כדי להוסיף או לערוך מוצר</div>
        ) : (
          <div className="flex justify-center items-center py-10 text-lg text-gray-500">בחר חנות כדי להוסיף או לערוך מוצר</div>
        )}
      </div>
    </>
  );
};
export default ProductPage;
