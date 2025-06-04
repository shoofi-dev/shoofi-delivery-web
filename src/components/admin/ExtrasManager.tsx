import React, { useEffect, useState } from "react";
import ExtraEditModal from "./ExtraEditModal";
import { Extra, Option, ExtraType, AreaOption } from "../../types/extra";

type ExtrasManagerProps = {
  value: Extra[];
  onChange: (extras: Extra[]) => void;
  globalExtras: Extra[];
  onCreateGlobalExtra?: (extra: Extra) => void;
};

const ExtrasManager: React.FC<ExtrasManagerProps> = ({
  value,
  onChange,
  globalExtras,
  onCreateGlobalExtra,
}) => {
  const [assignedExtras, setAssignedExtras] = useState<Extra[]>(value || []);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExtra, setEditingExtra] = useState<Extra | null>(null);
  useEffect(() => {
    setAssignedExtras(value || []);
  }, [value]);
  // Add or update an extra for this product
  const handleSaveExtra = (extra: Extra) => {
    setAssignedExtras((prev) => {
      const exists = prev.find((e) => e.id === extra.id);
      let updated;
      if (exists) {
        updated = prev.map((e) => (e.id === extra.id ? extra : e));
      } else {
        updated = [...prev, extra];
      }
      onChange(updated);
      return updated;
    });
    setEditingExtra(null);
    setShowAddModal(false);
  };

  // Remove an extra from this product
  const handleRemoveExtra = (id: string) => {
    setAssignedExtras((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      onChange(updated);
      return updated;
    });
  };

  // Assign a global extra to this product
  const handleAssignGlobal = (extra: Extra) => {
    if (!assignedExtras.find((e) => e.id === extra.id)) {
      handleSaveExtra({ ...extra });
    }
  };

  const renderOption = (opt: Option) => {
    if (opt.areaOptions) {
      return (
        <div className="pr-4">
          <div className="font-medium mb-1">{opt.nameAR}</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {opt.areaOptions.map((area) => (
              <div key={area.id} className="flex justify-between">
                <span>{area.name}</span>
                <span>₪{area.price}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-row gap-2">
        <div>{opt.nameAR}</div>
        <div>{opt.price ? `- ₪${opt.price}` : ""}</div>
      </div>
    );
  };

  console.log("showAddModal",showAddModal)
  return (
    <div className="bg-blueGray-50 rounded p-4 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">תוספות למוצר</h3>
        <button
          className="bg-blueGray-800 text-white px-4 py-2 rounded"
          onClick={() => setShowAddModal(true)}
          type="button"
        >
          הוסף תוספת חדשה
        </button>
      </div>
      {/* Search and assign from global extras */}
      <div className="mb-4">
        <input
          className="border rounded px-3 py-2 w-full mb-2"
          placeholder="חפש תוספת קיימת..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {globalExtras?.filter(
              (e) =>
                e.nameAR?.includes(search) && e.nameHE?.includes(search) &&
                !assignedExtras.find((ae) => ae.id === e.id)
            )
            .map((e) => (
              <button
                key={e.id}
                className="bg-blueGray-200 px-3 py-1 rounded"
                onClick={() => handleAssignGlobal(e)}
              >
                {e.nameAR}
              </button>
            ))}
        </div>
      </div>
      {/* List assigned extras */}
      <div>
        {assignedExtras?.map((extra) => (
          <div
            key={extra.id}
            className="bg-white rounded shadow p-3 mb-3 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold">{extra.nameAR}</span>
                <span className="text-sm text-gray-500 mr-2">
                  ({extra.type === "pizza-topping" ? "תוספת פיצה" : 
                    extra.type === "single" ? "בחירה בודדת" :
                    extra.type === "multi" ? "בחירה מרובה" : "מונה"})
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-blue-600"
                  onClick={() => setEditingExtra(extra)}
                >
                  ערוך
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleRemoveExtra(extra.id)}
                >
                  הסר
                </button>
              </div>
            </div>
            {/* Show options for this extra */}
            {extra.options && (
              <ul className="pr-4 list-disc">
                {extra.options.map((opt) => (
                  <li key={opt.id}>
                    {renderOption(opt)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      {/* Modal for add/edit extra */}
      {(showAddModal || editingExtra) && (
        <ExtraEditModal
          extra={editingExtra}
          onSave={handleSaveExtra}
          onClose={() => {
            setEditingExtra(null);
            setShowAddModal(false);
          }}
          onCreateGlobalExtra={onCreateGlobalExtra}
        />
      )}
    </div>
  );
};

export default ExtrasManager;