import { useCallback } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../auth/AuthContext";
import { PropertyService } from "../services/data";
import { useResource } from "../hooks/useResource";
import { Screen } from "../components/Layout";
import { AppButton, Card, Heading, s } from "../components/ui";
import {
  AccountDetail,
  Avatar,
  LogoutButton,
  RoleBadge,
} from "../components/Account";
import { LoadingState, ErrorState } from "../components/States";
export default function UserEntryScreen() {
  const { user } = useAuth();
  const resource = useResource(
    useCallback(
      () => (user ? PropertyService.selected(user) : Promise.resolve(null)),
      [user],
    ),
  );
  if (!user) return null;
  return (
    <Screen narrow>
      <Heading
        eyebrow="SEU ESPAÇO"
        subtitle="Vamos cuidar do que importa hoje?"
      >
        Olá, {user.name.split(" ")[0]}!
      </Heading>
      <Card style={{ gap: 24, padding: 28 }}>
        <View style={s.row}>
          <Avatar user={user} />
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={s.sectionTitle}>{user.name}</Text>
            <RoleBadge role={user.role} />
          </View>
        </View>
        {resource.loading ? (
          <LoadingState />
        ) : resource.error ? (
          <ErrorState retry={resource.retry} />
        ) : (
          <AccountDetail
            label="Propriedade selecionada"
            value={
              resource.data?.name ??
              "Nenhuma propriedade vinculada a este perfil"
            }
          />
        )}
        <AccountDetail
          label="Status da conta"
          value="Ativa · conta de demonstração"
        />
        <Text style={s.body}>
          Seu espaço para acompanhar a rotina e encontrar novas possibilidades
          no campo.
        </Text>
        <AppButton
          title="Entrar no AgroGestor"
          icon="arrow-forward"
          onPress={() => router.push("/home")}
        />
        <AppButton
          title="Meu perfil"
          variant="secondary"
          icon="person-outline"
          onPress={() => router.push("/perfil")}
        />
        {user.role === "administrador" && (
          <AppButton
            title="Painel Administrativo"
            variant="ghost"
            onPress={() => router.push("/admin")}
          />
        )}
      </Card>
      <LogoutButton />
    </Screen>
  );
}
