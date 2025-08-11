'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Plus, Minus, Eye, Save, Trash2, Check, ShirtIcon, RefreshCw } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useWardrobe } from '@/hooks/use-wardrobe';
import { useMockAuth } from '@/hooks/use-mock-auth';
import { ClothingItem } from '@/lib/types';
import { mannequinService } from '@/lib/services/mannequin.service';
import { manualOutfitService } from '@/lib/services/manual-outfit-dynamic.service';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { debugApi } from '@/lib/debug-api';

interface SelectedItem {
  id: string;
  item: ClothingItem;
  category: string;
}

interface ManualOutfit {
  id: string;
  selectedItems: SelectedItem[];
  mannequinPreference: 'Woman' | 'Man' | 'Neutral';
  outfitName: string;
  notes: string;
  mannequinImage: string;
  previewId?: string; // ID da geração no backend
  createdAt: Date;
}

export default function ManualBuilderPage() {
  const router = useRouter();
  const { wardrobe, isLoading, fetchWardrobe, searchWardrobe } = useWardrobe();
  // Debug: mostrar wardrobe completo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEBUG] Wardrobe:', wardrobe);
    }
  }, [wardrobe]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [mannequinPreference, setMannequinPreference] = useState<'Woman' | 'Man' | 'Neutral'>('Woman');
  const [outfitName, setOutfitName] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [generatedOutfit, setGeneratedOutfit] = useState<ManualOutfit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchResults, setSearchResults] = useState<ClothingItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mannequinImage, setMannequinImage] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [isGeneratingMannequin, setIsGeneratingMannequin] = useState(false);

  useEffect(() => {
    fetchWardrobe();
  }, [fetchWardrobe]);

  // Load duplicated outfit data and restore selected items
  useEffect(() => {
    const loadDuplicateData = () => {
      const duplicateData = sessionStorage.getItem('duplicateOutfitData');
      if (duplicateData && wardrobe.length > 0) {
        try {
          const data = JSON.parse(duplicateData);
          
          // Pre-fill form with duplicated data
          setOutfitName(data.name || '');
          setNotes(data.notes || '');
          setMannequinPreference(data.mannequinPreference || 'Neutral');
          
          // Restore selected items if they exist in wardrobe
          if (data.selectedItems && Array.isArray(data.selectedItems)) {
            const restoredItems: SelectedItem[] = [];
            
            data.selectedItems.forEach((itemId: string) => {
              const item = wardrobe.find(w => w.id === itemId);
              if (item) {
                restoredItems.push({
                  id: item.id,
                  item,
                  category: item.type // Using type as category since category doesn't exist
                });
              }
            });
            
            if (restoredItems.length > 0) {
              setSelectedItems(restoredItems);
            }
          }
          
          // Clear the session storage
          sessionStorage.removeItem('duplicateOutfitData');
          
          toast({
            title: "Look Carregado",
            description: `Look "${data.name}" carregado para edição com ${data.selectedItems?.length || 0} itens.`,
          });
        } catch (error) {
          console.error('Erro ao carregar dados duplicados:', error);
        }
      }
    };

    // Only load if wardrobe is ready
    if (wardrobe.length > 0) {
      loadDuplicateData();
    }
  }, [wardrobe]); // Run when wardrobe is loaded

  // Advanced search effect
  useEffect(() => {
    const performSearch = async () => {
      if (!searchWardrobe) return;

      // If no search terms, use regular wardrobe
      if (!searchTerm && filterType === 'all') {
        setSearchResults(wardrobe);
        return;
      }

      try {
        setIsSearching(true);
        const searchParams = {
          q: searchTerm || undefined,
          type: filterType !== 'all' ? filterType : undefined,
          page: 1,
          limit: 100 // Get more results for better UX
        };

        const results = await searchWardrobe(searchParams);
        setSearchResults(results?.items || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults(wardrobe); // Fallback to regular wardrobe
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterType, wardrobe, searchWardrobe]);

  // Get filtered items (now using advanced search results or local wardrobe)
  const getFilteredItems = (): ClothingItem[] => {
    return searchResults;
  };

  const toggleItemSelection = (itemId: string) => {
    const isSelected = selectedItems.some(selected => selected.id === itemId);
    const item = wardrobe.find(item => item.id === itemId);
    
    if (!item) return;
    
    if (isSelected) {
      // Remove item
      setSelectedItems(prev => prev.filter(selected => selected.id !== itemId));
      toast({
        title: "Item Removido",
        description: `${item.type} removido do look.`,
      });
    } else {
      // Add item
      const newSelection: SelectedItem = {
        id: item.id,
        item,
        category: item.type // Use item type as category
      };
      setSelectedItems(prev => [...prev, newSelection]);
      toast({
        title: "Item Adicionado", 
        description: `${item.type} adicionado ao look.`,
      });
    }
  };

  const clearAllSelections = () => {
    setSelectedItems([]);
    toast({
      title: "Look Limpo",
      description: "Todas as peças foram removidas.",
    });
  };

  const generateMannequinImage = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Selecione Itens",
        description: "Você precisa selecionar pelo menos uma peça para gerar o manequim.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingMannequin(true);
    setIsGenerating(true);

    try {
      console.log('🎨 Gerando manequim com itens:', selectedItems);

      // Call the real mannequin generation API
      const generationData = await mannequinService.generateMannequin({
        selectedItems: selectedItems.map(item => item.id),
        mannequinPreference,
        outfitName: outfitName || `Look Manual ${new Date().toLocaleDateString()}`,
        notes: notes || ''
      });

      console.log('✅ Manequim gerado:', generationData);

      // Update states with generated data
      setMannequinImage(generationData.mannequinImageUrl);
      setPreviewId(generationData.previewId);

      // Generate a unique outfit ID
      const outfitId = `manual_${Date.now()}`;

      const newOutfit: ManualOutfit = {
        id: outfitId,
        selectedItems,
        mannequinPreference,
        outfitName: outfitName || `Look Manual ${new Date().toLocaleDateString()}`,
        notes,
        mannequinImage: generationData.mannequinImageUrl,
        previewId: generationData.previewId,
        createdAt: new Date()
      };

      setGeneratedOutfit(newOutfit);

      toast({
        title: "Manequim Gerado!",
        description: `Preview do look "${newOutfit.outfitName}" criado com sucesso.`,
      });

    } catch (error: any) {
      console.error('❌ Erro ao gerar manequim:', error);
      
      // Fallback: create outfit without real image generation
      const outfitId = `manual_${Date.now()}`;
      const fallbackImageUrl = `/api/mannequin-preview/${mannequinPreference.toLowerCase()}-${outfitId}.jpg`;

      const fallbackOutfit: ManualOutfit = {
        id: outfitId,
        selectedItems,
        mannequinPreference,
        outfitName: outfitName || `Look Manual ${new Date().toLocaleDateString()}`,
        notes,
        mannequinImage: fallbackImageUrl,
        previewId: `fallback_${outfitId}`,
        createdAt: new Date()
      };

      setGeneratedOutfit(fallbackOutfit);
      setMannequinImage(fallbackImageUrl);

      toast({
        title: "Preview Criado",
        description: `Look "${fallbackOutfit.outfitName}" criado em modo offline.`,
      });
    } finally {
      setIsGenerating(false);
      setIsGeneratingMannequin(false);
    }
  };

  const saveOutfit = async () => {
    if (!generatedOutfit) return;

    try {
      // Enhanced logging for debugging
      console.log('[DEBUG] Iniciando salvamento do look manual:', {
        outfitName: generatedOutfit.outfitName,
        selectedItemsCount: selectedItems.length
      });

      const outfitData = {
        name: generatedOutfit.outfitName,
        selectedItems: selectedItems.map(item => item.id),
        itemIds: selectedItems.map(item => item.id), // Backend expects itemIds
        items: selectedItems.map(item => ({
          id: item.id,
          type: item.item.type,
          color: item.item.color
        })),
        notes: generatedOutfit.notes || '',
        tags: ['manual', mannequinPreference.toLowerCase()],
        isPrivate: false,
        mannequinPreference,
        mannequinImageUrl: generatedOutfit.mannequinImage,
        previewId: generatedOutfit.previewId
      };

      console.log('[DEBUG] Dados do outfit:', outfitData);

      const savedOutfit = await manualOutfitService.createOutfit(outfitData);
      
      console.log('[DEBUG] Look salvo com sucesso:', savedOutfit);

      toast({
        title: "Look salvo com sucesso! 🎉",
        description: `"${generatedOutfit.outfitName}" foi adicionado aos seus looks salvos.`,
        duration: 5000,
      });

      // Show option to view saved looks
      setTimeout(() => {
        const shouldNavigate = confirm("Look salvo com sucesso! Deseja ver seus looks salvos?");
        if (shouldNavigate) {
          router.push('/manual-outfits?success=true');
        } else {
          startNewOutfit();
        }
      }, 1000);

    } catch (error) {
      console.error('[ERROR] Erro ao salvar look:', error);
      
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Não foi possível salvar o look. Tente novamente.",
      });
    }
  };

  const startNewOutfit = () => {
    setSelectedItems([]);
    setGeneratedOutfit(null);
    setOutfitName('');
    setNotes('');
    setSearchTerm('');
    setFilterType('all');
  };

  if (wardrobe.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="text-6xl mb-4">👗</div>
          <h2 className="text-2xl font-bold mb-2">Guarda-roupa Vazio</h2>
          <p className="text-muted-foreground mb-4 max-w-md">
            Para criar looks manualmente, você precisa adicionar itens ao seu guarda-roupa primeiro.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <a href="/wardrobe">Adicionar Itens ao Guarda-roupa</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Montagem Manual de Looks</h1>
        <p className="text-muted-foreground">
          Selecione as peças do seu guarda-roupa e crie looks personalizados
        </p>
      </div>

      {!generatedOutfit ? (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <Label className="text-sm font-medium">Buscar</Label>
                  <Input
                    placeholder="Nome, cor, marca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Type Filter */}
                <div>
                  <Label className="text-sm font-medium">Tipo de Peça</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Peças</SelectItem>
                      <SelectItem value="camisa">Camisas</SelectItem>
                      <SelectItem value="calça">Calças</SelectItem>
                      <SelectItem value="sapato">Sapatos</SelectItem>
                      <SelectItem value="vestido">Vestidos</SelectItem>
                      <SelectItem value="jaqueta">Jaquetas</SelectItem>
                      <SelectItem value="short">Shorts</SelectItem>
                      <SelectItem value="saia">Saias</SelectItem>
                      <SelectItem value="tênis">Tênis</SelectItem>
                      <SelectItem value="blusa">Blusas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Total no Guarda-roupa:</Label>
                    <Badge className="ml-2" variant="outline">{wardrobe.length} itens</Badge>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Filtrados:</Label>
                    <Badge className="ml-2" variant="secondary">{getFilteredItems().length} itens</Badge>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Selecionados:</Label>
                    <Badge className="ml-2">{selectedItems.length} itens</Badge>
                  </div>
                  
                  {selectedItems.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearAllSelections}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpar Seleção
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Items Grid */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Seus Itens do Guarda-Roupa</CardTitle>
                <CardDescription>
                  Clique nas peças para adicionar ou remover do seu look
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {getFilteredItems().map((item: ClothingItem) => {
                    const isSelected = selectedItems.some(selected => selected.id === item.id);
                    
                    return (
                      <div
                        key={item.id}
                        className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleItemSelection(item.id)}
                      >
                        <div className="aspect-square relative">
                          <img
                            src={item.photoUrl || '/api/placeholder/150/150'}
                            alt={item.type}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-sm line-clamp-1 capitalize">{item.type}</h3>
                          <div className="flex gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.color}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.season}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {getFilteredItems().length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <ShirtIcon className="h-12 w-12 mx-auto" />
                    </div>
                    <p className="text-muted-foreground">
                      {searchTerm || filterType !== 'all' 
                        ? 'Nenhum item encontrado com esses filtros. Tente ajustar a busca.'
                        : 'Nenhum item encontrado no seu guarda-roupa.'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview & Controls */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Preview do Look</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Items List */}
                <div>
                  <Label className="text-sm font-medium">Itens Selecionados:</Label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {selectedItems.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nenhum item selecionado
                      </p>
                    ) : (
                      selectedItems.map((selected) => (
                        <div 
                          key={selected.id}
                          className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                        >
                          <span>{selected.item.type || 'Tipo indefinido'}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleItemSelection(selected.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <Separator />

                {/* Visual Preview of Selected Items */}
                {selectedItems.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Preview dos Itens:</Label>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {selectedItems.map((selected) => (
                        <div 
                          key={selected.id}
                          className="aspect-square bg-muted rounded-md flex flex-col items-center justify-center p-2 text-center border-2 border-dashed border-muted-foreground/20"
                        >
                          <div 
                            className="w-6 h-6 rounded-full mb-1"
                            style={{ 
                              backgroundColor: selected.item.color?.toLowerCase() || '#ccc',
                              border: '1px solid rgba(0,0,0,0.1)'
                            }}
                          />
                          <span className="text-xs font-medium line-clamp-2">
                            {selected.item.type || 'Tipo indefinido'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Outfit Configuration */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="outfitName">Nome do Look</Label>
                    <Input
                      id="outfitName"
                      placeholder="Meu Look Incrível"
                      value={outfitName}
                      onChange={(e) => setOutfitName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="mannequinPreference">Manequim</Label>
                    <Select
                      value={mannequinPreference}
                      onValueChange={(value: 'Woman' | 'Man' | 'Neutral') => setMannequinPreference(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Woman">Mulher</SelectItem>
                        <SelectItem value="Man">Homem</SelectItem>
                        <SelectItem value="Neutral">Neutro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notas (opcional)</Label>
                    <Input
                      id="notes"
                      placeholder="Ocasião, dicas de estilo..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  onClick={generateMannequinImage}
                  disabled={selectedItems.length === 0 || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Gerar Preview
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Generated Outfit Display */
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Visualização no Manequim</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                  {mannequinImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={mannequinImage}
                        alt={`Manequim ${mannequinPreference} com ${selectedItems.length} itens`}
                        fill
                        className="object-cover rounded-lg"
                        onError={() => {
                          console.log('Erro ao carregar imagem do manequim, usando placeholder');
                          setMannequinImage(null);
                        }}
                      />
                      {previewId && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs">
                            ID: {previewId.substring(0, 8)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Manequim {mannequinPreference}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedItems.length} itens
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={generateMannequinImage}
                          disabled={selectedItems.length === 0 || isGeneratingMannequin}
                        >
                          {isGeneratingMannequin ? (
                            <>
                              <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                              Gerando...
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-3 w-3" />
                              Gerar Preview
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{generatedOutfit.outfitName}</CardTitle>
                {generatedOutfit.notes && (
                  <CardDescription>{generatedOutfit.notes}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Button onClick={saveOutfit}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Look
                  </Button>
                  <Button variant="outline" onClick={startNewOutfit}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Look
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/manual-outfits')}
                    className="ml-auto"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Meus Looks
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Itens do Look</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generatedOutfit.selectedItems.map((selected) => (
                    <div key={selected.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 relative">
                        <Image
                          src={selected.item.photoUrl || '/placeholder-clothing.jpg'}
                          alt={selected.item.type || 'Tipo indefinido'}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{selected.item.type || 'Tipo indefinido'}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{selected.item.color}</Badge>
                          <Badge variant="outline">{selected.item.season}</Badge>
                          <Badge variant="outline" className="capitalize">
                            {selected.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
