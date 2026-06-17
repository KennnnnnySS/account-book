import React, { useState, useEffect, useCallback } from 'react'
import { TitleBar } from '@/components/layout/TitleBar'
import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardPage } from '@/pages/DashboardPage'
import { RecordsPage } from '@/pages/RecordsPage'
import { CategoriesPage } from '@/pages/CategoriesPage'

export function App() {
  const [activePage, setActivePage] = useState('dashboard')

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl+1/2/3: switch pages
    if (e.ctrlKey && !e.altKey && !e.metaKey) {
      switch (e.key) {
        case '1':
          e.preventDefault()
          setActivePage('dashboard')
          break
        case '2':
          e.preventDefault()
          setActivePage('records')
          break
        case '3':
          e.preventDefault()
          setActivePage('categories')
          break
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage key="dashboard" />
      case 'records':
        return <RecordsPage key="records" />
      case 'categories':
        return <CategoriesPage key="categories" />
      default:
        return <DashboardPage key="dashboard" />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-[#f3f3f3]">
      <TitleBar />
      <div className="flex flex-1 pt-8">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <main className="flex-1 ml-[68px] p-6 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
