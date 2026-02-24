import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getRelevantInfo, formatContext } from "@/lib/retriever";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_KEY = process.env.GEMINI_API_KEY as string;

const SYSTEM_PROMPT = `
You are **Mafi Restaurant's** friendly, on-brand assistant.
Your job:
- Answer ONLY questions about Mafi Restaurant: menu items, prices when provided, meeting halls, reservations, opening hours, location, contact details, policies, and general dining info.
- If the user asks anything unrelated, politely decline and guide them back to restaurant topics.
- Be concise, warm, and professional. Use **bold** for emphasis and structure with line breaks.
- Use markdown formatting: **bold** for important info, *italic* for subtle emphasis.
- If the user asks for details not in the provided context, say you don't have that information and suggest contacting the restaurant directly (phone/email).
- Never fabricate prices, promotions, or availability.
- Prefer concrete facts from context; if context conflicts with prior assumptions, prefer the context.
- When relevant, remind users they can book meeting halls via the **/booking** page or by phone.
- Format responses with clear structure using line breaks and bold text for better readability.
- Keep it under ~80 words unless listing items.
`.trim();

export async function POST(request: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
    }

    let data: { message?: string; history?: Array<{ role: string; text: string }> } = {};
    try {
      const raw = await request.text();
      if (raw) data = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const message = data.message;
    const history = Array.isArray(data.history) ? data.history : [];

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    // Build conversation summary from history for context-aware retrieval
    const recentHistory = history.slice(-6); // Last 3 exchanges max
    const conversationContext = recentHistory
      .map(h => `${h.role === "user" ? "User" : "Assistant"}: ${h.text}`)
      .join("\n");

    // Enhance retrieval query: for short follow-up messages, include recent context
    const isFollowUp = message.split(" ").length < 5;
    const lastUserMsg = [...recentHistory].reverse().find(h => h.role === "user");
    const lastBotMsg = [...recentHistory].reverse().find(h => h.role === "model");
    let queryForRetrieval = message;
    if (isFollowUp) {
      // Append keywords from recent messages to improve retrieval
      const extraContext = [lastBotMsg?.text, lastUserMsg?.text]
        .filter(Boolean)
        .join(" ")
        .slice(0, 200);
      queryForRetrieval = `${message} ${extraContext}`;
    }

    // Retrieve relevant context from our local knowledge base
    const topDocs = getRelevantInfo(queryForRetrieval, 6);
    const context = formatContext(topDocs);

    // Build a single prompt with conversation history embedded
    const prompt = `
${SYSTEM_PROMPT}

Restaurant Knowledge Base:
${context || "• No additional context found."}

${conversationContext ? `Recent conversation:\n${conversationContext}\n` : ""}
User's latest message:
"${message}"

Respond helpfully. If context is insufficient, say so and suggest calling or emailing the restaurant.
`.trim();

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: {
        temperature: 0.3,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 300,
      },
    });

    const result = await model.generateContent(prompt);
    let text = result.response.text()?.trim();

    if (!text) {
      text = "I don't have that information right now. Please contact us directly.";
    }

    const sources = topDocs.map(d => ({ id: d.id, section: d.section }));

    return NextResponse.json({ reply: text, sources }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
