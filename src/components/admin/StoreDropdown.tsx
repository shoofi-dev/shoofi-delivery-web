import { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/http-interceptor";

interface StoreDropdownProps {
  value: string;
  onChange: (value: Store) => void;
  label?: string;
}

export interface Store {
  name_ar: string;
  appName: string;
  categoryIds?: string[];
}

const StoreDropdown: React.FC<StoreDropdownProps> = ({
  value,
  onChange,
  label,
}) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect", value);
    axiosInstance.get("/shoofiAdmin/store/all").then((res: any) => {
      setStores(res);
      if (value) {
        handleOnChange(value, res);
      }
      setLoading(false);
    });
  }, [value]);

  const handleOnChange = (e: any, storesRes: Store[]) => {
    console.log("handleOnChange", storesRes);
    let store = null;

    if (stores.length > 0) {
      store = stores.find(
        (store) => store.appName === e?.target?.value || store.appName === e
      );
    } else {
      store = storesRes.find(
        (store) => (store.appName === e?.target?.value || store.appName === e)
      );
    }
    console.log(" e?.target?.value || store.appName === e",  e?.target?.value , e, storesRes)

    console.log("store", store)
    if (store) {
      onChange(store);
    }
  };

  if (!stores.length) return null;
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="mb-1 font-bold">{label}</label>}
      <select
        dir="rtl"
        className="border rounded px-3 py-2 text-right pr-8 rtl-select"
        value={value}
        onChange={(e) => handleOnChange(e.target.value, [])}
        disabled={loading}
      >
        <option value="">בחר חנות</option>
        {stores.map((store) => (
          <option key={store.appName} value={store.appName}>
            {store.name_ar}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StoreDropdown;
