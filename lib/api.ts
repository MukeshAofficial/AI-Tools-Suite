import { toast } from "@/components/ui/use-toast"

// Base API client for Nebius
const baseURL = "https://api.studio.nebius.com/v1/"

// Helper function to handle API errors
const handleApiError = (error: any) => {
  console.error("API Error:", error)
  const errorMessage = error.response?.data?.error?.message || error.message || "An unknown error occurred"
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  })
  throw error
}

// Chat completion with DeepSeek-R1 model
export async function generateChatCompletion(messages: any[], temperature = 0.6) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct",
        temperature,
        messages,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to generate chat completion")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error in generateChatCompletion:", error)
    toast({
      title: "Error",
      description: error.message || "Failed to generate chat completion",
      variant: "destructive",
    })
    throw error
  }
}

// Chat completion with Qwen2-VL-7B-Instruct model (for visual tasks)
export async function generateVisualCompletion(messages: any[], temperature = 0) {
  try {
    const response = await fetch("/api/visual", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2-VL-7B-Instruct",
        temperature,
        messages,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to generate visual completion")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error in generateVisualCompletion:", error)
    toast({
      title: "Error",
      description: error.message || "Failed to generate visual completion",
      variant: "destructive",
    })
    throw error
  }
}

// Image generation with stability-ai/sdxl model
export async function generateImage(prompt: string, options: any = {}) {
  try {
    const defaultOptions = {
      width: 1024,
      height: 1024,
      num_inference_steps: 30,
      negative_prompt: "",
      seed: -1,
    }

    const mergedOptions = { ...defaultOptions, ...options }

    const response = await fetch("/api/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        ...mergedOptions,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to generate image")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error in generateImage:", error)
    toast({
      title: "Error",
      description: error.message || "Failed to generate image",
      variant: "destructive",
    })
    throw error
  }
}

