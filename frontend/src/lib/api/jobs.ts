import { apiClient } from './client';

export interface JobSalary {
  min: number;
  max: number;
  currency: string;
  period?: string;
  formatted?: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  logoBg?: string;
  logoColor?: string;
  logoType?: 'icon' | 'triangle' | 'mountain' | 'letter' | 'fintech';
  logoLetter?: string;
  location: string;
  website?: string;
  industry?: string;
  size?: string;
  description?: string;
}

export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  location: string;
  workArrangement: 'Remote' | 'Hybrid' | 'On-site';
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salary: JobSalary;
  category: string;
  experienceLevel: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  tags: string[];
  postedAt: string;
  postedTime: string;
  featured?: boolean;
  company?: Company;
}

export interface JobFilters {
  q?: string;
  location?: string;
  employmentType?: string;
  workArrangement?: string;
  category?: string;
  experienceLevel?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

export async function fetchJobs(filters?: JobFilters): Promise<{ jobs: Job[]; pagination?: ApiResponse<Job[]>['pagination'] }> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'all') {
        params.append(key, String(val));
      }
    });
  }

  const response = await apiClient.get<ApiResponse<Job[]>>(`/jobs?${params.toString()}`);
  return {
    jobs: response.data.data,
    pagination: response.data.pagination,
  };
}

export async function fetchFeaturedJobs(): Promise<Job[]> {
  const response = await apiClient.get<ApiResponse<Job[]>>('/jobs/featured');
  return response.data.data;
}

export async function fetchJobById(id: string): Promise<Job> {
  const response = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
  return response.data.data;
}

export async function searchJobsApi(query: string, location?: string): Promise<Job[]> {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (location) params.append('location', location);
  
  const response = await apiClient.get<ApiResponse<Job[]>>(`/jobs/search?${params.toString()}`);
  return response.data.data;
}
