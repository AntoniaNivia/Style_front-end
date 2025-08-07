import { useState, useEffect } from 'react';
import { profileService } from '@/lib/services/profile.service';
import { ProfileStats, UserOutfit, UpdateProfileData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';

export function useProfile() {
  const [stats, setStats] = useState<ProfileStats>({
    totalOutfits: 0,
    totalLikes: 0,
    favoritedOutfits: 0,
    aiGeneratedOutfits: 0,
    followersCount: 0,
    followingCount: 0
  });
  const [outfits, setOutfits] = useState<UserOutfit[]>([]);
  const [favorites, setFavorites] = useState<UserOutfit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [backendError, setBackendError] = useState(false);
  const { toast } = useToast();
  const { user, refreshUser } = useUser();

  // Carregar estatísticas do perfil
  const loadProfileStats = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await profileService.getProfileStats();
      if (response.success && response.data) {
        setStats(response.data);
        setBackendError(false); // Reset error state on success
      }
    } catch (error: any) {
      console.error('Erro ao carregar estatísticas:', error);
      if (error.message.includes('Network Error') || 
          error.message.includes('ECONNREFUSED') || 
          error.message.includes('ENOTFOUND') ||
          error.code === 'ECONNREFUSED') {
        setBackendError(true);
        // Set default stats when backend is unavailable
        setStats({
          totalOutfits: 0,
          totalLikes: 0,
          favoritedOutfits: 0,
          aiGeneratedOutfits: 0,
          followersCount: 0,
          followingCount: 0
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar outfits do usuário
  const loadUserOutfits = async (page: number = 1) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await profileService.getUserOutfits(page);
      if (response.success && response.data?.outfits) {
        if (page === 1) {
          setOutfits(response.data.outfits);
        } else {
          setOutfits(prev => [...prev, ...(response.data?.outfits || [])]);
        }
        setBackendError(false); // Reset error state on success
      }
    } catch (error: any) {
      console.error('Erro ao carregar outfits:', error);
      if (error.message.includes('Network Error') || 
          error.message.includes('ECONNREFUSED') || 
          error.message.includes('ENOTFOUND') ||
          error.code === 'ECONNREFUSED') {
        setBackendError(true);
        // Set empty outfits when backend is unavailable
        if (page === 1) {
          setOutfits([]);
        }
      } else {
        toast({
          title: "Erro ao carregar outfits",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar favoritos do usuário
  const loadUserFavorites = async (page: number = 1) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await profileService.getUserFavorites(page);
      if (response.success && response.data?.outfits) {
        if (page === 1) {
          setFavorites(response.data.outfits);
        } else {
          setFavorites(prev => [...prev, ...(response.data?.outfits || [])]);
        }
        setBackendError(false); // Reset error state on success
      }
    } catch (error: any) {
      console.error('Erro ao carregar favoritos:', error);
      if (error.message.includes('Network Error') || 
          error.message.includes('ECONNREFUSED') || 
          error.message.includes('ENOTFOUND') ||
          error.code === 'ECONNREFUSED') {
        setBackendError(true);
        // Set empty favorites when backend is unavailable
        if (page === 1) {
          setFavorites([]);
        }
      } else {
        toast({
          title: "Erro ao carregar favoritos",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar perfil
  const updateProfile = async (data: UpdateProfileData) => {
    if (!user) return false;
    
    setIsUpdating(true);
    try {
      const response = await profileService.updateProfile(data);
      if (response.success) {
        toast({
          title: "Perfil atualizado!",
          description: "Suas informações foram salvas com sucesso.",
        });
        await refreshUser();
        return true;
      }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
    return false;
  };

  // Upload de avatar
  const uploadAvatar = async (imageDataUri: string) => {
    if (!user) return false;
    
    setIsUpdating(true);
    try {
      const response = await profileService.uploadAvatar({ imageDataUri });
      if (response.success && response.data?.avatarUrl) {
        toast({
          title: "Foto de perfil atualizada!",
          description: "Sua nova foto já está visível.",
        });
        await refreshUser();
        return true;
      }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar foto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
    return false;
  };

  // Curtir/descurtir outfit
  const toggleLike = async (outfitId: string, targetType: 'OUTFIT' | 'POST' = 'OUTFIT') => {
    if (!user) return;
    
    try {
      const response = await profileService.toggleLike({
        targetId: outfitId,
        targetType
      });
      
      if (response.success && response.data) {
        const { isLiked, likesCount } = response.data;
        
        setOutfits(prev => prev.map(outfit => 
          outfit.id === outfitId 
            ? { ...outfit, isLiked, likes: likesCount }
            : outfit
        ));
        
        setFavorites(prev => prev.map(outfit => 
          outfit.id === outfitId 
            ? { ...outfit, isLiked, likes: likesCount }
            : outfit
        ));
        
        await loadProfileStats();
        return isLiked;
      }
    } catch (error: any) {
      toast({
        title: "Erro ao curtir",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Favoritar/desfavoritar outfit
  const toggleFavorite = async (outfitId: string, targetType: 'OUTFIT' | 'POST' = 'OUTFIT') => {
    if (!user) return;
    
    try {
      const response = await profileService.toggleFavorite({
        targetId: outfitId,
        targetType
      });
      
      if (response.success && response.data) {
        const { isFavorited } = response.data;
        
        setOutfits(prev => prev.map(outfit => 
          outfit.id === outfitId 
            ? { ...outfit, isFavorited }
            : outfit
        ));
        
        if (!isFavorited) {
          setFavorites(prev => prev.filter(outfit => outfit.id !== outfitId));
        }
        
        await loadProfileStats();
        return isFavorited;
      }
    } catch (error: any) {
      toast({
        title: "Erro ao favoritar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Criar outfit personalizado
  const createOutfit = async (data: {
    title: string;
    itemIds: string[];
    tags: string[];
    imageDataUri?: string;
  }) => {
    if (!user) return false;
    
    setIsUpdating(true);
    try {
      const response = await profileService.createCustomOutfit(data);
      if (response.success && response.data) {
        toast({
          title: "Outfit criado!",
          description: "Seu novo look foi salvo com sucesso.",
        });
        
        await loadUserOutfits();
        await loadProfileStats();
        return true;
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar outfit",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
    return false;
  };

  // Deletar outfit
  const deleteOutfit = async (outfitId: string) => {
    if (!user) return false;
    
    try {
      const response = await profileService.deleteOutfit(outfitId);
      if (response.success) {
        toast({
          title: "Outfit deletado",
          description: "O outfit foi removido com sucesso.",
        });
        
        setOutfits(prev => prev.filter(outfit => outfit.id !== outfitId));
        setFavorites(prev => prev.filter(outfit => outfit.id !== outfitId));
        
        await loadProfileStats();
        return true;
      }
    } catch (error: any) {
      toast({
        title: "Erro ao deletar outfit",
        description: error.message,
        variant: "destructive",
      });
    }
    return false;
  };

  useEffect(() => {
    if (user) {
      loadProfileStats();
      loadUserOutfits();
      loadUserFavorites();
    }
  }, [user]);

  return {
    stats,
    outfits,
    favorites,
    isLoading,
    isUpdating,
    backendError,
    updateProfile,
    uploadAvatar,
    loadUserOutfits,
    loadUserFavorites,
    loadProfileStats,
    toggleLike,
    toggleFavorite,
    createOutfit,
    deleteOutfit,
  };
}
