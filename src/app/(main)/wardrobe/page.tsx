'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useWardrobe, type ClothingItemWithoutId } from "@/hooks/use-wardrobe";
import { Plus, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import * as React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

type AddItemFormValues = Omit<ClothingItemWithoutId, 'photoDataUri'> & {
    photo: FileList;
};

function AddItemDialog({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
    const { addClothingItem } = useWardrobe();
    const { toast } = useToast();
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm<AddItemFormValues>();

    const fileToDataUri = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const onSubmit: SubmitHandler<AddItemFormValues> = async (data) => {
        try {
            const photoDataUri = await fileToDataUri(data.photo[0]);
            const newItem: ClothingItemWithoutId = {
                photoDataUri,
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
        <Dialog onOpenChange={onOpenChange}>
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
                            Faça o upload de uma foto e detalhes do seu novo item de vestuário.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="picture">Foto</Label>
                            <Input id="picture" type="file" {...register("photo", { required: "Foto é obrigatória" })} />
                            {errors.photo && <p className="text-sm text-destructive">{errors.photo.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Tipo</Label>
                            <Controller
                                name="type"
                                control={control}
                                rules={{ required: "Tipo é obrigatório" }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger id="type">
                                            <SelectValue placeholder="Selecione um tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="T-Shirt">Camiseta</SelectItem>
                                            <SelectItem value="Blouse">Blusa</SelectItem>
                                            <SelectItem value="Pants">Calça</SelectItem>
                                            <SelectItem value="Jeans">Jeans</SelectItem>
                                            <SelectItem value="Skirt">Saia</SelectItem>
                                            <SelectItem value="Dress">Vestido</SelectItem>
                                            <SelectItem value="Jacket">Jaqueta</SelectItem>
                                            <SelectItem value="Blazer">Blazer</SelectItem>
                                            <SelectItem value="Accessory">Acessório</SelectItem>
                                            <SelectItem value="Shoes">Sapatos</SelectItem>
                                            <SelectItem value="Sneakers">Tênis</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
