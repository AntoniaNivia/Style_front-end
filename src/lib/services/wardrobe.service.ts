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
    console.log('🔍 wardrobeService.analyzeClothing called with:', { 
      hasImage: !!data.image, 
      imageLength: data.image?.length,
      imageFormat: data.image?.substring(0, 50) + '...', // Show beginning of base64
      name: data.name,
      description: data.description 
    });
    
    // Convert to expected backend format
    const payload = {
      photoDataUri: data.image,
      name: data.name,
      description: data.description
    };
    
    console.log('🔍 wardrobeService.analyzeClothing sending payload:', { 
      hasPhotoDataUri: !!payload.photoDataUri, 
      photoDataUriLength: payload.photoDataUri?.length,
      photoDataUriStart: payload.photoDataUri?.substring(0, 100) + '...', // Show more of base64
      name: payload.name,
      description: payload.description 
    });
    
    const response = await apiClient.post<ApiResponse<AnalyzeClothingOutput>>('/wardrobe/analyze', payload);
    console.log('✅ wardrobeService.analyzeClothing response:', response.data);
    
    // Log novos campos se disponíveis (compatibilidade com backend atualizado)
    if (response.data.data?.reasoning) {
      console.log('🧠 AI Reasoning:', response.data.data.reasoning);
    }
    if (response.data.data?.qualityScore) {
      console.log('📊 Quality Score:', response.data.data.qualityScore);
    }
    if (response.data.data?.retryCount) {
      console.log('🔄 Retry Count:', response.data.data.retryCount);
    }
    
    return response.data.data!;
  },

  // Add clothing item with AI analysis
  async addClothingItem(data: AddClothingItemData): Promise<ClothingItem> {
    console.log('🔍 wardrobeService.addClothingItem called with:', { 
      hasImage: !!data.photoDataUri, 
      imageLength: data.photoDataUri?.length
    });
    const response = await apiClient.post<ApiResponse<ClothingItem>>('/wardrobe', data);
    console.log('✅ wardrobeService.addClothingItem response:', response.data);
    return response.data.data!;
  },

  // Get wardrobe items with filters
  async getWardrobe(filters?: WardrobeFilters): Promise<PaginationResult<ClothingItem>> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.type) params.append('type', filters.type);
    if (filters?.color) params.append('color', filters.color);
    if (filters?.season) params.append('season', filters.season);
    if (filters?.occasion) params.append('occasion', filters.occasion);

    const response = await apiClient.get<ApiResponse<PaginationResult<ClothingItem>>>(
      `/wardrobe?${params.toString()}`
    );
    return response.data.data!;
  },

  // Delete clothing item
  async deleteClothingItem(itemId: string): Promise<void> {
    await apiClient.delete(`/wardrobe/${itemId}`);
  },

  // Generate outfit with AI
  async generateOutfit(preferences: GenerateOutfitInput): Promise<OutfitGeneration> {
    const response = await apiClient.post<ApiResponse<OutfitGeneration>>('/builder/generate', preferences);
    return response.data.data!;
  },

  // Get saved outfits
  async getSavedOutfits(page = 1, limit = 20): Promise<PaginationResult<SavedOutfit>> {
    const response = await apiClient.get<ApiResponse<PaginationResult<SavedOutfit>>>(
      `/wardrobe/outfits?page=${page}&limit=${limit}`
    );
    return response.data.data!;
  },
};
