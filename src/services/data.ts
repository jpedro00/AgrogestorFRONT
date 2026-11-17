import { canAccess } from "../auth/permissions";
import { properties, alerts } from "../mocks/properties";
import { activities, summary, adminSummary } from "../mocks/dashboard";
import { opportunities } from "../mocks/opportunities";
import { harvests, herds } from "../mocks/production";
import { negotiations, negotiationStatuses } from "../mocks/negotiations";
import type { User } from "../types/domain";
export const PropertyService = {
  async selected(user: User) {
    return canAccess(user, "farm")
      ? (properties.find((p) => user.propertyIds.includes(p.id)) ?? null)
      : null;
  },
};
export const DashboardService = {
  async get(user: User) {
    const property = await PropertyService.selected(user);
    if (!property) return null;
    return {
      property,
      summary: { ...summary },
      activities: activities.map((a) => ({ ...a })),
      alerts: alerts.filter((a) => a.propertyId === property.id),
    };
  },
  async admin(user: User) {
    if (!canAccess(user, "admin")) throw new Error("Acesso restrito.");
    return adminSummary.map((s) => ({ ...s }));
  },
};
export const MarketplaceService = {
  async list() {
    return opportunities.map((o) => ({ ...o }));
  },
  async get(id: string) {
    return opportunities.find((o) => o.id === id) ?? null;
  },
};
export const ProductionService = {
  async list(user: User) {
    const property = await PropertyService.selected(user);
    return {
      harvests: harvests
        .filter((item) => item.propertyId === property?.id)
        .map((item) => ({ ...item })),
      herds: herds
        .filter((item) => item.propertyId === property?.id)
        .map((item) => ({ ...item })),
    };
  },
};
export const NegotiationService = {
  async list(user: User) {
    return canAccess(user, "negotiations")
      ? negotiations
          .filter((n) => n.participantIds.includes(user.id))
          .map((n) => ({ ...n }))
      : [];
  },
  statuses: negotiationStatuses,
};
