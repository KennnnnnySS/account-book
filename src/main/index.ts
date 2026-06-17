import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import {
  initDatabase,
  closeDatabase,
  queryRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  queryCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getMonthlySummary,
  getCategoryStats,
  getMonthlyTrend
} from './database'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    show: false,
    backgroundColor: '#f3f3f3',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Window control IPC handlers
  ipcMain.handle('minimize-window', () => mainWindow.minimize())
  ipcMain.handle('maximize-window', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })
  ipcMain.handle('close-window', () => mainWindow.close())
  ipcMain.handle('is-maximized', () => mainWindow.isMaximized())

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Register all IPC handlers
function registerIpcHandlers(): void {
  // Records
  ipcMain.handle('get-records', (_e, filters) => queryRecords(filters))
  ipcMain.handle('get-record-by-id', (_e, id: number) => getRecordById(id))
  ipcMain.handle('create-record', (_e, data) => createRecord(data))
  ipcMain.handle('update-record', (_e, id: number, data) => updateRecord(id, data))
  ipcMain.handle('delete-record', (_e, id: number) => { deleteRecord(id) })

  // Categories
  ipcMain.handle('get-categories', (_e, type?: string) => queryCategories(type))
  ipcMain.handle('create-category', (_e, data) => createCategory(data))
  ipcMain.handle('update-category', (_e, id: number, data) => updateCategory(id, data))
  ipcMain.handle('delete-category', (_e, id: number) => deleteCategory(id))

  // Stats
  ipcMain.handle('get-monthly-summary', (_e, year: number, month: number) => getMonthlySummary(year, month))
  ipcMain.handle('get-category-stats', (_e, year: number, month: number, type: string) =>
    getCategoryStats(year, month, type)
  )
  ipcMain.handle('get-monthly-trend', (_e, year: number) => getMonthlyTrend(year))
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.ledger.app')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await initDatabase()
  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  closeDatabase()
  app.quit()
})
