import { create } from 'zustand';

interface AuthState {
  user: import('@/types').User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: import('@/types').User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isBrand: () => boolean;
  isInfluencer: () => boolean;
  isAdmin: () => boolean;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    localStorage.removeItem('ih_token');
    set({ user: null, token: null });
  },
  isAuthenticated: () => get().user !== null,
  isBrand: () => get().user?.role === 'brand',
  isInfluencer: () => get().user?.role === 'influencer',
  isAdmin: () => get().user?.role === 'admin',
}));
