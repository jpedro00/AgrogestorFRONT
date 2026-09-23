import { useCallback, useState } from "react";
import { Switch, Text, View } from "react-native";
import { useAuth } from "../auth/AuthContext";
import { Screen } from "../components/Layout";
import {
  AccountDetail,
  Avatar,
  LogoutButton,
  RoleBadge,
} from "../components/Account";
import { AppButton, Card, Heading, SectionTitle, s } from "../components/ui";
import { useExperience } from "../contexts/ExperienceContext";
import { PropertyService } from "../services/data";
import { useResource } from "../hooks/useResource";
import { ErrorState, LoadingState } from "../components/States";
import { ConnectivityIndicator } from "../components/ConnectivityIndicator";
import { colors as c } from "../theme";
export default function ProfileScreen() {
  const { user } = useAuth();
  const experience = useExperience();
  const [help, setHelp] = useState(false);
  const resource = useResource(
    useCallback(
      () => (user ? PropertyService.selected(user) : Promise.resolve(null)),
      [user],
    ),
  );
  if (!user) return null;
  return (
    <Screen userNav>
      <Heading subtitle="Seu espaço, do seu jeito.">Perfil e Ajuda</Heading>
      <View style={s.grid}>
        <Card style={{ flex: 1, minWidth: 260, gap: 22 }}>
          <View style={s.row}>
            <Avatar user={user} />
            <View style={{ flex: 1, gap: 8 }}>
              <Text style={s.sectionTitle}>{user.name}</Text>
              <RoleBadge role={user.role} />
            </View>
          </View>
          <AccountDetail label="E-mail" value={user.email} />
          {resource.loading ? (
            <LoadingState />
          ) : resource.error ? (
            <ErrorState retry={resource.retry} />
          ) : (
            <AccountDetail
              label="Propriedade"
              value={resource.data?.name ?? "Sem propriedade vinculada"}
            />
          )}
          <AccountDetail label="Conta" value="Demonstração · ativa" />
          <LogoutButton />
        </Card>
        <Card style={{ flex: 1, minWidth: 260, gap: 24 }}>
          <SectionTitle>Como você prefere usar?</SectionTitle>
          {[
            {
              title: "Modo Simplificado",
              body: "Mostra só os indicadores essenciais na Home.",
              value: experience.simplified,
              set: experience.setSimplified,
            },
            {
              title: "Modo Assistido",
              body: "Exibe uma orientação para usar o acesso rápido.",
              value: experience.assisted,
              set: experience.setAssisted,
            },
          ].map((item) => (
            <View key={item.title} style={s.row}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={s.label}>{item.title}</Text>
                <Text style={s.body}>{item.body}</Text>
              </View>
              <Switch
                accessibilityLabel={item.title}
                value={item.value}
                onValueChange={item.set}
                trackColor={{ false: c.border, true: c.primary }}
              />
            </View>
          ))}
          <Text style={s.small}>
            Controles do protótipo. Preferências válidas enquanto o aplicativo
            estiver aberto.
          </Text>
          <AppButton
            title="Ajuda humana"
            icon="help-buoy-outline"
            variant="secondary"
            onPress={() => setHelp((v) => !v)}
          />
          {help && (
            <Text accessibilityRole="alert" style={s.body}>
              O atendimento humano estará disponível em uma próxima etapa. Para
              explorar agora, use a navegação abaixo. Nenhuma solicitação de
              suporte foi enviada.
            </Text>
          )}
        </Card>
      </View>
      <Card style={{ gap: 16 }}>
        <SectionTitle>Conectividade e sincronização</SectionTitle>
        <Text style={s.body}>
          A conexão é detectada no dispositivo. A sincronização real ainda não
          está disponível. Abaixo, um exemplo visual do estado pendente:
        </Text>
        <ConnectivityIndicator syncStatus="pending" />
      </Card>
    </Screen>
  );
}
