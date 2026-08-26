import { apiClient } from './client';
import { ApiResponse } from './jobs';

export interface LocationSuggestion {
  id: string;
  place_name: string;
  text: string;
  center?: [number, number] | null;
  context?: string;
  isRemote?: boolean;
}

/**
 * Fetch location suggestions from backend Mapbox proxy
 */
export async function fetchLocationSuggestions(
  query: string,
  signal?: AbortSignal
): Promise<LocationSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const response = await apiClient.get<ApiResponse<LocationSuggestion[]>>(
    `/location/autocomplete?q=${encodeURIComponent(trimmed)}`,
    { signal }
  );

  return response.data.data || [];
}
