export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'cancelled';

export interface Invoice {
  id: string;
  number: string;
  clientName: string;
  total: number;
  status: InvoiceStatus;
  createdAt: string;
}

export interface CreateInvoicePayload {
  number: string;
  clientName: string;
  total: number;
  status: InvoiceStatus;
}
