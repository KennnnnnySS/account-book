import { app } from 'electron'
import { join } from 'path'
import * as fs from 'fs'

// Dynamically require sql.js in main process
let initSqlJs: any
let SQL: any
let db: any = null

function getDbPath(): string {
  const userDataPath = app.getPath('userData')
  return join(userDataPath, 'ledger.db')
}

function loadDb(): Uint8Array | null {
  const dbPath = getDbPath()
  if (fs.existsSync(dbPath)) {
    return fs.readFileSync(dbPath)
  }
  return null
}

function saveDb(): void {
  if (!db) return
  const data = db.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(getDbPath(), buffer)
}

// Helper: execute a SELECT query and return array of objects
function queryAll(sql: string, params: any[] = []): any[] {
  if (!db) return []
  // Replace ? placeholders with actual values for sql.js
  let idx = 0
  const resolved = sql.replace(/\?/g, () => {
    const val = params[idx++]
    if (val === undefined || val === null) return 'NULL'
    if (typeof val === 'number') return String(val)
    return `'${String(val).replace(/'/g, "''")}'`
  })
  try {
    const results = db.exec(resolved)
    if (!results || results.length === 0) return []
    const { columns, values } = results[0]
    return values.map((row: any[]) => {
      const obj: any = {}
      columns.forEach((col: string, i: number) => {
        obj[col] = row[i]
      })
      return obj
    })
  } catch (e) {
    console.error('SQL query error:', e, 'SQL:', resolved)
    return []
  }
}

// Helper: execute a single-row SELECT query
function queryOne(sql: string, params: any[] = []): any | undefined {
  const results = queryAll(sql, params)
  return results.length > 0 ? results[0] : undefined
}

// Helper: execute INSERT/UPDATE/DELETE
function execute(sql: string, params: any[] = []): number {
  if (!db) return 0
  let idx = 0
  const resolved = sql.replace(/\?/g, () => {
    const val = params[idx++]
    if (val === undefined || val === null) return 'NULL'
    if (typeof val === 'number') return String(val)
    return `'${String(val).replace(/'/g, "''")}'`
  })
  try {
    db.run(resolved)
    // Get last insert rowid
    const lastId = queryOne('SELECT last_insert_rowid() as id')
    saveDb()
    return lastId ? lastId.id : 0
  } catch (e) {
    console.error('SQL exec error:', e, 'SQL:', resolved)
    return 0
  }
}

export async function initDatabase(): Promise<void> {
  // Dynamic import for sql.js in Electron main process
  initSqlJs = require('sql.js')
  SQL = await initSqlJs()
  const saved = loadDb()
  db = new SQL.Database(saved)
  db.run('PRAGMA foreign_keys = ON')

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      icon        TEXT DEFAULT 'wallet',
      type        TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      color       TEXT DEFAULT '#6366f1',
      created_at  TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS records (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      type        TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      amount      REAL NOT NULL CHECK(amount > 0),
      category_id INTEGER REFERENCES categories(id),
      note        TEXT DEFAULT '',
      date        TEXT NOT NULL,
      created_at  TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `)
  // Create indexes (ignore errors if already exist)
  try { db.run('CREATE INDEX IF NOT EXISTS idx_records_date ON records(date)') } catch (e) {}
  try { db.run('CREATE INDEX IF NOT EXISTS idx_records_type ON records(type)') } catch (e) {}
  try { db.run('CREATE INDEX IF NOT EXISTS idx_records_category ON records(category_id)') } catch (e) {}

  saveDb()

  // Seed default categories if empty
  const count = queryOne('SELECT COUNT(*) as count FROM categories')
  if (count && count.count === 0) {
    seedDefaultCategories()
  }
}

function seedDefaultCategories(): void {
  const incomeCategories = [
    ['工资', 'briefcase', 'income', '#22c55e'],
    ['奖金', 'star', 'income', '#16a34a'],
    ['兼职', 'clock', 'income', '#4ade80'],
    ['投资', 'trending-up', 'income', '#15803d'],
    ['其他收入', 'plus-circle', 'income', '#86efac']
  ]
  const expenseCategories = [
    ['餐饮', 'utensils', 'expense', '#f97316'],
    ['交通', 'car', 'expense', '#eab308'],
    ['购物', 'shopping-bag', 'expense', '#ef4444'],
    ['住房', 'home', 'expense', '#8b5cf6'],
    ['娱乐', 'gamepad-2', 'expense', '#ec4899'],
    ['医疗', 'heart-pulse', 'expense', '#06b6d4'],
    ['教育', 'book-open', 'expense', '#3b82f6'],
    ['通讯', 'phone', 'expense', '#6366f1'],
    ['其他支出', 'minus-circle', 'expense', '#6b7280']
  ]
  const all = [...incomeCategories, ...expenseCategories]
  for (const cat of all) {
    execute('INSERT INTO categories (name, icon, type, color) VALUES (?, ?, ?, ?)', cat)
  }
}

// ========== Record CRUD ==========

export function queryRecords(filters?: {
  type?: string
  categoryId?: number
  startDate?: string
  endDate?: string
  keyword?: string
}) {
  let sql = `
    SELECT r.*, c.name as category_name, c.icon as category_icon, c.color as category_color
    FROM records r
    LEFT JOIN categories c ON r.category_id = c.id
    WHERE 1=1
  `
  const params: any[] = []

  if (filters?.type && filters.type !== 'all') {
    sql += ' AND r.type = ?'
    params.push(filters.type)
  }
  if (filters?.categoryId) {
    sql += ' AND r.category_id = ?'
    params.push(filters.categoryId)
  }
  if (filters?.startDate) {
    sql += ' AND r.date >= ?'
    params.push(filters.startDate)
  }
  if (filters?.endDate) {
    sql += ' AND r.date <= ?'
    params.push(filters.endDate)
  }
  if (filters?.keyword) {
    sql += " AND r.note LIKE '%' || ? || '%'"
    params.push(filters.keyword)
  }

  sql += ' ORDER BY r.date DESC, r.created_at DESC'

  return queryAll(sql, params)
}

export function getRecordById(id: number) {
  return queryOne(`
    SELECT r.*, c.name as category_name, c.icon as category_icon, c.color as category_color
    FROM records r
    LEFT JOIN categories c ON r.category_id = c.id
    WHERE r.id = ?
  `, [id])
}

export function createRecord(data: {
  type: string
  amount: number
  category_id: number
  note?: string
  date: string
}) {
  execute(
    'INSERT INTO records (type, amount, category_id, note, date) VALUES (?, ?, ?, ?, ?)',
    [data.type, data.amount, data.category_id, data.note || '', data.date]
  )
  const lastId = queryOne('SELECT last_insert_rowid() as id')
  return lastId ? getRecordById(lastId.id) : undefined
}

export function updateRecord(id: number, data: {
  type?: string
  amount?: number
  category_id?: number
  note?: string
  date?: string
}) {
  const record = getRecordById(id)
  if (!record) return undefined

  const updated = {
    type: data.type ?? record.type,
    amount: data.amount ?? record.amount,
    category_id: data.category_id ?? record.category_id,
    note: data.note !== undefined ? data.note : record.note,
    date: data.date ?? record.date
  }

  execute(
    'UPDATE records SET type=?, amount=?, category_id=?, note=?, date=? WHERE id=?',
    [updated.type, updated.amount, updated.category_id, updated.note, updated.date, id]
  )
  return getRecordById(id)
}

export function deleteRecord(id: number): void {
  execute('DELETE FROM records WHERE id = ?', [id])
}

// ========== Category CRUD ==========

export function queryCategories(type?: string) {
  if (type) {
    return queryAll('SELECT * FROM categories WHERE type = ? ORDER BY id ASC', [type])
  }
  return queryAll('SELECT * FROM categories ORDER BY type DESC, id ASC')
}

export function getCategoryById(id: number) {
  return queryOne('SELECT * FROM categories WHERE id = ?', [id])
}

export function createCategory(data: { name: string; icon?: string; type: string; color?: string }) {
  execute(
    'INSERT INTO categories (name, icon, type, color) VALUES (?, ?, ?, ?)',
    [data.name, data.icon || 'wallet', data.type, data.color || '#6366f1']
  )
  const lastId = queryOne('SELECT last_insert_rowid() as id')
  return lastId ? getCategoryById(lastId.id) : undefined
}

export function updateCategory(id: number, data: { name?: string; icon?: string; color?: string }) {
  const cat = getCategoryById(id)
  if (!cat) return undefined

  const updated = {
    name: data.name ?? cat.name,
    icon: data.icon ?? cat.icon,
    color: data.color ?? cat.color
  }

  execute('UPDATE categories SET name=?, icon=?, color=? WHERE id=?',
    [updated.name, updated.icon, updated.color, id])
  return getCategoryById(id)
}

export function deleteCategory(id: number): { success: boolean; error?: string } {
  const refCount = queryOne('SELECT COUNT(*) as count FROM records WHERE category_id = ?', [id])
  if (refCount && refCount.count > 0) {
    return { success: false, error: `该分类下有 ${refCount.count} 条记录，无法删除` }
  }

  execute('DELETE FROM categories WHERE id = ?', [id])
  return { success: true }
}

// ========== Statistics ==========

export function getMonthlySummary(year: number, month: number): { totalIncome: number; totalExpense: number; balance: number } {
  const prefix = `${year}-${String(month).padStart(2, '0')}`

  const income = queryOne(
    "SELECT COALESCE(SUM(amount), 0) as total FROM records WHERE type = 'income' AND date LIKE ?",
    [`${prefix}%`]
  )
  const expense = queryOne(
    "SELECT COALESCE(SUM(amount), 0) as total FROM records WHERE type = 'expense' AND date LIKE ?",
    [`${prefix}%`]
  )

  const totalIncome = income ? income.total : 0
  const totalExpense = expense ? expense.total : 0

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense
  }
}

export function getCategoryStats(year: number, month: number, type: string) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`

  const stats = queryAll(`
    SELECT c.id as categoryId, c.name, c.icon, c.color,
           COALESCE(SUM(r.amount), 0) as total
    FROM categories c
    LEFT JOIN records r ON c.id = r.category_id AND r.date LIKE ?
    WHERE c.type = ?
    GROUP BY c.id
    ORDER BY total DESC
  `, [`${prefix}%`, type])

  const grandTotal = stats.reduce((sum: number, s: any) => sum + s.total, 0)

  return stats.map((s: any) => ({
    ...s,
    percentage: grandTotal > 0 ? Math.round((s.total / grandTotal) * 1000) / 10 : 0
  }))
}

export function getMonthlyTrend(year: number) {
  const trends: Array<{ month: string; income: number; expense: number }> = []

  for (let m = 1; m <= 12; m++) {
    const prefix = `${year}-${String(m).padStart(2, '0')}`

    const income = queryOne(
      "SELECT COALESCE(SUM(amount), 0) as total FROM records WHERE type = 'income' AND date LIKE ?",
      [`${prefix}%`]
    )
    const expense = queryOne(
      "SELECT COALESCE(SUM(amount), 0) as total FROM records WHERE type = 'expense' AND date LIKE ?",
      [`${prefix}%`]
    )

    trends.push({
      month: `${m}月`,
      income: income ? income.total : 0,
      expense: expense ? expense.total : 0
    })
  }

  return trends
}

export function closeDatabase(): void {
  if (db) {
    saveDb()
    db.close()
    db = null
  }
}
