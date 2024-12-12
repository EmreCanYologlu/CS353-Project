import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { vehicleService, searchService } from '../services/api';
import VehicleCard from '../components/vehicles/VehicleCard';
import SearchBar from '../components/layout/Searchbar';
import { Car, DollarSign, Users } from 'lucide-react';
import { Vehicle } from '@/types';

const HomePage = () => {
  const { data: featuredVehicles, isLoading: isLoadingVehicles } = useQuery<{ vehicles: Vehicle[] }>(
    'featuredVehicles',
    () => vehicleService.getVehicles({ per_page: 6, sort_by: 'created_at', sort_order: 'desc' })
  );

  const { data: popularSearches } = useQuery(
    'popularSearches',
    searchService.getPopularSearches
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 px-4 rounded-lg text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Find Your Perfect Car
          </h1>
          <p className="text-lg mb-8">
            Browse thousands of cars from verified sellers and dealerships
          </p>
          <SearchBar className="max-w-2xl mx-auto" initialQuery={''} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <Car className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
            <p className="text-gray-600">
              Browse through thousands of verified vehicles
            </p>
          </div>
          <div className="text-center p-6">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">Best Deals</h3>
            <p className="text-gray-600">
              Find competitive prices and make offers
            </p>
          </div>
          <div className="text-center p-6">
            <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">Trusted Sellers</h3>
            <p className="text-gray-600">
              Connect with verified sellers and dealerships
            </p>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Vehicles</h2>
          <Link
            to="/ads"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            View All
          </Link>
        </div>
        {isLoadingVehicles ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVehicles?.vehicles.map((vehicle: Vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Searches Section */}
      {popularSearches && (
        <section className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Popular Searches</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularSearches.popular_makes.map((make: { make: string; count: number }) => (
              <Link
                key={make.make}
                to={`/ads?make=${make.make}`}
                className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold">{make.make}</h3>
                <p className="text-sm text-gray-600">{make.count} vehicles</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;