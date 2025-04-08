import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { searchSimilarCars } from './embeddings';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: openai('gpt-4o'),
        system: `Você é um consultor de carros especializado em ajudar os clientes a encontrar o carro dos sonhos. 
    
    Quando você usar uma ferramenta para mostrar informações sobre carros, após a execução da ferramenta, continue a conversa com informações adicionais relevantes sobre os carros mostrados ou sugestões personalizadas.
    
    Para adicionar esse comentário adicional após a chamada da ferramenta, use o formato:
    
    __AFTER_TOOL_CALL__ Seu texto adicional aqui.
    
    Seja educado, entusiasta e dê detalhes relevantes após mostrar os carros. Responda de forma clara e objetiva, com base nas informações fornecidas pelo cliente.`,
        messages,
        tools: {
            getCarInfo: tool({
                description: 'Encontre informações sobre carros específicos com base na marca, modelo, valor ou localização',
                parameters: z.object({
                    query: z.string(),
                }),
                execute: async ({ query }) => {
                    const cars = await searchSimilarCars(query);
                    return cars;
                }
            })
        },
    });

    return result.toDataStreamResponse();
}