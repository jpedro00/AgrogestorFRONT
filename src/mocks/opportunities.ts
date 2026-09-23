import type { Opportunity } from "../types/domain";
// Public catalogue: intentionally independent of private farm data.
export const opportunities: Opportunity[] = [
  {
    id: "boa-vista",
    title: "Fazenda Boa Vista",
    category: "Terra",
    location: "Região de Uberaba, MG",
    summary: "156 ha · Terra para cultivar novos planos",
    price: "R$ 4.200.000",
    art: "land",
    description:
      "Área rural de demonstração com pastagem e vocação agrícola. Localização aproximada. Valores e condições são fictícios.",
  },
  {
    id: "nelore",
    title: "Lote de novilhas Nelore",
    category: "Gado",
    location: "Região de Campo Grande, MS",
    summary: "32 cabeças · Recria",
    price: "R$ 2.850 / cabeça",
    art: "cattle",
    description:
      "Lote fictício de novilhas para recria. Este anúncio ilustra a futura apresentação de animais no mercado.",
  },
  {
    id: "milho",
    title: "Milho da próxima safra",
    category: "Produção agrícola",
    location: "Região de Rio Verde, GO",
    summary: "120 toneladas · Milho em grãos",
    price: "Sob consulta",
    art: "crop",
    description:
      "Oferta ilustrativa de produção agrícola. Quantidade e disponibilidade não representam uma oferta comercial real.",
  },
  {
    id: "arrendamento",
    title: "Uma nova área para produzir",
    category: "Arrendamento",
    location: "Região de Londrina, PR",
    summary: "80 ha · Área mecanizável",
    price: "Condições a combinar",
    art: "lease",
    description:
      "Oportunidade fictícia de arrendamento rural. Nenhum contrato ou negociação real será iniciado neste protótipo.",
  },
];
