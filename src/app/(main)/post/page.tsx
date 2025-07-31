'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { BarChart, Heart, Image as ImageIcon, Send } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function PostPage() {
    const { user } = useUser();
    const router = useRouter();
    const { toast } = useToast();

    // In a real app, this would be handled by middleware or server-side checks.
    useEffect(() => {
        if (user?.type !== 'store') {
            router.replace('/dashboard');
        }
    }, [user, router]);

    const handlePost = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Postagem Criada!",
            description: "Sua nova postagem já está visível no Feed de Inspiração.",
        })
        router.push('/feed');
    }

    if (user?.type !== 'store') {
        return <div className="flex h-full w-full items-center justify-center"><p>Redirecionando...</p></div>;
    }

    return (
        <form onSubmit={handlePost} className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Criar Nova Postagem</CardTitle>
                        <CardDescription>Compartilhe seus itens mais recentes com a comunidade StyleWise. As postagens aparecerão no Feed de Inspiração público.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="post-image">Imagem</Label>
                            <Input id="post-image" type="file" required/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="caption">Legenda</Label>
                            <Textarea id="caption" placeholder="Descreva seu look, mencione peças-chave e adicione #hashtags..." required/>
                        </div>
                        <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90">
                            <Send className="mr-2 h-4 w-4" /> Postar no Feed
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart className="h-5 w-5" /> Engajamento da Postagem</CardTitle>
                        <CardDescription>O desempenho de suas postagens nos últimos 30 dias.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                            <div className="flex items-center gap-3">
                                <Heart className="h-6 w-6 text-red-500" />
                                <div>
                                    <p className="font-semibold">Total de Curtidas</p>
                                    <p className="text-xs text-muted-foreground">Em todas as postagens</p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold">1,254</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                     <CardHeader>
                        <CardTitle>Postagens Recentes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Array.from({length: 2}).map((_, i) => (
                             <div key={i} className="flex gap-4 items-center">
                                <Image
                                    src={`https://placehold.co/100x120.png`}
                                    alt="Postagem recente"
                                    width={80}
                                    height={100}
                                    className="rounded-md object-cover bg-secondary"
                                    data-ai-hint="fashion outfit"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium leading-tight line-clamp-2">Coleção brisa de verão já disponível!</p>
                                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                                        <Heart className="h-3 w-3" />
                                        <span className="text-xs">152 curtidas</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
