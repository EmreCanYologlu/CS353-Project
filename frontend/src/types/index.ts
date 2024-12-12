export interface User {
    id: number;
    username: string;
    email: string;
    is_admin: boolean;
    created_at: string;
  }
  
  export interface Vehicle {
    id: number;
    seller_id: number;
    make: string;
    model: string;
    year: number;
    mileage: number;
    price: number;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    description: string;
    status: 'available' | 'sold' | 'pending';
    created_at: string;
    initial_price: number;
    predicted_value: number;
    seller: {
      id: number;
      username: string;
    };
  }
  
  export interface Bid {
    id: number;
    vehicle_id: number;
    bidder_id: number;
    amount: number;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    is_public: boolean;
    bidder: {
      id: number;
      username: string;
    };
  }
  
  export interface Rating {
    id: number;
    seller_id: number;
    rater_id: number;
    rating: number;
    review: string;
    created_at: string;
    rater: {
      id: number;
      username: string;
    };
  }
  
  export interface RatingSummary {
    average_rating: number;
    total_ratings: number;
    rating_distribution: {
      [key: number]: number;
    };
  }
  
  export interface Notification {
    id: number;
    user_id: number;
    message: string;
    type: 'new_bid' | 'new_rating' | 'bid_status' | 'admin_message';
    read: boolean;
    created_at: string;
  }
  
  export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  }
  
  export interface ApiError {
    error: string;
    status: number;
  }
  
  export interface SearchFilters {
    q?: string;
    make?: string;
    model?: string;
    year_min?: number;
    year_max?: number;
    price_min?: number;
    price_max?: number;
    condition?: string;
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }