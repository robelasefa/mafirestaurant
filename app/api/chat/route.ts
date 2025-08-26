import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getRelevantInfo, formatContext } from "@/lib/retriever";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_KEY = process.env.GEMINI_API_KEY as string;

// Simple in-memory cache to speed up repeated questions (best-effort)
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { value: string; ts: number }>();
function getCache(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}
function setCache(key: string, value: string) {
  cache.set(key, { value, ts: Date.now() });
}

const SYSTEM_PROMPT = `
You are **Mafi Restaurant's** friendly, on-brand assistant.
Your job:
- Answer ONLY questions about Mafi Restaurant: menu items, prices when provided, meeting halls, reservations, opening hours, location, contact details, policies, and general dining info.
- If the user asks anything unrelated, politely decline and guide them back to restaurant topics.
- Be concise, warm, and professional. Use **bold** for emphasis and structure with line breaks.
- Use markdown formatting: **bold** for important info, *italic* for subtle emphasis, and [links](url) when relevant.
- If the user asks for details not in the provided context, say you don’t have that information and suggest contacting the restaurant directly (phone/email).
- Never fabricate prices, promotions, or availability.
- Prefer concrete facts from context; if context conflicts with prior assumptions, prefer the context.
- When relevant, remind users they can book meeting halls via the **/booking** page or by phone.
- Format responses with clear structure using line breaks and bold text for better readability.
`.trim();

function buildPrompt(userMessage: string, context: string) {
  return `
${SYSTEM_PROMPT}

Context (authoritative, may be partial):
${context || "• No additional context found."}

User question:
"${userMessage}"

Assistant guidelines:
- Answer directly and helpfully using the context.
- If context is insufficient, say so and offer the best next step (call/email/visit /booking).
- Keep it under ~80 words unless listing items.
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 256,
      },
    });
    let message: string | undefined;
    try {
      const raw = await request.text();
      if (raw) {
        const data = JSON.parse(raw);
        if (typeof data?.message === "string") {
          message = data.message;
        }
      }
    } catch {

    }

    if (!message) {
      const url = new URL(request.url);
      const q = url.searchParams.get("message");
      if (q) message = q;
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const key = message.toLowerCase().trim();
    const cached = getCache(key);
    if (cached) {
      return NextResponse.json({ reply: cached, sources: [] }, { status: 200 });
    }

    // Retrieve relevant context from our local knowledge base
    const topDocs = getRelevantInfo(message, 6);
    const context = formatContext(topDocs);

    // Build prompt and query Gemini
    const prompt = buildPrompt(message, context);
    const result = await model.generateContent(prompt);
    let text = result.response.text()?.trim();

    if (!text) {
      text = "I don't have that information right now. Please contact us if the issue persists.";
    }

    // Optionally include brief “sources” for transparency (section names only)
    const sources = topDocs.map(d => ({ id: d.id, section: d.section }));

    setCache(key, text);
    return NextResponse.json({ reply: text, sources }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { error: "Internal server error or issue with AI response." },
      { status: 500 }
    );
  }
}
