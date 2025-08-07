'use client';

import { useState, useEffect } from 'react';
import { feedService } from '@/lib/services/feed.service';
import { 
  FeedPost, 
  FeedFilters, 
  PaginationResult, 
  CreateFeedPostData
} from '@/lib/types';
import { useToast } from './use-toast';
import { useUser } from './use-user';

export const useFeed = () => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [pagination, setPagination] = useState<PaginationResult<FeedPost>['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backendError, setBackendError] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  // Fetch feed posts
  const fetchPosts = async (filters?: FeedFilters) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const result = await feedService.getFeed(filters);
      setPosts(result.posts || result.items || []);
      setPagination(result.pagination);
      setBackendError(false);
    } catch (error: any) {
      console.error('Erro ao carregar feed:', error);
      
      if (error.message.includes('Network Error') || 
          error.message.includes('ECONNREFUSED') || 
          error.message.includes('ENOTFOUND') ||
          error.code === 'ECONNREFUSED') {
        setBackendError(true);
        setPosts([]);
      } else {
        toast({
          title: "Erro ao carregar feed",
          description: error.message || "Erro desconhecido",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Create new post (stores only)
  const createPost = async (data: CreateFeedPostData): Promise<FeedPost | null> => {
    try {
      setIsLoading(true);
      const newPost = await feedService.createPost(data);
      
      // Add to current posts
      setPosts(prev => [newPost, ...prev]);
      
      toast({
        title: "Post criado com sucesso!",
        description: "Seu post foi publicado no feed.",
      });
      
      return newPost;
    } catch (error: any) {
      toast({
        title: "Erro ao criar post",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle like on a post
  const toggleLike = async (postId: string): Promise<boolean> => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return false;

      let result: { message: string; likesCount: number };
      if (post.isLiked) {
        result = await feedService.unlikePost(postId);
        // Update post in the list
        setPosts(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, isLiked: false, likesCount: result.likesCount }
            : p
        ));
      } else {
        result = await feedService.likePost(postId);
        // Update post in the list
        setPosts(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, isLiked: true, likesCount: result.likesCount }
            : p
        ));
      }
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao curtir post",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
      return false;
    }
  };

  // Toggle save on a post
  const toggleSave = async (postId: string): Promise<boolean> => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return false;

      let result: { message: string; isSaved: boolean };
      if (post.isSaved) {
        result = await feedService.unsavePost(postId);
        // Update post in the list
        setPosts(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, isSaved: false }
            : p
        ));
        
        toast({
          title: "Post removido dos salvos",
          description: "O post foi removido da sua lista de salvos.",
        });
      } else {
        result = await feedService.savePost(postId);
        // Update post in the list
        setPosts(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, isSaved: true }
            : p
        ));
        
        toast({
          title: "Post salvo!",
          description: "O post foi adicionado aos seus salvos. Confira no seu perfil.",
        });
      }
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao salvar post",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete post (stores only)
  const deletePost = async (postId: string): Promise<boolean> => {
    try {
      await feedService.deletePost(postId);
      
      // Remove from posts list
      setPosts(prev => prev.filter(post => post.id !== postId));
      
      toast({
        title: "Post removido",
        description: "O post foi removido do feed.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao remover post",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
      return false;
    }
  };

  // Load more posts (pagination)
  const loadMorePosts = async () => {
    if (!pagination?.hasNext || isLoading) return;
    
    try {
      setIsLoading(true);
      const result = await feedService.getFeed({ 
        page: pagination.page + 1,
        limit: pagination.limit 
      });
      
      // Append new posts
      setPosts(prev => [...prev, ...(result.posts || result.items || [])]);
      setPagination(result.pagination);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar mais posts",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  return {
    posts,
    pagination,
    isLoading,
    backendError,
    fetchPosts,
    createPost,
    toggleLike,
    toggleSave,
    deletePost,
    loadMorePosts,
  };
};
