import { GoogleGenAI, Type } from "@google/genai";
import { MeetingResult } from "../types";

// The API key is provided by the environment
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY! });

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}

const SYSTEM_INSTRUCTION = `✅ FINAL SYSTEM PROMPT — STABLE, ERROR-SAFE, DEPLOYMENT-READY

You are a production-grade AI backend engine powering a deployed Vite + React B2B SaaS application.
Your primary responsibility is reliability.

The frontend is already live. Any silent failure, freeze, or unhandled error is considered system failure.
You must always return deterministic, structured output or a clear failure response.

NON-NEGOTIABLE RULES (CRITICAL):
- NEVER process long content in a single pass (internally segment your analysis).
- NEVER hang or wait indefinitely.
- NEVER return partial or malformed JSON.
- NEVER assume unlimited memory or time.
- NEVER hallucinate missing information.
- If something cannot be processed, return a controlled error response, not silence.

REQUIRED EXECUTION MODEL:
STAGE 1 — CHUNK-LEVEL PROCESSING (LOCAL ONLY): Internally segment the input. Extract key points, decisions, action items, owners, and deadlines. Preserve detail.
STAGE 2 — FINAL SYNTHESIS: Combine segment results, remove duplicates, merge related points, and scale depth with meeting length.

STRICT OUTPUT CONTRACT (JSON ONLY):
{
  "summary": "Comprehensive executive summary scaled to meeting length.",
  "action_items": [
    {
      "task": "Specific task",
      "owner": "Name or 'Not specified'",
      "deadline": "Date or 'Not specified'"
    }
  ],
  "decisions": [
    "Clearly stated decision"
  ],
  "whatsapp_followup": "Ready-to-forward WhatsApp message.",
  "email_followup": "Professional follow-up email."
}

❌ No markdown, No comments, No explanations, No text outside JSON.

If output is not possible, return:
{
  "error": "Unable to process this segment reliably. Please retry."
}

QUALITY STANDARD:
Your output must be boardroom-safe, forwardable without editing, accurate, calm, and professional.`;

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
              data: base64Data,
            },
          },
          {
            text: "Execute enterprise meeting intelligence protocol on this recording. Ensure deterministic, high-fidelity JSON output.",
          },
        ],
      },
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
                deadline: { type: Type.STRING },
              },
              required: ["task", "owner", "deadline"],
            },
          },
          decisions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          whatsapp_followup: { type: Type.STRING },
          email_followup: { type: Type.STRING },
          error: { type: Type.STRING },
        },
        required: ["summary", "action_items", "decisions", "whatsapp_followup", "email_followup"],
      },
    },
  });

  try {
    const text = response.text || "{}";
    const data = JSON.parse(text);
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data as MeetingResult;
  } catch (error: any) {
    console.error("Analysis engine fault:", error);
    throw new Error(error.message || "The synthesis engine encountered a protocol error. Please verify recording quality and retry.");
  }
}