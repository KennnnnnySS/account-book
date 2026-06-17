import React, { useMemo } from 'react'
import { RecordCard } from './RecordCard'
import type { Record } from '@/types'

interface RecordListProps {
  records: Record[]
  onEdit: (record: Record) => void
  onDelete: (record: Record) => void
}

export function RecordList({ records, onEdit, onDelete }: RecordListProps) {
  // Group records by date
  const grouped = useMemo(() => {
    const groups: Record<string, Record[]> = {}
    records.forEach(r => {
      if (!groups[r.date]) groups[r.date] = []
      groups[r.date].push(r)
    })

    // Calculate daily subtotals and sort
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, items]) => {
        const income = items.filter(i => i.type === 'income').reduce((s, i) => s + i.amount, 0)
        const expense = items.filter(i => i.type === 'expense').reduce((s, i) => s + i.amount, 0)
        return { date, items, income, expense }
      })
  }, [records])

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
        <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
          <span className="text-3xl">📋</span>
        </div>
        <p className="text-sm">暂无记录</p>
        <p className="text-xs mt-1">点击右下角 + 按钮添加第一条记录</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {grouped.map(({ date, items, income, expense }) => (
        <div key={date}>
          {/* Date header */}
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-sm font-medium text-zinc-600">{date}</span>
            <div className="flex gap-3 text-xs tabular-nums">
              {income > 0 && <span className="text-green-600">收入 ¥{income.toFixed(2)}</span>}
              {expense > 0 && <span className="text-red-500">支出 ¥{expense.toFixed(2)}</span>}
            </div>
          </div>

          {/* Record cards */}
          <div className="space-y-1">
            {items.map(record => (
              <RecordCard
                key={record.id}
                record={record}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
