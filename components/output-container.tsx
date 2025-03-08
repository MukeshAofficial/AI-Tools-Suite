"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2, Copy, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/loading-spinner"

interface OutputContainerProps {
  title: string
  isLoading: boolean
  children: React.ReactNode
  onRegenerate?: () => void
  onCopy?: () => void
  onDownload?: () => void
  onShare?: () => void
  showDownload?: boolean
  showShare?: boolean
  className?: string
}

export function OutputContainer({
  title,
  isLoading,
  children,
  onRegenerate,
  onCopy,
  onDownload,
  onShare,
  showDownload = false,
  showShare = false,
  className,
}: OutputContainerProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <Button variant="outline" size="icon" onClick={onRegenerate} disabled={isLoading} title="Regenerate">
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          {onCopy && (
            <Button variant="outline" size="icon" onClick={onCopy} disabled={isLoading} title="Copy to clipboard">
              <Copy className="h-4 w-4" />
            </Button>
          )}
          {showDownload && onDownload && (
            <Button variant="outline" size="icon" onClick={onDownload} disabled={isLoading} title="Download">
              <Download className="h-4 w-4" />
            </Button>
          )}
          {showShare && onShare && (
            <Button variant="outline" size="icon" onClick={onShare} disabled={isLoading} title="Share">
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="fade-in">{children}</div>
        )}
      </CardContent>
    </Card>
  )
}

