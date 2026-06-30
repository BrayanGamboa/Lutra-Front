export interface CategoryRequest {
  name: string;
  description: string;
}

export interface CategoryResponse {
  categoryId: number;
  name: string;
  description: string;
}

export interface SupplierRequest {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
}

export interface SupplierResponse {
  supplierId: number;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
}

export interface ReferencesTypeRequest {
  name: string;
  description: string;
}

export interface ReferencesTypeResponse {
  referencesTypeId: number;
  name: string;
  description: string;
}

export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export interface InventoryMovementRequest {
  productId: number;
  quantity: number;
  movementType: MovementType;
  referenceId: number;
}

export interface InventoryMovementResponse {
  movementId: number;
  productId: number;
  quantity: number;
  movementType: MovementType;
  referenceId: number;
  createdAt: string;
}
