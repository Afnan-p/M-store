// Frontend API Client Adapter connecting React to Express API Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchFromAPI<T>(
  endpoint: string,
  options?: RequestInit & { timeoutMs?: number }
): Promise<T | null> {
  const timeoutMs = options?.timeoutMs || 2000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const { timeoutMs: _, ...fetchOptions } = options || {};

  // Retrieve JWT Auth Token from LocalStorage if user is logged in
  const token = typeof window !== 'undefined' ? localStorage.getItem('mstore_admin_auth_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(fetchOptions?.headers as Record<string, string>),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn(`[API Client] Falling back to local storage/mock for endpoint ${endpoint}:`, err);
    return null;
  }
}
