import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
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

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  // Auth
  login: (email: string, password: string) => 
    apiClient.post('/api/auth/login', { email, password }),
  
  register: (userData: any) => 
    apiClient.post('/api/auth/register', userData),
  
  // Products
  getProducts: (params?: any) => 
    apiClient.get('/api/products', { params }),
  
  getProduct: (id: string) => 
    apiClient.get(`/api/products/${id}`),
  
  // Cart
  getCart: (userId: string) => 
    apiClient.get(`/api/cart/${userId}`),
  
  addToCart: (item: any) => 
    apiClient.post('/api/cart/items', item),
  
  updateCartItem: (productId: string, data: any) => 
    apiClient.put(`/api/cart/items/${productId}`, data),
  
  removeFromCart: (productId: string, userId: string) => 
    apiClient.delete(`/api/cart/items/${productId}?userId=${userId}`),
  
  clearCart: (userId: string) => 
    apiClient.delete(`/api/cart/${userId}`),
  
  // Orders
  getOrders: (params?: any) => 
    apiClient.get('/api/orders', { params }),
  
  createOrder: (orderData: any) => 
    apiClient.post('/api/orders', orderData),
  
  getOrder: (id: string) => 
    apiClient.get(`/api/orders/${id}`),
  
  // Health
  getHealth: () => 
    apiClient.get('/api/health'),
};
