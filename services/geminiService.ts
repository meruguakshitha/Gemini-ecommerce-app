import { GoogleGenAI, Type } from "@google/genai";
import { Product } from '../types';

// The API key is expected to be available in the execution environment as process.env.API_KEY.
// The GoogleGenAI constructor will handle cases where the key is missing.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const productSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: 'A unique identifier for the product (e.g., UUID).' },
    name: { type: Type.STRING, description: 'The creative and appealing name of the product.' },
    description: { type: Type.STRING, description: 'A brief but compelling description of the product, 1-2 sentences long.' },
    price: { type: Type.NUMBER, description: 'The price of the product in USD, between 10 and 2000.' },
    category: { type: Type.STRING, description: 'The category of the product (e.g., Electronics, Books, Home Goods, Apparel).' },
    imageUrl: { type: Type.STRING, description: 'A placeholder image URL from https://picsum.photos/400/400.' },
  },
  required: ['id', 'name', 'description', 'price', 'category', 'imageUrl'],
};

export const generateProducts = async (): Promise<Product[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a list of 20 diverse and interesting products for a mock e-commerce store. Include products from categories like electronics, books, home goods, and apparel. Ensure each product has a unique ID.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            products: {
              type: Type.ARRAY,
              items: productSchema,
            },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as { products: Product[] };

    if (result && Array.isArray(result.products)) {
        return result.products;
    } else {
        console.error("Generated data is not in the expected format:", result);
        return [];
    }
  } catch (error) {
    console.error("Error generating products with Gemini:", error);
    throw new Error("Failed to fetch product data. Please check your API key and try again.");
  }
};
