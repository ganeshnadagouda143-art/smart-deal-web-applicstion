// Integration-ready API service adapter prepared for Node.js, Express, PostgreSQL, and Supabase.
// When VITE_API_BASE_URL is configured, requests route to the live backend; otherwise local state handles demo data.

export interface ApiConfig {
  baseUrl: string;
  supabaseUrl?: string;
}

export const apiConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
};

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ ok: boolean; data?: T; error?: string }> {
  if (!import.meta.env.VITE_API_BASE_URL) {
    return { ok: true };
  }

  try {
    const response = await fetch(`${apiConfig.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      return { ok: false, error: `Request failed with status ${response.status}` };
    }

    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error',
    };
  }
}
