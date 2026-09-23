import type { User } from "../types/domain";
export const DEMO_PASSWORD = "Demo@123";
export const users: User[] = [
  {
    id: "user-admin",
    name: "Ana Martins",
    email: "admin@agrogestor.demo",
    role: "administrador",
    propertyIds: ["santa-clara"],
    status: "demo",
  },
  {
    id: "user-owner",
    name: "João Oliveira",
    email: "usuario@agrogestor.demo",
    role: "proprietario_vendedor",
    propertyIds: ["santa-clara"],
    status: "demo",
  },
  {
    id: "user-technician",
    name: "Mariana Costa",
    email: "tecnico@agrogestor.demo",
    role: "tecnico",
    propertyIds: ["santa-clara"],
    status: "demo",
  },
  {
    id: "user-operator",
    name: "Pedro Santos",
    email: "operador@agrogestor.demo",
    role: "operador",
    propertyIds: ["santa-clara"],
    status: "demo",
  },
  {
    id: "user-buyer",
    name: "Clara Almeida",
    email: "comprador@agrogestor.demo",
    role: "comprador",
    propertyIds: [],
    status: "demo",
  },
  {
    id: "user-partner",
    name: "Lucas Ferreira",
    email: "parceiro@agrogestor.demo",
    role: "parceiro",
    propertyIds: [],
    status: "demo",
  },
];
