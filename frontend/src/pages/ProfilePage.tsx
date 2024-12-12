import { useState } from 'react';
import { useQuery } from 'react-query';
import { vehicleService, ratingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VehicleCard from '../components/vehicles/VehicleCard';
import { Star } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [] = useState(false);
  const [] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch user's listings
  const { data: listings, isLoading: isLoadingListings } = useQuery(
    ['userListings', user?.id],
    () => vehicleService.getVehicles({ seller_id: user?.id })
  );

  // Fetch user's rating summary
  const { data: ratingSummary } = useQuery(
    ['userRatings', user?.id],
    () => ratingService.getRatingSummary(user?.id!)
  );

  // Update profile mutation

  // ... (previous code remains the same until rating summary section)

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Settings Section (previous code remains the same) */}

      {/* Rating Summary */}
      {ratingSummary && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Seller Rating</h2>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center">
              <Star className="h-6 w-6 text-yellow-400 fill-current" />
              <span className="ml-2 text-2xl font-bold">
                {ratingSummary.average_rating.toFixed(1)}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              ({ratingSummary.total_ratings} ratings)
            </div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <span className="w-12 text-sm text-gray-600">{rating} star</span>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-yellow-400 rounded"
                      style={{
                        width: `${(ratingSummary.rating_distribution[rating] / ratingSummary.total_ratings) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
                <span className="w-12 text-sm text-gray-600">
                  {ratingSummary.rating_distribution[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User's Listings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Your Listings</h2>
        {isLoadingListings ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : listings?.vehicles?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">You haven't posted any vehicles yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings?.vehicles.map((vehicle: any) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} showPredictedValue={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;