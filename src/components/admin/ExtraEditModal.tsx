import React, { useState } from "react";
import {
  Extra,
  Option,
  ExtraType,
  AreaOption,
  ExtraGroup,
} from "../../types/extra";

const defaultPizzaOptions = [
  { id: "full", name: "full-pizza", price: 0 },
  { id: "half1", name: "first-half", price: 0 },
  { id: "half2", name: "second-half", price: 0 },
];
function arabicToEnglishNumber(str: string): string {
  return str.replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);
}
const defaultOption = (type: ExtraType) => ({
  id: Math.random().toString(36).substr(2, 9),
  nameAR: "",
  nameHE: "",
  price: 0,
  areaOptions: type === "pizza-topping" ? defaultPizzaOptions : undefined,
});

const ExtraEditModal = ({
  extra,
  onSave,
  onClose,
  onCreateGlobalExtra,
  groupId,
  groups = [],
}: {
  extra?: Extra | null;
  onSave: (extra: Extra) => void;
  onClose: () => void;
  onCreateGlobalExtra?: (extra: Extra) => void;
  groupId?: string;
  groups?: ExtraGroup[];
}) => {
  const [type, setType] = useState<ExtraType>(extra?.type || "single");
  const [nameAR, setNameAR] = useState(extra?.nameAR || "");
  const [nameHE, setNameHE] = useState(extra?.nameHE || "");
  const [order, setOrder] = useState(extra?.order || 0);
  const [options, setOptions] = useState<Option[]>(
    extra?.options || [defaultOption(type)]
  );
  const [maxCount, setMaxCount] = useState<number>(extra?.maxCount || 1);
  const [min, setMin] = useState<number>(extra?.min ?? 0);
  const [max, setMax] = useState<number>(extra?.max ?? 10);
  const [step, setStep] = useState<number>(extra?.step ?? 1);
  const [defaultValue, setDefaultValue] = useState<number>(
    extra?.defaultValue ?? min
  );
  const [price, setPrice] = useState<number>(extra?.price ?? 0);
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(
    extra?.groupId || groupId
  );
  const [defaultOptionId, setDefaultOptionId] = useState<string | undefined>(
    extra?.defaultOptionId
  );
  const [defaultOptionIds, setDefaultOptionIds] = useState<string[]>(
    extra?.defaultOptionIds || []
  );

  // Update options when type changes
  React.useEffect(() => {
    if (
      type === "pizza-topping" &&
      (!options.length || !options[0].areaOptions)
    ) {
      setOptions([defaultOption(type)]);
    }
  }, [type]);

  // When options change, ensure defaultOptionId(s) are valid
  React.useEffect(() => {
    if (type === "single" && options.length > 0) {
      if (defaultOptionId && !options.find(opt => opt.id === defaultOptionId)) {
        setDefaultOptionId(undefined);
      }
    }
    if (type === "multi" && options.length > 0) {
      setDefaultOptionIds(ids => ids.filter(id => options.some(opt => opt.id === id)));
    }
  }, [options, type]);

  const handleOptionChange = (
    idx: number,
    field: string,
    value: string | number
  ) => {
    setOptions((opts) =>
      opts.map((opt, i) =>
        i === idx
          ? { ...opt, [field]: field === "price" ? Number(value) : value }
          : opt
      )
    );
  };

  const handleAreaOptionChange = (
    optionIdx: number,
    areaIdx: number,
    field: string,
    value: string | number,
    areaId: string
  ) => {
    setOptions((opts) =>
      opts.map((opt, i) => {
        if (i === optionIdx && opt.areaOptions) {
          const updatedAreaOptions = opt.areaOptions.map((area, j) =>{
            if(j === areaIdx){
              return { ...area, [field]: field === "price" ? Number(value) : value }
            }
            if(areaId === "full" && (area.id === "half1" || area.id === "half2")){
              return { ...area, [field]: field === "price" ? Number(value) / 2 : value }
            }
            return area
          }
          );
          return { ...opt, areaOptions: updatedAreaOptions };
        }
        return opt;
      })
    );
  };

  const handleAddOption = () => {
    const newOption = {
      ...defaultOption(type),
      id: Math.random().toString(36).substr(2, 9),
    };
    setOptions((opts) => [...opts, newOption]);
  };

  const handleRemoveOption = (idx: number) =>
    setOptions((opts) => opts.filter((_, i) => i !== idx));

  const handleSave = () => {
    const newExtra = {
      id: extra?.id || Math.random().toString(36).substr(2, 9),
      type,
      nameAR,
      nameHE,
      order,
      options,
      ...(type === "multi" ? { maxCount, defaultOptionIds } : {}),
      ...(type === "single" ? { defaultOptionId } : {}),
      ...(type === "counter" ? { min, max, step, defaultValue, price } : {}),
      ...(type === "weight" ? { min, max, step, defaultValue, price } : {}),
      ...(selectedGroupId ? { groupId: selectedGroupId } : {}),
    };
    onSave(newExtra);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/2">
        <h2 className="text-xl font-bold mb-4">
          {extra ? "ערוך תוספת" : "הוסף תוספת"}
        </h2>
        <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
          <div className="mb-3">
            <label className="block font-bold mb-1">קבוצה</label>
            <select
              className="border rounded px-3 py-2 w-full rtl-select"
              value={selectedGroupId || ""}
              onChange={(e) => setSelectedGroupId(e.target.value || undefined)}
            >
              <option value="">ללא קבוצה</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.nameAR}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block font-bold mb-1">סוג תוספת</label>
            <select
              className="border rounded px-3 py-2 w-full rtl-select"
              value={type}
              onChange={(e) => setType(e.target.value as ExtraType)}
            >
              <option value="single">בחירה בודדת</option>
              <option value="multi">בחירה מרובה</option>
              <option value="counter">מונה</option>
              <option value="weight">משקל</option>
              <option value="pizza-topping">תוספת פיצה</option>
            </select>
          </div>
          {type === "multi" && (
            <div className="mb-3">
              <label className="block font-bold mb-1">מקסימום בחירות</label>
              <input
                className="border rounded px-3 py-2 w-full"
                type="number"
                min={1}
                value={maxCount}
                onChange={(e) => setMaxCount(Number(e.target.value))}
              />
            </div>
          )}
          {(type === "weight" || type === "counter") && (
            <>
              <div className="mb-3">
                <label className="block font-bold mb-1">שם תוספת (ערבית)</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={nameAR}
                  onChange={(e) => setNameAR(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="block font-bold mb-1">שם תוספת (עברית)</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={nameHE}
                  onChange={(e) => setNameHE(e.target.value)}
                />
              </div>
            </>
          )}
          {type === "counter" && (
            <>
              <div className="mb-3">
                <label className="block font-bold mb-1">ערך מינימלי</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  type="number"
                  value={min}
                  onChange={(e) => setMin(Number(e.target.value))}
                />
              </div>
              <div className="mb-3">
                <label className="block font-bold mb-1">ערך מקסימלי</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  type="number"
                  value={max}
                  onChange={(e) => setMax(Number(e.target.value))}
                />
              </div>
              <div className="mb-3">
                <label className="block font-bold mb-1">שלב (Step)</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  type="number"
                  value={step}
                  onChange={(e) => setStep(Number(e.target.value))}
                />
              </div>
              <div className="mb-3">
                <label className="block font-bold mb-1">ערך ברירת מחדל</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  type="number"
                  value={defaultValue}
                  onChange={(e) => setDefaultValue(Number(e.target.value))}
                />
              </div>
            </>
          )}
          {type === "weight" && (
            <>
              <div className="mb-3">
                <label className="block font-bold mb-1">משקל מינימלי</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  type="number"
                  step="0.1"
                  value={min}
                  onChange={(e) => setMin(Number(e.target.value))}
                />
              </div>
              <div className="mb-3">
                <label className="block font-bold mb-1">משקל מקסימלי</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  type="number"
                  step="0.1"
                  value={max}
                  onChange={(e) => setMax(Number(e.target.value))}
                />
              </div>
              <div className="mb-3">
                <label className="block font-bold mb-1">קפיצה</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  type="number"
                  step="0.1"
                  value={step}
                  onChange={(e) => setStep(Number(e.target.value))}
                />
              </div>
              <div className="mb-3">
                <label className="block font-bold mb-1">משקל ברירת מחדל</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  type="number"
                  step="0.1"
                  value={defaultValue}
                  onChange={(e) => setDefaultValue(Number(e.target.value))}
                />
              </div>
              <div className="mb-3">
                <label className="block font-bold mb-1">מחיר</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
            </>
          )}
          <div className="mb-3">
            <label className="block font-bold mb-1">סדר</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={order}
              onChange={(e) => setOrder(Number(arabicToEnglishNumber(e.target.value)))}
            />
          </div>
          {/* Options - only show if not counter type */}
          {type !== "counter" && type !== "weight" && (
            <div className="mb-3">
              <label className="block font-bold mb-1">אפשרויות</label>
              {options.map((opt, idx) => (
                <div key={idx} className="mb-4 p-3 border rounded">
                  <div className="flex gap-2 mb-2 items-center">
                    {/* Default selector */}
                    {type === "single" && (
                      <input
                        type="radio"
                        name="defaultSingleOption"
                        checked={defaultOptionId === opt.id}
                        onChange={() =>
                          setDefaultOptionId(defaultOptionId === opt.id ? undefined : opt.id)
                        }
                        className="mr-2"
                        title="בחר כברירת מחדל"
                      />
                    )}
                    {type === "multi" && (
                      <input
                        type="checkbox"
                        checked={defaultOptionIds.includes(opt.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setDefaultOptionIds(ids => [...ids, opt.id]);
                          } else {
                            setDefaultOptionIds(ids => ids.filter(id => id !== opt.id));
                          }
                        }}
                        className="mr-2"
                        title="בחר כברירת מחדל"
                      />
                    )}
                    <input
                      className="border rounded px-2 py-1 flex-1"
                      placeholder="שם (ערבית)"
                      value={opt.nameAR}
                      onChange={(e) =>
                        handleOptionChange(idx, "nameAR", e.target.value)
                      }
                    />
                    <input
                      className="border rounded px-2 py-1 flex-1"
                      placeholder="שם (עברית)"
                      value={opt.nameHE}
                      onChange={(e) =>
                        handleOptionChange(idx, "nameHE", e.target.value)
                      }
                    />
                    {type !== "pizza-topping" && (
                      <input
                        className="border rounded px-2 py-1 w-24"
                        placeholder="מחיר"
                        type="number"
                        value={opt.price}
                        onChange={(e) =>
                          handleOptionChange(idx, "price", e.target.value)
                        }
                      />
                    )}
                    {type !== "pizza-topping" && (
                      <button
                        className="text-red-600"
                        onClick={() => handleRemoveOption(idx)}
                        type="button"
                      >
                        הסר
                      </button>
                    )}
                  </div>
                  {/* Area Options for Pizza Toppings */}
                  {type === "pizza-topping" && opt.areaOptions && (
                    <div className="mt-2 pl-4 border-l-2 border-gray-200">
                      <label className="block font-semibold mb-2">
                        מחירים לפי אזורים
                      </label>
                      {opt.areaOptions.map((area, areaIdx) => (
                        <div key={areaIdx} className="flex gap-2 mb-2">
                          <span className="w-32">{area.name}</span>
                          <input
                            className="border rounded px-2 py-1 w-24"
                            placeholder="מחיר"
                            type="number"
                            value={area.price}
                            onChange={(e) =>
                              handleAreaOptionChange(
                                idx,
                                areaIdx,
                                "price",
                                e.target.value,
                                area.id
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {type !== "pizza-topping" && (
                <button
                  className="bg-blueGray-200 px-2 py-1 rounded"
                  onClick={handleAddOption}
                  type="button"
                >
                  הוסף אפשרות
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            ביטול
          </button>
          <button
            className="bg-blueGray-800 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            שמור
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtraEditModal;
