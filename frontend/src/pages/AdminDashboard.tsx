import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { Users, Car, AlertTriangle, Ban, Check, X } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'listings' | 'reports'>('users');
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users, isLoading: isLoadingUsers } = useQuery('users', async () => {
    const response = await fetch('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  });

  // Fetch listings that need moderation
  const { data: listings, isLoading: isLoadingListings } = useQuery('pendingListings', async () => {
    const response = await fetch('/api/admin/listings/pending', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  });

  // Fetch reported content
  const { data: reports, isLoading: isLoadingReports } = useQuery('reports', async () => {
    const response = await fetch('/api/admin/reports', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  });

  // Mutations
  const suspendUserMutation = useMutation(
    async (userId: number) => {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success('User suspended successfully');
      },
    }
  );

  const approveListing = useMutation(
    async (listingId: number) => {
      const response = await fetch(`/api/admin/listings/${listingId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pendingListings');
        toast.success('Listing approved successfully');
      },
    }
  );

  const rejectListing = useMutation(
    async (listingId: number) => {
      const response = await fetch(`/api/admin/listings/${listingId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pendingListings');
        toast.success('Listing rejected successfully');
      },
    }
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {isLoadingUsers ? (
              <div className="p-4 text-center">Loading users...</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {users?.map((user: any) => (
                  <li key={user.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">{user.username}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Suspended'}
                        </span>
                        <button
                          onClick={() => suspendUserMutation.mutate(user.id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={suspendUserMutation.isLoading}
                        >
                          <Ban className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case 'listings':
        return (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {isLoadingListings ? (
              <div className="p-4 text-center">Loading listings...</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {listings?.map((listing: any) => (
                  <li key={listing.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">
                          {listing.year} {listing.make} {listing.model}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Listed by: {listing.seller.username}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => approveListing.mutate(listing.id)}
                          className="text-green-600 hover:text-green-800"
                          disabled={approveListing.isLoading}
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => rejectListing.mutate(listing.id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={rejectListing.isLoading}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case 'reports':
        return (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {isLoadingReports ? (
              <div className="p-4 text-center">Loading reports...</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {reports?.map((report: any) => (
                  <li key={report.id} className="px-6 py-4">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium">
                          Report #{report.id}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          report.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {report.description}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        Reported by: {report.reporter.username} |
                        Reported on: {new Date(report.created_at).toLocaleDateString()}
                      </div>
                      <div className="mt-2 flex justify-end space-x-4">
                        <button
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          View Details
                        </button>
                        <button
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Take Action
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="h-5 w-5 inline mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'listings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Car className="h-5 w-5 inline mr-2" />
            Pending Listings
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <AlertTriangle className="h-5 w-5 inline mr-2" />
            Reports
          </button>
        </nav>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;