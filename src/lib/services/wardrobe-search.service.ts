import { apiClient } from '@/lib/api';
import { ClothingItem } from '@/lib/types';

export interface WardrobeSearchParams {
  q?: string; // Free text search
  type?: string;
  color?: string;
  season?: string;
  occasion?: string;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'type' | 'color' | 'usage';
  sortOrder?: 'asc' | 'desc';
}

export interface WardrobeSearchResponse {
  success: true;
  data: {
    items: ClothingItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters: {
      availableTypes: string[];
      availableColors: string[];
      availableSeasons: string[];
      availableBrands: string[];
    };
  };
}

export interface ItemValidationRequest {
  itemIds: string[];
}

export interface ItemValidationResponse {
  success: true;
  data: {
    validItems: Array<{
      id: string;
      type: string;
      color: string;
      available: boolean;
    }>;
    invalidItems: string[];
    summary: {
      total: number;
      valid: number;
      invalid: number;
    };
  };
}

export interface WardrobeStatsResponse {
  success: true;
  data: {
    totalItems: number;
    itemsByType: Record<string, number>;
    itemsByColor: Record<string, number>;
    itemsBySeason: Record<string, number>;
    mostUsedItems: Array<{
      id: string;
      type: string;
      color: string;
      usageCount: number;
    }>;
  };
}

export const wardrobeSearchService = {
  // Advanced search in wardrobe
  async searchWardrobe(params: WardrobeSearchParams): Promise<WardrobeSearchResponse['data']> {
    try {
      console.log('🔍 Searching wardrobe:', params);
      
      const response = await apiClient.get<WardrobeSearchResponse>('/wardrobe/search', {
        params: params
      });
      
      if (response.data.success) {
        console.log('✅ Wardrobe search successful:', response.data.data);
        return response.data.data;
      } else {
        throw new Error('Failed to search wardrobe');
      }
    } catch (error: any) {
      console.error('❌ Error searching wardrobe:', error);
      throw error;
    }
  },

  // Validate items in bulk
  async validateItems(itemIds: string[]): Promise<ItemValidationResponse['data']> {
    try {
      console.log('✓ Validating items:', itemIds);
      
      const response = await apiClient.post<ItemValidationResponse>('/wardrobe/validate-items', {
        itemIds
      });
      
      if (response.data.success) {
        console.log('✅ Items validated:', response.data.data);
        return response.data.data;
      } else {
        throw new Error('Failed to validate items');
      }
    } catch (error: any) {
      console.error('❌ Error validating items:', error);
      throw error;
    }
  },

  // Get most used items
  async getMostUsedItems(limit = 10): Promise<any> {
    try {
      const response = await apiClient.get('/wardrobe/most-used', {
        params: { limit }
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Failed to get most used items');
      }
    } catch (error: any) {
      console.error('❌ Error getting most used items:', error);
      throw error;
    }
  },

  // Get wardrobe statistics
  async getWardrobeStats(): Promise<WardrobeStatsResponse['data']> {
    try {
      const response = await apiClient.get<WardrobeStatsResponse>('/wardrobe/stats');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Failed to get wardrobe stats');
      }
    } catch (error: any) {
      console.error('❌ Error getting wardrobe stats:', error);
      throw error;
    }
  },

  // Get available filters (dynamic from backend)
  async getAvailableFilters(): Promise<WardrobeSearchResponse['data']['filters']> {
    try {
      const response = await apiClient.get('/wardrobe/filters');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Failed to get available filters');
      }
    } catch (error: any) {
      console.error('❌ Error getting available filters:', error);
      throw error;
    }
  },

  // Get recommendations based on user history
  async getRecommendations(occasion?: string, weather?: string): Promise<any> {
    try {
      const response = await apiClient.post('/wardrobe/recommendations', {
        occasion,
        weather
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Failed to get recommendations');
      }
    } catch (error: any) {
      console.error('❌ Error getting recommendations:', error);
      throw error;
    }
  }
};
