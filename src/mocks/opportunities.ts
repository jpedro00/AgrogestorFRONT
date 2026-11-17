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
    breed: "Nelore",
    purpose: "Corte",
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
    crop: "Milho",
    season: "2026/27",
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
  {
    id: "angus",
    title: "Lote de novilhos Angus",
    category: "Gado",
    location: "Região de Bagé, RS",
    summary: "24 cabeças · Terminação",
    price: "Sob consulta",
    art: "angus",
    breed: "Angus",
    purpose: "Corte",
    description:
      "Exemplo de lote para terminação, com peso médio ilustrativo de 480 kg. Dados, animais e condições comerciais fictícios. Foto ilustrativa da raça.",
  },
  {
    id: "holandes",
    title: "Vacas Holandesas em lactação",
    category: "Gado",
    location: "Região de Castro, PR",
    summary: "20 cabeças · Pecuária leiteira",
    price: "Sob consulta",
    art: "holstein",
    breed: "Holandês",
    purpose: "Leite",
    description:
      "Exemplo de apresentação de um lote leiteiro, com espaço para consultar idade, produção e histórico. Oferta fictícia e foto ilustrativa da raça.",
  },
  {
    id: "soja",
    title: "Soja em grãos · Safra 2026/27",
    category: "Produção agrícola",
    location: "Região de Sorriso, MT",
    summary: "180 toneladas · Soja em grãos",
    price: "Sob consulta",
    art: "soy",
    crop: "Soja",
    season: "2026/27",
    description:
      "Exemplo de oferta futura de soja em grãos. Volume e disponibilidade fictícios. Fotografia ilustrativa de uma lavoura de soja.",
  },
  {
    id: "cafe",
    title: "Café arábica · Lote selecionado",
    category: "Produção agrícola",
    location: "Região de Varginha, MG",
    summary: "200 sacas · Café arábica",
    price: "Sob consulta",
    art: "coffee",
    crop: "Café",
    season: "2025/26",
    description:
      "Exemplo de lote de café arábica com safra e origem informadas. Oferta de demonstração, com quantidade fictícia e fotografia ilustrativa de frutos de café.",
  },
];
