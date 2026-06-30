export interface SaleRequest {
  customerId: string;
  totalAmount: number;
  paymentMethodId?: number;
}

export interface SaleResponse {
  saleId: string;
  customerId: string;
  totalAmount: number;
  paymentMethodId?: number;
  saleDate?: string;
  status?: string;
  createdAt?: string;
}

export interface SaleStatusPatchRequest {
  status: string;
}

export interface SaleDetailRequest {
  saleId: string;
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface SaleDetailResponse {
  saleDetailId: number;
  saleId: string;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
  createdAt?: string;
}
