import { apiClient } from './client';
import { Company, ApiResponse } from './jobs';

export async function fetchCompanies(): Promise<Company[]> {
  const response = await apiClient.get<ApiResponse<Company[]>>('/companies');
  return response.data.data;
}

export async function fetchCompanyById(id: string): Promise<Company> {
  const response = await apiClient.get<ApiResponse<Company>>(`/companies/${id}`);
  return response.data.data;
}
