
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useWardrobe } from "@/hooks/use-wardrobe";
import type { AnalyzeClothingOutput, ClothingItem } from '@/lib/types';
import { Loader2, Plus, SlidersHorizontal, Sparkles, Trash2 } from "lucide-react";
import { AIAnalysisDebug } from "@/components/ai-analysis-debug";
import Image from "next/image";
import * as React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

type AddItemFormValues = Omit<ClothingItem, 'id' | 'userId' | 'photoUrl' | 'photoDataUri'> & {
    photo: FileList;
};

function AddItemDialog({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
    const { addClothingItem, analyzeClothing } = useWardrobe();
    const { toast } = useToast();
    const { register, handleSubmit, control, formState: { errors }, reset, setValue, clearErrors } = useForm<AddItemFormValues>();
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [previewImage, setPreviewImage] = React.useState<string | null>(null);
    const [lastAnalysis, setLastAnalysis] = React.useState<AnalyzeClothingOutput | null>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "Arquivo inválido",
                    description: "Por favor, selecione apenas arquivos de imagem.",
                    variant: "destructive",
                });
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Arquivo muito grande",
                    description: "Por favor, selecione uma imagem menor que 5MB.",
                    variant: "destructive",
                });
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                
                // Create image to get dimensions and potentially resize
                const img = document.createElement('img');
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    if (!ctx) {
                        setPreviewImage(result);
                        return;
                    }
                    
                    // Optimize image size (max 1024px on longest side)
                    const maxSize = 1024;
                    let { width, height } = img;
                    
                    if (width > maxSize || height > maxSize) {
                        if (width > height) {
                            height = (height * maxSize) / width;
                            width = maxSize;
                        } else {
                            width = (width * maxSize) / height;
                            height = maxSize;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Draw image with better quality
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert to base64 with good quality
                    const optimizedImage = canvas.toDataURL('image/jpeg', 0.9);
                    setPreviewImage(optimizedImage);
                    
                    console.log('🖼️ Image optimized:', {
                        originalSize: file.size,
                        originalDimensions: `${img.naturalWidth}x${img.naturalHeight}`,
                        optimizedDimensions: `${width}x${height}`,
                        optimizedSize: optimizedImage.length
                    });
                };
                img.src = result;
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const handleAnalyze = async () => {
        if (!previewImage) {
            toast({
                title: "Nenhuma Imagem Selecionada",
                description: "Por favor, escolha uma imagem para analisar.",
                variant: "destructive",
            });
            return;
        }
        
        console.log('🔍 handleAnalyze called with previewImage:', {
            hasPreviewImage: !!previewImage,
            imageLength: previewImage?.length,
            imageStart: previewImage?.substring(0, 100) + '...'
        });
        
        setIsAnalyzing(true);
        try {
            const name = (document.querySelector('[name="name"]') as HTMLInputElement)?.value || '';
            const description = (document.querySelector('[name="description"]') as HTMLTextAreaElement)?.value || '';
            
            // Create a more descriptive context for AI analysis
            const enhancedDescription = description || 
                `Analise esta peça de roupa com atenção aos detalhes. ${name ? `Nome: ${name}. ` : ''}
                Identifique corretamente o tipo de peça (calça, camiseta, vestido, etc.), 
                a cor predominante, a estação mais apropriada e a ocasião de uso.`;
            
            const analysis = await analyzeClothing({
                image: previewImage,
                name: name,
                description: enhancedDescription
            });

            console.log('✅ Analysis result:', analysis);

            if (analysis) {
                // Store analysis for debug component
                setLastAnalysis(analysis);
                // Check confidence level and quality
                const confidence = analysis.confidence || 0;
                const qualityScore = analysis.qualityScore || 0;
                const retryCount = analysis.retryCount || 0;
                
                console.log('🎯 Analysis metrics:', { 
                    confidence, 
                    qualityScore, 
                    retryCount,
                    reasoning: analysis.reasoning 
                });
                
                setValue('type', analysis.type);
                setValue('color', analysis.color);
                setValue('season', analysis.season);
                setValue('occasion', analysis.occasion);
                setValue('tags', analysis.tags || []);
                clearErrors();
                
                // Create detailed feedback message with backend improvements
                let feedbackMessage = `🎯 Identifiquei: ${analysis.type} ${analysis.color} para ${analysis.occasion}`;
                
                // Add quality and confidence indicators
                if (qualityScore > 0) {
                    if (qualityScore < 0.7) {
                        feedbackMessage += ` (⚠️ Qualidade: ${Math.round(qualityScore * 100)}%)`;
                    } else if (qualityScore > 0.9) {
                        feedbackMessage += ` (📸 Excelente qualidade)`;
                    }
                }
                
                if (retryCount > 1) {
                    feedbackMessage += ` (🔄 ${retryCount} tentativas)`;
                }
                
                if (confidence > 0.95) {
                    feedbackMessage += ` (🎯 Alta precisão)`;
                }
                
                // Determine toast variant based on quality and confidence
                const toastVariant = (confidence < 0.7 || (qualityScore > 0 && qualityScore < 0.6)) ? "destructive" : "default";
                
                toast({
                    title: "✨ Análise concluída com IA aprimorada!",
                    description: feedbackMessage,
                    variant: toastVariant
                });
                
                // Show reasoning in console for debugging
                if (analysis.reasoning) {
                    console.log('🧠 AI Reasoning:', analysis.reasoning);
                }
            }
        } catch (error) {
            console.error("Error analyzing item:", error);
            toast({
                title: "Erro na Análise",
                description: "Não foi possível analisar a imagem. Por favor, preencha os campos manualmente.",
                variant: "destructive",
            });
        } finally {
            setIsAnalyzing(false);
        }
    };


    const onSubmit: SubmitHandler<AddItemFormValues> = async (data) => {
        if (!previewImage) {
             toast({
                title: "Erro",
                description: "Nenhuma imagem fornecida.",
                variant: "destructive",
            });
            return;
        }

        const payload = {
            ...data,
            photoDataUri: previewImage,
            tags: Array.isArray(data.tags) ? data.tags : (data.tags as unknown as string).split(',').map(tag => tag.trim()),
        };

        try {
            // Use the wardrobe hook which handles API calls and state management
            const newItem = await addClothingItem(payload);
            
            if (newItem) {
                reset();
                setPreviewImage(null);
                onOpenChange(false);
            }
        } catch (error) {
            console.error("Error adding item:", error);
            toast({
                title: "Erro",
                description: "Não foi possível adicionar o item. Tente novamente.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog onOpenChange={(open) => {
            if (!open) {
                reset();
                setPreviewImage(null);
            }
            onOpenChange(open);
        }}>
            <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90">
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Novo Item
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Adicionar ao Guarda-Roupa</DialogTitle>
                        <DialogDescription>
                            Faça o upload de uma foto e deixe a IA analisar ou preencha os detalhes manualmente.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                             <Label htmlFor="picture">Foto</Label>
                            {previewImage && (
                                <div className="flex justify-center">
                                    <Image src={previewImage} alt="Preview" width={150} height={200} className="rounded-md object-cover" />
                                </div>
                            )}
                            <div className="flex gap-2 items-center">
                                <Input id="picture" type="file" {...register("photo", { required: "Foto é obrigatória" })} onChange={handleFileChange} className="flex-1" />
                                 <Button type="button" size="sm" onClick={handleAnalyze} disabled={isAnalyzing || !previewImage} className="bg-primary hover:bg-primary/90">
                                    {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                    <span className="ml-2">Analisar</span>
                                </Button>
                            </div>
                            {errors.photo && <p className="text-sm text-destructive">{errors.photo.message}</p>}
                        </div>
                       
                        <div className="grid gap-2">
                            <Label htmlFor="type">Tipo</Label>
                            <Input id="type" placeholder="ex: Camiseta" {...register("type", { required: "Tipo é obrigatório" })} />
                             {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="color">Cor</Label>
                                <Input id="color" placeholder="ex: Azul" {...register("color", { required: "Cor é obrigatória" })} />
                                 {errors.color && <p className="text-sm text-destructive">{errors.color.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="season">Estação</Label>
                                 <Controller
                                    name="season"
                                    control={control}
                                    rules={{ required: "Estação é obrigatória" }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger id="season">
                                                <SelectValue placeholder="Selecione uma estação" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Spring">Primavera</SelectItem>
                                                <SelectItem value="Summer">Verão</SelectItem>
                                                <SelectItem value="Autumn">Outono</SelectItem>
                                                <SelectItem value="Winter">Inverno</SelectItem>
                                                <SelectItem value="All">Todas</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.season && <p className="text-sm text-destructive">{errors.season.message}</p>}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="occasion">Ocasião</Label>
                            <Input id="occasion" placeholder="ex: Casual, Trabalho" {...register("occasion", { required: "Ocasião é obrigatória" })} />
                             {errors.occasion && <p className="text-sm text-destructive">{errors.occasion.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tags">Etiquetas (separadas por vírgula)</Label>
                            <Input id="tags" placeholder="ex: vintage, floral, confortável" {...register("tags")} />
                        </div>
                    </div>
                    
                    {/* Debug da Análise de IA */}
                    <AIAnalysisDebug 
                        analysis={lastAnalysis} 
                        show={process.env.NEXT_PUBLIC_DEBUG === 'true'} 
                    />
                    
                    <DialogFooter>
                        <Button type="submit" className="bg-accent hover:bg-accent/90">Salvar item</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function WardrobePage() {
    const { wardrobe, isLoading, fetchWardrobe, deleteClothingItem } = useWardrobe();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [deletingItemId, setDeletingItemId] = React.useState<string | null>(null);

    // Handle delete item with confirmation
    const handleDeleteItem = async (itemId: string, itemName: string) => {
        const confirmed = window.confirm(`Tem certeza que deseja excluir "${itemName}" do seu guarda-roupa?`);
        
        if (!confirmed) return;

        try {
            setDeletingItemId(itemId);
            await deleteClothingItem(itemId);
        } finally {
            setDeletingItemId(null);
        }
    };

    // Load wardrobe data when component mounts (WITH AUTHENTICATION CHECK)
    React.useEffect(() => {
        // Don't fetch without proper authentication
        const token = document.cookie.split(';').find(c => c.trim().startsWith('auth_token='));
        if (token) {
            fetchWardrobe();
        } else {
            console.warn('Wardrobe page: No auth token found, skipping fetchWardrobe');
        }
    }, []);


    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Meu Guarda-Roupa</h1>
                    <p className="text-muted-foreground">Navegue e gerencie seus itens de vestuário.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><SlidersHorizontal className="mr-2 h-4 w-4" /> Filtros</Button>
                    <AddItemDialog onOpenChange={setIsDialogOpen} />
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => <Card key={i} className="h-[400px] animate-pulse bg-muted" />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {wardrobe.map((item) => (
                        <Card key={item.id} className={`overflow-hidden group transition-opacity ${deletingItemId === item.id ? 'opacity-50' : ''}`}>
                            <CardContent className="p-0">
                                <Image
                                    src={item.photoUrl} // Use photoUrl from backend
                                    alt={`${item.color} ${item.type}`}
                                    width={300}
                                    height={400}
                                    className="object-cover w-full h-auto aspect-[3/4] transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={`${item.type} ${item.color}`}
                                />
                            </CardContent>
                            <CardFooter className="p-3 flex justify-between items-center bg-background/80 backdrop-blur-sm">
                                <div>
                                    <p className="font-semibold text-sm">{item.type}</p>
                                    <p className="text-xs text-muted-foreground">{item.color}</p>
                                </div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteItem(item.id, `${item.color} ${item.type}`)}
                                                disabled={deletingItemId === item.id}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                {deletingItemId === item.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Excluir item</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
