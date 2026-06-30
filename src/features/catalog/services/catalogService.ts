import { axiosClient } from '@/shared/lib/axiosClient';
import type {
  CityRequest,
  CityResponse,
  CountryRequest,
  CountryResponse,
  DepartmentRequest,
  DepartmentResponse,
  DocumentTypeRequest,
  DocumentTypeResponse,
  MethodPaymentRequest,
  MethodPaymentResponse,
  TaxRegimeRequest,
  TaxRegimeResponse,
} from '@/features/catalog/types/catalog.types';

export const getCountries = async (): Promise<CountryResponse[]> => {
  const response = await axiosClient.get<CountryResponse[]>('catalog/countries');
  return response.data;
};

export const createCountry = async (
  payload: CountryRequest,
): Promise<CountryResponse> => {
  const response = await axiosClient.post<CountryResponse>('catalog/countries', payload);
  return response.data;
};

export const updateCountry = async (
  id: number,
  payload: CountryRequest,
): Promise<CountryResponse> => {
  const response = await axiosClient.put<CountryResponse>(`catalog/countries/${id}`, payload);
  return response.data;
};

export const deleteCountry = async (id: number): Promise<void> => {
  await axiosClient.delete(`catalog/countries/${id}`);
};

export const getDepartments = async (): Promise<DepartmentResponse[]> => {
  const response = await axiosClient.get<DepartmentResponse[]>('catalog/departments');
  return response.data;
};

export const getDepartmentsByCountry = async (
  countryId: number,
): Promise<DepartmentResponse[]> => {
  const response = await axiosClient.get<DepartmentResponse[]>(
    `catalog/departments/by-country/${countryId}`,
  );
  return response.data;
};

export const createDepartment = async (
  payload: DepartmentRequest,
): Promise<DepartmentResponse> => {
  const response = await axiosClient.post<DepartmentResponse>('catalog/departments', payload);
  return response.data;
};

export const updateDepartment = async (
  id: number,
  payload: DepartmentRequest,
): Promise<DepartmentResponse> => {
  const response = await axiosClient.put<DepartmentResponse>(
    `catalog/departments/${id}`,
    payload,
  );
  return response.data;
};

export const deleteDepartment = async (id: number): Promise<void> => {
  await axiosClient.delete(`catalog/departments/${id}`);
};

export const getCities = async (): Promise<CityResponse[]> => {
  const response = await axiosClient.get<CityResponse[]>('catalog/cities');
  return response.data;
};

export const getCitiesByDepartment = async (
  departmentId: number,
): Promise<CityResponse[]> => {
  const response = await axiosClient.get<CityResponse[]>(
    `catalog/cities/by-department/${departmentId}`,
  );
  return response.data;
};

export const createCity = async (payload: CityRequest): Promise<CityResponse> => {
  const response = await axiosClient.post<CityResponse>('catalog/cities', payload);
  return response.data;
};

export const updateCity = async (
  id: number,
  payload: CityRequest,
): Promise<CityResponse> => {
  const response = await axiosClient.put<CityResponse>(`catalog/cities/${id}`, payload);
  return response.data;
};

export const deleteCity = async (id: number): Promise<void> => {
  await axiosClient.delete(`catalog/cities/${id}`);
};

export const getDocumentTypes = async (): Promise<DocumentTypeResponse[]> => {
  const response = await axiosClient.get<DocumentTypeResponse[]>('catalog/document-types');
  return response.data;
};

export const createDocumentType = async (
  payload: DocumentTypeRequest,
): Promise<DocumentTypeResponse> => {
  const response = await axiosClient.post<DocumentTypeResponse>(
    'catalog/document-types',
    payload,
  );
  return response.data;
};

export const updateDocumentType = async (
  id: number,
  payload: DocumentTypeRequest,
): Promise<DocumentTypeResponse> => {
  const response = await axiosClient.put<DocumentTypeResponse>(
    `catalog/document-types/${id}`,
    payload,
  );
  return response.data;
};

export const deleteDocumentType = async (id: number): Promise<void> => {
  await axiosClient.delete(`catalog/document-types/${id}`);
};

export const getPaymentMethods = async (): Promise<MethodPaymentResponse[]> => {
  const response = await axiosClient.get<MethodPaymentResponse[]>('catalog/payment-methods');
  return response.data;
};

export const createPaymentMethod = async (
  payload: MethodPaymentRequest,
): Promise<MethodPaymentResponse> => {
  const response = await axiosClient.post<MethodPaymentResponse>(
    'catalog/payment-methods',
    payload,
  );
  return response.data;
};

export const updatePaymentMethod = async (
  id: number,
  payload: MethodPaymentRequest,
): Promise<MethodPaymentResponse> => {
  const response = await axiosClient.put<MethodPaymentResponse>(
    `catalog/payment-methods/${id}`,
    payload,
  );
  return response.data;
};

export const deletePaymentMethod = async (id: number): Promise<void> => {
  await axiosClient.delete(`catalog/payment-methods/${id}`);
};

export const getTaxRegimes = async (): Promise<TaxRegimeResponse[]> => {
  const response = await axiosClient.get<TaxRegimeResponse[]>('catalog/tax-regimes');
  return response.data;
};

export const createTaxRegime = async (
  payload: TaxRegimeRequest,
): Promise<TaxRegimeResponse> => {
  const response = await axiosClient.post<TaxRegimeResponse>('catalog/tax-regimes', payload);
  return response.data;
};

export const updateTaxRegime = async (
  id: number,
  payload: TaxRegimeRequest,
): Promise<TaxRegimeResponse> => {
  const response = await axiosClient.put<TaxRegimeResponse>(
    `catalog/tax-regimes/${id}`,
    payload,
  );
  return response.data;
};

export const deleteTaxRegime = async (id: number): Promise<void> => {
  await axiosClient.delete(`catalog/tax-regimes/${id}`);
};
