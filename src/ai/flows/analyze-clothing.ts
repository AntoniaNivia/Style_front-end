
'use server';

/**
 * @fileOverview Um fluxo para analisar uma imagem de uma peça de roupa e extrair detalhes sobre ela.
 *
 * - analyzeClothingItem - Uma função que lida com a análise da peça de roupa.
 * - AnalyzeClothingInput - O tipo de entrada para a função analyzeClothingItem.
 * - AnalyzeClothingOutput - O tipo de retorno para a função analyzeClothingItem.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeClothingInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "Uma foto da peça de roupa, como um URI de dados que deve incluir um tipo MIME e usar codificação Base64. Formato esperado: 'data:<mimetype>;base64,<dados_codificados>'."
    ),
});
export type AnalyzeClothingInput = z.infer<typeof AnalyzeClothingInputSchema>;

const AnalyzeClothingOutputSchema = z.object({
  type: z.string().describe('O tipo de peça de roupa (ex: Camiseta, Calça, Vestido).'),
  color: z.string().describe('A cor principal da peça de roupa.'),
  season: z.string().describe('A estação mais adequada para a peça de roupa (ex: Verão, Inverno).'),
  occasion: z.string().describe('A ocasião adequada para a peça de roupa (ex: Casual, Trabalho, Festa).'),
  tags: z.array(z.string()).describe('Etiquetas descritivas para a peça de roupa (ex: algodão, floral, confortável).'),
});
export type AnalyzeClothingOutput = z.infer<typeof AnalyzeClothingOutputSchema>;

export async function analyzeClothingItem(input: AnalyzeClothingInput): Promise<AnalyzeClothingOutput> {
  return analyzeClothingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeClothingPrompt',
  input: {schema: AnalyzeClothingInputSchema},
  output: {schema: AnalyzeClothingOutputSchema},
  prompt: `Você é um especialista em moda. Analise a imagem da peça de roupa fornecida e extraia as seguintes informações:
- Tipo de roupa (por exemplo, Camiseta, Calça, Jaqueta, Vestido, Saia, Sapatos).
- A cor principal.
- A estação mais adequada (Primavera, Verão, Outono, Inverno, Todas).
- A ocasião mais adequada (por exemplo, Casual, Trabalho, Festa, Formal).
- Gere 3 a 5 etiquetas descritivas relevantes (por exemplo, algodão, listrado, vintage, confortável).

Foto: {{media url=photoDataUri}}

Produza um objeto JSON que siga o esquema de saída.`,
});

const analyzeClothingFlow = ai.defineFlow(
  {
    name: 'analyzeClothingFlow',
    inputSchema: AnalyzeClothingInputSchema,
    outputSchema: AnalyzeClothingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Não foi possível analisar a peça de roupa.');
    }
    return output;
  }
);
