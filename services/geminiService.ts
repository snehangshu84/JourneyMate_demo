import { GoogleGenAI } from "@google/genai";
import { Coordinates, Persona, GroundingSource } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTrivia = async (
  location: Coordinates, 
  persona: Persona = Persona.LOCAL
): Promise<{ text: string; sources: GroundingSource[] }> => {
  if (!apiKey) {
    return { 
      text: "Gemini API Key missing. Please provide a key to see AI trivia.", 
      sources: [] 
    };
  }

  try {
    const model = "gemini-2.5-flash";
    const personaInstruction = getPersonaInstruction(persona);

    const prompt = `
      ${personaInstruction}
      I am currently at latitude ${location.lat}, longitude ${location.lng}.
      Using Google Maps, tell me about a specific interesting place, landmark, or hidden gem right here or very nearby.
      Keep it under 40 words. Speak directly to me.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.lat,
              longitude: location.lng
            }
          }
        }
      }
    });

    // Extract Text
    const text = response.text || "Exploring the unknown...";

    // Extract Grounding Sources (Required for Google Maps Grounding)
    const sources: GroundingSource[] = [];
    
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        } else if (chunk.maps) {
           // Maps chunks often provide source info
           const title = chunk.maps.title || "Google Maps";
           const uri = chunk.maps.placeId 
             ? `https://www.google.com/maps/place/?q=place_id:${chunk.maps.placeId}`
             : (chunk.maps.uri || "https://maps.google.com");
           sources.push({ title, uri });
        }
      });
    }

    return { text, sources };

  } catch (error) {
    console.error("Gemini Error:", error);
    return { 
      text: "Could not fetch map data right now. Enjoy the view!", 
      sources: [] 
    };
  }
};

function getPersonaInstruction(persona: Persona): string {
  const PROMPTS: Record<Persona, string> = {
    [Persona.LOCAL]: "You are a friendly local guide. Focus on hidden gems and culture.",
    [Persona.HISTORIAN]: "You are a historian. Focus on historical events and dates.",
    [Persona.COMEDIAN]: "You are a comedian. Find something funny or weird about this place.",
    [Persona.FOODIE]: "You are a food critic. Mention famous local eats."
  };
  return PROMPTS[persona] || PROMPTS[Persona.LOCAL];
}