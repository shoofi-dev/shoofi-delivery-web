import { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/http-interceptor";

interface StoreDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

interface Store {
  storeName: string;
  appName: string;
}

const StoreDropdown: React.FC<StoreDropdownProps> = ({ value, onChange, label }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/shoofiAdmin/store/all")
      .then((res: any) => {
        setStores(res);
        setLoading(false);
      });
  }, []);


  return (
    <div className="flex flex-col mb-4">
      {label && <label className="mb-1 font-bold">{label}</label>}
      <select
        className="border rounded px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
      >
        <option value="">בחר חנות</option>
        {stores.map((store) => (
          <option key={store.appName} value={store.appName}>
            {store.storeName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StoreDropdown; 