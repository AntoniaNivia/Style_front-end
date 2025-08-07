
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useWardrobe } from "@/hooks/use-wardrobe";
import type { GenerateOutfitInput } from '@/lib/types'; // Using types from a central place
import { useState, useEffect } from 'react';

// Define the actual response structure from the backend
type BackendOutfitResponse = {
  selectedItems: Array<{
    id: string;
    type: string;
    reason: string;
  }>;
  reasoning: string;
  styleNotes: string;
  mannequinImagePrompt: string;
  confidence: number;
  outfitId: string;
  mannequinImage: string;
};
import { Bot, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm, type SubmitHandler } from 'react-hook-form';
import Cookies from 'js-cookie';

type FormValues = {
  weather: string;
  occasion: string;
  style: string;
  mannequinPreference: 'Woman' | 'Man' | 'Neutral';
};

// Use the same API base URL as other parts of the app
const API_BASE_URL = '/api';

export default function BuilderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [outfit, setOutfit] = useState<BackendOutfitResponse | null>(null);
  const { toast } = useToast();
  const { wardrobe, fetchWardrobe } = useWardrobe();

  // Debug info
  console.log('🔍 Builder - Wardrobe status:', {
    wardrobeLength: wardrobe.length,
    wardrobeItems: wardrobe.map(item => ({ id: item.id, type: item.type, color: item.color }))
  });

  // Load wardrobe data when component mounts for outfit generation (WITH AUTHENTICATION CHECK)
  useEffect(() => {
    // Don't fetch without proper authentication
    const token = document.cookie.split(';').find(c => c.trim().startsWith('auth_token='));
    if (token) {
      console.log('🔍 Builder - Auth token found, fetching wardrobe...');
      fetchWardrobe();
    } else {
      console.warn('Builder page: No auth token found, skipping fetchWardrobe');
    }
  }, []);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
        mannequinPreference: 'Woman',
        weather: 'Ensolarado',
        occasion: 'Almoço casual',
        style: 'Moderno e elegante',
    }
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setOutfit(null);

    console.log('🔍 Builder - Submit data:', data);
    console.log('🔍 Builder - Wardrobe items:', wardrobe.length, wardrobe);

    if (wardrobe.length === 0) {
        toast({
            title: "Guarda-roupa Vazio",
            description: "Adicione itens ao seu guarda-roupa primeiro!",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

    const input: GenerateOutfitInput = {
        ...data,
    };

    console.log('🔍 Builder - Input para API:', input);

    try {
      const token = Cookies.get('auth_token');
      
      if (!token) {
        toast({
          title: "Erro de Autenticação",
          description: "Você precisa estar logado para gerar looks!",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log('🔍 Fazendo requisição para:', `${API_BASE_URL}/builder/generate`);
      
      const response = await fetch(`${API_BASE_URL}/builder/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(input),
      });

      console.log('📡 Resposta recebida:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        // Check if response is JSON or HTML
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erro HTTP ${response.status}`);
        } else {
          // If it's HTML (404 page, etc), throw a generic error
          throw new Error(`Erro ${response.status}: ${response.statusText || 'Endpoint não encontrado'}`);
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Resposta do servidor não é JSON válido');
      }

      const result = await response.json();
      console.log('✅ Resultado JSON:', result);
      
      setOutfit(result.data); // O backend retorna os dados em result.data

    } catch (error: any) {
      console.error('❌ Erro ao gerar look:', error);
      
      let errorTitle = "Erro ao Gerar Look";
      let errorDescription = "Algo deu errado. Por favor, tente novamente.";
      
      // Tratamento específico para diferentes tipos de erro
      if (error.message.includes('Nenhum item válido')) {
        errorTitle = "Itens Insuficientes";
        errorDescription = `Não foi possível criar um look com os itens disponíveis (${wardrobe.length} itens). Tente adicionar mais peças variadas ao seu guarda-roupa ou usar critérios diferentes.`;
      } else if (error.message.includes('Backend não disponível') || error.message.includes('Resposta do servidor não é JSON')) {
        errorTitle = "Backend Indisponível";
        errorDescription = "O servidor de IA não está disponível no momento. Tente novamente mais tarde.";
      } else if (error.message.includes('Network Error') || error.message.includes('fetch')) {
        errorTitle = "Erro de Conexão";
        errorDescription = "Verifique sua conexão com a internet e tente novamente.";
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorTitle = "Erro de Autenticação";
        errorDescription = "Sua sessão expirou. Faça login novamente.";
      } else {
        errorDescription = error.message || errorDescription;
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 sticky top-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6" /> Construtor de Looks com IA</CardTitle>
                <CardDescription>Diga à IA o que você precisa e ela criará o look perfeito do seu guarda-roupa.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                     <div className="grid gap-2">
                        <Label htmlFor="weather">Clima</Label>
                        <Input id="weather" placeholder="ex: Quente, Chuvoso, Frio" {...register("weather", { required: "Clima é obrigatório" })} />
                        {errors.weather && <p className="text-sm text-destructive">{errors.weather.message}</p>}
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="occasion">Ocasião</Label>
                        <Input id="occasion" placeholder="ex: Reunião de trabalho, Brunch casual" {...register("occasion", { required: "Ocasião é obrigatória" })} />
                         {errors.occasion && <p className="text-sm text-destructive">{errors.occasion.message}</p>}
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="style">Seu Estilo</Label>
                        <Input id="style" placeholder="ex: Minimalista, Boho, Streetwear" {...register("style", { required: "Seu estilo é obrigatório" })} />
                         {errors.style && <p className="text-sm text-destructive">{errors.style.message}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="mannequinPreference">Manequim</Label>
                        <Select
                            value={watch('mannequinPreference')}
                            onValueChange={(value: 'Woman' | 'Man' | 'Neutral') => setValue('mannequinPreference', value)}
                        >
                            <SelectTrigger id="mannequinPreference">
                                <SelectValue placeholder="Selecione o manequim" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Woman">Mulher</SelectItem>
                                <SelectItem value="Man">Homem</SelectItem>
                                <SelectItem value="Neutral">Neutro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
                        {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...</>
                        ) : (
                            <><Sparkles className="mr-2 h-4 w-4" /> Gerar Look</>
                        )}
                    </Button>
                    
                    {/* Debug info */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-4 p-3 bg-muted rounded-md text-xs space-y-1">
                            <p><strong>Debug:</strong> {wardrobe.length} itens no guarda-roupa</p>
                            {wardrobe.length === 0 ? (
                                <p className="text-orange-600">⚠️ Guarda-roupa vazio - adicione itens primeiro!</p>
                            ) : (
                                <div>
                                    <p className="text-green-600">✅ {wardrobe.length} itens disponíveis</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Tipos: {[...new Set(wardrobe.map(item => item.type))].join(', ')}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </form>
        </Card>

        <div className="lg:col-span-2">
            {isLoading && (
                 <Card className="flex flex-col items-center justify-center p-12 text-center h-[70vh]">
                     <Loader2 className="h-12 w-12 animate-spin text-accent mb-4" />
                     <h2 className="text-xl font-semibold">Montando seu look...</h2>
                     <p className="text-muted-foreground">Nosso estilista de IA está criando o look perfeito do seu guarda-roupa. Por favor, aguarde um momento.</p>
                </Card>
            )}
            {!isLoading && !outfit && wardrobe.length === 0 && (
                 <Card className="flex flex-col items-center justify-center p-12 text-center h-[70vh] border-dashed border-orange-200">
                     <div className="text-6xl mb-4">👗</div>
                     <h2 className="text-xl font-semibold text-orange-800">Guarda-roupa Vazio</h2>
                     <p className="text-muted-foreground mb-4 max-w-md">
                       Para gerar looks incríveis com IA, você precisa adicionar itens ao seu guarda-roupa primeiro.
                     </p>
                     <Button asChild className="bg-orange-600 hover:bg-orange-700">
                       <Link href="/wardrobe">Adicionar Itens ao Guarda-roupa</Link>
                     </Button>
                </Card>
            )}
            {!isLoading && !outfit && wardrobe.length > 0 && (
                 <Card className="flex flex-col items-center justify-center p-12 text-center h-[70vh] border-dashed">
                     <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                     <h2 className="text-xl font-semibold">Seu Look te Espera</h2>
                     <p className="text-muted-foreground mb-2">Preencha o formulário para gerar seu look personalizado.</p>
                     <p className="text-sm text-green-600">✅ {wardrobe.length} itens disponíveis no guarda-roupa</p>
                </Card>
            )}
            {outfit && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Visualização no Manequim</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Image 
                                    src={outfit.mannequinImage || '/placeholder-mannequin.jpg'}
                                    alt="Look gerado em um manequim"
                                    width={400}
                                    height={600}
                                    className="rounded-lg object-cover w-full"
                                    data-ai-hint="mannequin fashion"
                                />
                            </CardContent>
                        </Card>
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                             <CardHeader>
                                <CardTitle>Notas do Estilista de IA</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground italic">&quot;{outfit.reasoning}&quot;</p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                             <CardHeader>
                                <CardTitle>Dicas de Estilo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{outfit.styleNotes}</p>
                                <div className="mt-2 text-sm text-muted-foreground">
                                    Confiança: {Math.round(outfit.confidence * 100)}%
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <CardTitle>Itens do Look</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               {outfit.selectedItems.map((item, index) => {
                                 // Find the clothing item from wardrobe to get image
                                 const clothingItem = wardrobe.find(w => w.id === item.id);
                                 
                                 return (
                                    <div key={index} className="flex gap-4 items-center">
                                        <Image
                                            src={clothingItem?.photoUrl || '/placeholder-clothing.jpg'}
                                            alt={item.type}
                                            width={64}
                                            height={64}
                                            className="rounded-md object-cover bg-secondary"
                                            data-ai-hint="clothing item"
                                        />
                                        <div>
                                            <p className="font-semibold">{item.type}</p>
                                            <p className="text-sm text-muted-foreground">{item.reason}</p>
                                        </div>
                                    </div>
                                 );
                               })}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
