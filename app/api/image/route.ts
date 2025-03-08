import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: Request) {
  try {
    const { prompt, width, height, num_inference_steps, negative_prompt, seed } = await request.json()

    if (!process.env.NEBIUS_API_KEY) {
      return NextResponse.json({ error: "NEBIUS_API_KEY is not configured" }, { status: 500 })
    }

    const client = new OpenAI({
      baseURL: "https://api.studio.nebius.com/v1/",
      apiKey: process.env.NEBIUS_API_KEY,
      dangerouslyAllowBrowser: true,
    })

    const response = await client.images.generate({
      model: "stability-ai/sdxl",
      response_format: "b64_json",
      extra_body: {
        response_extension: "webp",
        width,
        height,
        num_inference_steps,
        negative_prompt,
        seed,
      },
      prompt,
    })

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Image API Error:", error)
    return NextResponse.json({ error: error.message || "Failed to generate image" }, { status: 500 })
  }
}

