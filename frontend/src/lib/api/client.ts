import axios from 'axios';
import { API_BASE_URL } from '../constants';

export interface ExtendedApiError extends Error {
  status?: number;
  retryAfter?: number;
  isRateLimited?: boolean;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for unified response extraction & friendly error enhancement
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const retryAfter = data?.retryAfter || (error.response?.headers?.['retry-after'] ? parseInt(error.response.headers['retry-after'], 10) : undefined);

    let message = data?.message || error.message || 'An unexpected error occurred';
    
    // User-friendly rate-limit message
    if (status === 429) {
      message = "You're searching a little too quickly. Please try again in a moment.";
    }

    const customError = new Error(message) as ExtendedApiError;
    customError.status = status;
    customError.retryAfter = retryAfter;
    customError.isRateLimited = status === 429;

    return Promise.reject(customError);
  }
);
