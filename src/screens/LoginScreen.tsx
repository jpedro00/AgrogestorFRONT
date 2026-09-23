import { useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { Redirect, router } from "expo-router";
import { Screen } from "../components/Layout";
import { AppButton, AppInput, Badge, Card, Heading, s } from "../components/ui";
import { ErrorState, LoadingState } from "../components/States";
import { RuralArt } from "../components/RuralArt";
import { authService, useAuth } from "../auth/AuthContext";
import { entryRoute, roleLabels } from "../auth/permissions";
import { colors as c } from "../theme";
export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const { user, login, loading, error: sessionError, restore } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (loading)
    return (
      <Screen publicArea>
        <LoadingState />
      </Screen>
    );
  if (user) return <Redirect href={entryRoute(user)} />;
  async function submit() {
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      const result = await login(email, password);
      setPassword("");
      router.replace(entryRoute(result));
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível entrar agora. Tente novamente.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen publicArea>
      <View
        style={{
          flexDirection: width > 850 ? "row" : "column",
          gap: 48,
          alignItems: "center",
          maxWidth: 1000,
          width: "100%",
          alignSelf: "center",
          paddingVertical: 20,
        }}
      >
        {width > 850 && (
          <View style={{ flex: 1, gap: 24 }}>
            <Heading
              eyebrow="BEM-VINDO AO AGROGESTOR"
              subtitle="Seu próximo passo no campo começa aqui."
            >
              Bom ter você por aqui.
            </Heading>
            <View style={{ height: 310, borderRadius: 20, overflow: "hidden" }}>
              <RuralArt />
            </View>
            <Text style={s.body}>
              Gestão rural e oportunidades, cada uma com seu espaço.
            </Text>
          </View>
        )}
        <Card
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 480,
            gap: 24,
            padding: width < 500 ? 22 : 32,
          }}
        >
          <Heading subtitle="Acesse sua conta de demonstração.">
            Entrar no AgroGestor
          </Heading>
          <Badge label="AMBIENTE DE DEMONSTRAÇÃO" tone="warning" />
          <AppInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="usuario@agrogestor.demo"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            editable={!busy}
          />
          <AppInput
            label="Senha de demonstração"
            value={password}
            onChangeText={setPassword}
            placeholder="Digite a senha demo"
            secureTextEntry
            autoComplete="off"
            editable={!busy}
            onSubmitEditing={() => void submit()}
          />
          {!!error && <ErrorState message={error} />}
          {sessionError && (
            <ErrorState message={sessionError} retry={() => void restore()} />
          )}
          <AppButton
            title="Entrar"
            loading={busy}
            onPress={() => void submit()}
            icon="arrow-forward"
          />
          <View
            style={{
              gap: 10,
              borderTopWidth: 1,
              borderColor: c.border,
              paddingTop: 20,
            }}
          >
            <Text style={[s.body, { fontWeight: "600", color: c.text }]}>
              Experimente um perfil
            </Text>
            <Text style={s.small}>
              Senha pública de demonstração: Demo@123{"\n"}Não utilize
              credenciais reais. Este login não é seguro.
            </Text>
            {authService.listDemoAccounts().map((account) => (
              <AppButton
                key={account.email}
                title={roleLabels[account.role]}
                variant="secondary"
                onPress={() => {
                  setEmail(account.email);
                  setPassword("Demo@123");
                  setError("");
                }}
                disabled={busy}
              />
            ))}
          </View>
          <AppButton
            title="Voltar à página inicial"
            variant="ghost"
            onPress={() => router.replace("/")}
          />
        </Card>
      </View>
    </Screen>
  );
}
