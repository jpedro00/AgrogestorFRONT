import { beforeEach, describe, expect, it } from "vitest";
import {
  MockAuthService,
  SESSION_KEY,
  type SessionStorage,
} from "../src/services/auth";
import { canAccess, entryRoute } from "../src/auth/permissions";

const values = new Map<string, string>();
const storage: SessionStorage = {
  getItem: async (key) => values.get(key) ?? null,
  setItem: async (key, value) => {
    values.set(key, value);
  },
  removeItem: async (key) => {
    values.delete(key);
  },
};
const auth = new MockAuthService(storage);
beforeEach(() => values.clear());
describe("sessão de demonstração", () => {
  it("login válido normaliza e-mail e persiste somente sessão sem senha", async () => {
    const user = await auth.login(" USUARIO@AGROGESTOR.DEMO ", "Demo@123");
    expect(user.role).toBe("proprietario_vendedor");
    expect(JSON.parse(values.get(SESSION_KEY)!)).toEqual({
      version: 1,
      userId: user.id,
      expiresAt: expect.any(Number),
    });
    expect(values.get(SESSION_KEY)).not.toContain("Demo@123");
    expect((await auth.restore())?.id).toBe(user.id);
  });
  it("recusa login inválido", async () => {
    await expect(
      auth.login("usuario@agrogestor.demo", "errada"),
    ).rejects.toThrow("E-mail ou senha");
    expect(await auth.restore()).toBeNull();
  });
  it("valida campos vazios e e-mail inválido", async () => {
    await expect(auth.login("", "")).rejects.toThrow("Informe");
    await expect(auth.login("sem-arroba", "Demo@123")).rejects.toThrow(
      "e-mail válido",
    );
  });
  it("logout remove a sessão", async () => {
    await auth.login("admin@agrogestor.demo", "Demo@123");
    await auth.logout();
    expect(await auth.restore()).toBeNull();
    expect(values.has(SESSION_KEY)).toBe(false);
  });
  it.each(["{", "{}", '{"version":1,"userId":"admin","expiresAt":1}'])(
    "descarta sessão inválida ou expirada %s",
    async (value) => {
      values.set(SESSION_KEY, value);
      expect(await auth.restore()).toBeNull();
      expect(values.has(SESSION_KEY)).toBe(false);
    },
  );
  it("não confia no perfil injetado no armazenamento", async () => {
    values.set(
      SESSION_KEY,
      JSON.stringify({
        version: 1,
        userId: "user-owner",
        role: "administrador",
        expiresAt: Date.now() + 60000,
      }),
    );
    expect((await auth.restore())?.role).toBe("proprietario_vendedor");
  });
  it("comunica falha ao salvar sessão", async () => {
    const failing = new MockAuthService({
      ...storage,
      setItem: async () => {
        throw new Error("unavailable");
      },
    });
    await expect(
      failing.login("usuario@agrogestor.demo", "Demo@123"),
    ).rejects.toThrow("salvar");
  });
});
describe("permissões", () => {
  it("visitante não acessa área protegida", () => {
    expect(canAccess(null, "user")).toBe(false);
    expect(canAccess(null, "admin")).toBe(false);
  });
  it("usuário comum não acessa admin", async () => {
    const user = await auth.login("usuario@agrogestor.demo", "Demo@123");
    expect(canAccess(user, "admin")).toBe(false);
    expect(entryRoute(user)).toBe("/usuario");
  });
  it("admin acessa Dashboard Admin e área comum", async () => {
    const user = await auth.login("admin@agrogestor.demo", "Demo@123");
    expect(canAccess(user, "admin")).toBe(true);
    expect(canAccess(user, "user")).toBe(true);
    expect(entryRoute(user)).toBe("/admin");
  });
  it.each(["comprador", "parceiro"])(
    "%s não acessa dados da fazenda",
    async (role) => {
      const user = await auth.login(`${role}@agrogestor.demo`, "Demo@123");
      expect(canAccess(user, "farm")).toBe(false);
    },
  );
});
