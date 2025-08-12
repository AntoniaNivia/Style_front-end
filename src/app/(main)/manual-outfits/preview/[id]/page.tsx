
"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { manualOutfitService } from '@/lib/services/manual-outfit-dynamic.service';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

// Página de preview do look salvo


export default function ManualOutfitPreviewPage({ params }: { params: { id: string } }) {
  const [outfit, setOutfit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // Next.js: acessar params.id diretamente (migrável futuramente)
  const outfitId = params.id;

  useEffect(() => {
    async function fetchOutfit() {
      setLoading(true);
      const result = await manualOutfitService.getOutfitById(outfitId);
      setOutfit(result);
      setLoading(false);
    }
    fetchOutfit();
  }, [outfitId]);

  if (loading) {
    return <div className="p-8 text-center text-lg">Carregando...</div>;
  }
  if (!outfit) {
    return <div className="p-8 text-center text-lg">Look não encontrado.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{outfit.name}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Calendar className="h-4 w-4" />
          {new Date(outfit.createdAt).toLocaleDateString('pt-BR')}
          {outfit.mannequinPreference && (
            <Badge variant="outline" className="ml-2 text-xs">{outfit.mannequinPreference}</Badge>
          )}
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
            {outfit.mannequinImageUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={outfit.mannequinImageUrl}
                  alt={`Manequim ${outfit.mannequinPreference}`}
                  fill
                  className="object-cover rounded-lg"
                />
                {outfit.previewId && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      ID: {outfit.previewId.substring(0, 8)}
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">Sem manequim</span>
              </div>
            )}
          </div>
        </div>
        <div className="md:col-span-2 space-y-6">
          <div>
            <span className="font-bold text-xs mb-2 block">Itens do Look</span>
            {outfit.items && outfit.items.length > 0 ? (
              <div className="flex flex-col gap-4">
                {outfit.items.map((item: any, idx: number) => (
                  <div key={item.id || idx} className="flex items-center gap-4">
                    <div className="w-16 h-16 relative">
                      <Image
                        src={item.photoUrl || '/placeholder-clothing.jpg'}
                        alt={item.type || 'Tipo indefinido'}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.type || 'Tipo indefinido'}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{item.color}</Badge>
                        {item.season && <Badge variant="outline">{item.season}</Badge>}
                        {item.brand && <Badge variant="outline" className="capitalize">{item.brand}</Badge>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span className="ml-2 text-gray-500">Nenhuma peça cadastrada</span>
            )}
          </div>
          {outfit.tags && outfit.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-4">
              {outfit.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
          {outfit.notes && (
            <div className="mt-4 text-sm text-gray-700">
              <span className="font-bold">Notas:</span> {outfit.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
