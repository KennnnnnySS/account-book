import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  prefix?: string
}

export function Input({ label, error, prefix, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">{label}</label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm select-none">
            {prefix}
          </span>
        )}
        <input
          className={`w-full bg-white border text-sm rounded-lg py-2 outline-none transition-colors
            ${prefix ? 'pl-10 pr-3' : 'px-3'}
            ${error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-zinc-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
            }
            placeholder:text-zinc-400
            disabled:bg-zinc-50 disabled:text-zinc-500
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
