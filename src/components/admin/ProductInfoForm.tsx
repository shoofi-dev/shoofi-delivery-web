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
}) => {
  return (
    <form className={isDisabled ? "pointer-events-none" : "pointer-events-auto"}>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-6/12 px-4">
          <div className="relative w-full mb-3">
            <label className={inputLabelClass} htmlFor="grid-password">
              שם
            </label>
            <input
              name="name"
              type="text"
              className={`${inputClass} ${getInputClass()}`}
              defaultValue={selectedProduct?.name}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="w-full lg:w-6/12 px-4">
          <div className="relative w-full mb-3">
            <label className={inputLabelClass} htmlFor="grid-password">
              מחיר
            </label>
            <input
              name="price"
              type="number"
              className={`${inputClass} ${getInputClass()}`}
              defaultValue={selectedProduct?.price}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-12/12 px-4">
          <div className="relative w-full mb-3">
            <label className={inputLabelClass} htmlFor="grid-password">
              תיאור מוצר
            </label>
            <textarea
              name="description"
              role="textbox"
              className={`${inputClass} ${getInputClass()}`}
              defaultValue={selectedProduct?.description}
              rows={4}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>
      </div>
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
    </form>
  );
};

export default ProductInfoForm; 