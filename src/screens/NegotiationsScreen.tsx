import { useCallback } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "../components/Layout";
import { Badge, Card, Heading, SectionTitle, s } from "../components/ui";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  RestrictedState,
} from "../components/States";
import { useAuth } from "../auth/AuthContext";
import { canAccess } from "../auth/permissions";
import { NegotiationService } from "../services/data";
import { useResource } from "../hooks/useResource";
export default function NegotiationsScreen() {
  const { user } = useAuth();
  const resource = useResource(
    useCallback(
      () => (user ? NegotiationService.list(user) : Promise.resolve([])),
      [user],
    ),
  );
  return (
    <Screen userNav>
      <Heading
        eyebrow="AGROGESTOR NEGÓCIOS"
        subtitle="Acompanhe o próximo passo de cada oportunidade."
      >
        Meus Negócios
      </Heading>
      <Badge
        label="Exemplos de demonstração · nenhuma negociação real"
        tone="warning"
      />
      {!canAccess(user, "negotiations") ? (
        <RestrictedState onBack={() => router.replace("/home")} />
      ) : resource.loading ? (
        <LoadingState />
      ) : resource.error ? (
        <ErrorState retry={resource.retry} />
      ) : (
        <View style={s.grid}>
          {NegotiationService.statuses.map((status) => {
            const items =
              resource.data?.filter((n) => n.status === status) ?? [];
            return (
              <Card
                key={status}
                style={{ flexGrow: 1, flexBasis: 380, gap: 18 }}
              >
                <View style={s.between}>
                  <SectionTitle>{status}</SectionTitle>
                  <Badge label={String(items.length)} tone="neutral" />
                </View>
                {items.length ? (
                  items.map((n) => (
                    <View key={n.id} style={{ gap: 8 }}>
                      <Text style={s.label}>{n.title}</Text>
                      <Text style={s.body}>{n.detail}</Text>
                      <Badge
                        label="Protótipo em desenvolvimento"
                        tone="neutral"
                      />
                    </View>
                  ))
                ) : (
                  <EmptyState
                    title="Tudo em dia por aqui"
                    description="Nenhum negócio nesta etapa."
                  />
                )}
              </Card>
            );
          })}
        </View>
      )}
    </Screen>
  );
}
