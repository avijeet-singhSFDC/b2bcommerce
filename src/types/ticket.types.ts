export type TicketType = 'equipment' | 'customer_service'
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export type EquipmentIssueType =
  | 'refrigeration_failure'
  | 'dispenser_malfunction'
  | 'cleaning'
  | 'preventive_maintenance'
  | 'other'

export type CustomerServiceCategory =
  | 'invoice_dispute'
  | 'missing_delivery'
  | 'damaged_goods'
  | 'order_change'
  | 'general_inquiry'

export interface TicketComment {
  id: string
  author: string
  authorRole: 'customer' | 'agent'
  content: string
  createdAt: string
}

export interface Ticket {
  id: string
  ticketNumber: string
  type: TicketType
  status: TicketStatus
  priority: TicketPriority
  subject: string
  description: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  accountId: string
  contactName: string
}

export interface EquipmentTicket extends Ticket {
  type: 'equipment'
  equipmentId: string
  equipmentType: string
  location: string
  issueType: EquipmentIssueType
  serialNumber?: string
}

export interface CustomerServiceTicket extends Ticket {
  type: 'customer_service'
  category: CustomerServiceCategory
  relatedOrderNumber?: string
}

export type AnyTicket = EquipmentTicket | CustomerServiceTicket

export type TicketDetail = AnyTicket & {
  comments: TicketComment[]
  attachments: TicketAttachment[]
}

export interface TicketAttachment {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  uploadedAt: string
}

export interface TicketListParams {
  type?: TicketType | 'all'
  status?: TicketStatus
  page?: number
  pageSize?: number
}

export interface TicketListResult {
  items: Ticket[]
  total: number
  page: number
  pageSize: number
}

export interface CreateEquipmentTicketPayload {
  type: 'equipment'
  subject: string
  description: string
  priority: TicketPriority
  equipmentId: string
  equipmentType: string
  location: string
  issueType: EquipmentIssueType
  serialNumber?: string
}

export interface CreateCustomerServiceTicketPayload {
  type: 'customer_service'
  subject: string
  description: string
  priority: TicketPriority
  category: CustomerServiceCategory
  relatedOrderNumber?: string
}

export type CreateTicketPayload =
  | CreateEquipmentTicketPayload
  | CreateCustomerServiceTicketPayload
