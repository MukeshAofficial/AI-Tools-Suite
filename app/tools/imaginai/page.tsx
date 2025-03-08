"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OutputContainer } from "@/components/output-container"
import { LoadingDots } from "@/components/loading-dots"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon } from "lucide-react"
import { generateImage } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function ImaginAI() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [imageData, setImageData] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    prompt: "",
    style: "realistic",
    detailLevel: 50,
    colorPalette: "vivid",
    width: 1024,
    height: 1024,
  })

  const styles = [
    { value: "realistic", label: "Realistic" },
    { value: "cartoon", label: "Cartoon" },
    { value: "abstract", label: "Abstract" },
    { value: "digital-art", label: "Digital Art" },
    { value: "oil-painting", label: "Oil Painting" },
    { value: "watercolor", label: "Watercolor" },
  ]

  const colorPalettes = [
    { value: "vivid", label: "Vivid" },
    { value: "pastel", label: "Pastel" },
    { value: "monochrome", label: "Monochrome" },
    { value: "dark", label: "Dark" },
    { value: "bright", label: "Bright" },
    { value: "muted", label: "Muted" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.prompt) {
      toast({
        title: "Missing information",
        description: "Please enter a prompt for the image",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Prepare detail level text based on slider value
      let detailText = "medium"
      if (formData.detailLevel <= 33) detailText = "low"
      else if (formData.detailLevel >= 67) detailText = "high"

      // Prepare the full prompt with style and other parameters
      const fullPrompt = `${formData.prompt}, ${formData.style} style, ${detailText} detail, ${formData.colorPalette} colors`

      const response = await generateImage(fullPrompt, {
        width: formData.width,
        height: formData.height,
        num_inference_steps: formData.detailLevel < 33 ? 20 : formData.detailLevel > 67 ? 40 : 30,
      })

      // The response contains base64 encoded image data
      setImageData(`data:image/webp;base64,${response.data[0].b64_json}`)
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!imageData) return

    const link = document.createElement("a")
    link.href = imageData
    link.download = `imaginai-${Date.now()}.webp`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Downloaded!",
      description: "Image saved to your device",
    })
  }

  const handleShare = async () => {
    if (!imageData) return

    try {
      if (navigator.share) {
        const blob = await fetch(imageData).then((r) => r.blob())
        const file = new File([blob], "imaginai-image.webp", { type: "image/webp" })

        await navigator.share({
          title: "ImaginAI Generated Image",
          text: formData.prompt,
          files: [file],
        })
      } else {
        toast({
          title: "Sharing not supported",
          description: "Your browser doesn't support the Web Share API",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sharing image:", error)
      toast({
        title: "Error",
        description: "Failed to share image",
        variant: "destructive",
      })
    }
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
            <ImageIcon className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold text-center">ImaginAI</h1>
          <p className="text-muted-foreground text-center max-w-2xl mt-2">
            An open alternative to proprietary AI image generators with explainable processes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Image Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe your image..."
                  className="min-h-32"
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                />
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
                  <Label>Detail Level</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.detailLevel <= 33 ? "Low" : formData.detailLevel >= 67 ? "High" : "Medium"}
                  </span>
                </div>
                <Slider
                  value={[formData.detailLevel]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setFormData({ ...formData, detailLevel: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="colorPalette">Color Palette</Label>
                <Select
                  value={formData.colorPalette}
                  onValueChange={(value) => setFormData({ ...formData, colorPalette: value })}
                >
                  <SelectTrigger id="colorPalette">
                    <SelectValue placeholder="Select color palette" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorPalettes.map((palette) => (
                      <SelectItem key={palette.value} value={palette.value}>
                        {palette.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width</Label>
                  <Select
                    value={formData.width.toString()}
                    onValueChange={(value) => setFormData({ ...formData, width: Number.parseInt(value) })}
                  >
                    <SelectTrigger id="width">
                      <SelectValue placeholder="Select width" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="512">512px</SelectItem>
                      <SelectItem value="768">768px</SelectItem>
                      <SelectItem value="1024">1024px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Select
                    value={formData.height.toString()}
                    onValueChange={(value) => setFormData({ ...formData, height: Number.parseInt(value) })}
                  >
                    <SelectTrigger id="height">
                      <SelectValue placeholder="Select height" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="512">512px</SelectItem>
                      <SelectItem value="768">768px</SelectItem>
                      <SelectItem value="1024">1024px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    Generating Image <LoadingDots className="ml-2" />
                  </>
                ) : (
                  "Generate Image"
                )}
              </Button>
            </form>
          </div>

          <OutputContainer
            title="Generated Image"
            isLoading={isLoading}
            onRegenerate={imageData ? handleRegenerate : undefined}
            onDownload={imageData ? handleDownload : undefined}
            onShare={imageData ? handleShare : undefined}
            showDownload={true}
            showShare={true}
          >
            {imageData ? (
              <div className="flex justify-center">
                <div className="relative rounded-lg overflow-hidden border">
                  <Image
                    src={imageData || "/placeholder.svg"}
                    alt={formData.prompt}
                    width={formData.width}
                    height={formData.height}
                    className="object-contain max-h-[500px] w-auto"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">Your generated image will appear here</div>
            )}
          </OutputContainer>
        </div>
      </main>
      <Footer />
    </div>
  )
}

