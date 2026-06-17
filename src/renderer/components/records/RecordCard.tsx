import React from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import type { Record } from '@/types'

interface RecordCardProps {
  record: Record
  onEdit: (record: Record) => void
  onDelete: (record: Record) => void
}

export function RecordCard({ record, onEdit, onDelete }: RecordCardProps) {
  const isIncome = record.type === 'income'

  return (
    <div className="group flex items-center gap-4 px-4 py-3 bg-white rounded-lg border border-zinc-100
      hover:border-zinc-200 hover:shadow-win-sm transition-all duration-150">
      {/* Category icon/color */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg flex-shrink-0"
        style={{ backgroundColor: record.category_color || '#6366f1' }}
      >
        {record.category_name?.charAt(0) || '?'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-800">{record.category_name}</span>
          {record.note && (
            <span className="text-xs text-zinc-400 truncate max-w-[200px]">— {record.note}</span>
          )}
        </div>
        <span className="text-xs text-zinc-400">{record.date}</span>
      </div>

      {/* Amount */}
      <span className={`text-sm font-semibold tabular-nums ${isIncome ? 'text-green-600' : 'text-red-500'}`}>
        {isIncome ? '+' : '-'}¥{record.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(record)}
          className="p-1.5 rounded-md text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          title="编辑"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(record)}
          className="p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="删除"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
