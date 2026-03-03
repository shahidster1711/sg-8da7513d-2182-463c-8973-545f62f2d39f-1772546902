import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export async function generateProductDescription(
  title: string,
  category: string,
  condition?: "new" | "used"
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a compelling product description for a marketplace listing in the Andaman and Nicobar Islands.

Product Title: ${title}
Category: ${category}
Condition: ${condition || "not specified"}

Write a natural, engaging description (2-3 sentences) that:
- Highlights key features and benefits
- Mentions the local context (Andaman islands)
- Is concise and informative
- Avoids overly promotional language
- Doesn't include pricing information

Description:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error("Error generating description:", error);
    throw new Error("Failed to generate description. Please try again.");
  }
}

export async function enhanceSearchQuery(query: string): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Given this search query: "${query}"

Generate 3-5 related search terms that would help find similar products in a marketplace. Return only the search terms, one per line, without numbering or additional text.

Related terms:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text
      .split("\n")
      .map((term) => term.trim())
      .filter((term) => term.length > 0);
  } catch (error) {
    console.error("Error enhancing search:", error);
    return [];
  }
}