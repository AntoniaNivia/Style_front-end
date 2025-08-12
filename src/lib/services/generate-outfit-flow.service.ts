
import { GenerateOutfitInput, OutfitGeneration } from '@/lib/types';

/**
 * Gera um look usando IA via API route (browser safe)
 */
export async function generateOutfitWithAI(input: GenerateOutfitInput): Promise<OutfitGeneration> {
	const res = await fetch('/api/generate-outfit', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input),
	});
	const data = await res.json();
	if (!data.success || !data.data) {
		throw new Error(data.error || 'Erro ao gerar look com IA');
	}
	return data.data;
}
