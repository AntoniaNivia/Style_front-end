
'use server';

/**
 * @fileOverview Um fluxo dedicado para gerar a imagem de um manequim com o look sugerido.
 *
 * - generateMannequinImage - Função que lida com a geração da imagem.
 * - GenerateMannequinImageInput - O tipo de entrada para a função.
 * - GenerateMannequinImageOutput - O tipo de retorno para a função.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateMannequinImageInputSchema = z.object({
  outfitDescription: z.string().describe('Uma descrição textual do look para vestir o manequim (ex: "camisa branca, calça azul").'),
  userStyle: z.string().describe('O estilo geral do usuário para guiar a IA (ex: "moderno", "casual").'),
  occasion: z.string().describe('A ocasião do look (ex: "festa", "trabalho").'),
  mannequinPreference: z.enum(['Woman', 'Man', 'Neutral']).describe('A preferência de manequim do usuário.'),
});
export type GenerateMannequinImageInput = z.infer<typeof GenerateMannequinImageInputSchema>;

export const GenerateMannequinImageOutputSchema = z.object({
  mannequinPhotoDataUri: z
    .string()
    .describe(
      "A imagem gerada do manequim como um data URI (Base64)."
    ),
});
export type GenerateMannequinImageOutput = z.infer<typeof GenerateMannequinImageOutputSchema>;


export async function generateMannequinImage(input: GenerateMannequinImageInput): Promise<GenerateMannequinImageOutput> {
  return generateMannequinImageFlow(input);
}


const generateMannequinImageFlow = ai.defineFlow(
  {
    name: 'generateMannequinImageFlow',
    inputSchema: GenerateMannequinImageInputSchema,
    outputSchema: GenerateMannequinImageOutputSchema,
  },
  async (input) => {
    try {
      const mannequinPrompt = `Gere uma foto de um manequim ${input.mannequinPreference} vestindo o seguinte look: ${input.outfitDescription}. O estilo geral é ${input.userStyle}, para uma ocasião de ${input.occasion}. O fundo deve ser simples e neutro, com iluminação de estúdio.`;
      
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: mannequinPrompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (media?.url) {
        return { mannequinPhotoDataUri: media.url };
      }
    } catch (error) {
      console.error('Error generating mannequin image:', error);
      // Fallback to a placeholder if image generation fails
    }

    // Return a placeholder if generation fails or returns no image
    return { mannequinPhotoDataUri: 'https://placehold.co/400x600.png' };
  }
);
