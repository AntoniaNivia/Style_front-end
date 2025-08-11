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
      const response = await apiClient.post<MannequinGenerationResponse>('/api/mannequin-preview', data);
      if (!response.data || !response.data.success || !response.data.data) {
        throw new Error('Resposta da API inválida ou vazia ao gerar mannequin.');
      }
      console.log('✅ Mannequin generated successfully:', response.data.data);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Error generating mannequin:', error);
      if (error.response?.status === 401) {
        throw new Error('Você precisa estar logado para gerar um mannequin');
      } else if (error.response?.status === 403) {
        throw new Error('Acesso negado à geração de mannequin');
      } else if (error.response?.status >= 500) {
        throw new Error('Erro do servidor ao gerar mannequin. Tente novamente em alguns instantes');
      }
      // Fallback para dados locais em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Usando dados locais de mannequin para desenvolvimento');
        return {
          mannequinImageUrl: '/test-mannequin.png',
          previewId: 'local-preview',
          itemsValidated: [],
          generationTime: '0s',
        };
      }
      throw error;
    }
  },

  // Get generation status
  async getGenerationStatus(previewId: string): Promise<MannequinGenerationStatus['data']> {
    try {
      const response = await apiClient.get<MannequinGenerationStatus>(`/mannequin-preview/${previewId}/status`);
      if (!response.data || !response.data.success || !response.data.data) {
        throw new Error('Resposta da API inválida ou vazia ao buscar status da geração.');
      }
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Error getting generation status:', error);
      if (error.response?.status === 401) {
        throw new Error('Você precisa estar logado para ver o status da geração');
      } else if (error.response?.status === 403) {
        throw new Error('Acesso negado ao status da geração');
      } else if (error.response?.status >= 500) {
        throw new Error('Erro do servidor ao buscar status da geração. Tente novamente em alguns instantes');
      }
      // Fallback para dados locais em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Usando dados locais de status para desenvolvimento');
        return {
          id: previewId,
          status: 'completed',
          imageUrl: '/test-mannequin.png',
          generationTime: 0,
        };
      }
      throw error;
    }
  },

  // List user's generations
  async getGenerations(page = 1, limit = 10) {
    try {
      const response = await apiClient.get('/mannequin-preview/generations', {
        params: { page, limit }
      });
      if (!response.data || !response.data.success || !response.data.data) {
        throw new Error('Resposta da API inválida ou vazia ao buscar gerações.');
      }
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Error getting generations:', error);
      if (error.response?.status === 401) {
        throw new Error('Você precisa estar logado para ver suas gerações');
      } else if (error.response?.status === 403) {
        throw new Error('Acesso negado às gerações');
      } else if (error.response?.status >= 500) {
        throw new Error('Erro do servidor ao buscar gerações. Tente novamente em alguns instantes');
      }
      // Fallback para dados locais em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Usando dados locais de gerações para desenvolvimento');
        return [
          { id: 'local-1', status: 'completed', imageUrl: '/test-mannequin.png', generationTime: 0 },
        ];
      }
      throw error;
    }
  },

  // Delete generation
  async deleteGeneration(previewId: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(`/mannequin-preview/${previewId}`);
      if (!response.data || typeof response.data.success !== 'boolean') {
        throw new Error('Resposta da API inválida ao deletar geração.');
      }
      return response.data.success;
    } catch (error: any) {
      console.error('❌ Error deleting generation:', error);
      if (error.response?.status === 401) {
        throw new Error('Você precisa estar logado para deletar uma geração');
      } else if (error.response?.status === 403) {
        throw new Error('Acesso negado à exclusão de geração');
      } else if (error.response?.status >= 500) {
        throw new Error('Erro do servidor ao deletar geração. Tente novamente em alguns instantes');
      }
      // Fallback para sucesso em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Simulando exclusão de geração para desenvolvimento');
        return true;
      }
      throw error;
    }
  }
};
