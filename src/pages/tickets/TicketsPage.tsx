import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getTickets } from '../../api/tickets.api'
import type { TicketType } from '../../types/ticket.types'
import { TicketCard } from '../../components/tickets/TicketCard'
import { PageSpinner } from '../../components/ui/Spinner'
import { Wrench, Headphones, Plus } from 'lucide-react'

type TabType = 'all' | TicketType

const TABS: { id: TabType; label: string; icon: typeof Wrench }[] = [
  { id: 'all', label: 'All Tickets', icon: Headphones },
  { id: 'equipment', label: 'Equipment Service', icon: Wrench },
  { id: 'customer_service', label: 'Customer Service', icon: Headphones },
]

export function TicketsPage() {
  const [tab, setTab] = useState<TabType>('all')

  const { data, isLoading } = useQuery({
    queryKey: ['tickets', tab],
    queryFn: () => getTickets({ type: tab }),
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage equipment service and customer support requests</p>
        </div>
        <Link to="/tickets/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> New Ticket
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 overflow-x-auto scrollbar-hide">
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-1 justify-center ${tab === t.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Icon size={15} />
              {t.label}
            </button>
          )
        })}
      </div>

      {isLoading ? <PageSpinner /> : (
        !data || data.items.length === 0 ? (
          <div className="card p-16 text-center">
            <Headphones size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="font-medium text-gray-700">No tickets found</p>
            <Link to="/tickets/new" className="btn-primary mt-4 inline-flex items-center gap-2 text-sm">
              <Plus size={16} /> Create a Ticket
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {data.items.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
          </div>
        )
      )}
    </div>
  )
}
