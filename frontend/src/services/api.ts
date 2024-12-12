import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};

// Vehicle Services
export const vehicleService = {
  createAd: async (data: any) => {
    const response = await api.post('/ads/vehicles', data);
    return response.data;
  },

  getVehicles: async (params: any) => {
    const response = await api.get('/ads/vehicles', { params });
    return response.data;
  },

  getVehicleById: async (id: number) => {
    const response = await api.get(`/ads/vehicles/${id}`);
    return response.data;
  },

  updateVehicle: async (id: number, data: any) => {
    const response = await api.put(`/ads/vehicles/${id}`, data);
    return response.data;
  },

  deleteVehicle: async (id: number) => {
    const response = await api.delete(`/ads/vehicles/${id}`);
    return response.data;
  },

  createBid: async (vehicleId: number, amount: number, isPublic: boolean = true) => {
    const response = await api.post(`/ads/vehicles/${vehicleId}/bids`, {
      amount,
      is_public: isPublic,
    });
    return response.data;
  },
};

// Rating Services
export const ratingService = {
  createRating: async (sellerId: number, rating: number, review?: string) => {
    const response = await api.post('/ratings', {
      seller_id: sellerId,
      rating,
      review,
    });
    return response.data;
  },

  getSellerRatings: async (sellerId: number, page: number = 1) => {
    const response = await api.get(`/ratings/${sellerId}`, {
      params: { page },
    });
    return response.data;
  },

  getRatingSummary: async (userId: number) => {
    const response = await api.get(`/users/${userId}/rating-summary`);
    return response.data;
  },
};

// Search Services
export const searchService = {
  searchVehicles: async (params: any) => {
    const response = await api.get('/search', { params });
    return response.data;
  },

  getSearchSuggestions: async (query: string) => {
    const response = await api.get('/search/suggestions', {
      params: { q: query },
    });
    return response.data;
  },

  getPopularSearches: async () => {
    const response = await api.get('/search/popular');
    return response.data;
  },
};

export default api;