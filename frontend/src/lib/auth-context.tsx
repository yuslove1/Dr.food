"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "./api";
import { refreshAccessToken } from "./api";
import { setAccessToken } from "./token-store";

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: string;
  onboardingComplete: boolean;
}

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  refetchUser: () => Promise<void>;
  login: (input: { email?: string; phone?: string; password: string }) => Promise<void>;
  signup: (input: { fullName: string; email?: string; phone?: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchMe() {
    try {
      const me = await api.get<CurrentUser>("/auth/me");
      setUser(me);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    (async () => {
      const token = await refreshAccessToken();
      if (token) await fetchMe();
      setLoading(false);
    })();
  }, []);

  async function login(input: { email?: string; phone?: string; password: string }) {
    const result = await api.post<{ accessToken: string; user: CurrentUser }>("/auth/login", input);
    setAccessToken(result.accessToken);
    await fetchMe();
  }

  async function signup(input: { fullName: string; email?: string; phone?: string; password: string }) {
    const result = await api.post<{ accessToken: string; user: CurrentUser }>("/auth/signup", input);
    setAccessToken(result.accessToken);
    await fetchMe();
  }

  async function logout() {
    await api.post("/auth/logout").catch(() => undefined);
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, refetchUser: fetchMe, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
