export type Role =
  | "administrador"
  | "tecnico"
  | "operador"
  | "proprietario_vendedor"
  | "comprador"
  | "parceiro";
export type SyncStatus = "synced" | "pending" | "syncing" | "error";
export type Connectivity = "online" | "offline" | "unknown";
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  propertyIds: string[];
  status: "demo" | "active";
}
export interface Property {
  id: string;
  name: string;
  location: string;
  areaHa: number;
  season: string;
}
export interface DashboardSummary {
  activePlots: number;
  criticalAlerts: number;
  stockAdequacy: number;
  attentionHa: number;
}
export interface Activity {
  id: string;
  title: string;
  plot: string;
  scheduledLabel: string;
  kind: "attention" | "planned";
  syncStatus: SyncStatus;
}
export interface Plot {
  id: string;
  propertyId: string;
  name: string;
  crop: string;
  areaHa: number;
}
export interface Alert {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  severity: "critical" | "warning";
}
export type OpportunityCategory =
  "Terra" | "Gado" | "Produção agrícola" | "Arrendamento";
export interface Opportunity {
  id: string;
  title: string;
  category: OpportunityCategory;
  location: string;
  summary: string;
  price: string;
  description: string;
  art: "land" | "cattle" | "crop" | "lease";
}
export type NegotiationStatus =
  "Preciso agir" | "Em andamento" | "Aguardando outra pessoa" | "Concluídos";
export interface Negotiation {
  id: string;
  title: string;
  status: NegotiationStatus;
  detail: string;
  participantIds: string[];
}
