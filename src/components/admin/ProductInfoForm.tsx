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
  loading: boolean;
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
  loading,
}) => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">פרטי מוצר</h2>
      <form className={isDisabled ? "pointer-events-none" : "pointer-events-auto"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={inputLabelClass} htmlFor="nameHE">
              שם (עברית)
            </label>
            <input
              name="nameHE"
              type="text"
              className={`${inputClass} ${getInputClass()} mb-4`}
              value={selectedProduct?.nameHE || ""}
              onChange={handleInputChange}
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className={inputLabelClass} htmlFor="nameAR">
              اسم (عربي)
            </label>
            <input
              name="nameAR"
              type="text"
              className={`${inputClass} ${getInputClass()} mb-4`}
              value={selectedProduct?.nameAR || ""}
              onChange={handleInputChange}
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className={inputLabelClass} htmlFor="isInStore">
              האם זמין בחנות
            </label>
            <div className="flex items-center gap-2 mb-4">
              <input
                name="isInStore"
                type="checkbox"
                checked={!!selectedProduct?.isInStore}
                onChange={handleInputChange}
                disabled={isDisabled}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">כן</span>
            </div>
          </div>
          <div>
            <label className={inputLabelClass} htmlFor="price">
              מחיר
            </label>
            <input
              name="price"
              type="number"
              className={`${inputClass} ${getInputClass()} mb-4`}
              value={selectedProduct?.price || ""}
              onChange={handleInputChange}
              disabled={isDisabled}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className={inputLabelClass} htmlFor="descriptionAR">
              תיאור (ערבית)
            </label>
            <textarea
              name="descriptionAR"
              className={`${inputClass} ${getInputClass()} mb-4`}
              value={selectedProduct?.descriptionAR || ""}
              onChange={handleInputChange}
              rows={3}
              disabled={isDisabled}
            ></textarea>
          </div>
          <div>
            <label className={inputLabelClass} htmlFor="descriptionHE">
              תיאור (עברית)
            </label>
            <textarea
              name="descriptionHE"
              className={`${inputClass} ${getInputClass()} mb-4`}
              value={selectedProduct?.descriptionHE || ""}
              onChange={handleInputChange}
              rows={3}
              disabled={isDisabled}
            ></textarea>
          </div>
        </div>
        <hr className="my-8" />

        <h3 className="text-xl font-semibold mb-4">הוסף תמונה</h3>
        <div className="flex flex-col items-center mb-8">
          <div className="flex justify-center items-center w-full border rounded shadow relative bg-gray-50 p-4">
            {imgFile || selectedProduct?.img ? (
              <div className="relative flex flex-col items-center">
                <img className="w-80 h-60 object-contain rounded mb-2 border" src={getImgSrc()} />
                {!isDisabled && (
                  <label
                    htmlFor="dropzone-file"
                    className="bg-orange-800 hover:bg-blue-600 text-white rounded px-4 py-2 flex items-center justify-center shadow cursor-pointer mt-2"
                    title="שנה תמונה"
                  >
                    <i className="fas fa-image ml-2"></i> שנה תמונה
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
            ) : (
              <label
                htmlFor="dropzone-file"
                className="flex flex-col justify-center items-center h-64 bg-gray-100 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-200"
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
                  <p className="mb-2 text-sm text-gray-500">
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
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handlAddClick}
            disabled={isDisabled || loading}
            className="bg-blueGray-800 hover:bg-blueGray-700 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
          >
            {loading ? (
              <span className="flex items-center ">
                <svg className="animate-spin h-5 w-5 mr-2 text-white ml-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                טוען...
              </span>
            ) : (
              "שמור מוצר"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductInfoForm; 