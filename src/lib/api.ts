import axios from 'axios';
import Cookies from 'js-cookie';

// API Configuration
// Use proxy to avoid CORS issues - Next.js will redirect to backend
export const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? '/api'
    : 'https://style-back-end.onrender.com';

// Debug logging
if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
  console.log('🔧 API Configuration:', {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    API_BASE_URL: API_BASE_URL,
    mode: 'proxy via Next.js'
  });
}

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    
    // Debug logging
    if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
      console.log('🔍 API Request:', {
        url: config.url,
        baseURL: config.baseURL,
        method: config.method,
        fullURL: `${config.baseURL}${config.url}`,
        hasToken: !!token,
        tokenLength: token?.length || 0
      });
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No auth token found in cookies');
    }
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    // Debug logging
    if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Debug logging
    console.error('❌ API Response Error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    
    // Handle specific error cases
    if (error.response?.status === 429 || 
        error.response?.data?.message?.includes('Muitas requisições')) {
      console.warn('🔄 Rate limit exceeded - too many requests');
    }
    
    // Handle unauthorized errors - but don't redirect automatically
    if (error.response?.status === 401) {
      console.warn('⚠️ Unauthorized error - token may be invalid');
      // Remove invalid token
      Cookies.remove('auth_token');
      // Don't redirect automatically - let the component handle it
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
