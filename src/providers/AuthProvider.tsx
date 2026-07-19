import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { getStoredToken, getStoredUser, storeAuth, clearAuth } from "@/lib/auth";
import type { AuthResult } from "@/types";

interface AuthContextType {
  user: AuthResult | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => Promise<string>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();
    if (token && storedUser) {
      setUser(storedUser as AuthResult);
      api
        .get("/auth/me")
        .then((res) => {
          const data = res.data;
          if (data.succeeded && data.data) {
            setUser(data.data);
            storeAuth(data.data.token, data.data.refreshToken, data.data);
          }
        })
        .catch(() => {
          clearAuth();
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const data = res.data;
    if (!data.succeeded) throw new Error(data.errors?.[0] || "Login failed");
    setUser(data.data);
    storeAuth(data.data.token, data.data.refreshToken, data.data);
  }, []);

  const register = useCallback(async (payload: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => {
    const res = await api.post("/auth/register", payload);
    const data = res.data;
    if (!data.succeeded) throw new Error(data.errors?.[0] || "Registration failed");
    return data.data.message;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    window.location.href = "/auth/login";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
