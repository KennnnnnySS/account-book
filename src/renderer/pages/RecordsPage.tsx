import React, { useEffect, useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { useAccountStore } from '@/stores/accountStore'
import { RecordList } from '@/components/records/RecordList'
import { RecordForm } from '@/components/records/RecordForm'
import { RecordFilter } from '@/components/records/RecordFilter'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { Record, RecordFilters, CreateRecordDTO, UpdateRecordDTO } from '@/types'

export function RecordsPage() {
  const { records, categories, loading, loadRecords, loadCategories, createRecord, updateRecord, removeRecord } =
    useAccountStore()

  const [filters, setFilters] = useState<RecordFilters>({ type: 'all' })
  const [formOpen, setFormOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<Record | null>(null)
  const [deletingRecord, setDeletingRecord] = useState<Record | null>(null)

  // Load initial data
  useEffect(() => {
    loadRecords(filters)
    loadCategories()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Reload when filters change
  useEffect(() => {
    loadRecords(filters)
  }, [filters]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = () => {
    setEditingRecord(null)
    setFormOpen(true)
  }

  const handleEdit = (record: Record) => {
    setEditingRecord(record)
    setFormOpen(true)
  }

  const handleDelete = (record: Record) => {
    setDeletingRecord(record)
  }

  const handleSubmit = useCallback(async (data: CreateRecordDTO | UpdateRecordDTO) => {
    if (editingRecord) {
      await updateRecord(editingRecord.id, data as UpdateRecordDTO)
    } else {
      await createRecord(data as CreateRecordDTO)
    }
  }, [editingRecord, createRecord, updateRecord])

  const handleConfirmDelete = async () => {
    if (deletingRecord) {
      await removeRecord(deletingRecord.id)
      setDeletingRecord(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-800">收支记录</h2>
        <span className="text-xs text-zinc-400">{records.length} 条记录</span>
      </div>

      {/* Filters */}
      <RecordFilter filters={filters} onChange={setFilters} categories={categories} />

      {/* Record list */}
      <RecordList records={records} onEdit={handleEdit} onDelete={handleDelete} />

      {/* FAB button */}
      <button
        onClick={handleCreate}
        className="fixed right-8 bottom-8 w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-win-lg
          flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition-all duration-150
          z-30"
      >
        <Plus size={24} />
      </button>

      {/* Form dialog */}
      <RecordForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        editRecord={editingRecord}
        categories={categories}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deletingRecord}
        onClose={() => setDeletingRecord(null)}
        onConfirm={handleConfirmDelete}
        title="删除记录"
        message={`确定要删除 "${deletingRecord?.category_name}" 这条记录吗？金额 ¥${deletingRecord?.amount.toFixed(2)}，此操作不可撤销。`}
        confirmText="删除"
        variant="danger"
      />
    </div>
  )
}
