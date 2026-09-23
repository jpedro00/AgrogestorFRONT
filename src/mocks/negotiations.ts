import type { Negotiation, NegotiationStatus } from "../types/domain";
export const negotiationStatuses: NegotiationStatus[] = [
  "Preciso agir",
  "Em andamento",
  "Aguardando outra pessoa",
  "Concluídos",
];
export const negotiations: Negotiation[] = [
  {
    id: "n1",
    title: "Lote de novilhas Nelore",
    status: "Preciso agir",
    detail: "Exemplo: revisar as informações recebidas.",
    participantIds: ["user-owner", "user-buyer"],
  },
  {
    id: "n2",
    title: "Arrendamento rural",
    status: "Em andamento",
    detail: "Exemplo: organização dos documentos da oportunidade.",
    participantIds: ["user-owner", "user-partner"],
  },
];
