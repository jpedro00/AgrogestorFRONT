import { test, expect } from "@playwright/test";

test("cadastro: navegação, validação e layout responsivo", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page
    .getByRole("button", { name: "Criar minha conta", exact: true })
    .click();
  await expect(page).toHaveURL(/\/cadastro$/);
  await page.screenshot({
    path: `docs/screenshots/${testInfo.project.name}-cadastro.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Criar conta", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Informe seu nome");
  await page.getByLabel("Nome", { exact: true }).fill("Maria Silva");
  await page.getByLabel("E-mail", { exact: true }).fill("invalido");
  await page.getByRole("button", { name: "Criar conta", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("e-mail válido");
  await page.getByLabel("E-mail", { exact: true }).fill("maria@example.com");
  await page.getByLabel("Senha", { exact: true }).fill("Segura123!");
  await page.getByLabel("Confirmar senha", { exact: true }).fill("outra");
  await page.getByRole("button", { name: "Criar conta", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("não coincidem");
  await expect(page.getByLabel("Senha", { exact: true })).toHaveJSProperty(
    "type",
    "password",
  );
  await page.getByRole("button", { name: "Mostrar senhas" }).click();
  await expect(page.getByLabel("Senha", { exact: true })).toHaveJSProperty(
    "type",
    "text",
  );
  await page.getByRole("button", { name: "Ocultar senhas" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Já tenho conta. Entrar" }).click();
  await expect(page).toHaveURL(/\/login$/);
  expect(errors).toEqual([]);
});
