import { apiClient } from '@/lib/api';

export interface MannequinGenerationRequest {
  selectedItems: string[];
  mannequinPreference: 'Woman' | 'Man' | 'Neutral';
  outfitName: string;
  notes?: string;
}

export interface MannequinGenerationResponse {
  success: true;
  data: {
    mannequinImageUrl: string;
    previewId: string;
    itemsValidated: Array<{
      id: string;
      type: string;
      color: string;
      valid: boolean;
    }>;
    generationTime: string;
  };
}

export interface MannequinGenerationStatus {
  success: true;
  data: {
    id: string;
    status: 'pending' | 'generating' | 'completed' | 'failed';
    imageUrl?: string;
    errorMessage?: string;
    generationTime?: number;
  };
}

export const mannequinService = {
  // Generate mannequin image
  async generateMannequin(data: MannequinGenerationRequest): Promise<MannequinGenerationResponse['data']> {
    try {
      console.log('🎨 Generating mannequin preview:', data);
      
      const response = await apiClient.post<MannequinGenerationResponse>('/mannequin-preview', data);
      
      if (response.data.success) {
        console.log('✅ Mannequin generated successfully:', response.data.data);
        return response.data.data;
      } else {
        throw new Error('Failed to generate mannequin');
      }
    } catch (error: any) {
      console.error('❌ Error generating mannequin:', error);
      throw error;
    }
  },

  // Get generation status
  async getGenerationStatus(previewId: string): Promise<MannequinGenerationStatus['data']> {
    try {
      const response = await apiClient.get<MannequinGenerationStatus>(`/mannequin-preview/${previewId}/status`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Failed to get generation status');
      }
    } catch (error: any) {
      console.error('❌ Error getting generation status:', error);
      throw error;
    }
  },

  // List user's generations
  async getGenerations(page = 1, limit = 10) {
    try {
      const response = await apiClient.get('/mannequin-preview/generations', {
        params: { page, limit }
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Failed to get generations');
      }
    } catch (error: any) {
      console.error('❌ Error getting generations:', error);
      throw error;
    }
  },

  // Delete generation
  async deleteGeneration(previewId: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(`/mannequin-preview/${previewId}`);
      return response.data.success;
    } catch (error: any) {
      console.error('❌ Error deleting generation:', error);
      throw error;
    }
  }
};
