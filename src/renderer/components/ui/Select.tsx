import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string | number
  label: string
  icon?: string
  color?: string
}

interface SelectProps {
  options: SelectOption[]
  value?: string | number
  onChange: (value: string | number) => void
  placeholder?: string
  label?: string
  error?: string
  className?: string
}

export function Select({ options, value, onChange, placeholder = '请选择', label, error, className = '' }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selected = options.find(o => o.value === value)

  return (
    <div className="w-full" ref={ref}>
      {label && <label className="block text-sm font-medium text-zinc-700 mb-1.5">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white border rounded-lg py-2 px-3 text-sm
          transition-colors outline-none
          ${error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-zinc-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
          }
          ${className}`}
      >
        {selected ? (
          <span className="flex items-center gap-2">
            {selected.icon && <span>{selected.icon}</span>}
            {selected.color && (
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selected.color }} />
            )}
            <span className="text-zinc-900">{selected.label}</span>
          </span>
        ) : (
          <span className="text-zinc-400">{placeholder}</span>
        )}
        <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-[inherit] max-h-60 overflow-auto bg-white border border-zinc-200 rounded-lg shadow-win-md py-1">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-50 transition-colors
                ${opt.value === value ? 'bg-indigo-50 text-indigo-700' : 'text-zinc-700'}`}
              onClick={() => {
                onChange(opt.value)
                setIsOpen(false)
              }}
            >
              {opt.color && (
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.color }} />
              )}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
