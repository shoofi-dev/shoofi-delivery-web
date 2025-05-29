import React from "react";

export default function DateRangePicker({ startDate, endDate, onDateChange }) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-700 mr-2">
          From:
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onDateChange("startDate", e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-700 mr-2">
          To:
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onDateChange("endDate", e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
} 