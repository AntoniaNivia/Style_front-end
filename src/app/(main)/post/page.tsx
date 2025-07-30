'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import { BarChart, Heart, Image as ImageIcon, Send } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";


export default function PostPage() {
    const { user } = useUser();

    // In a real app, this would be handled by middleware or server-side checks.
    if (user?.type !== 'store') {
        redirect('/dashboard');
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Create a New Post</CardTitle>
                        <CardDescription>Share your latest items with the StyleWise community. Posts will appear on the public Inspiration Feed.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="post-image">Image</Label>
                            <Input id="post-image" type="file" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="caption">Caption</Label>
                            <Textarea id="caption" placeholder="Describe your outfit, mention key pieces, and add #hashtags..." />
                        </div>
                        <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90">
                            <Send className="mr-2 h-4 w-4" /> Post to Feed
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart className="h-5 w-5" /> Post Engagement</CardTitle>
                        <CardDescription>Your posts' performance over the last 30 days.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                            <div className="flex items-center gap-3">
                                <Heart className="h-6 w-6 text-red-500" />
                                <div>
                                    <p className="font-semibold">Total Likes</p>
                                    <p className="text-xs text-muted-foreground">Across all posts</p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold">1,254</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                     <CardHeader>
                        <CardTitle>Recent Posts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Array.from({length: 2}).map((_, i) => (
                             <div key={i} className="flex gap-4 items-center">
                                <Image
                                    src={`https://placehold.co/100x120`}
                                    alt="Recent post"
                                    width={80}
                                    height={100}
                                    className="rounded-md object-cover bg-secondary"
                                    data-ai-hint="fashion outfit"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium leading-tight line-clamp-2">Summer breeze collection now available!</p>
                                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                                        <Heart className="h-3 w-3" />
                                        <span className="text-xs">152 likes</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
