import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bot, Calendar, Copy, Share2, Heart, Save } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data - in a real app, you would fetch this based on the `params.id`
const feedItems = [
  { id: 1, user: 'Lila Boutique', avatar: 'https://placehold.co/40x40', image: 'https://placehold.co/400x500', hint: 'woman fashion', title: "Vibrações de Outono", description: "Um look aconchegante e elegante, perfeito para um passeio no parque. A saia midi plissada em tom terroso combina perfeitamente com a blusa de gola alta, criando uma silhueta clássica. Completei com botas de cano alto para um toque moderno." },
  { id: 2, user: 'Estilista IA', avatar: 'https://placehold.co/40x40', image: 'https://placehold.co/400x600', hint: 'man streetstyle', title: "Explorador Urbano", description: "Este conjunto foi criado pela nossa IA para máxima versatilidade. A jaqueta bomber é a peça central, combinada com uma camiseta gráfica e jeans escuros. É o look ideal para quem busca conforto sem abrir mão do estilo nas ruas da cidade." },
];

const outfitItems = [
    { name: 'Saia Midi Plissada', imageUrl: 'https://placehold.co/200x200', hint: 'pleated skirt' },
    { name: 'Blusa Gola Alta', imageUrl: 'https://placehold.co/200x200', hint: 'turtleneck sweater' },
    { name: 'Botas Cano Alto', imageUrl: 'https://placehold.co/200x200', hint: 'knee high boots' },
    { name: 'Bolsa Transversal', imageUrl: 'https://placehold.co/200x200', hint: 'crossbody bag' },
];

export default function FeedItemDetailsPage({ params }: { params: { id: string } }) {
    const item = feedItems.find(i => i.id.toString() === params.id) || feedItems[0];
    
    return (
        <div className="flex flex-col gap-6">
             <div className="flex items-center gap-4">
                <Link href="/feed">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Detalhes do Look</h1>
                    <p className="text-muted-foreground">Inspirado por {item.user}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                 <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardContent className="p-0">
                            <Image
                                src={item.image}
                                alt={item.title}
                                width={400}
                                height={600}
                                className="rounded-lg object-cover w-full"
                                data-ai-hint={item.hint}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{item.title}</CardTitle>
                            <div className="flex items-center text-sm text-muted-foreground gap-2 pt-1">
                                <Calendar className="h-4 w-4" />
                                <span>Postado em: {new Date().toLocaleDateString('pt-BR')}</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                               {item.description}
                            </p>
                            <div className="flex gap-2 mt-4">
                                <Button className="bg-accent hover:bg-accent/90"><Heart className="mr-2 h-4 w-4" /> Favoritar</Button>
                                <Button><Save className="mr-2 h-4 w-4" /> Salvar Look</Button>
                                <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Compartilhar</Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Peças Neste Look</CardTitle>
                            <CardDescription>Os itens usados para criar este visual.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {outfitItems.map((piece, index) => (
                                <div key={index} className="text-center">
                                    <Card className="overflow-hidden">
                                        <Image 
                                            src={piece.imageUrl}
                                            alt={piece.name}
                                            width={200}
                                            height={200}
                                            className="object-cover w-full aspect-square"
                                            data-ai-hint={piece.hint}
                                        />
                                    </Card>
                                    <p className="text-sm font-medium mt-2">{piece.name}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
