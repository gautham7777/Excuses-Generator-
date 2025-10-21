import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is configured in the environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might show a UI message or handle this more gracefully.
  // For this context, throwing an error is sufficient.
  console.error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function generateExcuse(situation: string): Promise<string> {
  if (!situation.trim()) {
    return "Please tell me the situation first, and I'll whip up an excuse for you!";
  }
  
  if (!API_KEY) {
    return "API Key is missing. Please configure your environment.";
  }

  try {
    const systemInstruction = `
      You are Get Me Out, a master wordsmith specializing in crafting believable, humorous, and charming excuses for a guy to tell his girlfriend.
      Your primary goal is to de-escalate a minor situation with wit and affection, transforming a potential conflict into a moment of shared laughter. This is for lighthearted fun, not for fabricating lies about serious matters.

      **Your Mission:**
      1.  **Analyze the Situation:** Deeply consider the user's input (e.g., 'Forgot our anniversary', 'Spilled wine on her dress').
      2.  **Select a Tone:** Based on the situation, choose a suitable tone. Examples include:
          *   **Playfully Forgetful:** Blame it on a charmingly faulty memory.
          *   **Endearingly Flustered:** Get tangled up in a sweet, silly explanation.
          *   **Wildly Imaginative:** Invent a brief, absurd, and hilarious scenario.
          *   **Sweetly Incompetent:** Frame the mistake as a failed attempt at doing something good.
      3.  **Craft the Excuse:** Generate a short, sweet excuse (2-3 sentences max) that fits the chosen tone and the specific context.

      **Crucial Rules:**
      - Never be disrespectful, misogynistic, or promote serious dishonesty.
      - Keep it concise and impactful.
      - **Do not wrap your final response in quotes.**
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate an excuse for this situation: "${situation}"`,
      config: {
        systemInstruction,
        temperature: 0.9,
        topK: 50,
        topP: 0.95,
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating excuse:", error);
    // Provide a more user-friendly error message
    return "Oops! My creative spark fizzled out. This might be due to a configuration issue or a network problem. Please try again in a moment.";
  }
}