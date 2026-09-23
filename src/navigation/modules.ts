import type { IconName } from "../components/ui";
import type { Permission } from "../auth/permissions";
export const farmModules: {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  permission: Permission;
}[] = [
  {
    id: "talhoes",
    title: "Talhões",
    description: "Um olhar sobre cada parte da sua propriedade.",
    icon: "grid-outline",
    permission: "farm",
  },
  {
    id: "atividades",
    title: "Registrar atividade",
    description: "Organize o trabalho realizado no campo.",
    icon: "create-outline",
    permission: "farm",
  },
  {
    id: "estoque",
    title: "Estoque",
    description: "Acompanhe os insumos da fazenda.",
    icon: "cube-outline",
    permission: "stock",
  },
  {
    id: "alertas",
    title: "Alertas",
    description: "Saiba o que precisa da sua atenção.",
    icon: "notifications-outline",
    permission: "farm",
  },
  {
    id: "historico",
    title: "Histórico",
    description: "Consulte a trajetória das operações.",
    icon: "time-outline",
    permission: "reports",
  },
];
export const adminModules: {
  id: string;
  title: string;
  icon: IconName;
  group: "Gestão rural" | "AgroGestor Negócios";
}[] = [
  {
    id: "propriedades",
    title: "Propriedades",
    icon: "map-outline",
    group: "Gestão rural",
  },
  {
    id: "talhoes",
    title: "Talhões",
    icon: "grid-outline",
    group: "Gestão rural",
  },
  {
    id: "culturas",
    title: "Culturas e Safras",
    icon: "leaf-outline",
    group: "Gestão rural",
  },
  {
    id: "atividades",
    title: "Atividades",
    icon: "calendar-outline",
    group: "Gestão rural",
  },
  {
    id: "estoque",
    title: "Estoque",
    icon: "cube-outline",
    group: "Gestão rural",
  },
  {
    id: "alertas",
    title: "Alertas",
    icon: "notifications-outline",
    group: "Gestão rural",
  },
  {
    id: "relatorios",
    title: "Relatórios",
    icon: "bar-chart-outline",
    group: "Gestão rural",
  },
  {
    id: "usuarios",
    title: "Usuários e Permissões",
    icon: "people-outline",
    group: "Gestão rural",
  },
  {
    id: "configuracoes",
    title: "Configurações",
    icon: "settings-outline",
    group: "Gestão rural",
  },
  {
    id: "marketplace",
    title: "Marketplace",
    icon: "storefront-outline",
    group: "AgroGestor Negócios",
  },
  {
    id: "negociacoes",
    title: "Negociações",
    icon: "chatbubbles-outline",
    group: "AgroGestor Negócios",
  },
  {
    id: "documentos",
    title: "Documentos",
    icon: "document-text-outline",
    group: "AgroGestor Negócios",
  },
  {
    id: "credito",
    title: "Crédito e Propostas",
    icon: "wallet-outline",
    group: "AgroGestor Negócios",
  },
  {
    id: "contratos",
    title: "Contratos e Assinaturas",
    icon: "reader-outline",
    group: "AgroGestor Negócios",
  },
];
export const quickActions = [
  {
    title: "Minha Fazenda",
    description: "Seu campo, bem cuidado.",
    icon: "leaf-outline" as const,
    path: "/fazenda" as const,
  },
  {
    title: "Mercado Rural",
    description: "Encontre novas oportunidades.",
    icon: "storefront-outline" as const,
    path: "/mercado-rural" as const,
  },
  {
    title: "Meus Negócios",
    description: "Cada conversa, um próximo passo.",
    icon: "briefcase-outline" as const,
    path: "/negocios" as const,
  },
  {
    title: "Perfil e Ajuda",
    description: "Do seu jeito, com apoio.",
    icon: "person-circle-outline" as const,
    path: "/perfil" as const,
  },
];
