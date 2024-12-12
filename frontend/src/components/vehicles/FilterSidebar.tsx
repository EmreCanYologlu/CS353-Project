import React from 'react';
import { X } from 'lucide-react';

interface Filters {
  make: string;
  model: string;
  year_min: string;
  year_max: string;
  price_min: string;
  price_max: string;
  condition: string;
}

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onClose?: () => void;
}

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onClose,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      make: '',
      model: '',
      year_min: '',
      year_max: '',
      price_min: '',
      price_max: '',
      condition: '',
    });
  };

  return (
    <div className="bg-white h-full p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Filters</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Make and Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Make
          </label>
          <input
            type="text"
            name="make"
            value={filters.make}
            onChange={handleInputChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter make"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model
          </label>
          <input
            type="text"
            name="model"
            value={filters.model}
            onChange={handleInputChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter model"
          />
        </div>

        {/* Year Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year Range
          </label>
          <div className="grid grid-cols-2 gap-4">
            <select
              name="year_min"
              value={filters.year_min}
              onChange={handleInputChange}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Min Year</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              name="year_max"
              value={filters.year_max}
              onChange={handleInputChange}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Max Year</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="price_min"
              value={filters.price_min}
              onChange={handleInputChange}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Min Price"
              min="0"
            />
            <input
              type="number"
              name="price_max"
              value={filters.price_max}
              onChange={handleInputChange}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Max Price"
              min="0"
            />
          </div>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <select
            name="condition"
            value={filters.condition}
            onChange={handleInputChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Any Condition</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div>
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;