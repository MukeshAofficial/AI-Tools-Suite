import { cn } from "@/lib/utils"

interface LoadingDotsProps {
  className?: string
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("loading-dots", className)}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}

