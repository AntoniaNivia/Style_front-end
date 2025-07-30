'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { Badge } from "@/components/ui/badge";
import { Edit, AtSign, Tag, Shirt, Sparkles, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
    const { user } = useUser();
    const { toast } = useToast();

    if (!user) return null;
    
    const handleEdit = () => {
        toast({
            title: "Função em breve!",
            description: "A edição de perfil estará disponível em futuras atualizações."
        })
    }

    return (
        <div className="flex flex-col gap-8">
             <div>
                <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
                <p className="text-muted-foreground">Veja e gerencie suas informações e preferências pessoais.</p>
            </div>
            
            <Card>
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-24 w-24 border-4 border-primary/20">
                            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="avatar person" />
                            <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm" onClick={handleEdit}><Edit className="mr-2 h-3 w-3" /> Editar Perfil</Button>
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex items-baseline gap-4">
                            <h2 className="text-2xl font-semibold">{user.name}</h2>
                            <Badge variant={user.type === 'store' ? 'secondary' : 'outline'} className="capitalize">{user.type === 'store' ? 'Loja' : 'Usuário'}</Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <AtSign className="h-4 w-4" />
                                <span>{user.email}</span>
                            </div>
                             <div className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4" />
                                <span className="capitalize">{user.gender === 'female' ? 'Feminino' : user.gender === 'male' ? 'Masculino' : 'Outro'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                <span>Estilo: {user.style}</span>
                            </div>
                        </div>
                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                            <div className="p-4 bg-secondary rounded-lg text-center">
                                <Shirt className="h-6 w-6 mx-auto text-primary" />
                                <p className="mt-2 text-2xl font-bold">124</p>
                                <p className="text-xs text-muted-foreground">Itens</p>
                            </div>
                             <div className="p-4 bg-secondary rounded-lg text-center">
                                <Sparkles className="h-6 w-6 mx-auto text-accent" />
                                <p className="mt-2 text-2xl font-bold">32</p>
                                <p className="text-xs text-muted-foreground">Looks Salvos</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Looks Favoritos</CardTitle>
                        <CardDescription>Os looks que você mais ama da comunidade.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                             <Image 
                                key={i}
                                src={`https://placehold.co/200x250.png`}
                                alt={`Look favorito ${i+1}`}
                                width={200}
                                height={250}
                                className="rounded-md object-cover"
                                data-ai-hint="fashion outfit"
                             />
                        ))}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Looks Gerados por IA</CardTitle>
                        <CardDescription>Os looks que nossa IA criou só para você.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {Array.from({ length: 3 }).map((_, i) => (
                             <Image 
                                key={i}
                                src={`https://placehold.co/200x250.png`}
                                alt={`Look gerado ${i+1}`}
                                width={200}
                                height={250}
                                className="rounded-md object-cover"
                                data-ai-hint="mannequin fashion"
                             />
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
