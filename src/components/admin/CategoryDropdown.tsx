import React from "react";

interface Category {
  _id: string;
  nameAR: string;
}

interface CategoryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  categories: Category[];
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ value, onChange, label, categories }) => {
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="mb-1 font-bold">{label}</label>}
      <select
        dir="rtl"
        className="border rounded px-4 py-2 text-lg rtl-select w-48"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled hidden>
          בחר קטיגוריה
        </option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.nameAR}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryDropdown; 