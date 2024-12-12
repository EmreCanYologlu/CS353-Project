import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { vehicleService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BidModal from '../components/vehicles/BidModal';
import RatingModal from '../components/user/RatingModal';
import { Calendar, DollarSign, Gauge, Star, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const { data: vehicle, isLoading, error } = useQuery(
    ['vehicle', id],
    () => vehicleService.getVehicleById(parseInt(id!))
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Vehicle</h2>
        <p className="text-gray-600 mb-4">Unable to load vehicle details</p>
        <button
          onClick={() => navigate('/ads')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Return to Listings
        </button>
      </div>
    );
  }

  const handleBid = () => {
    if (!user) {
      toast.error('Please login to place a bid');
      navigate('/login');
      return;
    }
    setIsBidModalOpen(true);
  };

  const handleRating = () => {
    if (!user) {
      toast.error('Please login to leave a rating');
      navigate('/login');
      return;
    }
    setIsRatingModalOpen(true);
  };

  type Condition = 'excellent' | 'good' | 'fair' | 'poor';

  const getConditionColor = (condition: string) => {
    const colors: Record<Condition, string> = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800',
    };
    return colors[condition.toLowerCase() as Condition] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Listed by {vehicle.seller.username}</span>
          <button
            onClick={handleRating}
            className="inline-flex items-center text-yellow-600 hover:text-yellow-700"
          >
            <Star className="h-4 w-4 mr-1" />
            Rate Seller
          </button>
        </div>
      </div>

      {/* Vehicle Image Placeholder */}
      <div className="bg-gray-100 rounded-lg h-64 mb-6 flex items-center justify-center">
        <span className="text-gray-500">Vehicle Image Placeholder</span>
      </div>

      {/* Vehicle Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="text-lg">Year: {vehicle.year}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Gauge className="h-5 w-5 text-gray-500" />
            <span className="text-lg">
              Mileage: {new Intl.NumberFormat().format(vehicle.mileage)} miles
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <span className="text-lg font-semibold text-blue-600">
              Price: {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(vehicle.price)}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <span className="text-gray-600">Condition:</span>
            <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(vehicle.condition)}`}>
              {vehicle.condition}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Predicted Value:</span>
            <span className="ml-2 font-semibold text-green-600">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(vehicle.predicted_value)}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-gray-600 whitespace-pre-line">{vehicle.description}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        {user?.id !== vehicle.seller.id && (
          <button
            onClick={handleBid}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Place Bid
          </button>
        )}
        <button
          onClick={() => navigate('/ads')}
          className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back to Listings
        </button>
      </div>

      {/* Modals */}
      <BidModal
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        vehicleId={vehicle.id}
        currentPrice={vehicle.price}
      />
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        sellerId={vehicle.seller.id}
      />
    </div>
  );
};

export default AdDetailPage;