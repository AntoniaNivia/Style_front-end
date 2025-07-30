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
import * as React from 'react';

export default function RegisterPage() {
    const router = useRouter();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock register logic
        router.push('/dashboard');
    }

  return (
    <form onSubmit={handleRegister}>
        <Card className="w-full">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                    Enter your details below to create your StyleWise account.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Account Type</Label>
                        <RadioGroup defaultValue="user" className="flex gap-4 pt-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="user" id="user" />
                                <Label htmlFor="user">Regular User</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="store" id="store" />
                                <Label htmlFor="store">Store</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Alex Doe" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select defaultValue="female">
                            <SelectTrigger id="gender">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="mannequin">Mannequin Preference</Label>
                        <Select defaultValue="Woman">
                            <SelectTrigger id="mannequin">
                                <SelectValue placeholder="Select mannequin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Woman">Woman</SelectItem>
                                <SelectItem value="Man">Man</SelectItem>
                                <SelectItem value="Neutral">Neutral</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90">Create Account</Button>
                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-accent underline underline-offset-4 hover:text-accent/90">
                        Login
                    </Link>
                </div>
            </CardFooter>
        </Card>
    </form>
  );
}
