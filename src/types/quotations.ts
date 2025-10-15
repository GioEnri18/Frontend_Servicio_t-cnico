
// Defínelo como valor en runtime (no solo tipo)
export const QuotationStatus = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
} as const;

export type QuotationStatus = (typeof QuotationStatus)[keyof typeof QuotationStatus];


export type Quotation = {
  id: string;
  quotationNumber: string;
  notes?: string;
  location?: string;
  requiredDate?: string;
  photos?: string[];
  subtotal: number;
  tax: number;
  total: number;
  status: QuotationStatus;
  validUntil?: string;
  terms?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
  customer?: { id: string; firstName: string; lastName: string; email: string; company?: string; };
  createdBy: { id: string; firstName: string; lastName: string; email: string; };
  items: QuotationItem[];
};

export type QuotationItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};
