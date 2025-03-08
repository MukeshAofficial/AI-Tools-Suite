"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OutputContainer } from "@/components/output-container"
import { LoadingDots } from "@/components/loading-dots"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText } from "lucide-react"
import { generateChatCompletion } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function WriteWise() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [output, setOutput] = useState("")

  const [formData, setFormData] = useState({
    textInput: "",
    tone: "neutral",
    style: "blog",
    creativityLevel: 50,
    wordCount: 300,
  })

  const tones = [
    { value: "formal", label: "Formal" },
    { value: "casual", label: "Casual" },
    { value: "friendly", label: "Friendly" },
    { value: "professional", label: "Professional" },
    { value: "enthusiastic", label: "Enthusiastic" },
    { value: "neutral", label: "Neutral" },
  ]

  const styles = [
    { value: "academic", label: "Academic" },
    { value: "blog", label: "Blog" },
    { value: "creative", label: "Creative" },
    { value: "technical", label: "Technical" },
    { value: "business", label: "Business" },
    { value: "journalistic", label: "Journalistic" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.textInput) {
      toast({
        title: "Missing information",
        description: "Please enter some text to start with",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Prepare creativity level text based on slider value
      let creativityText = "Medium"
      if (formData.creativityLevel <= 33) creativityText = "Low"
      else if (formData.creativityLevel >= 67) creativityText = "High"

      const messages = [
        {
          role: "system",
          content: `You are WriteWise, an AI-assisted writing tool with control over style, tone, and creativity. 
          
When generating text:
- Use a ${formData.tone} tone
- Write in a ${formData.style} style
- Apply ${creativityText} creativity level
- Target approximately ${formData.wordCount} words
          
Your task is to help the user with their writing by improving, expanding, or creating content based on their input.`,
        },
        {
          role: "user",
          content: formData.textInput,
        },
      ]

      const response = await generateChatCompletion(messages, 0.8)
      setOutput(response.choices[0].message.content)
    } catch (error) {
      console.error("Error generating text:", error)
      toast({
        title: "Error",
        description: "Failed to generate text. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "writewise-output.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded!",
      description: "Text saved as writewise-output.txt",
    })
  }

  const handleRegenerate = () => {
    handleSubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold text-center">WriteWise</h1>
          <p className="text-muted-foreground text-center max-w-2xl mt-2">
            An AI-assisted writing tool with control over style, tone, and creativity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="textInput">Text Input</Label>
                <Textarea
                  id="textInput"
                  placeholder="Start writing or provide a prompt..."
                  className="min-h-32"
                  value={formData.textInput}
                  onChange={(e) => setFormData({ ...formData, textInput: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select value={formData.style} onValueChange={(value) => setFormData({ ...formData, style: value })}>
                  <SelectTrigger id="style">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Creativity Level</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.creativityLevel <= 33 ? "Low" : formData.creativityLevel >= 67 ? "High" : "Medium"}
                  </span>
                </div>
                <Slider
                  value={[formData.creativityLevel]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setFormData({ ...formData, creativityLevel: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wordCount">Word Count Target</Label>
                <Input
                  id="wordCount"
                  type="number"
                  min={50}
                  max={2000}
                  value={formData.wordCount}
                  onChange={(e) => setFormData({ ...formData, wordCount: Number.parseInt(e.target.value) })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    Generating Text <LoadingDots className="ml-2" />
                  </>
                ) : (
                  "Generate Text"
                )}
              </Button>
            </form>
          </div>

          <OutputContainer
            title="Generated Text"
            isLoading={isLoading}
            onRegenerate={output ? handleRegenerate : undefined}
            onCopy={output ? handleCopy : undefined}
            onDownload={output ? handleDownload : undefined}
            showDownload={true}
          >
            {output ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{output}</div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">Your generated text will appear here</div>
            )}
          </OutputContainer>
        </div>
      </main>
      <Footer />
    </div>
  )
}

