import React from "react";

interface ProductInfoFormProps {
  selectedProduct: any;
  isDisabled: boolean;
  inputClass: string;
  inputLabelClass: string;
  getInputClass: () => string;
  handleInputChange: (event: any) => void;
  imgFile: File | undefined;
  getImgSrc: () => string;
  handleFileChange: (event: any) => void;
  handlAddClick: () => void;
}

const ProductInfoForm: React.FC<ProductInfoFormProps> = ({
  selectedProduct,
  isDisabled,
  inputClass,
  inputLabelClass,
  getInputClass,
  handleInputChange,
  imgFile,
  getImgSrc,
  handleFileChange,
  handlAddClick,
}) => {
  return (
    <form className={isDisabled ? "pointer-events-none" : "pointer-events-auto"}>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-6/12 px-4">
          <div className="relative w-full mb-3">
            <label className={inputLabelClass} htmlFor="nameAR">
              שם (עברית)
            </label>
            <input
              name="nameHE"
              type="text"
              className={`${inputClass} ${getInputClass()}`}
              value={selectedProduct?.nameHE || ""}
              onChange={handleInputChange}
              disabled={isDisabled}
            />
          </div>
        </div>
        <div className="w-full lg:w-6/12 px-4">
          <div className="relative w-full mb-3">
            <label className={inputLabelClass} htmlFor="nameAR">
              اسم (عربي)
            </label>
            <input
              name="nameAR"
              type="text"
              className={`${inputClass} ${getInputClass()}`}
              value={selectedProduct?.nameAR || ""}
              onChange={handleInputChange}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-6/12 px-4">
          <div className="relative w-full mb-3 flex items-center">
            <input
              name="isInStore"
              type="checkbox"
              checked={!!selectedProduct?.isInStore}
              onChange={handleInputChange}
              disabled={isDisabled}
              className="mr-2"
            />
            <label className={inputLabelClass} htmlFor="isInStore">
              האם זמין בחנות
            </label>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-6/12 px-4">
          <div className="relative w-full mb-3">
            <label className={inputLabelClass} htmlFor="price">
              מחיר
            </label>
            <input
              name="price"
              type="number"
              className={`${inputClass} ${getInputClass()}`}
              value={selectedProduct?.price || ""}
              onChange={handleInputChange}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>
      {/* Discount Section */}
      <div className="flex flex-wrap">
        <div className="w-full lg:w-6/12 px-4">
          <div className="relative w-full mb-3 flex items-center">
            <input
              name="hasDiscount"
              type="checkbox"
              checked={!!selectedProduct?.hasDiscount}
              onChange={handleInputChange}
              disabled={isDisabled}
              className="mr-2"
            />
            <label className={inputLabelClass} htmlFor="hasDiscount">
              אפשר הנחת כמות
            </label>
          </div>
        </div>
        {selectedProduct?.hasDiscount && (
          <>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className={inputLabelClass} htmlFor="discountQuantity">
                  כמות להנחה (ק"ג)
                </label>
                <input
                  name="discountQuantity"
                  type="number"
                  className={`${inputClass} ${getInputClass()}`}
                  value={selectedProduct?.discountQuantity || ""}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className={inputLabelClass} htmlFor="discountPrice">
                  מחיר כולל להנחה
                </label>
                <input
                  name="discountPrice"
                  type="number"
                  className={`${inputClass} ${getInputClass()}`}
                  value={selectedProduct?.discountPrice || ""}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                />
              </div>
            </div>
          </>
        )}
      </div>
      {/* Description fields */}
      <div className="flex flex-wrap">
        <div className="w-full lg:w-6/12 px-4">
          <div className="relative w-full mb-3">
            <label className={inputLabelClass} htmlFor="descriptionAR">
              תיאור (ערבית)
            </label>
            <textarea
              name="descriptionAR"
              className={`${inputClass} ${getInputClass()}`}
              value={selectedProduct?.descriptionAR || ""}
              onChange={handleInputChange}
              rows={3}
              disabled={isDisabled}
            ></textarea>
          </div>
        </div>
        <div className="w-full lg:w-6/12 px-4">
          <div className="relative w-full mb-3">
            <label className={inputLabelClass} htmlFor="descriptionHE">
              תיאור (עברית)
            </label>
            <textarea
              name="descriptionHE"
              className={`${inputClass} ${getInputClass()}`}
              value={selectedProduct?.descriptionHE || ""}
              onChange={handleInputChange}
              rows={3}
              disabled={isDisabled}
            ></textarea>
          </div>
        </div>
      </div>
      {/* Extras placeholder */}
      <div className="flex flex-wrap">
        <div className="w-full px-4">
          <div className="relative w-full mb-3">
            <label className={inputLabelClass}>
              תוספות (Extras)
            </label>
            <div className="border rounded p-4 bg-blueGray-50 text-blueGray-400">
              <span>ניהול תוספות יתבצע כאן בעתיד (לא מיושם עדיין בווב)</span>
            </div>
          </div>
        </div>
      </div>
      {/* Image upload (unchanged) */}
      <div className="flex flex-wrap">
        <div className="w-full lg:w-12/12 px-4">
          <div className="relative w-full mb-3">
            <label className={inputLabelClass} htmlFor="grid-password">
              הוסף תמונה
            </label>
            <div className="flex justify-center items-center w-full border rounded  shadow">
              {imgFile || selectedProduct?.img ? (
                <div>
                  <img className="w-80 h-60" src={getImgSrc()} />
                </div>
              ) : (
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col justify-center items-center h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col justify-center items-center pt-5 pb-6 w-80 h-60">
                    <svg
                      aria-hidden="true"
                      className="mb-3 w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">בחר תמונה</span>{" "}
                    </p>
                  </div>
                  <input
                    name="img"
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Submit Button */}
      <div className="flex flex-wrap">
        <div className="w-full px-4">
          <div className="relative w-full mb-3">
            <button
              type="button"
              onClick={handlAddClick}
              disabled={isDisabled}
              className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            >
              שמור מוצר
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductInfoForm; 