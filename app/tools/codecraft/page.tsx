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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Code2 } from "lucide-react"
import { generateChatCompletion } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function CodeCraft() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [output, setOutput] = useState("")

  const [formData, setFormData] = useState({
    codeInput: "",
    language: "javascript",
    complexityLevel: 50,
    explanationDetail: "detailed",
    codeStyle: "commented",
  })

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "typescript", label: "TypeScript" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.codeInput) {
      toast({
        title: "Missing information",
        description: "Please enter your code or problem",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Prepare complexity level text based on slider value
      let complexityText = "Intermediate"
      if (formData.complexityLevel <= 33) complexityText = "Beginner"
      else if (formData.complexityLevel >= 67) complexityText = "Advanced"

      const messages = [
        {
          role: "system",
          content: `You are CodeCraft, an AI-assisted coding tool that generates code snippets, explains its logic, and adapts to user preferences for style and complexity. 
          
When generating code:
- Use the ${formData.language} programming language
- Target a ${complexityText} skill level
- Provide ${formData.explanationDetail} explanations
- Write code in a ${formData.codeStyle} style
          
Format your response with clear sections, including:
1. The code solution (in a code block)
2. Explanation of the solution
3. Any additional notes or best practices`,
        },
        {
          role: "user",
          content: formData.codeInput,
        },
      ]

      const response = await generateChatCompletion(messages, 0.7)
      setOutput(response.choices[0].message.content)
    } catch (error) {
      console.error("Error generating code:", error)
      toast({
        title: "Error",
        description: "Failed to generate code. Please try again.",
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
      description: "Code copied to clipboard",
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
            <Code2 className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold text-center">CodeCraft</h1>
          <p className="text-muted-foreground text-center max-w-2xl mt-2">
            An AI-assisted coding tool that generates code snippets, explains its logic, and adapts to user preferences
            for style and complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="codeInput">Code Input</Label>
                <Textarea
                  id="codeInput"
                  placeholder="Enter your code or problem..."
                  className="font-mono min-h-32"
                  value={formData.codeInput}
                  onChange={(e) => setFormData({ ...formData, codeInput: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Complexity Level</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.complexityLevel <= 33
                      ? "Beginner"
                      : formData.complexityLevel >= 67
                        ? "Advanced"
                        : "Intermediate"}
                  </span>
                </div>
                <Slider
                  value={[formData.complexityLevel]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setFormData({ ...formData, complexityLevel: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="explanationDetail">Explanation Detail</Label>
                <Select
                  value={formData.explanationDetail}
                  onValueChange={(value) => setFormData({ ...formData, explanationDetail: value })}
                >
                  <SelectTrigger id="explanationDetail">
                    <SelectValue placeholder="Select explanation detail" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brief">Brief</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="step-by-step">Step-by-Step</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Code Style</Label>
                <RadioGroup
                  value={formData.codeStyle}
                  onValueChange={(value) => setFormData({ ...formData, codeStyle: value })}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="concise" id="concise" />
                    <Label htmlFor="concise" className="cursor-pointer">
                      Concise
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="verbose" id="verbose" />
                    <Label htmlFor="verbose" className="cursor-pointer">
                      Verbose
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="commented" id="commented" />
                    <Label htmlFor="commented" className="cursor-pointer">
                      Commented
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    Generating Code <LoadingDots className="ml-2" />
                  </>
                ) : (
                  "Generate Code"
                )}
              </Button>
            </form>
          </div>

          <OutputContainer
            title="Code Output"
            isLoading={isLoading}
            onRegenerate={output ? handleRegenerate : undefined}
            onCopy={output ? handleCopy : undefined}
          >
            {output ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-mono text-sm">{output}</pre>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">Your code will appear here</div>
            )}
          </OutputContainer>
        </div>
      </main>
      <Footer />
    </div>
  )
}

