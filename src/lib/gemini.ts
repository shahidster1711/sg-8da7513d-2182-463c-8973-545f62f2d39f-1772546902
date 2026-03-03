import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function generateDescription(
  title: string,
  category: string
): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    console.warn("Gemini API key is missing");
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Write a compelling and detailed sales description for a product listing on a marketplace in Andaman & Nicobar Islands.
    
    Product Title: ${title}
    Category: ${category}
    
    The description should be professional, highlight potential features based on the title, and encourage buyers. Keep it under 200 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating description:", error);
    return null;
  }
}