import { create } from 'zustand';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  institutionId?: string;
  photoUrl?: string;
  avatar?: string;
  profile?: {
    photoUrl?: string;
    phone?: string;
  };
  employeeProfile?: {
    photoUrl?: string;
    phone?: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (updatedFields: Partial<User>) => void;
  logout: () => void;
}

const TOKEN_KEY = 'yhanko_school_admin_token';
const USER_KEY = 'yhanko_school_admin_user';

const getInitialState = () => {
  const token = Cookies.get(TOKEN_KEY) || null;
  const userStr = Cookies.get(USER_KEY);
  let user: User | null = null;

  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error('Failed to parse user from cookie', e);
    }
  }

  return { token, user, isAuthenticated: !!token };
};

export const useAuth = create<AuthState>((set, get) => ({
  ...getInitialState(),

  setAuth: (user, token) => {
    Cookies.set(TOKEN_KEY, token, { expires: 7, path: '/' });
    Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7, path: '/' });
    set({ user, token, isAuthenticated: true });
  },

  updateUser: (updatedFields) => {
    const currentUser = get().user;
    if (currentUser) {
      const newUser = {
        ...currentUser,
        ...updatedFields,
        profile: {
          ...currentUser.profile,
          ...updatedFields.profile,
        },
        employeeProfile: {
          ...currentUser.employeeProfile,
          ...updatedFields.employeeProfile,
        },
      };
      Cookies.set(USER_KEY, JSON.stringify(newUser), { expires: 7, path: '/' });
      set({ user: newUser });
    }
  },

  logout: () => {
    Cookies.remove(TOKEN_KEY, { path: '/' });
    Cookies.remove(USER_KEY, { path: '/' });
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
