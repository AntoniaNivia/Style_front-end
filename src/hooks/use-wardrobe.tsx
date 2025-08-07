
'use client';

import type { ClothingItem, AddClothingItemData, WardrobeFilters, GenerateOutfitInput, OutfitGeneration, SavedOutfit, AnalyzeClothingOutput } from "@/lib/types";
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import { wardrobeService } from '@/lib/services/wardrobe.service';
import { wardrobeSearchService, WardrobeSearchParams } from '@/lib/services/wardrobe-search.service';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';

interface WardrobeContextType {
    wardrobe: ClothingItem[];
    setWardrobe: Dispatch<SetStateAction<ClothingItem[]>>;
    savedOutfits: SavedOutfit[];
    isLoading: boolean;
    analyzeClothing: (data: { image: string; name?: string; description?: string }) => Promise<AnalyzeClothingOutput | null>;
    addClothingItem: (data: AddClothingItemData) => Promise<ClothingItem | null>;
    deleteClothingItem: (itemId: string) => Promise<boolean>;
    generateOutfit: (preferences: GenerateOutfitInput) => Promise<OutfitGeneration | null>;
    fetchWardrobe: (filters?: WardrobeFilters) => Promise<void>;
    fetchSavedOutfits: () => Promise<void>;
    // New advanced search functions
    searchWardrobe: (params: WardrobeSearchParams) => Promise<any>;
    validateItems: (itemIds: string[]) => Promise<any>;
    getMostUsedItems: (limit?: number) => Promise<any>;
    getWardrobeStats: () => Promise<any>;
    getAvailableFilters: () => Promise<any>;
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export const WardrobeProvider = ({ children }: { children: ReactNode }) => {
    const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
    const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    // Fetch wardrobe items
    const fetchWardrobe = async (filters?: WardrobeFilters) => {
        // CRITICAL: Don't make API calls if user is not authenticated
        if (!isAuthenticated) {
            console.warn('fetchWardrobe called without authentication - ignoring request');
            return;
        }
        
        try {
            setIsLoading(true);
            const result = await wardrobeService.getWardrobe(filters);
            setWardrobe(result.items || []);
        } catch (error: any) {
            toast({
                title: "Erro ao carregar guarda-roupa",
                description: error.response?.data?.message || "Erro desconhecido",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Analyze clothing with AI (without saving)
    const analyzeClothing = async (data: { image: string; name?: string; description?: string }): Promise<AnalyzeClothingOutput | null> => {
        try {
            console.log('🔍 useWardrobe.analyzeClothing called');
            setIsLoading(true);
            const analysis = await wardrobeService.analyzeClothing(data);
            console.log('✅ useWardrobe.analyzeClothing success:', analysis);
            return analysis;
        } catch (error: any) {
            console.error('❌ useWardrobe.analyzeClothing error:', error);
            
            // Handle auth errors
            if (error.response?.status === 401) {
                toast({
                    title: "Sessão expirada",
                    description: "Você precisa fazer login novamente.",
                    variant: "destructive",
                });
                // Redirect to login
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return null;
            }
            
            toast({
                title: "Erro na análise da roupa",
                description: error.response?.data?.message || "Erro desconhecido",
                variant: "destructive",
            });
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Add clothing item with AI analysis
    const addClothingItem = async (data: AddClothingItemData): Promise<ClothingItem | null> => {
        try {
            console.log('🔍 useWardrobe.addClothingItem called');
            setIsLoading(true);
            const newItem = await wardrobeService.addClothingItem(data);
            console.log('✅ useWardrobe.addClothingItem success:', newItem);
            
            // Add to wardrobe
            setWardrobe(prev => [newItem, ...prev]);
            
            toast({
                title: "Item adicionado com sucesso!",
                description: "Sua peça foi analisada pela IA e adicionada ao guarda-roupa.",
            });
            
            return newItem;
        } catch (error: any) {
            console.error('❌ useWardrobe.addClothingItem error:', error);
            
            // Handle auth errors
            if (error.response?.status === 401) {
                toast({
                    title: "Sessão expirada",
                    description: "Você precisa fazer login novamente.",
                    variant: "destructive",
                });
                // Redirect to login
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return null;
            }
            
            toast({
                title: "Erro ao adicionar item",
                description: error.response?.data?.message || "Erro desconhecido",
                variant: "destructive",
            });
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete clothing item
    const deleteClothingItem = async (itemId: string): Promise<boolean> => {
        try {
            await wardrobeService.deleteClothingItem(itemId);
            
            // Remove from wardrobe
            setWardrobe(prev => prev.filter(item => item.id !== itemId));
            
            toast({
                title: "Item removido",
                description: "O item foi removido do seu guarda-roupa.",
            });
            
            return true;
        } catch (error: any) {
            toast({
                title: "Erro ao remover item",
                description: error.response?.data?.message || "Erro desconhecido",
                variant: "destructive",
            });
            return false;
        }
    };

    // Generate outfit with AI
    const generateOutfit = async (preferences: GenerateOutfitInput): Promise<OutfitGeneration | null> => {
        try {
            setIsLoading(true);
            const outfit = await wardrobeService.generateOutfit(preferences);
            
            toast({
                title: "Look gerado com sucesso!",
                description: "Sua IA estilista criou um look perfeito para você.",
            });
            
            return outfit;
        } catch (error: any) {
            toast({
                title: "Erro ao gerar look",
                description: error.response?.data?.message || "Erro desconhecido",
                variant: "destructive",
            });
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch saved outfits
    const fetchSavedOutfits = async () => {
        try {
            setIsLoading(true);
            const result = await wardrobeService.getSavedOutfits();
            setSavedOutfits(result.outfits || []);
        } catch (error: any) {
            toast({
                title: "Erro ao carregar looks salvos",
                description: error.response?.data?.message || "Erro desconhecido",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Advanced search in wardrobe
    const searchWardrobe = async (params: WardrobeSearchParams) => {
        if (!isAuthenticated) {
            console.warn('searchWardrobe called without authentication - ignoring request');
            return null;
        }
        
        try {
            setIsLoading(true);
            const result = await wardrobeSearchService.searchWardrobe(params);
            return result;
        } catch (error: any) {
            toast({
                title: "Erro na busca",
                description: error.response?.data?.message || "Erro desconhecido",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Validate items in bulk
    const validateItems = async (itemIds: string[]) => {
        if (!isAuthenticated) {
            console.warn('validateItems called without authentication - ignoring request');
            return null;
        }
        
        try {
            const result = await wardrobeSearchService.validateItems(itemIds);
            return result;
        } catch (error: any) {
            toast({
                title: "Erro na validação",
                description: error.response?.data?.message || "Erro desconhecido",
                variant: "destructive",
            });
            throw error;
        }
    };

    // Get most used items
    const getMostUsedItems = async (limit = 10) => {
        if (!isAuthenticated) {
            console.warn('getMostUsedItems called without authentication - ignoring request');
            return null;
        }
        
        try {
            const result = await wardrobeSearchService.getMostUsedItems(limit);
            return result;
        } catch (error: any) {
            toast({
                title: "Erro ao carregar itens mais usados",
                description: error.response?.data?.message || "Erro desconhecido",
                variant: "destructive",
            });
            throw error;
        }
    };

    // Get wardrobe statistics
    const getWardrobeStats = async () => {
        if (!isAuthenticated) {
            console.warn('getWardrobeStats called without authentication - ignoring request');
            return null;
        }
        
        try {
            const result = await wardrobeSearchService.getWardrobeStats();
            return result;
        } catch (error: any) {
            toast({
                title: "Erro ao carregar estatísticas",
                description: error.response?.data?.message || "Erro desconhecido",
                variant: "destructive",
            });
            throw error;
        }
    };

    // Get available filters
    const getAvailableFilters = async () => {
        if (!isAuthenticated) {
            console.warn('getAvailableFilters called without authentication - ignoring request');
            return null;
        }
        
        try {
            const result = await wardrobeSearchService.getAvailableFilters();
            return result;
        } catch (error: any) {
            toast({
                title: "Erro ao carregar filtros",
                description: error.response?.data?.message || "Erro desconhecido",
                variant: "destructive",
            });
            throw error;
        }
    };

    // Note: fetchWardrobe is called on-demand by components when needed
    // No automatic loading to prevent unauthorized API calls

    return (
        <WardrobeContext.Provider value={{ 
            wardrobe, 
            setWardrobe, 
            savedOutfits,
            isLoading,
            analyzeClothing,
            addClothingItem, 
            deleteClothingItem,
            generateOutfit,
            fetchWardrobe,
            fetchSavedOutfits,
            searchWardrobe,
            validateItems,
            getMostUsedItems,
            getWardrobeStats,
            getAvailableFilters
        }}>
            {children}
        </WardrobeContext.Provider>
    );
};

export const useWardrobe = () => {
    const context = useContext(WardrobeContext);
    if (context === undefined) {
        throw new Error('useWardrobe must be used within a WardrobeProvider');
    }
    return context;
};
