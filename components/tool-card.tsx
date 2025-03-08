import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  className?: string
}

export function ToolCard({ title, description, icon, href, className }: ToolCardProps) {
  return (
    <Card className={cn("tool-card overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="mb-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button className="w-full">Try Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
