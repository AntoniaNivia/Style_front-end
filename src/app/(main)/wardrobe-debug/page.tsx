'use client';

import { useWardrobe } from '@/hooks/use-wardrobe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function WardrobeDebugPage() {
  const { wardrobe, fetchWardrobe, isLoading } = useWardrobe();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const handleDebug = () => {
    const info = {
      totalItems: wardrobe.length,
      itemTypes: [...new Set(wardrobe.map(item => item.type))],
      itemsByType: wardrobe.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      seasons: [...new Set(wardrobe.map(item => item.season))],
      occasions: [...new Set(wardrobe.map(item => item.occasion))],
      colors: [...new Set(wardrobe.map(item => item.color))],
      items: wardrobe.map(item => ({
        id: item.id,
        type: item.type,
        color: item.color,
        season: item.season,
        occasion: item.occasion,
        tags: item.tags
      }))
    };
    setDebugInfo(info);
    console.log('🔍 Wardrobe Debug Info:', info);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Debug do Guarda-roupa</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status do Guarda-roupa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Total de itens:</strong> {wardrobe.length}
              </div>
              <div>
                <strong>Loading:</strong> {isLoading ? 'Sim' : 'Não'}
              </div>
              <Button onClick={handleDebug} className="mr-2">
                Analisar Guarda-roupa
              </Button>
              <Button onClick={fetchWardrobe} variant="outline">
                Recarregar
              </Button>
            </div>
          </CardContent>
        </Card>

        {debugInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Análise Detalhada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <strong>Tipos de peças:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {Object.entries(debugInfo.itemsByType).map(([type, count]) => (
                      <li key={type}>{type}: {String(count)} item(s)</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <strong>Estações:</strong> {debugInfo.seasons.join(', ')}
                </div>
                
                <div>
                  <strong>Ocasiões:</strong> {debugInfo.occasions.join(', ')}
                </div>
                
                <div>
                  <strong>Cores:</strong> {debugInfo.colors.join(', ')}
                </div>

                <details className="mt-4">
                  <summary className="cursor-pointer font-medium">Ver todos os itens</summary>
                  <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto">
                    {JSON.stringify(debugInfo.items, null, 2)}
                  </pre>
                </details>
              </div>
            </CardContent>
          </Card>
        )}

        {wardrobe.length === 0 && !isLoading && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  Guarda-roupa Vazio
                </h3>
                <p className="text-orange-700 mb-4">
                  Para usar o Builder IA, você precisa adicionar itens ao seu guarda-roupa primeiro.
                </p>
                <Button asChild>
                  <a href="/wardrobe">Ir para Guarda-roupa</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
