import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Sparkles, Shirt } from 'lucide-react';

interface EmptyStateProps {
  searchTerm?: string;
  onCreateNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchTerm, onCreateNew }) => {
  if (searchTerm) {
    return (
      <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50">
        <CardContent className="p-12 text-center">
          <div className="relative mb-6">
            <Search className="h-16 w-16 text-gray-300 mx-auto" />
            <div className="absolute -top-2 -right-2 bg-amber-100 rounded-full p-2">
              <Sparkles className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Nenhum look encontrado
          </h3>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            Não encontramos looks com <span className="font-semibold text-primary">"{searchTerm}"</span>. 
            Tente outros termos ou crie um novo look!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={onCreateNew}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-lg"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              Criar Novo Look
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <CardContent className="p-16 text-center">
        <div className="relative mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Shirt className="h-20 w-20 text-blue-300" />
            <div className="text-8xl">✨</div>
            <div className="text-6xl">👗</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/20 to-transparent animate-pulse rounded-full" />
        </div>
        
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Seu guarda-roupa digital está vazio
        </h3>
        
        <p className="text-gray-600 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
          Que tal começar criando seu primeiro look personalizado? 
          Monte combinações incríveis e salve suas inspirações!
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={onCreateNew}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 px-8 py-3 text-lg font-semibold rounded-full"
          >
            <Sparkles className="h-6 w-6" />
            Criar Meu Primeiro Look
            <Plus className="h-5 w-5 ml-1" />
          </Button>
          
          <p className="text-sm text-gray-500">
            💡 Dica: Use roupas do seu guarda-roupa para criar looks únicos
          </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center items-center gap-8 opacity-30">
          <div className="text-2xl animate-bounce" style={{ animationDelay: '0ms' }}>👕</div>
          <div className="text-2xl animate-bounce" style={{ animationDelay: '200ms' }}>👖</div>
          <div className="text-2xl animate-bounce" style={{ animationDelay: '400ms' }}>👗</div>
          <div className="text-2xl animate-bounce" style={{ animationDelay: '600ms' }}>👠</div>
          <div className="text-2xl animate-bounce" style={{ animationDelay: '800ms' }}>🎽</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
