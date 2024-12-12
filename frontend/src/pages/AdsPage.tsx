import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { vehicleService } from '../services/api';
import VehicleCard from '../components/vehicles/VehicleCard';
import FilterSidebar from '../components/vehicles/FilterSidebar';
import SearchBar from '../components/layout/Searchbar';
import { Sliders, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Vehicle } from '@/types';

const AdsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filters = {
    q: searchParams.get('q') || '',
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    year_min: searchParams.get('year_min') || '',
    year_max: searchParams.get('year_max') || '',
    price_min: searchParams.get('price_min') || '',
    price_max: searchParams.get('price_max') || '',
    condition: searchParams.get('condition') || '',
    page: parseInt(searchParams.get('page') || '1'),
    per_page: parseInt(searchParams.get('per_page') || '12'),
  };

  const { data, isLoading, error } = useQuery(
    ['vehicles', filters],
    () => vehicleService.getVehicles(filters),
    {
      keepPreviousData: true,
    }
  );

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updatedParams = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        updatedParams.set(key, value.toString());
      } else {
        updatedParams.delete(key);
      }
    });
    setSearchParams(updatedParams);
  };

  return (
    <div className="relative">
      {/* Mobile filter dialog */}
      <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-25 flex items-center justify-center"
           style={{ display: isFilterOpen ? 'flex' : 'none' }}
           onClick={() => setIsFilterOpen(false)}>
        <div className="bg-white w-full h-full" onClick={e => e.stopPropagation()}>
          <FilterSidebar
            filters={filters}
            onFilterChange={updateFilters}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>
      </div>

      <div className="flex">
        {/* Desktop filter sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar filters={filters} onFilterChange={updateFilters} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex-1 min-w-0 mb-4 md:mb-0 md:mr-4">
                <SearchBar initialQuery={filters.q} className="max-w-xl" />
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Sliders className="h-5 w-5 mr-2" />
                  Filters
                </button>
                <Link
                  to="/ads/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Post Ad
                </Link>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-100 h-64 rounded-lg animate-pulse"/>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">Failed to load vehicles</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.vehicles.map((vehicle: Vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>

                {/* Pagination */}
                {data && data.total > filters.per_page && (
                  <div className="mt-8 flex justify-center">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {Array.from({ length: Math.ceil(data.total / filters.per_page) }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => updateFilters({ page: i + 1 })}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            filters.page === i + 1
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsPage;