import axios from "axios";
import { BASE_URL } from "consts/api";
import { TProduct } from "shared/types/product";
import { axiosInstance } from "utils/http-interceptor";

export const addNewProductApi = (product: TProduct, storeAppName: string) => {
  let formData = new FormData();
  product.nameAR && formData.append("nameAR", product.nameAR);
  product.nameHE && formData.append("nameHE", product.nameHE);

  // Image
  product.img && formData.append("img", product.img);

  // Category
  product.categoryId && formData.append("categoryId", product.categoryId);

  // Descriptions
  formData.append("descriptionAR", product.descriptionAR || "");
  formData.append("descriptionHE", product.descriptionHE || "");
  formData.append("notInStoreDescriptionAR", product.notInStoreDescriptionAR || "");
  formData.append("notInStoreDescriptionHE", product.notInStoreDescriptionHE || "");

  // isInStore
  formData.append("isInStore", product.isInStore?.toString() || "false");

  // Extras and Others
  product.extras && formData.append("extras", JSON.stringify(product.extras));
  product.others && formData.append("others", JSON.stringify(product.others));

  // Price
  product.price && formData.append("price", JSON.stringify(product.price));

  // Discount fields
  formData.append("hasDiscount", product.hasDiscount?.toString() || "false");
  if (product.hasDiscount) {
    formData.append("discountQuantity", product.discountQuantity?.toString() || "0");
    formData.append("discountPrice", product.discountPrice?.toString() || "0");
  }

  return axiosInstance
    .post(BASE_URL + "admin/product/insert", formData, {
      headers: { "Content-Type": "multipart/form-data", "app-name": storeAppName },
    })
    .then(function (response) {
      return response.data;
    });
};

export default addNewProductApi;

// JSON.stringify({
//   name: product.name,
//   img: product.img,
//   categoryId: product.categoryId,
//   description: product.description,
//   price: product.price
// }