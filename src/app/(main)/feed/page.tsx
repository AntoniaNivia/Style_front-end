'use client';

import { useState } from 'react';
import { Heart, Bookmark, MessageCircle, Share } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { useFeed } from '@/hooks/use-feed';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function FeedPage() {
  const {
    posts,
    pagination,
    isLoading,
    backendError,
    toggleLike,
    toggleSave,
    loadMorePosts
  } = useFeed();

  const handleLike = async (postId: string, isLiked: boolean = false) => {
    try {
      const success = await toggleLike(postId);
      if (success) {
        toast({
          title: isLiked ? "Descurtido!" : "Curtido!",
          description: isLiked
            ? "Post removido das suas curtidas."
            : "Post adicionado às suas curtidas.",
        });
      }
    } catch (error) {
      console.error('Erro ao curtir/descurtir:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar a ação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (postId: string, isSaved: boolean = false) => {
    try {
      await toggleSave(postId);
    } catch (error) {
      console.error('Erro ao salvar/remover:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar a ação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (backendError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold mb-2">Ops! Algo deu errado</h2>
          <p className="text-muted-foreground mb-4 max-w-md">
            Não foi possível carregar o feed. Verifique sua conexão e tente novamente.
          </p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 max-w-full sm:max-w-2xl w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Feed</h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Descubra os últimos looks e tendências das melhores lojas
        </p>
      </div>

      <div className="space-y-6">
        {isLoading && posts.length === 0 ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Header skeleton */}
                <div className="p-4 flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                {/* Image skeleton */}
                <Skeleton className="w-full h-48 sm:h-80" />
                {/* Actions skeleton */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-6 w-6" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : posts.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-center">
            <div className="text-6xl mb-4">👗</div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Nenhum post ainda</h2>
            <p className="text-muted-foreground max-w-md">
              O feed ainda está vazio. Quando as lojas começarem a postar, você verá os looks mais incríveis aqui!
            </p>
          </div>
        ) : (
          // Posts list
          posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Post header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.store.avatarUrl} />
                      <AvatarFallback>
                        {post.store.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{post.store.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Post image */}
                <div className="relative">
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full h-48 sm:h-80 object-cover rounded-md"
                    loading="lazy"
                  />
                </div>

                {/* Post actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`p-0 h-auto ${
                          post.isLiked ? 'text-red-500' : 'text-muted-foreground'
                        }`}
                        onClick={() => handleLike(post.id, post.isLiked || false)}
                      >
                        <Heart
                          className={`h-6 w-6 ${
                            post.isLiked ? 'fill-current' : ''
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-muted-foreground"
                      >
                        <MessageCircle className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-muted-foreground"
                      >
                        <Share className="h-6 w-6" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-0 h-auto ${
                        post.isSaved ? 'text-blue-500' : 'text-muted-foreground'
                      }`}
                      onClick={() => handleSave(post.id, post.isSaved || false)}
                    >
                      <Bookmark
                        className={`h-6 w-6 ${
                          post.isSaved ? 'fill-current' : ''
                        }`}
                      />
                    </Button>
                  </div>

                  {/* Likes count */}
                  {post.likesCount > 0 && (
                    <p className="font-semibold text-sm mb-2">
                      {post.likesCount} {post.likesCount === 1 ? 'curtida' : 'curtidas'}
                    </p>
                  )}

                  {/* Caption */}
                  <div className="text-sm">
                    <span className="font-semibold">{post.store.name}</span>{' '}
                    <span>{post.caption}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {/* Load more button */}
        {pagination?.hasNext && posts.length > 0 && (
          <div className="flex justify-center pt-6">
            <Button
              onClick={loadMorePosts}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Carregando...' : 'Carregar mais posts'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
