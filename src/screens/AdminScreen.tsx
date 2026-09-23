import { useCallback } from "react";
import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen, AdminScreen as AdminLayout } from "../components/Layout";
import {
  AppButton,
  Badge,
  Card,
  Heading,
  ModuleCard,
  SectionTitle,
  StatCard,
  s,
} from "../components/ui";
import { Avatar, LogoutButton, RoleBadge } from "../components/Account";
import { EmptyState, ErrorState, LoadingState } from "../components/States";
import { useAuth } from "../auth/AuthContext";
import { useResource } from "../hooks/useResource";
import { DashboardService } from "../services/data";
import { adminModules } from "../navigation/modules";
export default function AdminEntryScreen() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <Screen narrow>
      <Heading
        eyebrow="ACESSO ADMINISTRATIVO"
        subtitle="Organize a visão geral do AgroGestor."
      >
        Painel Administrativo
      </Heading>
      <Card style={{ gap: 24 }}>
        <View style={s.row}>
          <Avatar user={user} />
          <View style={{ gap: 8, flex: 1 }}>
            <Text style={s.sectionTitle}>{user.name}</Text>
            <RoleBadge role={user.role} />
          </View>
        </View>
        <Text style={s.body}>
          Acompanhe a gestão rural e o ambiente de negócios em áreas separadas.
          Os dados deste painel são de demonstração.
        </Text>
        <AppButton
          title="Abrir Dashboard Admin"
          icon="grid-outline"
          onPress={() => router.push("/admin/dashboard")}
        />
        <AppButton
          title="Entrar na área do usuário"
          variant="secondary"
          icon="person-outline"
          onPress={() => router.push("/usuario")}
        />
      </Card>
      <LogoutButton />
    </Screen>
  );
}
export function AdminDashboardScreen() {
  const { user } = useAuth();
  const resource = useResource(
    useCallback(
      () => (user ? DashboardService.admin(user) : Promise.resolve([])),
      [user],
    ),
  );
  return (
    <AdminLayout>
      <View style={[s.between, { flexWrap: "wrap" }]}>
        <Heading
          eyebrow="VISÃO GERAL"
          subtitle="Um panorama do AgroGestor, com cada área no seu lugar."
        >
          Dashboard Admin
        </Heading>
        <Badge label="DEMONSTRAÇÃO" tone="warning" />
      </View>
      {resource.loading ? (
        <LoadingState />
      ) : resource.error ? (
        <ErrorState retry={resource.retry} />
      ) : (
        <View style={s.grid}>
          {resource.data?.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </View>
      )}
      <View style={s.grid}>
        <Card style={{ flex: 1, minWidth: 260, gap: 20 }}>
          <SectionTitle>Gestão rural</SectionTitle>
          <Text style={s.body}>
            Acompanhe propriedades, equipes e operações autorizadas. Informações
            operacionais são privadas.
          </Text>
          <ModuleCard
            title="Propriedades"
            description="Organização do espaço rural"
            icon="map-outline"
            onPress={() => router.push("/admin/modulo/propriedades")}
          />
          <ModuleCard
            title="Usuários e permissões"
            description="Perfis e acessos da plataforma"
            icon="people-outline"
            onPress={() => router.push("/admin/modulo/usuarios")}
          />
        </Card>
        <Card style={{ flex: 1, minWidth: 260, gap: 20 }}>
          <SectionTitle>AgroGestor Negócios</SectionTitle>
          <Text style={s.body}>
            Um ambiente próprio para oportunidades, negociações e os documentos
            de cada negócio.
          </Text>
          <ModuleCard
            title="Marketplace"
            description="Oportunidades públicas de demonstração"
            icon="storefront-outline"
            onPress={() => router.push("/admin/modulo/marketplace")}
          />
          <ModuleCard
            title="Negociações"
            description="Acompanhe as etapas dos negócios"
            icon="briefcase-outline"
            onPress={() => router.push("/admin/modulo/negociacoes")}
          />
        </Card>
      </View>
      <Card style={{ gap: 14 }}>
        <SectionTitle>Próximos passos da administração</SectionTitle>
        <Text style={s.body}>
          Os módulos do menu já podem ser explorados. Cadastros, permissões
          reais e operações serão construídos em uma próxima fase.
        </Text>
        <Badge label="Protótipo em desenvolvimento" tone="neutral" />
      </Card>
    </AdminLayout>
  );
}
export function AdminModuleScreen() {
  const { module } = useLocalSearchParams<{ module: string }>();
  const item = adminModules.find((m) => m.id === module);
  return (
    <AdminLayout>
      {item ? (
        <>
          <Heading
            eyebrow={item.group}
            subtitle="Área administrativa preparada para as próximas etapas."
          >
            {item.title}
          </Heading>
          <EmptyState
            title="Protótipo em desenvolvimento"
            description="Este módulo ainda não realiza operações. Explore o menu ou volte ao dashboard para continuar a demonstração."
            icon={item.icon}
            onBack={() => router.replace("/admin/dashboard")}
          />
        </>
      ) : (
        <EmptyState
          title="Área não encontrada"
          onBack={() => router.replace("/admin/dashboard")}
        />
      )}
    </AdminLayout>
  );
}
