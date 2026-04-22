import { sfClient } from './client'
import type { TicketListParams, TicketListResult, TicketDetail, Ticket, CreateTicketPayload } from '../types/ticket.types'

export async function getTickets(params: TicketListParams): Promise<TicketListResult> {
  const { data } = await sfClient.get('/cases', { params })
  return data
}

export async function getTicket(ticketId: string): Promise<TicketDetail> {
  const { data } = await sfClient.get(`/cases/${ticketId}`)
  return data
}

export async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
  const { data } = await sfClient.post('/cases', payload)
  return data
}

export async function addTicketComment(ticketId: string, content: string): Promise<void> {
  await sfClient.post(`/cases/${ticketId}/comments`, { content })
}
