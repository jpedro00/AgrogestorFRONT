import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type PropsWithChildren,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, Platform } from "react-native";
import { MockAuthService } from "../services/auth";
import { LiveAuthService } from "../services/liveAuth";
import {
  hasAuthConfiguration,
  requireSupabase,
  supabase,
} from "../services/supabase";
import { toAppUser, type RegistrationInput } from "../services/registration";
import type { User } from "../types/domain";
export const isDemoMode = !hasAuthConfiguration;
export const authService = supabase
  ? new LiveAuthService(supabase)
  : new MockAuthService(AsyncStorage);
async function restoreUser() {
  if (hasAuthConfiguration) requireSupabase();
  return authService.restore();
}
type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (input: RegistrationInput) => Promise<{ user: User | null }>;
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
      setUser(await restoreUser());
    } catch {
      setUser(null);
      setError("Não foi possível recuperar sua sessão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let active = true;
    restoreUser()
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
  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? toAppUser(session.user) : null);
    });
    if (Platform.OS !== "web" && AppState.currentState === "active")
      client.auth.startAutoRefresh();
    const subscription =
      Platform.OS !== "web"
        ? AppState.addEventListener("change", (state) => {
            if (state === "active") client.auth.startAutoRefresh();
            else client.auth.stopAutoRefresh();
          })
        : null;
    return () => {
      data.subscription.unsubscribe();
      subscription?.remove();
    };
  }, []);
  async function login(email: string, password: string) {
    if (hasAuthConfiguration) requireSupabase();
    const result = await authService.login(email, password);
    setError(null);
    setUser(result);
    return result;
  }
  async function register(input: RegistrationInput) {
    const redirect =
      Platform.OS === "web" && typeof window !== "undefined"
        ? `${window.location.origin}/login`
        : process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL;
    const result = await new LiveAuthService(requireSupabase()).register(
      input,
      redirect,
    );
    setError(null);
    if (result.user) setUser(result.user);
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
      value={{ user, loading, error, login, register, logout, restore }}
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
