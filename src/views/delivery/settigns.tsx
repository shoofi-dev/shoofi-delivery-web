
import Navbar from "components/Navbars/IndexNavbar";
import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { StoreContext } from "stores";

const AdminSettings = () => {

      const { storeDataStore } = useContext(StoreContext);
      const [isStoreClose, setIsStoreClose] = useState<any>(false);

      const handleIsStoreClose = (e: any) => {
        setIsStoreClose(e.target.checked)
        storeDataStore.updateStore(e.target.checked)
      };


  return (
        <>
          <Navbar />
          <div className="w-full  mt-14 md:pt-24 items-center justify-center pb-10 text-lg bg-blueGray-900 h-[100%] text-center ">
            <div className="flex items-center py-4  mx-auto justify-center border border-l-0 border-r-0 ">
              <div className="flex items-center justify-center ">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    id="customCheckLogin"
                    type="checkbox"
                    className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150 bg-gray-800 border bg-white"
                    onChange={handleIsStoreClose}
                    value={storeDataStore.storeData?.isStoreClose}
                    checked={storeDataStore.storeData?.isStoreClose}
                  />
                  <span className="mr-2 text-xl  text-white">مغلق</span>
                </label>
              </div>
  
            </div>
            </div>
            </>
  );
};

export default observer(AdminSettings);
