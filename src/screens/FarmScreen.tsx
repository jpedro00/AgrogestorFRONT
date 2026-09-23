import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "../components/Layout";
import { Badge, Heading, ModuleCard, s } from "../components/ui";
import { EmptyState, RestrictedState } from "../components/States";
import { farmModules } from "../navigation/modules";
import { useAuth } from "../auth/AuthContext";
import { canAccess } from "../auth/permissions";
export default function FarmScreen() {
  const { user } = useAuth();
  return (
    <Screen userNav>
      <Heading
        eyebrow="GESTÃO RURAL"
        subtitle="O essencial para acompanhar sua propriedade, em um só lugar."
      >
        Minha Fazenda
      </Heading>
      {!canAccess(user, "farm") ? (
        <RestrictedState onBack={() => router.replace("/home")} />
      ) : (
        <>
          <Badge label="Dados privados da propriedade" />
          <View style={s.grid}>
            {farmModules
              .filter((item) => canAccess(user, item.permission))
              .map((item) => (
                <ModuleCard
                  key={item.id}
                  {...item}
                  onPress={() => router.push(`/fazenda/${item.id}`)}
                />
              ))}
          </View>
        </>
      )}
    </Screen>
  );
}
export function FarmModuleScreen() {
  const { module } = useLocalSearchParams<{ module: string }>();
  const { user } = useAuth();
  const item = farmModules.find((m) => m.id === module);
  return (
    <Screen userNav>
      {!item ? (
        <EmptyState
          title="Área não encontrada"
          onBack={() => router.replace("/fazenda")}
        />
      ) : !canAccess(user, item.permission) ? (
        <RestrictedState onBack={() => router.replace("/fazenda")} />
      ) : (
        <>
          <Heading eyebrow="MINHA FAZENDA" subtitle={item.description}>
            {item.title}
          </Heading>
          <EmptyState
            title="Protótipo em desenvolvimento"
            description="Esta área está preparada para a próxima etapa. Por enquanto, nenhum registro será criado ou alterado."
            icon={item.icon}
            onBack={() => router.replace("/fazenda")}
          />
        </>
      )}
    </Screen>
  );
}
