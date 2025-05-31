import getCategoriesListApi from "apis/admin/category/get-categories";
import getProductsListApi from "apis/admin/product/get-products-list";
import { cdnUrl } from "consts/shared";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TCategory } from "shared/types/category";

export default function CategoriesList() {
  const [categorytList, setCategorytList] = useState<TCategory[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
  //   getCategoriesListApi().then((res)=>{
  //    console.log(res)
  //    setCategorytList(res);
  //  })

   getProductsListApi().then((res) => {
    setCategorytList(res);
  });
  }, []);

  if(!categorytList){
    return null;
  }
  return (
       <div className="flex flex-wrap justify-center relative">
     <div className="w-full px-4">
      <h1 className="text-4xl m-auto w-fit">קטגוריות</h1>
      <button
        className="bg-blueGray-800 text-white px-6 py-2 rounded shadow mb-6 mt-4"
        onClick={() => navigate("/admin/category/add")}
      >
        הוסף קטגוריה
      </button>
      <div className="flex gap-5 flex-wrap mt-10 -mx-1 lg:-mx-4">
        {categorytList.map((category) => (
          <Link
            className="my-1 px-1 transition duration-500 hover:scale-105"
            to={`/admin/category/edit/${category?._id}`}
          >
            <div>
              <article className="overflow-hidden rounded-lg shadow-lg">
                <img
                  alt="Placeholder"
                  className="block  w-80 h-40"
                  src={`${cdnUrl}${category.image.uri}`}
                />
                <div className="flex items-center leading-tight p-2 md:p-4">
                  <div className="text-lg w-full text-center">
                    <span className="text-black	">{category?.nameAR}</span>
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
