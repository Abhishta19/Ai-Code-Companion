import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("GROQ KEY:", process.env.GROQ_API_KEY);

    const body = await req.json();
    const { code, language } = body;

    console.log("Received Body:", body);

    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY!,
    });

    const prompt = `Explain the following ${language} code line-by-line in simple terms:\n\n${code}`;

    console.log("Prompt Sent:", prompt);

    const completion = await client.chat.completions.create({
      //CURRENT WORKING MODEL
      model: "meta-llama/llama-4-maverick-17b-128e-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    console.log("Groq Response Raw:", completion);

    const explanation = completion.choices[0]?.message?.content;

    return NextResponse.json({ explanation });
  } catch (error: any) {
    console.error("GROQ API ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
