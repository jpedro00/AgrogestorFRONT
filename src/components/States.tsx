import { ActivityIndicator, Text, View } from "react-native";
import { AppButton, Card, Icon, s, type IconName } from "./ui";
import { colors as c } from "../theme";
export function LoadingState() {
  return (
    <View
      style={{ padding: 48, gap: 16, alignItems: "center" }}
      accessibilityRole="progressbar"
      accessibilityLabel="Carregando"
    >
      <ActivityIndicator color={c.primary} />
      <Text style={s.body}>Preparando tudo para você…</Text>
    </View>
  );
}
export function EmptyState({
  title = "Ainda não há itens por aqui",
  description = "Quando houver novidades, elas aparecerão aqui.",
  icon = "leaf-outline",
  onBack,
}: {
  title?: string;
  description?: string;
  icon?: IconName;
  onBack?: () => void;
}) {
  return (
    <Card style={{ alignItems: "center", gap: 16, paddingVertical: 40 }}>
      <Icon name={icon} size={34} />
      <Text
        accessibilityRole="header"
        style={[s.sectionTitle, { textAlign: "center" }]}
      >
        {title}
      </Text>
      <Text style={[s.body, { textAlign: "center", maxWidth: 460 }]}>
        {description}
      </Text>
      {onBack && (
        <AppButton
          title="Voltar"
          variant="secondary"
          icon="arrow-back"
          onPress={onBack}
        />
      )}
    </Card>
  );
}
export function ErrorState({
  message = "Não foi possível concluir agora. Tente novamente.",
  retry,
}: {
  message?: string;
  retry?: () => void;
}) {
  return (
    <Card style={{ gap: 12, backgroundColor: c.dangerSoft }}>
      <Text
        accessibilityRole="alert"
        style={{ color: c.danger, lineHeight: 22 }}
      >
        {message}
      </Text>
      {retry && (
        <AppButton
          title="Tentar novamente"
          variant="secondary"
          onPress={retry}
        />
      )}
    </Card>
  );
}
export function RestrictedState({ onBack }: { onBack: () => void }) {
  return (
    <EmptyState
      title="Acesso restrito"
      description="Seu perfil não tem acesso a esta área. Você pode continuar nas áreas disponíveis para sua conta."
      icon="lock-closed-outline"
      onBack={onBack}
    />
  );
}
