import { GoogleGenAI, Type } from "@google/genai";
import { TrackerItem, ItemType } from '../types';

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getHealthInsights = async (items: TrackerItem[], completedCount: number, totalCount: number) => {
  const ai = getAI();
  if (!ai) return "API Key missing. Cannot generate insights.";

  const prompt = `
    I am tracking my daily health.
    My current stack: ${items.map(i => `${i.name} (${i.details})`).join(', ')}.
    Today's progress: ${completedCount}/${totalCount} completed.
    
    Give me a short, motivating paragraph about the benefits of consistency with this specific stack, 
    and one actionable health tip for tomorrow. Keep it under 100 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Stay consistent! You're doing great.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not fetch insights at this time.";
  }
};

export const smartParseEntry = async (userInput: string, availableItems: TrackerItem[]) => {
  const ai = getAI();
  if (!ai) throw new Error("API Key missing");

  const itemMap = availableItems.map(i => ({ id: i.id, name: i.name }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        User input: "${userInput}"
        Available Items to track: ${JSON.stringify(itemMap)}
        
        Identify which items from the 'Available Items' list the user has likely completed based on their input.
        Return a JSON object with a property 'matchedIds' which is an array of strings (IDs).
        If nothing matches, return empty array.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });
    
    const resultText = response.text;
    if (!resultText) return [];
    const parsed = JSON.parse(resultText);
    return parsed.matchedIds || [];

  } catch (error) {
    console.error("Smart Parse Error:", error);
    return [];
  }
};

export const chatWithAdvisor = async (history: string[], newMessage: string) => {
    const ai = getAI();
    if (!ai) return "API Key missing.";
  
    // Simple history context construction
    const conversation = history.join('\n') + `\nUser: ${newMessage}`;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `
          You are a helpful health and wellness assistant. 
          Context of conversation:
          ${conversation}
          
          Answer the user's question concisely and encouragingly.
        `,
      });
      return response.text || "I didn't catch that, can you rephrase?";
    } catch (error) {
      console.error("Chat Error:", error);
      return "Sorry, I'm having trouble connecting right now.";
    }
  };
