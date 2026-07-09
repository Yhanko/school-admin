import { create } from 'zustand';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  institutionId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const TOKEN_KEY = 'yhanko_school_admin_token';
const USER_KEY = 'yhanko_school_admin_user';

const getInitialState = () => {
  const token = Cookies.get(TOKEN_KEY) || null;
  const userStr = Cookies.get(USER_KEY);
  let user = null;

  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error('Failed to parse user from cookie', e);
    }
  }

  return { token, user, isAuthenticated: !!token };
};

export const useAuth = create<AuthState>((set) => ({
  ...getInitialState(),

  setAuth: (user, token) => {
    Cookies.set(TOKEN_KEY, token, { expires: 7, path: '/' });
    Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7, path: '/' });
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    Cookies.remove(TOKEN_KEY, { path: '/' });
    Cookies.remove(USER_KEY, { path: '/' });
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
