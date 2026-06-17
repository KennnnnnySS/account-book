import { contextBridge, ipcRenderer } from 'electron'

const api = {
  // Records
  getRecords: (filters?: unknown) => ipcRenderer.invoke('get-records', filters),
  getRecordById: (id: number) => ipcRenderer.invoke('get-record-by-id', id),
  createRecord: (data: unknown) => ipcRenderer.invoke('create-record', data),
  updateRecord: (id: number, data: unknown) => ipcRenderer.invoke('update-record', id, data),
  deleteRecord: (id: number) => ipcRenderer.invoke('delete-record', id),

  // Categories
  getCategories: (type?: string) => ipcRenderer.invoke('get-categories', type),
  createCategory: (data: unknown) => ipcRenderer.invoke('create-category', data),
  updateCategory: (id: number, data: unknown) => ipcRenderer.invoke('update-category', id, data),
  deleteCategory: (id: number) => ipcRenderer.invoke('delete-category', id),

  // Stats
  getMonthlySummary: (year: number, month: number) => ipcRenderer.invoke('get-monthly-summary', year, month),
  getCategoryStats: (year: number, month: number, type: string) =>
    ipcRenderer.invoke('get-category-stats', year, month, type),
  getMonthlyTrend: (year: number) => ipcRenderer.invoke('get-monthly-trend', year),

  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  isMaximized: () => ipcRenderer.invoke('is-maximized')
}

contextBridge.exposeInMainWorld('api', api)
