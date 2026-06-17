import React, { useEffect } from 'react'
import { useAccountStore } from '@/stores/accountStore'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { TrendChart } from '@/components/dashboard/TrendChart'

export function DashboardPage() {
  const {
    monthlySummary,
    categoryStats,
    monthlyTrend,
    selectedYear,
    selectedMonth,
    loadDashboard,
    loadCategoryStats,
    loadMonthlyTrend,
    setMonth
  } = useAccountStore()

  useEffect(() => {
    loadDashboard()
  }, [selectedYear, selectedMonth]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCategoryToggle = (type: 'income' | 'expense') => {
    loadCategoryStats(type)
  }

  const handleYearChange = (year: number) => {
    setMonth(year, selectedMonth)
  }

  // Month navigation
  const prevMonth = () => {
    if (selectedMonth === 1) setMonth(selectedYear - 1, 12)
    else setMonth(selectedYear, selectedMonth - 1)
  }
  const nextMonth = () => {
    if (selectedMonth === 12) setMonth(selectedYear + 1, 1)
    else setMonth(selectedYear, selectedMonth + 1)
  }

  const monthLabel = `${selectedYear}年 ${selectedMonth}月`

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Month selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-zinc-800 w-32 text-center">{monthLabel}</h2>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Summary cards */}
      <SummaryCards summary={monthlySummary} />

      {/* Charts: side by side */}
      <div className="grid grid-cols-2 gap-4">
        <CategoryChart data={categoryStats} onToggleType={handleCategoryToggle} />
        <TrendChart data={monthlyTrend} year={selectedYear} onYearChange={handleYearChange} />
      </div>
    </div>
  )
}
