import React, { useState, useEffect, useCallback } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { DatePicker } from '@/components/ui/DatePicker'
import type { Record, Category, CreateRecordDTO, UpdateRecordDTO } from '@/types'
import { format } from 'date-fns'

interface RecordFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateRecordDTO | UpdateRecordDTO) => Promise<void>
  editRecord?: Record | null
  categories: Category[]
}

export function RecordForm({ open, onClose, onSubmit, editRecord, categories }: RecordFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const isEdit = !!editRecord

  const resetForm = useCallback(() => {
    if (editRecord) {
      setType(editRecord.type)
      setAmount(String(editRecord.amount))
      setCategoryId(editRecord.category_id)
      setDate(editRecord.date)
      setNote(editRecord.note || '')
    } else {
      setType('expense')
      setAmount('')
      setCategoryId('')
      setDate(format(new Date(), 'yyyy-MM-dd'))
      setNote('')
    }
  }, [editRecord])

  useEffect(() => {
    resetForm()
  }, [editRecord, open]) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredCategories = categories.filter(c => c.type === type)

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) return
    if (categoryId === '') return
    if (!date) return

    setSaving(true)
    try {
      await onSubmit({
        type,
        amount: parseFloat(amount),
        category_id: categoryId as number,
        date,
        note: note.trim() || undefined
      } as CreateRecordDTO)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const isValid = amount && parseFloat(amount) > 0 && categoryId !== '' && date

  return (
    <Dialog open={open} onClose={onClose} title={isEdit ? '编辑记录' : '新增记录'}>
      <div className="space-y-4">
        {/* Type toggle */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">类型</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setType('expense'); setCategoryId('') }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all
                ${type === 'expense'
                  ? 'bg-red-50 text-red-600 border-2 border-red-300'
                  : 'bg-zinc-50 text-zinc-500 border-2 border-transparent hover:border-zinc-300'
                }`}
            >
              支出
            </button>
            <button
              type="button"
              onClick={() => { setType('income'); setCategoryId('') }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all
                ${type === 'income'
                  ? 'bg-green-50 text-green-600 border-2 border-green-300'
                  : 'bg-zinc-50 text-zinc-500 border-2 border-transparent hover:border-zinc-300'
                }`}
            >
              收入
            </button>
          </div>
        </div>

        {/* Amount */}
        <Input
          label="金额"
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          prefix="¥"
        />

        {/* Category */}
        <Select
          label="分类"
          value={categoryId}
          onChange={(v) => setCategoryId(v as number)}
          placeholder="选择分类"
          options={filteredCategories.map(c => ({
            value: c.id,
            label: c.name,
            color: c.color
          }))}
        />

        {/* Date */}
        <DatePicker
          label="日期"
          value={date}
          onChange={setDate}
        />

        {/* Note */}
        <Input
          label="备注"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="添加备注（可选）"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>取消</Button>
          <Button onClick={handleSubmit} disabled={!isValid || saving}>
            {saving ? '保存中...' : isEdit ? '保存修改' : '添加记录'}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
