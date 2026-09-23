import { test, expect, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const consoleIssues = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const issues: string[] = [];
  consoleIssues.set(page, issues);
  page.on("pageerror", (error) => issues.push(error.message));
  page.on("console", (message) => {
    if (["warning", "error"].includes(message.type()))
      issues.push(message.text());
  });
});
test.afterEach(async ({ page }) => {
  expect(consoleIssues.get(page)).toEqual([]);
});
async function capture(page: Page, name: string) {
  await mkdir("docs/screenshots", { recursive: true });
  await page.screenshot({
    path: `docs/screenshots/${test.info().project.name}-${name}.png`,
  });
}

async function login(page: Page, role = "usuario") {
  await page.goto("/login");
  await page
    .getByLabel("E-mail", { exact: true })
    .fill(`${role}@agrogestor.demo`);
  await page
    .getByLabel("Senha de demonstração", { exact: true })
    .fill("Demo@123");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
}
test("visitante: landing, mercado, oportunidade e interação exigem login", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Explorar Mercado Rural", exact: true }),
  ).toBeVisible();
  await capture(page, "landing");
  await page
    .getByRole("button", { name: "Explorar Mercado Rural", exact: true })
    .click();
  await expect(page).toHaveURL(/\/mercado$/);
  await capture(page, "mercado");
  await page
    .getByRole("button", { name: "Ver oportunidade: Fazenda Boa Vista" })
    .click();
  await page
    .getByRole("button", { name: "Manifestar interesse", exact: true })
    .click();
  await expect(page).toHaveURL(/\/login/);
});
test("login inválido apresenta mensagem humana", async ({ page }) => {
  await page.goto("/login");
  await capture(page, "login");
  await page
    .getByLabel("E-mail", { exact: true })
    .fill("usuario@agrogestor.demo");
  await page
    .getByLabel("Senha de demonstração", { exact: true })
    .fill("errada");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(
    page.getByText("E-mail ou senha de demonstração incorretos."),
  ).toBeVisible();
});
test("usuário: entrada, Home, quatro áreas, sessão e logout", async ({
  page,
}) => {
  await login(page);
  await expect(page).toHaveURL(/\/usuario$/);
  await capture(page, "usuario");
  await page
    .getByRole("button", { name: "Entrar no AgroGestor", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Bom dia, produtor!" }),
  ).toBeVisible();
  await capture(page, "home");
  for (const [label, url, title] of [
    ["Minha Fazenda", "/fazenda", "Minha Fazenda"],
    ["Mercado Rural", "/mercado-rural", "Mercado Rural"],
    ["Meus Negócios", "/negocios", "Meus Negócios"],
    ["Perfil e Ajuda", "/perfil", "Perfil e Ajuda"],
  ]) {
    await page.getByRole("button", { name: `Acesso rápido: ${label}` }).click();
    await expect(page).toHaveURL(new RegExp(`${url}$`));
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Início", exact: true }).click();
  }
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Bom dia, produtor!" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Acesso rápido: Perfil e Ajuda" })
    .click();
  await page
    .getByRole("button", { name: "Sair da conta", exact: true })
    .click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/home");
  await expect(page).toHaveURL(/\/login/);
});
test("guards: visitante e usuário comum não entram no admin", async ({
  page,
}) => {
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/login/);
  await login(page);
  await page.goto("/admin/dashboard");
  await expect(
    page.getByRole("heading", { name: "Acesso restrito" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Dashboard Admin" }),
  ).toHaveCount(0);
});
test("admin: painel, dashboard e menu navegável", async ({ page }) => {
  await login(page, "admin");
  await expect(page).toHaveURL(/\/admin$/);
  await capture(page, "painel-admin");
  await page.getByRole("button", { name: "Abrir Dashboard Admin" }).click();
  await expect(
    page.getByRole("heading", { name: "Dashboard Admin" }),
  ).toBeVisible();
  await capture(page, "dashboard-admin");
  if (test.info().project.name === "mobile")
    await page
      .getByRole("button", { name: "Abrir menu administrativo" })
      .click();
  await page
    .getByRole("button", { name: "Usuários e Permissões", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Usuários e Permissões" }),
  ).toBeVisible();
  await expect(
    page.getByText("Protótipo em desenvolvimento", { exact: true }),
  ).toBeVisible();
});
test("layout não transborda e console não apresenta erros", async ({
  page,
}) => {
  const issues: string[] = [];
  page.on("pageerror", (error) => issues.push(error.message));
  page.on("console", (message) => {
    if (["warning", "error"].includes(message.type()))
      issues.push(message.text());
  });
  for (const route of ["/", "/mercado", "/login"]) {
    await page.goto(route);
    await expect(page.getByTestId("screen")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  expect(issues).toEqual([]);
});
