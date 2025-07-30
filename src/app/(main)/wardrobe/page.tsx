'use client';
import { analyzeClothingItem, type AnalyzeClothingOutput } from "@/ai/flows/analyze-clothing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useWardrobe, type ClothingItemWithoutId } from "@/hooks/use-wardrobe";
import { Loader2, Plus, SlidersHorizontal, Sparkles } from "lucide-react";
import Image from "next/image";
import * as React from 'react';
import { useForm, Controller, SubmitHandler, useWatch } from 'react-hook-form';

type AddItemFormValues = Omit<ClothingItemWithoutId, 'photoDataUri'> & {
    photo: FileList;
};

function AddItemDialog({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
    const { addClothingItem } = useWardrobe();
    const { toast } = useToast();
    const { register, handleSubmit, control, formState: { errors }, reset, setValue, clearErrors } = useForm<AddItemFormValues>();
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [previewImage, setPreviewImage] = React.useState<string | null>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
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
        setIsAnalyzing(true);
        try {
            const result = await analyzeClothingItem({ photoDataUri: previewImage });
            setValue('type', result.type);
            setValue('color', result.color);
            setValue('season', result.season);
            setValue('occasion', result.occasion);
            setValue('tags', result.tags as any); // RHF expects a string here
            clearErrors(); // Clear errors after auto-filling
            toast({
                title: "Análise Concluída",
                description: "Os detalhes da sua peça de roupa foram preenchidos.",
            })
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
        try {
            if (!previewImage) {
                 toast({
                    title: "Erro",
                    description: "Nenhuma imagem fornecida.",
                    variant: "destructive",
                });
                return;
            }

            const newItem: ClothingItemWithoutId = {
                photoDataUri: previewImage,
                type: data.type,
                color: data.color,
                season: data.season,
                occasion: data.occasion,
                tags: data.tags.length > 0 ? (data.tags as unknown as string).split(',').map(tag => tag.trim()) : [],
            };
            addClothingItem(newItem);
            toast({
                title: "Item Adicionado!",
                description: "Sua nova peça foi adicionada ao guarda-roupa.",
            });
            reset();
            setPreviewImage(null);
            onOpenChange(false); // Close dialog on success
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
                    <DialogFooter>
                        <Button type="submit" className="bg-accent hover:bg-accent/90">Salvar item</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function WardrobePage() {
    const { wardrobe } = useWardrobe();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {wardrobe.map((item, index) => (
                    <Card key={index} className="overflow-hidden group">
                        <CardContent className="p-0">
                            <Image
                                src={item.photoDataUri}
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
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
