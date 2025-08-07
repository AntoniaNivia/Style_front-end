'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { useAuth } from "@/hooks/use-auth";
import { useWardrobe } from "@/hooks/use-wardrobe";
import { useProfile } from "@/hooks/use-profile";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { BackendNotice } from "@/components/ui/backend-notice";
import { Edit, AtSign, Tag, Shirt, Sparkles, User as UserIcon, Calendar, MapPin, Settings, Heart, Share2, Grid3X3, List, Camera, Trophy, Target, TrendingUp, Plus, Filter, Star, Trash2, Palette, Coffee, Music, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { UserOutfit } from "@/lib/types";
import Image from "next/image";

export default function ProfilePage() {
    const { user } = useUser();
    const { logout } = useAuth();
    const { wardrobe } = useWardrobe();
    const { toast } = useToast();
    const router = useRouter();
    
    // Profile hook com todas as funcionalidades
    const {
        stats,
        outfits,
        favorites,
        isLoading,
        isUpdating,
        backendError,
        updateProfile,
        toggleLike,
        toggleFavorite,
        deleteOutfit,
    } = useProfile();
    
    const [activeTab, setActiveTab] = useState('overview');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [preferencesDialogOpen, setPreferencesDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        style: '',
        bio: '',
        location: ''
    });

    // Estado para preferências de estilo
    const [stylePreferences, setStylePreferences] = useState({
        favoriteColors: [] as string[],
        preferredStyles: [] as string[],
        bodyType: '',
        favoriteOccasions: [] as string[],
        personalityTraits: [] as string[],
        fashionInspiration: [] as string[],
        shoppingHabits: '',
        budgetRange: '',
        lifestyle: [] as string[],
        fashionGoals: [] as string[]
    });

    useEffect(() => {
        if (user) {
            setEditForm({
                name: user.name || '',
                style: user.style || '',
                bio: user.bio || '',
                location: user.location || ''
            });
        }
    }, [user]);

    // Carregar preferências do localStorage
    useEffect(() => {
        const savedPreferences = localStorage.getItem('stylePreferences');
        if (savedPreferences) {
            try {
                setStylePreferences(JSON.parse(savedPreferences));
            } catch (error) {
                console.error('Erro ao carregar preferências:', error);
            }
        }
    }, []);

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando perfil...</p>
                </div>
            </div>
        );
    }
    
    const handleEditProfile = async () => {
        const success = await updateProfile(editForm);
        if (success) {
            setEditDialogOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast({
            title: "Logout realizado",
            description: "Você foi desconectado com sucesso.",
        });
    };

    const handleLikeOutfit = async (outfitId: string) => {
        await toggleLike(outfitId, 'OUTFIT');
    };

    const handleFavoriteOutfit = async (outfitId: string) => {
        await toggleFavorite(outfitId, 'OUTFIT');
    };

    const handleDeleteOutfit = async (outfitId: string) => {
        if (window.confirm('Tem certeza que deseja deletar este outfit?')) {
            await deleteOutfit(outfitId);
        }
    };

    // Funções para gerenciar preferências
    const saveStylePreferences = () => {
        localStorage.setItem('stylePreferences', JSON.stringify(stylePreferences));
        setPreferencesDialogOpen(false);
        toast({
            title: "Preferências salvas!",
            description: "Suas preferências de estilo foram salvas com sucesso.",
        });
    };

    const toggleArrayPreference = (category: keyof typeof stylePreferences, value: string) => {
        setStylePreferences(prev => {
            const currentArray = prev[category] as string[];
            const newArray = currentArray.includes(value)
                ? currentArray.filter(item => item !== value)
                : [...currentArray, value];
            
            return {
                ...prev,
                [category]: newArray
            };
        });
    };

    const updateSinglePreference = (category: keyof typeof stylePreferences, value: string) => {
        setStylePreferences(prev => ({
            ...prev,
            [category]: value
        }));
    };

    const OutfitCard = ({ outfit, isGridView = true, showActions = true }: { 
        outfit: any; 
        isGridView?: boolean; 
        showActions?: boolean;
    }) => (
        <Card className={`group cursor-pointer transition-all hover:shadow-lg ${isGridView ? '' : 'flex flex-row'}`}>
            <div className={`relative overflow-hidden ${isGridView ? 'aspect-[3/4]' : 'w-32 h-32 flex-shrink-0'} bg-gradient-to-br from-purple-100 to-pink-100 rounded-t-lg ${isGridView ? '' : 'rounded-l-lg rounded-t-none'}`}>
                {outfit.imageUrl ? (
                    <Image
                        src={outfit.imageUrl}
                        alt={outfit.title}
                        fill
                        className="object-cover"
                        sizes={isGridView ? "300px" : "128px"}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                )}
                
                {outfit.isAIGenerated && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500">
                        <Sparkles className="h-3 w-3 mr-1" />
                        IA
                    </Badge>
                )}
                
                {showActions && (
                    <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            size="sm"
                            variant={outfit.isLiked ? "default" : "secondary"}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLikeOutfit(outfit.id);
                            }}
                            className="h-8 w-8 p-0"
                        >
                            <Heart className={`h-4 w-4 ${outfit.isLiked ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                            size="sm"
                            variant={outfit.isFavorited ? "default" : "secondary"}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFavoriteOutfit(outfit.id);
                            }}
                            className="h-8 w-8 p-0"
                        >
                            <Star className={`h-4 w-4 ${outfit.isFavorited ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOutfit(outfit.id);
                            }}
                            className="h-8 w-8 p-0"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
            <CardContent className={`p-4 ${isGridView ? '' : 'flex-1'}`}>
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{outfit.title}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>{format(outfit.createdAt, 'dd/MM/yyyy', { locale: ptBR })}</span>
                    <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {outfit.likes}
                    </div>
                </div>
                <div className="flex flex-wrap gap-1">
                    {outfit.tags?.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Notificação de Backend */}
            {backendError && (
                <BackendNotice feature="Perfil Dinâmico (upload de avatar, bio, curtidas, favoritos, estatísticas)" />
            )}

            {/* Header do Perfil */}
            <div className="relative">
                {/* Cover/Banner */}
                <div className="h-48 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-end justify-between">
                            <div className="flex items-end gap-4">
                                <AvatarUpload
                                    currentAvatarUrl={user.avatarUrl}
                                    userName={user.name}
                                    size="lg"
                                />
                                <div className="text-white mb-2">
                                    <h1 className="text-2xl font-bold">{user.name}</h1>
                                    <p className="text-white/80">@{user.email.split('@')[0]}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mb-2">
                                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="secondary" size="sm">
                                            <Edit className="h-4 w-4 mr-1" />
                                            Editar
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Editar Perfil</DialogTitle>
                                            <DialogDescription>
                                                Atualize suas informações pessoais
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="name">Nome</Label>
                                                <Input
                                                    id="name"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="style">Estilo</Label>
                                                <Select value={editForm.style} onValueChange={(value) => setEditForm({...editForm, style: value})}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione seu estilo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="casual">Casual</SelectItem>
                                                        <SelectItem value="formal">Formal</SelectItem>
                                                        <SelectItem value="street">Street Style</SelectItem>
                                                        <SelectItem value="boho">Boho</SelectItem>
                                                        <SelectItem value="minimalist">Minimalista</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="bio">Bio</Label>
                                                <Textarea
                                                    id="bio"
                                                    placeholder="Conte um pouco sobre você..."
                                                    value={editForm.bio}
                                                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="location">Localização</Label>
                                                <Input
                                                    id="location"
                                                    placeholder="Cidade, Estado"
                                                    value={editForm.location}
                                                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                                                />
                                            </div>
                                            <div className="flex gap-2 pt-4">
                                                <Button 
                                                    onClick={handleEditProfile} 
                                                    className="flex-1"
                                                    disabled={isUpdating}
                                                >
                                                    {isUpdating ? 'Salvando...' : 'Salvar'}
                                                </Button>
                                                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <Dialog open={preferencesDialogOpen} onOpenChange={setPreferencesDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="secondary" size="sm">
                                            <Palette className="h-4 w-4 mr-1" />
                                            Preferências
                                        </Button>
                                    </DialogTrigger>
                                </Dialog>

                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    <Settings className="h-4 w-4 mr-1" />
                                    Sair
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards - Agora Dinâmicos */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <Card className="p-4 text-center">
                    <Shirt className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                    <p className="text-2xl font-bold">{stats.totalOutfits}</p>
                    <p className="text-xs text-muted-foreground">Looks</p>
                </Card>
                <Card className="p-4 text-center">
                    <Heart className="h-6 w-6 mx-auto text-red-500 mb-2" />
                    <p className="text-2xl font-bold">{stats.totalLikes}</p>
                    <p className="text-xs text-muted-foreground">Curtidas</p>
                </Card>
                <Card className="p-4 text-center">
                    <Sparkles className="h-6 w-6 mx-auto text-purple-500 mb-2" />
                    <p className="text-2xl font-bold">{stats.aiGeneratedOutfits}</p>
                    <p className="text-xs text-muted-foreground">IA Looks</p>
                </Card>
                <Card className="p-4 text-center">
                    <Trophy className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
                    <p className="text-2xl font-bold">{stats.favoritedOutfits}</p>
                    <p className="text-xs text-muted-foreground">Favoritos</p>
                </Card>
                <Card className="p-4 text-center">
                    <TrendingUp className="h-6 w-6 mx-auto text-green-500 mb-2" />
                    <p className="text-2xl font-bold">{stats.followersCount}</p>
                    <p className="text-xs text-muted-foreground">Seguidores</p>
                </Card>
                <Card className="p-4 text-center">
                    <Target className="h-6 w-6 mx-auto text-orange-500 mb-2" />
                    <p className="text-2xl font-bold">{stats.followingCount}</p>
                    <p className="text-xs text-muted-foreground">Seguindo</p>
                </Card>
            </div>

            {/* Informações do Usuário - Agora Dinâmicas */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Informações Pessoais</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <AtSign className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="capitalize">
                                        {user.gender === 'FEMALE' ? 'Feminino' : 
                                         user.gender === 'MALE' ? 'Masculino' : 'Outro'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    <span>Estilo: {user.style}</span>
                                    <Badge variant="outline" className="ml-2 capitalize">
                                        {user.type === 'STORE' ? 'Loja' : 'Usuário'}
                                    </Badge>
                                </div>
                                {user.location && (
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{user.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Membro desde {format(new Date(user.createdAt || Date.now()), 'MMMM yyyy', { locale: ptBR })}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Sobre</h3>
                            <p className="text-sm text-muted-foreground">
                                {user.bio || 'Apaixonado por moda e estilo. Sempre em busca do look perfeito para cada ocasião. ✨'}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">#Fashion</Badge>
                                <Badge variant="secondary">#Style</Badge>
                                <Badge variant="secondary">#Outfit</Badge>
                                <Badge variant="secondary">#Inspiration</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs de Conteúdo */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between">
                    <TabsList className="grid w-full max-w-md grid-cols-3">
                        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                        <TabsTrigger value="outfits">Meus Looks</TabsTrigger>
                        <TabsTrigger value="favorites">Favoritos</TabsTrigger>
                    </TabsList>
                    
                    {activeTab === 'outfits' && (
                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-purple-500" />
                                    Últimos Looks Gerados por IA
                                </CardTitle>
                                <CardDescription>
                                    Seus looks mais recentes criados pela nossa IA
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {outfits.filter((outfit: UserOutfit) => outfit.isAIGenerated).length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {outfits.filter((outfit: UserOutfit) => outfit.isAIGenerated).slice(0, 2).map((outfit: UserOutfit) => (
                                            <OutfitCard key={outfit.id} outfit={outfit} showActions={false} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <h3 className="font-semibold mb-2">Nenhum look gerado ainda</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Use o Builder de Outfits para criar looks personalizados com IA!
                                        </p>
                                        <Button variant="outline" size="sm" onClick={() => router.push('/builder')}>
                                            Criar Look com IA
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-red-500" />
                                    Looks Mais Curtidos
                                </CardTitle>
                                <CardDescription>
                                    Os looks que mais fazem sucesso
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {outfits.length > 0 ? (
                                    <div className="space-y-3">
                                        {outfits
                                            .sort((a: UserOutfit, b: UserOutfit) => b.likes - a.likes)
                                            .slice(0, 3)
                                            .map((outfit: UserOutfit) => (
                                                <div key={outfit.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded flex items-center justify-center relative overflow-hidden">
                                                        {outfit.imageUrl ? (
                                                            <Image
                                                                src={outfit.imageUrl}
                                                                alt={outfit.title}
                                                                fill
                                                                className="object-cover"
                                                                sizes="48px"
                                                            />
                                                        ) : (
                                                            <Camera className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{outfit.title}</p>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Heart className="h-3 w-3" />
                                                            {outfit.likes}
                                                            {outfit.isAIGenerated && (
                                                                <Badge variant="secondary" className="text-xs">IA</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <h3 className="font-semibold mb-2">Nenhum look criado ainda</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Crie seus primeiros looks e veja quais fazem mais sucesso!
                                        </p>
                                        <Button variant="outline" size="sm" onClick={() => router.push('/wardrobe')}>
                                            Explorar Wardrobe
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="outfits" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {outfits.length} looks encontrados
                        </p>
                        {isLoading && (
                            <div className="text-sm text-muted-foreground">Carregando...</div>
                        )}
                    </div>
                    
                    {outfits.length > 0 ? (
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {outfits.map((outfit: UserOutfit) => (
                                    <OutfitCard key={outfit.id} outfit={outfit} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {outfits.map((outfit: UserOutfit) => (
                                    <OutfitCard key={outfit.id} outfit={outfit} isGridView={false} />
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="text-center py-16">
                            <Shirt className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                            <h3 className="text-xl font-semibold mb-3">Nenhum look criado ainda</h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Comece criando seu primeiro look! Use o Builder de Outfits para combinar suas peças ou deixe a IA sugerir combinações perfeitas.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button onClick={() => router.push('/builder')}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Criar Look Manual
                                </Button>
                                <Button variant="outline" onClick={() => router.push('/builder')}>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Criar com IA
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="favorites" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {favorites.length} favoritos encontrados
                        </p>
                        {isLoading && (
                            <div className="text-sm text-muted-foreground">Carregando...</div>
                        )}
                    </div>

                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {favorites.map((outfit: UserOutfit) => (
                                <OutfitCard 
                                    key={outfit.id} 
                                    outfit={outfit} 
                                    showActions={false}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="font-semibold mb-2">Nenhum favorito ainda</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Explore o feed e favorite looks que você ama para vê-los aqui!
                                </p>
                                <Button variant="outline" onClick={() => router.push('/feed')}>
                                    Explorar Feed
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            {/* Diálogo de Preferências de Estilo */}
            <Dialog open={preferencesDialogOpen} onOpenChange={setPreferencesDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Descubra Seu Estilo Pessoal
                        </DialogTitle>
                        <DialogDescription>
                            Responda algumas perguntas para que possamos entender melhor seu gosto e oferecer sugestões mais personalizadas
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-8 py-4">
                        {/* Cores Favoritas */}
                        <div className="space-y-3">
                            <Label className="text-base font-medium">🎨 Quais são suas cores favoritas?</Label>
                            <p className="text-sm text-muted-foreground">Selecione até 5 cores que mais combinam com você</p>
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                                {[
                                    { name: 'Preto', color: '#000000' },
                                    { name: 'Branco', color: '#FFFFFF' },
                                    { name: 'Cinza', color: '#6B7280' },
                                    { name: 'Azul', color: '#3B82F6' },
                                    { name: 'Vermelho', color: '#EF4444' },
                                    { name: 'Verde', color: '#10B981' },
                                    { name: 'Rosa', color: '#EC4899' },
                                    { name: 'Amarelo', color: '#F59E0B' },
                                    { name: 'Roxo', color: '#8B5CF6' },
                                    { name: 'Laranja', color: '#F97316' },
                                    { name: 'Marrom', color: '#A3A3A3' },
                                    { name: 'Bege', color: '#D4A574' },
                                    { name: 'Azul Marinho', color: '#1E40AF' },
                                    { name: 'Verde Escuro', color: '#065F46' },
                                    { name: 'Burgundy', color: '#92400E' },
                                    { name: 'Coral', color: '#FB7185' }
                                ].map((colorOption) => (
                                    <button
                                        key={colorOption.name}
                                        onClick={() => toggleArrayPreference('favoriteColors', colorOption.name)}
                                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                                            stylePreferences.favoriteColors.includes(colorOption.name)
                                                ? 'border-primary bg-primary/10' 
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                    >
                                        <div 
                                            className="w-6 h-6 rounded-full border"
                                            style={{ backgroundColor: colorOption.color }}
                                        ></div>
                                        <span className="text-xs">{colorOption.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Estilos Preferidos */}
                        <div className="space-y-3">
                            <Label className="text-base font-medium">👗 Qual é o seu estilo preferido?</Label>
                            <p className="text-sm text-muted-foreground">Selecione os estilos que mais se identificam com você</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {[
                                    'Casual', 'Elegante', 'Boho', 'Minimalista', 
                                    'Street Style', 'Romântico', 'Clássico', 'Moderno',
                                    'Vintage', 'Grunge', 'Preppy', 'Gótico'
                                ].map((style) => (
                                    <Button
                                        key={style}
                                        variant={stylePreferences.preferredStyles.includes(style) ? "default" : "outline"}
                                        onClick={() => toggleArrayPreference('preferredStyles', style)}
                                        className="justify-start"
                                    >
                                        {style}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Tipo Corporal */}
                        <div className="space-y-3">
                            <Label className="text-base font-medium">🏃‍♀️ Como você descreveria seu tipo corporal?</Label>
                            <p className="text-sm text-muted-foreground">Isso nos ajuda a sugerir looks que valorizem sua silhueta</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                    'Ampulheta', 'Retângulo', 'Triângulo', 
                                    'Triângulo Invertido', 'Oval', 'Não sei'
                                ].map((type) => (
                                    <Button
                                        key={type}
                                        variant={stylePreferences.bodyType === type ? "default" : "outline"}
                                        onClick={() => updateSinglePreference('bodyType', type)}
                                        className="justify-start"
                                    >
                                        {type}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Ocasiões Favoritas */}
                        <div className="space-y-3">
                            <Label className="text-base font-medium">🎉 Para quais ocasiões você mais se arruma?</Label>
                            <p className="text-sm text-muted-foreground">Selecione as situações onde você mais investe no visual</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                    'Trabalho', 'Festas', 'Encontros', 'Passeios casuais',
                                    'Viagens', 'Academia', 'Eventos formais', 'Casa',
                                    'Shopping', 'Universidade', 'Baladas', 'Reuniões familiares'
                                ].map((occasion) => (
                                    <Button
                                        key={occasion}
                                        variant={stylePreferences.favoriteOccasions.includes(occasion) ? "default" : "outline"}
                                        onClick={() => toggleArrayPreference('favoriteOccasions', occasion)}
                                        className="justify-start"
                                    >
                                        {occasion}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Personalidade */}
                        <div className="space-y-3">
                            <Label className="text-base font-medium">✨ Como você se descreveria?</Label>
                            <p className="text-sm text-muted-foreground">Selecione os traços que mais combinam com sua personalidade</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                    'Extrovertida', 'Introvertida', 'Criativa', 'Prática',
                                    'Aventureira', 'Tradicional', 'Ousada', 'Discreta',
                                    'Espontânea', 'Organizada', 'Romântica', 'Independente'
                                ].map((trait) => (
                                    <Button
                                        key={trait}
                                        variant={stylePreferences.personalityTraits.includes(trait) ? "default" : "outline"}
                                        onClick={() => toggleArrayPreference('personalityTraits', trait)}
                                        className="justify-start"
                                    >
                                        {trait}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Inspirações de Moda */}
                        <div className="space-y-3">
                            <Label className="text-base font-medium">🌟 Onde você busca inspiração de moda?</Label>
                            <p className="text-sm text-muted-foreground">Suas fontes de inspiração favoritas</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                    'Instagram', 'Pinterest', 'Revistas', 'Celebridades',
                                    'Street Style', 'Netflix/Filmes', 'Lojas físicas', 'Blogs',
                                    'TikTok', 'Amigos', 'Desfiles', 'Vitrines'
                                ].map((inspiration) => (
                                    <Button
                                        key={inspiration}
                                        variant={stylePreferences.fashionInspiration.includes(inspiration) ? "default" : "outline"}
                                        onClick={() => toggleArrayPreference('fashionInspiration', inspiration)}
                                        className="justify-start"
                                    >
                                        {inspiration}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Hábitos de Compra */}
                        <div className="space-y-3">
                            <Label className="text-base font-medium">🛍️ Como você prefere fazer compras?</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    'Planejo com antecedência',
                                    'Compro por impulso',
                                    'Pesquiso muito antes de comprar',
                                    'Sigo tendências da moda',
                                    'Invisto em peças atemporais',
                                    'Prefiro experimentar na loja'
                                ].map((habit) => (
                                    <Button
                                        key={habit}
                                        variant={stylePreferences.shoppingHabits === habit ? "default" : "outline"}
                                        onClick={() => updateSinglePreference('shoppingHabits', habit)}
                                        className="justify-start"
                                    >
                                        {habit}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Orçamento */}
                        <div className="space-y-3">
                            <Label className="text-base font-medium">💰 Qual sua faixa de orçamento mensal para roupas?</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    'Até R$ 200',
                                    'R$ 200 - R$ 500', 
                                    'R$ 500 - R$ 1.000',
                                    'R$ 1.000 - R$ 2.000',
                                    'Acima de R$ 2.000',
                                    'Varia muito'
                                ].map((budget) => (
                                    <Button
                                        key={budget}
                                        variant={stylePreferences.budgetRange === budget ? "default" : "outline"}
                                        onClick={() => updateSinglePreference('budgetRange', budget)}
                                        className="justify-start"
                                    >
                                        {budget}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Estilo de Vida */}
                        <div className="space-y-3">
                            <Label className="text-base font-medium">🌍 Como é seu estilo de vida?</Label>
                            <p className="text-sm text-muted-foreground">Selecione os aspectos que definem seu dia a dia</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                    'Vida agitada', 'Vida tranquila', 'Muito ativa', 'Sedentária',
                                    'Trabalho presencial', 'Home office', 'Vida social intensa', 'Mais caseira',
                                    'Viajo muito', 'Fico na cidade', 'Mãe/Pai', 'Estudante'
                                ].map((lifestyle) => (
                                    <Button
                                        key={lifestyle}
                                        variant={stylePreferences.lifestyle.includes(lifestyle) ? "default" : "outline"}
                                        onClick={() => toggleArrayPreference('lifestyle', lifestyle)}
                                        className="justify-start"
                                    >
                                        {lifestyle}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Objetivos de Moda */}
                        <div className="space-y-3">
                            <Label className="text-base font-medium">🎯 Quais são seus objetivos com a moda?</Label>
                            <p className="text-sm text-muted-foreground">O que você espera alcançar com seu estilo</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    'Me sentir mais confiante',
                                    'Expressar minha personalidade',
                                    'Ser mais profissional',
                                    'Seguir tendências',
                                    'Criar um guarda-roupa versátil',
                                    'Economizar dinheiro',
                                    'Ser mais sustentável',
                                    'Impressionar outras pessoas'
                                ].map((goal) => (
                                    <Button
                                        key={goal}
                                        variant={stylePreferences.fashionGoals.includes(goal) ? "default" : "outline"}
                                        onClick={() => toggleArrayPreference('fashionGoals', goal)}
                                        className="justify-start"
                                    >
                                        {goal}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-6 border-t">
                        <Button onClick={saveStylePreferences} className="flex-1">
                            <Bookmark className="h-4 w-4 mr-2" />
                            Salvar Preferências
                        </Button>
                        <Button variant="outline" onClick={() => setPreferencesDialogOpen(false)}>
                            Cancelar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
