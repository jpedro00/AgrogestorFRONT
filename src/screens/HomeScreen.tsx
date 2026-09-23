import { useCallback } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Screen } from "../components/Layout";
import {
  AppButton,
  Badge,
  Card,
  Heading,
  Icon,
  QuickActionCard,
  SectionTitle,
  StatCard,
  s,
} from "../components/ui";
import { ErrorState, LoadingState } from "../components/States";
import { useAuth } from "../auth/AuthContext";
import { useExperience } from "../contexts/ExperienceContext";
import { useResource } from "../hooks/useResource";
import { DashboardService } from "../services/data";
import { quickActions } from "../navigation/modules";
import { colors as c } from "../theme";
export default function HomeScreen() {
  const { user } = useAuth();
  const { simplified, assisted } = useExperience();
  const { width } = useWindowDimensions();
  const resource = useResource(
    useCallback(
      () => (user ? DashboardService.get(user) : Promise.resolve(null)),
      [user],
    ),
  );
  const data = resource.data;
  return (
    <Screen userNav>
      <View style={[s.between, { flexWrap: "wrap" }]}>
        <Heading
          subtitle={
            data
              ? `${data.property.name}  ·  ${data.property.season}`
              : "Seu espaço para a rotina e as oportunidades do campo."
          }
        >
          Bom dia, produtor!
        </Heading>
        <Badge label="DADOS DE DEMONSTRAÇÃO" tone="neutral" />
      </View>
      {assisted && (
        <Card>
          <Text style={s.body}>
            Comece pelo acesso rápido abaixo. Toque em Minha Fazenda para ver as
            áreas de gestão, ou em Mercado Rural para explorar oportunidades.
          </Text>
        </Card>
      )}
      {resource.loading ? (
        <LoadingState />
      ) : resource.error ? (
        <ErrorState retry={resource.retry} />
      ) : data ? (
        <>
          <View style={s.grid}>
            <StatCard
              label="Talhões ativos"
              value={String(data.summary.activePlots)}
              detail="Áreas em produção"
              icon="grid-outline"
            />
            <StatCard
              label="Alertas críticos"
              value={String(data.summary.criticalAlerts)}
              detail="Precisam de atenção"
              icon="alert-circle-outline"
              tone="warning"
            />
            {!simplified && (
              <>
                <StatCard
                  label="Estoque adequado"
                  value={`${data.summary.stockAdequacy}%`}
                  detail="Situação dos insumos"
                  icon="cube-outline"
                />
                <StatCard
                  label="Área em atenção"
                  value={`${data.summary.attentionHa} ha`}
                  detail="Planeje a próxima vistoria"
                  icon="leaf-outline"
                  tone="warning"
                />
              </>
            )}
          </View>
          <View
            style={{
              backgroundColor: c.warningSoft,
              padding: 18,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <Icon name="alert-circle-outline" color={c.warning} />
            <View style={{ flex: 1, minWidth: 180 }}>
              <Text style={[s.label, { color: c.warning }]}>
                {data.alerts[0]?.title}
              </Text>
              <Text style={[s.body, { color: c.warning }]}>
                {data.alerts[0]?.description}
              </Text>
            </View>
            <AppButton
              title="Ver alertas"
              variant="secondary"
              onPress={() => router.push("/fazenda/alertas")}
            />
          </View>
        </>
      ) : (
        <Card>
          <Text style={s.body}>
            Seu perfil está pronto para explorar oportunidades. As informações
            privadas de propriedades não estão disponíveis para esta conta.
          </Text>
        </Card>
      )}
      <View style={{ gap: 16 }}>
        <SectionTitle>Acesso rápido</SectionTitle>
        <View style={s.grid}>
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.path}
              title={action.title}
              description={action.description}
              icon={action.icon}
              accessibilityLabel={`Acesso rápido: ${action.title}`}
              onPress={() => router.push(action.path)}
            />
          ))}
        </View>
      </View>
      {data && (
        <View
          style={{ flexDirection: width > 900 ? "row" : "column", gap: 24 }}
        >
          <Card style={{ flex: 1.6, gap: 22 }}>
            <View style={[s.between, { flexWrap: "wrap" }]}>
              <SectionTitle>Próximas atividades</SectionTitle>
              <Badge label="Sua agenda no campo" tone="neutral" />
            </View>
            {data.activities.map((activity, index) => (
              <View
                key={activity.id}
                style={[
                  s.row,
                  {
                    alignItems: "flex-start",
                    paddingTop: index ? 18 : 0,
                    borderTopWidth: index ? 1 : 0,
                    borderColor: c.border,
                  },
                ]}
              >
                <View style={s.iconBox}>
                  <Icon
                    name={
                      activity.kind === "attention"
                        ? "leaf-outline"
                        : "calendar-outline"
                    }
                    size={21}
                  />
                </View>
                <View style={{ flex: 1, gap: 5 }}>
                  <Text style={s.label}>{activity.title}</Text>
                  <Text style={s.small}>{activity.plot}</Text>
                  <Text
                    style={[
                      s.small,
                      {
                        color:
                          activity.kind === "attention" ? c.warning : c.primary,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {activity.scheduledLabel}
                  </Text>
                </View>
                <Icon name="chevron-forward" size={16} color={c.muted} />
              </View>
            ))}
            <AppButton
              title="Ver atividades"
              variant="secondary"
              onPress={() => router.push("/fazenda/atividades")}
            />
          </Card>
          <Card
            style={{
              flex: 1,
              backgroundColor: c.primaryDark,
              gap: 20,
              justifyContent: "center",
            }}
          >
            <Icon name="sunny-outline" color={c.accent} size={32} />
            <Text
              style={{
                color: c.surface,
                fontSize: 25,
                lineHeight: 33,
                fontWeight: "600",
              }}
            >
              Um bom dia começa com um bom planejamento.
            </Text>
            <Text style={{ color: c.accent, fontSize: 15, lineHeight: 24 }}>
              Acompanhe sua propriedade, organize as atividades e dê o próximo
              passo com mais clareza.
            </Text>
            <AppButton
              title="Cuidar da minha fazenda"
              variant="secondary"
              onPress={() => router.push("/fazenda")}
            />
          </Card>
        </View>
      )}
    </Screen>
  );
}
