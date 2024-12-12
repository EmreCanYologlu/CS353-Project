import React, { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Bell, Car, Star } from 'lucide-react';

interface NotificationDropdownProps {
  onClose: () => void;
}

interface Notification {
  id: number;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications, isLoading } = useQuery(
    'notifications',
    async () => {
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return response.json();
    }
  );

  // Mark notification as read
  const markAsReadMutation = useMutation(
    async (notificationId: number) => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to mark notification as read');
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
      }
    }
  );

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_bid':
        return <Car className="h-5 w-5 text-blue-500" />;
      case 'new_rating':
        return <Star className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <div className="py-2">
        <div className="px-4 py-2 border-b">
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
        </div>

        {isLoading ? (
          <div className="px-4 py-2 text-sm text-gray-500">Loading notifications...</div>
        ) : notifications?.length === 0 ? (
          <div className="px-4 py-2 text-sm text-gray-500">No notifications</div>
        ) : (
          <div>
            {notifications?.map((notification: Notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {format(new Date(notification.created_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markAsReadMutation.mutate(notification.id)}
                      className="ml-3 text-xs text-blue-600 hover:text-blue-800"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="px-4 py-2 border-t">
          <Link
            to="/notifications"
            className="block text-center text-sm text-blue-600 hover:text-blue-800"
            onClick={onClose}
          >
            View All Notifications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;