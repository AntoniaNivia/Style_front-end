import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { ArrowRight, Bot, Flame, Plus, Shirt, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
    const { user } = useUser();

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Bem-vindo(a) de volta, {user?.name.split(' ')[0]}!</h1>
                <p className="text-muted-foreground">Aqui está seu resumo de estilo para hoje.</p>
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
                        <div className="text-2xl font-bold">124</div>
                        <p className="text-xs text-muted-foreground">
                            +5 da última semana
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
                        <div className="text-2xl font-bold">32</div>
                        <p className="text-xs text-muted-foreground">
                            +3 gerados por IA esta semana
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Itens Favoritos</CardTitle>
                        <Flame className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">15</div>
                        <p className="text-xs text-muted-foreground">
                            Do feed de inspiração
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Criações da IA</CardTitle>
                        <Bot className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">Total de looks gerados</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Look do Dia</CardTitle>
                        <CardDescription>Sua sugestão de look personalizada do nosso estilista de IA.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row gap-6 items-center">
                        <Image
                            src="https://placehold.co/400x600"
                            alt="Look do dia"
                            width={200}
                            height={300}
                            className="rounded-lg object-cover"
                            data-ai-hint="mannequin fashion"
                        />
                        <div className="flex-1 space-y-4">
                            <h3 className="text-xl font-semibold">Urbano Explorador Chique</h3>
                            <p className="text-muted-foreground">
                                Uma mistura perfeita de conforto e estilo para suas aventuras na cidade. Este look combina uma jaqueta jeans clássica com uma camiseta de algodão macio e joggers pretos versáteis. Tênis brancos completam o conjunto para caminhadas durante todo o dia.
                            </p>
                            <Button className="bg-accent hover:bg-accent/90">
                                Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
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
