import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type PropsWithChildren,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MockAuthService } from "../services/auth";
import type { User } from "../types/domain";
export const authService = new MockAuthService(AsyncStorage);
type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const restore = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUser(await authService.restore());
    } catch {
      setUser(null);
      setError("Não foi possível recuperar sua sessão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let active = true;
    authService
      .restore()
      .then((value) => {
        if (active) setUser(value);
      })
      .catch(() => {
        if (active)
          setError("Não foi possível recuperar sua sessão. Tente novamente.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function login(email: string, password: string) {
    const result = await authService.login(email, password);
    setError(null);
    setUser(result);
    return result;
  }
  async function logout() {
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch {
      throw new Error("Não foi possível encerrar a sessão. Tente novamente.");
    }
  }
  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, restore }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider ausente");
  return context;
}
