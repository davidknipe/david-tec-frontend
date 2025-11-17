'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { useTheme } from './ThemeProvider'

interface CodeBlockProps {
  code: string
  language: string
  filename?: string
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const { theme } = useTheme()

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-6">
      {filename && (
        <div className="glass-strong rounded-t-xl px-4 py-2 text-sm font-mono text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
          {filename}
        </div>
      )}
      <div className="relative">
        <button
          onClick={copyToClipboard}
          className="absolute right-4 top-4 p-2 rounded-lg glass-strong opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/90 dark:hover:bg-gray-800/90"
          aria-label="Copy code"
        >
          {copied ? (
            <Check size={16} className="text-green-500" />
          ) : (
            <Copy size={16} />
          )}
        </button>
        <SyntaxHighlighter
          language={language}
          style={theme === 'dark' ? vscDarkPlus : oneLight}
          customStyle={{
            margin: 0,
            borderRadius: filename ? '0 0 12px 12px' : '12px',
            padding: '1.5rem',
          }}
          showLineNumbers
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
