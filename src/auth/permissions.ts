import type { Role, User } from "../types/domain";
export type Permission =
  "user" | "admin" | "farm" | "stock" | "reports" | "market" | "negotiations";
export const roleLabels: Record<Role, string> = {
  administrador: "Administrador",
  tecnico: "Técnico",
  operador: "Operador",
  proprietario_vendedor: "Proprietário / Vendedor",
  comprador: "Comprador",
  parceiro: "Parceiro",
};
const permissions: Record<Role, readonly Permission[]> = {
  administrador: [
    "user",
    "admin",
    "farm",
    "stock",
    "reports",
    "market",
    "negotiations",
  ],
  tecnico: ["user", "farm", "stock", "reports", "market"],
  operador: ["user", "farm", "market"],
  proprietario_vendedor: [
    "user",
    "farm",
    "stock",
    "reports",
    "market",
    "negotiations",
  ],
  comprador: ["user", "market", "negotiations"],
  parceiro: ["user", "market", "negotiations"],
};
export function canAccess(user: User | null, permission: Permission): boolean {
  return !!user && permissions[user.role].includes(permission);
}
export function entryRoute(user: User): "/admin" | "/usuario" {
  return user.role === "administrador" ? "/admin" : "/usuario";
}
