"use server";

import { OpenAIEmbeddings } from '@langchain/openai';
import { neon } from "@neondatabase/serverless";
import carsData from './data/cars.json';

const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'text-embedding-3-small',
});

const connectionString = process.env.DATABASE_URL;

export async function setupDatabase() {
    const sql = neon(connectionString || '');

    try {
        await sql`CREATE EXTENSION IF NOT EXISTS vector;`;

        await sql`
        CREATE TABLE IF NOT EXISTS cars (
        id SERIAL PRIMARY KEY,
        name TEXT,
        model TEXT,
        price INTEGER,
        location TEXT,
        image TEXT,
        embedding vector(1536)
      );
    `;

        const count = await sql`SELECT COUNT(*) FROM cars;`;
        if (count[0]?.count && parseInt(count[0].count) === 0) {
            await seedDatabase();
        }

        return { success: true, message: "Database setup completed" };
    } catch (error) {
        console.error('Erro ao configurar banco de dados:', error);
        throw error;
    }
}

export async function seedDatabase() {
    const sql = neon(connectionString || '');

    try {
        for (const car of carsData) {
            const text = `${car.Name} ${car.Model} ${car.Location} ${car.Price}`;

            const embeddingArray = await embeddings.embedQuery(text);

            const formattedEmbedding = `[${embeddingArray.toString()}]`;

            await sql`
        INSERT INTO cars (name, model, price, location, image, embedding) 
        VALUES (${car.Name}, ${car.Model}, ${car.Price}, ${car.Location}, ${car.Image}, ${formattedEmbedding})
      `;
        }
        console.log('Dados iniciais inseridos com sucesso!');
        return { success: true, message: "Database seeded successfully" };
    } catch (error) {
        console.error('Erro ao inserir dados iniciais:', error);
        throw error;
    }
}

export async function searchSimilarCars(query: string, limit = 3) {
    const sql = neon(connectionString || '');

    try {
        const embeddingArray = await embeddings.embedQuery(query);
        const formattedEmbedding = `[${embeddingArray.toString()}]`;

        const rows = await sql`
      SELECT name, model, price, location, image,
             1 - (embedding <=> ${formattedEmbedding}) as similarity
      FROM cars
      ORDER BY similarity DESC
      LIMIT ${limit}
    `;

        return rows.map((row: any) => ({
            Name: row.name,
            Model: row.model,
            Price: row.price,
            Location: row.location,
            Image: row.image,
            Similarity: row.similarity
        }));
    } catch (error) {
        console.error('Erro ao buscar carros similares:', error);
        throw error;
    }
}