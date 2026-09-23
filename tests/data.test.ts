import { describe, expect, it } from "vitest";
import { users } from "../src/mocks/users";
import {
  DashboardService,
  MarketplaceService,
  NegotiationService,
  PropertyService,
} from "../src/services/data";
describe("separação dos contextos", () => {
  it.each(["comprador", "parceiro"])(
    "%s não recebe indicadores nem propriedade privada",
    async (role) => {
      const user = users.find((u) => u.role === role)!;
      expect(await DashboardService.get(user)).toBeNull();
      expect(await PropertyService.selected(user)).toBeNull();
    },
  );
  it("propriedade sem autorização não retorna dashboard", async () => {
    const owner = users.find((u) => u.role === "proprietario_vendedor")!;
    expect(
      await DashboardService.get({ ...owner, propertyIds: [] }),
    ).toBeNull();
  });
  it("mercado público não inclui identificadores privados da fazenda", async () => {
    const list = await MarketplaceService.list();
    expect(list).toHaveLength(4);
    expect(JSON.stringify(list)).not.toMatch(
      /santa-clara|propertyIds|criticalAlerts/,
    );
  });
  it("parceiro recebe somente negociação da qual participa", async () => {
    const partner = users.find((u) => u.role === "parceiro")!;
    const list = await NegotiationService.list(partner);
    expect(list.map((n) => n.id)).toEqual(["n2"]);
  });
  it("serviço administrativo também recusa usuário comum", async () => {
    await expect(
      DashboardService.admin(users.find((u) => u.role === "comprador")!),
    ).rejects.toThrow("Acesso restrito");
  });
});
