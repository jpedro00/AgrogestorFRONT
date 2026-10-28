import { useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { Redirect, router } from "expo-router";
import { Screen } from "../components/Layout";
import { AppButton, AppInput, Badge, Card, Heading, s } from "../components/ui";
import { ErrorState, LoadingState } from "../components/States";
import { RuralArt } from "../components/RuralArt";
import { useAuth } from "../auth/AuthContext";
import { entryRoute } from "../auth/permissions";
import { supabase } from "../services/supabase";
import { validateRegistration } from "../services/registration";

export default function RegisterScreen() {
  const { width } = useWindowDimensions();
  const { user, loading, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
      const input = { name, email, password, confirmation };
      validateRegistration(input);
      const result = await register(input);
      setPassword("");
      setConfirmation("");
      if (result.user) router.replace(entryRoute(result.user));
      else setSubmitted(true);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível criar sua conta. Tente novamente.",
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
              eyebrow="SEU CAMPO, MAIS PERTO"
              subtitle="Crie sua conta para começar sua jornada no AgroGestor."
            >
              Um novo começo para sua gestão.
            </Heading>
            <View style={{ height: 310, borderRadius: 20, overflow: "hidden" }}>
              <RuralArt />
            </View>
            <Text style={s.body}>
              Sua conta é pessoal. O acesso a propriedades e equipes será
              concedido separadamente.
            </Text>
          </View>
        )}
        <Card
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 480,
            gap: 20,
            padding: width < 500 ? 22 : 32,
          }}
        >
          {submitted ? (
            <>
              <Badge label="VERIFIQUE SEU E-MAIL" />
              <Heading subtitle="Se o endereço estiver apto a receber o cadastro, você receberá uma mensagem de confirmação. Abra o link no e-mail e depois entre com sua senha.">
                Confira sua caixa de entrada
              </Heading>
              <Text style={s.body}>{email.trim().toLowerCase()}</Text>
              <Text style={s.small}>
                Verifique também a pasta de spam. Se já possui uma conta, use a
                opção de entrar.
              </Text>
              <AppButton
                title="Ir para o login"
                onPress={() => router.replace("/login")}
              />
            </>
          ) : (
            <>
              <Heading subtitle="Preencha seus dados para começar.">
                Criar sua conta
              </Heading>
              {!supabase && (
                <Badge
                  label="CADASTRO AGUARDANDO CONEXÃO COM O BANCO"
                  tone="warning"
                />
              )}
              <AppInput
                label="Nome"
                value={name}
                onChangeText={setName}
                placeholder="Como podemos chamar você?"
                autoComplete="name"
                textContentType="name"
                maxLength={120}
                editable={!busy}
              />
              <AppInput
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                placeholder="voce@exemplo.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!busy}
              />
              <AppInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                placeholder="Pelo menos 8 caracteres"
                secureTextEntry={!visible}
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!busy}
              />
              <AppInput
                label="Confirmar senha"
                value={confirmation}
                onChangeText={setConfirmation}
                placeholder="Repita sua senha"
                secureTextEntry={!visible}
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!busy}
                onSubmitEditing={() => void submit()}
              />
              <AppButton
                title={visible ? "Ocultar senhas" : "Mostrar senhas"}
                variant="ghost"
                onPress={() => setVisible(!visible)}
                disabled={busy}
              />
              {!!error && <ErrorState message={error} />}
              <AppButton
                title="Criar conta"
                loadingLabel="Criando conta…"
                loading={busy}
                onPress={() => void submit()}
                icon="person-add-outline"
              />
              <Text style={s.small}>
                Podemos solicitar a confirmação do seu e-mail antes do primeiro
                acesso.
              </Text>
              <AppButton
                title="Já tenho conta. Entrar"
                variant="secondary"
                disabled={busy}
                onPress={() => router.replace("/login")}
              />
            </>
          )}
          <AppButton
            title="Voltar à página inicial"
            variant="ghost"
            disabled={busy}
            onPress={() => router.replace("/")}
          />
        </Card>
      </View>
    </Screen>
  );
}
