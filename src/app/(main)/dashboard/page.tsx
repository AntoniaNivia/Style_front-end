
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { useWardrobe } from "@/hooks/use-wardrobe";
import { ArrowRight, Bot, Flame, Plus, Shirt, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardPage() {
    const { user } = useUser();
    const { wardrobe, fetchWardrobe } = useWardrobe();

    // Fetch wardrobe data when component mounts (WITH AUTHENTICATION CHECK)
    useEffect(() => {
        const token = document.cookie.split(';').find(c => c.trim().startsWith('auth_token='));
        if (token) {
            fetchWardrobe();
        }
    }, []);

    // Calculate dynamic stats
    const stats = {
        totalItems: wardrobe.length,
        totalOutfits: 0, // This would come from outfits data when implemented
        favoriteItems: 0, // This would come from favorites data when implemented
        aiCreations: 0 // This would come from AI-generated outfits when implemented
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    {stats.totalItems === 0 && stats.totalOutfits === 0 
                        ? `Bem-vindo(a) ao Style, ${user ? user.name.split(' ')[0] : ''}!`
                        : `Bem-vindo(a) de volta, ${user ? user.name.split(' ')[0] : ''}!`
                    }
                </h1>
                <p className="text-muted-foreground">
                    {stats.totalItems === 0 && stats.totalOutfits === 0
                        ? "Comece sua jornada de estilo criando seu primeiro guarda-roupa digital."
                        : "Aqui está seu resumo de estilo para hoje."
                    }
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Itens no Guarda-roupa
                        </CardTitle>
                        <Shirt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalItems}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.totalItems === 0 ? "Adicione seus primeiros itens" : "Itens em seu guarda-roupa"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Looks Salvos
                        </CardTitle>
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOutfits}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.totalOutfits === 0 ? "Crie seus primeiros looks" : "Looks salvos"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Itens Favoritos</CardTitle>
                        <Flame className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.favoriteItems}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.favoriteItems === 0 ? "Explore o feed para favoritar" : "Itens favoritados"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Criações da IA</CardTitle>
                        <Bot className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.aiCreations}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.aiCreations === 0 ? "Use o Builder de IA" : "Looks gerados por IA"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Look do Dia</CardTitle>
                        <CardDescription>Sua sugestão de look personalizada do nosso estilista de IA.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center text-center py-8">
                        <p className="text-muted-foreground mb-4">
                            Ainda não temos um look do dia para você
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Complete seu guarda-roupa para receber sugestões personalizadas
                        </p>
                        <Link href="/builder">
                            <Button className="bg-accent hover:bg-accent/90">
                                Gerar Look do Dia <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
                <div className="space-y-4">
                    <Card className="bg-secondary">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4">
                             <div className="p-3 bg-background rounded-full">
                                <Shirt className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold">Expanda Seu Guarda-Roupa</h3>
                            <p className="text-sm text-muted-foreground">Adicione novos itens para obter recomendações de IA ainda melhores.</p>
                             <Link href="/wardrobe">
                                <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Adicionar Item</Button>
                            </Link>
                        </CardContent>
                    </Card>
                     <Card className="bg-secondary">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4">
                            <div className="p-3 bg-background rounded-full">
                                <Sparkles className="h-8 w-8 text-accent" />
                            </div>
                            <h3 className="text-lg font-semibold">Crie um Novo Look</h3>
                            <p className="text-sm text-muted-foreground">Deixe nossa IA montar o look perfeito para qualquer ocasião.</p>
                            <Link href="/builder">
                                <Button className="bg-accent hover:bg-accent/90">Construtor IA <Bot className="ml-2 h-4 w-4" /></Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
