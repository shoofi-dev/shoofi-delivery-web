import React, { useEffect, useState } from "react";
import { axiosInstance } from "utils/http-interceptor";

interface City {
  _id: string;
  nameAR: string;
  nameHE: string;
}

interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CitySelect: React.FC<CitySelectProps> = ({ value, onChange, className }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
      setLoading(true);
      axiosInstance.get("/delivery/cities").then((res: any) => {
        console.log("res",res)
        setCities(res);
        setLoading(false);
        onChange(res[0]._id);
      });
    
  }, []);

  if (loading) {
    return <select className={className || "border p-2 rounded"} disabled><option>Loading...</option></select>;
  }

  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={className || "border p-2 rounded rtl-select"}
    >
      <option value="">בחר עיר</option>
      {cities.map(city => (
        <option key={city._id} value={city._id}>
          {city.nameAR} / {city.nameHE}
        </option>
      ))}
    </select>
  );
};

export default CitySelect; 