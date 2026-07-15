// src/context/TimelineSearchContext.jsx
import { createContext, useContext, useState } from 'react';

const TimelineSearchContext = createContext();

export const TimelineSearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({});
  };

  return (
    <TimelineSearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        clearAllFilters,
      }}
    >
      {children}
    </TimelineSearchContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTimelineSearch = () => {
  const ctx = useContext(TimelineSearchContext);
  if (!ctx) {
    throw new Error('useTimelineSearch must be used within TimelineSearchProvider');
  }
  return ctx;
};