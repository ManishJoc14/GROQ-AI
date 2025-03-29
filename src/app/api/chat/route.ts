import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        if (!message) {
            return NextResponse.json({ reply: "Message is required" }, { status: 400 });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "llama-3.3-70b-versatile",
            temperature: 1,
            max_completion_tokens: 1024,
            top_p: 1,
        });

        const reply = chatCompletion.choices?.[0]?.message?.content || "No response";
        return NextResponse.json({ reply }, { status: 200 });
    } catch (error) {
        console.error("Groq API error:", error);
        return NextResponse.json({ reply: "Failed to process request" }, { status: 500 });
    }
}
