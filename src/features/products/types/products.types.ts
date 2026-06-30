export interface ProductRequest {
  name: string;
  description: string;
  sku: string;
  price: number;
  cost?: number;
  supplierId?: number;
  categoryId?: number;
  isActive: boolean;
}

export interface ProductResponse {
  productId: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  cost?: number;
  supplierId?: number;
  categoryId?: number;
  isActive: boolean;
}
