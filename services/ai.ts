import { GoogleGenAI, Type } from "@google/genai";
import { MeetingResult } from "../types";

// The API key is provided by the environment per Gemini SDK guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY! });

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64String = result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}

const SYSTEM_INSTRUCTION = `SYSTEM / DEVELOPER PROMPT

You are a production-grade AI backend service. Your highest priority is stability and deterministic output.
Anything that causes runtime crashes or malformed JSON is a system failure.

STRICT RULES:
- NEVER process long content in a single pass internally.
- NEVER block or hang indefinitely.
- NEVER return malformed JSON or text outside of JSON.
- If something cannot be processed safely, return a controlled error response.

REQUIRED EXECUTION MODEL:
1. Process input incrementally.
2. Extract key points, decisions, and action items with owners and deadlines.
3. If data is missing, use "Not specified".
4. Return a boardroom-safe, professional synthesis.

STRICT OUTPUT CONTRACT (Success):
{
  "summary": "Clear, production-safe summary.",
  "action_items": [{"task": "...", "owner": "...", "deadline": "..."}],
  "decisions": ["..."],
  "whatsapp_followup": "...",
  "email_followup": "..."
}

STRICT OUTPUT CONTRACT (Failure):
{
  "error": "Unable to process this request safely."
}

No markdown. No explanations. No trailing commas.`;

export async function processMeeting(file: File): Promise<MeetingResult> {
  const ai = getAI();
  const base64Data = await fileToBase64(file);

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          },
          {
            text: "Synthesize this meeting recording into the defined production-safe JSON format. Prioritize accuracy and stability."
          }
        ]
      }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      thinkingConfig: { thinkingBudget: 12000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          action_items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                task: { type: Type.STRING },
                owner: { type: Type.STRING },
                deadline: { type: Type.STRING }
              },
              required: ["task", "owner", "deadline"]
            }
          },
          decisions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          whatsapp_followup: { type: Type.STRING },
          email_followup: { type: Type.STRING },
          error: { type: Type.STRING }
        }
      }
    }
  });

  try {
    const text = response.text || "{}";
    const data = JSON.parse(text);
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    // Ensure all required fields exist to prevent runtime crashes in components
    return {
      summary: data.summary || "Summary not available.",
      action_items: Array.isArray(data.action_items) ? data.action_items : [],
      decisions: Array.isArray(data.decisions) ? data.decisions : [],
      whatsapp_followup: data.whatsapp_followup || "Follow-up not available.",
      email_followup: data.email_followup || "Email draft not available."
    };
  } catch (error: any) {
    console.error("Critical Backend Fault:", error);
    throw new Error(error.message || "Unable to process this request safely. Please verify the file integrity.");
  }
}