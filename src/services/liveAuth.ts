import type { SupabaseClient } from "@supabase/supabase-js";
import {
  toAppUser,
  validateRegistration,
  type RegistrationInput,
} from "./registration";

function authError(error: { code?: string; message: string }): Error {
  const messages: Record<string, string> = {
    invalid_credentials: "E-mail ou senha incorretos.",
    email_not_confirmed: "Confirme seu e-mail antes de entrar.",
    user_already_exists:
      "Não foi possível criar a conta. Se já possui cadastro, entre com seu e-mail.",
    email_exists:
      "Não foi possível criar a conta. Se já possui cadastro, entre com seu e-mail.",
    weak_password:
      "Escolha uma senha mais forte, com letras, números e símbolos.",
    over_email_send_rate_limit:
      "Muitas solicitações. Aguarde alguns minutos antes de tentar novamente.",
    over_request_rate_limit:
      "Muitas solicitações. Aguarde alguns minutos antes de tentar novamente.",
    signup_disabled: "Novos cadastros estão temporariamente indisponíveis.",
  };
  return new Error(
    messages[error.code ?? ""] ??
      "Não foi possível acessar sua conta agora. Verifique sua conexão e tente novamente.",
  );
}

export class LiveAuthService {
  constructor(private client: SupabaseClient) {}
  async register(input: RegistrationInput, emailRedirectTo?: string) {
    const { name, email, password } = validateRegistration(input);
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        ...(emailRedirectTo ? { emailRedirectTo } : {}),
      },
    });
    if (error) throw authError(error);
    return { user: data.session && data.user ? toAppUser(data.user) : null };
  }
  async login(email: string, password: string) {
    if (!email.trim() || !password)
      throw new Error("Informe seu e-mail e sua senha.");
    const { data, error } = await this.client.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw authError(error);
    if (!data.user) throw new Error("Não foi possível recuperar sua conta.");
    return toAppUser(data.user);
  }
  async restore() {
    const { data: sessionData, error: sessionError } =
      await this.client.auth.getSession();
    if (sessionError) throw authError(sessionError);
    if (!sessionData.session) return null;
    const { data, error } = await this.client.auth.getUser();
    if (error) throw authError(error);
    return data.user ? toAppUser(data.user) : null;
  }
  async logout() {
    const { error } = await this.client.auth.signOut();
    if (error) throw authError(error);
  }
  listDemoAccounts() {
    return [];
  }
}
