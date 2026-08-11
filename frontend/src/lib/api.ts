const API_BASE = import.meta.env.PROD
  ? '/api'
  : '/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
  params?: Record<string, string | number | undefined>;
  auth?: boolean;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('ih_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('ih_token', token);
    } else {
      localStorage.removeItem('ih_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, params, auth = true } = options;

    let url = `${API_BASE}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (auth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data as T;
  }

  get<T>(endpoint: string, params?: Record<string, string | number | undefined>, auth?: boolean) {
    return this.request<T>(endpoint, { method: 'GET', params, auth });
  }

  post<T>(endpoint: string, body?: unknown, auth?: boolean) {
    return this.request<T>(endpoint, { method: 'POST', body, auth });
  }

  put<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post<import('@/types').AuthResponse>('/auth/login', { email, password }, false),
  signup: (data: { email: string; password: string; role: string; company_name?: string }) =>
    api.post<import('@/types').AuthResponse>('/auth/signup', data, false),
  me: () => api.get<{ user: import('@/types').User }>('/auth/me'),
  logout: () => api.post<{ message: string }>('/auth/logout'),
};

// Influencers (public)
export const influencerApi = {
  list: (params?: Record<string, string | number | undefined>) =>
    api.get<import('@/types').PaginatedResponse<import('@/types').InfluencerProfile>>('/influencers/list', params, false),
  getById: (id: number) =>
    api.get<{ influencer: import('@/types').InfluencerProfile; user: import('@/types').User }>(`/influencers/${id}`, undefined, false),
  updateProfile: (data: Partial<import('@/types').InfluencerProfile>) =>
    api.put<{ profile: import('@/types').InfluencerProfile; message: string }>('/influencers/profile', data),
  getMyProfile: () =>
    api.get<{ profile: import('@/types').InfluencerProfile }>('/influencers/profile'),
  upload: async (type: 'profile_photo' | 'cover_photo' | 'gallery', file: File, title?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (title) formData.append('title', title);

    const token = api.getToken();
    const response = await fetch(`/api/influencers/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }
    return data;
  },
};

// Brands
export const brandApi = {
  getProfile: () => api.get<{ profile: import('@/types').BrandProfile }>('/brands/profile'),
  updateProfile: (data: Partial<import('@/types').BrandProfile>) =>
    api.put<{ profile: import('@/types').BrandProfile; message: string }>('/brands/profile', data),
  getEnquiries: (page = 1) =>
    api.get<import('@/types').PaginatedResponse<import('@/types').Enquiry>>('/brands/enquiries', { page }),
  sendEnquiry: (data: { influencer_id: number; subject?: string; message: string; budget_range?: string; campaign_details?: string }) =>
    api.post<{ enquiry: import('@/types').Enquiry; message: string }>('/brands/enquiries', data),
};

// Public
export const publicApi = {
  categories: () =>
    api.get<{ categories: import('@/types').Category[] }>('/public/categories', undefined, false),
  contact: (data: { name: string; email: string; subject?: string; message: string }) =>
    api.post<{ message: string }>('/public/contact', data, false),
  sendEnquiry: (data: {
    influencer_id: number;
    contact_name?: string;
    contact_email?: string;
    subject?: string;
    message: string;
    budget_range?: string;
    campaign_details?: string;
  }) =>
    api.post<{ enquiry: import('@/types').Enquiry; message: string }>('/public/enquiries', data, false),
};
