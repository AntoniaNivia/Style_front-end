import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingSkeletonProps {
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="animate-pulse overflow-hidden shadow-md">
          <CardContent className="p-0">
            {/* Image Skeleton */}
            <div className="aspect-[3/4] bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" 
                   style={{
                     backgroundSize: '200% 100%',
                     animation: 'shimmer 1.5s ease-in-out infinite'
                   }} 
              />
            </div>
            
            {/* Content Skeleton */}
            <div className="p-5 space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-slate-200 rounded-full" />
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                </div>
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
              
              {/* Items Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-slate-200 rounded w-12" />
                  <div className="h-5 bg-slate-200 rounded w-16" />
                </div>
                <div className="flex gap-1.5">
                  <div className="h-6 bg-slate-200 rounded-full w-16" />
                  <div className="h-6 bg-slate-200 rounded-full w-20" />
                  <div className="h-6 bg-slate-200 rounded-full w-14" />
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex gap-1.5">
                <div className="h-6 bg-slate-200 rounded-full w-12" />
                <div className="h-6 bg-slate-200 rounded-full w-16" />
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-slate-200 rounded" />
                  <div className="h-3 bg-slate-200 rounded w-20" />
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <div className="flex-1 h-9 bg-slate-200 rounded" />
                <div className="h-9 w-12 bg-slate-200 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
