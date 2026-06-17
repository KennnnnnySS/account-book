import { create } from 'zustand'
import type { Record, Category, RecordFilters, MonthlySummary, CategoryStat, MonthlyTrend, CreateRecordDTO, UpdateRecordDTO, CreateCategoryDTO, UpdateCategoryDTO } from '@/types'

interface AccountState {
  // Data
  records: Record[]
  categories: Category[]
  monthlySummary: MonthlySummary | null
  categoryStats: CategoryStat[]
  monthlyTrend: MonthlyTrend[]

  // Loading states
  loading: boolean

  // Selected month
  selectedYear: number
  selectedMonth: number

  // Actions
  loadRecords: (filters?: RecordFilters) => Promise<void>
  createRecord: (data: CreateRecordDTO) => Promise<Record>
  updateRecord: (id: number, data: UpdateRecordDTO) => Promise<Record>
  removeRecord: (id: number) => Promise<void>
  loadCategories: (type?: 'income' | 'expense') => Promise<void>
  createCategory: (data: CreateCategoryDTO) => Promise<Category>
  updateCategory: (id: number, data: UpdateCategoryDTO) => Promise<Category>
  removeCategory: (id: number) => Promise<{ success: boolean; error?: string }>
  loadMonthlySummary: () => Promise<void>
  loadCategoryStats: (type: 'income' | 'expense') => Promise<void>
  loadMonthlyTrend: () => Promise<void>
  setMonth: (year: number, month: number) => void
  loadDashboard: () => Promise<void>
}

export const useAccountStore = create<AccountState>((set, get) => ({
  records: [],
  categories: [],
  monthlySummary: null,
  categoryStats: [],
  monthlyTrend: [],
  loading: false,
  selectedYear: new Date().getFullYear(),
  selectedMonth: new Date().getMonth() + 1,

  loadRecords: async (filters) => {
    set({ loading: true })
    try {
      const records = await window.api.getRecords(filters || {})
      set({ records })
    } finally {
      set({ loading: false })
    }
  },

  createRecord: async (data) => {
    const record = await window.api.createRecord(data)
    await get().loadRecords()
    await get().loadDashboard()
    return record
  },

  updateRecord: async (id, data) => {
    const record = await window.api.updateRecord(id, data)
    await get().loadRecords()
    await get().loadDashboard()
    return record
  },

  removeRecord: async (id) => {
    await window.api.deleteRecord(id)
    await get().loadRecords()
    await get().loadDashboard()
  },

  loadCategories: async (type) => {
    const categories = await window.api.getCategories(type)
    set({ categories })
  },

  createCategory: async (data) => {
    const cat = await window.api.createCategory(data)
    await get().loadCategories()
    return cat
  },

  updateCategory: async (id, data) => {
    const cat = await window.api.updateCategory(id, data)
    await get().loadCategories()
    return cat
  },

  removeCategory: async (id) => {
    const result = await window.api.deleteCategory(id)
    if (result.success) await get().loadCategories()
    return result
  },

  loadMonthlySummary: async () => {
    const { selectedYear, selectedMonth } = get()
    const summary = await window.api.getMonthlySummary(selectedYear, selectedMonth)
    set({ monthlySummary: summary })
  },

  loadCategoryStats: async (type) => {
    const { selectedYear, selectedMonth } = get()
    const stats = await window.api.getCategoryStats(selectedYear, selectedMonth, type)
    set({ categoryStats: stats })
  },

  loadMonthlyTrend: async () => {
    const { selectedYear } = get()
    const trend = await window.api.getMonthlyTrend(selectedYear)
    set({ monthlyTrend: trend })
  },

  setMonth: (year, month) => {
    set({ selectedYear: year, selectedMonth: month })
  },

  loadDashboard: async () => {
    const { selectedYear, selectedMonth } = get()
    const [summary, stats, trend] = await Promise.all([
      window.api.getMonthlySummary(selectedYear, selectedMonth),
      window.api.getCategoryStats(selectedYear, selectedMonth, 'expense'),
      window.api.getMonthlyTrend(selectedYear)
    ])
    set({ monthlySummary: summary, categoryStats: stats, monthlyTrend: trend })
  }
}))
