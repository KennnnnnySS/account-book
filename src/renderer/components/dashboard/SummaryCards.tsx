import React from 'react'
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react'
import type { MonthlySummary } from '@/types'

interface SummaryCardsProps {
  summary: MonthlySummary | null
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      label: '本月收入',
      amount: summary?.totalIncome ?? 0,
      icon: <ArrowUpRight size={20} className="text-green-500" />,
      bg: 'bg-green-50',
      color: 'text-green-700',
      subColor: 'text-green-600'
    },
    {
      label: '本月支出',
      amount: summary?.totalExpense ?? 0,
      icon: <ArrowDownRight size={20} className="text-red-500" />,
      bg: 'bg-red-50',
      color: 'text-red-700',
      subColor: 'text-red-600'
    },
    {
      label: '本月结余',
      amount: summary?.balance ?? 0,
      icon: <Wallet size={20} className="text-indigo-500" />,
      bg: 'bg-indigo-50',
      color: 'text-indigo-700',
      subColor: 'text-indigo-600'
    }
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map(card => (
        <div key={card.label} className="bg-white rounded-xl border border-zinc-100 shadow-win-sm p-5
          hover:shadow-win-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-zinc-500 font-medium">{card.label}</span>
            <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
              {card.icon}
            </div>
          </div>
          <p className={`text-2xl font-bold tabular-nums ${card.subColor}`}>
            ¥{card.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
          </p>
        </div>
      ))}
    </div>
  )
}
