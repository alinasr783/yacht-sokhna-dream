// API client for server-side endpoints
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE = '';

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}/api${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new ApiError(response.status, error.message || 'Request failed');
  }

  return response.json();
}

// Admin Authentication
export const auth = {
  login: (email: string, password: string) =>
    apiRequest<{ success: boolean; user?: { id: string; email: string; loginTime: number } }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// Admin Users
export const adminUsers = {
  getAll: () => apiRequest<any[]>('/admin/users'),
  create: (data: { email: string; password: string }) =>
    apiRequest<any>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<{ email: string; password: string }>) =>
    apiRequest<any>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/admin/users/${id}`, {
      method: 'DELETE',
    }),
};

// Locations
export const locations = {
  getAll: () => apiRequest<any[]>('/locations'),
  getHomepage: () => apiRequest<any[]>('/locations/homepage'),
  getById: (id: string) => apiRequest<any>(`/locations/${id}`),
  create: (data: any) =>
    apiRequest<any>('/locations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest<any>(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/locations/${id}`, {
      method: 'DELETE',
    }),
};

// Yachts
export const yachts = {
  getAll: () => apiRequest<any[]>('/yachts'),
  getHomepage: () => apiRequest<any[]>('/yachts/homepage'),
  getById: (id: string) => apiRequest<any>(`/yachts/${id}`),
  getByLocation: (locationId: string) => apiRequest<any[]>(`/yachts/location/${locationId}`),
  create: (data: any) =>
    apiRequest<any>('/yachts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest<any>(`/yachts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/yachts/${id}`, {
      method: 'DELETE',
    }),
};

// Yacht Images
export const yachtImages = {
  getByYacht: (yachtId: string) => apiRequest<any[]>(`/yacht-images/${yachtId}`),
  create: (data: { yachtId: string; imageUrl: string; isPrimary?: boolean }) =>
    apiRequest<any>('/yacht-images', {
      method: 'POST',
      body: JSON.stringify({
        yacht_id: data.yachtId,
        image_url: data.imageUrl,
        is_primary: data.isPrimary || false,
      }),
    }),
  update: (id: string, data: any) =>
    apiRequest<any>(`/yacht-images/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/yacht-images/${id}`, {
      method: 'DELETE',
    }),
};

// Articles
export const articles = {
  getAll: () => apiRequest<any[]>('/articles'),
  getHomepage: () => apiRequest<any[]>('/articles/homepage'),
  getById: (id: string) => apiRequest<any>(`/articles/${id}`),
  create: (data: any) =>
    apiRequest<any>('/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest<any>(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/articles/${id}`, {
      method: 'DELETE',
    }),
};

// Contact Info
export const contactInfo = {
  get: () => apiRequest<any>('/contact-info'),
  update: (data: any) =>
    apiRequest<any>('/contact-info', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};