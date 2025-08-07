'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { manualOutfitService } from '@/lib/services/manual-outfit-dynamic.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogCancel, 
  AlertDialogAction 
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Shirt, 
  Search, 
  Filter,
  Plus, 
  Copy, 
  Trash2, 
  Eye,
  EyeOff,
  Clock,
  Tag,
  StickyNote,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Calendar,
  Palette
} from 'lucide-react';

interface ManualOutfit {
  id: string;
  name: string;
  selectedItems: string[];
  items?: Array<{
    id: string;
    type: string;
    color: string;
    brand?: string;
  }>;
  mannequinPreference?: 'Man' | 'Woman' | 'Neutral';
  mannequinImageUrl?: string;
  notes?: string;
  tags?: string[];
  isPrivate?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function ManualOutfitsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [outfits, setOutfits] = useState<ManualOutfit[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrivateOnly, setShowPrivateOnly] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // UI state
  const [outfitToDelete, setOutfitToDelete] = useState<ManualOutfit | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load outfits
  const loadOutfits = async (page = 1, search = '', isPrivate?: boolean) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading outfits:', { page, search, isPrivate, selectedTags });

      const response = await manualOutfitService.getMyOutfits({
        page,
        limit: 12,
        search: search || undefined,
        tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined
      });

      console.log('✅ Outfits loaded:', response);
      
      setOutfits(response.outfits || []);
      setPagination(response.pagination);
      setCurrentPage(page);
      setRetryCount(0);

    } catch (error: any) {
      console.error('❌ Error loading outfits:', error);
      setError(error.message || 'Erro ao carregar looks');
      
      // Mock data fallback for development
      if (retryCount < 2) {
        setOutfits([]);
        setPagination({
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle duplicate outfit
  const handleDuplicate = async (outfit: ManualOutfit) => {
    try {
      setDuplicatingId(outfit.id);
      
      // Create duplicate data for manual builder
      const duplicateData = {
        name: `${outfit.name} (Cópia)`,
        notes: outfit.notes || '',
        selectedItems: outfit.selectedItems || [],
        mannequinPreference: outfit.mannequinPreference || 'Neutral'
      };
      
      // Store the duplicated outfit data in session storage for the manual builder
      sessionStorage.setItem('duplicateOutfitData', JSON.stringify(duplicateData));
      
      toast({
        title: "Look preparado para duplicação",
        description: "Redirecionando para o construtor de looks...",
      });
      
      // Redirect to manual builder which will load the duplicate data
      router.push('/manual-builder');
      
    } catch (error) {
      console.error('Error duplicating outfit:', error);
      toast({
        variant: "destructive",
        title: "Erro ao duplicar look",
        description: "Não foi possível duplicar o look. Tente novamente.",
      });
    } finally {
      setDuplicatingId(null);
    }
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    if (!isAuthenticated || !outfitToDelete?.id) return;
    
    try {
      setDeletingId(outfitToDelete.id);
      await manualOutfitService.deleteOutfit(outfitToDelete.id);
      
      toast({
        title: "Look excluído",
        description: `"${outfitToDelete.name}" foi excluído com sucesso.`,
      });

      // Remove from local state
      setOutfits(prev => prev.filter(o => o.id !== outfitToDelete.id));
      setOutfitToDelete(null);

      // Reload if needed
      if (outfits.length === 1 && currentPage > 1) {
        loadOutfits(currentPage - 1, searchTerm, showPrivateOnly);
      }

    } catch (err: any) {
      console.error('Error deleting outfit:', err);
      toast({
        variant: "destructive",
        title: "Erro ao excluir look",
        description: err.message || "Não foi possível excluir o look. Tente novamente.",
      });
    } finally {
      setDeletingId(null);
      setOutfitToDelete(null);
    }
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    loadOutfits(1, searchTerm, showPrivateOnly);
  };

  // Handle filter changes
  const handleFilterChange = () => {
    setCurrentPage(1);
    loadOutfits(1, searchTerm, showPrivateOnly);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    loadOutfits(page, searchTerm, showPrivateOnly);
  };

  // Get all available tags
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    outfits.forEach(outfit => {
      outfit.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [outfits]);

  // Filter outfits locally (additional to server filtering)
  const filteredOutfits = React.useMemo(() => {
    return outfits.filter(outfit => {
      // Local search filter (additional to server search)
      const matchesSearch = !searchTerm || 
        outfit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (outfit.notes && outfit.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Privacy filter
      const matchesPrivacy = !showPrivateOnly || outfit.isPrivate;
      
      // Tags filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => outfit.tags?.includes(tag));
      
      return matchesSearch && matchesPrivacy && matchesTags;
    });
  }, [outfits, searchTerm, showPrivateOnly, selectedTags]);

  // Toggle tag filter
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      loadOutfits();
    }
  }, [isAuthenticated, selectedTags]);

  // Loading state
  if (loading && retryCount === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shirt className="h-8 w-8" />
            Looks Salvos
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error && retryCount >= 2) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shirt className="h-8 w-8" />
            Looks Salvos
          </h1>
        </div>
        
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">Erro ao carregar looks</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => {
                setRetryCount(0);
                loadOutfits();
              }}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shirt className="h-8 w-8" />
          Looks Salvos
          {pagination && (
            <Badge variant="secondary" className="ml-2">
              {pagination.total}
            </Badge>
          )}
        </h1>

        <Button
          onClick={() => router.push('/manual-builder')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Criar Look
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Buscar por nome ou notas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Privacy Filter */}
            <Button
              onClick={() => {
                setShowPrivateOnly(!showPrivateOnly);
                handleFilterChange();
              }}
              variant={showPrivateOnly ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              {showPrivateOnly ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPrivateOnly ? 'Apenas Privados' : 'Todos os Looks'}
            </Button>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filtrar por tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {selectedTags.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSelectedTags([])}
                  >
                    Limpar Filtros
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Outfits Grid */}
      {filteredOutfits.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shirt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Nenhum look encontrado</h2>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedTags.length > 0 
                  ? 'Tente ajustar os filtros ou criar um novo look.'
                  : 'Você ainda não tem looks salvos. Que tal criar o primeiro?'
                }
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => router.push('/manual-builder')}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Criar Primeiro Look
                </Button>
                {(searchTerm || selectedTags.length > 0) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTags([]);
                      setShowPrivateOnly(false);
                      loadOutfits();
                    }}
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOutfits.map((outfit) => (
            <Card key={outfit.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{outfit.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(outfit.createdAt).toLocaleDateString()}
                      {outfit.isPrivate && (
                        <>
                          <Separator orientation="vertical" className="h-3" />
                          <EyeOff className="h-3 w-3" />
                          <span>Privado</span>
                        </>
                      )}
                    </div>
                  </div>
                  {outfit.mannequinPreference && (
                    <Badge variant="outline" className="text-xs">
                      <Palette className="h-3 w-3 mr-1" />
                      {outfit.mannequinPreference}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Items Preview */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shirt className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {outfit.selectedItems?.length || 0} itens
                    </span>
                  </div>
                  
                  {outfit.items && outfit.items.length > 0 ? (
                    <div className="grid grid-cols-4 gap-1 mb-2">
                      {outfit.items.slice(0, 4).map((item, index) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-100 rounded-md flex items-center justify-center text-xs"
                          style={{ backgroundColor: item.color ? `${item.color}20` : undefined }}
                        >
                          <span className="font-medium">
                            {item.type?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-16 bg-gray-50 rounded-md flex items-center justify-center text-sm text-gray-500">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Visualização não disponível
                    </div>
                  )}
                </div>

                {/* Tags */}
                {outfit.tags && outfit.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {outfit.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {outfit.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{outfit.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {outfit.notes && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <StickyNote className="h-3 w-3" />
                      <span className="text-xs font-medium">Notas</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {outfit.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDuplicate(outfit)}
                    disabled={duplicatingId === outfit.id}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    {duplicatingId === outfit.id ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>

                  <Button
                    onClick={() => setOutfitToDelete(outfit)}
                    disabled={deletingId === outfit.id}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    {deletingId === outfit.id ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrev}
            variant="outline"
            size="sm"
          >
            Anterior
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i;
              return (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className="w-8"
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNext}
            variant="outline"
            size="sm"
          >
            Próximo
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!outfitToDelete} onOpenChange={() => setOutfitToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o look "{outfitToDelete?.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
