import type React from "react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  language?: string
  children: React.ReactNode
  className?: string
}

export function CodeBlock({ language, children, className }: CodeBlockProps) {
  return (
    <div className="relative">
      {language && <div className="absolute top-2 right-2 text-xs text-slate-400 font-mono">{language}</div>}
      <pre className={cn("p-4 rounded-lg overflow-x-auto bg-slate-800 text-slate-50", className)}>
        <code>{children}</code>
      </pre>
    </div>
  )
}
