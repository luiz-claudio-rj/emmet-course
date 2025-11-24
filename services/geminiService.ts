import { GoogleGenAI, Type } from "@google/genai";

// We use Gemini as the "Engine" to parse Emmet because writing a full parser client-side
// is complex, and Gemini understands Emmet syntax perfectly.

export const expandEmmetWithGemini = async (
  apiKey: string,
  emmetString: string
): Promise<string> => {
  if (!apiKey) throw new Error("API Key required");

  const ai = new GoogleGenAI({ apiKey });

  const systemPrompt = `
    You are a strict, high-performance Emmet Abbreviation Engine.
    Your ONLY task is to take an Emmet abbreviation string and convert it into standard HTML.
    
    Rules:
    1. Output ONLY the HTML. No markdown, no explanation, no prologue.
    2. Do not include <!DOCTYPE html> or <html><body> wrappers unless explicitly asked in the emmet string.
    3. Indent the HTML nicely with 2 spaces for readability.
    4. If the emmet string is invalid or nonsense, return the string "INVALID_EMMET".
    5. Support standard Emmet syntax: > (child), + (sibling), * (multiply), . (class), # (id), {} (text), $ (numbering).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0, // Deterministic output
      },
      contents: [
        {
          role: "user",
          parts: [{ text: emmetString }],
        },
      ],
    });

    const text = response.text;
    return text ? text.trim() : "";
  } catch (error) {
    console.error("Gemini Emmet expansion failed:", error);
    throw error;
  }
};

export const getAiHint = async (
  apiKey: string,
  currentEmmet: string,
  targetHtml: string,
  concept: string
): Promise<string> => {
  if (!apiKey) return "Please provide an API Key to get AI hints.";

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    The user is playing an Emmet learning game.
    Target HTML to achieve:
    \`\`\`html
    ${targetHtml}
    \`\`\`
    
    Current Concept being taught: ${concept}
    
    User's current incorrect Emmet input: "${currentEmmet}"
    
    Provide a short, helpful, encouraging hint (max 1 sentence) explaining what might be wrong with their input or how to get closer to the target. Do NOT give the exact answer immediately, guide them.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    return response.text || "Try checking the syntax again.";
  } catch (error) {
    return "Could not retrieve hint at this time.";
  }
};
