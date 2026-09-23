import type { Activity, DashboardSummary } from "../types/domain";
export const summary: DashboardSummary = {
  activePlots: 12,
  criticalAlerts: 3,
  stockAdequacy: 84,
  attentionHa: 18,
};
export const activities: Activity[] = [
  {
    id: "act1",
    title: "Aplicar defensivo",
    plot: "Talhão 03 · Soja",
    scheduledLabel: "Hoje · 08:00",
    kind: "attention",
    syncStatus: "synced",
  },
  {
    id: "act2",
    title: "Irrigação programada",
    plot: "Talhões 05 e 06",
    scheduledLabel: "Hoje · 16:00",
    kind: "planned",
    syncStatus: "synced",
  },
  {
    id: "act3",
    title: "Colheita prevista",
    plot: "Talhão 08 · Milho",
    scheduledLabel: "Amanhã · 07:00",
    kind: "planned",
    syncStatus: "synced",
  },
];
export const adminSummary = [
  {
    label: "Propriedades",
    value: "1",
    detail: "Na demonstração",
    icon: "map" as const,
  },
  {
    label: "Usuários",
    value: "6",
    detail: "Perfis de demonstração",
    icon: "people-outline" as const,
  },
  {
    label: "Oportunidades",
    value: "4",
    detail: "No Mercado Rural",
    icon: "storefront-outline" as const,
  },
  {
    label: "Alertas críticos",
    value: "3",
    detail: "Precisam de atenção",
    icon: "alert-circle-outline" as const,
  },
];
