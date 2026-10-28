import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";

// Opt-in: credentials for a disposable, confirmed test account outside the repo.
const accountPath = process.env.AGROGESTOR_TEST_ACCOUNT;
const account: { email: string; password: string } | null = accountPath
  ? JSON.parse(readFileSync(accountPath, "utf8"))
  : null;
test.skip(
  !account,
  "Defina AGROGESTOR_TEST_ACCOUNT com arquivo da conta temporária.",
);

test("Supabase real: login, perfil, restauração, guard e logout", async ({
  page,
}) => {
  if (!account) return;
  await page.goto("/login");
  await page.getByLabel("E-mail", { exact: true }).fill(account.email);
  await page.getByLabel("Senha", { exact: true }).fill(account.password);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(/\/usuario$/);
  await expect(
    page.getByText("Verificação AgroGestor", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Verificação AgroGestor", { exact: true }),
  ).toBeVisible();
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Acesso restrito" }),
  ).toBeVisible();
  await page.goto("/perfil");
  await expect(page.getByText("Conta ativa", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Sair da conta", exact: true })
    .click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/usuario");
  await expect(page).toHaveURL(/\/login/);
});

test("cadastro: resposta de confirmação da API não libera área protegida", async ({
  page,
}) => {
  // Intercepts signup only: exercises the SDK + UI without sending real email.
  await page.route("**/auth/v1/signup*", async (route) => {
    expect(route.request().postDataJSON()).toMatchObject({
      email: "teste@example.com",
      data: { name: "Maria Silva" },
    });
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "604a1398-40c9-4310-8a4c-5712d157b9cb",
        email: "teste@example.com",
        user_metadata: { name: "Maria Silva" },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      }),
    });
  });
  await page.goto("/cadastro");
  await page.getByLabel("Nome", { exact: true }).fill("Maria Silva");
  await page.getByLabel("E-mail", { exact: true }).fill("teste@example.com");
  await page.getByLabel("Senha", { exact: true }).fill("SenhaTeste123!");
  await page
    .getByLabel("Confirmar senha", { exact: true })
    .fill("SenhaTeste123!");
  await page.getByRole("button", { name: "Criar conta", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Confira sua caixa de entrada" }),
  ).toBeVisible();
  await page.goto("/usuario");
  await expect(page).toHaveURL(/\/login/);
});
