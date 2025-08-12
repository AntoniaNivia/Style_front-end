import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { GenerateOutfitInput, OutfitGeneration } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const input: GenerateOutfitInput = await req.json();
    const prompt = `Gere um look completo para a ocasião: ${input.occasion}.`
      + (input.weather ? ` Clima: ${input.weather}.` : '')
      + (input.season ? ` Estação: ${input.season}.` : '')
      + (input.style ? ` Estilo: ${input.style}.` : '')
      + (input.colors && input.colors.length > 0 ? ` Cores preferidas: ${input.colors.join(', ')}.` : '')
      + (input.excludeItems && input.excludeItems.length > 0 ? ` Não use os itens: ${input.excludeItems.join(', ')}.` : '')
      + ` Manequim: ${input.mannequinPreference || 'Neutral'}. Responda em JSON com os campos: selectedItems (array de objetos com id, type, reason), reasoning, styleNotes, mannequinImagePrompt, confidence.`;

    const response = await ai.generate({ prompt });
    let result: OutfitGeneration | null = null;
    try {
      const match = response.text.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      }
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Falha ao interpretar resposta da IA' }, { status: 500 });
    }
    if (!result) {
      return NextResponse.json({ success: false, error: 'IA não retornou um look válido' }, { status: 500 });
    }
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Erro interno' }, { status: 500 });
  }
}
