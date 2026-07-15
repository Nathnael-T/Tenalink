// src/features/timeline/components/TimelineFilterBar.jsx
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { useTimelineSearch } from '../../../context/TimelineSearchContext';

/**
 * Filter bar component.
 * Optional `filters`, `onFilterChange`, and `onClearFilters` props allow external control.
 * When omitted the component reads/writes the global TimelineSearchContext.
 */
export default function TimelineFilterBar({ filters: propFilters, onFilterChange, onClearFilters }) {
  const { filters: ctxFilters, setFilters, clearAllFilters } = useTimelineSearch();
  const filters = propFilters || ctxFilters;

  const [isOpen, setIsOpen] = useState(false);

  // Canonical timeline event types
  const filterOptions = [
    {
      id: 'type',
      label: 'Type',
      options: [
        'All',
        'Visit Created',
        'Diagnosis Added',
        'Prescription Issued',
        'Lab Result Uploaded',
        'Doctor Note Added',
      ],
    },
    { id: 'date', label: 'Date', options: ['All', 'Today', 'This Week', 'This Month', 'This Year'] },
    { id: 'status', label: 'Status', options: ['All', 'Completed', 'Pending', 'Cancelled'] },
  ];

  const handleFilterSelect = (filterId, value) => {
    const newFilters = { ...filters, [filterId]: value };
    if (typeof onFilterChange === 'function') {
      onFilterChange(newFilters);
    }
    setFilters(newFilters);
  };

  const handleClear = () => {
    if (typeof onClearFilters === 'function') {
      onClearFilters();
    }
    clearAllFilters();
  };

  const hasActiveFilters = filters && Object.keys(filters).some(key => filters[key] && filters[key] !== 'All');

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
          hasActiveFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Filter className="h-4 w-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="ml-1 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
            {Object.keys(filters).filter(key => filters[key] && filters[key] !== 'All').length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-700">Filter Options</h4>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>

          {filterOptions.map(filter => (
            <div key={filter.id} className="mb-3 last:mb-0">
              <label className="block text-sm font-medium text-gray-600 mb-1">{filter.label}</label>
              <select
                value={filters?.[filter.id] || 'All'}
                onChange={e => handleFilterSelect(filter.id, e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {filter.options.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {hasActiveFilters && (
            <button onClick={handleClear} className="mt-3 w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}