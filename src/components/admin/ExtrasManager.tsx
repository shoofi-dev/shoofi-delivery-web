import React, { useEffect, useState } from "react";
import ExtraEditModal from "./ExtraEditModal";
import GroupEditModal from "./GroupEditModal";
import { Extra, Option, ExtraType, AreaOption, ExtraGroup } from "../../types/extra";

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
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ExtraGroup | null>(null);

  useEffect(() => {
    setAssignedExtras(value || []);
  }, [value]);

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

  const handleSaveGroup = (group: ExtraGroup) => {
    // If this is a new group, create a new extra with the group info
    if (!editingGroup) {
      const newExtra: Extra = {
        id: group.id,
        type: "single",
        nameAR: group.nameAR,
        nameHE: group.nameHE,
        groupId: group.id,
        options: [],
        isGroupHeader: true, // Mark this as a group header
      };
      setAssignedExtras((prev) => {
        const updated = [...prev, newExtra];
        onChange(updated);
        return updated;
      });
    } else {
      // If editing existing group, update all extras in the group
      setAssignedExtras((prev) => {
        const updated = prev.map((extra) => {
          if (extra.groupId === group.id) {
            return { ...extra, nameAR: group.nameAR, nameHE: group.nameHE };
          }
          return extra;
        });
        onChange(updated);
        return updated;
      });
    }
    setEditingGroup(null);
    setShowGroupModal(false);
  };

  const handleRemoveExtra = (id: string) => {
    setAssignedExtras((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      onChange(updated);
      return updated;
    });
  };

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

  // Group extras by groupId
  const groupedExtras = assignedExtras?.reduce((acc, extra) => {
    if (extra.groupId) {
      if (!acc[extra.groupId]) {
        acc[extra.groupId] = [];
      }
      acc[extra.groupId].push(extra);
    } else {
      if (!acc.ungrouped) {
        acc.ungrouped = [];
      }
      acc.ungrouped.push(extra);
    }
    return acc;
  }, {} as Record<string, Extra[]>);

  // Get all unique groups from assigned extras
  const groups = Object.entries(groupedExtras)
    .filter(([groupId]) => groupId !== "ungrouped")
    .map(([groupId, extras]) => ({
      id: groupId,
      nameAR: extras[0].nameAR,
      nameHE: extras[0].nameHE,
      extras,
    }));

  return (
    <div className="bg-blueGray-50 rounded p-4 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">תוספות למוצר</h3>
        <div className="flex gap-2">
          <button
            className="bg-blueGray-800 text-white px-4 py-2 rounded"
            onClick={() => setShowGroupModal(true)}
            type="button"
          >
            צור קבוצה
          </button>
          <button
            className="bg-blueGray-800 text-white px-4 py-2 rounded"
            onClick={() => setShowAddModal(true)}
            type="button"
          >
            הוסף תוספת חדשה
          </button>
        </div>
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
          {globalExtras
            ?.filter(
              (e) =>
                e.nameAR?.includes(search) &&
                e.nameHE?.includes(search) &&
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

      {/* List grouped extras */}
      <div>
        {Object.entries(groupedExtras).map(([groupId, extras]) => (
          <div key={groupId} className="mb-6">
            {groupId !== "ungrouped" ? (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-blueGray-100 px-4 py-3 flex justify-between items-center border-b">
                  <h4 className="text-lg font-semibold">{extras[0].nameAR}</h4>
                  <button
                    className="text-blue-600"
                    onClick={() => setEditingGroup({ id: groupId, nameAR: extras[0].nameAR, nameHE: extras[0].nameHE, extras })}
                  >
                    ערוך קבוצה
                  </button>
                </div>
                <div className="bg-white p-4 space-y-3">
                  {extras.filter(extra => !extra.isGroupHeader).map((extra) => (
                    <div
                      key={extra.id}
                      className="bg-gray-50 rounded shadow-sm p-3 flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold">{extra.nameAR}</span>
                          <span className="text-sm text-gray-500 mr-2">
                            ({extra.type === "pizza-topping"
                              ? "תוספת פיצה"
                              : extra.type === "single"
                              ? "בחירה בודדת"
                              : extra.type === "multi"
                              ? "בחירה מרובה"
                              : "מונה"})
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
                      {extra.options && (
                        <ul className="pr-4 list-disc">
                          {extra.options.map((opt) => (
                            <li key={opt.id}>{renderOption(opt)}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {extras.map((extra) => (
                  <div
                    key={extra.id}
                    className="bg-white rounded shadow p-3 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold">{extra.nameAR}</span>
                        <span className="text-sm text-gray-500 mr-2">
                          ({extra.type === "pizza-topping"
                            ? "תוספת פיצה"
                            : extra.type === "single"
                            ? "בחירה בודדת"
                            : extra.type === "multi"
                            ? "בחירה מרובה"
                            : "מונה"})
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
                    {extra.options && (
                      <ul className="pr-4 list-disc">
                        {extra.options.map((opt) => (
                          <li key={opt.id}>{renderOption(opt)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      {(showAddModal || editingExtra) && (
        <ExtraEditModal
          extra={editingExtra}
          onSave={handleSaveExtra}
          onClose={() => {
            setEditingExtra(null);
            setShowAddModal(false);
          }}
          onCreateGlobalExtra={onCreateGlobalExtra}
          groups={groups}
        />
      )}

      {(showGroupModal || editingGroup) && (
        <GroupEditModal
          group={editingGroup}
          onSave={handleSaveGroup}
          onClose={() => {
            setEditingGroup(null);
            setShowGroupModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ExtrasManager;