import type { TicketStatus, TicketPriority } from '../../types/ticket.types'

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'In Progress', className: 'bg-amber-100 text-amber-700' },
  resolved: { label: 'Resolved', className: 'bg-green-100 text-green-700' },
  closed: { label: 'Closed', className: 'bg-gray-100 text-gray-600' },
}

const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-gray-100 text-gray-600' },
  medium: { label: 'Medium', className: 'bg-blue-100 text-blue-600' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'Urgent', className: 'bg-red-100 text-red-700' },
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const { label, className } = statusConfig[status]
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}>{label}</span>
}

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  const { label, className } = priorityConfig[priority]
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}>{label}</span>
}
