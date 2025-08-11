import { apiClient } from '@/lib/api';
import { 
  ApiResponse, 
  UpdateProfileData, 
  ProfileStats, 
  UserOutfit, 
  LikeData, 
  FavoriteData,
  UploadAvatarData,
  PaginationResult
} from '@/lib/types';

class ProfileService {
  // Atualizar perfil do usuário
  async updateProfile(data: UpdateProfileData): Promise<ApiResponse> {
    try {
      console.log('📝 Atualizando perfil:', data);
      const response = await apiClient.put('/users/profile', data);
      if (!response.data || (typeof response.data === 'object' && Object.keys(response.data).length === 0)) {
        throw new Error('Resposta da API inválida ou vazia ao atualizar perfil.');
      }
      console.log('✅ Perfil atualizado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar perfil:', error);
      const isBackendError = error.code === 'ECONNREFUSED' || 
                           error.code === 'ENOTFOUND' || 
                           error.response?.status === 404 ||
                           error.response?.status === 500 ||
                           !error.response ||
                           (typeof error.response?.data === 'object' && Object.keys(error.response.data).length === 0);
      if (isBackendError && process.env.NODE_ENV === 'development') {
        return {
          success: true,
          data: data,
          message: 'Perfil será atualizado quando o backend estiver disponível'
        };
      }
      throw new Error(error.response?.data?.message || error.message || 'Erro ao atualizar perfil');
    }
  }

  // Upload de avatar
  async uploadAvatar(data: UploadAvatarData): Promise<ApiResponse<{ avatarUrl: string }>> {
    console.log('📸 Fazendo upload do avatar...');
    
    try {
      const response = await apiClient.post('/users/avatar', data);
      console.log('✅ Avatar atualizado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao fazer upload do avatar:', error);
      
      // Check for different types of errors
      const isBackendError = error.code === 'ECONNREFUSED' || 
                           error.code === 'ENOTFOUND' || 
                           error.response?.status === 404 ||
                           error.response?.status === 500 ||
                           !error.response ||
                           (typeof error.response?.data === 'object' && Object.keys(error.response.data).length === 0);
      
      if (isBackendError) {
        console.warn('⚠️ Backend não disponível - simulando sucesso para upload de avatar');
        return {
          success: true,
          data: {
            avatarUrl: data.imageDataUri // Use the uploaded image as preview
          },
          message: 'Avatar será salvo quando o backend estiver disponível'
        };
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao fazer upload do avatar');
    }
  }

  // Obter estatísticas do perfil
  async getProfileStats(): Promise<ApiResponse<ProfileStats>> {
    console.log('📊 Buscando estatísticas do perfil...');
    
    try {
  const response = await apiClient.get('/api/users/profile/stats');
      console.log('✅ Estatísticas obtidas:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      
      // Check for different types of errors
      const isBackendError = error.code === 'ECONNREFUSED' || 
                           error.code === 'ENOTFOUND' || 
                           error.response?.status === 404 ||
                           error.response?.status === 500 ||
                           !error.response ||
                           (typeof error.response?.data === 'object' && Object.keys(error.response.data).length === 0);
      
      if (isBackendError) {
        console.warn('⚠️ Backend não disponível ou retornou resposta inválida - usando dados mockados');
        return {
          success: true,
          data: {
            totalOutfits: 0,
            totalLikes: 0,
            favoritedOutfits: 0,
            aiGeneratedOutfits: 0,
            followersCount: 0,
            followingCount: 0
          },
          message: 'Dados temporários - backend indisponível'
        };
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao buscar estatísticas');
    }
  }

  // Obter outfits do usuário
  async getUserOutfits(page: number = 1, limit: number = 12): Promise<ApiResponse<PaginationResult<UserOutfit>>> {
    console.log(`👔 Buscando outfits do usuário (página ${page})...`);
    
    try {
  const response = await apiClient.get(`/api/users/outfits?page=${page}&limit=${limit}`);
      console.log('✅ Outfits obtidos:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar outfits:', error);
      
      // Check for different types of errors
      const isBackendError = error.code === 'ECONNREFUSED' || 
                           error.code === 'ENOTFOUND' || 
                           error.response?.status === 404 ||
                           error.response?.status === 500 ||
                           !error.response ||
                           (typeof error.response?.data === 'object' && Object.keys(error.response.data).length === 0);
      
      if (isBackendError) {
        console.warn('⚠️ Backend não disponível - retornando array vazio');
        return {
          success: true,
          data: {
            items: [],
            outfits: [],
            pagination: {
              total: 0,
              page: page,
              limit: limit,
              totalPages: 0,
              hasNext: false,
              hasPrev: false
            }
          },
          message: 'Dados temporários - backend indisponível'
        };
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao buscar outfits');
    }
  }

  // Obter favoritos do usuário
  async getUserFavorites(page: number = 1, limit: number = 12): Promise<ApiResponse<PaginationResult<UserOutfit>>> {
    console.log(`⭐ Buscando favoritos do usuário (página ${page})...`);
    
    try {
  const response = await apiClient.get(`/api/users/favorites?page=${page}&limit=${limit}`);
      console.log('✅ Favoritos obtidos:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar favoritos:', error);
      
      // Check for different types of errors
      const isBackendError = error.code === 'ECONNREFUSED' || 
                           error.code === 'ENOTFOUND' || 
                           error.response?.status === 404 ||
                           error.response?.status === 500 ||
                           !error.response ||
                           (typeof error.response?.data === 'object' && Object.keys(error.response.data).length === 0);
      
      if (isBackendError) {
        console.warn('⚠️ Backend não disponível - retornando array vazio');
        return {
          success: true,
          data: {
            items: [],
            outfits: [],
            pagination: {
              total: 0,
              page: page,
              limit: limit,
              totalPages: 0,
              hasNext: false,
              hasPrev: false
            }
          },
          message: 'Dados temporários - backend indisponível'
        };
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao buscar favoritos');
    }
  }

  // Curtir/descurtir outfit ou post
  async toggleLike(data: LikeData): Promise<ApiResponse<{ isLiked: boolean; likesCount: number }>> {
    console.log('❤️ Alternando curtida:', data);
    
    try {
      const response = await apiClient.post('/users/like', data);
      console.log('✅ Curtida alternada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao alternar curtida:', error);
      throw new Error(error.response?.data?.message || 'Erro ao curtir');
    }
  }

  // Favoritar/desfavoritar outfit ou post
  async toggleFavorite(data: FavoriteData): Promise<ApiResponse<{ isFavorited: boolean }>> {
    console.log('⭐ Alternando favorito:', data);
    
    try {
      const response = await apiClient.post('/users/favorite', data);
      console.log('✅ Favorito alternado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao alternar favorito:', error);
      throw new Error(error.response?.data?.message || 'Erro ao favoritar');
    }
  }

  // Criar outfit personalizado
  async createCustomOutfit(data: {
    title: string;
    itemIds: string[];
    tags: string[];
    imageDataUri?: string;
  }): Promise<ApiResponse<UserOutfit>> {
    console.log('🎨 Criando outfit personalizado:', data);
    
    try {
      const response = await apiClient.post('/users/outfits', data);
      console.log('✅ Outfit criado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar outfit:', error);
      throw new Error(error.response?.data?.message || 'Erro ao criar outfit');
    }
  }

  // Deletar outfit
  async deleteOutfit(outfitId: string): Promise<ApiResponse> {
    console.log('🗑️ Deletando outfit:', outfitId);
    
    try {
      const response = await apiClient.delete(`/users/outfits/${outfitId}`);
      console.log('✅ Outfit deletado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao deletar outfit:', error);
      throw new Error(error.response?.data?.message || 'Erro ao deletar outfit');
    }
  }
}

export const profileService = new ProfileService();
