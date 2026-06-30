export interface CountryRequest {
  name: string;
}

export interface CountryResponse {
  countryId: number;
  name: string;
  createdAt: string;
}

export interface DepartmentRequest {
  name: string;
  countryId: number;
}

export interface DepartmentResponse {
  departmentId: number;
  name: string;
  countryId: number;
  createdAt: string;
}

export interface CityRequest {
  name: string;
  departmentId: number;
}

export interface CityResponse {
  cityId: number;
  name: string;
  departmentId: number;
  createdAt: string;
}

export interface DocumentTypeRequest {
  name: string;
}

export interface DocumentTypeResponse {
  documentTypeId: number;
  name: string;
  createdAt: string;
}

export interface MethodPaymentRequest {
  name: string;
}

export interface MethodPaymentResponse {
  paymentMethodId: number;
  name: string;
  createdAt: string;
}

export interface TaxRegimeRequest {
  name: string;
  description: string;
}

export interface TaxRegimeResponse {
  taxRegimeId: number;
  name: string;
  description: string;
  createdAt: string;
}
