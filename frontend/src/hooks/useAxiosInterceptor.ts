import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.error || 'An error occurred';

        switch (status) {
          case 401:
            logout();
            navigate('/login');
            toast.error('Your session has expired. Please login again.');
            break;
          case 403:
            toast.error('You do not have permission to perform this action');
            break;
          case 404:
            toast.error('Resource not found');
            break;
          case 422:
            toast.error(message);
            break;
          case 429:
            toast.error('Too many requests. Please try again later.');
            break;
          case 500:
            toast.error('Server error. Please try again later.');
            break;
          default:
            if (!error.response) {
              toast.error('Network error. Please check your connection.');
            } else {
              toast.error(message);
            }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate, logout]);
};

export default useAxiosInterceptor;