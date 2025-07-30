import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bot, Calendar, Copy, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const outfitItems = [
    { name: 'Jaqueta Jeans Clássica', imageUrl: 'https://placehold.co/200x200', hint: 'denim jacket' },
    { name: 'Camiseta de Algodão', imageUrl: 'https://placehold.co/200x200', hint: 't-shirt' },
    { name: 'Joggers Pretos', imageUrl: 'https://placehold.co/200x200', hint: 'black joggers' },
    { name: 'Tênis Branco', imageUrl: 'https://placehold.co/200x200', hint: 'white sneakers' },
];

export default function OutfitOfTheDayPage() {
    return (
        <div className="flex flex-col gap-6">
             <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Look do Dia</h1>
                    <p className="text-muted-foreground">Sua inspiração de estilo para hoje, criada pela IA.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                 <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardContent className="p-0">
                            <Image
                                src="https://placehold.co/400x600"
                                alt="Look do dia em manequim"
                                width={400}
                                height={600}
                                className="rounded-lg object-cover w-full"
                                data-ai-hint="mannequin fashion"
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Urbano Explorador Chique</CardTitle>
                            <div className="flex items-center text-sm text-muted-foreground gap-2 pt-1">
                                <Calendar className="h-4 w-4" />
                                <span>Gerado em: {new Date().toLocaleDateString('pt-BR')}</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Uma mistura perfeita de conforto e estilo para suas aventuras na cidade. Este look combina uma jaqueta jeans clássica com uma camiseta de algodão macio e joggers pretos versáteis. Tênis brancos completam o conjunto para caminhadas durante todo o dia.
                            </p>
                            <div className="flex gap-2 mt-4">
                                <Button><Copy className="mr-2 h-4 w-4" /> Copiar Look</Button>
                                <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Compartilhar</Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Itens Neste Look</CardTitle>
                            <CardDescription>As peças do seu guarda-roupa usadas para criar este look.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {outfitItems.map((item, index) => (
                                <div key={index} className="text-center">
                                    <Card className="overflow-hidden">
                                        <Image 
                                            src={item.imageUrl}
                                            alt={item.name}
                                            width={200}
                                            height={200}
                                            className="object-cover w-full aspect-square"
                                            data-ai-hint={item.hint}
                                        />
                                    </Card>
                                    <p className="text-sm font-medium mt-2">{item.name}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-accent" /> Notas do Estilista de IA</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground italic">
                                &quot;Eu combinei o jeans casual com o conforto dos joggers para um visual moderno e funcional. A camiseta branca mantém a base limpa, permitindo que a jaqueta seja o ponto focal. É um look versátil que transita facilmente do dia para a noite.&quot;
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
