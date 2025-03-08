"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const tools = [
  { name: "PlanMaster", path: "/tools/planmaster" },
  { name: "CodeCraft", path: "/tools/codecraft" },
  { name: "WriteWise", path: "/tools/writewise" },
  { name: "ClarifAI", path: "/tools/clarifai" },
  { name: "ImaginAI", path: "/tools/imaginai" },
  { name: "DoubtSolver", path: "/tools/doubtsolver" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              AI Tools Suite
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.path}
                href={tool.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === tool.path ? "text-primary" : "text-muted-foreground",
                )}
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mr-2"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden container py-4 fade-in">
          <div className="flex flex-col space-y-4">
            {tools.map((tool) => (
              <Link
                key={tool.path}
                href={tool.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                  pathname === tool.path ? "bg-secondary text-primary" : "text-muted-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

