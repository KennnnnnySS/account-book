import React, { useState, useEffect } from 'react'
import { Minus, Square, X, Copy } from 'lucide-react'

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    window.api.isMaximized().then(setIsMaximized)
  }, [])

  return (
    <div className="titlebar-drag fixed top-0 left-0 right-0 h-8 bg-white/80 backdrop-blur-md border-b border-zinc-200
      flex items-center justify-between z-50 select-none">
      {/* Left: App icon + title */}
      <div className="flex items-center gap-2 pl-3">
        <div className="w-5 h-5 bg-indigo-600 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs font-bold">¥</span>
        </div>
        <span className="text-xs font-medium text-zinc-700">记账本</span>
      </div>

      {/* Right: Window controls */}
      <div className="flex items-center h-full titlebar-no-drag">
        <button
          onClick={() => window.api.minimizeWindow()}
          className="h-8 w-11 flex items-center justify-center hover:bg-zinc-100 transition-colors"
        >
          <Minus size={14} className="text-zinc-500" />
        </button>
        <button
          onClick={() => {
            window.api.maximizeWindow()
            setIsMaximized(!isMaximized)
          }}
          className="h-8 w-11 flex items-center justify-center hover:bg-zinc-100 transition-colors"
        >
          {isMaximized ? (
            <Copy size={12} className="text-zinc-500" />
          ) : (
            <Square size={12} className="text-zinc-500" />
          )}
        </button>
        <button
          onClick={() => window.api.closeWindow()}
          className="h-8 w-11 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
        >
          <X size={14} className="text-zinc-500" />
        </button>
      </div>
    </div>
  )
}
