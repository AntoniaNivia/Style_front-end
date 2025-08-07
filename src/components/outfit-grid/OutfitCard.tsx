import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Trash2, 
  EyeOff, 
  Shirt, 
  StickyNote, 
  Calendar, 
  RefreshCw 
} from 'lucide-react';

interface OutfitCardProps {
  outfit: {
    id: string;
    name: string;
    selectedItems: string[];
    items?: Array<{
      id: string;
      type: string;
      color: string;
      brand?: string;
    }>;
    mannequinPreference?: 'Man' | 'Woman' | 'Neutral';
    mannequinImageUrl?: string;
    notes?: string;
    tags?: string[];
    isPrivate?: boolean;
    createdAt: string;
  };
  onDuplicate: (outfit: any) => void;
  onDelete: (outfit: any) => void;
  duplicatingId: string | null;
  deletingId: string | null;
}

const OutfitCard: React.FC<OutfitCardProps> = ({ 
  outfit, 
  onDuplicate, 
  onDelete, 
  duplicatingId, 
  deletingId 
}) => {
  const getMannequinIcon = (preference?: string) => {
    switch (preference) {
      case 'Woman': return '👩';
      case 'Man': return '👨';
      default: return '🧑';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50">
      <CardContent className="p-0">
        {/* Image */}
        <div className="aspect-[3/4] bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 relative overflow-hidden">
          {outfit.mannequinImageUrl ? (
            <img
              src={outfit.mannequinImageUrl}
              alt={outfit.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
              <div className="text-8xl mb-4 opacity-80 group-hover:scale-110 transition-transform duration-300">
                {getMannequinIcon(outfit.mannequinPreference)}
              </div>
              <Shirt className="h-12 w-12 text-muted-foreground/60 mb-3" />
              <p className="text-sm text-muted-foreground font-medium">Preview do Look</p>
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Privacy Badge */}
          {outfit.isPrivate && (
            <Badge className="absolute top-3 right-3 bg-black/90 text-white backdrop-blur-sm shadow-lg">
              <EyeOff className="h-3 w-3 mr-1" />
              Privado
            </Badge>
          )}
          
          {/* Hover Action Buttons */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="h-9 w-9 p-0 rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white border-0"
                onClick={() => onDuplicate(outfit)}
                disabled={duplicatingId === outfit.id}
              >
                {duplicatingId === outfit.id ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                ) : (
                  <Copy className="h-4 w-4 text-blue-600" />
                )}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="h-9 w-9 p-0 rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white border-0"
                onClick={() => onDelete(outfit)}
                disabled={deletingId === outfit.id}
              >
                {deletingId === outfit.id ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-red-600" />
                ) : (
                  <Trash2 className="h-4 w-4 text-red-600" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Title and Icon */}
          <div>
            <h3 className="font-bold text-lg leading-tight line-clamp-2 flex items-start gap-3 text-gray-900">
              <span className="text-2xl flex-shrink-0">{getMannequinIcon(outfit.mannequinPreference)}</span>
              <span className="group-hover:text-primary transition-colors duration-200">
                {outfit.name}
              </span>
            </h3>
            {outfit.notes && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex items-start gap-2">
                <StickyNote className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-500" />
                <span className="italic">{outfit.notes}</span>
              </p>
            )}
          </div>

          {/* Items Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Itens</span>
              <Badge variant="secondary" className="text-xs font-medium">
                {outfit.items?.length || outfit.selectedItems?.length || 0} {((outfit.items?.length || outfit.selectedItems?.length || 0) === 1) ? 'item' : 'itens'}
              </Badge>
            </div>
            {outfit.items && outfit.items.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {outfit.items.slice(0, 4).map((item) => (
                  <Badge key={item.id} variant="outline" className="text-xs px-2 py-1 rounded-full border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
                    {item.type}
                  </Badge>
                ))}
                {outfit.items.length > 4 && (
                  <Badge variant="outline" className="text-xs px-2 py-1 rounded-full border-primary/30 bg-primary/5 text-primary">
                    +{outfit.items.length - 4} mais
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          {outfit.tags && outfit.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {outfit.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  #{tag}
                </Badge>
              ))}
              {outfit.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  +{outfit.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 text-green-600" />
              <span className="font-medium">{formatDate(outfit.createdAt)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDuplicate(outfit)}
              disabled={duplicatingId === outfit.id}
              className="flex-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
            >
              {duplicatingId === outfit.id ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              Duplicar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(outfit)}
              disabled={deletingId === outfit.id}
              className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
            >
              {deletingId === outfit.id ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutfitCard;
