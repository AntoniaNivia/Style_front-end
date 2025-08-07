
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import * as React from 'react';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const credentials = {
            email: formData.get('email') as string,
            password: formData.get('password') as string
        };

        try {
            await login(credentials);
            toast({
                title: "Login realizado com sucesso!",
                description: "Bem-vindo de volta ao Style"
            });
            router.push('/dashboard');
        } catch (error) {
            console.error('Erro no login:', error);
            setIsLoading(false);
        }
    }

  return (
    <form onSubmit={handleLogin}>
        <Card className="w-full">
        <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
            <CardDescription>
            Digite seu e-mail abaixo para fazer login em sua conta
            </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" required />
            </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                {isLoading ? 'Fazendo login...' : 'Login'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link href="/register" className="font-medium text-accent underline underline-offset-4 hover:text-accent/90">
                    Cadastre-se
                </Link>
            </div>
        </CardFooter>
        </Card>
    </form>
  );
}
