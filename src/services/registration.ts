import type { Role, User } from "../types/domain";

export interface RegistrationInput {
  name: string;
  email: string;
  password: string;
  confirmation: string;
}

export function validateRegistration(input: RegistrationInput) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (name.length < 2 || name.length > 120)
    throw new Error("Informe seu nome, entre 2 e 120 caracteres.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Informe um e-mail válido.");
  if (input.password.length < 8)
    throw new Error("Use uma senha com pelo menos 8 caracteres.");
  if (input.password !== input.confirmation)
    throw new Error("As senhas não coincidem.");
  return { name, email, password: input.password };
}

const roles: Role[] = [
  "administrador",
  "tecnico",
  "operador",
  "proprietario_vendedor",
  "comprador",
  "parceiro",
];

export function toAppUser(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}): User {
  // User-editable metadata must never grant roles or property access.
  const role = user.app_metadata?.role;
  return {
    id: user.id,
    email: user.email ?? "",
    name:
      typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : "Usuário",
    role: roles.includes(role as Role)
      ? (role as Role)
      : "proprietario_vendedor",
    propertyIds: [],
    status: "active",
  };
}
