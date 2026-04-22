import { useState, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTicket, addTicketComment } from '../../api/tickets.api'
import { TicketStatusBadge, TicketPriorityBadge } from '../../components/tickets/TicketStatusBadge'
import { formatDate } from '../../utils/date'
import { PageSpinner } from '../../components/ui/Spinner'
import { ArrowLeft, Send, Wrench, Headphones, Paperclip } from 'lucide-react'
import { useUiStore } from '../../store/uiStore'

export function TicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>()
  const navigate = useNavigate()
  const { pushToast } = useUiStore()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')

  const { data: ticketData, isLoading } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => getTicket(ticketId!),
    enabled: !!ticketId,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ticket = ticketData as any

  const commentMutation = useMutation({
    mutationFn: (content: string) => addTicketComment(ticketId!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] })
      setComment('')
      pushToast('Comment added')
    },
  })

  function handleComment(e: FormEvent) {
    e.preventDefault()
    if (comment.trim()) commentMutation.mutate(comment.trim())
  }

  if (isLoading) return <PageSpinner />
  if (!ticketData) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">Ticket not found.</div>

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} /> Back to Tickets
      </button>

      {/* Header */}
      <div className="card p-5">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ticket.type === 'equipment' ? 'bg-orange-100' : 'bg-blue-100'}`}>
            {ticket.type === 'equipment' ? <Wrench size={18} className="text-orange-600" /> : <Headphones size={18} className="text-blue-600" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 font-mono">{ticket.ticketNumber}</span>
              <TicketStatusBadge status={ticket.status} />
              <TicketPriorityBadge priority={ticket.priority} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mt-1">{ticket.subject}</h1>
            <p className="text-sm text-gray-500 mt-1">Opened {formatDate(ticket.createdAt)} by {ticket.contactName}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4 leading-relaxed">{ticket.description}</p>

        {'equipmentId' in ticket && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-orange-50 rounded-xl text-sm">
            <div><span className="text-gray-500">Equipment ID</span><p className="font-medium">{ticket.equipmentId}</p></div>
            <div><span className="text-gray-500">Type</span><p className="font-medium">{ticket.equipmentType}</p></div>
            <div><span className="text-gray-500">Location</span><p className="font-medium">{ticket.location}</p></div>
          </div>
        )}

        {'category' in ticket && ticket.relatedOrderNumber && (
          <div className="mt-4 p-3 bg-blue-50 rounded-xl text-sm">
            <span className="text-gray-500">Related Order:</span> <span className="font-medium">{ticket.relatedOrderNumber}</span>
          </div>
        )}

        {ticket.attachments?.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5"><Paperclip size={14} /> Attachments</p>
            <div className="flex flex-wrap gap-2">
              {ticket.attachments.map((att: { id: string; fileUrl: string; fileName: string }) => (
                <a key={att.id} href={att.fileUrl} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors">
                  <Paperclip size={13} /> {att.fileName}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Activity</h2>
        </div>
        {ticket.comments.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">No comments yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {ticket.comments.map((c: { id: string; authorRole: string; author: string; content: string; createdAt: string }) => (
              <div key={c.id} className={`px-5 py-4 ${c.authorRole === 'agent' ? 'bg-blue-50' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${c.authorRole === 'agent' ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                      {c.author.charAt(0)}
                    </div>
                    <span className="font-medium text-sm text-gray-900">{c.author}</span>
                    {c.authorRole === 'agent' && <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">Agent</span>}
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
              </div>
            ))}
          </div>
        )}

        {ticket.status !== 'closed' && ticket.status !== 'resolved' && (
          <form onSubmit={handleComment} className="px-5 py-4 border-t border-gray-100 flex gap-3">
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button type="submit" disabled={!comment.trim() || commentMutation.isPending} className="btn-primary flex items-center gap-2 text-sm px-4">
              <Send size={15} />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
