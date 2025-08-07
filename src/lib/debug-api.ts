// Debug utility to test authentication and API endpoints
import { apiClient } from '@/lib/api';
import Cookies from 'js-cookie';

export const debugApi = {
  // Check if user is authenticated
  checkAuth: () => {
    const token = Cookies.get('auth_token');
    console.log('🔍 Auth Debug Info:', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
    });
    return !!token;
  },

  // Test API endpoints
  async testEndpoints() {
    console.log('🧪 Testing API endpoints...');
    
    try {
      // Test health endpoint
      console.log('📍 Testing /health...');
      const health = await apiClient.get('/health');
      console.log('✅ Health OK:', health.data);
    } catch (error) {
      console.error('❌ Health failed:', error);
    }

    try {
      // Test auth endpoint
      console.log('📍 Testing /users/me...');
      const me = await apiClient.get('/users/me');
      console.log('✅ Auth OK:', me.data);
    } catch (error) {
      console.error('❌ Auth failed:', error);
    }

    try {
      // Test manual outfits endpoint
      console.log('📍 Testing /manual-outfits...');
      const outfits = await apiClient.get('/manual-outfits');
      console.log('✅ Manual outfits OK:', outfits.data);
    } catch (error) {
      console.error('❌ Manual outfits failed:', error);
    }
  },

  // Test creating an outfit
  async testCreateOutfit() {
    console.log('🧪 Testing outfit creation...');
    
    const testOutfit = {
      name: 'Test Look',
      selectedItems: ['test-item-1', 'test-item-2'],
      notes: 'Test notes',
      tags: ['test', 'debug'],
      isPrivate: false,
      mannequinPreference: 'Neutral' as const,
    };

    try {
      const response = await apiClient.post('/manual-outfits', testOutfit);
      console.log('✅ Create outfit OK:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create outfit failed:', error);
      throw error;
    }
  }
};

// Add to window for browser debugging
if (typeof window !== 'undefined') {
  (window as any).debugApi = debugApi;
}
