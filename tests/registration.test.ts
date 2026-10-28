import { describe, expect, it } from "vitest";
import { validateRegistration, toAppUser } from "../src/services/registration";

const valid = {
  name: " Maria Silva ",
  email: " MARIA@example.com ",
  password: "Segura123!",
  confirmation: "Segura123!",
};
describe("cadastro", () => {
  it("normaliza nome e email sem alterar senha", () => {
    expect(validateRegistration(valid)).toEqual({
      name: "Maria Silva",
      email: "maria@example.com",
      password: "Segura123!",
    });
  });
  it.each([
    [{ name: " " }, "nome"],
    [{ email: "invalido" }, "e-mail"],
    [{ password: "123", confirmation: "123" }, "8 caracteres"],
    [{ confirmation: "diferente" }, "coincidem"],
  ])("rejeita dados inválidos %j", (change, message) => {
    expect(() => validateRegistration({ ...valid, ...change })).toThrow(
      message,
    );
  });
  it("não permite obter acesso administrativo via metadados editáveis", () => {
    expect(
      toAppUser({
        id: "u1",
        email: "maria@example.com",
        user_metadata: {
          name: "Maria",
          role: "administrador",
          propertyIds: ["p1"],
        },
        app_metadata: {},
      }),
    ).toEqual({
      id: "u1",
      email: "maria@example.com",
      name: "Maria",
      role: "proprietario_vendedor",
      propertyIds: [],
      status: "active",
    });
  });
  it("aceita apenas papéis conhecidos dos metadados administrados pelo servidor", () => {
    expect(
      toAppUser({ id: "u1", app_metadata: { role: "desconhecido" } }).role,
    ).toBe("proprietario_vendedor");
    expect(
      toAppUser({ id: "u1", app_metadata: { role: "comprador" } }).role,
    ).toBe("comprador");
  });
});
