// src/utils/sort.js
/**
 * Sort an array of objects by the newest date based on provided date keys.
 * @param {Array} arr - Array of objects to sort (will be sorted in place).
 * @param {Array<string>} keys - List of date property names to fall back on, in priority order.
 * @returns {Array} Sorted array (newest first).
 */
export const sortByNewest = (arr, keys) => {
  if (!Array.isArray(arr)) return [];
  const getDate = (item) => {
    for (const key of keys) {
      if (item[key]) {
        const d = new Date(item[key]);
        if (!isNaN(d)) return d.getTime();
      }
    }
    return 0;
  };
  return arr.sort((a, b) => getDate(b) - getDate(a));
};
