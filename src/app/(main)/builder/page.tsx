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
        title: "Error Generating Outfit",
        description: "Something went wrong. Please try again.",
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
                <CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6" /> AI Outfit Builder</CardTitle>
                <CardDescription>Tell the AI what you need, and it will create the perfect look from your wardrobe.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                     <div className="grid gap-2">
                        <Label htmlFor="climate">Climate</Label>
                        <Input id="climate" placeholder="e.g., Warm, Rainy, Cold" {...register("climate", { required: true })} />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="occasion">Occasion</Label>
                        <Input id="occasion" placeholder="e.g., Work meeting, Casual brunch" {...register("occasion", { required: true })} />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="userStyle">Your Style</Label>
                        <Input id="userStyle" placeholder="e.g., Minimalist, Boho, Streetwear" {...register("userStyle", { required: true })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="mannequinPreference">Mannequin</Label>
                        <Select
                            defaultValue="Woman"
                            onValueChange={(value: 'Woman' | 'Man' | 'Neutral') => setValue('mannequinPreference', value)}
                        >
                            <SelectTrigger id="mannequinPreference">
                                <SelectValue placeholder="Select mannequin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Woman">Woman</SelectItem>
                                <SelectItem value="Man">Man</SelectItem>
                                <SelectItem value="Neutral">Neutral</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
                        {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                        ) : (
                            <><Sparkles className="mr-2 h-4 w-4" /> Generate Outfit</>
                        )}
                    </Button>
                </CardContent>
            </form>
        </Card>

        <div className="lg:col-span-2">
            {isLoading && (
                 <Card className="flex flex-col items-center justify-center p-12 text-center h-[70vh]">
                     <Loader2 className="h-12 w-12 animate-spin text-accent mb-4" />
                     <h2 className="text-xl font-semibold">Building your look...</h2>
                     <p className="text-muted-foreground">Our AI stylist is curating the perfect outfit from your wardrobe. Please wait a moment.</p>
                </Card>
            )}
            {!isLoading && !outfit && (
                 <Card className="flex flex-col items-center justify-center p-12 text-center h-[70vh] border-dashed">
                     <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                     <h2 className="text-xl font-semibold">Your Outfit Awaits</h2>
                     <p className="text-muted-foreground">Fill out the form to generate your personalized outfit.</p>
                </Card>
            )}
            {outfit && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mannequin View</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Image 
                                    src={outfit.mannequinPhotoDataUri || 'https://placehold.co/400x600'}
                                    alt="Generated outfit on a mannequin"
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
                                <CardTitle>AI Stylist's Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground italic">&quot;{outfit.reasoning}&quot;</p>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <CardTitle>Outfit Items</CardTitle>
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
