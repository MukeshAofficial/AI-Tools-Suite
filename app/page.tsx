import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ToolCard } from "@/components/tool-card"
import { Button } from "@/components/ui/button"
import { Calendar, Code2, FileText, Search, Image, HelpCircle, ArrowRight, Sparkles } from "lucide-react"

export default function Home() {
  const tools = [
    {
      title: "PlanMaster",
      description: "AI-driven project planning tool that generates timelines and tasks",
      icon: <Calendar className="h-6 w-6" />,
      href: "/tools/planmaster",
    },
    {
      title: "CodeCraft",
      description: "AI-assisted coding tool that generates code snippets with explanations",
      icon: <Code2 className="h-6 w-6" />,
      href: "/tools/codecraft",
    },
    {
      title: "WriteWise",
      description: "AI-assisted writing tool with control over style, tone, and creativity",
      icon: <FileText className="h-6 w-6" />,
      href: "/tools/writewise",
    },
    {
      title: "ClarifAI",
      description: "Transparent language model with reasoning and source attribution",
      icon: <Search className="h-6 w-6" />,
      href: "/tools/clarifai",
    },
    {
      title: "ImaginAI",
      description: "Open alternative to proprietary AI image generators with explainable processes",
      icon: <Image className="h-6 w-6" />,
      href: "/tools/imaginai",
    },
    {
      title: "DoubtSolver",
      description: "AI-powered tool for solving educational doubts with customizable explanations",
      icon: <HelpCircle className="h-6 w-6" />,
      href: "/tools/doubtsolver",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background z-0"></div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6 slide-up">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>Powered by Advanced AI Models</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Unlock Your Potential with{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  AI-Powered Tools
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                A suite of powerful AI tools designed to enhance your productivity, creativity, and problem-solving
                capabilities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="#tools">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Tools
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#about">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Grid Section */}
        <section id="tools" className="py-16 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our AI Tools</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our collection of AI-powered tools designed to help you with planning, coding, writing, and
                more.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.title}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  href={tool.href}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="about" className="py-16 bg-secondary/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Our AI Tools</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our AI tools are designed with transparency, control, and user experience in mind.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Advanced AI Models</h3>
                <p className="text-muted-foreground">
                  Powered by state-of-the-art AI models to deliver accurate and high-quality results.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Transparency</h3>
                <p className="text-muted-foreground">
                  Our tools provide explanations and reasoning behind their outputs for better understanding.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <ArrowRight className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">User Control</h3>
                <p className="text-muted-foreground">
                  Customize parameters and settings to get exactly the results you need.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/10">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold">Ready to Boost Your Productivity?</h2>
              <p className="text-muted-foreground">
                Start using our AI tools today and experience the power of artificial intelligence.
              </p>
              <div className="pt-4">
                <Link href="#tools">
                  <Button size="lg">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

