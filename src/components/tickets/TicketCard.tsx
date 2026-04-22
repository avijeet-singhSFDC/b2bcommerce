import { Link } from 'react-router-dom'
import type { Ticket } from '../../types/ticket.types'
import { formatRelativeDate } from '../../utils/date'
import { TicketStatusBadge, TicketPriorityBadge } from './TicketStatusBadge'
import { Wrench, Headphones } from 'lucide-react'

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <Link to={`/tickets/${ticket.id}`} className="card p-4 flex flex-col gap-3 hover:shadow-md transition-shadow block">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ticket.type === 'equipment' ? 'bg-orange-100' : 'bg-blue-100'}`}>
            {ticket.type === 'equipment'
              ? <Wrench size={16} className="text-orange-600" />
              : <Headphones size={16} className="text-blue-600" />
            }
          </div>
          <div>
            <p className="text-xs text-gray-400 font-mono">{ticket.ticketNumber}</p>
            <p className="text-sm font-semibold text-gray-900 leading-tight">{ticket.subject}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <TicketStatusBadge status={ticket.status} />
          <TicketPriorityBadge priority={ticket.priority} />
        </div>
      </div>
      <p className="text-sm text-gray-500 line-clamp-2">{ticket.description}</p>
      <div className="text-xs text-gray-400">Opened {formatRelativeDate(ticket.createdAt)}</div>
    </Link>
  )
}
