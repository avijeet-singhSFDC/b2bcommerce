import type { EquipmentTicket, CustomerServiceTicket, TicketDetail } from '../../../types/ticket.types'

export const MOCK_EQUIPMENT_TICKETS: EquipmentTicket[] = [
  {
    id: 't001', ticketNumber: 'EQ-2026-0041', type: 'equipment',
    status: 'open', priority: 'urgent',
    subject: 'Refrigerator unit not cooling - Aisle 3',
    description: 'The reach-in cooler in Aisle 3 has stopped maintaining temperature. Product is at risk. Need immediate service.',
    createdAt: '2026-04-20T09:00:00Z', updatedAt: '2026-04-20T09:00:00Z',
    accountId: 'acc001', contactName: 'John Smith',
    equipmentId: 'EQ-REF-2301', equipmentType: 'Reach-in Cooler',
    location: 'Aisle 3, North Wall', issueType: 'refrigeration_failure', serialNumber: 'SN-89234-A',
  },
  {
    id: 't002', ticketNumber: 'EQ-2026-0033', type: 'equipment',
    status: 'in_progress', priority: 'high',
    subject: 'Fountain dispenser inconsistent pour',
    description: 'The cola dispenser at counter 2 is dispensing too much syrup, making drinks too sweet.',
    createdAt: '2026-04-15T14:00:00Z', updatedAt: '2026-04-18T10:30:00Z',
    accountId: 'acc001', contactName: 'John Smith',
    equipmentId: 'EQ-DISP-1102', equipmentType: 'Fountain Dispenser',
    location: 'Front Counter 2', issueType: 'dispenser_malfunction', serialNumber: 'SN-45612-B',
  },
  {
    id: 't003', ticketNumber: 'EQ-2026-0019', type: 'equipment',
    status: 'resolved', priority: 'medium',
    subject: 'Scheduled preventive maintenance - All coolers',
    description: 'Annual PM for all 4 reach-in coolers and 2 walk-ins.',
    createdAt: '2026-03-01T09:00:00Z', updatedAt: '2026-03-10T16:00:00Z',
    resolvedAt: '2026-03-10T16:00:00Z',
    accountId: 'acc001', contactName: 'John Smith',
    equipmentId: 'EQ-ALL', equipmentType: 'Multiple',
    location: 'Entire Store', issueType: 'preventive_maintenance',
  },
]

export const MOCK_CS_TICKETS: CustomerServiceTicket[] = [
  {
    id: 't004', ticketNumber: 'CS-2026-0112', type: 'customer_service',
    status: 'open', priority: 'high',
    subject: 'Invoice discrepancy - Order FD-2026-0255',
    description: 'Invoice shows 15 cases of Flashy Cola but we only received 12. Please issue a credit note.',
    createdAt: '2026-04-19T11:00:00Z', updatedAt: '2026-04-19T11:00:00Z',
    accountId: 'acc001', contactName: 'Sarah Jones',
    category: 'invoice_dispute', relatedOrderNumber: 'FD-2026-0255',
  },
  {
    id: 't005', ticketNumber: 'CS-2026-0098', type: 'customer_service',
    status: 'in_progress', priority: 'medium',
    subject: 'Damaged goods in last delivery',
    description: '3 cases of Flashy Energy Burst arrived with crushed cans. Requesting replacement cases.',
    createdAt: '2026-04-10T13:30:00Z', updatedAt: '2026-04-14T09:00:00Z',
    accountId: 'acc001', contactName: 'Sarah Jones',
    category: 'damaged_goods', relatedOrderNumber: 'FD-2026-0389',
  },
  {
    id: 't006', ticketNumber: 'CS-2026-0078', type: 'customer_service',
    status: 'resolved', priority: 'low',
    subject: 'Question about payment terms extension',
    description: 'Requesting review of current Net 30 terms for potential upgrade to Net 60.',
    createdAt: '2026-03-20T10:00:00Z', updatedAt: '2026-04-02T14:00:00Z',
    resolvedAt: '2026-04-02T14:00:00Z',
    accountId: 'acc001', contactName: 'Sarah Jones',
    category: 'general_inquiry',
  },
]

export const MOCK_TICKET_DETAILS: Record<string, TicketDetail> = {
  t001: {
    ...MOCK_EQUIPMENT_TICKETS[0],
    comments: [
      { id: 'c001', author: 'John Smith', authorRole: 'customer', content: 'Temperature is now reading 58°F. Products will spoil if not addressed today.', createdAt: '2026-04-20T10:30:00Z' },
      { id: 'c002', author: 'Field Service Team', authorRole: 'agent', content: 'Ticket received. A technician is scheduled for tomorrow morning between 8-10am.', createdAt: '2026-04-20T11:00:00Z' },
    ],
    attachments: [
      { id: 'att001', fileName: 'cooler_temp_reading.jpg', fileUrl: '#', fileSize: 245000, uploadedAt: '2026-04-20T09:05:00Z' },
    ],
  },
  t004: {
    ...MOCK_CS_TICKETS[0],
    comments: [
      { id: 'c003', author: 'Sarah Jones', authorRole: 'customer', content: 'Attached is the delivery receipt showing only 12 cases signed off.', createdAt: '2026-04-19T11:30:00Z' },
      { id: 'c004', author: 'Customer Service', authorRole: 'agent', content: 'Thank you for reaching out. We are reviewing your invoice against the dispatch records. Will update within 2 business days.', createdAt: '2026-04-19T15:00:00Z' },
    ],
    attachments: [
      { id: 'att002', fileName: 'delivery_receipt_0255.pdf', fileUrl: '#', fileSize: 89000, uploadedAt: '2026-04-19T11:31:00Z' },
    ],
  },
}
