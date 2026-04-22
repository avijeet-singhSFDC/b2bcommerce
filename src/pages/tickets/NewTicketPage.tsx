import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { createTicket } from '../../api/tickets.api'
import { useUiStore } from '../../store/uiStore'
import type { TicketType, TicketPriority, EquipmentIssueType, CustomerServiceCategory } from '../../types/ticket.types'
import { ArrowLeft, Wrench, Headphones } from 'lucide-react'

export function NewTicketPage() {
  const navigate = useNavigate()
  const { pushToast } = useUiStore()
  const [type, setType] = useState<TicketType>('equipment')
  const [form, setForm] = useState({
    subject: '', description: '', priority: 'medium' as TicketPriority,
    equipmentId: '', equipmentType: '', location: '', issueType: 'refrigeration_failure' as EquipmentIssueType, serialNumber: '',
    category: 'invoice_dispute' as CustomerServiceCategory, relatedOrderNumber: '',
  })

  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: (ticket) => {
      pushToast('Ticket submitted successfully')
      navigate(`/tickets/${ticket.id}`)
    },
    onError: () => pushToast('Failed to submit ticket', 'error'),
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (type === 'equipment') {
      mutation.mutate({ type: 'equipment', subject: form.subject, description: form.description, priority: form.priority, equipmentId: form.equipmentId, equipmentType: form.equipmentType, location: form.location, issueType: form.issueType, serialNumber: form.serialNumber || undefined })
    } else {
      mutation.mutate({ type: 'customer_service', subject: form.subject, description: form.description, priority: form.priority, category: form.category, relatedOrderNumber: form.relatedOrderNumber || undefined })
    }
  }

  function field(key: keyof typeof form) {
    return { value: form[key], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(f => ({ ...f, [key]: e.target.value })) }
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">New Support Ticket</h1>
      <p className="text-gray-500 text-sm mb-6">Choose the type of support you need and fill in the details below.</p>

      {/* Type selector */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {([
          { id: 'equipment', label: 'Equipment Service', desc: 'Cooler, dispenser, or other equipment issues', icon: Wrench },
          { id: 'customer_service', label: 'Customer Service', desc: 'Invoicing, orders, delivery issues', icon: Headphones },
        ] as const).map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setType(t.id)}
            className={`p-4 rounded-xl border-2 text-left transition-colors ${type === t.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
          >
            <t.icon size={20} className={type === t.id ? 'text-brand-600 mb-2' : 'text-gray-400 mb-2'} />
            <div className={`font-semibold text-sm ${type === t.id ? 'text-brand-700' : 'text-gray-900'}`}>{t.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
          <input {...field('subject')} required placeholder="Brief description of the issue" className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
          <select {...field('priority')} className={inputClass}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {type === 'equipment' ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Equipment ID *</label>
                <input {...field('equipmentId')} required placeholder="e.g. EQ-REF-2301" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Equipment Type *</label>
                <input {...field('equipmentType')} required placeholder="e.g. Reach-in Cooler" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label>
              <input {...field('location')} required placeholder="e.g. Aisle 3, North Wall" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Issue Type *</label>
              <select {...field('issueType')} className={inputClass}>
                <option value="refrigeration_failure">Refrigeration Failure</option>
                <option value="dispenser_malfunction">Dispenser Malfunction</option>
                <option value="cleaning">Cleaning Required</option>
                <option value="preventive_maintenance">Preventive Maintenance</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Serial Number</label>
              <input {...field('serialNumber')} placeholder="Optional" className={inputClass} />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Issue Category *</label>
              <select {...field('category')} className={inputClass}>
                <option value="invoice_dispute">Invoice Dispute</option>
                <option value="missing_delivery">Missing Delivery</option>
                <option value="damaged_goods">Damaged Goods</option>
                <option value="order_change">Order Change</option>
                <option value="general_inquiry">General Inquiry</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Related Order Number</label>
              <input {...field('relatedOrderNumber')} placeholder="e.g. FD-2026-0421 (optional)" className={inputClass} />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
          <textarea {...field('description') as any} required rows={4} placeholder="Describe the issue in detail..." className={inputClass + ' resize-none'} />
        </div>

        <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
          {mutation.isPending ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  )
}
