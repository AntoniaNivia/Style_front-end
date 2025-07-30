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
  { id: 1, type: 'Blouse', color: 'White', imageUrl: 'https://placehold.co/300x400', hint: 'white blouse' },
  { id: 2, type: 'Jeans', color: 'Blue', imageUrl: 'https://placehold.co/300x400', hint: 'blue jeans' },
  { id: 3, type: 'Dress', color: 'Red', imageUrl: 'https://placehold.co/300x400', hint: 'red dress' },
  { id: 4, type: 'Skirt', color: 'Black', imageUrl: 'https://placehold.co/300x400', hint: 'black skirt' },
  { id: 5, type: 'Jacket', color: 'Denim', imageUrl: 'https://placehold.co/300x400', hint: 'denim jacket' },
  { id: 6, type: 'Accessory', color: 'Gold', imageUrl: 'https://placehold.co/300x400', hint: 'gold necklace' },
  { id: 7, type: 'Shoes', color: 'White', imageUrl: 'https://placehold.co/300x400', hint: 'white sneakers' },
  { id: 8, type: 'T-Shirt', color: 'Gray', imageUrl: 'https://placehold.co/300x400', hint: 'gray t-shirt' },
];

function AddItemDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90">
                    <Plus className="mr-2 h-4 w-4" /> Add New Item
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Add to Wardrobe</DialogTitle>
                    <DialogDescription>
                        Upload a photo and details of your new clothing item.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="picture">Photo</Label>
                        <Input id="picture" type="file" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="type">Type</Label>
                        <Select>
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="blouse">Blouse</SelectItem>
                                <SelectItem value="pants">Pants</SelectItem>
                                <SelectItem value="skirt">Skirt</SelectItem>
                                <SelectItem value="dress">Dress</SelectItem>
                                <SelectItem value="accessory">Accessory</SelectItem>
                                <SelectItem value="shoes">Shoes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                             <Label htmlFor="color">Color</Label>
                             <Input id="color" placeholder="e.g., Blue" />
                        </div>
                         <div className="grid gap-2">
                             <Label htmlFor="season">Season</Label>
                            <Select>
                                <SelectTrigger id="season">
                                    <SelectValue placeholder="Select a season" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="spring">Spring</SelectItem>
                                    <SelectItem value="summer">Summer</SelectItem>
                                    <SelectItem value="autumn">Autumn</SelectItem>
                                    <SelectItem value="winter">Winter</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="occasion">Occasion</Label>
                        <Input id="occasion" placeholder="e.g., Casual, Work" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input id="tags" placeholder="e.g., vintage, floral, comfy" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" className="bg-accent hover:bg-accent/90">Save item</Button>
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
                <h1 className="text-3xl font-bold tracking-tight">My Wardrobe</h1>
                <p className="text-muted-foreground">Browse and manage your clothing items.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline"><SlidersHorizontal className="mr-2 h-4 w-4" /> Filters</Button>
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
