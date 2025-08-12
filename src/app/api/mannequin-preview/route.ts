import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  const { selectedItems, mannequinPreference, outfitName, notes } = await req.json();

  // Monta o prompt para Gemini
  const prompt = `A realistic mannequin (${mannequinPreference}) wearing: ${selectedItems.join(', ')}. Style: ${outfitName}. Notes: ${notes || ''}`;

  // Chama a API Gemini
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );
  const data = await response.json();

  // Log da resposta completa para debug
  console.log('[Gemini Vision Response]', JSON.stringify(data, null, 2));

  // Tente extrair a imagem gerada (ajuste conforme resposta Gemini)
  let imageUrl = '/test-mannequin.svg';
  // Exemplo: tente encontrar base64 ou url
  if (data.candidates?.[0]?.content?.parts) {
    const parts = data.candidates[0].content.parts;
    for (const part of parts) {
      if (part.imageUrl) imageUrl = part.imageUrl;
      if (part.inlineData?.mimeType?.startsWith('image') && part.inlineData?.data) {
        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      mannequinImageUrl: imageUrl,
      previewId: 'gemini-preview',
      itemsValidated: selectedItems.map((id: string) => ({ id, type: 'Desconhecido', color: 'Indefinido', valid: true })),
      generationTime: '5s',
      geminiRaw: data // Retorna resposta completa para debug
    }
  });
}
