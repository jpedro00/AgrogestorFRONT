import { test, expect } from "@playwright/test";

test("produtor explora safras, culturas e raças com detalhes", async ({
  page,
}) => {
  await page.goto("/login");
  await page
    .getByLabel("E-mail", { exact: true })
    .fill("usuario@agrogestor.demo");
  await page
    .getByLabel("Senha de demonstração", { exact: true })
    .fill("Demo@123");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page
    .getByRole("button", { name: "Entrar no AgroGestor", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Culturas e Safras", exact: true })
    .click();
  await expect(page.getByRole("button", { name: /^Ver cultura:/ })).toHaveCount(
    7,
  );
  await page
    .getByRole("button", { name: "Safra: 2025/26", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Cultura: Café", exact: true })
    .click();
  await expect(page.getByRole("button", { name: /^Ver cultura:/ })).toHaveCount(
    1,
  );
  await page
    .getByRole("button", { name: "Ver cultura: Café", exact: true })
    .click();
  await expect(
    page.getByText("Produção demonstrativa", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Fechar detalhes", exact: true })
    .click();
  await page.getByRole("button", { name: "Voltar", exact: true }).click();
  await page
    .getByRole("button", { name: "Rebanhos e Raças", exact: true })
    .click();
  await expect(page.getByRole("button", { name: /^Ver lote:/ })).toHaveCount(7);
  await page
    .getByRole("button", { name: "Finalidade: Leite", exact: true })
    .click();
  await expect(page.getByRole("button", { name: /^Ver lote:/ })).toHaveCount(2);
  await page
    .getByRole("button", { name: "Raça: Girolando", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Ver lote: Girolando", exact: true })
    .click();
  await expect(
    page.getByRole("dialog").getByText("Setor Leiteiro 01", { exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Fechar detalhes", exact: true }),
  ).toHaveCount(0);
});

test("mercado filtra raças e safras com gráficos indisponíveis", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: function (
        this: HTMLCanvasElement,
        ...args: Parameters<typeof original>
      ) {
        if (String(args[0]).startsWith("webgl")) return null;
        return original.apply(this, args);
      },
    });
  });
  await page.goto("/mercado");
  await page.getByRole("button", { name: "Gado", exact: true }).click();
  await page.getByRole("button", { name: "Raça: Angus", exact: true }).click();
  await expect(
    page.getByRole("button", { name: /^Ver oportunidade:/ }),
  ).toHaveCount(1);
  await page
    .getByRole("button", { name: "Finalidade: Leite", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Nenhuma oportunidade encontrada",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Produção agrícola", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Safra: 2025/26", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: /^Ver oportunidade:/ }),
  ).toHaveCount(1);
  await page
    .getByRole("button", {
      name: "Ver oportunidade: Café arábica · Lote selecionado",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/\/oportunidade\/cafe$/);
  await expect(
    page.getByRole("button", { name: /^Ver oportunidade:/ }),
  ).toHaveCount(0);
  await expect(
    page.getByText("Safra 2025/26", { exact: true }).filter({ visible: true }),
  ).toBeVisible();
});
