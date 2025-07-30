'use client';

import { generateOutfit, type GenerateOutfitOutput, type GenerateOutfitInput } from "@/ai/flows/generate-outfit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { ClothingItem } from "@/lib/types";
import { Bot, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm, type SubmitHandler } from 'react-hook-form';


type FormValues = {
  climate: string;
  occasion: string;
  userStyle: string;
  mannequinPreference: 'Woman' | 'Man' | 'Neutral';
};

// Mock user's wardrobe data
const mockWardrobe: Omit<ClothingItem, 'id' | 'userId'>[] = [
    { photoDataUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', type: 'T-Shirt', color: 'White', season: 'Summer', occasion: 'Casual', tags: ['cotton', 'basic'] },
    { photoDataUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', type: 'Jeans', color: 'Blue', season: 'All', occasion: 'Casual', tags: ['denim', 'straight-leg'] },
    { photoDataUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', type: 'Sneakers', color: 'White', season: 'All', occasion: 'Casual', tags: ['leather', 'comfy'] },
    { photoDataUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', type: 'Dress', color: 'Floral', season: 'Spring', occasion: 'Party', tags: ['midi', 'romantic'] },
    { photoDataUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', type: 'Blazer', color: 'Black', season: 'All', occasion: 'Work', tags: ['professional', 'classic'] },
    { photoDataUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', type: 'Pants', color: 'Beige', season: 'Autumn', occasion: 'Work', tags: ['chinos', 'smart-casual'] },
];

export default function BuilderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [outfit, setOutfit] = useState<GenerateOutfitOutput | null>(null);
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
        mannequinPreference: 'Woman'
    }
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setOutfit(null);
    try {
        const input: GenerateOutfitInput = {
            wardrobe: mockWardrobe,
            ...data
        }
      const result = await generateOutfit(input);
      setOutfit(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao Gerar Look",
        description: "Algo deu errado. Por favor, tente novamente.",
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
                        <Label htmlFor="climate">Clima</Label>
                        <Input id="climate" placeholder="ex: Quente, Chuvoso, Frio" {...register("climate", { required: true })} />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="occasion">Ocasião</Label>
                        <Input id="occasion" placeholder="ex: Reunião de trabalho, Brunch casual" {...register("occasion", { required: true })} />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="userStyle">Seu Estilo</Label>
                        <Input id="userStyle" placeholder="ex: Minimalista, Boho, Streetwear" {...register("userStyle", { required: true })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="mannequinPreference">Manequim</Label>
                        <Select
                            defaultValue="Woman"
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
            {!isLoading && !outfit && (
                 <Card className="flex flex-col items-center justify-center p-12 text-center h-[70vh] border-dashed">
                     <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                     <h2 className="text-xl font-semibold">Seu Look te Espera</h2>
                     <p className="text-muted-foreground">Preencha o formulário para gerar seu look personalizado.</p>
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
                                    src={outfit.mannequinPhotoDataUri || 'https://placehold.co/400x600'}
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
                                <CardTitle>Itens do Look</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               {outfit.outfitSuggestion.map((item, index) => (
                                    <div key={index} className="flex gap-4 items-center">
                                        <Image
                                            src={item.photoDataUri}
                                            alt={item.type}
                                            width={64}
                                            height={64}
                                            className="rounded-md object-cover bg-secondary"
                                            data-ai-hint="clothing item"
                                        />
                                        <div>
                                            <p className="font-semibold">{item.type}</p>
                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                               ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
