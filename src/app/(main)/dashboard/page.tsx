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
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name.split(' ')[0]}!</h1>
                <p className="text-muted-foreground">Here's your style summary for today.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Items in Wardrobe
                        </CardTitle>
                        <Shirt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">124</div>
                        <p className="text-xs text-muted-foreground">
                            +5 from last week
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Saved Looks
                        </CardTitle>
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">32</div>
                        <p className="text-xs text-muted-foreground">
                            +3 AI-generated this week
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Favorite Items</CardTitle>
                        <Flame className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">15</div>
                        <p className="text-xs text-muted-foreground">
                            From the inspiration feed
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AI Creations</CardTitle>
                        <Bot className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">Total outfits generated</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Look of the Day</CardTitle>
                        <CardDescription>Your personalized outfit suggestion from our AI stylist.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row gap-6 items-center">
                        <Image
                            src="https://placehold.co/400x600"
                            alt="Look of the day"
                            width={200}
                            height={300}
                            className="rounded-lg object-cover"
                            data-ai-hint="mannequin fashion"
                        />
                        <div className="flex-1 space-y-4">
                            <h3 className="text-xl font-semibold">Urban Explorer Chic</h3>
                            <p className="text-muted-foreground">
                                A perfect blend of comfort and style for your city adventures. This look pairs a classic denim jacket with a soft cotton tee and versatile black joggers. White sneakers complete the ensemble for all-day walkability.
                            </p>
                            <Button className="bg-accent hover:bg-accent/90">
                                View Details <ArrowRight className="ml-2 h-4 w-4" />
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
                            <h3 className="text-lg font-semibold">Expand Your Wardrobe</h3>
                            <p className="text-sm text-muted-foreground">Add new items to get even better AI recommendations.</p>
                             <Link href="/wardrobe">
                                <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
                            </Link>
                        </CardContent>
                    </Card>
                     <Card className="bg-secondary">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4">
                            <div className="p-3 bg-background rounded-full">
                                <Sparkles className="h-8 w-8 text-accent" />
                            </div>
                            <h3 className="text-lg font-semibold">Create a New Look</h3>
                            <p className="text-sm text-muted-foreground">Let our AI build the perfect outfit for any occasion.</p>
                            <Link href="/builder">
                                <Button className="bg-accent hover:bg-accent/90">AI Builder <Bot className="ml-2 h-4 w-4" /></Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
