import { users, DEMO_PASSWORD } from "../mocks/users";
import type { User } from "../types/domain";
export interface SessionStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
export const SESSION_KEY = "agrogestor.demo.session.v1";
// Local demonstration only. This is intentionally not a security boundary.
export class MockAuthService {
  constructor(private storage: SessionStorage) {}
  async login(email: string, password: string): Promise<User> {
    if (!email.trim() || !password)
      throw new Error("Informe seu e-mail e a senha de demonstração.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      throw new Error("Informe um e-mail válido.");
    const user = users.find(
      (item) => item.email === email.trim().toLowerCase(),
    );
    if (!user || password !== DEMO_PASSWORD)
      throw new Error("E-mail ou senha de demonstração incorretos.");
    try {
      await this.storage.setItem(
        SESSION_KEY,
        JSON.stringify({
          version: 1,
          userId: user.id,
          expiresAt: Date.now() + 86400000,
        }),
      );
    } catch {
      throw new Error(
        "Não foi possível salvar a sessão de demonstração. Verifique o armazenamento do dispositivo e tente novamente.",
      );
    }
    return { ...user, propertyIds: [...user.propertyIds] };
  }
  async restore(): Promise<User | null> {
    const value = await this.storage.getItem(SESSION_KEY);
    if (!value) return null;
    try {
      const session: unknown = JSON.parse(value);
      if (
        session &&
        typeof session === "object" &&
        "version" in session &&
        session.version === 1 &&
        "expiresAt" in session &&
        typeof session.expiresAt === "number" &&
        session.expiresAt > Date.now() &&
        "userId" in session
      ) {
        const user = users.find((item) => item.id === session.userId);
        if (user) return { ...user, propertyIds: [...user.propertyIds] };
      }
    } catch {
      /* Malformed local session is discarded below. */
    }
    await this.storage.removeItem(SESSION_KEY);
    return null;
  }
  async logout(): Promise<void> {
    await this.storage.removeItem(SESSION_KEY);
  }
  listDemoAccounts() {
    return users.map(({ name, email, role }) => ({ name, email, role }));
  }
}
