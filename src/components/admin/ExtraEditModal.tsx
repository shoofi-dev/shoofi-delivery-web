import React, { useState } from "react";

const defaultOption = () => ({ id: "", name: "", price: 0 });
const defaultAreaOption = () => ({ id: "", name: "", price: 0 });

type ExtraType = "single" | "multi" | "counter" | "pizza-topping";
type AreaOption = { id: string; name: string; price: number };
type Option = { 
  id: string; 
  name: string; 
  price?: number;
  areaOptions?: AreaOption[];
};
type Extra = {
  id: string;
  type: ExtraType;
  title: string;
  options?: Option[];
  [key: string]: any;
};

const ExtraEditModal = ({ 
  extra, 
  onSave, 
  onClose, 
  onCreateGlobalExtra 
}: { 
  extra?: Extra | null; 
  onSave: (extra: Extra) => void; 
  onClose: () => void; 
  onCreateGlobalExtra?: (extra: Extra) => void; 
}) => {
  const [type, setType] = useState<ExtraType>(extra?.type || "single");
  const [title, setTitle] = useState(extra?.title || "");
  const [options, setOptions] = useState<Option[]>(extra?.options || [defaultOption()]);

  const handleOptionChange = (idx: number, field: string, value: string | number) => {
    setOptions((opts) =>
      opts.map((opt, i) => (i === idx ? { ...opt, [field]: field === "price" ? Number(value) : value } : opt))
    );
  };

  const handleAreaOptionChange = (optionIdx: number, areaIdx: number, field: string, value: string | number) => {
    setOptions((opts) =>
      opts.map((opt, i) => {
        if (i === optionIdx && opt.areaOptions) {
          const updatedAreaOptions = opt.areaOptions.map((area, j) => 
            j === areaIdx ? { ...area, [field]: field === "price" ? Number(value) : value } : area
          );
          return { ...opt, areaOptions: updatedAreaOptions };
        }
        return opt;
      })
    );
  };

  const handleAddOption = () => {
    const newOption = { 
      ...defaultOption(), 
      id: Math.random().toString(36).substr(2, 9),
      areaOptions: type === "pizza-topping" ? [
        { id: "full", name: "Full Pizza", price: 0 },
        { id: "half1", name: "First Half", price: 0 },
        { id: "half2", name: "Second Half", price: 0 },
        { id: "quarter1", name: "First Quarter", price: 0 },
        { id: "quarter2", name: "Second Quarter", price: 0 },
        { id: "quarter3", name: "Third Quarter", price: 0 },
        { id: "quarter4", name: "Fourth Quarter", price: 0 }
      ] : undefined
    };
    setOptions((opts) => [...opts, newOption]);
  };

  const handleRemoveOption = (idx: number) =>
    setOptions((opts) => opts.filter((_, i) => i !== idx));

  const handleSave = () => {
    const newExtra = {
      id: extra?.id || Math.random().toString(36).substr(2, 9),
      type,
      title,
      options,
    };
    onSave(newExtra);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{extra ? "ערוך תוספת" : "הוסף תוספת"}</h2>
        <div className="mb-3">
          <label className="block font-bold mb-1">סוג תוספת</label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={type}
            onChange={(e) => setType(e.target.value as ExtraType)}
          >
            <option value="single">בחירה בודדת</option>
            <option value="multi">בחירה מרובה</option>
            <option value="counter">מונה</option>
            <option value="pizza-topping">תוספת פיצה</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block font-bold mb-1">שם תוספת</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {/* Options */}
        <div className="mb-3">
          <label className="block font-bold mb-1">אפשרויות</label>
          {options.map((opt, idx) => (
            <div key={idx} className="mb-4 p-3 border rounded">
              <div className="flex gap-2 mb-2">
                <input
                  className="border rounded px-2 py-1 flex-1"
                  placeholder="שם"
                  value={opt.name}
                  onChange={(e) => handleOptionChange(idx, "name", e.target.value)}
                />
                {type !== "pizza-topping" && (
                  <input
                    className="border rounded px-2 py-1 w-24"
                    placeholder="מחיר"
                    type="number"
                    value={opt.price}
                    onChange={(e) => handleOptionChange(idx, "price", e.target.value)}
                  />
                )}
                <button
                  className="text-red-600"
                  onClick={() => handleRemoveOption(idx)}
                  type="button"
                >
                  הסר
                </button>
              </div>
              {/* Area Options for Pizza Toppings */}
              {type === "pizza-topping" && opt.areaOptions && (
                <div className="mt-2 pl-4 border-l-2 border-gray-200">
                  <label className="block font-semibold mb-2">מחירים לפי אזורים</label>
                  {opt.areaOptions.map((area, areaIdx) => (
                    <div key={areaIdx} className="flex gap-2 mb-2">
                      <span className="w-32">{area.name}</span>
                      <input
                        className="border rounded px-2 py-1 w-24"
                        placeholder="מחיר"
                        type="number"
                        value={area.price}
                        onChange={(e) => handleAreaOptionChange(idx, areaIdx, "price", e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            className="bg-blueGray-200 px-2 py-1 rounded"
            onClick={handleAddOption}
            type="button"
          >
            הוסף אפשרות
          </button>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            ביטול
          </button>
          <button className="bg-blueGray-800 text-white px-4 py-2 rounded" onClick={handleSave}>
            שמור
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtraEditModal;