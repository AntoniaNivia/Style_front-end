'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import * as React from 'react';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const userData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            gender: (formData.get('gender') as string).toUpperCase() as 'FEMALE' | 'MALE' | 'OTHER',
            mannequinPreference: formData.get('mannequin') as 'Woman' | 'Man' | 'Neutral',
            accountType: formData.get('accountType') as string || 'user'
        };

        try {
            await register(userData);
            toast({
                title: "Conta criada com sucesso!",
                description: "Bem-vindo ao Style"
            });
            router.push('/dashboard');
        } catch (error) {
            console.error('Erro no registro:', error);
            setIsLoading(false);
        }
    }

  return (
    <form onSubmit={handleRegister}>
        <Card className="w-full">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl">Crie uma conta</CardTitle>
                <CardDescription>
                    Insira seus dados abaixo para criar sua conta Style.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Tipo de Conta</Label>
                        <RadioGroup defaultValue="user" name="accountType" className="flex gap-4 pt-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="user" id="user" />
                                <Label htmlFor="user">Usuário Regular</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="store" id="store" />
                                <Label htmlFor="store">Loja</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" name="name" placeholder="Seu nome completo" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" name="password" type="password" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="gender">Gênero</Label>
                        <Select name="gender" defaultValue="female">
                            <SelectTrigger id="gender">
                                <SelectValue placeholder="Selecione o gênero" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="female">Feminino</SelectItem>
                                <SelectItem value="male">Masculino</SelectItem>
                                <SelectItem value="other">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="mannequin">Preferência de Manequim</Label>
                        <Select name="mannequin" defaultValue="Woman">
                            <SelectTrigger id="mannequin">
                                <SelectValue placeholder="Selecione o manequim" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Woman">Mulher</SelectItem>
                                <SelectItem value="Man">Homem</SelectItem>
                                <SelectItem value="Neutral">Neutro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                    {isLoading ? 'Criando conta...' : 'Criar Conta'}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="font-medium text-accent underline underline-offset-4 hover:text-accent/90">
                        Login
                    </Link>
                </div>
            </CardFooter>
        </Card>
    </form>
  );
}
