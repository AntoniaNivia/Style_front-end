import api from '@/lib/api';

// Types for the new API structure
export interface ManualOutfit {
  id: string;
  name: string;
  selectedItems: string[];
  items?: any[];
  mannequinPreference?: 'Man' | 'Woman' | 'Neutral';
  mannequinImageUrl?: string;
  previewId?: string;
  notes?: string;
  tags?: string[];
  isPrivate?: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  isLocalOnly?: boolean; // Flag for local-only outfits
}

export interface CreateOutfitData {
  name: string;
  selectedItems: string[];
  items?: any[];
  mannequinPreference?: 'Man' | 'Woman' | 'Neutral';
  mannequinImageUrl?: string;
  previewId?: string;
  notes?: string;
  tags?: string[];
  isPrivate?: boolean;
}

export interface OutfitListResponse {
  success: boolean;
  data: {
    outfits: ManualOutfit[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface OutfitResponse {
  success: boolean;
  data: ManualOutfit;
}

export const manualOutfitService = {
  /**
   * Create a new manual outfit
   * Now works with real API - no more fallbacks needed!
   */
  async createOutfit(data: CreateOutfitData): Promise<ManualOutfit> {
    try {
      console.log('💾 Creating manual outfit:', data);
      
      // Prepare data for API (support both selectedItems and itemIds)
      const apiData = {
        ...data,
        itemIds: data.selectedItems, // Backend expects itemIds
        selectedItems: data.selectedItems // Keep for backward compatibility
      };
      
      const response = await api.post<OutfitResponse>('/api/manual-outfits', apiData);
      
      if (response.data.success) {
        const createdOutfit = response.data.data;
        console.log('✅ Outfit created via API:', createdOutfit);
        
        // Cache locally for immediate feedback and offline access
        this.cacheOutfitLocally(createdOutfit);
        
        return createdOutfit;
      } else {
        throw new Error('API returned success: false');
      }
    } catch (error: any) {
      console.error('❌ Error creating outfit via API:', error);
      
      // In development, still provide fallback for testing
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development fallback - saving locally for testing');
        
        const localOutfit: ManualOutfit = {
          id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: data.name,
          selectedItems: data.selectedItems,
          items: data.items || [],
          mannequinPreference: data.mannequinPreference || 'Neutral',
          mannequinImageUrl: data.mannequinImageUrl || '',
          previewId: data.previewId || '',
          notes: data.notes || '',
          tags: data.tags || [],
          isPrivate: data.isPrivate || false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isLocalOnly: true
        };
        
        this.cacheOutfitLocally(localOutfit);
        console.log('✅ Outfit saved locally for testing:', localOutfit);
        
        return localOutfit;
      }
      
      // Provide helpful error message
      let errorMessage = 'Erro ao salvar look';
      
      if (error.response?.status === 401) {
        errorMessage = 'Você precisa estar logado para salvar looks';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.error || 'Dados inválidos';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Erro do servidor. Tente novamente em alguns instantes';
      }
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Get user's manual outfits with pagination and filters
   * Now works with real API backend!
   */
  async getMyOutfits(params?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<OutfitListResponse['data']> {
    try {
      console.log('📥 Fetching user outfits:', params);
      
      // Build query string - backend now supports these parameters
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.tags) queryParams.append('tags', params.tags);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `/api/manual-outfits/my${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get<OutfitListResponse>(url);
      
      if (response.data.success) {
        const apiData = response.data.data;
        console.log('✅ Outfits fetched from API:', apiData.outfits.length);
        
        // In development, merge with any local test data
        if (process.env.NODE_ENV === 'development') {
          const localOutfits = this.getLocalOutfits();
          const testOnlyOutfits = localOutfits.filter(outfit => outfit.isLocalOnly);
          
          if (testOnlyOutfits.length > 0) {
            console.log('🔧 Adding', testOnlyOutfits.length, 'local test outfits');
            const mergedOutfits = this.mergeOutfits(apiData.outfits, testOnlyOutfits);
            
            return {
              outfits: mergedOutfits,
              pagination: {
                ...apiData.pagination,
                total: mergedOutfits.length
              }
            };
          }
        }
        
        return apiData;
      } else {
        throw new Error('API returned success: false');
      }
    } catch (error: any) {
      console.error('❌ Error fetching outfits from API:', error);
      
      // Provide helpful error message
      if (error.response?.status === 401) {
        throw new Error('Você precisa estar logado para ver seus looks');
      } else if (error.response?.status === 403) {
        throw new Error('Acesso negado');
      } else if (error.response?.status >= 500) {
        throw new Error('Erro do servidor. Tente novamente em alguns instantes');
      }
      
      // In development, fallback to local/demo data for testing
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Using local/demo data for development testing');
        
        const localOutfits = this.getLocalOutfits();
        const demoOutfits = this.getDemoOutfits();
        const allOutfits = [...localOutfits, ...demoOutfits];
        
        return {
          outfits: allOutfits,
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 12,
            total: allOutfits.length,
            totalPages: Math.ceil(allOutfits.length / (params?.limit || 12)),
            hasNext: false,
            hasPrev: false
          }
        };
      }
      
      throw error;
    }
  },

  /**
   * Delete an outfit
   * Now works with real API backend!
   */
  async deleteOutfit(outfitId: string): Promise<void> {
    try {
      console.log('🗑️ Deleting outfit:', outfitId);
      
      // If it's a local/demo outfit, just remove locally
      if (outfitId.startsWith('local_') || outfitId.startsWith('demo-')) {
        this.removeLocalOutfit(outfitId);
        console.log('✅ Local/demo outfit deleted');
        return;
      }
      
      // Delete from API
      const response = await api.delete(`/api/manual-outfits/${outfitId}`);
      
      if (response.data.success) {
        console.log('✅ Outfit deleted from API');
        
        // Also remove from local cache if it exists
        this.removeLocalOutfit(outfitId);
      } else {
        throw new Error(response.data.message || 'Failed to delete outfit');
      }
      
    } catch (error: any) {
      console.error('❌ Error deleting outfit:', error);
      
      // Provide helpful error message
      if (error.response?.status === 401) {
        throw new Error('Você precisa estar logado para deletar looks');
      } else if (error.response?.status === 403) {
        throw new Error('Você não tem permissão para deletar este look');
      } else if (error.response?.status === 404) {
        throw new Error('Look não encontrado');
      } else if (error.response?.status >= 500) {
        throw new Error('Erro do servidor. Tente novamente em alguns instantes');
      }
      
      // In development, still try to remove locally
      if (process.env.NODE_ENV === 'development') {
        this.removeLocalOutfit(outfitId);
        console.log('🔧 Removed locally despite API error (development mode)');
        return;
      }
      
      throw error;
    }
  },

  /**
   * Cache outfit locally for immediate feedback
   */
  cacheOutfitLocally(outfit: ManualOutfit): void {
    try {
      const existing = this.getLocalOutfits();
      // Add to beginning and remove any duplicates
      const updated = [outfit, ...existing.filter(o => o.id !== outfit.id)];
      localStorage.setItem('manual_outfits_cache', JSON.stringify(updated));
      console.log('📦 Outfit cached locally:', outfit.id);
    } catch (error) {
      console.error('Error caching outfit:', error);
    }
  },

  /**
   * Get locally stored outfits
   */
  getLocalOutfits(): ManualOutfit[] {
    try {
      const cached = localStorage.getItem('manual_outfits_cache');
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Error getting local outfits:', error);
      return [];
    }
  },

  /**
   * Remove outfit from local storage
   */
  removeLocalOutfit(outfitId: string): void {
    try {
      const existing = this.getLocalOutfits();
      const filtered = existing.filter(o => o.id !== outfitId);
      localStorage.setItem('manual_outfits_cache', JSON.stringify(filtered));
      
      // Also remove from demo outfits if it exists there
      const demoOutfits = this.getDemoOutfits().filter(o => o.id !== outfitId);
      if (demoOutfits.length < this.getDemoOutfits().length) {
        localStorage.setItem('demo_outfits_removed', JSON.stringify([outfitId]));
      }
      
      console.log('🗑️ Outfit removed from local storage:', outfitId);
    } catch (error) {
      console.error('Error removing local outfit:', error);
    }
  },

  /**
   * Merge API outfits with local outfits, removing duplicates
   */
  mergeOutfits(apiOutfits: ManualOutfit[], localOutfits: ManualOutfit[]): ManualOutfit[] {
    const merged = [...apiOutfits];
    
    // Add local outfits that don't exist in API response
    localOutfits.forEach(localOutfit => {
      const existsInApi = apiOutfits.some(apiOutfit => 
        apiOutfit.id === localOutfit.id || 
        (apiOutfit.name === localOutfit.name && 
         Math.abs(new Date(apiOutfit.createdAt).getTime() - new Date(localOutfit.createdAt).getTime()) < 5000)
      );
      
      if (!existsInApi) {
        merged.push(localOutfit);
      }
    });
    
    // Sort by creation date (newest first)
    return merged.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  /**
   * Get demo outfits for when there's no data
   */
  getDemoOutfits(): ManualOutfit[] {
    const removedIds = this.getRemovedDemoIds();
    
    const demos: ManualOutfit[] = [
      {
        id: 'demo-casual-chic',
        name: 'Look Casual Chic',
        selectedItems: ['item-1', 'item-2', 'item-3'],
        items: [
          { id: 'item-1', type: 'Camiseta', color: 'Azul', brand: 'Zara' },
          { id: 'item-2', type: 'Jeans', color: 'Azul Escuro', brand: "Levi's" },
          { id: 'item-3', type: 'Tênis', color: 'Branco', brand: 'Nike' }
        ],
        mannequinPreference: 'Neutral',
        mannequinImageUrl: 'https://placehold.co/300x400/e2e8f0/64748b?text=Look+Casual',
        notes: 'Perfeito para um passeio descontraído ou encontro casual',
        tags: ['casual', 'chic', 'demo'],
        isPrivate: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isLocalOnly: true
      },
      {
        id: 'demo-business',
        name: 'Look Executivo',
        selectedItems: ['item-4', 'item-5', 'item-6'],
        items: [
          { id: 'item-4', type: 'Camisa', color: 'Branco', brand: 'Hugo Boss' },
          { id: 'item-5', type: 'Calça Social', color: 'Preto', brand: 'Aramis' },
          { id: 'item-6', type: 'Sapato Social', color: 'Preto', brand: 'Democrata' }
        ],
        mannequinPreference: 'Man',
        mannequinImageUrl: 'https://placehold.co/300x400/f1f5f9/475569?text=Look+Executivo',
        notes: 'Ideal para reuniões importantes e apresentações profissionais',
        tags: ['business', 'formal', 'demo'],
        isPrivate: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isLocalOnly: true
      },
      {
        id: 'demo-weekend',
        name: 'Look Final de Semana',
        selectedItems: ['item-7', 'item-8'],
        items: [
          { id: 'item-7', type: 'Moletom', color: 'Cinza', brand: 'Adidas' },
          { id: 'item-8', type: 'Calça Moletom', color: 'Preta', brand: 'Nike' }
        ],
        mannequinPreference: 'Neutral',
        mannequinImageUrl: 'https://placehold.co/300x400/f8fafc/94a3b8?text=Look+Weekend',
        notes: 'Confortável e estiloso para relaxar em casa ou sair com amigos',
        tags: ['casual', 'comfort', 'weekend', 'demo'],
        isPrivate: false,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        isLocalOnly: true
      }
    ];

    // Filter out removed demo outfits
    return demos.filter(demo => !removedIds.includes(demo.id));
  },

  /**
   * Get list of removed demo outfit IDs
   */
  getRemovedDemoIds(): string[] {
    try {
      const removed = localStorage.getItem('demo_outfits_removed');
      return removed ? JSON.parse(removed) : [];
    } catch (error) {
      return [];
    }
  },

  /**
   * Clear all local data (for testing)
   */
  clearLocalData(): void {
    localStorage.removeItem('manual_outfits_cache');
    localStorage.removeItem('demo_outfits_removed');
    console.log('🧹 Local outfit data cleared');
  }
};
