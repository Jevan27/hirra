import { apiClient } from './client';
import { ApiResponse } from './jobs';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  jobCount: number;
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
  return response.data.data;
}
