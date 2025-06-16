import React, { useState } from "react";
import { ExtraGroup } from "../../types/extra";

interface GroupEditModalProps {
  group?: ExtraGroup | null;
  onSave: (group: ExtraGroup) => void;
  onClose: () => void;
}

const GroupEditModal = ({ group, onSave, onClose }: GroupEditModalProps) => {
  const [nameAR, setNameAR] = useState(group?.nameAR || "");
  const [nameHE, setNameHE] = useState(group?.nameHE || "");
  const [order, setOrder] = useState(group?.order || 0);
  const [freeCount, setFreeCount] = useState<number>(group?.freeCount ?? 0);

  const handleSave = () => {
    onSave({
      id: group?.id || Math.random().toString(36).substr(2, 9),
      nameAR,
      nameHE,
      order,
      freeCount,
      extras: group?.extras || []
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/2">
        <h2 className="text-xl font-bold mb-4">{group ? "ערוך קבוצה" : "הוסף קבוצה"}</h2>
        <div className="mb-3">
          <label className="block font-bold mb-1">שם קבוצה (ערבית)</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={nameAR}
            onChange={(e) => setNameAR(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block font-bold mb-1">שם קבוצה (עברית)</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={nameHE}
            onChange={(e) => setNameHE(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block font-bold mb-1">סדר</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          />
        </div>
        <div className="mb-3">
          <label className="block font-bold mb-1">כמות תוספות חינם</label>
          <input
            className="border rounded px-3 py-2 w-full"
            type="number"
            min={0}
            value={freeCount}
            onChange={(e) => setFreeCount(Number(e.target.value))}
          />
          <div className="text-xs text-gray-500 mt-1">מספר התוספות הראשונות שיהיו בחינם</div>
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

export default GroupEditModal; 