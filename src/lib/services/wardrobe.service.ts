import { apiClient } from '@/lib/api';
import {
  ApiResponse,
  ClothingItem,
  AddClothingItemData,
  WardrobeFilters,
  PaginationResult,
  GenerateOutfitInput,
  OutfitGeneration,
  SavedOutfit,
  AnalyzeClothingOutput,
} from '@/lib/types';

export const wardrobeService = {
  // Analyze clothing with AI (without saving)
  async analyzeClothing(data: { image: string; name?: string; description?: string }): Promise<AnalyzeClothingOutput> {
    try {
      console.log('🔍 wardrobeService.analyzeClothing called with:', { 
        hasImage: !!data.image, 
        imageLength: data.image?.length,
        imageFormat: data.image?.substring(0, 50) + '...',
        name: data.name,
        description: data.description 
      });
      const payload = {
        photoDataUri: data.image,
        name: data.name,
        description: data.description
      };
      const response = await apiClient.post<ApiResponse<AnalyzeClothingOutput>>('/wardrobe/analyze', payload);
      if (!response.data || !response.data.data) {
        throw new Error('Resposta da API inválida ou vazia ao analisar peça.');
      }
      if (response.data.data?.reasoning) {
        console.log('🧠 AI Reasoning:', response.data.data.reasoning);
      }
      if (response.data.data?.qualityScore) {
        console.log('📊 Quality Score:', response.data.data.qualityScore);
      }
      if (response.data.data?.retryCount) {
        console.log('🔄 Retry Count:', response.data.data.retryCount);
      }
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao analisar peça:', error);
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Backend não disponível para análise de peça.');
      }
      throw new Error(error.message || 'Erro ao analisar peça');
    }
  },

  // Add clothing item with AI analysis
  async addClothingItem(data: AddClothingItemData): Promise<ClothingItem> {
    try {
      console.log('🔍 wardrobeService.addClothingItem called with:', { 
        hasImage: !!data.photoDataUri, 
        imageLength: data.photoDataUri?.length
      });
  const response = await apiClient.post<ApiResponse<ClothingItem>>('/api/wardrobe', data);
      if (!response.data || !response.data.data) {
        throw new Error('Resposta da API inválida ou vazia ao adicionar peça.');
      }
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao adicionar peça:', error);
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Backend não disponível para adicionar peça.');
      }
      throw new Error(error.message || 'Erro ao adicionar peça');
    }
  },

  // Get wardrobe items with filters
  async getWardrobe(filters?: WardrobeFilters): Promise<PaginationResult<ClothingItem>> {
    try {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.type) params.append('type', filters.type);
      if (filters?.color) params.append('color', filters.color);
      if (filters?.season) params.append('season', filters.season);
      if (filters?.occasion) params.append('occasion', filters.occasion);
  const url = `/api/wardrobe${params.toString() ? '?' + params.toString() : ''}`;
  const response = await apiClient.get<ApiResponse<PaginationResult<ClothingItem>>>(url);
      console.log('🔍 wardrobeService.getWardrobe response:', {
        status: response.status,
        data: response.data,
        url,
      });
      if (!response.data || !response.data.data) {
        throw new Error(`Resposta da API inválida ou vazia ao buscar guarda-roupa. Status: ${response.status}. Body: ${JSON.stringify(response.data)}`);
      }
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar guarda-roupa:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Backend indisponível. Exibindo dados locais para desenvolvimento.');
          return { items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false } };
        }
        throw new Error('Backend não disponível para buscar guarda-roupa.');
      }
      throw new Error(error.message || `Erro ao buscar guarda-roupa. Status: ${error.response?.status}. Body: ${JSON.stringify(error.response?.data)}`);
    }
  },

  // Delete clothing item
  async deleteClothingItem(itemId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/wardrobe/${itemId}`);
    } catch (error: any) {
      console.error('❌ Erro ao deletar peça:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Erro ao deletar peça');
    }
  },

  // Generate outfit with AI
  async generateOutfit(preferences: GenerateOutfitInput): Promise<OutfitGeneration> {
    try {
      const response = await apiClient.post<ApiResponse<OutfitGeneration>>('/builder/generate', preferences);
      if (!response.data || !response.data.data) {
        throw new Error('Resposta da API inválida ou vazia ao gerar look.');
      }
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao gerar look:', error);
      throw new Error(error.message || 'Erro ao gerar look');
    }
  },

  // Get saved outfits
  async getSavedOutfits(page = 1, limit = 20): Promise<PaginationResult<SavedOutfit>> {
    try {
      const response = await apiClient.get<ApiResponse<PaginationResult<SavedOutfit>>>(
        `/wardrobe/outfits?page=${page}&limit=${limit}`
      );
      if (!response.data || !response.data.data) {
        throw new Error('Resposta da API inválida ou vazia ao buscar outfits salvos.');
      }
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar outfits salvos:', error);
      throw new Error(error.message || 'Erro ao buscar outfits salvos');
    }
  },
};
