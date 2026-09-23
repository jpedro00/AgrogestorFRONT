import type { Alert, Plot, Property } from "../types/domain";
export const properties: Property[] = [
  {
    id: "santa-clara",
    name: "Fazenda Santa Clara",
    location: "Ribeirão Preto, SP",
    areaHa: 240,
    season: "Safra 2026/27",
  },
];
export const plots: Plot[] = [
  {
    id: "t03",
    propertyId: "santa-clara",
    name: "Talhão 03",
    crop: "Soja",
    areaHa: 18,
  },
];
export const alerts: Alert[] = [
  {
    id: "a1",
    propertyId: "santa-clara",
    title: "Atenção no Talhão 03",
    description: "18 ha precisam de vistoria. Confira as condições da lavoura.",
    severity: "critical",
  },
  {
    id: "a2",
    propertyId: "santa-clara",
    title: "Estoque de defensivo baixo",
    description: "Revise o planejamento antes da próxima aplicação.",
    severity: "critical",
  },
  {
    id: "a3",
    propertyId: "santa-clara",
    title: "Irrigação precisa de revisão",
    description: "Verifique o sistema no setor norte.",
    severity: "critical",
  },
];
