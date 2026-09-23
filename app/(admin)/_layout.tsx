import { Slot } from "expo-router";
import { RouteGuard } from "../../src/auth/RouteGuard";
export default function AdminLayout() {
  return (
    <RouteGuard permission="admin">
      <Slot />
    </RouteGuard>
  );
}
