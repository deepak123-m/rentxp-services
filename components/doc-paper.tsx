import type React from "react"
import { cn } from "@/lib/utils"

interface DocPaperProps {
  children: React.ReactNode
  className?: string
}

export function DocPaper({ children, className }: DocPaperProps) {
  return <div className={cn("bg-white rounded-lg shadow-md p-6 mb-6", className)}>{children}</div>
}
