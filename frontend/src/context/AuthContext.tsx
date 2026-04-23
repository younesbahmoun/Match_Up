import { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { loginRequest } from "@/features/auth/services/authService";
import type { LoginData, LoginResponse, User } from "@/features/auth/types/authTypes";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginData) => Promise<LoginResponse>;
  logout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "access_token";
const USER_KEY = "auth_user";

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser) as User);
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }

    setLoading(false);
  }, []);

async function login(data: LoginData): Promise<LoginResponse> {
  const response = await loginRequest(data);

  setToken(response.access_token);
  setUser(response.user);

  localStorage.setItem(TOKEN_KEY, response.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(response.user));

  return response;
}

  function logout() {
    setToken(null);
    setUser(null);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      loading,
      login,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}