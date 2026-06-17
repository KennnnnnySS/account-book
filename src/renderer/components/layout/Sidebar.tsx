import React from 'react'
import { LayoutDashboard, Receipt, Tags } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: '仪表盘', icon: <LayoutDashboard size={20} /> },
  { id: 'records', label: '记录', icon: <Receipt size={20} /> },
  { id: 'categories', label: '分类', icon: <Tags size={20} /> }
]

interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <div className="fixed left-0 top-8 bottom-0 w-[68px] bg-white/70 backdrop-blur-md border-r border-zinc-200
      flex flex-col items-center pt-4 gap-1 z-40">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg transition-all duration-150
            ${activePage === item.id
              ? 'bg-indigo-50 text-indigo-600 scale-105'
              : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50'
            }`}
          title={item.label}
        >
          {item.icon}
          <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  )
}
