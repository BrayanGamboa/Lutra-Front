export interface CustomerDetailsInfoRequest {
  userId: string;
  documentTypeId?: number;
  documentNumber?: string;
  businessName?: string;
  billingAddress?: string;
  phone?: string;
  cityId?: number;
  taxRegimeId?: number;
  customerName?: string;
  customerDocument?: string;
}

export interface CustomerDetailsInfoResponse {
  customerDetailId: number;
  userId: string;
  documentTypeId?: number;
  documentNumber?: string;
  businessName?: string;
  billingAddress?: string;
  phone?: string;
  cityId?: number;
  taxRegimeId?: number;
  customerName?: string;
  customerDocument?: string;
  createdAt: string;
  updatedAt: string;
}
