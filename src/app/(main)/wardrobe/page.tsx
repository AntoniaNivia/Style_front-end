'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import * as React from 'react';

const clothingItems = [
  { id: 1, type: 'Blusa', color: 'Branco', imageUrl: 'https://placehold.co/300x400', hint: 'white blouse' },
  { id: 2, type: 'Jeans', color: 'Azul', imageUrl: 'https://placehold.co/300x400', hint: 'blue jeans' },
  { id: 3, type: 'Vestido', color: 'Vermelho', imageUrl: 'https://placehold.co/300x400', hint: 'red dress' },
  { id: 4, type: 'Saia', color: 'Preto', imageUrl: 'https://placehold.co/300x400', hint: 'black skirt' },
  { id: 5, type: 'Jaqueta', color: 'Denim', imageUrl: 'https://placehold.co/300x400', hint: 'denim jacket' },
  { id: 6, type: 'Acessório', color: 'Dourado', imageUrl: 'https://placehold.co/300x400', hint: 'gold necklace' },
  { id: 7, type: 'Sapatos', color: 'Branco', imageUrl: 'https://placehold.co/300x400', hint: 'white sneakers' },
  { id: 8, type: 'Camiseta', color: 'Cinza', imageUrl: 'https://placehold.co/300x400', hint: 'gray t-shirt' },
];

function AddItemDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90">
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Novo Item
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Adicionar ao Guarda-Roupa</DialogTitle>
                    <DialogDescription>
                        Faça o upload de uma foto e detalhes do seu novo item de vestuário.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="picture">Foto</Label>
                        <Input id="picture" type="file" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="type">Tipo</Label>
                        <Select>
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Selecione um tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="blouse">Blusa</SelectItem>
                                <SelectItem value="pants">Calça</SelectItem>
                                <SelectItem value="skirt">Saia</SelectItem>
                                <SelectItem value="dress">Vestido</SelectItem>
                                <SelectItem value="accessory">Acessório</SelectItem>
                                <SelectItem value="shoes">Sapatos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                             <Label htmlFor="color">Cor</Label>
                             <Input id="color" placeholder="ex: Azul" />
                        </div>
                         <div className="grid gap-2">
                             <Label htmlFor="season">Estação</Label>
                            <Select>
                                <SelectTrigger id="season">
                                    <SelectValue placeholder="Selecione uma estação" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="spring">Primavera</SelectItem>
                                    <SelectItem value="summer">Verão</SelectItem>
                                    <SelectItem value="autumn">Outono</SelectItem>
                                    <SelectItem value="winter">Inverno</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="occasion">Ocasião</Label>
                        <Input id="occasion" placeholder="ex: Casual, Trabalho" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="tags">Etiquetas</Label>
                        <Input id="tags" placeholder="ex: vintage, floral, confortável" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" className="bg-accent hover:bg-accent/90">Salvar item</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function WardrobePage() {
  return (
    <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Meu Guarda-Roupa</h1>
                <p className="text-muted-foreground">Navegue e gerencie seus itens de vestuário.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline"><SlidersHorizontal className="mr-2 h-4 w-4" /> Filtros</Button>
                <AddItemDialog />
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {clothingItems.map((item) => (
                <Card key={item.id} className="overflow-hidden group">
                    <CardContent className="p-0">
                        <Image 
                            src={item.imageUrl}
                            alt={`${item.color} ${item.type}`}
                            width={300}
                            height={400}
                            className="object-cover w-full h-auto aspect-[3/4] transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={item.hint}
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
