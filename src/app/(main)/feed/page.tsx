'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Heart, Save } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const feedItems = [
  { id: 1, user: 'Lila Boutique', avatar: 'https://placehold.co/40x40', image: 'https://placehold.co/400x500', hint: 'woman fashion' },
  { id: 2, user: 'Estilista IA', avatar: 'https://placehold.co/40x40', image: 'https://placehold.co/400x600', hint: 'man streetstyle' },
  { id: 3, user: 'Urban Threads', avatar: 'https://placehold.co/40x40', image: 'https://placehold.co/400x550', hint: 'woman casual' },
  { id: 4, user: 'Estilista IA', avatar: 'https://placehold.co/40x40', image: 'https://placehold.co/400x520', hint: 'elegant dress' },
  { id: 5, user: 'Vintage Finds', avatar: 'https://placehold.co/40x40', image: 'https://placehold.co/400x580', hint: 'vintage outfit' },
  { id: 6, user: 'Estilista IA', avatar: 'https://placehold.co/40x40', image: 'https://placehold.co/400x510', hint: 'summer outfit' },
  { id: 7, user: 'Sleek Wear', avatar: 'https://placehold.co/40x40', image: 'https://placehold.co/400x530', hint: 'business casual' },
  { id: 8, user: 'Estilista IA', avatar: 'https://placehold.co/40x40', image: 'https://placehold.co/400x560', hint: 'autumn fashion' },
];

export default function FeedPage() {
    const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
    const [savedItems, setSavedItems] = useState<Set<number>>(new Set());
    const { toast } = useToast();

    const toggleLike = (id: number) => {
        setLikedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
                toast({ title: "Look favoritado!" });
            }
            return newSet;
        });
    };

    const toggleSave = (id: number) => {
        setSavedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
                toast({ title: "Look salvo no seu perfil!" });
            }
            return newSet;
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Feed de Inspiração</h1>
                <p className="text-muted-foreground">Descubra looks da nossa comunidade e do estilista de IA.</p>
            </div>
            
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                {feedItems.map(item => {
                    const isLiked = likedItems.has(item.id);
                    const isSaved = savedItems.has(item.id);

                    return (
                        <div key={item.id} className="break-inside-avoid">
                            <Card className="overflow-hidden group relative">
                                <Link href={`/feed/${item.id}`}>
                                    <Image
                                        src={item.image}
                                        alt={`Look por ${item.user}`}
                                        width={400}
                                        height={500}
                                        className="w-full h-auto object-cover cursor-pointer"
                                        data-ai-hint={item.hint}
                                    />
                                </Link>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <CardFooter className="p-3 absolute bottom-0 left-0 right-0 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Image src={item.avatar} alt={item.user} width={28} height={28} className="rounded-full border-2 border-white" data-ai-hint="avatar person" />
                                            <p className="text-white text-sm font-medium">{item.user}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className={cn("text-white hover:text-white hover:bg-white/20 h-8 w-8", isLiked && "text-red-500 bg-white/20")}
                                                onClick={() => toggleLike(item.id)}
                                            >
                                                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                                            </Button>
                                             <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className={cn("text-white hover:text-white hover:bg-white/20 h-8 w-8", isSaved && "text-accent bg-white/20")}
                                                onClick={() => toggleSave(item.id)}
                                            >
                                                <Save className={cn("h-4 w-4", isSaved && "fill-current")} />
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </div>
                            </Card>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
