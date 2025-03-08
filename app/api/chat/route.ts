import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: Request) {
  try {
    const { model, temperature, messages } = await request.json()

    if (!process.env.NEBIUS_API_KEY) {
      return NextResponse.json({ error: "NEBIUS_API_KEY is not configured" }, { status: 500 })
    }

    const client = new OpenAI({
      baseURL: "https://api.studio.nebius.com/v1/",
      apiKey: process.env.NEBIUS_API_KEY,
      dangerouslyAllowBrowser: true,
    })

    const response = await client.chat.completions.create({
      model,
      temperature,
      messages,
    })

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Chat API Error:", error)
    return NextResponse.json({ error: error.message || "Failed to generate chat completion" }, { status: 500 })
  }
}

