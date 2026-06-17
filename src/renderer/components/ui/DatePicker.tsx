import React from 'react'
import { Calendar } from 'lucide-react'

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
}

export function DatePicker({ value, onChange, label, error }: DatePickerProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-zinc-700 mb-1.5">{label}</label>}
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-white border text-sm rounded-lg py-2 pl-3 pr-10 outline-none transition-colors
            ${error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-zinc-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
            }`}
        />
        <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
