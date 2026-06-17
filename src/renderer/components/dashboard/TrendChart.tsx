import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { MonthlyTrend } from '@/types'

interface TrendChartProps {
  data: MonthlyTrend[]
  year: number
  onYearChange: (year: number) => void
}

export function TrendChart({ data, year, onYearChange }: TrendChartProps) {
  const hasData = data.some(d => d.income > 0 || d.expense > 0)

  return (
    <div className="bg-white rounded-xl border border-zinc-100 shadow-win-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-700">月度趋势</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onYearChange(year - 1)}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="text-sm font-medium text-zinc-700 w-14 text-center">{year}</span>
          <button
            onClick={() => onYearChange(year + 1)}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
          <p className="text-sm">{year} 年暂无数据</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} barSize={20} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#71717a' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#71717a' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value: number) => [`¥${value.toFixed(2)}`, '']}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #e4e4e7',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: 13
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="rect"
              iconSize={10}
              formatter={(value: string) => (
                <span className="text-xs text-zinc-600">{value === 'income' ? '收入' : '支出'}</span>
              )}
            />
            <Bar dataKey="income" name="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
