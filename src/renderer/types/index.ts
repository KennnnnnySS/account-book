// ========== Category Types ==========
export interface Category {
  id: number
  name: string
  icon: string
  type: 'income' | 'expense'
  color: string
  created_at: string
}

export interface CreateCategoryDTO {
  name: string
  icon?: string
  type: 'income' | 'expense'
  color?: string
}

export interface UpdateCategoryDTO {
  name?: string
  icon?: string
  color?: string
}

// ========== Record Types ==========
export interface Record {
  id: number
  type: 'income' | 'expense'
  amount: number
  category_id: number
  category_name?: string
  category_icon?: string
  category_color?: string
  note: string
  date: string
  created_at: string
}

export interface CreateRecordDTO {
  type: 'income' | 'expense'
  amount: number
  category_id: number
  note?: string
  date: string
}

export interface UpdateRecordDTO {
  type?: 'income' | 'expense'
  amount?: number
  category_id?: number
  note?: string
  date?: string
}

export interface RecordFilters {
  type?: 'income' | 'expense' | 'all'
  categoryId?: number
  startDate?: string
  endDate?: string
  keyword?: string
}

// ========== Stats Types ==========
export interface MonthlySummary {
  totalIncome: number
  totalExpense: number
  balance: number
}

export interface CategoryStat {
  categoryId: number
  name: string
  icon: string
  color: string
  total: number
  percentage: number
}

export interface MonthlyTrend {
  month: string
  income: number
  expense: number
}

// ========== IPC API ==========
export interface LedgerAPI {
  // Records
  getRecords(filters?: RecordFilters): Promise<Record[]>
  getRecordById(id: number): Promise<Record | undefined>
  createRecord(data: CreateRecordDTO): Promise<Record>
  updateRecord(id: number, data: UpdateRecordDTO): Promise<Record>
  deleteRecord(id: number): Promise<void>

  // Categories
  getCategories(type?: 'income' | 'expense'): Promise<Category[]>
  createCategory(data: CreateCategoryDTO): Promise<Category>
  updateCategory(id: number, data: UpdateCategoryDTO): Promise<Category>
  deleteCategory(id: number): Promise<{ success: boolean; error?: string }>

  // Stats
  getMonthlySummary(year: number, month: number): Promise<MonthlySummary>
  getCategoryStats(year: number, month: number, type: 'income' | 'expense'): Promise<CategoryStat[]>
  getMonthlyTrend(year: number): Promise<MonthlyTrend[]>

  // Window controls
  minimizeWindow(): void
  maximizeWindow(): void
  closeWindow(): void
  isMaximized(): Promise<boolean>
}
