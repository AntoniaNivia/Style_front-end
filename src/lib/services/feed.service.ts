import { apiClient } from '@/lib/api';
import {
  ApiResponse,
  FeedPost,
  CreateFeedPostData,
  FeedFilters,
  PaginationResult,
} from '@/lib/types';

export const feedService = {
  // Get feed posts
  async getFeed(filters?: FeedFilters): Promise<PaginationResult<FeedPost>> {
    console.log('📊 Buscando posts do feed...');
    
    try {
      const params = new URLSearchParams();
      
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await apiClient.get<ApiResponse<PaginationResult<FeedPost>>>(
        `/feed?${params.toString()}`
      );
      
      console.log('✅ Posts do feed obtidos:', response.data);
      return response.data.data!;
    } catch (error: any) {
      console.error('❌ Erro ao buscar posts do feed:', error);
      
      // Check for different types of errors
      const isBackendError = error.code === 'ECONNREFUSED' || 
                           error.code === 'ENOTFOUND' || 
                           error.response?.status === 404 ||
                           error.response?.status === 500 ||
                           !error.response ||
                           (typeof error.response?.data === 'object' && Object.keys(error.response.data).length === 0);
      
      if (isBackendError) {
        console.warn('⚠️ Backend não disponível - retornando feed vazio');
        return {
          items: [],
          posts: [],
          pagination: {
            total: 0,
            page: filters?.page || 1,
            limit: filters?.limit || 20,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          }
        };
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao buscar posts do feed');
    }
  },

  // Create feed post (stores only)
  async createPost(data: CreateFeedPostData): Promise<FeedPost> {
    console.log('📝 Criando post no feed:', data);
    
    try {
      const response = await apiClient.post<ApiResponse<FeedPost>>('/feed', data);
      console.log('✅ Post criado:', response.data);
      return response.data.data!;
    } catch (error: any) {
      console.error('❌ Erro ao criar post:', error);
      throw new Error(error.response?.data?.message || 'Erro ao criar post');
    }
  },

  // Like a post
  async likePost(postId: string): Promise<{ message: string; likesCount: number }> {
    console.log('❤️ Curtindo post:', postId);
    
    try {
      const response = await apiClient.post<ApiResponse<{ message: string; likesCount: number }>>(
        `/feed/${postId}/like`
      );
      console.log('✅ Post curtido:', response.data);
      return response.data.data!;
    } catch (error: any) {
      console.error('❌ Erro ao curtir post:', error);
      throw new Error(error.response?.data?.message || 'Erro ao curtir post');
    }
  },

  // Unlike a post
  async unlikePost(postId: string): Promise<{ message: string; likesCount: number }> {
    console.log('💔 Descurtindo post:', postId);
    
    try {
      const response = await apiClient.delete<ApiResponse<{ message: string; likesCount: number }>>(
        `/feed/${postId}/like`
      );
      console.log('✅ Post descurtido:', response.data);
      return response.data.data!;
    } catch (error: any) {
      console.error('❌ Erro ao descurtir post:', error);
      throw new Error(error.response?.data?.message || 'Erro ao descurtir post');
    }
  },

  // Save a post to favorites
  async savePost(postId: string): Promise<{ message: string; isSaved: boolean }> {
    console.log('💾 Salvando post:', postId);
    
    try {
      const response = await apiClient.post<ApiResponse<{ message: string; isSaved: boolean }>>(
        `/feed/${postId}/save`
      );
      console.log('✅ Post salvo:', response.data);
      return response.data.data!;
    } catch (error: any) {
      console.error('❌ Erro ao salvar post:', error);
      throw new Error(error.response?.data?.message || 'Erro ao salvar post');
    }
  },

  // Unsave a post from favorites
  async unsavePost(postId: string): Promise<{ message: string; isSaved: boolean }> {
    console.log('🗑️ Removendo post dos salvos:', postId);
    
    try {
      const response = await apiClient.delete<ApiResponse<{ message: string; isSaved: boolean }>>(
        `/feed/${postId}/save`
      );
      console.log('✅ Post removido dos salvos:', response.data);
      return response.data.data!;
    } catch (error: any) {
      console.error('❌ Erro ao remover post dos salvos:', error);
      throw new Error(error.response?.data?.message || 'Erro ao remover post dos salvos');
    }
  },

  // Get single post
  async getPost(postId: string): Promise<FeedPost> {
    console.log('📄 Buscando post:', postId);
    
    try {
      const response = await apiClient.get<ApiResponse<FeedPost>>(`/feed/${postId}`);
      console.log('✅ Post obtido:', response.data);
      return response.data.data!;
    } catch (error: any) {
      console.error('❌ Erro ao buscar post:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar post');
    }
  },

  // Delete feed post (stores only)
  async deletePost(postId: string): Promise<void> {
    console.log('🗑️ Deletando post:', postId);
    
    try {
      await apiClient.delete(`/feed/${postId}`);
      console.log('✅ Post deletado');
    } catch (error: any) {
      console.error('❌ Erro ao deletar post:', error);
      throw new Error(error.response?.data?.message || 'Erro ao deletar post');
    }
  },

  // Get store's own posts
  async getMyPosts(page = 1, limit = 20): Promise<PaginationResult<FeedPost>> {
    console.log(`📊 Buscando meus posts (página ${page})...`);
    
    try {
      const response = await apiClient.get<ApiResponse<PaginationResult<FeedPost>>>(
        `/feed/my/posts?page=${page}&limit=${limit}`
      );
      console.log('✅ Meus posts obtidos:', response.data);
      return response.data.data!;
    } catch (error: any) {
      console.error('❌ Erro ao buscar meus posts:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar meus posts');
    }
  },
};
