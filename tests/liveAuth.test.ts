import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { LiveAuthService } from "../src/services/liveAuth";

const input = {
  name: " Maria Silva ",
  email: " MARIA@example.com ",
  password: "Segura123!",
  confirmation: "Segura123!",
};
const user = {
  id: "b73633ab-bcc6-4e80-bb53-a7b10fb9e41a",
  email: "maria@example.com",
  aud: "authenticated",
  created_at: new Date().toISOString(),
  user_metadata: { name: "Maria Silva" },
  app_metadata: {},
};
function service(response: object, status = 200) {
  const requests: { url: string; body: unknown }[] = [];
  const client = createClient("https://test.supabase.co", "public-test-key", {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: async (url, options) => {
        requests.push({
          url: String(url),
          body: options?.body ? JSON.parse(String(options.body)) : null,
        });
        return new Response(JSON.stringify(response), {
          status,
          headers: {
            "Content-Type": "application/json",
            "X-Supabase-Api-Version": "2024-01-01",
          },
        });
      },
    },
  });
  return { auth: new LiveAuthService(client), requests };
}
describe("integração de autenticação via SDK", () => {
  it("envia dados normalizados e aguarda confirmação sem liberar sessão", async () => {
    const { auth, requests } = service(user);
    expect(await auth.register(input)).toEqual({ user: null });
    expect(requests[0]?.url).toContain("/auth/v1/signup");
    expect(requests[0]?.body).toMatchObject({
      email: "maria@example.com",
      password: "Segura123!",
      data: { name: "Maria Silva" },
    });
  });
  it("não envia requisição quando senhas divergem", async () => {
    const { auth, requests } = service(user);
    await expect(
      auth.register({ ...input, confirmation: "outra" }),
    ).rejects.toThrow("coincidem");
    expect(requests).toHaveLength(0);
  });
  it("converte erros de login em mensagem acessível", async () => {
    const { auth } = service(
      { code: "invalid_credentials", msg: "Invalid login credentials" },
      400,
    );
    await expect(auth.login(input.email, "errada")).rejects.toThrow(
      "E-mail ou senha incorretos",
    );
  });
  it("não apresenta sucesso quando o servidor recusa cadastro", async () => {
    const { auth } = service(
      { code: "signup_disabled", msg: "Signups not allowed" },
      400,
    );
    await expect(auth.register(input)).rejects.toThrow(
      "temporariamente indisponíveis",
    );
  });
  it("restauração sem sessão não inventa usuário", async () => {
    const { auth, requests } = service(user);
    expect(await auth.restore()).toBeNull();
    expect(requests).toHaveLength(0);
  });
});
