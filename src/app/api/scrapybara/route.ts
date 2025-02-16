import { NextResponse } from "next/server";
import { main as runScrapyInstance } from "ai-models/scrapybara/index"; // Remove the @ prefix

export async function GET() {
  try {
    const data = await runScrapyInstance();
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Scrapybara API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
