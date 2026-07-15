// src/features/timeline/components/TimelineSearchBar.jsx

import { Search } from "lucide-react";
import { useTimelineSearch } from "../../../context/TimelineSearchContext";

/**
 * Search bar component.
 * Props `value` and `onChange` are optional – when omitted the component
 * syncs with the global TimelineSearchContext.
 */
export default function TimelineSearchBar({ value, onChange, placeholder, className }) {
  const { searchTerm, setSearchTerm } = useTimelineSearch();
  const inputValue = typeof value === "string" ? value : searchTerm;
  const handleChange = (e) => {
    const newVal = e.target.value;
    if (typeof onChange === "function") {
      onChange(newVal);
    }
    setSearchTerm(newVal);
  };

  return (
    <div className={`relative ${className || ""}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        className="block w-full max-w-2xl pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        placeholder={placeholder || "Search…"}
      />
    </div>
  );
}
