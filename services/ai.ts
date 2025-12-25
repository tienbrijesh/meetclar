
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
You are a production-grade AI backend service. Your highest priority is stability and deterministic JSON output.

STRICT RULES:
1. ALWAYS return valid JSON.
2. NEVER include markdown, code blocks, or explanations.
3. If data is missing, use "Not specified".
4. If synthesis fails, return: {"error": "Unable to process this request safely."}

EXECUTIVE PROTOCOL:
- Summarize the meeting with high-level professional tone.
- List distinct decisions.
- Identify action items with responsible parties and estimated deadlines.
- Generate ready-to-use comms for WhatsApp and Email.

OUTPUT SCHEMA:
{
  "summary": "...",
  "action_items": [{"task": "...", "owner": "...", "deadline": "..."}],
  "decisions": ["..."],
  "whatsapp_followup": "...",
  "email_followup": "..."
}`;

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
            text: "Synthesize this meeting record according to the strict production intelligence contract. Ensure 100% JSON validity."
          }
        ]
      }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      thinkingConfig: { thinkingBudget: 15000 },
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
    
    return {
      summary: data.summary || "Executive summary unavailable.",
      action_items: Array.isArray(data.action_items) ? data.action_items : [],
      decisions: Array.isArray(data.decisions) ? data.decisions : [],
      whatsapp_followup: data.whatsapp_followup || "No WhatsApp draft generated.",
      email_followup: data.email_followup || "No Email draft generated."
    };
  } catch (error: any) {
    console.error("Kernel Panic:", error);
    throw new Error(error.message || "Synthesis engine fault. Verify file integrity and retry.");
  }
}
