import React, { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { CategoryStat } from '@/types'

interface CategoryChartProps {
  data: CategoryStat[]
  onToggleType?: (type: 'income' | 'expense') => void
}

const RADIAN = Math.PI / 180

function renderCustomizedLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
  cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number
}) {
  if (percent < 0.05) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function CategoryChart({ data, onToggleType }: CategoryChartProps) {
  const [activeType, setActiveType] = useState<'income' | 'expense'>('expense')

  const handleToggle = (t: 'income' | 'expense') => {
    setActiveType(t)
    onToggleType?.(t)
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-100 shadow-win-sm p-5">
        <h3 className="text-sm font-semibold text-zinc-700 mb-4">分类统计</h3>
        <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
          <p className="text-sm">本月暂无{activeType === 'expense' ? '支出' : '收入'}数据</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-100 shadow-win-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-700">分类占比</h3>
        <div className="flex gap-1 bg-zinc-100 rounded-lg p-0.5">
          {(['expense', 'income'] as const).map(t => (
            <button
              key={t}
              onClick={() => handleToggle(t)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all
                ${activeType === t ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              {t === 'expense' ? '支出' : '收入'}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={55}
            label={renderCustomizedLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`¥${value.toFixed(2)}`, '金额']}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e4e4e7',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: 13
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => <span className="text-xs text-zinc-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
