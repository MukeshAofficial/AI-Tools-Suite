"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OutputContainer } from "@/components/output-container"
import { LoadingDots } from "@/components/loading-dots"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { generateChatCompletion } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function ClarifAI() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [output, setOutput] = useState("")

  const [formData, setFormData] = useState({
    inputText: "",
    task: "summarize",
    reasoningDepth: 50,
    showSources: true,
    confidenceThreshold: 0.8,
  })

  const tasks = [
    { value: "summarize", label: "Summarize" },
    { value: "translate", label: "Translate" },
    { value: "qa", label: "Q&A" },
    { value: "analyze", label: "Analyze" },
    { value: "extract", label: "Extract Information" },
    { value: "explain", label: "Explain Concept" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.inputText) {
      toast({
        title: "Missing information",
        description: "Please enter some text to process",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Prepare reasoning depth text based on slider value
      let reasoningText = "Intermediate"
      if (formData.reasoningDepth <= 33) reasoningText = "Basic"
      else if (formData.reasoningDepth >= 67) reasoningText = "Detailed"

      const messages = [
        {
          role: "system",
          content: `You are ClarifAI, a transparent language model with reasoning and source attribution capabilities. 
          
When processing text:
- Perform the ${formData.task} task
- Provide ${reasoningText} level reasoning for your output
- ${formData.showSources ? "Include source attribution and confidence levels" : "Do not include source attribution"}
- Only include information with a confidence level above ${formData.confidenceThreshold}
          
Format your response with clear sections, including:
1. The main output
2. Your reasoning process
${formData.showSources ? "3. Sources and confidence levels" : ""}`,
        },
        {
          role: "user",
          content: formData.inputText,
        },
      ]

      const response = await generateChatCompletion(messages, 0.7)
      setOutput(response.choices[0].message.content)
    } catch (error) {
      console.error("Error processing text:", error)
      toast({
        title: "Error",
        description: "Failed to process text. Please try again.",
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
      description: "Output copied to clipboard",
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
            <Search className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold text-center">ClarifAI</h1>
          <p className="text-muted-foreground text-center max-w-2xl mt-2">
            A transparent language model with reasoning and source attribution capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="inputText">Input Text</Label>
                <Textarea
                  id="inputText"
                  placeholder="Enter your text..."
                  className="min-h-32"
                  value={formData.inputText}
                  onChange={(e) => setFormData({ ...formData, inputText: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task">Task</Label>
                <Select value={formData.task} onValueChange={(value) => setFormData({ ...formData, task: value })}>
                  <SelectTrigger id="task">
                    <SelectValue placeholder="Select task" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task.value} value={task.value}>
                        {task.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Reasoning Depth</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.reasoningDepth <= 33
                      ? "Basic"
                      : formData.reasoningDepth >= 67
                        ? "Detailed"
                        : "Intermediate"}
                  </span>
                </div>
                <Slider
                  value={[formData.reasoningDepth]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setFormData({ ...formData, reasoningDepth: value[0] })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showSources"
                  checked={formData.showSources}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      showSources: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="showSources" className="cursor-pointer">
                  Show Sources
                </Label>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="confidenceThreshold">Confidence Threshold</Label>
                  <span className="text-sm text-muted-foreground">{formData.confidenceThreshold}</span>
                </div>
                <Slider
                  value={[formData.confidenceThreshold * 100]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setFormData({ ...formData, confidenceThreshold: value[0] / 100 })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    Processing <LoadingDots className="ml-2" />
                  </>
                ) : (
                  "Process Text"
                )}
              </Button>
            </form>
          </div>

          <OutputContainer
            title="Output"
            isLoading={isLoading}
            onRegenerate={output ? handleRegenerate : undefined}
            onCopy={output ? handleCopy : undefined}
          >
            {output ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{output}</div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">Your processed text will appear here</div>
            )}
          </OutputContainer>
        </div>
      </main>
      <Footer />
    </div>
  )
}

