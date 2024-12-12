import React from 'react';
import { Link } from 'react-router-dom';
import { Gauge, Calendar, DollarSign } from 'lucide-react';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  condition: string;
  description: string;
  predicted_value: number;
  seller: {
    id: number;
    username: string;
  };
}

interface VehicleCardProps {
  vehicle: Vehicle;
  showPredictedValue?: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  showPredictedValue = false 
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  const getConditionColor = (condition: string) => {
    const colors: { [key: string]: string } = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800',
    };
    return colors[condition.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Link
      to={`/ads/${vehicle.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-gray-600 text-sm">
              Listed by {vehicle.seller.username}
            </p>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getConditionColor(
              vehicle.condition
            )}`}
          >
            {vehicle.condition}
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{vehicle.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{formatMileage(vehicle.mileage)} mi</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-blue-600">
              {formatPrice(vehicle.price)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {vehicle.description}
        </p>

        {/* Predicted Value */}
        {showPredictedValue && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-sm text-gray-600">
              Predicted Value:{' '}
              <span className="font-semibold text-green-600">
                {formatPrice(vehicle.predicted_value)}
              </span>
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default VehicleCard;