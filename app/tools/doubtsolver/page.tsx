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
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpCircle } from "lucide-react"
import { generateChatCompletion } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function DoubtSolver() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [output, setOutput] = useState("")

  const [formData, setFormData] = useState({
    question: "",
    subject: "math",
    explanationLevel: 50,
    visualAids: true,
    answerFormat: "step-by-step",
  })

  const subjects = [
    { value: "math", label: "Math" },
    { value: "science", label: "Science" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
    { value: "history", label: "History" },
    { value: "geography", label: "Geography" },
    { value: "literature", label: "Literature" },
    { value: "computer-science", label: "Computer Science" },
    { value: "economics", label: "Economics" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.question) {
      toast({
        title: "Missing information",
        description: "Please enter your question",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Prepare explanation level text based on slider value
      let explanationText = "Intermediate"
      if (formData.explanationLevel <= 33) explanationText = "Basic"
      else if (formData.explanationLevel >= 67) explanationText = "Detailed"

      const messages = [
        {
          role: "system",
          content: `You are DoubtSolver, an AI-powered educational assistant specialized in ${formData.subject}. 
          
When answering questions:
- Provide ${explanationText} level explanations
- ${formData.visualAids ? "Include descriptions of visual aids or diagrams where helpful" : "Do not include visual aids"}
- Format your answer in ${formData.answerFormat} format
          
Your goal is to help students understand concepts clearly and build their knowledge. Be educational, accurate, and supportive.`,
        },
        {
          role: "user",
          content: formData.question,
        },
      ]

      const response = await generateChatCompletion(messages, 0.7)
      setOutput(response.choices[0].message.content)
    } catch (error) {
      console.error("Error solving doubt:", error)
      toast({
        title: "Error",
        description: "Failed to solve doubt. Please try again.",
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
      description: "Answer copied to clipboard",
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
            <HelpCircle className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold text-center">DoubtSolver</h1>
          <p className="text-muted-foreground text-center max-w-2xl mt-2">
            An AI-powered tool for solving educational doubts with customizable explanations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="question">Your Question</Label>
                <Textarea
                  id="question"
                  placeholder="Ask your question..."
                  className="min-h-32"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => setFormData({ ...formData, subject: value })}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Explanation Level</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.explanationLevel <= 33
                      ? "Basic"
                      : formData.explanationLevel >= 67
                        ? "Detailed"
                        : "Intermediate"}
                  </span>
                </div>
                <Slider
                  value={[formData.explanationLevel]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setFormData({ ...formData, explanationLevel: value[0] })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="visualAids"
                  checked={formData.visualAids}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      visualAids: checked,
                    })
                  }
                />
                <Label htmlFor="visualAids" className="cursor-pointer">
                  Visual Aids
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Answer Format</Label>
                <RadioGroup
                  value={formData.answerFormat}
                  onValueChange={(value) => setFormData({ ...formData, answerFormat: value })}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="text" />
                    <Label htmlFor="text" className="cursor-pointer">
                      Text
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="step-by-step" id="step-by-step" />
                    <Label htmlFor="step-by-step" className="cursor-pointer">
                      Step-by-Step
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="video" id="video" />
                    <Label htmlFor="video" className="cursor-pointer">
                      Video
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    Solving Doubt <LoadingDots className="ml-2" />
                  </>
                ) : (
                  "Solve Doubt"
                )}
              </Button>
            </form>
          </div>

          <OutputContainer
            title="Answer"
            isLoading={isLoading}
            onRegenerate={output ? handleRegenerate : undefined}
            onCopy={output ? handleCopy : undefined}
          >
            {output ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{output}</div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">Your answer will appear here</div>
            )}
          </OutputContainer>
        </div>
      </main>
      <Footer />
    </div>
  )
}

