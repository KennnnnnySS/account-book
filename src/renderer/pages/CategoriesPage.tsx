import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useAccountStore } from '@/stores/accountStore'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '@/types'

const PRESET_COLORS = ['#f97316', '#ef4444', '#ec4899', '#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#22c55e', '#eab308', '#6b7280']

export function CategoriesPage() {
  const { categories, loadCategories, createCategory, updateCategory, removeCategory } = useAccountStore()

  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [deleteError, setDeleteError] = useState('')

  // Form state
  const [formType, setFormType] = useState<'income' | 'expense'>('expense')
  const [formName, setFormName] = useState('')
  const [formIcon, setFormIcon] = useState('')
  const [formColor, setFormColor] = useState(PRESET_COLORS[0])

  useEffect(() => {
    loadCategories()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const incomeCategories = categories.filter(c => c.type === 'income')
  const expenseCategories = categories.filter(c => c.type === 'expense')

  const openCreate = (type: 'income' | 'expense') => {
    setEditingCategory(null)
    setFormType(type)
    setFormName('')
    setFormIcon('')
    setFormColor(PRESET_COLORS[0])
    setFormOpen(true)
  }

  const openEdit = (cat: Category) => {
    setEditingCategory(cat)
    setFormType(cat.type)
    setFormName(cat.name)
    setFormIcon(cat.icon)
    setFormColor(cat.color)
    setFormOpen(true)
  }

  const handleSubmit = async () => {
    if (!formName.trim()) return
    const data: CreateCategoryDTO | UpdateCategoryDTO = {
      name: formName.trim(),
      icon: formIcon || undefined,
      color: formColor
    }
    if (editingCategory) {
      await updateCategory(editingCategory.id, data as UpdateCategoryDTO)
    } else {
      await createCategory({ ...data, type: formType } as CreateCategoryDTO)
    }
    setFormOpen(false)
  }

  const handleDelete = async () => {
    if (!deletingCategory) return
    const result = await removeCategory(deletingCategory.id)
    if (!result.success) {
      setDeleteError(result.error || '删除失败')
    } else {
      setDeletingCategory(null)
      setDeleteError('')
    }
  }

  const CategoryGroup = ({ title, items, type }: { title: string; items: Category[]; type: 'income' | 'expense' }) => (
    <div className="bg-white rounded-xl border border-zinc-100 shadow-win-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100">
        <h3 className="text-sm font-semibold text-zinc-700">{title}</h3>
        <button
          onClick={() => openCreate(type)}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          <Plus size={14} /> 新增
        </button>
      </div>
      <div className="divide-y divide-zinc-50">
        {items.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-zinc-400">暂无分类</div>
        ) : (
          items.map(cat => (
            <div key={cat.id} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-50/50 transition-colors group">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              >
                {cat.name.charAt(0)}
              </div>
              <span className="flex-1 text-sm text-zinc-700">{cat.name}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => { setDeletingCategory(cat); setDeleteError('') }}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-lg font-semibold text-zinc-800">分类管理</h2>

      <div className="grid grid-cols-2 gap-6">
        <CategoryGroup title="支出分类" items={expenseCategories} type="expense" />
        <CategoryGroup title="收入分类" items={incomeCategories} type="income" />
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} title={editingCategory ? '编辑分类' : '新增分类'}>
        <div className="space-y-4">
          <Input
            label="分类名称"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="如：餐饮、交通..."
          />

          <Input
            label="Emoji 图标（可选）"
            value={formIcon}
            onChange={(e) => setFormIcon(e.target.value)}
            placeholder="如：🍔、🚗..."
            maxLength={2}
          />

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">颜色</label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setFormColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${formColor === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setFormOpen(false)}>取消</Button>
            <Button onClick={handleSubmit} disabled={!formName.trim()}>
              {editingCategory ? '保存修改' : '添加分类'}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deletingCategory}
        onClose={() => { setDeletingCategory(null); setDeleteError('') }}
        onConfirm={handleDelete}
        title="删除分类"
        message={
          deleteError
            ? deleteError
            : `确定要删除分类 "${deletingCategory?.name}" 吗？`
        }
        confirmText={deleteError ? '知道了' : '删除'}
        variant={deleteError ? 'primary' : 'danger'}
      />
    </div>
  )
}
