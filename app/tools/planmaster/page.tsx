"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OutputContainer } from "@/components/output-container"
import { LoadingDots } from "@/components/loading-dots"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import { generateChatCompletion } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function PlanMaster() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [output, setOutput] = useState("")

  const [formData, setFormData] = useState({
    projectGoal: "",
    timeframe: 7,
    priorityLevel: 50,
    taskDetail: "detailed",
    resources: {
      teamMembers: false,
      budget: false,
      tools: false,
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.projectGoal) {
      toast({
        title: "Missing information",
        description: "Please enter your project goal",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Prepare priority level text based on slider value
      let priorityText = "Medium"
      if (formData.priorityLevel <= 33) priorityText = "Low"
      else if (formData.priorityLevel >= 67) priorityText = "High"

      // Prepare resources text
      const resourcesArray = []
      if (formData.resources.teamMembers) resourcesArray.push("Team Members")
      if (formData.resources.budget) resourcesArray.push("Budget")
      if (formData.resources.tools) resourcesArray.push("Tools")
      const resourcesText = resourcesArray.length > 0 ? resourcesArray.join(", ") : "None specified"

      const messages = [
        {
          role: "system",
          content: `You are PlanMaster, an AI-driven project planning assistant. Generate a detailed project plan based on the user's input. Include tasks, timelines, and reasoning for your recommendations. Format your response with clear sections, bullet points, and estimated timeframes.`,
        },
        {
          role: "user",
          content: `Create a project plan with the following details:
          
Project Goal: ${formData.projectGoal}
Timeframe: ${formData.timeframe} days
Priority Level: ${priorityText}
Task Detail Level: ${formData.taskDetail}
Resources to Consider: ${resourcesText}

Please provide a structured plan with tasks, subtasks, timeline, and brief explanations for your recommendations.`,
        },
      ]

      const response = await generateChatCompletion(messages, 0.7)
      setOutput(response.choices[0].message.content)
    } catch (error) {
      console.error("Error generating plan:", error)
      toast({
        title: "Error",
        description: "Failed to generate plan. Please try again.",
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
      description: "Plan copied to clipboard",
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
            <Calendar className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold text-center">PlanMaster</h1>
          <p className="text-muted-foreground text-center max-w-2xl mt-2">
            AI-driven project planning tool that generates timelines and tasks with transparent reasoning for deadlines
            and resource allocation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectGoal">Project Goal</Label>
                <Textarea
                  id="projectGoal"
                  placeholder="Describe your project..."
                  className="min-h-32"
                  value={formData.projectGoal}
                  onChange={(e) => setFormData({ ...formData, projectGoal: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe (days)</Label>
                <Input
                  id="timeframe"
                  type="number"
                  min={1}
                  max={365}
                  value={formData.timeframe}
                  onChange={(e) => setFormData({ ...formData, timeframe: Number.parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Priority Level</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.priorityLevel <= 33 ? "Low" : formData.priorityLevel >= 67 ? "High" : "Medium"}
                  </span>
                </div>
                <Slider
                  value={[formData.priorityLevel]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setFormData({ ...formData, priorityLevel: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taskDetail">Task Detail</Label>
                <Select
                  value={formData.taskDetail}
                  onValueChange={(value) => setFormData({ ...formData, taskDetail: value })}
                >
                  <SelectTrigger id="taskDetail">
                    <SelectValue placeholder="Select detail level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="full">Full Breakdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Resource Allocation</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="teamMembers"
                      checked={formData.resources.teamMembers}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          resources: {
                            ...formData.resources,
                            teamMembers: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="teamMembers" className="cursor-pointer">
                      Team Members
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="budget"
                      checked={formData.resources.budget}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          resources: {
                            ...formData.resources,
                            budget: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="budget" className="cursor-pointer">
                      Budget
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tools"
                      checked={formData.resources.tools}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          resources: {
                            ...formData.resources,
                            tools: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="tools" className="cursor-pointer">
                      Tools
                    </Label>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    Generating Plan <LoadingDots className="ml-2" />
                  </>
                ) : (
                  "Generate Plan"
                )}
              </Button>
            </form>
          </div>

          <OutputContainer
            title="Project Plan"
            isLoading={isLoading}
            onRegenerate={output ? handleRegenerate : undefined}
            onCopy={output ? handleCopy : undefined}
          >
            {output ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans">{output}</pre>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">Your project plan will appear here</div>
            )}
          </OutputContainer>
        </div>
      </main>
      <Footer />
    </div>
  )
}

