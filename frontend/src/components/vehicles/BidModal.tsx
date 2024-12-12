import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { vehicleService } from '..//../services/api';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: number;
  currentPrice: number;
}

const BidModal: React.FC<BidModalProps> = ({
  isOpen,
  onClose,
  vehicleId,
  currentPrice,
}) => {
  const [bidAmount, setBidAmount] = useState(currentPrice);
  const [isPublic, setIsPublic] = useState(true);
  const queryClient = useQueryClient();

  const bidMutation = useMutation(
    () => vehicleService.createBid(vehicleId, bidAmount, isPublic),
    {
      onSuccess: () => {
        toast.success('Bid placed successfully!');
        queryClient.invalidateQueries(['vehicle', vehicleId]);
        onClose();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Failed to place bid');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount <= currentPrice) {
      toast.error('Bid amount must be higher than current price');
      return;
    }
    bidMutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="relative inline-block w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Place Your Bid</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Price
              </label>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(currentPrice)}
              </div>
            </div>

            <div>
              <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700">
                Your Bid Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="bidAmount"
                  min={currentPrice + 1}
                  step="1"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 text-sm text-gray-600">
                Make bid visible to other users
              </label>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={bidMutation.isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {bidMutation.isLoading ? 'Placing Bid...' : 'Place Bid'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BidModal;