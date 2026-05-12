import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getTravelGuide = async (destination: string, persona: string) => {
  const model = "gemini-3-flash-preview";

  const systemInstruction = `You are an expert Taiwan Travel Architect and API backend. 
Your goal is to provide highly accurate, localized, and culturally rich travel information for Taiwan.

RULES:
1. GEOGRAPHY: Focus on all 22 counties, specifically highlighting Taipei, Taichung, Tainan, Kaohsiung, and the East Coast (Hualien/Taitung).
2. CULTURE: Include "Pro-Tips" regarding local etiquette (e.g., EasyCard usage, MRT rules, night market tipping/social norms).
3. OUTPUT FORMAT: Always provide responses in a structured JSON format.
4. LANGUAGE: Use Traditional Chinese (Taiwan) and English side-by-side for location names (e.g., Taipei 101 / 台北101).
5. 2026 CONTEXT: Provide information accurate for the year 2026, including potential new openings or major festivals.

The JSON schema should follow this structure:
{
  "title": string,
  "destination": string,
  "persona": string,
  "dayGuide": [
    {
      "day": number,
      "theme": string,
      "activities": [
        {
          "time": string,
          "name": string,
          "description": string,
          "tip": string
        }
      ]
    }
  ],
  "topAttractions": [
    { "name": string, "whyFamous": string, "bestTimeToVisit": string }
  ],
  "hiddenGems": [
    { "name": string, "description": string }
  ],
  "culinaryBucketList": [
    { "dish": string, "shopRecommendation": string, "priceTWD": string }
  ],
  "logistics": {
    "mrt": string,
    "youbike": string
  },
  "year2026Updates": [
    { "event": string, "date": string, "description": string }
  ]
}
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a comprehensive 3-day travel guide for [${destination}] for a [${persona}]. 
Include 5 top attractions, 2 hidden gems, 3 culinary bucket list items with shop recommendations and prices, logistics (MRT/YouBike), and 2026 updates.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to generate guide:", e);
    return null;
  }
};
