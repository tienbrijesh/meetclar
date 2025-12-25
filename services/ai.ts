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

const SYSTEM_INSTRUCTION = `🔒 MASTER PROMPT — LONG-VIDEO SAFE, DEEP NOTES, ENTERPRISE MEETING ENGINE

You are an enterprise-grade AI meeting intelligence engine built for B2B founders, SMEs, and leadership teams.
Your responsibility is to reliably process long meeting recordings (30 to 120 minutes) and produce deep, structured, decision-ready notes.

Shallow summaries, timeouts, or single-pass processing are considered system failure.
Your behavior must prioritize: Reliability over speed, Completeness over brevity, Structure over creativity.

REQUIRED MULTI-STAGE PROCESSING STRATEGY:
- STAGE 1 — CHUNK-LEVEL ANALYSIS: Extract local discussion points, decisions, and action items from sequential segments of the recording.
- STAGE 2 — AGGREGATION & SYNTHESIS: Combine all segment outputs, remove duplicates, and preserve all meaningful detail.

FINAL OUTPUT FORMAT (STRICT):
Return ONLY valid JSON in the following structure:
{
  "summary": "Comprehensive executive summary reflecting the full context of the meeting. Must scale in depth with meeting length.",
  "action_items": [
    {
      "task": "Clear, specific task",
      "owner": "Person responsible or 'Not specified'",
      "deadline": "Explicit date or 'Not specified'"
    }
  ],
  "decisions": [
    "Clearly stated decision made during the meeting"
  ],
  "whatsapp_followup": "Clear, professional follow-up message formatted for WhatsApp.",
  "email_followup": "Professional email summarizing decisions, responsibilities, and next steps."
}

Depth MUST scale with meeting duration. A 60-90 minute meeting MUST NOT produce a short summary.
If unsure -> preserve information. If complex -> stay structured.`;

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
            text: "Analyze this recording using your Enterprise Meeting Engine protocol. Deliver full depth, accurate attribution, and zero-loss synthesis.",
          },
        ],
      },
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      thinkingConfig: { thinkingBudget: 8192 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { 
            type: Type.STRING, 
            description: "Deep, multi-paragraph executive summary." 
          },
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
        },
        required: ["summary", "action_items", "decisions", "whatsapp_followup", "email_followup"],
      },
    },
  });

  try {
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Enterprise-grade extraction failed. The output was not valid JSON or was interrupted. Please try again.");
  }
}