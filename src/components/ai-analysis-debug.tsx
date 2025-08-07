'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Brain, Camera, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { AnalyzeClothingOutput } from "@/lib/types";

interface AIAnalysisDebugProps {
  analysis: AnalyzeClothingOutput | null;
  show?: boolean;
}

export function AIAnalysisDebug({ analysis, show = false }: AIAnalysisDebugProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!show || !analysis) return null;

  const confidence = analysis.confidence || 0;
  const qualityScore = analysis.qualityScore || 0;
  const retryCount = analysis.retryCount || 0;

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return "bg-green-500";
    if (score >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getQualityColor = (score: number) => {
    if (score >= 0.8) return "bg-blue-500";
    if (score >= 0.6) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        Debug da Análise de IA
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-4 w-4" />
              Detalhes da Análise
            </CardTitle>
            <CardDescription>
              Informações técnicas sobre como a IA analisou esta imagem
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Métricas */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Brain className="h-4 w-4" />
                  <span className="text-sm font-medium">Confiança</span>
                </div>
                <Badge className={`${getConfidenceColor(confidence)} text-white`}>
                  {Math.round(confidence * 100)}%
                </Badge>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Camera className="h-4 w-4" />
                  <span className="text-sm font-medium">Qualidade</span>
                </div>
                <Badge className={`${getQualityColor(qualityScore)} text-white`}>
                  {Math.round(qualityScore * 100)}%
                </Badge>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <RotateCcw className="h-4 w-4" />
                  <span className="text-sm font-medium">Tentativas</span>
                </div>
                <Badge variant="outline">
                  {retryCount}
                </Badge>
              </div>
            </div>

            {/* Reasoning */}
            {analysis.reasoning && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Raciocínio da IA
                </h4>
                <div className="bg-muted p-3 rounded-md text-sm">
                  {analysis.reasoning}
                </div>
              </div>
            )}

            {/* Interpretação */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Confiança:</strong> Quão certa a IA está do resultado</p>
              <p><strong>Qualidade:</strong> Quão boa estava a imagem para análise</p>
              <p><strong>Tentativas:</strong> Quantas vezes a IA processou antes do resultado final</p>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
