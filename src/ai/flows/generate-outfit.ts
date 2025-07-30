'use server';

/**
 * @fileOverview A flow to generate outfit suggestions using AI based on the user's wardrobe.
 *
 * - generateOutfit - A function that handles the outfit generation process.
 * - GenerateOutfitInput - The input type for the generateOutfit function.
 * - GenerateOutfitOutput - The return type for the generateOutfit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOutfitInputSchema = z.object({
  wardrobe: z.array(
    z.object({
      photoDataUri: z
        .string()
        .describe(
          "Uma foto da peça de roupa, como um URI de dados que deve incluir um tipo MIME e usar codificação Base64. Formato esperado: 'data:<mimetype>;base64,<dados_codificados>'."
        ),
      type: z.string().describe('O tipo de peça de roupa (ex: camisa, calça, vestido).'),
      color: z.string().describe('A cor da peça de roupa.'),
      season: z.string().describe('A estação para a qual a peça de roupa é adequada.'),
      occasion: z.string().describe('A ocasião para a qual a peça de roupa é adequada.'),
      tags: z.array(z.string()).describe('Etiquetas personalizadas para a peça de roupa.'),
    })
  ).describe('O guarda-roupa virtual do usuário.'),
  userStyle: z.string().describe('O estilo preferido do usuário (ex: casual, elegante, urbano).'),
  climate: z.string().describe('O clima atual (ex: quente, frio, chuvoso).'),
  occasion: z.string().describe('A ocasião para a qual o look é destinado (ex: festa, trabalho, casual).'),
  mannequinPreference: z.enum(['Woman', 'Man', 'Neutral']).describe('A preferência de manequim do usuário para visualização do look.'),
});
export type GenerateOutfitInput = z.infer<typeof GenerateOutfitInputSchema>;

const GenerateOutfitOutputSchema = z.object({
  outfitSuggestion: z.array(
    z.object({
      photoDataUri: z
        .string()
        .describe(
          "Uma foto da peça de roupa, como um URI de dados que deve incluir um tipo MIME e usar codificação Base64. Formato esperado: 'data:<mimetype>;base64,<dados_codificados>'."
        ),
      type: z.string().describe('O tipo de peça de roupa (ex: camisa, calça, vestido).'),
      description: z.string().describe('Uma descrição do item do look.'),
    })
  ).describe('A sugestão de look gerada pela IA.'),
  reasoning: z.string().describe('Explicação de por que a IA fez esta sugestão.'),
  mannequinPhotoDataUri: z
    .string()
    .describe(
      "Uma foto do look sugerido em um manequim, como um URI de dados que deve incluir um tipo MIME e usar codificação Base64. Formato esperado: 'data:<mimetype>;base64,<dados_codificados>'."
    )
    .optional(),
});
export type GenerateOutfitOutput = z.infer<typeof GenerateOutfitOutputSchema>;

export async function generateOutfit(input: GenerateOutfitInput): Promise<GenerateOutfitOutput> {
  return generateOutfitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOutfitPrompt',
  input: {schema: GenerateOutfitInputSchema},
  output: {schema: GenerateOutfitOutputSchema},
  prompt: `Você é um estilista de IA. Dado o guarda-roupa de um usuário, suas preferências de estilo, o clima atual e a ocasião, você sugerirá um look.

Guarda-roupa:
{{#each wardrobe}}
- Tipo: {{this.type}}, Cor: {{this.color}}, Estação: {{this.season}}, Ocasião: {{this.occasion}}, Etiquetas: {{this.tags}}. O photoDataUri para esta peça é {{{this.photoDataUri}}}.
  {{#if @last}}

  {{else}}
  
  {{/if}}
{{/each}}

Estilo do usuário: {{{userStyle}}}
Clima: {{{climate}}}
Ocasião: {{{occasion}}}

Você deve escolher itens do guarda-roupa para criar um look completo que seja apropriado para o estilo do usuário, o clima e a ocasião. Forneça uma justificativa para cada item escolhido. 
Para cada item no look sugerido, você DEVE retornar o photoDataUri original do item do guarda-roupa.

Retorne a sugestão de look como um array de itens com photoDataUri, tipo e descrição.

Finalmente, crie uma visualização do look em um manequim {{{mannequinPreference}}}. Retorne o URI de dados da foto do manequim vestindo o look no campo mannequinPhotoDataUri. Se não puder criar a visualização do manequim, deixe o campo vazio.

Produza um objeto JSON que siga o esquema.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateOutfitFlow = ai.defineFlow(
  {
    name: 'generateOutfitFlow',
    inputSchema: GenerateOutfitInputSchema,
    outputSchema: GenerateOutfitOutputSchema,
  },
  async input => {
    // Step 1: Call the prompt to get the outfit suggestion and reasoning
    const {output} = await prompt(input);

    if (!output) {
      throw new Error('No output from prompt');
    }

    // Step 2: Optionally generate the mannequin visualization
    if (input.mannequinPreference) {
      try {
        const mannequinPrompt = `Gere uma foto de um manequim ${input.mannequinPreference} vestindo o seguinte look: ${output.outfitSuggestion.map(item => item.type).join(', ')}. O estilo geral é ${input.userStyle}, para uma ocasião de ${input.occasion}. O fundo deve ser simples e neutro.`;
        const {media} = await ai.generate({
          model: 'googleai/gemini-2.0-flash-preview-image-generation',
          prompt: mannequinPrompt,
          config: {
            responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
          },
        });

        if (media?.url) {
          output.mannequinPhotoDataUri = media.url;
        }
      } catch (error) {
        console.error('Error generating mannequin image:', error);
        // If mannequin generation fails, don't block the entire flow, and return without the mannequin image
      }
    }

    return output;
  }
);
