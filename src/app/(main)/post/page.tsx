'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { BarChart, Heart, Image as ImageIcon, Send, Store } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function PostPage() {
    const { user } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);

    // Verificação de permissão para usuários loja
    useEffect(() => {
        setIsMounted(true);
        if (isMounted && (!user || user.type !== 'STORE')) {
            toast({
                title: "Acesso Restrito",
                description: "Apenas lojas podem criar postagens no feed.",
                variant: "destructive",
            });
            router.replace('/dashboard');
        }
    }, [user, router, isMounted, toast]);

    const handlePost = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Verificação adicional de segurança
        if (user?.type !== 'STORE') {
            toast({
                title: "Erro de Permissão",
                description: "Você não tem permissão para criar postagens.",
                variant: "destructive",
            });
            router.push('/dashboard');
            return;
        }
        
        toast({
            title: "Postagem Criada!",
            description: "Sua nova postagem já está visível no Feed de Inspiração.",
        });
        router.push('/feed');
    }

    // Loading state enquanto verifica permissões
    if (!isMounted || !user) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <p>Carregando...</p>
            </div>
        );
    }

    // Bloqueio para usuários não autorizados
    if (user.type !== 'STORE') {
        return (
            <div className="flex h-full w-full items-center justify-center flex-col space-y-4">
                <Store className="h-12 w-12 text-muted-foreground" />
                <div className="text-center">
                    <h2 className="text-lg font-semibold">Acesso Restrito</h2>
                    <p className="text-muted-foreground">
                        Apenas usuários do tipo "Loja" podem criar postagens no feed.
                    </p>
                    <Button 
                        onClick={() => router.push('/dashboard')} 
                        className="mt-4"
                        variant="outline"
                    >
                        Voltar ao Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handlePost} className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Criar Nova Postagem</CardTitle>
                        <CardDescription>Compartilhe seus itens mais recentes com a comunidade Style. As postagens aparecerão no Feed de Inspiração público.</CardDescription>
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
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">Nenhuma postagem recente</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Suas próximas postagens aparecerão aqui
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
