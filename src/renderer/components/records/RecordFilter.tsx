import React from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { Category, RecordFilters } from '@/types'

interface RecordFilterProps {
  filters: RecordFilters
  onChange: (filters: RecordFilters) => void
  categories: Category[]
}

export function RecordFilter({ filters, onChange, categories }: RecordFilterProps) {
  const hasFilters = filters.type !== 'all' || filters.categoryId || filters.startDate || filters.endDate || filters.keyword

  const clearFilters = () => {
    onChange({ type: 'all' })
  }

  const updateFilter = (key: keyof RecordFilters, value: unknown) => {
    onChange({ ...filters, [key]: value })
  }

  // Filter categories by selected type
  const displayedCategories = filters.type && filters.type !== 'all'
    ? categories.filter(c => c.type === filters.type)
    : categories

  return (
    <div className="space-y-3">
      {/* Top row: search + type filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={filters.keyword || ''}
            onChange={(e) => updateFilter('keyword', e.target.value || undefined)}
            placeholder="搜索备注..."
            className="w-full pl-9 pr-8 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none
              focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors
              placeholder:text-zinc-400"
          />
          {filters.keyword && (
            <button
              onClick={() => updateFilter('keyword', undefined)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-zinc-400 hover:text-zinc-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-1 bg-zinc-100 rounded-lg p-0.5">
          {(['all', 'expense', 'income'] as const).map(t => (
            <button
              key={t}
              onClick={() => updateFilter('type', t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all
                ${filters.type === t || (!filters.type && t === 'all')
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
                }`}
            >
              {t === 'all' ? '全部' : t === 'expense' ? '支出' : '收入'}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom row: advanced filters */}
      <div className="flex items-center gap-3">
        <Select
          value={filters.categoryId || ''}
          onChange={(v) => updateFilter('categoryId', v || undefined)}
          placeholder="所有分类"
          options={displayedCategories.map(c => ({
            value: c.id,
            label: c.name,
            color: c.color
          }))}
          className="w-36"
        />

        <input
          type="date"
          value={filters.startDate || ''}
          onChange={(e) => updateFilter('startDate', e.target.value || undefined)}
          className="bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors w-36"
          placeholder="开始日期"
        />
        <span className="text-zinc-300 text-sm">—</span>
        <input
          type="date"
          value={filters.endDate || ''}
          onChange={(e) => updateFilter('endDate', e.target.value || undefined)}
          className="bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors w-36"
          placeholder="结束日期"
        />

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-zinc-500">
            <X size={14} />
            清除筛选
          </Button>
        )}
      </div>
    </div>
  )
}
